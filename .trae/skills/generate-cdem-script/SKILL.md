---
name: "generate-cdem-script"
description: "Generates CDEM/CDyna JavaScript simulation scripts with physics sanity checks. Invoke when the user asks to write/generate/modify CDEM scripts or when reviewing suspicious physics (gravity, quasi-static vs dynamic, fracture)."
---

# Generate CDEM Script

This skill encapsulates the workflow for generating CDEM software simulation scripts using a multi-agent retrieval-augmented generation (RAG) architecture. It standardizes the inputs, outputs, and parameters required for successful CDEM script generation.

## 0. Physics Guardrails (Default Behavior)

Apply these guardrails by default to improve physical consistency, unless the user explicitly requests otherwise.

### 0.1 Regime Inference

Infer the intended regime from the user description:

- **Quasi-static / displacement-controlled**: “准静态/静力/极其缓慢/恒定位移/位移加载/拉伸/张拉/观察裂纹演化”
- **Dynamic / transient**: “碰撞/冲击/爆炸/传播/掉落/自由坠落/地震波/大变形/动态接触”
- **Thermo-mechanical**: “热-力耦合/温度骤降/热传导/热应力/热裂隙”

### 0.2 Guardrails by Scenario

**A) Quasi-static displacement-controlled fracture/tension**

- Default gravity to **0** unless the user explicitly mentions gravity/self-weight.
- Avoid “helpfully” increasing loading rate to speed up results.
- Prefer minimal, localized boundary bands for top/bottom constraints (thin coordinate ranges).

**B) Dynamic collision/fall/impact**

- Use non-zero gravity only when gravity-driven motion is part of the scenario (fall/sliding).
- Ensure contact settings allow contact evolution under large motion (avoid freezing contacts when motion is large).
- Use tighter output intervals to capture transient peaks.

**C) Thermo-mechanical cracking**

- Enable thermal settings only when requested and keep thermal BC/IC explicit (avoid inventing temperature fields).

## 1. Input Schema

When invoking this skill, ensure the following inputs are gathered from the user or context:

- **`user_description`** (string, required): Natural language description of the simulation requirements (e.g., "建立一个 10x10 的二维模型并划分网格").
- **`simulation_parameters`** (object, optional): Specific physics parameters, such as:
  - `dimensions`: "2D" or "3D"
  - `material_properties`: e.g., density, elastic modulus, Poisson's ratio
  - `boundary_conditions`: e.g., fixed boundaries, applied forces
- **`target_version`** (string, optional): The target version of the CDEM software (e.g., "v2.0", "v3.1"). Defaults to the latest supported version.

## 2. Output Schema

The skill will produce the following outputs:

- **`script_file`** (string): The generated JavaScript code compliant with CDEM API specifications.
- **`dependency_list`** (array of strings): Required CDEM modules/functions used in the script (e.g., `["setCurDir", "Solve", "setGravity"]`).
- **`validation_report`** (object): 
  - `status`: "Success" or "Error"
  - `syntax_check`: Result of static syntax validation
  - `execution_score`: Estimated feasibility score (0-10)

## 3. Tunable Parameters

The agent can adjust these parameters during the generation process:

- **`precision_level`** (string): "High" (fine mesh, smaller time steps) or "Normal" (standard mesh).
- **`max_runtime_s`** (number): Maximum allowed time for script generation and optimization (default: 120s).
- **`resource_limits`** (object): Limits on context window and vector retrieval depth (e.g., `max_retrieved_docs: 10`).

## 4. API Specification & Error Codes

### Internal API Usage

```python
from physic.tools.agents.agent import AgentConstructionModule

agent = AgentConstructionModule(...)
generated_code, gen_time, retrieved_count = agent.generate_code(
    query=user_description, 
    dynamic_sys_prompt="Ensure high precision mesh."
)
```

### Error Codes

- **`CDEM_ERR_001`**: Missing mandatory Prelude (`setCurDir`).
- **`CDEM_ERR_002`**: Missing execution entry point (`Solve`).
- **`CDEM_ERR_003`**: Tool leakage detected in final script output.
- **`CDEM_ERR_004`**: Vector retrieval failed or returned empty.

## 5. Usage Example

**User Request**: "帮我写一个CDEM脚本，建一个长宽为5的二维矩形，底部固定，重力向下。"

**Agent Action**:
1. Identify intent and trigger `generate-cdem-script` skill.
2. Extract parameters: `dimensions="2D"`, `boundary_conditions="bottom fixed"`, `forces="gravity downward"`.
3. Call `AgentConstructionModule.generate_code()`.
4. Output the resulting `script_file` along with the `dependency_list` and `validation_report`.

**User Request**: "圆盘准静态拉伸破裂，顶部极其缓慢向上位移，底部固定。"

**Agent Action**:
1. Infer regime as quasi-static displacement-controlled.
2. Default gravity to 0 (since user did not request gravity).
3. Generate a script with stable quasi-static controls and appropriate boundary bands.

## 6. Test Cases

### Unit Test (Standalone Mode)
Ensure the skill can generate a basic valid script without external dependencies:
```python
def test_generate_basic_script():
    agent = AgentConstructionModule(tools=[])
    code, _, _ = agent.generate_code("生成一个空的2D求解模型")
    assert "Solve('2D'" in code
    assert "setCurDir" in code
```

### Integration Test (Agent Call Mode)
Ensure the skill successfully integrates with ChromaDB and dynamic tool generation:
```python
def test_agent_integration():
    vector_module = VectorKnowledgeBaseModule.connect("path/to/db")
    tool = ToolConstructionModule().build_physics_search_tool(vector_module)
    agent = AgentConstructionModule(tools=[tool], vectorstore=vector_module)
    code, time_taken, docs_count = agent.generate_code("创建一个三维岩石单轴压缩模型")
    assert docs_count > 0
    assert len(code) > 50
```
