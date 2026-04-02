from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


def _clamp01(x: float) -> float:
    if x < 0.0:
        return 0.0
    if x > 1.0:
        return 1.0
    return x


def _nonempty_lines(text: str) -> List[str]:
    return [ln for ln in (text or "").splitlines() if ln.strip()]


def _normalize_line(line: str) -> str:
    s = re.sub(r"\s+", " ", line.strip())
    s = re.sub(r"[;]+$", "", s).strip()
    return s


def code_scale(js: str) -> int:
    return max(1, len(_nonempty_lines(js)))


def redundancy_ops(js: str) -> int:
    lines = [_normalize_line(ln) for ln in _nonempty_lines(js)]
    freq: Dict[str, int] = {}
    for ln in lines:
        if not ln:
            continue
        freq[ln] = freq.get(ln, 0) + 1
    redundant = 0
    for c in freq.values():
        if c > 1:
            redundant += c - 1
    return max(0, redundant)


def simplicity_score(js: str) -> Tuple[float, Dict[str, Any]]:
    l = code_scale(js)
    r = redundancy_ops(js)
    f = 1.0 - (float(r) / float(l))
    return _clamp01(f), {"R": r, "L": l}


def _tokens_ascii(text: str) -> Iterable[str]:
    for m in re.finditer(r"[A-Za-z_][A-Za-z0-9_]*", text or ""):
        yield m.group(0).lower()


def _tokens_cjk_ngrams(text: str, *, n: int = 2, max_len: int = 200) -> Iterable[str]:
    s = re.sub(r"[^\u4e00-\u9fff]+", "", (text or ""))
    if not s:
        return []
    s = s[:max_len]
    if len(s) <= n:
        return [s] if s else []
    return [s[i : i + n] for i in range(0, len(s) - n + 1)]


def _token_set(text: str) -> List[str]:
    toks = set(_tokens_ascii(text))
    toks.update(_tokens_cjk_ngrams(text, n=2))
    toks = {t for t in toks if t and len(t) >= 2}
    return sorted(toks)


def semantic_similarity(script: str, query: str) -> float:
    s_norm = re.sub(r"\s+", " ", (script or "")).strip().lower()
    q_norm = re.sub(r"\s+", " ", (query or "")).strip().lower()
    seq = SequenceMatcher(None, q_norm, s_norm).ratio()

    a = set(_token_set(query))
    b = set(_token_set(script))
    if not a or not b:
        jac = 0.0
    else:
        jac = len(a & b) / float(len(a | b))
    return _clamp01(0.5 * seq + 0.5 * jac)


def coverage(script: str, query: str, *, max_terms: int = 20) -> Tuple[float, Dict[str, Any]]:
    terms = _token_set(query)
    terms = terms[:max_terms]
    if not terms:
        return 0.0, {"terms": [], "hit": 0, "total": 0}
    hit = 0
    for t in set(terms):
        if t in (script or ""):
            hit += 1
    cov = hit / float(len(set(terms)))
    return _clamp01(cov), {"terms": terms, "hit": hit, "total": len(set(terms))}


def fitness_score(script: str, query: str, *, alpha: float = 0.5, beta: float = 0.5) -> Tuple[float, Dict[str, Any]]:
    sim = semantic_similarity(script, query)
    cov, cov_detail = coverage(script, query)
    f = alpha * sim + beta * cov
    return _clamp01(f), {"Sim": sim, "Cov": cov, **cov_detail}


@dataclass(frozen=True)
class ObjectiveScores:
    f_s: float
    f_f: float
    f_p: Optional[float]


@dataclass(frozen=True)
class ScoreBreakdown:
    simplicity: Dict[str, Any]
    fitness: Dict[str, Any]
    physics: Dict[str, Any]


def score_all(
    *,
    query: str,
    script: str,
    physics_score: Optional[float],
    alpha: float,
    beta: float,
) -> Tuple[ObjectiveScores, ScoreBreakdown]:
    f_s, s_detail = simplicity_score(script)
    f_f, f_detail = fitness_score(script, query, alpha=alpha, beta=beta)
    phy_detail: Dict[str, Any] = {}
    if physics_score is None:
        phy_detail["available"] = False
    else:
        phy_detail["available"] = True
        phy_detail["score"] = float(physics_score)
    scores = ObjectiveScores(f_s=f_s, f_f=f_f, f_p=physics_score)
    breakdown = ScoreBreakdown(simplicity=s_detail, fitness=f_detail, physics=phy_detail)
    return scores, breakdown


def dominates(a: ObjectiveScores, b: ObjectiveScores) -> bool:
    dims: List[Tuple[float, float]] = [(a.f_s, b.f_s), (a.f_f, b.f_f)]
    if a.f_p is not None and b.f_p is not None:
        dims.append((float(a.f_p), float(b.f_p)))
    ge = all(x >= y for x, y in dims)
    g = any(x > y for x, y in dims)
    return ge and g


def weighted_score(scores: ObjectiveScores, *, w_s: float, w_f: float, w_p: float) -> float:
    if scores.f_p is None:
        s = w_s + w_f
        ws = w_s / s if s > 0 else 0.5
        wf = w_f / s if s > 0 else 0.5
        return ws * scores.f_s + wf * scores.f_f
    return w_s * scores.f_s + w_f * scores.f_f + w_p * float(scores.f_p)

