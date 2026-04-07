import argparse
import json
import os
import subprocess
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple


def _env_flag_from(k: str, default: bool, env: Dict[str, str]) -> bool:
    raw = (env.get(k) or "").strip().lower()
    if not raw:
        return bool(default)
    if raw in {"1", "true", "yes", "y", "on"}:
        return True
    if raw in {"0", "false", "no", "n", "off"}:
        return False
    return bool(default)


def _run_once(
    repo_root: Path,
    dataset: str,
    model: str,
    timeout_s: int,
    level: Optional[int],
    limit: Optional[int],
    seed: Optional[int],
    extra_args: List[str],
    env_overrides: Dict[str, str],
) -> Tuple[Dict[str, Any], str]:
    env = dict(os.environ)
    env.update(env_overrides)
    env["GAIA_MODE"] = env.get("GAIA_MODE") or "1"
    env["CDEM_LLM_PROVIDER"] = env.get("CDEM_LLM_PROVIDER") or "ollama"
    env["CDEM_LLM_MODEL"] = env.get("CDEM_LLM_MODEL") or model
    env["CDEM_ENABLE_LANGCHAIN_SUPPORTS_PATCH"] = env.get("CDEM_ENABLE_LANGCHAIN_SUPPORTS_PATCH") or "1"
    env["CDEM_PRINT_FEATURE_FLAGS"] = env.get("CDEM_PRINT_FEATURE_FLAGS") or "1"

    use_tools = _env_flag_from("CDEM_ENABLE_TOOLS", True, env_overrides)
    inline_flag = ["--no_inline_attachment"] if use_tools else []

    cmd = [
        "python",
        "physic/tools/agents/evaluate_gaia.py",
        "--dataset",
        dataset,
        "--only_with_file",
        "--model",
        model,
        "--timeout_s",
        str(timeout_s),
    ]
    if level is not None:
        cmd += ["--level", str(level)]
    if limit is not None:
        cmd += ["--limit", str(limit)]
    if seed is not None:
        cmd += ["--seed", str(seed)]
    cmd += inline_flag
    cmd += extra_args

    p = subprocess.run(cmd, cwd=str(repo_root), env=env, capture_output=True, text=True)
    out = (p.stdout or "") + "\n" + (p.stderr or "")
    last_json = None
    for line in out.splitlines()[::-1]:
        t = line.strip()
        if t.startswith("{") and t.endswith("}") and "\"accuracy\"" in t and "\"dataset\"" in t:
            try:
                last_json = json.loads(t)
                break
            except Exception:
                continue
    if last_json is None:
        last_json = {
            "ok": False,
            "dataset": dataset,
            "model": model,
            "error": "no_summary_json",
            "returncode": p.returncode,
        }
    return last_json, out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", default="GAIA/2023/validation/metadata.jsonl")
    ap.add_argument("--model", default="llama3.1:latest")
    ap.add_argument("--timeout_s", type=int, default=300)
    ap.add_argument("--level", type=int, default=None)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--output_dir", default="physic/tools/agents/results/gaia_component_ablation")
    ap.add_argument("--verbose_logs", action="store_true")
    ap.add_argument("--extra", nargs="*", default=[])
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[3]
    out_dir = (repo_root / args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")

    experiments: List[Tuple[str, Dict[str, str]]] = [
        (
            "baseline",
            {
                "CDEM_LLM_PROVIDER": "ollama",
                "CDEM_LLM_MODEL": args.model,
                "CDEM_ENABLE_TOOLS": "1",
                "CDEM_ENABLE_VECTOR_KB": "0",
                "CDEM_ENABLE_RAG": "0",
                "CDEM_ENABLE_RAG_FALLBACK": "0",
                "CDEM_ENABLE_PROMPT_OPTIMIZER": "1",
                "CDEM_ENABLE_WORKFLOW_OPTIMIZER": "1",
                "CDEM_ENABLE_GENERATION_MEMORY": "1",
                "CDEM_ENABLE_TASK_STEPS": "1",
                "CDEM_ENABLE_TOOL_QUERY_REWRITE": "1",
                "CDEM_ENABLE_JSON_TOOL_PATCH": "1",
                "CDEM_ENABLE_LANGCHAIN_SUPPORTS_PATCH": "1",
                "CDEM_PRINT_FEATURE_FLAGS": "1",
            },
        ),
        ("no_tools", {"CDEM_ENABLE_TOOLS": "0"}),
        ("no_rag", {"CDEM_ENABLE_RAG": "0", "CDEM_ENABLE_RAG_FALLBACK": "0"}),
        ("no_prompt_optimizer", {"CDEM_ENABLE_PROMPT_OPTIMIZER": "0"}),
        ("no_workflow_optimizer", {"CDEM_ENABLE_WORKFLOW_OPTIMIZER": "0"}),
        ("no_generation_memory", {"CDEM_ENABLE_GENERATION_MEMORY": "0"}),
        ("no_task_steps", {"CDEM_ENABLE_TASK_STEPS": "0"}),
        ("no_tool_query_rewrite", {"CDEM_ENABLE_TOOL_QUERY_REWRITE": "0"}),
        ("no_json_tool_patch", {"CDEM_ENABLE_JSON_TOOL_PATCH": "0"}),
    ]

    base_env = dict(experiments[0][1])

    results: List[Dict[str, Any]] = []
    for name, overrides in experiments:
        env = dict(base_env)
        env.update(overrides)
        summary, logs = _run_once(
            repo_root=repo_root,
            dataset=args.dataset,
            model=args.model,
            timeout_s=args.timeout_s,
            level=args.level,
            limit=args.limit,
            seed=args.seed,
            extra_args=args.extra,
            env_overrides=env,
        )
        item = {
            "name": name,
            "env": env,
            "summary": summary,
        }
        results.append(item)
        if args.verbose_logs:
            (out_dir / f"{ts}_{name}.log").write_text(logs, encoding="utf-8")

    out_json = out_dir / f"ablation_{ts}.json"
    out_json.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    compact = []
    for r in results:
        s = r.get("summary") or {}
        compact.append(
            {
                "name": r.get("name"),
                "ok": s.get("ok"),
                "total": s.get("total"),
                "correct": s.get("correct"),
                "accuracy": s.get("accuracy"),
                "elapsed_s": s.get("elapsed_s"),
                "output_predictions_jsonl": s.get("output_predictions_jsonl"),
            }
        )
    out_compact = out_dir / f"ablation_{ts}.summary.json"
    out_compact.write_text(json.dumps(compact, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"ok": True, "output_json": str(out_json), "output_summary_json": str(out_compact)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

