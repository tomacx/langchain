import json
import os
import time
from functools import lru_cache
from typing import Any, Dict

import anyio
from fastapi import FastAPI, HTTPException, Request
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage

from physic.tools.agents.agent import AgentConstructionModule


app = FastAPI()

_GUIDE_MARKER = "[AGENTBENCH_FC_GUIDE]"


def _provider() -> str:
    return (os.environ.get("CDEM_LLM_PROVIDER") or "ollama").strip().lower()


@lru_cache(maxsize=8)
def _agent_backend(model_name: str) -> AgentConstructionModule:
    return AgentConstructionModule(
        tools=[],
        model_name=model_name,
        enable_preprocessing=False,
        vectorstore=None,
    )

def _tool_names(tools: Any) -> set[str]:
    if not isinstance(tools, list):
        return set()
    out: set[str] = set()
    for t in tools:
        if not isinstance(t, dict):
            continue
        fn = t.get("function")
        if isinstance(fn, dict) and isinstance(fn.get("name"), str):
            out.add(fn["name"])
    return out


def _inject_guidance(messages: list, tools: Any) -> list:
    if not isinstance(messages, list) or not messages:
        return messages
    for m in messages:
        if isinstance(m, dict) and m.get("role") == "system" and isinstance(m.get("content"), str) and _GUIDE_MARKER in m["content"]:
            return messages

    names = _tool_names(tools)
    if not names:
        return messages

    lines = [_GUIDE_MARKER, "You are a function-calling agent. Use tool_calls when tools are provided."]
    if "execute_sql" in names:
        lines.extend(
            [
                "For execute_sql:",
                "- Output exactly one tool call at a time when querying.",
                "- Use MySQL syntax.",
                "- Wrap table/column identifiers that contain spaces or hyphens in backticks.",
                "- Do not add trailing quotes. Prefer single quotes for string literals.",
            ]
        )
    if "bash_action" in names:
        lines.extend(
            [
                "For bash_action:",
                "- Put the command in the 'script' field. Keep it minimal and correct.",
            ]
        )

    sys_msg = {"role": "system", "content": "\n".join(lines)}
    return [sys_msg, *messages]


def _prune_messages(messages: list[dict], max_messages: int = 40, max_content_chars: int = 12000, max_tool_chars: int = 6000) -> list[dict]:
    if not isinstance(messages, list) or not messages:
        return messages
    systems: list[dict] = []
    rest: list[dict] = []
    for m in messages:
        if not isinstance(m, dict):
            continue
        role = (m.get("role") or "").strip()
        if role == "system":
            systems.append(m)
        else:
            rest.append(m)

    if len(rest) > max_messages:
        rest = rest[-max_messages:]

    out: list[dict] = []
    for m in (systems[:4] + rest):
        role = (m.get("role") or "").strip()
        content = m.get("content")
        if isinstance(content, str):
            limit = max_tool_chars if role == "tool" else max_content_chars
            if len(content) > limit:
                head = content[: int(limit * 0.6)]
                tail = content[-int(limit * 0.4) :]
                content = head + "\n...[truncated]...\n" + tail
            nm = dict(m)
            nm["content"] = content
            out.append(nm)
        else:
            out.append(m)
    return out


def _to_lc_messages(messages: list[dict]) -> list:
    out: list = []
    for m in messages:
        if not isinstance(m, dict):
            continue
        role = (m.get("role") or "").strip()
        content = m.get("content")
        if role == "system":
            out.append(SystemMessage(content=str(content or "")))
        elif role == "user":
            out.append(HumanMessage(content=str(content or "")))
        elif role == "assistant":
            tc_in = m.get("tool_calls")
            tc_out = []
            if isinstance(tc_in, list):
                for tc in tc_in:
                    if not isinstance(tc, dict):
                        continue
                    fn = tc.get("function") or {}
                    if not isinstance(fn, dict):
                        fn = {}
                    name = fn.get("name")
                    args_raw = fn.get("arguments")
                    args: dict = {}
                    if isinstance(args_raw, str) and args_raw.strip():
                        try:
                            args = json.loads(args_raw)
                        except Exception:
                            args = {}
                    tc_out.append(
                        {
                            "name": str(name or ""),
                            "args": args,
                            "id": str(tc.get("id") or ""),
                            "type": "tool_call",
                        }
                    )
            out.append(AIMessage(content=str(content or ""), tool_calls=tc_out or None))
        elif role == "tool":
            tool_call_id = m.get("tool_call_id") or m.get("tool_callId") or m.get("id") or ""
            out.append(ToolMessage(content=str(content or ""), tool_call_id=str(tool_call_id), name=m.get("name")))
    return out


def _to_openai_tool_calls(tool_calls: Any) -> list[dict]:
    out: list[dict] = []
    if not isinstance(tool_calls, list):
        return out
    for tc in tool_calls:
        if not isinstance(tc, dict):
            continue
        name = tc.get("name")
        args = tc.get("args") or {}
        try:
            args_s = json.dumps(args, ensure_ascii=False)
        except Exception:
            args_s = "{}"
        out.append(
            {
                "id": tc.get("id") or "",
                "type": "function",
                "function": {"name": str(name or ""), "arguments": args_s},
            }
        )
    return out


def _normalize_tool_choice(tool_choice: Any) -> Any:
    if tool_choice == "required":
        return "any"
    if tool_choice in (None, "auto"):
        return "auto"
    return tool_choice


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"ok": True, "provider": _provider()}


@app.post("/v1/chat/completions")
async def chat_completions(req: Request) -> Dict[str, Any]:
    try:
        payload = await req.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Invalid request body")

    model = (payload.get("model") or os.environ.get("CDEM_LLM_MODEL") or "llama3.1:latest").strip()
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        raise HTTPException(status_code=400, detail="Missing messages")

    tools = payload.get("tools")
    _ = payload.get("temperature")
    _ = payload.get("max_tokens") or payload.get("max_completion_tokens")
    tool_choice = payload.get("tool_choice")

    try:
        messages = _inject_guidance(messages, tools)
        messages = _prune_messages(messages)
        backend = _agent_backend(model)
        llm = backend.llm
        lc_messages = _to_lc_messages(messages)
        tool_choice_lc = _normalize_tool_choice(tool_choice)
        bound = llm
        if isinstance(tools, list) and tools:
            bound = llm.bind_tools(tools, tool_choice=tool_choice_lc)
        resp_msg = await anyio.to_thread.run_sync(lambda: bound.invoke(lc_messages))
        out_msg: dict = {"role": "assistant", "content": getattr(resp_msg, "content", "") or ""}
        tc = _to_openai_tool_calls(getattr(resp_msg, "tool_calls", None))
        if tc:
            out_msg["tool_calls"] = tc
            out_msg["content"] = ""
            finish_reason = "tool_calls"
        else:
            finish_reason = "stop"
        return {
            "id": "agentbench-fc-local",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": model,
            "choices": [{"index": 0, "message": out_msg, "finish_reason": finish_reason}],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
