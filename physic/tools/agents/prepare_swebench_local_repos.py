from __future__ import annotations

import argparse
import json
import os
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple


@dataclass(frozen=True)
class RepoNeed:
    repo: str
    commits: Tuple[str, ...]


def _read_jsonl(path: Path) -> Iterable[Dict[str, Any]]:
    with path.open("r", encoding="utf-8", errors="replace") as f:
        for line in f:
            s = (line or "").strip()
            if not s:
                continue
            yield json.loads(s)


def _load_rows(dataset_name_or_path: str, split: str) -> List[Dict[str, Any]]:
    p = Path(dataset_name_or_path).expanduser()
    if p.exists() and p.is_file() and p.suffix.lower() in {".jsonl", ".json"}:
        if p.suffix.lower() == ".json":
            raw = json.loads(p.read_text(encoding="utf-8"))
            if isinstance(raw, list):
                return [x for x in raw if isinstance(x, dict)]
            if isinstance(raw, dict):
                v = raw.get(split, [])
                return [x for x in v if isinstance(x, dict)]
            return []
        return list(_read_jsonl(p))

    from datasets import load_dataset

    ds = load_dataset(dataset_name_or_path, split=split)
    return [dict(r) for r in ds]


def _git(args: List[str], cwd: Optional[Path] = None) -> Tuple[int, str]:
    r = subprocess.run(
        ["git", *args],
        cwd=str(cwd) if cwd else None,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return r.returncode, (r.stdout or "").strip()


def _is_git_repo(path: Path) -> bool:
    if not path.exists() or not path.is_dir():
        return False
    code, _ = _git(["rev-parse", "--git-dir"], cwd=path)
    return code == 0


def _origin_url(repo_dir: Path) -> str:
    code, out = _git(["remote", "get-url", "origin"], cwd=repo_dir)
    return out if code == 0 else ""


def _commit_exists(repo_dir: Path, commit_sha: str) -> bool:
    sha = (commit_sha or "").strip()
    if not sha:
        return False
    code, _ = _git(["cat-file", "-e", f"{sha}^{{commit}}"], cwd=repo_dir)
    return code == 0


def _scan_for_repo(
    repo: str,
    scan_roots: List[Path],
    max_depth: int,
) -> Optional[Path]:
    needle = repo.lower().strip()
    if not needle:
        return None

    def depth(p: Path, root: Path) -> int:
        try:
            rel = p.relative_to(root)
            return len(rel.parts)
        except Exception:
            return 10**9

    for root in scan_roots:
        root = root.expanduser().resolve()
        if not root.exists():
            continue
        for dirpath, dirnames, _ in os.walk(root):
            p = Path(dirpath)
            if depth(p, root) > max_depth:
                dirnames[:] = []
                continue
            if ".git" in dirnames:
                repo_dir = p
                try:
                    url = _origin_url(repo_dir).lower()
                except Exception:
                    url = ""
                if needle and needle in url:
                    return repo_dir
    return None


def _ensure_symlink(target: Path, source: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() or target.is_symlink():
        try:
            target.unlink()
        except Exception:
            pass
    os.symlink(str(source), str(target))


def _repo_key(repo: str) -> str:
    return repo.replace("/", "__")


def _collect_needs(rows: List[Dict[str, Any]]) -> List[RepoNeed]:
    repo_to_commits: Dict[str, Set[str]] = {}
    for r in rows:
        repo = str(r.get("repo") or "").strip()
        base_commit = str(r.get("base_commit") or "").strip()
        if not repo or not base_commit:
            continue
        repo_to_commits.setdefault(repo, set()).add(base_commit)
    out: List[RepoNeed] = []
    for repo, commits in sorted(repo_to_commits.items(), key=lambda x: x[0]):
        out.append(RepoNeed(repo=repo, commits=tuple(sorted(commits))))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", default="princeton-nlp/SWE-bench_Lite")
    ap.add_argument("--split", default="test")
    ap.add_argument("--local_repo_root", required=True)
    ap.add_argument("--scan_root", action="append", default=[])
    ap.add_argument("--max_depth", type=int, default=6)
    ap.add_argument("--link", action="store_true", help="从 scan_root 找到仓库后创建符号链接到 local_repo_root。")
    ap.add_argument("--no_network", action="store_true")
    ap.add_argument(
        "--git_remote_template",
        default=(os.environ.get("CDEM_GIT_REMOTE_TEMPLATE") or "https://github.com/{repo}.git"),
    )
    ap.add_argument("--report_out", default="")
    args = ap.parse_args()

    rows = _load_rows(args.dataset, args.split)
    needs = _collect_needs(rows)

    local_root = Path(args.local_repo_root).expanduser().resolve()
    local_root.mkdir(parents=True, exist_ok=True)
    scan_roots = [Path(x) for x in (args.scan_root or []) if str(x).strip()]

    report: Dict[str, Any] = {
        "dataset": args.dataset,
        "split": args.split,
        "local_repo_root": str(local_root),
        "total_repos": len(needs),
        "repos": [],
    }

    for need in needs:
        key = _repo_key(need.repo)
        target_dir = local_root / key
        rec: Dict[str, Any] = {"repo": need.repo, "repo_key": key, "target_dir": str(target_dir), "status": "", "missing_commits": []}

        if target_dir.exists() and _is_git_repo(target_dir):
            rec["status"] = "ok_existing"
        else:
            found = _scan_for_repo(need.repo, scan_roots=scan_roots, max_depth=int(args.max_depth))
            if found is not None and _is_git_repo(found):
                if args.link:
                    _ensure_symlink(target_dir, found)
                    rec["status"] = "linked"
                    rec["source_dir"] = str(found)
                else:
                    rec["status"] = "found_not_linked"
                    rec["source_dir"] = str(found)
            else:
                if args.no_network:
                    rec["status"] = "missing_no_network"
                else:
                    tpl = (args.git_remote_template or "").strip() or "https://github.com/{repo}.git"
                    url = tpl.format(repo=need.repo)
                    rc, out = _git(["clone", "--quiet", url, str(target_dir)], cwd=local_root)
                    rec["status"] = "cloned" if rc == 0 else "clone_failed"
                    if rc != 0:
                        rec["error"] = out

        repo_dir = target_dir if (target_dir.exists() and _is_git_repo(target_dir)) else None
        missing: List[str] = []
        if repo_dir is not None:
            for c in need.commits:
                if not _commit_exists(repo_dir, c):
                    missing.append(c)
        rec["missing_commits"] = missing
        report["repos"].append(rec)

    if args.report_out:
        out_path = Path(args.report_out).expanduser().resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(str(out_path))
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

