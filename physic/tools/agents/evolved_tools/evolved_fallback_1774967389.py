from __future__ import annotations

from typing import Type

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field


class ToolInput(BaseModel):
    task: str = Field(..., description='CDEM 脚本生成任务描述')


class EvolvedFallbackTool(BaseTool):
    name: str = 'evolved_fallback_guidance'
    description: str = '进化失败时的保底物理合规性提示：补齐需求关键功能覆盖与接口调用模板，并纠正参数与流程'
    args_schema: Type[BaseModel] = ToolInput

    def _run(self, task: str, **kwargs) -> str:
        return '\n'.join([
            '工具目标：补齐需求关键功能覆盖与接口调用模板，并纠正参数与流程',
            '请在脚本中显式加入：步长/收敛/能量监测与终止条件（若 API 支持）。',
            '保持算子化：每段只负责一个物理子过程。',
        ])
