from __future__ import annotations

import argparse
import json
from pathlib import Path

from datasets import load_dataset


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

    ds = load_dataset(args.dataset_name, split=args.split)
    with out_path.open("w", encoding="utf-8") as f:
        for row in ds:
            f.write(json.dumps(dict(row), ensure_ascii=False) + "\n")

    print(str(out_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

