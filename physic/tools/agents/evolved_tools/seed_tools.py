from __future__ import annotations

from typing import Optional, Type

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field


class ToolInput(BaseModel):
    task: str = Field(..., description="CDEM 脚本生成任务描述")


class CDEMScriptSkeletonTool(BaseTool):
    name: str = "cdem_script_skeleton"
    description: str = "提供 CDEM JS 脚本骨架（目录设置、求解器初始化、基本流程）"
    args_schema: Type[BaseModel] = ToolInput

    def _run(self, task: str, **kwargs) -> str:
        return "\n".join(
            [
                "目标：生成可运行的 CDEM JS 脚本。",
                "必须包含：setCurDir(getSrcDir());",
                "建议结构：",
                "1) setCurDir(getSrcDir());",
                "2) 参数区（材料、接触、边界、载荷、步长）",
                "3) 建模/网格/颗粒或块体生成",
                "4) 施加边界与初始条件",
                "5) 求解器设置与运行",
                "6) 结果输出与收敛/能量检查（如果 API 支持）",
            ]
        )


class PhysicsComplianceChecklistTool(BaseTool):
    name: str = "physics_compliance_checklist"
    description: str = "提供极端力学仿真物理合规性检查清单（收敛性、能量、边界一致性）"
    args_schema: Type[BaseModel] = ToolInput

    def _run(self, task: str, **kwargs) -> str:
        return "\n".join(
            [
                "物理合规性优先检查：",
                "- 稳定性：显式积分满足 CFL/临界时间步；若有缩放，说明依据。",
                "- 能量：外功-内能-动能-耗散项的收支合理；避免无物理源的能量爆炸。",
                "- 边界：约束/接触/加载的方向与单位一致；避免过约束导致非物理解。",
                "- 接触：摩擦、粘结、损伤/断裂参数需与材料模型一致。",
                "- 收敛：残差/迭代次数/不平衡力等指标在终止条件内。",
            ]
        )


class AFlowOperatorHintTool(BaseTool):
    name: str = "aflow_operator_hint"
    description: str = "提示将脚本能力拆成可组合算子（AFlow 风格）以便工具协同博弈"
    args_schema: Type[BaseModel] = ToolInput

    def _run(self, task: str, **kwargs) -> str:
        return "\n".join(
            [
                "算子化拆分建议：",
                "- GeometryOperator：几何/网格/颗粒生成",
                "- MaterialOperator：材料与本构参数",
                "- ContactOperator：接触/摩擦/粘结",
                "- BoundaryOperator：边界/加载/初始条件",
                "- SolverOperator：求解器/步长/输出/监测",
                "每个算子只做一件事，便于与其他工具组合与替换。",
            ]
        )

