import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional, Tuple


def _ensure_repo_on_syspath() -> None:
    here = Path(__file__).resolve()
    repo_root = here.parents[3]
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))


def _read_case_table(path: Path):
    import pandas as pd

    if path.suffix.lower() in {".xlsx", ".xls"}:
        try:
            df = pd.read_excel(str(path), dtype=str)
            return df
        except Exception:
            csv_path = path.with_suffix(".csv")
            if csv_path.exists():
                df = pd.read_csv(str(csv_path), dtype=str)
                return df
            raise
    return pd.read_csv(str(path), dtype=str)


def _pick_col(df, candidates):
    for c in candidates:
        if c in df.columns:
            return c
    return None


def _sanitize_dir_name(s: str) -> str:
    name = str(s or "").strip()
    for ch in ["/", "\\", "\0", "\n", "\r", "\t", ":"]:
        name = name.replace(ch, "_")
    name = name.strip().strip(".")
    return name or "case"


def _derive_case_label(filename: str) -> str:
    base = Path(str(filename or "").strip()).stem
    if not base:
        return "case"
    parts = [p for p in base.split("-") if p]
    lower_parts = [p.lower() for p in parts]
    if any("cable" in p for p in lower_parts):
        return "bar"

    drop_keywords = {
        "案例库",
        "CDyna案例",
        "GFlow案例",
        "MudSim案例",
        "SuperCDEM案例",
        "cdyna案例",
        "gflow案例",
        "mudsim案例",
        "supercdem案例",
        "建模及网格案例",
        "块体模块案例",
        "粒子模块案例",
        "冲击波模块案例",
        "其他模块案例",
        "基本案例",
        "扩展案例",
        "刚体动力学案例",
        "结构单元案例",
        "非球形离散元案例",
        "脚本功能库",
    }

    filtered: list[str] = []
    for p in parts:
        p_stripped = str(p).strip()
        if not p_stripped:
            continue
        if any(k in p_stripped for k in drop_keywords):
            continue
        if any(k in p_stripped.lower() for k in {"cdyna", "gflow", "mudsim", "supercdem"}):
            if "案例" in p_stripped:
                continue
        if p_stripped.isdigit():
            continue
        if p_stripped.lower().startswith("case"):
            continue
        if p_stripped.lower() in {"cal", "command"}:
            continue
        filtered.append(p_stripped)

    if not filtered:
        filtered = parts[-4:] if len(parts) >= 4 else parts

    for i, tok in enumerate(filtered[:-1]):
        if tok.endswith("模型"):
            nxt = filtered[i + 1].strip()
            if nxt:
                return _sanitize_dir_name(f"{tok}-{nxt}")

    last = filtered[-1]
    prev = filtered[-2] if len(filtered) >= 2 else ""
    if any("\u4e00" <= ch <= "\u9fff" for ch in "".join(filtered)):
        has_impact = any("冲击起爆" in t for t in filtered)
        if has_impact:
            for k in ["时间点火", "压力点火"]:
                if any(k in t for t in filtered):
                    return _sanitize_dir_name(f"冲击起爆--{k}")
        chinese_tokens = [t for t in filtered if any("\u4e00" <= ch <= "\u9fff" for ch in t)]
        if chinese_tokens:
            candidates: list[str] = []
            for t in chinese_tokens:
                if any(x in t for x in {"(", ")", "（", "）"}):
                    continue
                if any("a" <= ch.lower() <= "z" for ch in t):
                    continue
                candidates.append(t)
            chosen = max(candidates, key=lambda x: len(x), default=chinese_tokens[-1])
            return _sanitize_dir_name(chosen)

    if last != prev and prev.lower().endswith("test") and last.lower().endswith("test"):
        return _sanitize_dir_name(prev)
    if prev and last and (last in prev) and len(prev) > len(last):
        return _sanitize_dir_name(prev)
    return _sanitize_dir_name(last)


def _write_jsonl_line(fp: Path, obj: Dict[str, Any]) -> None:
    fp.parent.mkdir(parents=True, exist_ok=True)
    with open(fp, "a", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def _save_text(fp: Path, text: str) -> None:
    fp.parent.mkdir(parents=True, exist_ok=True)
    fp.write_text(str(text or ""), encoding="utf-8")


def _run_one(
    evaluator,
    row: Dict[str, Any],
    idx: int,
    total: int,
    out_dir: Path,
    overwrite: bool,
) -> Tuple[Optional[Path], Dict[str, Any]]:
    test_id = str(row.get("id") or row.get("test_id") or "").strip() or f"C{idx:03d}"
    filename = str(row.get("filename") or "").strip()
    relative_path = str(row.get("relative_path") or "").strip()
    query = str(row.get("user_query") or row.get("query") or row.get("prompt") or "").strip()

    label = _derive_case_label(filename)
    case_dir = (out_dir / "generated" / f"{idx:02d}{label}").resolve()
    gen_name = Path(filename).name.strip() if filename else ""
    if not gen_name:
        gen_name = f"{test_id}.js"
    if not gen_name.lower().endswith(".js"):
        gen_name = gen_name + ".js"
    gen_path = (case_dir / gen_name).resolve()

    if gen_path.exists() and not overwrite:
        rec = {
            "row_index": idx - 1,
            "test_id": test_id,
            "filename": filename,
            "relative_path": relative_path,
            "model": getattr(evaluator, "model_name", ""),
            "generated_path": str(gen_path),
            "skipped": True,
            "generation_time": 0.0,
        }
        return gen_path, rec

    if not query:
        rec = {
            "row_index": idx - 1,
            "test_id": test_id,
            "filename": filename,
            "relative_path": relative_path,
            "model": getattr(evaluator, "model_name", ""),
            "generated_path": "",
            "skipped": True,
            "error": "empty query",
            "generation_time": 0.0,
        }
        return None, rec

    print(f"[{idx}/{total}] {test_id} | {Path(filename).name if filename else ''}", flush=True)
    res = evaluator.run_custom_query(query=query, case_filename=filename, verbose=False) or {}
    code = str(res.get("generated_code") or "")
    err = str(res.get("error") or "").strip()
    gen_time = float(res.get("generation_time") or 0.0)

    if code:
        _save_text(gen_path, code)

    rec = {
        "row_index": idx - 1,
        "test_id": test_id,
        "filename": filename,
        "relative_path": relative_path,
        "model": getattr(evaluator, "model_name", ""),
        "generated_path": str(gen_path) if code else "",
        "skipped": False,
        "generation_time": gen_time,
        "error": err,
    }
    return gen_path if code else None, rec


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--excel_path",
        type=str,
        default=str(Path(__file__).resolve().parents[3] / "physic" / "dataset_split_results" / "case_20.xlsx"),
    )
    parser.add_argument("--model", type=str, default="llama3.1:latest")
    parser.add_argument("--base_url", type=str, default=os.environ.get("METAGPT_OLLAMA_BASE_URL", "").strip())
    parser.add_argument("--temperature", type=float, default=0.0)
    parser.add_argument("--max_token", type=int, default=4096)
    parser.add_argument("--timeout_s", type=int, default=600)
    parser.add_argument(
        "--out_dir",
        type=str,
        default=str(Path(__file__).resolve().parents[3] / "physic" / "tools" / "agents" / "results" / "autogen_case20_metagpt"),
    )
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    _ensure_repo_on_syspath()
    from physic.tools.agents.metagpt_evaluator import MetaGPTEvaluator

    excel_path = Path(args.excel_path).resolve()
    df = _read_case_table(excel_path)
    if df is None or df.empty:
        raise RuntimeError(f"empty table: {excel_path}")

    id_col = _pick_col(df, ["id", "test_id", "case_id"])
    filename_col = _pick_col(df, ["filename", "file", "name"])
    rel_col = _pick_col(df, ["relative_path", "path", "relpath"])
    query_col = _pick_col(df, ["user_query", "query", "prompt", "instruction", "input"])

    rows = []
    for _, r in df.iterrows():
        rows.append(
            {
                "id": (str(r.get(id_col)) if id_col else "").strip(),
                "filename": (str(r.get(filename_col)) if filename_col else "").strip(),
                "relative_path": (str(r.get(rel_col)) if rel_col else "").strip(),
                "user_query": (str(r.get(query_col)) if query_col else "").strip(),
            }
        )

    if args.offset:
        rows = rows[int(args.offset) :]
    if args.limit is not None:
        rows = rows[: max(0, int(args.limit))]

    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    results_path = out_dir / "results.jsonl"
    if args.overwrite and results_path.exists():
        try:
            results_path.unlink()
        except Exception:
            pass

    evaluator = MetaGPTEvaluator(
        model_name=str(args.model),
        base_url=(str(args.base_url).strip() or None),
        temperature=float(args.temperature),
        max_token=int(args.max_token),
        timeout_s=int(args.timeout_s),
    )

    meta = {
        "excel_path": str(excel_path),
        "model": str(args.model),
        "base_url": str(args.base_url or os.environ.get("METAGPT_OLLAMA_BASE_URL") or "").strip(),
        "temperature": float(args.temperature),
        "max_token": int(args.max_token),
        "timeout_s": int(args.timeout_s),
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    (out_dir / "run_metadata.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    total = len(rows)
    started = time.time()
    ok = 0
    for i, row in enumerate(rows, 1):
        global_idx = int(args.offset) + int(i)
        _, rec = _run_one(
            evaluator=evaluator,
            row=row,
            idx=global_idx,
            total=total,
            out_dir=out_dir,
            overwrite=bool(args.overwrite),
        )
        _write_jsonl_line(results_path, rec)
        if (not rec.get("skipped")) and (not rec.get("error")):
            ok += 1

    summary = {
        "excel_path": str(excel_path),
        "out_dir": str(out_dir),
        "model": str(args.model),
        "total": int(total),
        "ok": int(ok),
        "elapsed_s": float(round(time.time() - started, 3)),
        "results_jsonl": str(results_path),
    }
    (out_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
