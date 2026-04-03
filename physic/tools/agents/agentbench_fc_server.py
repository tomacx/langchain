import os
from functools import lru_cache
from typing import Any, Dict, Optional, Tuple

from fastapi import FastAPI, HTTPException, Request
from openai import OpenAI


app = FastAPI()

_GUIDE_MARKER = "[AGENTBENCH_FC_GUIDE]"


def _provider() -> str:
    return (os.environ.get("CDEM_LLM_PROVIDER") or "ollama").strip().lower()


def _resolve_openai_endpoint() -> Tuple[str, str]:
    provider = _provider()

    if provider == "ollama":
        return "http://localhost:11434/v1", "ollama"

    if provider == "bailian":
        base_url = (os.environ.get("CDEM_BAILIAN_BASE_URL") or "https://dashscope.aliyuncs.com/compatible-mode/v1").strip()
        api_key = (
            os.environ.get("CDEM_BAILIAN_API_KEY")
            or os.environ.get("DASHSCOPE_API_KEY")
            or os.environ.get("OPENAI_API_KEY")
            or ""
        ).strip()
        if not api_key:
            raise RuntimeError("Missing API key for bailian provider (CDEM_BAILIAN_API_KEY / DASHSCOPE_API_KEY / OPENAI_API_KEY).")
        return base_url, api_key

    base_url = (os.environ.get("OPENAI_BASE_URL") or "https://api.openai.com/v1").strip()
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY.")
    return base_url, api_key


@lru_cache(maxsize=8)
def _client(base_url: str, api_key: str) -> OpenAI:
    return OpenAI(base_url=base_url, api_key=api_key)

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
    temperature = payload.get("temperature")
    max_tokens = payload.get("max_tokens") or payload.get("max_completion_tokens")
    tool_choice = payload.get("tool_choice")

    try:
        messages = _inject_guidance(messages, tools)
        base_url, api_key = _resolve_openai_endpoint()
        cli = _client(base_url, api_key)
        resp = cli.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools if isinstance(tools, list) else None,
            temperature=temperature if isinstance(temperature, (int, float)) else None,
            max_tokens=max_tokens if isinstance(max_tokens, int) else None,
            tool_choice=tool_choice,
        )
        return resp.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
