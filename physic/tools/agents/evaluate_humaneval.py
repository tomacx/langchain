import argparse
import json
import multiprocessing as mp
import re
import traceback
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama
try:
    from langchain_openai import ChatOpenAI
except Exception:
    ChatOpenAI = None
try:
    from langchain.agents import AgentExecutor, create_tool_calling_agent
except Exception:
    AgentExecutor = None
    create_tool_calling_agent = None
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

try:
    from human_eval.data import read_problems
except ImportError:
    read_problems = None


def _extract_python_code(text: str) -> str:
    if "```" in text:
        pattern = r"```(?:python|py)?\s*\n(.*?)```"
        matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
        if matches:
            return matches[0].strip()
    return text.strip()


def _run_in_subprocess(full_code: str, test_code: str, queue: "mp.Queue") -> None:
    try:
        scope: Dict[str, Any] = {}
        exec(full_code, scope, scope)
        exec(test_code, scope, scope)
        queue.put({"ok": True, "error": ""})
    except Exception:
        queue.put({"ok": False, "error": traceback.format_exc()})


def _ensure_humaneval_jsonl(dataset_path: Path) -> Path:
    if dataset_path.exists():
        return dataset_path
    if read_problems is None:
        raise FileNotFoundError(f"找不到数据集文件且无法从 human-eval 生成: {dataset_path}")
    dataset_path.parent.mkdir(parents=True, exist_ok=True)
    problems = read_problems()
    with open(dataset_path, "w", encoding="utf-8") as f:
        for _, task in problems.items():
            f.write(json.dumps(task, ensure_ascii=False) + "\n")
    return dataset_path


def _build_llm(model_name: str):
    provider = (os.environ.get("CDEM_LLM_PROVIDER") or "bailian").strip().lower()
    if provider in {"ollama", "local"}:
        base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
        return ChatOllama(model=model_name, temperature=0.0, base_url=base_url, keep_alive="5m")
    if ChatOpenAI is None:
        raise ImportError("未安装 langchain-openai")
    api_key = (
        os.environ.get("CDEM_BAILIAN_API_KEY")
        or os.environ.get("DASHSCOPE_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
        or ""
    ).strip()
    base_url = (os.environ.get("CDEM_BAILIAN_BASE_URL") or "https://dashscope.aliyuncs.com/compatible-mode/v1").strip()
    if not api_key:
        raise ValueError("缺少百炼/千问 API Key：请设置环境变量 CDEM_BAILIAN_API_KEY（或 DASHSCOPE_API_KEY/OPENAI_API_KEY）。")
    return ChatOpenAI(model_name=model_name, api_key=api_key, base_url=base_url, temperature=0.0)


class SimpleExecutor:
    def __init__(self, llm, prompt):
        self.llm = llm
        self.prompt = prompt
    def invoke(self, inputs: Dict[str, Any]):
        msgs = self.prompt.format_messages(input=inputs.get("input", ""), agent_scratchpad=[])
        resp = self.llm.invoke(msgs)
        content = getattr(resp, "content", "") or ""
        return {"output": content, "messages": msgs}


def _build_agent_executor(llm, tools: List[Any], system_prompt: str) -> Any:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )
    if create_tool_calling_agent and AgentExecutor:
        agent_runnable = create_tool_calling_agent(llm=llm, tools=tools, prompt=prompt)
        return AgentExecutor(agent=agent_runnable, tools=tools, verbose=False)
    return SimpleExecutor(llm=llm, prompt=prompt)


def _extract_agent_output(result: Any) -> str:
    if isinstance(result, dict):
        out = result.get("output")
        if isinstance(out, str) and out.strip():
            return out
        msgs = result.get("messages")
        if isinstance(msgs, list) and msgs:
            last = msgs[-1]
            content = getattr(last, "content", "") or ""
            if isinstance(content, str):
                return content
    return str(result or "")


def evaluate_humaneval(
    model_name: str,
    dataset_path: Optional[str] = None,
    max_tasks: Optional[int] = None,
    timeout_seconds: float = 8.0,
    use_agent: bool = True,
) -> Dict[str, Any]:
    sys_prompt = (
        "你是一个严谨的 Python 编程助手。"
        "给定函数签名与说明后，你只输出 Python 代码（不要 Markdown，不要解释）。"
        "输出应当是对函数体/缺失部分的补全，使其通过测试。"
    )

    dataset_file = Path(dataset_path) if dataset_path else (Path(__file__).parent / "data" / "HumanEval.jsonl")
    try:
        dataset_file = _ensure_humaneval_jsonl(dataset_file)
    except Exception as e:
        return {"ok": False, "error": str(e)}

    tasks: List[Dict[str, Any]] = []
    with open(dataset_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            tasks.append(json.loads(line))
            if max_tasks and len(tasks) >= max_tasks:
                break

    if not tasks:
        return {"ok": False, "error": "数据集任务列表为空"}

    llm = None
    executor: Optional[Any] = None
    if use_agent:
        if not (os.environ.get("CDEM_LLM_PROVIDER") or "").strip():
            os.environ["CDEM_LLM_PROVIDER"] = "ollama"
        try:
            llm = _build_llm(model_name=model_name)
            executor = _build_agent_executor(llm=llm, tools=[], system_prompt=sys_prompt)
        except Exception as e:
            return {"ok": False, "error": f"初始化智能体失败: {e}"}
    else:
        llm = ChatOllama(model=model_name, temperature=0.2, keep_alive="5m")

    passed = 0
    total = len(tasks)
    failures: List[Dict[str, Any]] = []

    for i, task in enumerate(tasks, 1):
        task_id = task.get("task_id", f"T{i}")
        prompt = task.get("prompt", "")
        test_code = task.get("test", "")

        print(f"[{i}/{total}] Evaluating {task_id}...")

        completion = ""
        try:
            if use_agent:
                assert executor is not None
                result = executor.invoke({"input": prompt + "\n\n只输出 Python 代码补全："})
                completion = _extract_agent_output(result)
            else:
                msg = [
                    SystemMessage(content=sys_prompt),
                    HumanMessage(content=prompt + "\n\n只输出 Python 代码补全："),
                ]
                resp = llm.invoke(msg)
                completion = getattr(resp, "content", "") or ""
        except Exception as e:
            failures.append({"task_id": task_id, "error": f"调用失败: {e}"})
            continue

        completion_code = _extract_python_code(completion)
        full_code = prompt + "\n" + completion_code + "\n"

        q: "mp.Queue" = mp.Queue()
        p = mp.Process(target=_run_in_subprocess, args=(full_code, test_code, q))
        p.start()
        p.join(timeout_seconds)
        if p.is_alive():
            p.terminate()
            p.join(1)
            failures.append({"task_id": task_id, "error": "超时"})
            continue

        try:
            result = q.get_nowait()
        except Exception:
            failures.append({"task_id": task_id, "error": "未知错误：无返回"})
            continue

        if result.get("ok"):
            passed += 1
        else:
            failures.append({"task_id": task_id, "error": result.get("error", "")[:4000]})

    return {
        "ok": True,
        "dataset": str(dataset_file),
        "model": model_name,
        "use_agent": use_agent,
        "total": total,
        "passed": passed,
        "pass_rate": (passed / total) if total else 0.0,
        "failures": failures[:20],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", help="HumanEval.jsonl 的路径 (可选)")
    parser.add_argument("--model", default="llama3.1:latest")
    parser.add_argument("--max-tasks", type=int, default=None)
    parser.add_argument("--timeout", type=float, default=8.0)
    parser.add_argument("--no-agent", action="store_true", help="禁用智能体框架，直接调用 LLM")
    args = parser.parse_args()

    result = evaluate_humaneval(
        model_name=args.model,
        dataset_path=args.dataset,
        max_tasks=args.max_tasks,
        timeout_seconds=args.timeout,
        use_agent=not args.no_agent,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
