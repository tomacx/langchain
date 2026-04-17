from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from typing import Any, Dict, Iterable, List, Literal, Optional, Sequence, Tuple


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


def _extract_diff_files(patch: str) -> List[str]:
    files: List[str] = []
    for line in (patch or "").splitlines():
        if line.startswith("diff --git "):
            parts = line.split()
            if len(parts) >= 4:
                a_path = parts[2].strip()
                b_path = parts[3].strip()
                for p in (a_path, b_path):
                    if p.startswith("a/") or p.startswith("b/"):
                        p = p[2:]
                    p = p.strip()
                    if p:
                        files.append(p)
    return sorted({f for f in files if f})


def _extract_query_file_hints(query: str) -> List[str]:
    q = query or ""
    hits = re.findall(r"(?i)([A-Za-z0-9_./-]+\\.(?:py|js|ts|tsx|jsx|java|go|rs|c|cc|cpp|h|hpp|md|txt|yml|yaml|toml|ini|json))", q)
    cleaned = []
    for h in hits:
        s = str(h).strip().lstrip("./")
        if s and s not in cleaned:
            cleaned.append(s)
    return cleaned[:40]


def _strip_diff_noise(patch: str) -> str:
    out: List[str] = []
    for ln in (patch or "").splitlines():
        if ln.startswith(("diff --git ", "index ", "--- ", "+++ ", "@@ ")):
            continue
        if ln.startswith(("new file mode", "deleted file mode", "similarity index", "rename from", "rename to")):
            continue
        out.append(ln)
    return "\n".join(out).strip()


def _jaccard(a: Sequence[str], b: Sequence[str]) -> float:
    sa = set(a)
    sb = set(b)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / float(len(sa | sb))


def fitness_score(
    script: str,
    query: str,
    *,
    alpha: float = 0.5,
    beta: float = 0.5,
    domain: Domain = "cdem_js",
) -> Tuple[float, Dict[str, Any]]:
    if domain == "swebench_patch":
        patch_files = _extract_diff_files(script)
        query_files = _extract_query_file_hints(query)
        if query_files:
            file_recall = len(set(patch_files) & set(query_files)) / float(max(1, len(set(query_files))))
        else:
            file_recall = 0.0
        patch_body = _strip_diff_noise(script)
        sim = semantic_similarity(patch_body, query)
        tok_overlap = _jaccard(_token_set(query), _token_set(patch_body))
        cov, cov_detail = coverage(patch_body, query)
        f = 0.45 * _clamp01(file_recall) + 0.25 * sim + 0.20 * tok_overlap + 0.10 * cov
        return _clamp01(f), {
            "Sim": sim,
            "Cov": cov,
            "FileRecall": _clamp01(file_recall),
            "TokJac": _clamp01(tok_overlap),
            "patch_files": patch_files,
            "query_files": query_files,
            **cov_detail,
        }
    sim = semantic_similarity(script, query)
    cov, cov_detail = coverage(script, query)
    f = alpha * sim + beta * cov
    return _clamp01(f), {"Sim": sim, "Cov": cov, **cov_detail}


Domain = Literal["cdem_js", "swebench_patch", "gaia_text", "generic_text"]


def _count_balanced_pairs(text: str) -> Dict[str, bool]:
    s = text or ""
    return {
        "braces_balanced": s.count("{") == s.count("}"),
        "parens_balanced": s.count("(") == s.count(")"),
        "brackets_balanced": s.count("[") == s.count("]"),
    }


def cdem_static_physics_score(script: str, query: str = "") -> Tuple[float, Dict[str, Any]]:
    s = (script or "").strip()
    ql = (query or "").lower()
    score = 1.0
    has_prelude = "setCurDir(getSrcDir());" in s
    has_solve = bool(re.search(r"\bSolve\s*\(|\.\s*Solve\s*\(", s))
    has_infinite_loop = bool(re.search(r"\bwhile\s*\(\s*true\s*\)", s))
    pairs = _count_balanced_pairs(s)
    score -= 0.25 if not has_prelude else 0.0
    score -= 0.25 if ("cdem" in ql or "cdyna" in ql) and not has_solve else 0.0
    score -= 0.25 if has_infinite_loop else 0.0
    score -= 0.15 if not pairs["braces_balanced"] else 0.0
    score -= 0.10 if not pairs["parens_balanced"] else 0.0
    dt_penalty = 0.0
    m = re.search(r"\b(dt|time_step|timestep)\s*=\s*([0-9]*\.?[0-9]+(?:e[-+]?\d+)?)", s, re.IGNORECASE)
    if m:
        try:
            dt = float(m.group(2))
        except Exception:
            dt = None
        if dt is not None:
            if dt <= 0:
                dt_penalty = 0.35
            elif dt >= 5.0e-2:
                dt_penalty = 0.20
            elif dt >= 1.0e-2:
                dt_penalty = 0.10
    score -= dt_penalty
    has_energy = any(k in s.lower() for k in ["energy", "ekin", "epot", "monitor", "history"])
    score -= 0.05 if ("quasi" in ql or "准静态" in (query or "")) and not has_energy else 0.0
    s_low = s.lower()
    has_supercdem = ("supercdem" in s_low) or ("super-cdem" in s_low)
    has_mudsim = "mudsim" in s_low
    score -= 0.35 if (("supercdem" not in ql) and has_supercdem) else 0.0
    score -= 0.20 if (("mudsim" not in ql) and has_mudsim) else 0.0
    score = _clamp01(score)
    return score, {
        "available": True,
        "score": float(round(score, 4)),
        "checks": {
            "has_prelude": has_prelude,
            "has_solve": has_solve,
            "has_infinite_loop": has_infinite_loop,
            **pairs,
            "dt_penalty": float(round(dt_penalty, 4)),
            "has_energy_or_monitor": bool(has_energy),
            "has_supercdem": bool(has_supercdem),
            "has_mudsim": bool(has_mudsim),
        },
    }


def _extract_patch_start(text: str) -> Tuple[str, bool, int]:
    s = (text or "").strip()
    if not s:
        return "", False, -1
    idx = s.find("diff --git ")
    if idx < 0:
        return s, False, -1
    return s[idx:].strip(), True, idx


def swebench_patch_compliance_score(text: str) -> Tuple[float, Dict[str, Any]]:
    raw = (text or "").strip()
    patch, has_diff, idx = _extract_patch_start(raw)
    score = 1.0
    if not has_diff:
        score -= 0.55
    if "```" in raw:
        score -= 0.35
    if idx not in (-1, 0):
        score -= 0.15
    has_file_markers = ("--- " in patch) and ("+++ " in patch)
    has_hunk = "@@" in patch
    score -= 0.20 if not has_file_markers else 0.0
    score -= 0.10 if not has_hunk else 0.0
    pairs = _count_balanced_pairs(patch)
    score -= 0.05 if not pairs["brackets_balanced"] else 0.0
    score = _clamp01(score)
    return score, {
        "available": True,
        "score": float(round(score, 4)),
        "checks": {
            "has_diff_header": bool(has_diff),
            "diff_starts_at_0": bool(idx == 0),
            "has_file_markers": bool(has_file_markers),
            "has_hunk": bool(has_hunk),
            "has_fence": bool("```" in raw),
            **pairs,
        },
    }


def gaia_protocol_score(text: str) -> Tuple[float, Dict[str, Any]]:
    t = (text or "").strip()
    score = 1.0
    if not t:
        return 0.0, {"available": True, "score": 0.0, "checks": {"empty": True}}
    if "```" in t:
        score -= 0.35
    if t.startswith("{") and t.endswith("}"):
        score -= 0.35
    lines = [ln.strip() for ln in t.splitlines() if ln.strip()]
    is_single_line = len(lines) == 1
    tool_ok = bool(re.match(r"(?im)^\s*TOO[LL]\s+(web_search|read_webpage|python_calculator)\s*:\s*.+\s*$", t))
    final_ok = bool(re.match(r"(?im)^\s*Final\s*answer\s*:\s*.+\s*$", t))
    if tool_ok and not final_ok:
        score = min(score, 1.0)
    elif final_ok and not tool_ok:
        score = min(score, 0.95)
    if not is_single_line:
        score -= 0.25
    if not (tool_ok or final_ok):
        score -= 0.55
    score = _clamp01(score)
    return score, {
        "available": True,
        "score": float(round(score, 4)),
        "checks": {
            "single_line": bool(is_single_line),
            "tool_line": bool(tool_ok),
            "final_line": bool(final_ok),
            "has_fence": bool("```" in t),
            "looks_like_json": bool(t.startswith("{") and t.endswith("}")),
        },
    }


def generic_compliance_score(text: str) -> Tuple[float, Dict[str, Any]]:
    t = (text or "").strip()
    if not t:
        return 0.0, {"available": True, "score": 0.0, "checks": {"empty": True}}
    score = 1.0
    if t.startswith("{") and t.endswith("}"):
        score -= 0.25
    if "```" in t:
        score -= 0.15
    score = _clamp01(score)
    return score, {"available": True, "score": float(round(score, 4)), "checks": {"has_fence": bool("```" in t)}}


def compliance_score(domain: Domain, script: str, query: str = "") -> Tuple[float, Dict[str, Any]]:
    if domain == "cdem_js":
        return cdem_static_physics_score(script, query=query)
    if domain == "swebench_patch":
        return swebench_patch_compliance_score(script)
    if domain == "gaia_text":
        return gaia_protocol_score(script)
    return generic_compliance_score(script)


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
    domain: Domain = "cdem_js",
) -> Tuple[ObjectiveScores, ScoreBreakdown]:
    f_s, s_detail = simplicity_score(script)
    f_f, f_detail = fitness_score(script, query, alpha=alpha, beta=beta, domain=domain)
    if physics_score is None:
        f_p, phy_detail = compliance_score(domain, script, query=query)
    else:
        f_p = float(physics_score)
        phy_detail = {"available": True, "score": float(f_p), "source": "simulator"}
    scores = ObjectiveScores(f_s=f_s, f_f=f_f, f_p=f_p)
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
