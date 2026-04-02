from __future__ import annotations

from typing import Type

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field


class ToolInput(BaseModel):
    task: str = Field(..., description='CDEM 脚本生成任务描述')


class EvolvedEnergyMonitorHintTool(BaseTool):
    name: str = 'evolved_energy_monitor_hint'
    description: str = '提供能量监测/能量守恒检查的脚本模板片段提示'
    args_schema: Type[BaseModel] = ToolInput

    def _run(self, task: str, **kwargs) -> str:
        return '\n'.join([
            '能量监测建议：',
            '- 在每个输出步记录：动能/内能/外功/耗散（若 API 提供）。',
            '- 若能量漂移超阈值：降低 dt 或调整阻尼/接触参数。',
        ])