from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional, Protocol, TypedDict


class SimulationFeedback(TypedDict, total=False):
    status: Literal["failed", "partial", "passed", "unknown"]
    score: float
    violations: List[str]
    error: str
    raw: Any


class PhysicsSimulator(Protocol):
    def simulate(
        self,
        *,
        task: str,
        script: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> SimulationFeedback: ...


def _clamp01(x: float) -> float:
    if x < 0.0:
        return 0.0
    if x > 1.0:
        return 1.0
    return x


def normalize_simulation_feedback(payload: Any) -> SimulationFeedback:
    if payload is None:
        return {"status": "unknown"}
    if isinstance(payload, dict):
        status = payload.get("status") or payload.get("state") or payload.get("result") or "unknown"
        status = str(status).lower().strip()
        if status not in {"failed", "partial", "passed", "unknown"}:
            status = "unknown"

        score = payload.get("score")
        if score is None:
            score = payload.get("f_p") or payload.get("fp") or payload.get("physical_score")

        violations = payload.get("violations")
        if violations is None:
            violations = payload.get("constraint_violations") or payload.get("errors") or payload.get("warnings")
        if isinstance(violations, str):
            violations = [violations]
        if not isinstance(violations, list):
            violations = []
        violations = [str(v) for v in violations if v]

        error = payload.get("error") or payload.get("message") or payload.get("exception") or ""
        out: SimulationFeedback = {"status": status, "raw": payload}
        if isinstance(score, (int, float)):
            out["score"] = float(score)
        if violations:
            out["violations"] = violations
        if error:
            out["error"] = str(error)
        return out
    return {"status": "unknown", "raw": payload}


def physical_score_from_feedback(feedback: Optional[SimulationFeedback]) -> Optional[float]:
    if not feedback:
        return None
    if "score" in feedback and isinstance(feedback.get("score"), (int, float)):
        return _clamp01(float(feedback["score"]))

    status = str(feedback.get("status", "unknown") or "unknown").lower().strip()
    if status == "failed":
        return 0.0
    if status == "passed":
        return 1.0
    if status == "partial":
        violations = feedback.get("violations") or []
        if violations:
            return _clamp01(1.0 - min(1.0, float(len(violations)) / 10.0))
        return 0.5
    return None


class NullPhysicsSimulator:
    def simulate(
        self,
        *,
        task: str,
        script: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> SimulationFeedback:
        return {"status": "unknown"}
