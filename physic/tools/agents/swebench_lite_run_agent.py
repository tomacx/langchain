from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


@dataclass(frozen=True)
class SWEbenchInstance:
    instance_id: str
    repo: str
    base_commit: str
    problem_statement: str


def _read_jsonl(path: Path) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    with path.open("r", encoding="utf-8", errors="replace") as f:
        for line in f:
            s = (line or "").strip()
            if not s:
                continue
            rows.append(json.loads(s))
    return rows


def _load_instances(dataset_name_or_path: str, split: str) -> List[SWEbenchInstance]:
    p = Path(dataset_name_or_path).expanduser()
    if p.exists() and p.is_file() and p.suffix.lower() in {".jsonl", ".json"}:
        if p.suffix.lower() == ".json":
            raw = json.loads(p.read_text(encoding="utf-8"))
            rows = raw if isinstance(raw, list) else raw.get(split, [])
        else:
            rows = _read_jsonl(p)
    else:
        from datasets import load_dataset

        ds = load_dataset(dataset_name_or_path, split=split)
        rows = [dict(r) for r in ds]

    out: List[SWEbenchInstance] = []
    for r in rows:
        instance_id = str(r.get("instance_id") or "").strip()
        repo = str(r.get("repo") or "").strip()
        base_commit = str(r.get("base_commit") or "").strip()
        problem_statement = str(r.get("problem_statement") or "").strip()
        if not instance_id or not repo or not base_commit or not problem_statement:
            continue
        out.append(
            SWEbenchInstance(
                instance_id=instance_id,
                repo=repo,
                base_commit=base_commit,
                problem_statement=problem_statement,
            )
        )
    return out


def _git(args: List[str], cwd: Optional[Path] = None) -> None:
    try:
        subprocess.run(
            ["git", *args],
            cwd=str(cwd) if cwd else None,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return
    except subprocess.CalledProcessError as e:
        out = subprocess.run(
            ["git", *args],
            cwd=str(cwd) if cwd else None,
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        ).stdout
        raise RuntimeError((out or "").strip() or f"git failed: {' '.join(args)}") from e


def _ensure_repo_cloned(repo: str, mirror_dir: Path) -> Path:
    mirror_dir.mkdir(parents=True, exist_ok=True)
    repo_key = repo.replace("/", "__")
    repo_dir = mirror_dir / repo_key
    if repo_dir.exists():
        return repo_dir
    url = f"https://github.com/{repo}.git"
    _git(["clone", "--quiet", url, str(repo_dir)], cwd=mirror_dir)
    return repo_dir


def _ensure_worktree(repo_dir: Path, worktree_root: Path, instance_id: str, base_commit: str) -> Path:
    worktree_root.mkdir(parents=True, exist_ok=True)
    wt = worktree_root / instance_id
    if wt.exists():
        try:
            _git(["worktree", "remove", "--force", str(wt)], cwd=repo_dir)
        except Exception:
            pass
        try:
            if wt.exists():
                for p in sorted(wt.rglob("*"), reverse=True):
                    if p.is_file() or p.is_symlink():
                        try:
                            p.unlink()
                        except Exception:
                            pass
                    elif p.is_dir():
                        try:
                            p.rmdir()
                        except Exception:
                            pass
                try:
                    wt.rmdir()
                except Exception:
                    pass
        except Exception:
            pass
    _git(["worktree", "add", "--force", str(wt), base_commit], cwd=repo_dir)
    return wt


def _extract_patch(text: str) -> str:
    t = (text or "").strip()
    if not t:
        return ""
    m = re.search(r"diff --git[\s\S]*", t)
    if m:
        return m.group(0).strip()
    fenced = re.search(r"```(?:diff|patch|text)?\s*([\s\S]*?)```", t, flags=re.IGNORECASE)
    if fenced:
        inner = (fenced.group(1) or "").strip()
        m2 = re.search(r"diff --git[\s\S]*", inner)
        return (m2.group(0) if m2 else inner).strip()
    return t


def _sanitize_model_name(name: str) -> str:
    s = (name or "").strip()
    if not s:
        return "model"
    s = re.sub(r"[^A-Za-z0-9._-]+", "__", s)
    s = re.sub(r"__+", "__", s).strip("_")
    return s or "model"


def _git_apply_check(repo_root: Path, patch_text: str) -> tuple[bool, str]:
    pt = (patch_text or "").strip()
    if not pt:
        return False, "empty patch"
    try:
        r = subprocess.run(
            ["git", "apply", "--check", "--verbose", "--"],
            cwd=str(repo_root),
            input=pt + "\n",
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        ok = (r.returncode == 0)
        return ok, (r.stdout or "").strip()
    except Exception as e:
        return False, str(e)


def _iter_instances(instances: List[SWEbenchInstance], instance_ids: Optional[List[str]], limit: int) -> Iterable[SWEbenchInstance]:
    if instance_ids:
        want = {x.strip() for x in instance_ids if x and x.strip()}
        picked = [it for it in instances if it.instance_id in want]
    else:
        picked = list(instances)
    if limit > 0:
        picked = picked[:limit]
    return picked


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", default="princeton-nlp/SWE-bench_Lite")
    p.add_argument("--split", default="test")
    p.add_argument("--limit", type=int, default=1)
    p.add_argument("--instance_id", action="append", default=[])
    p.add_argument("--workdir", default=str(Path(__file__).resolve().parent / "swebench_workdir"))
    p.add_argument("--model_name_or_path", default=(os.environ.get("CDEM_LLM_MODEL") or "llama3.1:latest"))
    p.add_argument("--predictions_out", default=str(Path(__file__).resolve().parent / "results" / "swebench_predictions.jsonl"))
    p.add_argument("--max_patch_retries", type=int, default=2)
    args = p.parse_args()

    os.environ.setdefault("CDEM_SYSTEM_PROMPT_MODE", "generic")
    model_name_for_eval = _sanitize_model_name(args.model_name_or_path)

    here = Path(__file__).resolve().parent
    if str(here) not in sys.path:
        sys.path.insert(0, str(here))
    from agent import AgentConstructionModule, AgentFeatureFlags, ToolConstructionModule

    flags = AgentFeatureFlags.from_env()
    flags.enable_tool_query_rewrite = False
    tools = ToolConstructionModule(feature_flags=flags).build_gaia_offline_tools()
    agent = AgentConstructionModule(
        tools=tools,
        model_name=args.model_name_or_path,
        enable_preprocessing=False,
        feature_flags=flags,
    )

    workdir = Path(args.workdir).expanduser().resolve()
    repo_mirrors = workdir / "repos"
    worktrees = workdir / "worktrees"
    predictions_out = Path(args.predictions_out).expanduser().resolve()
    predictions_out.parent.mkdir(parents=True, exist_ok=True)

    instances = _load_instances(args.dataset, args.split)
    todo = list(_iter_instances(instances, args.instance_id, args.limit))

    with predictions_out.open("w", encoding="utf-8") as f:
        for it in todo:
            repo_dir = _ensure_repo_cloned(it.repo, repo_mirrors)
            wt = _ensure_worktree(repo_dir, worktrees, it.instance_id, it.base_commit)
            os.environ["GAIA_ROOT"] = str(wt)

            base_prompt = (
                "你是一个软件工程修复智能体。你将拿到一个真实开源仓库与一个问题描述。\n"
                "你可以用工具读取仓库文件内容以理解现状。\n"
                "你的任务：生成一个可以修复该问题的补丁。\n\n"
                "强制输出格式：只输出补丁文本（unified diff），必须以 'diff --git' 开头，禁止输出解释、禁止输出 Markdown 代码块。\n"
                "补丁中的路径必须相对仓库根目录。\n\n"
                f"仓库根目录(绝对路径): {wt}\n"
                f"Repo: {it.repo}\n"
                f"Base commit: {it.base_commit}\n\n"
                f"Problem statement:\n{it.problem_statement}\n"
            )

            patch = ""
            last_err = ""
            last_ok = False
            for attempt in range(max(1, int(args.max_patch_retries) + 1)):
                prompt = base_prompt
                if last_err:
                    prompt = (
                        base_prompt
                        + "\n\n上一次补丁未能通过 git apply --check，请根据报错修复补丁格式/上下文并重新输出完整补丁：\n"
                        + last_err
                    )
                raw, _, _ = agent.generate_code(prompt, verbose=False)
                patch = _extract_patch(raw)
                ok, out = _git_apply_check(wt, patch)
                last_ok = bool(ok)
                if last_ok:
                    break
                last_err = out or "git apply --check failed"
            if not last_ok:
                patch = ""
            rec = {
                "instance_id": it.instance_id,
                "model_name_or_path": model_name_for_eval,
                "model_patch": patch,
            }
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            f.flush()

    print(str(predictions_out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
