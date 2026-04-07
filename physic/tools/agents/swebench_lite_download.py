from __future__ import annotations

import argparse
import json
import importlib
from pathlib import Path


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset_name", default="princeton-nlp/SWE-bench_Lite")
    p.add_argument("--split", default="test")
    p.add_argument(
        "--out",
        default=str(Path(__file__).resolve().parent / "data" / "swebench_lite_test.jsonl"),
    )
    args = p.parse_args()

    out_path = Path(args.out).expanduser().resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        from datasets import load_dataset
    except Exception as e:
        mod_file = None
        mod_path = None
        try:
            m = importlib.import_module("datasets")
            mod_file = getattr(m, "__file__", None)
            mod_path = getattr(m, "__path__", None)
        except Exception:
            pass
        raise RuntimeError(
            "无法导出 SWE-bench 数据集：需要安装正确的 `datasets` 包（HuggingFace Datasets）。\n"
            "- 解决方式：pip install -U datasets\n"
            f"- 诊断：import datasets 的位置 file={mod_file} path={mod_path}"
        ) from e

    ds = load_dataset(args.dataset_name, split=args.split)
    with out_path.open("w", encoding="utf-8") as f:
        for row in ds:
            f.write(json.dumps(dict(row), ensure_ascii=False) + "\n")

    print(str(out_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
