from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

from langchain_core.messages import HumanMessage, SystemMessage

from evo_scoring import ObjectiveScores, ScoreBreakdown, dominates, score_all, weighted_score
from evo_simulation import PhysicsSimulator, SimulationFeedback, physical_score_from_feedback


def extract_js_code(text: str) -> str:
    m = re.search(r"```(?:javascript|js)\s*\n([\s\S]*?)\n```", text or "", re.IGNORECASE)
    if m:
        return m.group(1).strip()
    m2 = re.search(r"```[\s\S]*?\n([\s\S]*?)\n```", text or "")
    if m2:
        return m2.group(1).strip()
    return (text or "").strip()


def load_agent_system_prompt() -> str:
    prompt_path = Path(__file__).resolve().parents[1] / "prompt" / "agent_system.py"
    if prompt_path.exists():
        try:
            import importlib.util

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
            "脚本里必须包含：setCurDir(getSrcDir());",
        ]
    )


@dataclass(frozen=True)
class GameConfig:
    max_iters: int = 6
    alpha: float = 0.5
    beta: float = 0.5
    w_s: float = 0.2
    w_f: float = 0.2
    w_p: float = 0.6
    min_delta: float = 1.0e-3
    target_f_s: float = 0.75
    target_f_f: float = 0.75
    target_f_p: float = 0.70


@dataclass(frozen=True)
class IterationRecord:
    t: int
    focus: str
    scores: ObjectiveScores
    breakdown: ScoreBreakdown
    simulation_feedback: Optional[SimulationFeedback]


@dataclass(frozen=True)
class OptimizationResult:
    script: str
    scores: ObjectiveScores
    breakdown: ScoreBreakdown
    history: List[IterationRecord]


def _as_focus_list(physics_available: bool) -> List[str]:
    if physics_available:
        return ["physics", "fitness", "simplicity"]
    return ["fitness", "simplicity"]


def _converged(prev: Optional[ObjectiveScores], cur: ObjectiveScores, cfg: GameConfig) -> bool:
    if prev is None:
        return False
    d_s = abs(cur.f_s - prev.f_s)
    d_f = abs(cur.f_f - prev.f_f)
    d_p = 0.0
    if prev.f_p is not None and cur.f_p is not None:
        d_p = abs(float(cur.f_p) - float(prev.f_p))
    return max(d_s, d_f, d_p) < cfg.min_delta


def _meets_targets(scores: ObjectiveScores, cfg: GameConfig) -> bool:
    if scores.f_s < cfg.target_f_s:
        return False
    if scores.f_f < cfg.target_f_f:
        return False
    if scores.f_p is not None and float(scores.f_p) < cfg.target_f_p:
        return False
    return True


def _pareto_front(
    items: Sequence[Tuple[str, ObjectiveScores, ScoreBreakdown, Optional[SimulationFeedback]]]
):
    front: List[Tuple[str, ObjectiveScores, ScoreBreakdown, Optional[SimulationFeedback]]] = []
    for i, it in enumerate(items):
        _, s_i, _, _ = it
        dom = False
        for j, ot in enumerate(items):
            if i == j:
                continue
            _, s_j, _, _ = ot
            if dominates(s_j, s_i):
                dom = True
                break
        if not dom:
            front.append(it)
    return front


def _select_best(
    candidates: Sequence[Tuple[str, ObjectiveScores, ScoreBreakdown, Optional[SimulationFeedback]]],
    cfg: GameConfig,
) -> Tuple[str, ObjectiveScores, ScoreBreakdown, Optional[SimulationFeedback]]:
    front = _pareto_front(candidates)
    best = max(front, key=lambda x: weighted_score(x[1], w_s=cfg.w_s, w_f=cfg.w_f, w_p=cfg.w_p))
    return best


def _feedback_text(scores: ObjectiveScores, breakdown: ScoreBreakdown, focus: str) -> str:
    lines: List[str] = []
    lines.append(f"当前分数：f_s={scores.f_s:.3f}，f_f={scores.f_f:.3f}" + (f"，f_p={scores.f_p:.3f}" if scores.f_p is not None else "，f_p=NA"))
    lines.append(f"简约性：R={breakdown.simplicity.get('R')}，L={breakdown.simplicity.get('L')}，目标是减少冗余操作与重复结构。")
    lines.append(f"拟合度：Sim={breakdown.fitness.get('Sim'):.3f}，Cov={breakdown.fitness.get('Cov'):.3f}，目标是覆盖需求关键点并保持语义一致。")
    if breakdown.physics.get("available"):
        lines.append(f"物理合规性：score={breakdown.physics.get('score')}，目标是满足平台约束并产生物理合理结果。")
    else:
        lines.append("物理合规性：当前未接入仿真平台反馈，不计算 f_p，但需保留接口与可扩展结构。")
    if focus == "physics":
        lines.append("本轮优化侧重：物理合规性优先。")
    elif focus == "fitness":
        lines.append("本轮优化侧重：拟合度优先。")
    else:
        lines.append("本轮优化侧重：简约性优先。")
    return "\n".join(lines)


class MultiObjectiveGameOptimizer:
    def __init__(
        self,
        *,
        llm: Any,
        simulator: Optional[PhysicsSimulator] = None,
        config: Optional[GameConfig] = None,
        system_prompt: Optional[str] = None,
    ):
        self.llm = llm
        self.simulator = simulator
        self.cfg = config or GameConfig(
            max_iters=int(os.getenv("CDEM_EVO_MAX_ITERS", "6")),
            alpha=float(os.getenv("CDEM_EVO_ALPHA", "0.5")),
            beta=float(os.getenv("CDEM_EVO_BETA", "0.5")),
            w_s=float(os.getenv("CDEM_EVO_W_S", "0.2")),
            w_f=float(os.getenv("CDEM_EVO_W_F", "0.2")),
            w_p=float(os.getenv("CDEM_EVO_W_P", "0.6")),
        )
        self.system_prompt = system_prompt or load_agent_system_prompt()

    def _simulate(self, *, task: str, script: str) -> Tuple[Optional[float], Optional[SimulationFeedback]]:
        if not self.simulator:
            return None, None
        fb = self.simulator.simulate(task=task, script=script, context=None)
        score = physical_score_from_feedback(fb)
        return score, fb

    def _initial_script(self, *, task: str, tool_context: str) -> str:
        prompt = "\n\n".join(
            [
                f"任务：{task}",
                "外部上下文（可能为空，仅供参考）：",
                tool_context or "(无)",
                "直接生成最终 JavaScript 脚本，只输出一个 ```javascript 代码块```。",
            ]
        )
        msg = self.llm.invoke([SystemMessage(content=self.system_prompt), HumanMessage(content=prompt)])
        return extract_js_code(getattr(msg, "content", "") if msg else "")

    def initial_script(self, *, task: str, tool_context: str = "") -> str:
        return self._initial_script(task=task, tool_context=tool_context)

    def _update_script(
        self,
        *,
        task: str,
        current_script: str,
        scores: ObjectiveScores,
        breakdown: ScoreBreakdown,
        focus: str,
        tool_context: str,
    ) -> str:
        focus_hint = {
            "physics": "优先保证脚本的物理合规性、稳定性与可运行性，加入步长、收敛与能量监测框架（若 API 支持）。",
            "fitness": "优先提高脚本对需求的覆盖与语义匹配，补齐关键功能与参数设置。",
            "simplicity": "优先减少冗余代码与重复调用，保持结构清晰、模块化、可维护。",
        }.get(focus, "综合优化。")
        prompt = "\n\n".join(
            [
                f"任务：{task}",
                "当前脚本：",
                "```javascript",
                current_script.strip(),
                "```",
                "当前评估与反馈：",
                _feedback_text(scores, breakdown, focus),
                "外部上下文（可能为空，仅供参考）：",
                tool_context or "(无)",
                f"改写要求：{focus_hint}",
                "输出要求：只输出一个 ```javascript 代码块```，不要解释，不要工具调用。",
            ]
        )
        msg = self.llm.invoke([SystemMessage(content=self.system_prompt), HumanMessage(content=prompt)])
        return extract_js_code(getattr(msg, "content", "") if msg else "")

    def update_script(
        self,
        *,
        task: str,
        current_script: str,
        scores: ObjectiveScores,
        breakdown: ScoreBreakdown,
        focus: str,
        tool_context: str = "",
    ) -> str:
        return self._update_script(
            task=task,
            current_script=current_script,
            scores=scores,
            breakdown=breakdown,
            focus=focus,
            tool_context=tool_context,
        )

    def optimize(self, *, task: str, tool_context: str = "") -> OptimizationResult:
        history: List[IterationRecord] = []
        current = self._initial_script(task=task, tool_context=tool_context)
        prev_scores: Optional[ObjectiveScores] = None

        for t in range(self.cfg.max_iters):
            phy_score, sim_fb = self._simulate(task=task, script=current)
            scores, breakdown = score_all(query=task, script=current, physics_score=phy_score, alpha=self.cfg.alpha, beta=self.cfg.beta)
            history.append(IterationRecord(t=t, focus="evaluate", scores=scores, breakdown=breakdown, simulation_feedback=sim_fb))

            if _meets_targets(scores, self.cfg) or _converged(prev_scores, scores, self.cfg):
                return OptimizationResult(script=current, scores=scores, breakdown=breakdown, history=history)

            physics_available = scores.f_p is not None
            focuses = _as_focus_list(physics_available)

            candidates: List[Tuple[str, ObjectiveScores, ScoreBreakdown, Optional[SimulationFeedback]]] = []
            candidates.append((current, scores, breakdown, sim_fb))
            for focus in focuses:
                proposal = self._update_script(
                    task=task,
                    current_script=current,
                    scores=scores,
                    breakdown=breakdown,
                    focus=focus,
                    tool_context=tool_context,
                )
                phy_score_p, sim_fb_p = self._simulate(task=task, script=proposal)
                s_p, b_p = score_all(query=task, script=proposal, physics_score=phy_score_p, alpha=self.cfg.alpha, beta=self.cfg.beta)
                history.append(IterationRecord(t=t, focus=focus, scores=s_p, breakdown=b_p, simulation_feedback=sim_fb_p))
                candidates.append((proposal, s_p, b_p, sim_fb_p))

            current, sel_scores, sel_breakdown, sel_fb = _select_best(candidates, self.cfg)
            prev_scores = scores

        phy_score, sim_fb = self._simulate(task=task, script=current)
        scores, breakdown = score_all(query=task, script=current, physics_score=phy_score, alpha=self.cfg.alpha, beta=self.cfg.beta)
        history.append(IterationRecord(t=self.cfg.max_iters, focus="final", scores=scores, breakdown=breakdown, simulation_feedback=sim_fb))
        return OptimizationResult(script=current, scores=scores, breakdown=breakdown, history=history)
