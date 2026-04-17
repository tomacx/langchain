import argparse
import json
import os
import time
import difflib
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pyarrow.parquet as pq

from agent import AgentConstructionModule, HumanMessage, SystemMessage


SWE_SYSTEM_APPEND = """You will be given a GitHub issue description from SWE-bench Lite.
Your task is to propose a fix as a unified diff patch.

Rules:
- Output ONLY the patch (unified diff). No explanation.
- Start the output with a line like: diff --git a/... b/...
- Keep the patch minimal and focused on fixing the described bug.
"""

SWE_EVO_APPEND = """动态优化指令（EVO）：
严格输出 unified diff 补丁文本：禁止解释、禁止 Markdown 代码块；第一行必须以 diff --git a/... b/... 开头。
补丁尽量小：只改最相关文件与最少行，避免无关的格式化/重构/清理。
优先命中问题描述/报错/测试名中出现的文件路径与符号名（函数/类/变量）。
若不确定上下文，宁可只做最小修复，不要扩展性大改。
"""


@dataclass
class SweBenchRunResult:
    instance_id: str
    repo: str
    base_commit: str
    ok: bool
    elapsed_s: float
    response_text: str
    predicted_patch: str
    gold_patch: str
    patch_extracted: bool
    exact_match: bool
    similarity: float
    predicted_files: List[str]
    gold_files: List[str]
    file_set_match: bool
    error: str = ""


def _safe_json_loads_list(raw: str) -> List[str]:
    s = (raw or "").strip()
    if not s:
        return []
    try:
        v = json.loads(s)
        if isinstance(v, list):
            return [str(x) for x in v]
    except Exception:
        pass
    return []


def _extract_patch(text: str) -> Tuple[str, bool]:
    s = (text or "").strip()
    if not s:
        return "", False
    idx = s.find("diff --git ")
    if idx >= 0:
        return s[idx:].strip(), True
    return s, False


def _extract_files_from_diff(patch: str) -> List[str]:
    files: List[str] = []
    for line in (patch or "").splitlines():
        if line.startswith("diff --git "):
            parts = line.split()
            if len(parts) >= 4:
                a_path = parts[2].strip()
                b_path = parts[3].strip()
                for p in (a_path, b_path):
                    if p.startswith("a/") or p.startswith("b/"):
                        files.append(p[2:])
                    else:
                        files.append(p)
    uniq = sorted({f for f in files if f})
    return uniq


def _similarity(a: str, b: str) -> float:
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def _build_query(row: Dict[str, Any]) -> str:
    instance_id = str(row.get("instance_id") or "")
    repo = str(row.get("repo") or "")
    base_commit = str(row.get("base_commit") or "")
    problem = str(row.get("problem_statement") or "").strip()
    hints = str(row.get("hints_text") or "").strip()
    fail_to_pass = row.get("FAIL_TO_PASS")
    pass_to_pass = row.get("PASS_TO_PASS")
    if isinstance(fail_to_pass, str):
        fail_to_pass_list = _safe_json_loads_list(fail_to_pass)
    else:
        fail_to_pass_list = []
    if isinstance(pass_to_pass, str):
        pass_to_pass_list = _safe_json_loads_list(pass_to_pass)
    else:
        pass_to_pass_list = []

    parts = [
        "SWE-bench Lite task",
        f"repo: {repo}",
        f"instance_id: {instance_id}",
        f"base_commit: {base_commit}",
        "",
        "Issue description:",
        problem,
    ]
    if hints:
        parts.extend(["", "Hints:", hints])
    if fail_to_pass_list:
        parts.extend(["", "Failing tests (should pass after fix):", "\n".join(fail_to_pass_list[:100])])
    if pass_to_pass_list:
        parts.extend(["", "Passing tests (must remain passing):", "\n".join(pass_to_pass_list[:100])])
    parts.extend(["", "Return the patch only."])
    return "\n".join(parts).strip() + "\n"


def _ensure_env(model_name: str, provider: str, ollama_base_url: Optional[str]) -> None:
    if provider:
        os.environ["CDEM_LLM_PROVIDER"] = provider
    if model_name:
        os.environ["CDEM_LLM_MODEL"] = model_name
    if ollama_base_url:
        os.environ["CDEM_OLLAMA_BASE_URL"] = ollama_base_url


def _run_one(
    agent_module: Any,
    row: Dict[str, Any],
    system_prompt: str,
    *,
    backend: str,
) -> SweBenchRunResult:
    instance_id = str(row.get("instance_id") or "")
    repo = str(row.get("repo") or "")
    base_commit = str(row.get("base_commit") or "")
    gold_patch = str(row.get("patch") or "")

    query = _build_query(row)
    sys = (system_prompt or "").strip()
    start = time.time()
    response_text = ""
    predicted_patch = ""
    patch_extracted = False
    err = ""
    ok = False
    try:
        if backend == "evo":
            response_text, _, _ = agent_module.generate_code(query, verbose=False, dynamic_sys_prompt=SWE_EVO_APPEND)
        else:
            resp = agent_module.llm.invoke(
                [
                    SystemMessage(content=sys),
                    HumanMessage(content=query),
                ]
            )
            response_text = getattr(resp, "content", None) or str(resp)
        predicted_patch, patch_extracted = _extract_patch(response_text)
        ok = True
    except Exception as e:
        err = f"{type(e).__name__}: {e}"
    elapsed = time.time() - start

    predicted_files = _extract_files_from_diff(predicted_patch)
    gold_files = _extract_files_from_diff(gold_patch)
    exact_match = predicted_patch.strip() == gold_patch.strip() if predicted_patch and gold_patch else False
    sim = _similarity(predicted_patch, gold_patch)
    file_set_match = set(predicted_files) == set(gold_files) if predicted_files and gold_files else False

    return SweBenchRunResult(
        instance_id=instance_id,
        repo=repo,
        base_commit=base_commit,
        ok=ok,
        elapsed_s=elapsed,
        response_text=response_text,
        predicted_patch=predicted_patch,
        gold_patch=gold_patch,
        patch_extracted=patch_extracted,
        exact_match=exact_match,
        similarity=sim,
        predicted_files=predicted_files,
        gold_files=gold_files,
        file_set_match=file_set_match,
        error=err,
    )


def _summarize(results: List[SweBenchRunResult]) -> Dict[str, Any]:
    total = len(results)
    ok = sum(1 for r in results if r.ok)
    extracted = sum(1 for r in results if r.patch_extracted and r.ok)
    exact = sum(1 for r in results if r.exact_match and r.ok)
    file_match = sum(1 for r in results if r.file_set_match and r.ok)
    avg_sim = sum(r.similarity for r in results if r.ok) / max(1, ok)
    avg_time = sum(r.elapsed_s for r in results) / max(1, total)
    return {
        "total": total,
        "ok": ok,
        "patch_extracted": extracted,
        "exact_match": exact,
        "file_set_match": file_match,
        "avg_similarity": round(avg_sim, 4),
        "avg_elapsed_s": round(avg_time, 3),
    }


def _load_dataset_rows(dataset_path: Path) -> List[Dict[str, Any]]:
    p = dataset_path.expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(f"dataset not found: {p}")
    if p.suffix.lower() == ".jsonl":
        rows: List[Dict[str, Any]] = []
        with p.open("r", encoding="utf-8") as f:
            for line in f:
                s = (line or "").strip()
                if not s:
                    continue
                try:
                    v = json.loads(s)
                    if isinstance(v, dict):
                        rows.append(v)
                except Exception:
                    continue
        return rows
    if p.suffix.lower() == ".parquet":
        table = pq.read_table(p)
        df = table.to_pandas()
        return list(df.to_dict(orient="records"))
    raise ValueError(f"unsupported dataset type: {p}")


def main() -> None:
    here = Path(__file__).resolve().parent
    default_data_root = here / "data" / "SWE-bench_Lite" / "data"
    default_jsonl = here / "data" / "swebench_lite_test.jsonl"

    p = argparse.ArgumentParser()
    p.add_argument("--split", choices=["dev", "test"], default="dev")
    p.add_argument("--data-root", default=str(default_data_root))
    p.add_argument("--dataset", default=str(default_jsonl), help="支持 .jsonl 或 .parquet；jsonl 默认使用 physic/tools/agents/data/swebench_lite_test.jsonl")
    p.add_argument("--limit", type=int, default=5)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--output-dir", default=str(here / "results" / "swebench_lite"))
    p.add_argument("--model", default="llama3.1:latest")
    p.add_argument("--provider", default="ollama")
    p.add_argument("--ollama-base-url", default=os.environ.get("CDEM_OLLAMA_BASE_URL") or "")
    p.add_argument("--system-mode", choices=["agent_default", "agent_plus_swe"], default="agent_plus_swe")
    p.add_argument("--disable-preprocessing", action="store_true", default=False)
    p.add_argument("--backend", choices=["baseline", "evo"], default="baseline")
    args = p.parse_args()

    dataset_path = Path(args.dataset).expanduser().resolve()
    if (not dataset_path.exists()) and str(args.data_root):
        data_root = Path(args.data_root).expanduser().resolve()
        parquet_name = "dev-00000-of-00001.parquet" if args.split == "dev" else "test-00000-of-00001.parquet"
        parquet_path = data_root / parquet_name
        if parquet_path.exists():
            dataset_path = parquet_path

    _ensure_env(
        model_name=args.model,
        provider=(args.provider or "").strip(),
        ollama_base_url=(args.ollama_base_url or "").strip() or None,
    )

    agent_module = AgentConstructionModule(
        tools=[],
        model_name=args.model,
        enable_preprocessing=not bool(args.disable_preprocessing),
    )
    base_system = (getattr(agent_module, "system_prompt", "") or "").strip()
    if args.system_mode == "agent_plus_swe":
        system_prompt = (base_system + "\n\n" + SWE_SYSTEM_APPEND).strip()
    else:
        system_prompt = base_system

    rows = _load_dataset_rows(dataset_path)
    if args.seed:
        try:
            import random

            rng = random.Random(int(args.seed))
            rng.shuffle(rows)
        except Exception:
            pass
    if args.offset:
        rows = rows[int(args.offset) :]
    if args.limit and args.limit > 0:
        rows = rows[: int(args.limit)]

    out_dir = Path(args.output_dir).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    jsonl_path = out_dir / f"{args.split}_predictions.jsonl"
    swebench_jsonl_path = out_dir / f"{args.split}_swebench_format.jsonl"
    summary_path = out_dir / f"{args.split}_summary.json"

    backend = (args.backend or "").strip().lower()
    runner: Any = agent_module
    if backend == "evo":
        from evolutionary_single_agent_langgraph import EvolutionaryWrapperAgentConstructionModule

        class _DirectLLMAgent:
            def __init__(self, llm: Any, system_prompt: str):
                self.llm = llm
                self.tools = []
                self.system_prompt = system_prompt
                self.last_run_metrics: Dict[str, Any] = {}

            def generate_code(self, query: str, verbose: bool = False, dynamic_sys_prompt: str = "") -> tuple[str, float, int]:
                sys_text = (self.system_prompt or "").strip()
                dyn = (dynamic_sys_prompt or "").strip()
                if dyn:
                    sys_text = (sys_text + "\n\n【动态优化指令】\n" + dyn).strip()
                t0 = time.time()
                resp = self.llm.invoke([SystemMessage(content=sys_text), HumanMessage(content=query)])
                txt = getattr(resp, "content", None) or str(resp)
                self.last_run_metrics = {}
                return txt, time.time() - t0, 0

        runner = EvolutionaryWrapperAgentConstructionModule(
            base_agent=_DirectLLMAgent(agent_module.llm, system_prompt),
            domain="swebench_patch",
        )

    results: List[SweBenchRunResult] = []
    with open(jsonl_path, "w", encoding="utf-8") as f, open(swebench_jsonl_path, "w", encoding="utf-8") as sf:
        for i, row in enumerate(rows, 1):
            r = _run_one(
                runner,
                row,
                system_prompt=system_prompt,
                backend=backend,
            )
            results.append(r)
            f.write(json.dumps(asdict(r), ensure_ascii=False) + "\n")
            f.flush()
            sf.write(json.dumps({"instance_id": r.instance_id, "model_patch": r.predicted_patch}, ensure_ascii=False) + "\n")
            sf.flush()
            status = "ok" if r.ok else "err"
            print(
                f"[{i}/{len(rows)}] {status} {r.instance_id} sim={r.similarity:.3f} exact={int(r.exact_match)} extracted={int(r.patch_extracted)} time={r.elapsed_s:.2f}s"
            )

    summary = _summarize(results)
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print("\nSummary")
    for k in ["total", "ok", "patch_extracted", "exact_match", "file_set_match", "avg_similarity", "avg_elapsed_s"]:
        print(f"- {k}: {summary.get(k)}")
    print(f"\nSaved: {jsonl_path}")
    print(f"Saved: {swebench_jsonl_path}")
    print(f"Saved: {summary_path}")


if __name__ == "__main__":
    main()
