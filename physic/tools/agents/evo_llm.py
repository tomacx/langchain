from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, List, Optional

try:
    from dotenv import load_dotenv

    load_dotenv(encoding="utf-8")
except Exception:
    pass

try:
    from langchain_ollama import ChatOllama
except Exception:
    ChatOllama = None

try:
    from langchain_openai import ChatOpenAI
except Exception:
    ChatOpenAI = None


@dataclass
class _FakeMsg:
    content: str


class FakeLLM:
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


def get_llm() -> Any:
    provider = (os.environ.get("CDEM_LLM_PROVIDER") or "ollama").strip().lower()
    model = (os.environ.get("CDEM_LLM_MODEL") or "qwen2.5:14b").strip()
    streaming = (os.environ.get("CDEM_STREAMING") or "0").strip().lower() in {"1", "true", "yes", "y"}

    if (os.environ.get("CDEM_EVO_FAKE_LLM") or "0").strip().lower() in {"1", "true", "yes", "y"} or provider == "fake":
        return FakeLLM()

    if provider in {"ollama", "local"}:
        if ChatOllama is None:
            raise RuntimeError("缺少 langchain_ollama，无法使用 ollama provider")
        base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
        return ChatOllama(model=model, base_url=base_url, streaming=streaming)

    if provider in {"bailian", "openai", "openai-compatible", "openai_compatible"}:
        if ChatOpenAI is None:
            raise RuntimeError("缺少 langchain_openai，无法使用 openai-compatible provider")
        base_url = (os.environ.get("CDEM_BAILIAN_BASE_URL") or "https://dashscope.aliyuncs.com/compatible-mode/v1").strip()
        api_key = (
            os.environ.get("CDEM_BAILIAN_API_KEY")
            or os.environ.get("DASHSCOPE_API_KEY")
            or os.environ.get("OPENAI_API_KEY")
            or ""
        ).strip()
        if not api_key:
            raise RuntimeError("缺少 API KEY：请设置 CDEM_BAILIAN_API_KEY / DASHSCOPE_API_KEY / OPENAI_API_KEY")
        return ChatOpenAI(model=model, base_url=base_url, api_key=api_key, streaming=streaming)

    raise ValueError(f"不支持的 provider：{provider}")

