import os
import re
import csv
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict


CASES_ROOT = "/Users/cxh/Codes/langchain/physic/docs/案例"
OUTPUT_JSON = "/Users/cxh/Codes/langchain/physic/dataset_split_results/case_queries_content.json"
OUTPUT_CSV = "/Users/cxh/Codes/langchain/physic/dataset_split_results/case_queries_content.csv"


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
    pattern = r"\b(dyna|blkdyn|rdface|scdem|bcdem|poresp|pdyna|imeshing|igeo)\s*\."
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
    default_query = generate_default_query_from_filename(filename)

    modules_str = "、".join(modules) if modules else "相关物理模块"

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
                "test_queries": [c["user_query"], c["strong_query"], c["default_query"]],
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
