import asyncio
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional


class MetaGPTEvaluator:
    def __init__(
        self,
        model_name: str,
        base_url: Optional[str] = None,
        temperature: float = 0.0,
        max_token: int = 4096,
        stream: bool = False,
        timeout_s: int = 600,
        use_evo: bool = False,
        evo_max_iters: int = 1,
        evo_stall_iters: int = 1,
    ) -> None:
        self.model_name = str(model_name or "").strip()
        self.base_url = (base_url or os.environ.get("METAGPT_OLLAMA_BASE_URL") or "http://localhost:11434/api").strip()
        self.temperature = float(temperature)
        self.max_token = int(max_token)
        self.stream = bool(stream)
        self.timeout_s = int(timeout_s)
        self.use_evo = bool(use_evo)
        self.evo_max_iters = int(evo_max_iters)
        self.evo_stall_iters = int(evo_stall_iters)
        self._llm = None
        self._loop = None
        self._evo_wrapper = None

    def close(self) -> None:
        try:
            if self._loop is not None and (not self._loop.is_closed()):
                self._loop.close()
        except Exception:
            pass
        self._loop = None
        self._evo_wrapper = None

    def __del__(self) -> None:
        try:
            self.close()
        except Exception:
            pass

    def _ensure_metagpt_importable(self) -> None:
        try:
            import metagpt
            _ = metagpt
            return
        except Exception:
            here = Path(__file__).resolve()
            codes_root = here.parents[4]
            metagpt_root = codes_root / "MetaGPT"
            if metagpt_root.exists() and str(metagpt_root) not in sys.path:
                sys.path.insert(0, str(metagpt_root))

    def _ensure_physic_importable(self) -> None:
        try:
            import physic
            _ = physic
            return
        except Exception:
            here = Path(__file__).resolve()
            codes_root = here.parents[4]
            langchain_root = codes_root / "langchain"
            if langchain_root.exists() and str(langchain_root) not in sys.path:
                sys.path.insert(0, str(langchain_root))
            agents_dir = langchain_root / "physic" / "tools" / "agents"
            if agents_dir.exists() and str(agents_dir) not in sys.path:
                sys.path.insert(0, str(agents_dir))

    def _ensure_llm(self) -> None:
        if self._llm is not None:
            return
        self._ensure_metagpt_importable()
        from metagpt.configs.llm_config import LLMConfig
        from metagpt.llm import LLM

        llm_cfg = LLMConfig.model_validate(
            {
                "api_type": "ollama",
                "model": self.model_name,
                "base_url": self.base_url,
                "temperature": float(self.temperature),
                "max_token": int(self.max_token),
                "stream": bool(self.stream),
                "timeout": int(self.timeout_s),
            }
        )
        self._llm = LLM(llm_config=llm_cfg)

    def _ensure_loop(self) -> None:
        try:
            asyncio.get_running_loop()
            raise RuntimeError("MetaGPTEvaluator.run_custom_query() cannot be called inside a running event loop.")
        except RuntimeError as e:
            if "no running event loop" in str(e).lower():
                pass
            elif "cannot be called inside a running event loop" in str(e):
                raise
        if self._loop is None or self._loop.is_closed():
            self._loop = asyncio.new_event_loop()

    def _ensure_evo(self) -> None:
        if not self.use_evo:
            return
        if self._evo_wrapper is not None:
            return
        self._ensure_llm()
        self._ensure_loop()
        self._ensure_physic_importable()
        from physic.tools.agents.evolutionary_single_agent_langgraph import EvolutionaryWrapperAgentConstructionModule

        llm = self._llm
        loop = self._loop

        class _BaseAgent:
            tools = []
            system_prompt = ""

            def generate_code(self, query: str, verbose: bool = False, dynamic_sys_prompt: str = "") -> tuple[str, float, int]:
                _ = verbose
                started = time.time()
                full = (dynamic_sys_prompt.strip() + "\n\n" if dynamic_sys_prompt.strip() else "") + str(query)
                try:
                    text = loop.run_until_complete(asyncio.wait_for(llm.aask(full), timeout=float(self.timeout_s)))
                except Exception:
                    text = ""
                return str(text or ""), float(time.time() - started), 0

            def __init__(self, timeout_s: int):
                self.timeout_s = int(timeout_s)

        base = _BaseAgent(timeout_s=self.timeout_s)
        self._evo_wrapper = EvolutionaryWrapperAgentConstructionModule(
            base_agent=base,
            domain="gaia_text",
            max_iters=int(self.evo_max_iters),
            stall_iters=int(self.evo_stall_iters),
        )

    def run_custom_query(self, query: str, case_filename: Optional[str] = None, verbose: bool = False) -> Dict[str, Any]:
        _ = (case_filename, verbose)
        self._ensure_llm()
        self._ensure_loop()
        self._ensure_evo()
        started = time.time()
        try:
            if self.use_evo and self._evo_wrapper is not None:
                text, _, _ = self._evo_wrapper.generate_code(str(query), verbose=bool(verbose), dynamic_sys_prompt="")
                last_run_metrics = dict(getattr(self._evo_wrapper, "last_run_metrics", None) or {})
            else:
                text = self._loop.run_until_complete(self._llm.aask(str(query)))
                last_run_metrics = {}
        except Exception as e:
            return {
                "generated_code": "",
                "generation_time": float(round(time.time() - started, 3)),
                "retrieved_docs_count": 0,
                "task_steps": [],
                "last_run_metrics": {},
                "error": str(e),
            }
        return {
            "generated_code": str(text or ""),
            "generation_time": float(round(time.time() - started, 3)),
            "retrieved_docs_count": 0,
            "task_steps": [],
            "last_run_metrics": last_run_metrics,
        }
