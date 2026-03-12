import argparse
import json
import multiprocessing as mp
import re
import traceback
from pathlib import Path
from typing import Any, Dict, List, Optional

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama


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


def evaluate_humaneval(
    model_name: str,
    dataset_path: str,
    max_tasks: Optional[int] = None,
    timeout_seconds: float = 8.0,
) -> Dict[str, Any]:
    dataset_file = Path(dataset_path)
    if not dataset_file.exists():
        return {"ok": False, "error": f"找不到 HumanEval 数据集文件: {dataset_path}"}

    llm = ChatOllama(model=model_name, temperature=0.2, keep_alive="5m")

    tasks: List[Dict[str, Any]] = []
    with open(dataset_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            tasks.append(json.loads(line))
            if max_tasks and len(tasks) >= max_tasks:
                break

    passed = 0
    total = len(tasks)
    failures: List[Dict[str, Any]] = []

    sys_prompt = (
        "你是一个严谨的 Python 编程助手。"
        "给定函数签名与说明后，你只输出 Python 代码（不要 Markdown，不要解释）。"
        "输出应当是对函数体/缺失部分的补全，使其通过测试。"
    )

    for i, task in enumerate(tasks, 1):
        task_id = task.get("task_id", f"T{i}")
        prompt = task.get("prompt", "")
        test_code = task.get("test", "")

        msg = [
            SystemMessage(content=sys_prompt),
            HumanMessage(content=prompt + "\n\n只输出 Python 代码补全："),
        ]

        try:
            resp = llm.invoke(msg)
            completion = getattr(resp, "content", "") or ""
        except Exception as e:
            failures.append({"task_id": task_id, "error": f"模型调用失败: {e}"})
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
        "dataset_path": str(dataset_file),
        "model": model_name,
        "total": total,
        "passed": passed,
        "pass_rate": (passed / total) if total else 0.0,
        "failures": failures[:20],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True, help="HumanEval.jsonl 的路径")
    parser.add_argument("--model", default="llama3.1:latest")
    parser.add_argument("--max-tasks", type=int, default=None)
    parser.add_argument("--timeout", type=float, default=8.0)
    args = parser.parse_args()

    result = evaluate_humaneval(
        model_name=args.model,
        dataset_path=args.dataset,
        max_tasks=args.max_tasks,
        timeout_seconds=args.timeout,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
