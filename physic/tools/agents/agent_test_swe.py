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


def _run_one(agent_module: AgentConstructionModule, row: Dict[str, Any], system_prompt: str) -> SweBenchRunResult:
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


def main() -> None:
    here = Path(__file__).resolve().parent
    default_data_root = here / "data" / "SWE-bench_Lite" / "data"

    p = argparse.ArgumentParser()
    p.add_argument("--split", choices=["dev", "test"], default="dev")
    p.add_argument("--data-root", default=str(default_data_root))
    p.add_argument("--limit", type=int, default=5)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--output-dir", default=str(here / "results" / "swebench_lite"))
    p.add_argument("--model", default="llama3.1:latest")
    p.add_argument("--provider", default="ollama")
    p.add_argument("--ollama-base-url", default=os.environ.get("CDEM_OLLAMA_BASE_URL") or "")
    p.add_argument("--system-mode", choices=["agent_default", "agent_plus_swe"], default="agent_plus_swe")
    p.add_argument("--disable-preprocessing", action="store_true", default=False)
    args = p.parse_args()

    data_root = Path(args.data_root).expanduser().resolve()
    parquet_name = "dev-00000-of-00001.parquet" if args.split == "dev" else "test-00000-of-00001.parquet"
    parquet_path = data_root / parquet_name
    if not parquet_path.exists():
        raise FileNotFoundError(f"dataset parquet not found: {parquet_path}")

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

    table = pq.read_table(parquet_path)
    df = table.to_pandas()
    if args.seed:
        df = df.sample(frac=1.0, random_state=args.seed).reset_index(drop=True)
    if args.offset:
        df = df.iloc[int(args.offset) :].reset_index(drop=True)
    if args.limit and args.limit > 0:
        df = df.iloc[: int(args.limit)].reset_index(drop=True)

    out_dir = Path(args.output_dir).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    jsonl_path = out_dir / f"{args.split}_predictions.jsonl"
    swebench_jsonl_path = out_dir / f"{args.split}_swebench_format.jsonl"
    summary_path = out_dir / f"{args.split}_summary.json"

    results: List[SweBenchRunResult] = []
    with open(jsonl_path, "w", encoding="utf-8") as f, open(swebench_jsonl_path, "w", encoding="utf-8") as sf:
        for i, row in enumerate(df.to_dict(orient="records"), 1):
            r = _run_one(agent_module, row, system_prompt=system_prompt)
            results.append(r)
            f.write(json.dumps(asdict(r), ensure_ascii=False) + "\n")
            f.flush()
            sf.write(json.dumps({"instance_id": r.instance_id, "model_patch": r.predicted_patch}, ensure_ascii=False) + "\n")
            sf.flush()
            status = "ok" if r.ok else "err"
            print(
                f"[{i}/{len(df)}] {status} {r.instance_id} sim={r.similarity:.3f} exact={int(r.exact_match)} extracted={int(r.patch_extracted)} time={r.elapsed_s:.2f}s"
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
