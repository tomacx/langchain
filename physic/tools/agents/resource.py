from __future__ import annotations

from typing import Tuple

RLIMIT_NOFILE = 7


def getrlimit(resource: int) -> Tuple[int, int]:
    return (0, 0)


def setrlimit(resource: int, limits: Tuple[int, int]) -> None:
    return None

