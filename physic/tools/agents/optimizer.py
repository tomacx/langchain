
import json
import os
from pathlib import Path
from typing import List, Dict, Any
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from agent import AgentConstructionModule, ToolConstructionModule, VectorKnowledgeBaseModule, CodeSimilarityCalculator, EvaluationResult

class AdaptivePromptOptimizer:
    """自适应迭代提示词优化器"""
    
    def __init__(self, agent_module: AgentConstructionModule, model_name: str = "llama3.1:latest"):
        self.llm = ChatOllama(
            model=model_name,
            temperature=0.1,
            keep_alive="5m"
        )
        self.output_dir = Path(__file__).parent / "optimized_prompts"
        self.output_dir.mkdir(exist_ok=True)
        self.agent_module = agent_module

    def analyze_failure(self, case: Dict[str, Any]) -> str:
        """分析单个失败案例的原因"""
        prompt = f"""
你是一个代码生成系统的优化专家。请分析以下生成失败的案例，找出 Agent 的问题所在。

【用户需求】
{case['query']}

【期望代码 (Ground Truth)】
```javascript
{case.get('ground_truth', 'N/A')}
```

【Agent 生成的代码 (Failed)】
```javascript
{case['generated_code']}
```

【评估指标】
- 相似度: {case['similarity_score']}
- 功能分: {case['functionality_score']}
- 错误信息: {case['error_message']}

请简要分析：
1. Agent 是否理解了需求？
2. Agent 是否正确使用了工具/API？
3. Agent 生成的代码与期望代码的主要差距在哪里？（例如：缺少特定模块、参数错误、逻辑缺失）
4. 这是 Prompt 的问题（指令不清）还是 Search 的问题（没查到资料）？

请输出一段简短的分析（100字以内）。
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content

    def optimize_and_retry(self, case: Dict[str, Any], max_iterations: int = 3) -> Dict[str, Any]:
        """
        对单个案例进行【生成 -> 评估 -> 优化 -> 重试】的闭环迭代
        """
        query = case['query']
        ground_truth = case.get('ground_truth', "")
        filename = case['filename']
        current_dynamic_prompt = ""
        best_result = None
        best_score = -1.0
        
        print(f"\n🔄 开始自适应优化: {filename}")
        print(f"   目标: 提升相似度 (当前: {case['similarity_score']:.3f})")

        for i in range(max_iterations):
            print(f"\n   --- Iteration {i+1}/{max_iterations} ---")
            
            # 1. 生成代码 (带动态 Prompt)
            generated_code, gen_time, retrieved_count = self.agent_module.generate_code(
                query, 
                verbose=False,
                dynamic_sys_prompt=current_dynamic_prompt
            )
            
            # 2. 评估
            similarity = CodeSimilarityCalculator.calculate_similarity(ground_truth, generated_code)
            print(f"   生成完毕。相似度: {similarity:.4f} (GT length: {len(ground_truth)})")
            
            # 更新最佳结果
            if similarity > best_score:
                best_score = similarity
                best_result = {
                    "generated_code": generated_code,
                    "similarity_score": similarity,
                    "iteration": i+1,
                    "used_prompt": current_dynamic_prompt
                }
            
            # 3. 判断是否满足要求 (比如 > 0.8 或比原始提升显著)
            if similarity > 0.8:
                print("   ✅ 达到优秀标准，提前结束优化。")
                break
                
            # 4. 分析原因并生成新的 Prompt 指令
            if i < max_iterations - 1:
                # 构造临时失败案例对象用于分析
                temp_fail_case = {
                    "query": query,
                    "ground_truth": ground_truth,
                    "generated_code": generated_code,
                    "similarity_score": similarity,
                    "functionality_score": 0, # 暂不计算
                    "error_message": ""
                }
                
                analysis = self.analyze_failure(temp_fail_case)
                print(f"   故障分析: {analysis[:50]}...")
                
                # 生成针对性的微调指令
                refinement_prompt = f"""
                基于上述分析，请生成一条**简短、直接**的指令，告诉 Agent 在下一次生成时应该注意什么，以修正上述错误。
                例如："务必使用 igeo.Mirror 函数" 或 "参数 density 不能为负数"。
                不要包含解释，直接输出指令内容。
                """
                instruction = self.llm.invoke([
                    HumanMessage(content=f"分析:\n{analysis}\n\n{refinement_prompt}")
                ]).content.strip()
                
                print(f"   生成的微调指令: {instruction}")
                
                # 累加指令 (也可以选择替换，这里选择追加以积累经验)
                current_dynamic_prompt += f"\n- {instruction}"

        print(f"🏁 优化结束。最佳相似度: {best_score:.4f} (提升: {best_score - case['similarity_score']:+.4f})")
        return best_result

    def run_adaptive_loop(self, results_json: str):
        """运行整个数据集的自适应循环"""
        results_path = Path(results_json)
        docs_root = results_path.parent.parent.parent.parent / "docs" / "案例"
        
        with open(results_json, 'r', encoding='utf-8') as f:
            data = json.load(f)

        failures = []
        for case in data['results']:
            if case['similarity_score'] < 0.5: # 设定一个筛选阈值
                gt_file = docs_root / case['filename']
                if gt_file.exists():
                    with open(gt_file, 'r', encoding='utf-8') as f:
                        case['ground_truth'] = f.read()
                    failures.append(case)

        print(f"📉 筛选出 {len(failures)} 个低分案例进行深度优化...")
        
        optimized_results = []
        for case in failures[:3]: # 演示模式：只跑前3个
            opt_res = self.optimize_and_retry(case)
            optimized_results.append({
                "filename": case['filename'],
                "original_score": case['similarity_score'],
                "optimized_score": opt_res['similarity_score'],
                "best_code": opt_res['generated_code'],
                "effective_instructions": opt_res['used_prompt']
            })
            
        # 保存优化报告
        report_path = self.output_dir / "adaptive_optimization_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(optimized_results, f, ensure_ascii=False, indent=2)
        print(f"✅ 自适应优化报告已保存: {report_path}")

if __name__ == "__main__":
    # 初始化环境 (复用 agent.py 中的逻辑)
    kb_path = Path("/Users/cxh/Codes/langchain/physic/tools/knowledge_base")
    vectorstore = VectorKnowledgeBaseModule.connect(str(kb_path))
    tools_module = ToolConstructionModule()
    search_tool = tools_module.build_physics_search_tool(vectorstore)
    
    agent_module = AgentConstructionModule(tools=[search_tool])
    
    optimizer = AdaptivePromptOptimizer(agent_module)
    
    results_path = Path(__file__).parent / "evaluation_results.2.24.5" / "training_set_results.json"
    if results_path.exists():
        optimizer.run_adaptive_loop(str(results_path))
    else:
        print(f"❌ 未找到结果文件: {results_path}")
