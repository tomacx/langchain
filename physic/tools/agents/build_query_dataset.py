import os
import re
import csv
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CASES_ROOT = PROJECT_ROOT / "docs" / "案例"
DEFAULT_OUTPUT_JSON = PROJECT_ROOT / "dataset_split_results" / "case_queries_content.json"
DEFAULT_OUTPUT_CSV = PROJECT_ROOT / "dataset_split_results" / "case_queries_content.csv"

CASES_ROOT = os.environ.get("CDEM_CASES_ROOT", str(DEFAULT_CASES_ROOT))
OUTPUT_JSON = os.environ.get("CDEM_QUERY_DATASET_JSON", str(DEFAULT_OUTPUT_JSON))
OUTPUT_CSV = os.environ.get("CDEM_QUERY_DATASET_CSV", str(DEFAULT_OUTPUT_CSV))


def determine_category(filename: str) -> str:
    if "CDyna" in filename:
        return "CDyna案例"
    if "GFlow" in filename:
        return "GFlow案例"
    if "MudSim" in filename:
        return "MudSim案例"
    if "SuperCDEM" in filename:
        return "SuperCDEM案例"
    if "建模" in filename or "网格" in filename:
        return "建模及网格案例"
    return "其他案例"


def extract_modules(code: str) -> List[str]:
    pattern = r"\b(dyna|blkdyn|rdface|scdem|bcdem|poresp|pdyna|imeshing|igeo|imesh|gFun|imath|pargen)\s*\."
    modules = sorted(set(re.findall(pattern, code)))
    return modules


def extract_leading_comments(code: str, max_lines: int = 20) -> str:
    lines = code.split("\n")
    comments: List[str] = []
    for line in lines[:max_lines]:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("//"):
            comments.append(stripped.lstrip("/").strip())
        else:
            break
    return " ".join(comments)

def extract_comment_snippets(code: str, max_chars: int = 280) -> str:
    parts: List[str] = []
    for m in re.finditer(r"//\s*(.+)", code):
        s = m.group(1).strip()
        if s and len(s) >= 4:
            parts.append(s)
        if sum(len(x) for x in parts) >= max_chars:
            break
    if sum(len(x) for x in parts) < max_chars:
        for m in re.finditer(r"/\*([\s\S]*?)\*/", code):
            s = re.sub(r"\s+", " ", m.group(1)).strip()
            if s and len(s) >= 8:
                parts.append(s)
            if sum(len(x) for x in parts) >= max_chars:
                break
    text = "；".join(parts)
    return text[:max_chars]

def extract_top_api_calls(code: str, max_items: int = 10) -> List[str]:
    calls = re.findall(r"\b([a-zA-Z_][a-zA-Z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*\(", code)
    filtered: List[str] = []
    for mod, fn in calls:
        if mod in {"console", "Math"}:
            continue
        filtered.append(f"{mod}.{fn}")
    freq: Dict[str, int] = {}
    for c in filtered:
        freq[c] = freq.get(c, 0) + 1
    ranked = sorted(freq.items(), key=lambda x: (-x[1], x[0]))
    return [x[0] for x in ranked[:max_items]]

def extract_geometry_keywords(code: str) -> List[str]:
    keys = []
    patterns = [
        (r"\bigeo\.(Generate[A-Za-z0-9_]+)\b", 6),
        (r"\bigeo\.(Create[A-Za-z0-9_]+)\b", 6),
        (r"\bimeshing\.(\w+)\b", 6),
    ]
    for pat, limit in patterns:
        found = re.findall(pat, code)
        for f in found[:limit]:
            keys.append(f)
    uniq = []
    for k in keys:
        if k not in uniq:
            uniq.append(k)
    return uniq[:10]

def scenario_from_filename(filename: str) -> str:
    name = filename.replace("案例库-", "").replace(".js", "")
    parts = [p for p in name.split("-") if p]
    if len(parts) >= 2:
        return " - ".join(parts[1:])[:80]
    return name[:80]


def generate_default_query_from_filename(filename: str) -> str:
    name = filename.replace("案例库-", "").replace(".js", "")
    parts = name.split("-")
    if len(parts) >= 2:
        category = parts[0]
        description = "-".join(parts[1:])
        return f"请生成一个{category}的脚本，功能是{description}"
    return f"请生成{name}的脚本"


def build_query_for_case(filename: str, code: str) -> Dict:
    category = determine_category(filename)
    modules = extract_modules(code)
    comment_hint = extract_leading_comments(code)
    comment_snippets = extract_comment_snippets(code)
    default_query = generate_default_query_from_filename(filename)

    modules_str = "、".join(modules) if modules else "相关物理模块"
    api_calls = extract_top_api_calls(code)
    api_calls_str = "，".join(api_calls[:8])
    geom_keys = extract_geometry_keywords(code)
    geom_str = "，".join(geom_keys[:6])
    scene = scenario_from_filename(filename)

    precise_query = (
        f"请复现一个{category}的 JavaScript 案例脚本，案例文件名为「{filename}」，场景/主题为：{scene}。"
        f"请严格依据 CDEM 技术手册/API（优先）来选择与确认接口与参数含义。"
        f"必须使用到这些模块：{modules_str}。"
        f"请按“几何建模→网格划分→材料/模型→边界/载荷→求解参数→结果输出/监测”的顺序组织脚本，"
        f"并确保脚本以 setCurDir(getSrcDir()); 开头。"
    )
    if comment_snippets:
        precise_query += f"脚本注释/意图线索：{comment_snippets}。"
    if geom_str:
        precise_query += f"几何/网格相关接口关键词：{geom_str}。"
    if api_calls_str:
        precise_query += f"API 调用关键词（用于检索技术手册）：{api_calls_str}。"

    if comment_hint:
        strong_query = (
            f"我需要一个{category}的脚本，对应的案例文件名是「{filename}」。"
            f"脚本开头的注释这样描述该场景：{comment_hint}。"
            f"请参考已有 CDEM 技术手册和案例，使用{modules_str}等模块，"
            f"生成一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、"
            f"边界条件与载荷、求解参数以及结果监测。"
        )
        user_query = (
            f"我现在要做一个{category}的数值模拟，场景大致是：{comment_hint}。"
            f"请根据 CDEM 技术手册，合理选择{modules_str}等模块，"
            f"帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、"
            f"边界条件与载荷、求解参数和结果监测。"
        )
    else:
        strong_query = (
            f"{default_query}。请参考已有 CDEM 技术手册和案例，使用{modules_str}等模块，"
            f"生成一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、"
            f"边界条件与载荷、求解参数以及结果监测。"
        )
        user_query = (
            f"我想做一个{category}的数值模拟，功能是{default_query.replace('请生成一个', '').replace('的脚本', '')}。"
            f"请根据 CDEM 技术手册，合理选择{modules_str}等模块，"
            f"帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、"
            f"边界条件与载荷、求解参数和结果监测。"
        )

    return {
        "filename": filename,
        "category": category,
        "modules": modules,
        "comment_hint": comment_hint,
        "comment_snippets": comment_snippets,
        "api_calls": api_calls,
        "precise_query": precise_query,
        "default_query": default_query,
        "strong_query": strong_query,
        "user_query": user_query,
    }


def build_query_dataset(
    cases_root: str = CASES_ROOT,
    output_json: str = OUTPUT_JSON,
    output_csv: str = OUTPUT_CSV,
) -> None:
    root_path = Path(cases_root)
    cases: List[Dict] = []
    index = 1

    for dirpath, _, filenames in os.walk(root_path):
        for name in filenames:
            if not name.lower().endswith(".js"):
                continue
            full_path = Path(dirpath) / name
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    code = f.read()
            except Exception as e:
                print(f"❌ 无法读取脚本 {full_path}: {e}")
                continue

            info = build_query_for_case(name, code)
            case_id = f"C{index:04d}"
            info["id"] = case_id
            info["relative_path"] = str(full_path.relative_to(root_path))
            cases.append(info)
            index += 1

    data = {
        "cases_root": str(root_path),
        "total_cases": len(cases),
        "generated_at": datetime.now().isoformat(),
        "cases": [
            {
                "id": c["id"],
                "filename": c["filename"],
                "relative_path": c["relative_path"],
                "category": c["category"],
                "modules": c["modules"],
                "comment_hint": c["comment_hint"],
                "default_query": c["default_query"],
                "test_queries": [c["precise_query"], c["user_query"], c["strong_query"], c["default_query"]],
            }
            for c in cases
        ],
    }

    out_json_path = Path(output_json)
    out_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ 已生成查询数据集 JSON: {out_json_path}")

    out_csv_path = Path(output_csv)
    out_csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "id",
                "filename",
                "relative_path",
                "category",
                "modules",
                "comment_hint",
                "comment_snippets",
                "api_calls",
                "precise_query",
                "default_query",
                "user_query",
                "strong_query",
            ]
        )
        for c in cases:
            writer.writerow(
                [
                    c["id"],
                    c["filename"],
                    c["relative_path"],
                    c["category"],
                    " ".join(c["modules"]),
                    c["comment_hint"],
                    c["comment_snippets"],
                    " ".join(c["api_calls"]),
                    c["precise_query"],
                    c["default_query"],
                    c["user_query"],
                    c["strong_query"],
                ]
            )
    print(f"✅ 已生成查询数据集 CSV(可用 Excel 打开): {out_csv_path}")


def main():
    build_query_dataset()


if __name__ == "__main__":
    main()
