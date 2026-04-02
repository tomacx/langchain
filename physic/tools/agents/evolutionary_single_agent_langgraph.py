from __future__ import annotations

import ast
import importlib.util
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Literal, Optional, Sequence, Tuple, TypedDict

try:
    from dotenv import load_dotenv

    load_dotenv(encoding="utf-8")
except Exception:
    pass

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import BaseTool

try:
    from langchain_ollama import ChatOllama
except Exception:
    ChatOllama = None

try:
    from langchain_openai import ChatOpenAI
except Exception:
    ChatOpenAI = None

from langgraph.graph import END, START, StateGraph

import evo_game
import evo_llm
import evo_simulation
import evo_scoring
import evo_toolbox as evo_tb


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


class AgentState(TypedDict, total=False):
    task: str
    script_content: str
    tool_registry: Dict[str, ToolMeta]
    feedback_log: List[str]
    utility: UtilityVector
    iteration: int
    selected_tools: List[str]
    validation_passed: bool
    validation_report: Dict[str, Any]
    architect_goal: str


def _safe_mean(vectors: Sequence[UtilityVector]) -> UtilityVector:
    if not vectors:
        return (0.0, 0.0, 0.0)
    s0 = sum(v[0] for v in vectors)
    s1 = sum(v[1] for v in vectors)
    s2 = sum(v[2] for v in vectors)
    n = float(len(vectors))
    return (s0 / n, s1 / n, s2 / n)


def _weighted_score(u: UtilityVector, w: UtilityVector = (0.2, 0.2, 0.6)) -> float:
    f_sim, f_fit, f_phy = u
    base = w[0] * f_sim + w[1] * f_fit + w[2] * f_phy
    phy_penalty = 0.0
    if f_phy < 0.6:
        phy_penalty += (0.6 - f_phy) * 2.0
    return base - phy_penalty


def _dominates(a: UtilityVector, b: UtilityVector) -> bool:
    return (a[0] >= b[0] and a[1] >= b[1] and a[2] >= b[2]) and (a != b)


def _pareto_front(candidates: Sequence[Tuple[Tuple[str, ...], UtilityVector]]) -> List[Tuple[Tuple[str, ...], UtilityVector]]:
    front: List[Tuple[Tuple[str, ...], UtilityVector]] = []
    for combo, u in candidates:
        dominated = False
        for other_combo, other_u in candidates:
            if other_combo == combo:
                continue
            if _dominates(other_u, u):
                dominated = True
                break
        if not dominated:
            front.append((combo, u))
    return front


def _extract_js_code(text: str) -> str:
    m = re.search(r"```(?:javascript|js)\s*\n([\s\S]*?)\n```", text, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    m2 = re.search(r"```[\s\S]*?\n([\s\S]*?)\n```", text)
    if m2:
        return m2.group(1).strip()
    return text.strip()


def _load_agent_system_prompt() -> str:
    prompt_path = Path(__file__).resolve().parents[1] / "prompt" / "agent_system.py"
    if prompt_path.exists():
        try:
            spec = importlib.util.spec_from_file_location("cdem_prompt_agent_system_for_evo", prompt_path)
            mod = importlib.util.module_from_spec(spec)
            assert spec and spec.loader
            spec.loader.exec_module(mod)
            if hasattr(mod, "SYSTEM_PROMPT"):
                return str(mod.SYSTEM_PROMPT)
            if hasattr(mod, "SYSTEM_MESSAGE"):
                return str(mod.SYSTEM_MESSAGE)
        except Exception:
            pass
    return "\n".join(
        [
            "你是一个极端力学 CDEM 仿真脚本生成器。",
            "只输出一个可运行的 JavaScript 脚本代码块。",
            "不要输出 JSON，不要输出工具调用，不要包含任何解释文字。",
            "优先保证物理合规性与稳定性：收敛与能量守恒检查（若 API 支持）。",
            "脚本里必须包含：setCurDir(getSrcDir());",
        ]
    )


def _get_llm():
    return evo_llm.get_llm()


@dataclass
class _FakeMsg:
    content: str


class _FakeLLM:
    def invoke(self, messages: List[Any]) -> _FakeMsg:
        text = "\n".join(getattr(m, "content", "") for m in messages if getattr(m, "content", None))
        if "输出 Python 源码" in text or "BaseTool 子类" in text:
            code = "\n".join(
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
                    "class EvolvedEnergyMonitorHintTool(BaseTool):",
                    "    name: str = 'evolved_energy_monitor_hint'",
                    "    description: str = '提供能量监测/能量守恒检查的脚本模板片段提示'",
                    "    args_schema: Type[BaseModel] = ToolInput",
                    "",
                    "    def _run(self, task: str, **kwargs) -> str:",
                    "        return '\\n'.join([",
                    "            '能量监测建议：',",
                    "            '- 在每个输出步记录：动能/内能/外功/耗散（若 API 提供）。',",
                    "            '- 若能量漂移超阈值：降低 dt 或调整阻尼/接触参数。',",
                    "        ])",
                    "",
                ]
            )
            return _FakeMsg(content=code)
        js = "\n".join(
            [
                "```javascript",
                "setCurDir(getSrcDir());",
                "",
                "var dt = 1.0e-6;",
                "var totalTime = 2.0e-3;",
                "var outInterval = 1.0e-4;",
                "",
                "function monitorEnergy(step, t) {",
                "}",
                "",
                "function monitorConvergence(step, t) {",
                "}",
                "",
                "for (var t = 0.0, step = 0; t <= totalTime; t += dt, step += 1) {",
                "  if (t % outInterval < dt) {",
                "    monitorEnergy(step, t);",
                "    monitorConvergence(step, t);",
                "  }",
                "}",
                "```",
            ]
        )
        return _FakeMsg(content=js)


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
            mods = []
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

    def evolve_new_tool(self, llm, goal: str, *, max_attempts: int = 2) -> Tuple[bool, str]:
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
        for attempt in range(max_attempts):
            msg = llm.invoke([SystemMessage(content=system), HumanMessage(content="输出 Python 源码")])
            code = getattr(msg, "content", "") if msg else ""
            code = code.strip()
            ok_syntax, err = _basic_syntax_check(code)
            if not ok_syntax:
                continue
            ok_safe, err2 = _static_safety_check(code)
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


class GameTheoreticDispatcher:
    def __init__(self, toolbox: EvolutionaryToolbox, *, max_combo: int = 3):
        self.toolbox = toolbox
        self.max_combo = max_combo

    def choose_tools(self) -> Tuple[List[str], Dict[str, Any]]:
        names = self.toolbox.list_tools()
        if not names:
            return [], {"reason": "no_tools"}

        metas = self.toolbox.snapshot_registry()
        candidates: List[Tuple[Tuple[str, ...], UtilityVector]] = []
        for k in range(1, min(self.max_combo, len(names)) + 1):
            for combo in _combinations(names, k):
                u = _safe_mean([metas[n].get("mean_utility", (0.0, 0.0, 0.0)) for n in combo])
                candidates.append((combo, u))
        front = _pareto_front(candidates)
        best = max(front, key=lambda x: _weighted_score(x[1]))
        return list(best[0]), {"pareto_front_size": len(front), "best_utility": best[1]}


def _combinations(items: Sequence[str], k: int) -> Iterable[Tuple[str, ...]]:
    if k == 0:
        yield tuple()
        return
    if k == 1:
        for it in items:
            yield (it,)
        return
    n = len(items)
    idx = list(range(k))
    while True:
        yield tuple(items[i] for i in idx)
        for i in reversed(range(k)):
            if idx[i] != i + n - k:
                break
        else:
            return
        idx[i] += 1
        for j in range(i + 1, k):
            idx[j] = idx[j - 1] + 1


def node_dispatcher_factory(dispatcher: GameTheoreticDispatcher):
    def node(state: AgentState) -> AgentState:
        selected, info = dispatcher.choose_tools()
        log = list(state.get("feedback_log", []))
        log.append(f"dispatcher:selected={selected} info={info}")
        return {
            **state,
            "selected_tools": selected,
            "feedback_log": log,
        }

    return node


def node_generator_factory(toolbox: EvolutionaryToolbox, llm, *, simulator: Optional[Any] = None):
    optimizer = evo_game.MultiObjectiveGameOptimizer(llm=llm, simulator=simulator)

    def node(state: AgentState) -> AgentState:
        task = state.get("task", "")
        selected = list(state.get("selected_tools", []))
        tool_texts: List[str] = []
        for name in selected:
            t = toolbox.get_tool(name)
            if not t:
                continue
            try:
                tool_texts.append(f"[{name}] {t.invoke({'task': task})}")
            except Exception:
                continue
        tool_context = "\n\n".join(tool_texts).strip()
        prev_script = (state.get("script_content") or "").strip()
        focus = (state.get("update_focus") or "fitness").strip()
        game_scores = state.get("game_scores")
        game_breakdown = state.get("game_breakdown")
        if prev_script and game_scores and game_breakdown:
            content = optimizer.update_script(
                task=task,
                current_script=prev_script,
                scores=game_scores,
                breakdown=game_breakdown,
                focus=focus,
                tool_context=tool_context,
            )
        else:
            content = optimizer.initial_script(task=task, tool_context=tool_context)
        log = list(state.get("feedback_log", []))
        log.append(f"generator:tools={selected} chars={len(content)}")
        return {
            **state,
            "script_content": content,
            "feedback_log": log,
            "iteration": int(state.get("iteration", 0)) + 1,
            "tool_registry": toolbox.snapshot_registry(),
        }

    return node


def _score_script(task: str, js: str, physics_score: Optional[float]) -> Tuple[UtilityVector, Dict[str, Any]]:
    alpha = float(os.getenv("CDEM_EVO_ALPHA", "0.5"))
    beta = float(os.getenv("CDEM_EVO_BETA", "0.5"))
    scores, breakdown = evo_scoring.score_all(query=task, script=js, physics_score=physics_score, alpha=alpha, beta=beta)
    f_p = float(scores.f_p) if scores.f_p is not None else 0.0
    target_s = float(os.getenv("CDEM_EVO_TARGET_F_S", "0.75"))
    target_f = float(os.getenv("CDEM_EVO_TARGET_F_F", "0.75"))
    target_p = float(os.getenv("CDEM_EVO_TARGET_F_P", "0.70"))
    passed = (scores.f_s >= target_s) and (scores.f_f >= target_f) and ("search_physics_knowledge" not in js)
    if scores.f_p is not None:
        passed = passed and (float(scores.f_p) >= target_p)
    report = {
        "scores": {"f_s": scores.f_s, "f_f": scores.f_f, "f_p": scores.f_p},
        "breakdown": {"simplicity": breakdown.simplicity, "fitness": breakdown.fitness, "physics": breakdown.physics},
        "passed": passed,
    }
    return (scores.f_s, scores.f_f, f_p), report


def node_validator_factory(toolbox: EvolutionaryToolbox, *, simulator: Optional[Any] = None):
    def node(state: AgentState) -> AgentState:
        task = state.get("task", "")
        raw = state.get("script_content", "")
        js = evo_game.extract_js_code(raw)
        phy_score: Optional[float] = None
        sim_fb: Optional[Dict[str, Any]] = None
        if simulator is not None:
            try:
                raw_fb = simulator.simulate(task=task, script=js, context=None)
            except Exception as e:
                raw_fb = {"status": "failed", "error": str(e)}
            fb = evo_simulation.normalize_simulation_feedback(raw_fb)
            phy_score = evo_simulation.physical_score_from_feedback(fb)
            sim_fb = dict(fb)

        u, report = _score_script(task, js, phy_score)
        if sim_fb is not None:
            report["simulation_feedback"] = sim_fb
        passed = bool(report.get("passed", False))
        selected = list(state.get("selected_tools", []))
        toolbox.record_call(selected, u, passed)

        log = list(state.get("feedback_log", []))
        log.append(f"validator:passed={passed} U={u} report={report}")
        sc = report.get("scores", {}) or {}
        bd = report.get("breakdown", {}) or {}
        game_scores = evo_scoring.ObjectiveScores(
            f_s=float(sc.get("f_s", 0.0)),
            f_f=float(sc.get("f_f", 0.0)),
            f_p=sc.get("f_p", None),
        )
        game_breakdown = evo_scoring.ScoreBreakdown(
            simplicity=bd.get("simplicity", {}) or {},
            fitness=bd.get("fitness", {}) or {},
            physics=bd.get("physics", {}) or {},
        )
        target_s = float(os.getenv("CDEM_EVO_TARGET_F_S", "0.75"))
        target_f = float(os.getenv("CDEM_EVO_TARGET_F_F", "0.75"))
        target_p = float(os.getenv("CDEM_EVO_TARGET_F_P", "0.70"))
        if game_scores.f_p is not None and float(game_scores.f_p) < target_p:
            next_focus = "physics"
        elif game_scores.f_f < target_f:
            next_focus = "fitness"
        elif game_scores.f_s < target_s:
            next_focus = "simplicity"
        else:
            next_focus = "fitness"

        next_goal = ""
        if not passed:
            if next_focus == "physics":
                next_goal = "在脚本中加入物理合规性约束、步长/收敛/能量监测与终止条件模板"
            elif next_focus == "fitness":
                next_goal = "补齐需求关键功能覆盖与接口调用模板，并纠正参数与流程"
            else:
                next_goal = "对脚本进行去冗余与模块化重构的指导模板，减少重复结构"
        return {
            **state,
            "script_content": js,
            "utility": u,
            "validation_passed": passed,
            "validation_report": report,
            "feedback_log": log,
            "architect_goal": next_goal,
            "update_focus": next_focus,
            "game_scores": game_scores,
            "game_breakdown": game_breakdown,
            "tool_registry": toolbox.snapshot_registry(),
        }

    return node


def node_architect_factory(toolbox: EvolutionaryToolbox, llm):
    def node(state: AgentState) -> AgentState:
        goal = (state.get("architect_goal") or "").strip()
        log = list(state.get("feedback_log", []))
        if not goal:
            log.append("architect:skip(no_goal)")
            return {**state, "feedback_log": log}
        existing = toolbox.list_tools()
        for n in existing:
            if goal[:8] in n or evo_tb._slugify(goal) in n:
                log.append("architect:skip(already_covered)")
                return {**state, "feedback_log": log}

        ok, path = toolbox.evolve_new_tool(llm, goal)
        if ok:
            log.append(f"architect:added_tool file={path}")
        else:
            fallback_code = evo_tb.fallback_tool_code(goal)
            ok2, err = evo_tb._basic_syntax_check(fallback_code)
            ok3, err2 = evo_tb._static_safety_check(fallback_code) if ok2 else (False, err)
            if ok2 and ok3:
                toolbox.evolved_dir.mkdir(parents=True, exist_ok=True)
                file_path = toolbox.evolved_dir / f"evolved_fallback_{int(time.time())}.py"
                file_path.write_text(fallback_code, encoding="utf-8")
                try:
                    toolbox.load_from_directory()
                    log.append(f"architect:added_fallback file={file_path}")
                except Exception:
                    log.append("architect:fallback_load_failed")
            else:
                log.append("architect:failed")

        return {
            **state,
            "feedback_log": log,
            "tool_registry": toolbox.snapshot_registry(),
        }

    return node


def _fallback_tool_code(goal: str) -> str:
    safe_goal = goal.replace('"', "'")
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


def build_graph(toolbox: EvolutionaryToolbox, llm, *, simulator: Optional[Any] = None):
    dispatcher = GameTheoreticDispatcher(toolbox)
    graph = StateGraph(AgentState)
    graph.add_node("dispatcher", node_dispatcher_factory(dispatcher))
    graph.add_node("generator", node_generator_factory(toolbox, llm, simulator=simulator))
    graph.add_node("validator", node_validator_factory(toolbox, simulator=simulator))
    graph.add_node("architect", node_architect_factory(toolbox, llm))

    graph.add_edge(START, "dispatcher")
    graph.add_edge("dispatcher", "generator")
    graph.add_edge("generator", "validator")

    def route(state: AgentState) -> Literal["end", "architect"]:
        if state.get("validation_passed", False):
            return "end"
        if int(state.get("iteration", 0)) >= int(os.getenv("CDEM_EVO_MAX_ITERS", "6")):
            return "end"
        return "architect"

    graph.add_conditional_edges("validator", route, {"end": END, "architect": "architect"})
    graph.add_edge("architect", "dispatcher")
    return graph.compile()


def _init_toolbox() -> EvolutionaryToolbox:
    evolved_dir = Path(__file__).resolve().parent / "evolved_tools"
    tb = evo_tb.EvolutionaryToolbox(evolved_dir=evolved_dir)
    tb.load_from_directory()
    return tb


def run_demo(task: str, *, simulator: Optional[Any] = None) -> AgentState:
    toolbox = _init_toolbox()
    llm = _get_llm()
    app = build_graph(toolbox, llm, simulator=simulator)
    init: AgentState = {
        "task": task,
        "script_content": "",
        "tool_registry": toolbox.snapshot_registry(),
        "feedback_log": [],
        "utility": (0.0, 0.0, 0.0),
        "iteration": 0,
        "selected_tools": [],
        "validation_passed": False,
        "validation_report": {},
        "architect_goal": "",
        "update_focus": "fitness",
        "game_scores": None,
        "game_breakdown": None,
    }
    out = app.invoke(init)
    return out


def run_game(task: str, *, simulator: Optional[Any] = None) -> Dict[str, Any]:
    toolbox = _init_toolbox()
    llm = _get_llm()
    selected = toolbox.list_tools()[: int(os.getenv("CDEM_EVO_TOOL_TOPK", "3"))]
    tool_texts: List[str] = []
    for name in selected:
        t = toolbox.get_tool(name)
        if not t:
            continue
        try:
            tool_texts.append(f"[{name}] {t.invoke({'task': task})}")
        except Exception:
            continue
    tool_context = "\n\n".join(tool_texts).strip()
    optimizer = evo_game.MultiObjectiveGameOptimizer(llm=llm, simulator=simulator)
    result = optimizer.optimize(task=task, tool_context=tool_context)
    return {
        "script_content": result.script,
        "scores": {"f_s": result.scores.f_s, "f_f": result.scores.f_f, "f_p": result.scores.f_p},
        "breakdown": {
            "simplicity": result.breakdown.simplicity,
            "fitness": result.breakdown.fitness,
            "physics": result.breakdown.physics,
        },
        "history_len": len(result.history),
    }


if __name__ == "__main__":
    demo_task = os.getenv(
        "CDEM_EVO_DEMO_TASK",
        "生成一个极端力学冲击载荷下的二维块体 CDEM 仿真脚本，要求包含步长控制、收敛与能量监测。",
    )
    mode = (os.getenv("CDEM_EVO_MODE") or "langgraph").strip().lower()
    if mode == "game":
        out = run_game(demo_task)
        print("==== Final Scores ====")
        print(out.get("scores"))
        print("==== Final Script (JS) ====")
        print(out.get("script_content", ""))
        print("==== History Len ====")
        print(out.get("history_len"))
    else:
        result = run_demo(demo_task)
        print("==== Final Utility ====")
        print(result.get("utility"))
        print("==== Final Script (JS) ====")
        print(result.get("script_content", ""))
        print("==== Feedback Log (tail) ====")
        for ln in (result.get("feedback_log", []) or [])[-12:]:
            print(ln)
