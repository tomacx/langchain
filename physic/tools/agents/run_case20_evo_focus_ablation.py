import argparse
import json
import os
import re
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

import evo_game
import evo_llm


def _safe_name(s: str, fallback: str = "item") -> str:
    t = (s or "").strip()
    if not t:
        return fallback
    t = re.sub(r"[^\w\-.]+", "_", t, flags=re.UNICODE)
    t = re.sub(r"_+", "_", t).strip("._")
    return t or fallback


def _load_best_agent_system_prompt() -> str:
    prompt_path = Path(__file__).resolve().parents[1] / "prompt" / "agent_system.py"
    if prompt_path.exists():
        try:
            import importlib.util

            spec = importlib.util.spec_from_file_location("cdem_prompt_agent_system_for_evo_best", prompt_path)
            mod = importlib.util.module_from_spec(spec)
            assert spec and spec.loader
            spec.loader.exec_module(mod)
            for name in ("AGENT_SYSTEM_PROMPT2", "AGENT_SYSTEM_PROMPT1", "AGENT_SYSTEM_PROMPT0"):
                if hasattr(mod, name):
                    v = str(getattr(mod, name))
                    if v.strip():
                        return v
            if hasattr(mod, "SYSTEM_PROMPT"):
                return str(mod.SYSTEM_PROMPT)
            if hasattr(mod, "SYSTEM_MESSAGE"):
                return str(mod.SYSTEM_MESSAGE)
        except Exception:
            pass
    return evo_game.load_agent_system_prompt()


def _meets_targets(scores: Any, *, cfg: evo_game.GameConfig) -> bool:
    if float(scores.f_s) < float(cfg.target_f_s):
        return False
    if float(scores.f_f) < float(cfg.target_f_f):
        return False
    if scores.f_p is not None and float(scores.f_p) < float(cfg.target_f_p):
        return False
    return True


@dataclass(frozen=True)
class ExcelItem:
    test_id: str
    user_query: str
    output_dir: str


def _read_excel_items(excel_path: str) -> List[ExcelItem]:
    import pandas as pd

    df = pd.read_excel(str(excel_path), dtype=str)
    cols = {str(c).strip(): c for c in list(df.columns)}
    id_col = cols.get("id") or cols.get("task_id") or cols.get("case_id")
    q_col = cols.get("user_query") or cols.get("query") or cols.get("prompt")
    out_dir_col = cols.get("output_dir")
    if not q_col:
        raise ValueError(f"excel missing query column, found={list(df.columns)}")
    rows = df.to_dict(orient="records")
    items: List[ExcelItem] = []
    for i, row in enumerate(rows, 1):
        q = str(row.get(q_col) or "").strip()
        if not q:
            continue
        rid = str(row.get(id_col) or f"row_{i}").strip() if id_col else f"row_{i}"
        od = str(row.get(out_dir_col) or "").strip() if out_dir_col else ""
        items.append(ExcelItem(test_id=rid, user_query=q, output_dir=od))
    return items


def _run_one_focus_group(
    *,
    items: List[ExcelItem],
    out_dir: Path,
    foci: str,
    model: str,
    provider: str,
) -> Dict[str, Any]:
    os.environ["CDEM_LLM_PROVIDER"] = provider
    os.environ["CDEM_LLM_MODEL"] = model
    os.environ["CDEM_EVO_FOCI"] = foci

    out_dir.mkdir(parents=True, exist_ok=True)
    scripts_dir = out_dir / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)

    llm = evo_llm.get_llm()
    optimizer = evo_game.MultiObjectiveGameOptimizer(
        llm=llm,
        simulator=None,
        system_prompt=_load_best_agent_system_prompt(),
        domain="cdem_js",
    )

    results_path = out_dir / "results.jsonl"
    fp = results_path.open("w", encoding="utf-8")
    try:
        passed = 0
        sum_s = 0.0
        sum_f = 0.0
        sum_p = 0.0
        cnt_p = 0
        sum_t = 0.0
        for it in items:
            t0 = time.time()
            res = optimizer.optimize(task=it.user_query, tool_context="")
            js = evo_game.extract_js_code(res.script or "")
            if "setCurDir(getSrcDir());" not in js:
                js = "setCurDir(getSrcDir());\n" + js
            elapsed = time.time() - t0
            sum_t += elapsed

            file_stem = _safe_name(f"{it.test_id}_{it.output_dir}", fallback=it.test_id)
            script_path = scripts_dir / f"{file_stem}.js"
            script_path.write_text(js, encoding="utf-8")

            ok = _meets_targets(res.scores, cfg=optimizer.cfg)
            if ok:
                passed += 1
            sum_s += float(res.scores.f_s)
            sum_f += float(res.scores.f_f)
            if res.scores.f_p is not None:
                sum_p += float(res.scores.f_p)
                cnt_p += 1

            rec = {
                "id": it.test_id,
                "output_dir": it.output_dir,
                "focus_foci": foci,
                "model": model,
                "provider": provider,
                "passed": ok,
                "gen_time_sec": elapsed,
                "scores": {"f_s": res.scores.f_s, "f_f": res.scores.f_f, "f_p": res.scores.f_p},
                "breakdown": {
                    "simplicity": res.breakdown.simplicity,
                    "fitness": res.breakdown.fitness,
                    "physics": res.breakdown.physics,
                },
                "history_len": len(res.history),
                "script_path": str(script_path),
            }
            fp.write(json.dumps(rec, ensure_ascii=False) + "\n")
            fp.flush()

        summary = {
            "focus_foci": foci,
            "model": model,
            "provider": provider,
            "n": len(items),
            "passed": passed,
            "pass_rate": (passed / max(1, len(items))),
            "avg_f_s": (sum_s / max(1, len(items))),
            "avg_f_f": (sum_f / max(1, len(items))),
            "avg_f_p": (sum_p / max(1, cnt_p)) if cnt_p else None,
            "avg_time_sec": (sum_t / max(1, len(items))),
            "scripts_dir": str(scripts_dir),
            "results_jsonl": str(results_path),
        }
        (out_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
        return summary
    finally:
        fp.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--excel_path",
        type=str,
        default=str(Path(__file__).resolve().parents[2] / "dataset_split_results" / "case_20.xlsx"),
    )
    ap.add_argument("--out_root", type=str, default="")
    ap.add_argument("--model", type=str, default="llama3.1:latest")
    ap.add_argument("--provider", type=str, default="ollama")
    ap.add_argument("--max_cases", type=int, default=0)
    args = ap.parse_args()

    items = _read_excel_items(args.excel_path)
    if args.max_cases and int(args.max_cases) > 0:
        items = items[: int(args.max_cases)]

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if args.out_root:
        out_root = Path(args.out_root).expanduser().resolve()
    else:
        out_root = (Path(__file__).resolve().parents[2] / "out" / f"evo_case20_focus_ablation_{stamp}").resolve()
    out_root.mkdir(parents=True, exist_ok=True)

    groups: List[Tuple[str, str]] = [
        ("single_simplicity", "simplicity"),
        ("single_fitness", "fitness"),
        ("single_physics", "physics"),
        ("multi_all", "physics,fitness,simplicity"),
    ]

    summaries: List[Dict[str, Any]] = []
    for name, foci in groups:
        out_dir = out_root / name
        summ = _run_one_focus_group(items=items, out_dir=out_dir, foci=foci, model=args.model, provider=args.provider)
        summaries.append(summ)

    (out_root / "index.json").write_text(json.dumps(summaries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(str(out_root))


if __name__ == "__main__":
    main()

