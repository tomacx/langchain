---
name: "generate-cdem-script"
description: "Generates CDEM software simulation scripts. Invoke when the user asks to write, generate, or modify CDEM/CDYNA JavaScript simulation scripts based on physical or geometrical requirements."
---

# Generate CDEM Script

This skill encapsulates the workflow for generating CDEM software simulation scripts using a multi-agent retrieval-augmented generation (RAG) architecture. It standardizes the inputs, outputs, and parameters required for successful CDEM script generation.

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
