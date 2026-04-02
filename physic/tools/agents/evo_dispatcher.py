from __future__ import annotations

from typing import Any, Dict, Iterable, List, Sequence, Tuple

from evo_toolbox import EvolutionaryToolbox, UtilityVector, _safe_mean


def _dominates(a: UtilityVector, b: UtilityVector, *, use_physics: bool) -> bool:
    if use_physics:
        ge = (a[0] >= b[0] and a[1] >= b[1] and a[2] >= b[2])
        g = (a[0] > b[0] or a[1] > b[1] or a[2] > b[2])
        return ge and g
    ge = (a[0] >= b[0] and a[1] >= b[1])
    g = (a[0] > b[0] or a[1] > b[1])
    return ge and g


def _pareto_front(candidates: Sequence[Tuple[Tuple[str, ...], UtilityVector]], *, use_physics: bool):
    front: List[Tuple[Tuple[str, ...], UtilityVector]] = []
    for combo, u in candidates:
        dominated = False
        for other_combo, other_u in candidates:
            if other_combo == combo:
                continue
            if _dominates(other_u, u, use_physics=use_physics):
                dominated = True
                break
        if not dominated:
            front.append((combo, u))
    return front


def _weighted_score(u: UtilityVector, *, w_s: float, w_f: float, w_p: float, use_physics: bool) -> float:
    if not use_physics:
        s = w_s + w_f
        ws = w_s / s if s > 0 else 0.5
        wf = w_f / s if s > 0 else 0.5
        return ws * u[0] + wf * u[1]
    return w_s * u[0] + w_f * u[1] + w_p * u[2]


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


class ToolComboDispatcher:
    def __init__(
        self,
        toolbox: EvolutionaryToolbox,
        *,
        max_combo: int = 3,
        w_s: float = 0.2,
        w_f: float = 0.2,
        w_p: float = 0.6,
    ):
        self.toolbox = toolbox
        self.max_combo = max_combo
        self.w_s = w_s
        self.w_f = w_f
        self.w_p = w_p

    def choose_tools(self, *, physics_available: bool) -> Tuple[List[str], Dict[str, Any]]:
        names = self.toolbox.list_tools()
        if not names:
            return [], {"reason": "no_tools"}

        metas = self.toolbox.snapshot_registry()
        candidates: List[Tuple[Tuple[str, ...], UtilityVector]] = []
        for k in range(1, min(self.max_combo, len(names)) + 1):
            for combo in _combinations(names, k):
                u = _safe_mean([metas[n].get("mean_utility", (0.0, 0.0, 0.0)) for n in combo])
                candidates.append((combo, u))
        front = _pareto_front(candidates, use_physics=physics_available)
        best = max(
            front,
            key=lambda x: _weighted_score(
                x[1],
                w_s=self.w_s,
                w_f=self.w_f,
                w_p=self.w_p,
                use_physics=physics_available,
            ),
        )
        return list(best[0]), {"pareto_front_size": len(front), "best_utility": best[1]}

