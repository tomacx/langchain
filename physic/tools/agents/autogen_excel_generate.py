import argparse
import asyncio
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

import pandas as pd
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.ollama import OllamaChatCompletionClient


def _extract_code(text: str) -> str:
    s = (text or "").strip()
    if not s:
        return ""
    s = s.replace("```javascript", "```").replace("```js", "```").replace("```JavaScript", "```")
    if "```" in s:
        parts = s.split("```")
        best = ""
        for i in range(1, len(parts), 2):
            cand = parts[i].strip()
            if len(cand) > len(best):
                best = cand
        s = best or s
    return s.strip()


def _safe_name(s: str, fallback: str = "item") -> str:
    t = (s or "").strip()
    if not t:
        return fallback
    t = re.sub(r"[^\w\-.]+", "_", t, flags=re.UNICODE)
    t = re.sub(r"_+", "_", t).strip("._")
    return t or fallback


def _normalize_ollama_host(raw: str) -> str:
    s = (raw or "").strip()
    if not s:
        return "http://localhost:11434"
    if "://" not in s:
        s = f"http://{s}"
    p = urlparse(s)
    if not p.netloc:
        return "http://localhost:11434"
    return f"{p.scheme}://{p.netloc}"


@dataclass(frozen=True)
class ExcelItem:
    test_id: str
    filename: str
    relative_path: str
    user_query: str
    output_dir: str
    row_index: int


def load_excel_items(excel_path: Path) -> List[ExcelItem]:
    df = pd.read_excel(str(excel_path), dtype=str)
    if df is None or df.empty:
        return []
    col_map = {
        "id": None,
        "filename": None,
        "relative_path": None,
        "user_query": None,
        "output_dir": None,
    }
    for k in list(col_map.keys()):
        if k in df.columns:
            col_map[k] = k
    if any(v is None for v in col_map.values()):
        cols = list(df.columns)
        if len(cols) < 5:
            raise ValueError(f"Excel列数不足（需要>=5）: {cols}")
        col_map = {
            "id": cols[0],
            "filename": cols[1],
            "relative_path": cols[2],
            "user_query": cols[3],
            "output_dir": cols[4],
        }

    items: List[ExcelItem] = []
    for idx, row in df.iterrows():
        test_id = str(row.get(col_map["id"]) or "").strip() or f"X{idx+1:03d}"
        filename = str(row.get(col_map["filename"]) or "").strip()
        relative_path = str(row.get(col_map["relative_path"]) or "").strip()
        user_query = str(row.get(col_map["user_query"]) or "").strip()
        output_dir = str(row.get(col_map["output_dir"]) or "").strip() or "excel"
        if not filename or not user_query:
            continue
        items.append(
            ExcelItem(
                test_id=test_id,
                filename=filename,
                relative_path=relative_path,
                user_query=user_query,
                output_dir=output_dir,
                row_index=int(idx),
            )
        )
    return items


def _keywordize_query(q: str) -> List[str]:
    s = (q or "").strip()
    if not s:
        return []
    kws: List[str] = []
    for w in re.findall(r"[A-Za-z_][A-Za-z0-9_\-:.]{1,}", s):
        t = w.strip()
        if len(t) >= 3:
            kws.append(t)
    for w in ["重力", "大变形", "准静态", "圆盘", "裂纹", "断裂", "摩擦", "Link", "沙袋", "滑坡", "掉落", "碰撞", "渗流", "爆破", "边界条件", "网格", "导入"]:
        if w in s:
            kws.append(w)
    if ".msh" in s.lower():
        kws.append(".msh")
    seen: set[str] = set()
    out: List[str] = []
    for k in kws:
        if k not in seen:
            out.append(k)
            seen.add(k)
    return out[:12]


def retrieve_reference_snippets(
    *,
    docs_dir: Path,
    query: str,
    target_basename: str,
    top_k: int = 3,
    max_lines: int = 60,
) -> List[Dict[str, str]]:
    if not docs_dir.exists():
        return []
    kws = _keywordize_query(query)
    if not kws:
        return []
    tgt = (target_basename or "").strip()
    candidates: List[tuple[int, Path]] = []
    for p in docs_dir.rglob("*.js"):
        if tgt and p.name == tgt:
            continue
        score = 0
        path_s = str(p)
        for k in kws:
            if k and k in path_s:
                score += 2
        if score == 0:
            continue
        candidates.append((score, p))
    candidates.sort(key=lambda x: x[0], reverse=True)
    candidates = candidates[: max(20, top_k * 5)]

    scored: List[tuple[int, Path, str]] = []
    for base_score, p in candidates:
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        head = "\n".join(text.splitlines()[: max_lines]).strip()
        if not head:
            continue
        score = base_score
        for k in kws:
            if k and k in head:
                score += 1
        scored.append((score, p, head))

    scored.sort(key=lambda x: x[0], reverse=True)
    out: List[Dict[str, str]] = []
    for _, p, head in scored[: max(0, int(top_k))]:
        out.append({"path": str(p), "snippet": head})
    return out


async def solve_one(
    item: ExcelItem,
    *,
    model: str,
    temperature: float,
    host: str,
    system_message: str,
    extra_options: Optional[Dict[str, Any]] = None,
) -> str:
    opts: Dict[str, Any] = {"temperature": float(temperature)}
    if extra_options:
        opts.update({k: v for k, v in extra_options.items() if v is not None})
    client = OllamaChatCompletionClient(model=model, host=host, options=opts)
    agent = AssistantAgent(
        name="cdem_js_coder",
        model_client=client,
        system_message=system_message,
        max_tool_iterations=1,
    )
    res = await agent.run(task=item.user_query)
    text = ""
    for m in reversed(res.messages):
        src = getattr(m, "source", "") or ""
        if str(src).lower() == "user":
            continue
        content = getattr(m, "content", None)
        if isinstance(content, str) and content.strip():
            text = content.strip()
            break
    return _extract_code(text)


async def main() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    default_excel = repo_root / "physic" / "dataset_split_results" / "case_20.xlsx"
    default_out = Path(__file__).resolve().parent / "results" / "autogen_case20"

    ap = argparse.ArgumentParser()
    ap.add_argument("--excel", default=str(default_excel))
    ap.add_argument("--model", default="llama3.1:latest")
    ap.add_argument("--temperature", type=float, default=0.0)
    ap.add_argument("--concurrency", type=int, default=1)
    ap.add_argument("--output_dir", default=str(default_out))
    ap.add_argument("--offset", type=int, default=0)
    ap.add_argument("--limit", type=int, default=-1)
    ap.add_argument("--ollama_host", default=os.environ.get("CDEM_OLLAMA_BASE_URL") or os.environ.get("OLLAMA_HOST") or "")
    ap.add_argument("--seed", type=int, default=-1)
    ap.add_argument("--num_predict", type=int, default=-1)
    args = ap.parse_args()

    excel_path = Path(args.excel).resolve()
    if not excel_path.exists():
        raise FileNotFoundError(str(excel_path))

    items = load_excel_items(excel_path)
    offset = max(0, int(args.offset))
    limit = int(args.limit)
    if limit > 0:
        items = items[offset : offset + limit]
    else:
        items = items[offset:]
    if not items:
        print("⚠️ 未找到可生成的样例行", file=sys.stderr)
        return

    host = _normalize_ollama_host(str(args.ollama_host))
    out_dir = Path(args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    run_dir = out_dir / f"run_{run_id}"
    gen_root = run_dir / "generated"
    gen_root.mkdir(parents=True, exist_ok=True)

    preds_path = run_dir / f"preds_autogen_ollama_llama31_{run_id}.jsonl"
    summary_path = run_dir / f"summary_autogen_ollama_llama31_{run_id}.json"

    base_system_message = (
        "你是一名 CDEM/CDyna JavaScript 脚本生成助手。\n"
        "严格只输出可运行的 JavaScript 代码，不要输出 markdown 代码块，不要输出解释。\n"
        "脚本必须严格使用 CDEM 内置 JS 接口风格（全局对象通常包含：dyna、blkdyn、igeo、imeshing、imesh、rdface、doc 等），不要使用浏览器/Node 的 console.log。\n"
        "严禁臆造方法（例如 disk.setMeshDensity、dyna.setTimeStep 这类不存在的调用）。优先使用下列已知调用风格：\n"
        "1) 工作目录：setCurDir(getSrcDir());\n"
        "2) 求解控制：dyna.Set(\"Key value...\"); 例如：\n"
        "   dyna.Set(\"Mechanic_Cal 1\"); dyna.Set(\"Gravity 0 0 -9.8\"); dyna.Set(\"Large_Displace 1\");\n"
        "   dyna.Set(\"Output_Interval 500\"); dyna.Set(\"Moniter_Iter 100\"); dyna.TimeStepCorrect(0.6);\n"
        "   求解：dyna.Solve(steps);\n"
        "3) 几何/网格（按案例需求选择其一）：\n"
        "   - 直接生成：blkdyn.GenCircle(cx, r, n1, n2, group);\n"
        "   - 参数化几何+网格：igeo.genBrickV(...); imeshing.genMeshByGmsh(dim); blkdyn.GetMesh(imeshing);\n"
        "   - 导入网格：var msh = imesh.importGmsh(\"xxx.msh\") / imesh.importGid(\"xxx.msh\"); 或 blkdyn.ImportGrid(\"gmsh|gid\", \"xxx.msh\");\n"
        "4) 交界面：blkdyn.CrtIFace(...); blkdyn.UpdateIFaceMesh();\n"
        "5) 材料/本构：blkdyn.SetModel(\"linear\"/\"MC\"/...); blkdyn.SetMat...; 交界面：blkdyn.SetIModel(\"FracE\"/\"brittleMC\"/...); blkdyn.SetIMat(...);\n"
        "6) 约束/加载：blkdyn.FixVByCoord(...);\n"
        "输出提示信息使用 print(\"...\");\n"
        "必须满足用户描述中的几何/材料/接触/边界条件/求解控制/输出设置等要求。\n"
        "关键步骤必须包含中文注释。\n"
    )
    docs_dir = repo_root / "physic" / "docs" / "CDEM案例库及手册"

    extra_options: Dict[str, Any] = {}
    if int(args.seed) >= 0:
        extra_options["seed"] = int(args.seed)
    if int(args.num_predict) >= 0:
        extra_options["num_predict"] = int(args.num_predict)

    sem = asyncio.Semaphore(max(1, int(args.concurrency)))

    async def run_item(i: int, item: ExcelItem) -> Dict[str, Any]:
        async with sem:
            print(f"[{i+1}/{len(items)}] {item.test_id} | {item.output_dir} | {Path(item.filename).name}", file=sys.stderr, flush=True)
            t0 = time.time()
            code = ""
            err = ""
            try:
                refs = retrieve_reference_snippets(
                    docs_dir=docs_dir,
                    query=item.user_query,
                    target_basename=Path(item.filename).name,
                    top_k=3,
                    max_lines=60,
                )
                system_message = base_system_message
                if refs:
                    system_message += "\n以下为参考脚本片段（仅用于学习 API 调用方式，禁止照抄原脚本内容）：\n"
                    for r in refs:
                        system_message += f"\n[{Path(r['path']).name}]\n{r['snippet']}\n"
                code = await solve_one(
                    item,
                    model=str(args.model),
                    temperature=float(args.temperature),
                    host=host,
                    system_message=system_message,
                    extra_options=extra_options,
                )
            except Exception as e:
                err = f"{type(e).__name__}: {e}"
                code = ""
            dt = time.time() - t0

        group_dir = gen_root / _safe_name(item.output_dir, fallback="excel")
        group_dir.mkdir(parents=True, exist_ok=True)
        out_name = Path(item.filename).name or f"{_safe_name(item.test_id)}.js"
        out_path = group_dir / out_name
        out_path.write_text(code or "", encoding="utf-8")
        return {
            "id": item.test_id,
            "row_index": int(item.row_index),
            "filename": item.filename,
            "relative_path": item.relative_path,
            "output_dir": item.output_dir,
            "model": f"ollama/{args.model}",
            "ollama_host": host,
            "temperature": float(args.temperature),
            "seconds": float(dt),
            "saved_path": str(out_path),
            "error": err,
            "code": code,
        }

    results: List[Dict[str, Any]] = []
    for i, item in enumerate(items):
        results.append(await run_item(i, item))

    with preds_path.open("w", encoding="utf-8") as f:
        for r in results:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    summary = {
        "model": f"ollama/{args.model}",
        "excel": str(excel_path),
        "total": len(results),
        "errors": sum(1 for r in results if (r.get("error") or "").strip()),
        "temperature": float(args.temperature),
        "concurrency": int(args.concurrency),
        "predictions": str(preds_path),
        "summary": str(summary_path),
        "run_dir": str(run_dir),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
