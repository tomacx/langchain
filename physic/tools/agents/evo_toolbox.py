from __future__ import annotations

import ast
import importlib.util
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import BaseTool


UtilityVector = Tuple[float, float, float]


class ToolMeta(TypedDict, total=False):
    name: str
    description: str
    origin: str
    operator_type: str
    call_count: int
    success_count: int
    failure_count: int
    utility_history: List[UtilityVector]
    last_utility: UtilityVector
    mean_utility: UtilityVector


def _safe_mean(vectors: Sequence[UtilityVector]) -> UtilityVector:
    if not vectors:
        return (0.0, 0.0, 0.0)
    s0 = sum(v[0] for v in vectors)
    s1 = sum(v[1] for v in vectors)
    s2 = sum(v[2] for v in vectors)
    n = float(len(vectors))
    return (s0 / n, s1 / n, s2 / n)


def _basic_syntax_check(code: str) -> Tuple[bool, str]:
    try:
        ast.parse(code)
        return True, ""
    except SyntaxError as e:
        return False, f"SyntaxError: {e}"
    except Exception as e:
        return False, str(e)


def _static_safety_check(code: str) -> Tuple[bool, str]:
    deny_imports = {
        "subprocess",
        "socket",
        "requests",
        "httpx",
        "urllib",
        "shutil",
        "pathlib",
        "os",
        "sys",
    }
    deny_calls = {"eval", "exec", "open", "__import__"}
    try:
        tree = ast.parse(code)
    except Exception as e:
        return False, f"parse_failed: {e}"

    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            mods: List[str] = []
            if isinstance(node, ast.Import):
                mods = [n.name.split(".")[0] for n in node.names]
            else:
                mods = [str(node.module or "").split(".")[0]]
            for m in mods:
                if m in deny_imports:
                    return False, f"deny_import:{m}"
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in deny_calls:
                return False, f"deny_call:{node.func.id}"

    for top in tree.body:
        if isinstance(top, ast.Expr) and isinstance(top.value, ast.Constant) and isinstance(top.value.value, str):
            continue
        if isinstance(top, (ast.Import, ast.ImportFrom, ast.ClassDef, ast.Assign, ast.AnnAssign)):
            continue
        return False, f"deny_toplevel:{type(top).__name__}"
    return True, ""


def _slugify(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "_", s.strip().lower())
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "tool"


@dataclass
class ToolRecord:
    tool: BaseTool
    meta: ToolMeta


class EvolutionaryToolbox:
    def __init__(self, evolved_dir: Path):
        self.evolved_dir = evolved_dir
        self._tools: Dict[str, ToolRecord] = {}

    def list_tools(self) -> List[str]:
        return sorted(self._tools.keys())

    def get_tool(self, name: str) -> Optional[BaseTool]:
        rec = self._tools.get(name)
        return rec.tool if rec else None

    def snapshot_registry(self) -> Dict[str, ToolMeta]:
        return {k: dict(v.meta) for k, v in self._tools.items()}

    def register(self, tool: BaseTool, *, origin: str, operator_type: str = "augment") -> None:
        name = tool.name
        meta: ToolMeta = {
            "name": name,
            "description": getattr(tool, "description", "") or "",
            "origin": origin,
            "operator_type": operator_type,
            "call_count": 0,
            "success_count": 0,
            "failure_count": 0,
            "utility_history": [],
            "last_utility": (0.0, 0.0, 0.0),
            "mean_utility": (0.0, 0.0, 0.0),
        }
        self._tools[name] = ToolRecord(tool=tool, meta=meta)

    def record_call(self, tool_names: Sequence[str], utility: UtilityVector, success: bool) -> None:
        for name in tool_names:
            rec = self._tools.get(name)
            if not rec:
                continue
            rec.meta["call_count"] = int(rec.meta.get("call_count", 0)) + 1
            if success:
                rec.meta["success_count"] = int(rec.meta.get("success_count", 0)) + 1
            else:
                rec.meta["failure_count"] = int(rec.meta.get("failure_count", 0)) + 1
            hist = list(rec.meta.get("utility_history", []))
            hist.append(utility)
            rec.meta["utility_history"] = hist
            rec.meta["last_utility"] = utility
            rec.meta["mean_utility"] = _safe_mean(hist)

    def load_from_directory(self) -> None:
        self.evolved_dir.mkdir(parents=True, exist_ok=True)
        for py in sorted(self.evolved_dir.glob("*.py")):
            if py.name == "__init__.py":
                continue
            self._load_module_tools(py)

    def _load_module_tools(self, path: Path) -> None:
        mod_name = f"cdem_evolved_{path.stem}_{int(path.stat().st_mtime)}"
        spec = importlib.util.spec_from_file_location(mod_name, path)
        if not spec or not spec.loader:
            return
        mod = importlib.util.module_from_spec(spec)
        sys.modules[mod_name] = mod
        spec.loader.exec_module(mod)
        for obj in mod.__dict__.values():
            if isinstance(obj, type) and issubclass(obj, BaseTool) and obj is not BaseTool:
                try:
                    if hasattr(obj, "model_rebuild"):
                        obj.model_rebuild()
                    inst = obj()
                except Exception:
                    continue
                self.register(inst, origin=str(path), operator_type=getattr(inst, "operator_type", "augment"))

    def evolve_new_tool(self, llm: Any, goal: str, *, max_attempts: int = 2) -> Tuple[bool, str]:
        self.evolved_dir.mkdir(parents=True, exist_ok=True)
        base_name = f"evolved_{_slugify(goal)[:40]}_{int(time.time())}"
        file_path = self.evolved_dir / f"{base_name}.py"
        system = "\n".join(
            [
                "你将生成一个新的 LangChain BaseTool 子类，用于帮助生成/修复 CDEM JavaScript 脚本。",
                "只输出 Python 源码，不要输出解释。",
                "禁止在 import 时产生副作用；不得读写网络/进程；不得使用 os/sys/subprocess/socket/requests/httpx/urllib/shutil/pathlib。",
                "不得使用 eval/exec/open/__import__。",
                "模块顶层仅允许：import、from import、类定义、常量赋值、docstring。",
                "工具类必须可无参初始化，且包含 name、description、args_schema、_run。",
                "args_schema 只能包含一个字段 task:str。",
                f"工具目标：{goal}",
            ]
        )
        for _ in range(max_attempts):
            msg = llm.invoke([SystemMessage(content=system), HumanMessage(content="输出 Python 源码")])
            code = getattr(msg, "content", "") if msg else ""
            code = code.strip()
            ok_syntax, _ = _basic_syntax_check(code)
            if not ok_syntax:
                continue
            ok_safe, _ = _static_safety_check(code)
            if not ok_safe:
                continue
            file_path.write_text(code, encoding="utf-8")
            try:
                self._load_module_tools(file_path)
            except Exception:
                try:
                    file_path.unlink()
                except Exception:
                    pass
                continue
            return True, str(file_path)
        return False, ""


def fallback_tool_code(goal: str) -> str:
    safe_goal = (goal or "").replace('"', "'")
    return "\n".join(
        [
            "from __future__ import annotations",
            "",
            "from typing import Type",
            "",
            "from langchain_core.tools import BaseTool",
            "from pydantic import BaseModel, Field",
            "",
            "",
            "class ToolInput(BaseModel):",
            "    task: str = Field(..., description='CDEM 脚本生成任务描述')",
            "",
            "",
            "class EvolvedFallbackTool(BaseTool):",
            "    name: str = 'evolved_fallback_guidance'",
            f"    description: str = '进化失败时的保底物理合规性提示：{safe_goal}'",
            "    args_schema: Type[BaseModel] = ToolInput",
            "",
            "    def _run(self, task: str, **kwargs) -> str:",
            "        return '\\n'.join([",
            f"            '工具目标：{safe_goal}',",
            "            '请在脚本中显式加入：步长/收敛/能量监测与终止条件（若 API 支持）。',",
            "            '保持算子化：每段只负责一个物理子过程。',",
            "        ])",
            "",
        ]
    )

