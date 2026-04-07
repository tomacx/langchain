from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import importlib
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
                "无法从 HuggingFace 加载数据集：需要安装正确的 `datasets` 包（HuggingFace Datasets），或直接传入本地 jsonl/json 文件路径。\n"
                f"- 当前参数 --dataset={dataset_name_or_path}\n"
                "- 解决方式 1：pip install -U datasets\n"
                f"- 解决方式 2：使用本地文件：--dataset {Path(__file__).resolve().parent / 'data' / 'swebench_lite_test.jsonl'}\n"
                f"- 诊断：import datasets 的位置 file={mod_file} path={mod_path}"
            ) from e

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


def _is_git_repo(path: Path) -> bool:
    p = Path(path)
    if not p.exists() or not p.is_dir():
        return False
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            cwd=str(p),
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        return r.returncode == 0
    except Exception:
        return False


def _find_local_repo(repo: str, local_repo_root: Optional[str]) -> Optional[Path]:
    if not local_repo_root:
        return None
    root = Path(local_repo_root).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        return None
    repo_key = repo.replace("/", "__")
    name = repo.split("/")[-1].strip()
    candidates = [
        root / repo_key,
        root / name,
        root / repo,
        root / (repo_key + ".git"),
        root / (name + ".git"),
    ]
    for c in candidates:
        if _is_git_repo(c):
            return c
    return None


def _ensure_repo_cloned(
    repo: str,
    mirror_dir: Path,
    remote_url_template: str,
    local_repo_root: Optional[str] = None,
    no_network: bool = False,
) -> Path:
    local = _find_local_repo(repo, local_repo_root)
    if local is not None:
        return local

    mirror_dir.mkdir(parents=True, exist_ok=True)
    repo_key = repo.replace("/", "__")
    repo_dir = mirror_dir / repo_key
    tpl = (remote_url_template or "").strip() or "https://github.com/{repo}.git"
    url = tpl.format(repo=repo)
    if repo_dir.exists():
        ok = True
        try:
            r = subprocess.run(
                ["git", "remote", "get-url", "origin"],
                cwd=str(repo_dir),
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
            )
            current = (r.stdout or "").strip()
            ok = (r.returncode == 0) and (current == url)
        except Exception:
            ok = False
        if not ok:
            try:
                shutil.rmtree(repo_dir)
            except Exception:
                pass
        else:
            try:
                _git(["fetch", "--quiet", "--all", "--tags", "--prune"], cwd=repo_dir)
            except Exception:
                pass
            return repo_dir
    if no_network:
        raise RuntimeError(
            "当前处于 no_network 模式且未找到本地仓库镜像，无法 clone。\n"
            f"- repo={repo}\n"
            f"- local_repo_root={local_repo_root}\n"
            f"- mirror_dir={mirror_dir}\n"
            "解决方式：\n"
            "1) 先把目标仓库以 git 方式放到 local_repo_root 下（目录名可用 repo.replace('/', '__')），或\n"
            "2) 关闭 no_network 并配置可访问的 git_remote_template / 代理。"
        )
    _git(["clone", "--quiet", url, str(repo_dir)], cwd=mirror_dir)
    return repo_dir


def _commit_exists(repo_dir: Path, commit_sha: str) -> bool:
    sha = (commit_sha or "").strip()
    if not sha:
        return False
    try:
        subprocess.run(
            ["git", "cat-file", "-e", f"{sha}^{{commit}}"],
            cwd=str(repo_dir),
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except subprocess.CalledProcessError:
        return False


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
    if not _commit_exists(repo_dir, base_commit):
        try:
            _git(["fetch", "--quiet", "--all", "--tags", "--prune"], cwd=repo_dir)
        except Exception:
            pass
    if not _commit_exists(repo_dir, base_commit):
        try:
            _git(["fetch", "--quiet", "origin", base_commit], cwd=repo_dir)
        except Exception:
            pass
    if not _commit_exists(repo_dir, base_commit):
        raise RuntimeError(
            "base_commit 在本地镜像仓库中不存在，无法创建 worktree。\n"
            f"- repo_dir={repo_dir}\n"
            f"- base_commit={base_commit}\n"
            "- 可能原因：镜像仓库很旧/clone 不完整/历史被改写。\n"
            "- 解决方式：删除 workdir 下对应 repo 镜像后重试（workdir/repos/<repo>），或换一个 workdir。"
        )
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
    p.add_argument(
        "--git_remote_template",
        default=(os.environ.get("CDEM_GIT_REMOTE_TEMPLATE") or "https://github.com/{repo}.git"),
    )
    p.add_argument(
        "--local_repo_root",
        default=(os.environ.get("CDEM_LOCAL_REPO_ROOT") or ""),
        help="离线模式下的本地仓库根目录（预先 clone 好的 repo 放这里）。",
    )
    p.add_argument(
        "--no_network",
        action="store_true",
        help="禁止任何网络 clone/fetch；仅使用 --local_repo_root 或 workdir 已有 repo。",
    )
    args = p.parse_args()

    os.environ.setdefault("CDEM_SYSTEM_PROMPT_MODE", "generic")
    model_name_for_eval = _sanitize_model_name(args.model_name_or_path)

    here = Path(__file__).resolve().parent
    if str(here) not in sys.path:
        sys.path.insert(0, str(here))
    from agent import AgentConstructionModule, AgentFeatureFlags

    flags = AgentFeatureFlags.from_env()
    flags.enable_tool_query_rewrite = False
    tools = []
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
            repo_dir = _ensure_repo_cloned(
                it.repo,
                repo_mirrors,
                args.git_remote_template,
                local_repo_root=(args.local_repo_root or "").strip() or None,
                no_network=bool(args.no_network),
            )
            wt = _ensure_worktree(repo_dir, worktrees, it.instance_id, it.base_commit)
            os.environ["CDEM_REPO_ROOT"] = str(wt)

            base_prompt = (
                "你是一个软件工程修复智能体。你将拿到一个真实开源仓库与一个问题描述。\n"
                "仓库根目录将提供给你用于定位要修改的文件。\n"
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
