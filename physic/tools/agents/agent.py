import os
import json
import time
import difflib
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

# LangChain imports
from langchain_chroma import Chroma
from langchain_core.tools import create_retriever_tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import create_agent
from langchain_core.callbacks import StreamingStdOutCallbackHandler

# 加载提示词（如果有的话）
try:
    from prompt import agent_system
    HAS_CUSTOM_PROMPT = True
except ImportError:
    HAS_CUSTOM_PROMPT = False
    print("⚠️  未找到 prompt.py，使用默认系统提示词")


@dataclass
class EvaluationResult:
    """单个测试用例的评估结果"""
    test_id: str
    filename: str
    category: str
    query: str
    
    # 生成结果
    generated_code: str
    generation_time: float  # 生成耗时（秒）
    
    # 评估指标
    similarity_score: float  # 代码相似度 0-1
    code_quality_score: float  # 代码质量 0-10
    execution_score: float  # 可执行性 0-10
    functionality_score: float  # 功能正确性 0-10
    
    # 检索信息
    retrieved_docs_count: int
    retrieval_quality: str  # "excellent" | "good" | "poor"
    
    # 额外信息
    error_message: str = ""
    notes: str = ""
    evaluation_time: str = ""


class VectorKnowledgeBaseModule:
    """向量知识库模块：负责连接和管理向量数据库"""
    @staticmethod
    def connect(persist_directory: str, collection_name: str = "cdem_knowledge") -> Chroma:
        try:
            print(f"🔄 正在加载 Chroma 数据库: {persist_directory}")
            
            embeddings = OllamaEmbeddings(
                model="bge-m3:latest",
                base_url="http://localhost:11434"
            )

            vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings,
                collection_name=collection_name
            )

            # 检查数据库中的文档数量
            try:
                count = vectorstore._collection.count()
                print(f"✅ 向量数据库加载成功，包含 {count} 个文档块")
            except:
                print("✅ 向量数据库加载成功")
            
            return vectorstore

        except Exception as e:
            print(f"❌ 加载向量数据库失败: {e}")
            raise


class VectorStoreManager:
    """(Deprecated) 兼容旧代码的向量数据库管理器"""
    @staticmethod
    def connect(persist_directory: str, collection_name: str):
        return VectorKnowledgeBaseModule.connect(persist_directory, collection_name)


class QueryGenerator:
    """从文件名生成查询"""
    
    @staticmethod
    def generate_query_from_filename(filename: str) -> str:
        """
        从文件名生成查询语句
        
        例如：
        - "案例库-SuperCDEM案例-...破漏斗-BallBlast_5_5_2.5.js"
          → "创建SuperCDEM球形爆破漏斗案例"
        """
        # 移除"案例库-"前缀和".js"后缀
        clean_name = filename.replace("案例库-", "").replace(".js", "")
        
        # 提取关键词
        parts = clean_name.split("-")
        
        if len(parts) >= 2:
            category = parts[0]  # 例如 "SuperCDEM案例"
            description = "-".join(parts[1:])  # 剩余部分
            
            # 构建查询
            query = f"请生成一个{category}的脚本，功能是{description}"
        else:
            query = f"请生成{clean_name}的脚本"
        
        return query


class CodeSimilarityCalculator:
    """代码相似度计算"""
    
    @staticmethod
    def calculate_similarity(code1: str, code2: str) -> float:
        """计算两段代码的相似度 (0-1)"""
        if not code1 or not code2:
            return 0.0
        
        # 标准化代码
        code1_normalized = CodeSimilarityCalculator._normalize_code(code1)
        code2_normalized = CodeSimilarityCalculator._normalize_code(code2)
        
        # 使用difflib计算相似度
        matcher = difflib.SequenceMatcher(None, code1_normalized, code2_normalized)
        return round(matcher.ratio(), 4)
    
    @staticmethod
    def _normalize_code(code: str) -> str:
        """标准化代码：移除空行、统一空格"""
        lines = code.split('\n')
        normalized_lines = [line.strip() for line in lines if line.strip()]
        return '\n'.join(normalized_lines)


class CodeQualityEvaluator:
    """代码质量评估"""
    
    @staticmethod
    def evaluate(code: str) -> float:
        """评估代码质量 (0-10)"""
        if not code or len(code.strip()) < 10:
            return 0.0
        
        lines = code.split('\n')
        total_lines = len(lines)
        code_lines = len([l for l in lines if l.strip() and not l.strip().startswith('//')])
        comment_lines = len([l for l in lines if l.strip().startswith('//')])
        
        score = 5.0  # 基础分
        
        # 有注释加分
        if comment_lines > 0:
            comment_ratio = comment_lines / max(code_lines, 1)
            if comment_ratio > 0.1:
                score += 2
            elif comment_ratio > 0.05:
                score += 1
        
        # 有函数结构加分
        if 'function' in code.lower() or '=>' in code:
            score += 1
        
        # 代码长度合理加分
        if 20 < code_lines < 500:
            score += 1
        
        # 有适当空行加分
        blank_lines = total_lines - code_lines - comment_lines
        if blank_lines > 0:
            score += 1
        
        return min(10.0, score)


class QueryPreprocessor:
    """LLM预处理模块：用于对用户输入的query进行智能扩写与需求澄清"""
    
    def __init__(self, llm, confidence_threshold: float = 0.7):
        self.llm = llm
        self.confidence_threshold = confidence_threshold
        
    def expand_query(self, query: str) -> Dict[str, Any]:
        """
        扩写用户查询
        
        Returns:
            {
                "expanded_prompt": str,  # 扩写后的完整提示词
                "confidence": float,     # 置信度 0-1
                "structured_data": dict, # 结构化数据
                "needs_clarification": bool # 是否需要澄清
            }
        """
        prompt = self._build_expansion_prompt(query)
        
        try:
            # 调用LLM进行分析
            response = self.llm.invoke(prompt)
            content = response.content
            
            # 解析JSON
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return self._process_result(data, query)
            else:
                print("⚠️  预处理未返回有效JSON，使用原始查询")
                return self._create_fallback_result(query)
                
        except Exception as e:
            print(f"❌ 预处理异常: {e}")
            return self._create_fallback_result(query)

    def _build_expansion_prompt(self, query: str) -> str:
        return f"""你是一个CDEM物理仿真脚本需求分析专家。请对以下用户查询进行深度扩写和结构化分析。

用户查询: "{query}"

请从以下几个维度进行分析并以JSON格式输出：
1. functionality: 功能详细描述（包含物理过程、几何建模、材料参数等）
2. constraints: 技术约束（如必须使用的API、特定的物理模型、求解器设置）
3. input_output: 输入输出格式（必要的变量定义、结果输出文件等）
4. boundary_conditions: 边界条件及异常处理
5. performance: 性能要求（如网格密度建议、计算步长建议）
6. test_cases: 建议的验证测试点
7. suggested_search_queries: [关键列表] 针对该需求，建议使用的3-5个具体搜索关键词（用于在向量库中查找相似案例）。
   **重要规则**：
   - 必须包含预测的英文API关键词或文件名片段（例如 "Rotate", "RigidBody", "Boundary"）。
   - 禁止使用通用词（如 "CDyna", "案例", "脚本", "模拟"），因为它们无法区分具体案例。
   - 优先提取用户查询中的独特动词或名词（如 "几何移动", "旋转", "锚杆"）。
8. confidence_score: 对需求理解的置信度评分 (0-100)

输出格式要求：
请仅输出一个标准的JSON对象，不要包含markdown标记或其他文字。
{{
  "functionality": "...",
  "constraints": "...",
  "input_output": "...",
  "boundary_conditions": "...",
  "performance": "...",
  "test_cases": "...",
  "suggested_search_queries": ["Rotate", "RigidBody_Motion", "Geometric_Move"],
  "confidence_score": 90
}}
"""

    def _process_result(self, data: Dict, original_query: str) -> Dict:
        confidence = data.get("confidence_score", 50) / 100.0
        search_queries = data.get("suggested_search_queries", [original_query])
        
        # 格式化关键词列表，使其更清晰
        queries_str = ", ".join([f'"{q}"' for q in search_queries])
        
        # 构建结构化描述，注入到Agent工作流
        expanded_prompt = f"""
【任务指令】
基于用户原始需求 "{original_query}"，请生成高质量的CDEM脚本。

【详细需求规范】
1. 功能目标：
{data.get('functionality', 'N/A')}

2. 技术约束：
{data.get('constraints', 'N/A')}

3. 推荐搜索关键词（重要）：
请使用以下关键词（一次一个）调用 search_physics_knowledge 工具进行检索。
关键词列表: {queries_str}
注意：
- 工具参数 'query' 必须是简单的字符串，不要传入JSON对象。
- 如果第一个关键词检索结果不佳，请务必尝试列表中的其他关键词。

4. 输入输出规范：
{data.get('input_output', 'N/A')}

5. 边界与异常处理：
{data.get('boundary_conditions', 'N/A')}

【执行要求】
请严格遵守上述规范，优先使用 search_physics_knowledge 工具查找相关案例，确保生成的脚本完整且可执行。
"""
        return {
            "expanded_prompt": expanded_prompt,
            "confidence": confidence,
            "structured_data": data,
            "needs_clarification": confidence < self.confidence_threshold
        }

    def _create_fallback_result(self, query: str) -> Dict:
        return {
            "expanded_prompt": query,
            "confidence": 0.5,
            "structured_data": {},
            "needs_clarification": True
        }


class ToolConstructionModule:
    """工具构造模块：负责创建智能体所需的工具"""
    def build_physics_search_tool(self, vectorstore: Chroma, k: int = 3) -> Any:
        retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": k,
                "fetch_k": 10,
                "lambda_mult": 0.7
            }
        )
        
        physics_tool = create_retriever_tool(
            retriever=retriever,
            name="search_physics_knowledge",
            description=(
                "【必须优先使用】用于搜索 CDEM 软件的技术手册、API 接口文档和完整脚本案例。"
                "编写脚本前，必须先调用此工具查找类似的现成案例。"
                "请使用具体的关键词进行搜索，参数 query 必须是纯字符串（例如 'BallBlast'），禁止传入 JSON 或字典。"
            )
        )
        return physics_tool


class AgentConstructionModule:
    """智能体构造与执行模块：负责LLM初始化、Agent构建及代码生成"""
    def __init__(self, tools: List[Any], model_name: str = "llama3.1:latest", enable_preprocessing: bool = True):
        self.tools = tools
        self.model_name = model_name
        self.enable_preprocessing = enable_preprocessing
        self._build_agent()
        
        if self.enable_preprocessing:
            # 需要传入llm实例，因为QueryPreprocessor需要它
            self.preprocessor = QueryPreprocessor(self.llm)

    def _build_agent(self):
        print("\n🤖 构建智能体...")
        self.llm = ChatOllama(
            model=self.model_name,
            temperature=0.1,
            keep_alive="5m",
            callbacks=[StreamingStdOutCallbackHandler()]
        )
        
        # 3. 系统提示词
        if HAS_CUSTOM_PROMPT:
            from prompt import agent_system
            system_prompt = agent_system.AGENT_SYSTEM_PROMTP2
        else:
            system_prompt = self._get_default_system_prompt()
            
        # 4. 创建agent
        self.agent_executor = create_agent(
            model=self.llm,
            tools=self.tools,
            system_prompt=system_prompt
        )
        print("✅ 智能体构建完成")

    def _get_default_system_prompt(self) -> str:
        """默认系统提示词"""
        return """你是一个专业的CDEM物理仿真脚本生成助手。

你的任务是：
1. **分析需求**：仔细阅读用户的详细需求规范，特别是推荐的搜索关键词。
2. **检索知识**：必须调用 `search_physics_knowledge` 工具。请尝试使用推荐的关键词进行搜索。如果第一次搜索结果不佳，请尝试换一个关键词再次搜索。
3. **生成脚本**：基于检索到的案例和API文档，编写准确的JavaScript脚本。

重要规则：
- **强制检索**：在编写任何代码前，必须先调用检索工具。
- **模仿案例**：参考检索到的案例代码结构和API用法。
- **代码规范**：保持代码风格一致，添加必要的注释。
- **自我修正**：如果发现检索结果中没有直接相关的案例，请根据已有知识尽力推断，并在注释中说明。

输出格式：
只输出JavaScript代码，不要添加任何解释性文字。代码应该可以直接执行。
"""

    def generate_code(self, query: str, verbose: bool = False) -> tuple[str, float, int]:
        """生成代码的主入口"""
        start_time = time.time()
        retrieved_count = 0
        generated_code = ""
        
        try:
            if verbose:
                print(f"\\n{'='*60}")
                print(f"查询: {query}")
                print(f"{'='*60}")
            
            final_query = query
            
            # 1. 预处理
            if self.enable_preprocessing and hasattr(self, 'preprocessor'):
                if verbose: print("⚙️  正在进行需求扩写与分析...")
                pre_result = self.preprocessor.expand_query(query)
                
                if pre_result["needs_clarification"]:
                    print(f"⚠️  警告: 需求置信度低 ({pre_result['confidence']:.2f})")
                
                final_query = pre_result["expanded_prompt"]
                if verbose: print("✅ 需求扩写完成")

            # 2. 生成
            for chunk in self.agent_executor.stream(
                {"messages": [HumanMessage(content=final_query)]},
                stream_mode="values"
            ):
                last_message = chunk["messages"][-1]
                
                if isinstance(last_message, AIMessage):
                    if last_message.tool_calls:
                        if verbose:
                            print(f"\\n🛠️  调用工具: {last_message.tool_calls[0]['name']}")
                            print(f"   参数: {last_message.tool_calls[0]['args']}")
                    else:
                        generated_code = last_message.content
                        if verbose: print(f"\\n\\n✅ 生成完成")
                
                elif hasattr(last_message, 'type') and last_message.type == "tool":
                    retrieved_count = 1
                    if verbose: print(f"🔍 检索到结果 (长度: {len(last_message.content)})")
            
            elapsed_time = time.time() - start_time
            generated_code = self._extract_code(generated_code)
            return generated_code, elapsed_time, retrieved_count
        
        except Exception as e:
            elapsed_time = time.time() - start_time
            print(f"❌ 生成失败: {e}")
            return "", elapsed_time, 0
    
    def _extract_code(self, text: str) -> str:
        """提取代码块"""
        if "```" in text:
            pattern = r"```(?:javascript|js)?\\n(.*?)\\n```"
            matches = re.findall(pattern, text, re.DOTALL)
            if matches:
                return matches[0].strip()
        return text.strip()


class CDEMAgentEvaluator:
    """CDEM智能体评估器"""
    
    def __init__(self, 
                 vector_db_path: str,
                 test_data_dir: str,
                 output_dir: str,
                 model_name: str = "llama3.1:latest",
                 enable_preprocessing: bool = True):
        """
        初始化评估器
        
        Args:
            vector_db_path: 增强版向量数据库路径
            test_data_dir: 测试集文件所在目录（419个脚本的目录）
            output_dir: 评估结果输出目录
            model_name: LLM模型名称
            enable_preprocessing: 是否启用LLM预处理模块
        """
        self.vector_db_path = vector_db_path
        self.test_data_dir = Path(test_data_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.model_name = model_name
        self.enable_preprocessing = enable_preprocessing
        
        # 加载向量数据库
        self.vectorstore = VectorStoreManager.connect(
            vector_db_path, 
            "cdem_knowledge"
        )
        
        # 构建智能体
        self._build_agent()
        
        # 初始化预处理器
        if self.enable_preprocessing:
            self.preprocessor = QueryPreprocessor(self.llm)
            print("✅ LLM预处理模块已启用")
        
        # 结果存储
        self.results: List[EvaluationResult] = []
    
    def _build_agent(self):
        """构建智能体"""
        print("\n🤖 构建智能体...")
        
        # 1. 创建LLM
        self.llm = ChatOllama(
            model=self.model_name,
            temperature=0.1,
            keep_alive="5m",
            callbacks=[StreamingStdOutCallbackHandler()]
        )
        
        # 2. 创建检索工具
        retriever = self.vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": 3,  # 优化：大块切分下，减少检索数量以提升速度
                "fetch_k": 10,
                "lambda_mult": 0.7
            }
        )
        
        physics_tool = create_retriever_tool(
            retriever=retriever,
            name="search_physics_knowledge",
            description=(
                "【必须优先使用】用于搜索 CDEM 软件的技术手册、API 接口文档和完整脚本案例。"
                "编写脚本前，必须先调用此工具查找类似的现成案例。"
                "请使用具体的关键词进行搜索，参数 query 必须是纯字符串（例如 'BallBlast'），禁止传入 JSON 或字典。"
            )
        )
        
        tools = [physics_tool]
        
        # 3. 系统提示词
        if HAS_CUSTOM_PROMPT:
            system_prompt = agent_system.AGENT_SYSTEM_PROMTP2
        else:
            system_prompt = self._get_default_system_prompt()
        
        # 4. 创建agent
        self.agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=system_prompt
        )
        
        print("✅ 智能体构建完成")
    
    def _get_default_system_prompt(self) -> str:
        """默认系统提示词"""
        return """你是一个专业的CDEM物理仿真脚本生成助手。

你的任务是：
1. **分析需求**：仔细阅读用户的详细需求规范，特别是推荐的搜索关键词。
2. **检索知识**：必须调用 `search_physics_knowledge` 工具。请尝试使用推荐的关键词进行搜索。如果第一次搜索结果不佳，请尝试换一个关键词再次搜索。
3. **生成脚本**：基于检索到的案例和API文档，编写准确的JavaScript脚本。

重要规则：
- **强制检索**：在编写任何代码前，必须先调用检索工具。
- **模仿案例**：参考检索到的案例代码结构和API用法。
- **代码规范**：保持代码风格一致，添加必要的注释。
- **自我修正**：如果发现检索结果中没有直接相关的案例，请根据已有知识尽力推断，并在注释中说明。

输出格式：
只输出JavaScript代码，不要添加任何解释性文字。代码应该可以直接执行。
"""
    
    def generate_code(self, query: str, verbose: bool = False) -> tuple[str, float, int]:
        """
        使用智能体生成代码
        
        Args:
            query: 用户查询
            verbose: 是否打印详细过程
            
        Returns:
            (生成的代码, 耗时秒数, 检索到的文档数量)
        """
        start_time = time.time()
        retrieved_count = 0
        generated_code = ""
        
        try:
            if verbose:
                print(f"\n{'='*60}")
                print(f"查询: {query}")
                print(f"{'='*60}")
            
            # 执行智能体
            final_query = query
            
            # 1. 预处理阶段
            if self.enable_preprocessing and hasattr(self, 'preprocessor'):
                if verbose:
                    print("⚙️  正在进行需求扩写与分析...")
                pre_result = self.preprocessor.expand_query(query)
                
                if pre_result["needs_clarification"]:
                    print(f"⚠️  警告: 需求置信度低 ({pre_result['confidence']:.2f})，建议补充信息")
                
                final_query = pre_result["expanded_prompt"]
                if verbose:
                    print("✅ 需求扩写完成")

            # 2. 生成阶段
            for chunk in self.agent.stream(
                {"messages": [HumanMessage(content=final_query)]},
                stream_mode="values"
            ):
                last_message = chunk["messages"][-1]
                
                if isinstance(last_message, AIMessage):
                    if last_message.tool_calls:
                        if verbose:
                            print(f"\n🛠️  调用工具: {last_message.tool_calls[0]['name']}")
                            print(f"   参数: {last_message.tool_calls[0]['args']}")
                    else:
                        # 最终回答
                        generated_code = last_message.content
                        if verbose:
                            print(f"\n\n✅ 生成完成")
                
                elif hasattr(last_message, 'type') and last_message.type == "tool":
                    retrieved_count = 1  # 标记已检索
                    if verbose:
                        print(f"🔍 检索到结果 (长度: {len(last_message.content)})")
            
            elapsed_time = time.time() - start_time
            
            # 提取代码块（如果被markdown包裹）
            generated_code = self._extract_code(generated_code)
            
            return generated_code, elapsed_time, retrieved_count
            
        except Exception as e:
            elapsed_time = time.time() - start_time
            print(f"❌ 生成失败: {e}")
            return "", elapsed_time, 0
    
    def _extract_code(self, text: str) -> str:
        """提取代码块"""
        # 如果有markdown代码块标记，提取内容
        if "```" in text:
            # 提取 ```javascript 或 ``` 之间的内容
            import re
            pattern = r"```(?:javascript|js)?\n(.*?)\n```"
            matches = re.findall(pattern, text, re.DOTALL)
            if matches:
                return matches[0].strip()
        
        return text.strip()
    
    def evaluate_single_case(self, 
                            filename: str, 
                            ground_truth_code: str,
                            verbose: bool = False) -> EvaluationResult:
        """
        评估单个测试案例
        
        Args:
            filename: 测试文件名
            ground_truth_code: 标准答案代码
            verbose: 是否打印详细过程
            
        Returns:
            评估结果
        """
        # 生成查询
        query = QueryGenerator.generate_query_from_filename(filename)
        
        # 生成代码
        generated_code, gen_time, retrieved_count = self.generate_code(query, verbose)
        
        # 计算评估指标
        similarity = CodeSimilarityCalculator.calculate_similarity(
            ground_truth_code, 
            generated_code
        )
        
        quality = CodeQualityEvaluator.evaluate(generated_code)
        
        # 可执行性评分（简化版）
        execution_score = self._evaluate_execution(generated_code)
        
        # 功能正确性（综合评分）
        functionality = (
            similarity * 5 +  # 相似度贡献50%
            quality * 0.3 +   # 质量贡献30%
            execution_score * 0.2  # 可执行性贡献20%
        )
        
        # 检索质量
        retrieval_quality = "excellent" if retrieved_count > 0 else "poor"
        if similarity > 0.8:
            retrieval_quality = "excellent"
        elif similarity > 0.5:
            retrieval_quality = "good"
            
        # 调试日志：如果相似度极低，保存对比文件
        if similarity < 0.3:
            self._save_debug_info(filename, query, ground_truth_code, generated_code)
        
        # 确定类别
        category = self._determine_category(filename)
        
        result = EvaluationResult(
            test_id=f"T{len(self.results)+1:03d}",
            filename=filename,
            category=category,
            query=query,
            generated_code=generated_code,
            generation_time=gen_time,
            similarity_score=similarity,
            code_quality_score=quality,
            execution_score=execution_score,
            functionality_score=functionality,
            retrieved_docs_count=retrieved_count,
            retrieval_quality=retrieval_quality,
            evaluation_time=datetime.now().isoformat()
        )
        
        return result
    
    def _save_debug_info(self, filename, query, ground_truth, generated):
        """保存调试信息到文件"""
        debug_dir = self.output_dir / "debug_failures"
        debug_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = Path(filename).stem
        
        debug_file = debug_dir / f"{safe_name}_{timestamp}.md"
        
        with open(debug_file, "w", encoding="utf-8") as f:
            f.write(f"# Failure Analysis: {filename}\n\n")
            f.write(f"## Query\n{query}\n\n")
            f.write(f"## Generated Code\n```javascript\n{generated}\n```\n\n")
            f.write(f"## Ground Truth\n```javascript\n{ground_truth}\n```\n")
            
    def _evaluate_execution(self, code: str) -> float:
        """评估代码可执行性"""
        if not code or len(code.strip()) < 10:
            return 0.0
        
        score = 5.0
        
        if '{' in code and '}' in code:
            score += 2
        if 'function' in code or '=>' in code:
            score += 1
        if ';' in code:
            score += 1
        if code.count('(') == code.count(')'):
            score += 1
        
        return min(10.0, score)
    
    def _determine_category(self, filename: str) -> str:
        """从文件名确定类别"""
        if 'CDyna' in filename:
            return 'CDyna案例'
        elif 'GFlow' in filename:
            return 'GFlow案例'
        elif 'MudSim' in filename:
            return 'MudSim案例'
        elif 'SuperCDEM' in filename:
            return 'SuperCDEM案例'
        elif '建模' in filename or '网格' in filename:
            return '建模及网格案例'
        else:
            return '其他案例'
            
    def run_ab_test(self, test_files: List[str], verbose: bool = False):
        """
        运行A/B测试：对比开启/关闭预处理的效果
        验证扩写后脚本的一次生成成功率、功能完整度及代码可读性是否显著提升
        """
        print("\n" + "="*60)
        print("🔍 运行预处理模块 A/B 对比测试")
        print("="*60)
        
        results_a = [] # A组：开启预处理
        results_b = [] # B组：关闭预处理
        
        # 保存原始状态
        original_state = self.enable_preprocessing
        
        # 确保预处理器已初始化
        if not hasattr(self, 'preprocessor'):
            self.preprocessor = QueryPreprocessor(self.llm)
        
        count = len(test_files)
        for i, filename in enumerate(test_files, 1):
            print(f"\n[{i}/{count}] 对比测试: {filename}")
            
            # 读取标准答案
            file_path = self.test_data_dir / filename
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    ground_truth = f.read()
            except Exception as e:
                print(f"❌ 读取失败: {e}")
                continue
            
            # --- B组：关闭预处理 (Baseline) ---
            print("  Running Baseline (Preproc OFF)...")
            self.enable_preprocessing = False
            res_b = self.evaluate_single_case(filename, ground_truth, verbose=False)
            results_b.append(res_b)
            
            # --- A组：开启预处理 (Experimental) ---
            print("  Running Experimental (Preproc ON)...")
            self.enable_preprocessing = True
            res_a = self.evaluate_single_case(filename, ground_truth, verbose=False)
            results_a.append(res_a)
            
            # 打印单次对比
            imp_sim = res_a.similarity_score - res_b.similarity_score
            imp_func = res_a.functionality_score - res_b.functionality_score
            print(f"  > 相似度变化: {imp_sim:+.3f} | 功能分变化: {imp_func:+.2f}")
            
        # 恢复状态
        self.enable_preprocessing = original_state
        
        # 生成对比报告
        self._print_ab_test_summary(results_a, results_b)

    def _print_ab_test_summary(self, results_a: List[EvaluationResult], results_b: List[EvaluationResult]):
        """打印A/B测试总结"""
        def avg(lst, key):
            return sum(getattr(x, key) for x in lst) / len(lst) if lst else 0
            
        print("\n" + "="*60)
        print("📊 A/B 测试结果总结")
        print("="*60)
        print(f"{'指标':<15} | {'关闭预处理':<12} | {'开启预处理':<12} | {'提升':<10}")
        print("-" * 60)
        
        metrics = [
            ('similarity_score', '代码相似度'),
            ('code_quality_score', '代码质量'),
            ('functionality_score', '功能完整度'),
            ('execution_score', '可执行性')
        ]
        
        for attr, name in metrics:
            val_b = avg(results_b, attr)
            val_a = avg(results_a, attr)
            diff = val_a - val_b
            print(f"{name:<15} | {val_b:<12.3f} | {val_a:<12.3f} | {diff:+.3f}")
            
        print("-" * 60)
        # 计算一次生成成功率 (假设功能分>8为成功)
        success_b = len([r for r in results_b if r.functionality_score >= 8.0]) / len(results_b) * 100
        success_a = len([r for r in results_a if r.functionality_score >= 8.0]) / len(results_a) * 100
        print(f"{'生成成功率':<15} | {success_b:<12.1f}% | {success_a:<12.1f}% | {success_a-success_b:+.1f}%")

    
    def validate_training_set(self, 
                             dataset_split_json: str,
                             sample_size: Optional[int] = None,
                             verbose: bool = True):
        """
        验证训练集（确保智能体能准确生成训练集案例）
        
        Args:
            dataset_split_json: dataset_split.json文件路径
            sample_size: 验证的样本数量（None表示全部）
            verbose: 是否打印详细过程
        """
        print("\n" + "="*60)
        print("训练集验证开始")
        print("="*60)
        
        # 加载训练集文件列表
        with open(dataset_split_json, 'r', encoding='utf-8') as f:
            split_data = json.load(f)
        
        train_files = split_data['train']
        
        if sample_size:
            import random
            train_files = random.sample(train_files, min(sample_size, len(train_files)))
            print(f"📊 从训练集中随机抽取 {len(train_files)} 个样本进行验证")
        else:
            print(f"📊 验证全部训练集 ({len(train_files)} 个文件)")
        
        # 逐个验证
        for i, filename in enumerate(train_files, 1):
            print(f"\n[{i}/{len(train_files)}] 验证: {filename}")
            
            # 读取标准答案
            file_path = self.test_data_dir / filename
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    ground_truth = f.read()
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            # 评估
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            self.results.append(result)
            
            # 打印结果
            print(f"  相似度: {result.similarity_score:.3f} | "
                  f"质量: {result.code_quality_score:.1f}/10 | "
                  f"功能: {result.functionality_score:.1f}/10 | "
                  f"耗时: {result.generation_time:.1f}s")
            
            # 如果相似度低于阈值，给出警告
            if result.similarity_score < 0.7:
                print(f"  ⚠️  警告：训练集案例相似度较低！")
        
        # 生成验证报告
        self._generate_validation_report("training_set")
    
    def evaluate_test_set(self, 
                         dataset_split_json: str,
                         verbose: bool = False):
        """
        评估测试集
        
        Args:
            dataset_split_json: dataset_split.json文件路径
            verbose: 是否打印详细过程
        """
        print("\n" + "="*60)
        print("测试集评估开始")
        print("="*60)
        
        # 加载测试集文件列表
        with open(dataset_split_json, 'r', encoding='utf-8') as f:
            split_data = json.load(f)
        
        test_files = split_data['test']
        print(f"📊 测试集包含 {len(test_files)} 个文件")
        
        # 逐个评估
        for i, filename in enumerate(test_files, 1):
            print(f"\n[{i}/{len(test_files)}] 评估: {filename}")
            
            # 读取标准答案
            file_path = self.test_data_dir / filename
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    ground_truth = f.read()
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            # 评估
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            self.results.append(result)
            
            # 打印结果
            print(f"  ✓ 相似度: {result.similarity_score:.3f} | "
                  f"质量: {result.code_quality_score:.1f}/10 | "
                  f"功能: {result.functionality_score:.1f}/10")
        
        # 生成评估报告
        self._generate_evaluation_report("test_set")
    
    def _generate_validation_report(self, dataset_name: str):
        """生成训练集验证报告"""
        self._generate_report(dataset_name, "训练集验证报告")
    
    def _generate_evaluation_report(self, dataset_name: str):
        """生成测试集评估报告"""
        self._generate_report(dataset_name, "测试集评估报告")
    
    def _generate_report(self, dataset_name: str, title: str):
        """生成评估报告"""
        print("\n" + "="*60)
        print(f"生成{title}")
        print("="*60)
        
        if not self.results:
            print("⚠️  没有评估结果")
            return
        
        # 计算统计数据
        total = len(self.results)
        avg_similarity = sum(r.similarity_score for r in self.results) / total
        avg_quality = sum(r.code_quality_score for r in self.results) / total
        avg_functionality = sum(r.functionality_score for r in self.results) / total
        avg_time = sum(r.generation_time for r in self.results) / total
        
        # 按类别统计
        category_stats = {}
        for result in self.results:
            cat = result.category
            if cat not in category_stats:
                category_stats[cat] = {
                    'count': 0,
                    'similarity': [],
                    'quality': [],
                    'functionality': []
                }
            category_stats[cat]['count'] += 1
            category_stats[cat]['similarity'].append(result.similarity_score)
            category_stats[cat]['quality'].append(result.code_quality_score)
            category_stats[cat]['functionality'].append(result.functionality_score)
        
        # 保存JSON结果
        json_path = self.output_dir / f"{dataset_name}_results.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': {
                    'title': title,
                    'total_cases': total,
                    'evaluation_date': datetime.now().isoformat(),
                    'model': self.model_name,
                    'vector_db': self.vector_db_path
                },
                'overall_metrics': {
                    'avg_similarity': round(avg_similarity, 4),
                    'avg_quality': round(avg_quality, 2),
                    'avg_functionality': round(avg_functionality, 2),
                    'avg_generation_time': round(avg_time, 2)
                },
                'results': [asdict(r) for r in self.results]
            }, f, ensure_ascii=False, indent=2)
        
        print(f"✓ JSON结果: {json_path}")
        
        # 生成Markdown报告
        md_path = self.output_dir / f"{dataset_name}_report.md"
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(f"**评估时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**模型**: {self.model_name}\n")
            f.write(f"**向量库**: {self.vector_db_path}\n\n")
            
            # 总体指标
            f.write("## 总体性能\n\n")
            f.write("| 指标 | 平均分数 |\n")
            f.write("|------|----------|\n")
            f.write(f"| 代码相似度 | {avg_similarity:.3f} |\n")
            f.write(f"| 代码质量 | {avg_quality:.2f}/10 |\n")
            f.write(f"| 功能正确性 | {avg_functionality:.2f}/10 |\n")
            f.write(f"| 平均生成时间 | {avg_time:.2f}s |\n\n")
            
            # 类别统计
            f.write("## 各类别表现\n\n")
            f.write("| 类别 | 测试数 | 平均相似度 | 平均质量 | 平均功能分 |\n")
            f.write("|------|--------|------------|----------|------------|\n")
            
            for cat in sorted(category_stats.keys()):
                stats = category_stats[cat]
                avg_sim = sum(stats['similarity']) / len(stats['similarity'])
                avg_qual = sum(stats['quality']) / len(stats['quality'])
                avg_func = sum(stats['functionality']) / len(stats['functionality'])
                f.write(f"| {cat} | {stats['count']} | {avg_sim:.3f} | {avg_qual:.2f} | {avg_func:.2f} |\n")
            
            f.write("\n")
            
            # Top 10
            f.write("## Top 10 最佳案例\n\n")
            top_cases = sorted(self.results, key=lambda x: x.functionality_score, reverse=True)[:10]
            f.write("| 排名 | 文件名 | 功能分 | 相似度 |\n")
            f.write("|------|--------|--------|--------|\n")
            for i, r in enumerate(top_cases, 1):
                f.write(f"| {i} | {r.filename} | {r.functionality_score:.2f} | {r.similarity_score:.3f} |\n")
            
            f.write("\n")
            
            # Bottom 10
            f.write("## Top 10 需改进案例\n\n")
            bottom_cases = sorted(self.results, key=lambda x: x.functionality_score)[:10]
            f.write("| 排名 | 文件名 | 功能分 | 相似度 |\n")
            f.write("|------|--------|--------|--------|\n")
            for i, r in enumerate(bottom_cases, 1):
                f.write(f"| {i} | {r.filename} | {r.functionality_score:.2f} | {r.similarity_score:.3f} |\n")
        
        print(f"✓ Markdown报告: {md_path}")
        
        # 打印总结
        print(f"\n📊 {title}总结:")
        print(f"   总测试数: {total}")
        print(f"   平均相似度: {avg_similarity:.3f}")
        print(f"   平均质量分: {avg_quality:.2f}/10")
        print(f"   平均功能分: {avg_functionality:.2f}/10")
        print(f"   平均耗时: {avg_time:.2f}秒/案例")


def main():
    """主函数"""
    # =====================================================================
    # 配置区域
    # =====================================================================
    
    # 1. 向量数据库配置（使用增强版）
    # VECTOR_DB_PATH = r"D:/Codes/langchain/physic/chroma_db_cdem_enhanced"  # Windows
    VECTOR_DB_PATH = "/Users/cxh/Codes/langchain/physic/tools/js_store/chroma_db_cdem"  # macOS
    
    # 2. 数据集配置
    # DATASET_SPLIT_JSON = r"D:/Codes/langchain/physic/dataset_split.json"  # Windows
    DATASET_SPLIT_JSON = "/Users/cxh/Codes/langchain/physic/dataset_split_results/dataset_split.json"  # macOS
    
    # TEST_DATA_DIR = r"D:/Codes/langchain/physic/docs/案例"  # 419个脚本所在目录
    TEST_DATA_DIR = "/Users/cxh/Codes/langchain/physic/docs/案例"  # macOS
    
    # 3. 输出目录
    OUTPUT_DIR = "./evaluation_results"
    
    # 4. LLM模型
    MODEL_NAME = "llama3.1:latest"
    
    # 5. 功能配置
    ENABLE_PREPROCESSING = False  # 预处理模块开关
    RUN_AB_TEST = False          # 是否运行A/B对比测试
    
    # =====================================================================
    # 评估流程
    # =====================================================================
    
    print("🚀 CDEM脚本生成评估")
    print("="*60)
    print(f"向量库: {VECTOR_DB_PATH}")
    print(f"测试数据: {TEST_DATA_DIR}")
    print(f"模型: {MODEL_NAME}")
    print(f"预处理模块: {'启用' if ENABLE_PREPROCESSING else '禁用'}")
    print("="*60)
    
    # 创建评估器
    evaluator = CDEMAgentEvaluator(
        vector_db_path=VECTOR_DB_PATH,
        test_data_dir=TEST_DATA_DIR,
        output_dir=OUTPUT_DIR,
        model_name=MODEL_NAME,
        enable_preprocessing=ENABLE_PREPROCESSING
    )
    
    # A/B测试（如果启用）
    if RUN_AB_TEST:
        # 随机抽取5个样本进行对比
        with open(DATASET_SPLIT_JSON, 'r', encoding='utf-8') as f:
            split_data = json.load(f)
            import random
            test_samples = random.sample(split_data['train'], 5)
            evaluator.run_ab_test(test_samples)
            return
    
    # =====================================================================
    # 阶段1：训练集验证（可选，建议先验证小样本）
    # =====================================================================
    print("\n" + "="*60)
    print("阶段1：训练集验证")
    print("="*60)
    print("目的：确保智能体能准确生成训练集案例")
    print()
    
    # 选项1：验证全部训练集（可能很耗时）
    # evaluator.validate_training_set(DATASET_SPLIT_JSON, verbose=False)
    
    # 选项2：验证部分训练集（推荐）
    print("💡 建议：先验证部分训练集样本")
    sample_size = int(input("请输入要验证的样本数量（建议10-50）: ") or "10")
    evaluator.validate_training_set(
        DATASET_SPLIT_JSON, 
        sample_size=sample_size,
        verbose=True  # 打印详细过程
    )
    
    # 清空结果，准备测试集评估
    evaluator.results = []
    
    # =====================================================================
    # 阶段2：测试集评估
    # =====================================================================
    print("\n" + "="*60)
    print("阶段2：测试集评估")
    print("="*60)
    print("目的：评估智能体在未见过的测试集上的表现")
    print()
    
    proceed = input("是否继续进行测试集评估？(y/n): ")
    if proceed.lower() == 'y':
        evaluator.evaluate_test_set(
            DATASET_SPLIT_JSON,
            verbose=False  # 测试集不打印详细过程
        )
    
    print("\n✅ 评估完成！")
    print(f"📁 结果保存在: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

