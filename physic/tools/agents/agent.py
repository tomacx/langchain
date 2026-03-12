import os
import json
import time
import difflib
import re
import importlib.util
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict, field
from datetime import datetime

# LangChain imports
from langchain_chroma import Chroma
from langchain_core.tools import create_retriever_tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain.agents import create_agent
from langchain_core.callbacks import StreamingStdOutCallbackHandler

HAS_CUSTOM_PROMPT = False
agent_system = None

prompt_path = Path(__file__).resolve().parents[1] / "prompt" / "agent_system.py"
if prompt_path.exists():
    try:
        spec = importlib.util.spec_from_file_location("cdem_prompt_agent_system", prompt_path)
        mod = importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(mod)
        agent_system = mod
        HAS_CUSTOM_PROMPT = True
        print(f"✅ 使用自定义系统提示词: {prompt_path}")
    except Exception as e:
        print(f"⚠️ 加载自定义提示词失败 {prompt_path}: {e}")

if not HAS_CUSTOM_PROMPT:
    try:
        from prompt import agent_system as local_agent_system
        agent_system = local_agent_system
        HAS_CUSTOM_PROMPT = True
        print("✅ 使用本地 prompt.py 中的系统提示词")
    except ImportError:
        HAS_CUSTOM_PROMPT = False
        print("⚠️ 未找到自定义 prompt，使用默认系统提示词")


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
    token_estimate: int = 0
    simplicity_score: float = 0.0
    physics_consistency_score: float = 0.0
    reward_total: float = 0.0
    reward_breakdown: Dict[str, float] = field(default_factory=dict)
    optimization_used: bool = False
    optimization_iterations: int = 0


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


class DatasetQueryGenerator:
    """数据集查询语句生成"""
    
    @staticmethod
    def determine_category(filename: str) -> str:
        if 'CDyna' in filename:
            return 'CDyna案例'
        if 'GFlow' in filename:
            return 'GFlow案例'
        if 'MudSim' in filename:
            return 'MudSim案例'
        if 'SuperCDEM' in filename:
            return 'SuperCDEM案例'
        if '建模' in filename or '网格' in filename:
            return '建模及网格案例'
        return '其他案例'
    
    @staticmethod
    def build_case_query_dataset(cases_root: str, output_json: str) -> None:
        root_path = Path(cases_root)
        cases = []
        index = 1
        for dirpath, _, filenames in os.walk(root_path):
            for name in filenames:
                if not name.lower().endswith(".js"):
                    continue
                full_path = Path(dirpath) / name
                rel_path = full_path.relative_to(root_path).as_posix()
                category = DatasetQueryGenerator.determine_category(name)
                default_query = QueryGenerator.generate_query_from_filename(name)
                case_id = f"C{index:04d}"
                cases.append({
                    "id": case_id,
                    "filename": rel_path,
                    "category": category,
                    "default_query": default_query,
                    "test_queries": [default_query]
                })
                index += 1
        data = {
            "cases_root": str(root_path),
            "total_cases": len(cases),
            "generated_at": datetime.now().isoformat(),
            "cases": cases
        }
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


class CodeSimilarityCalculator:
    """代码相似度计算"""
    
    @staticmethod
    def calculate_similarity(code1: str, code2: str) -> float:
        """计算两段代码的相似度 (0-1)"""
        if not code1 or not code2:
            return 0.0
        
        code1_normalized = CodeSimilarityCalculator._normalize_code(code1)
        code2_normalized = CodeSimilarityCalculator._normalize_code(code2)
        
        struct_matcher = difflib.SequenceMatcher(None, code1_normalized, code2_normalized)
        struct_score = struct_matcher.ratio()
        
        api_tokens_1 = CodeSimilarityCalculator._extract_api_tokens(code1_normalized)
        api_tokens_2 = CodeSimilarityCalculator._extract_api_tokens(code2_normalized)
        
        if api_tokens_1 and api_tokens_2:
            set1 = set(api_tokens_1)
            set2 = set(api_tokens_2)
            inter = len(set1 & set2)
            union = len(set1 | set2)
            api_score = inter / union if union > 0 else 0.0
        else:
            api_score = struct_score
        
        final_score = 0.4 * struct_score + 0.6 * api_score
        return round(final_score, 4)
    
    @staticmethod
    def _normalize_code(code: str) -> str:
        """标准化代码：聚焦可执行语句，弱化注释和元信息的影响"""
        lines = code.split('\n')
        normalized_lines: List[str] = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            if stripped.startswith('//'):
                continue
            if stripped.startswith('/*') or stripped.startswith('*') or stripped.startswith('*/'):
                continue
            if re.match(r'^(文件名|类别|关键词|内容)\s*[:：]', stripped):
                continue
            normalized_lines.append(stripped)
        return '\n'.join(normalized_lines)

    @staticmethod
    def _extract_api_tokens(code: str) -> List[str]:
        tokens: List[str] = []
        pattern = r'\b([A-Za-z_]\w*)\s*\.\s*([A-Za-z_]\w*)\s*\('
        for m in re.finditer(pattern, code):
            module, func = m.group(1), m.group(2)
            tokens.append(f"{module}.{func}")
        return tokens


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

        请从以下几个维度进行分析并以JSON格式输出（必须是严格的、可被json.loads解析的JSON，禁止包含注释、尾逗号或多余文字）：
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
        8. confidence_score: 对需求理解的置信度评分 (0-100)，即使不确定也必须给出估计值

        输出格式要求：
        - 只允许输出一个标准的JSON对象
        - 不要输出markdown代码块标记（例如 ```json）
        - 不要输出除JSON对象之外的任何文字
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
        raw_queries = data.get("suggested_search_queries", [original_query])
        search_queries: List[str] = []
        for q in raw_queries:
            if not q:
                continue
            if isinstance(q, (list, dict)):
                continue
            q_str = str(q).strip()
            if not q_str:
                continue
            if len(q_str) < 2:
                continue
            if q_str.lower() in {"cdyna", "case", "script", "模拟", "案例", "脚本"}:
                continue
            if q_str not in search_queries:
                search_queries.append(q_str)
        if not search_queries:
            search_queries = [original_query]
        if len(search_queries) > 5:
            search_queries = search_queries[:5]
        
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
请使用以下关键词（一次一个）调用 search_physics_knowledge 工具进行检索，并在必要时依次尝试列表中的多个关键词，直到检索到足够相关的案例为止。
关键词列表: {queries_str}
注意：
- 工具参数 'query' 必须是简单的字符串，不要传入JSON对象。
- 如果第一个关键词检索结果不佳，请务必尝试列表中的其他关键词。

4. 输入输出规范：
{data.get('input_output', 'N/A')}

5. 边界与异常处理：
{data.get('boundary_conditions', 'N/A')}

【执行要求】
1. 在编写任何代码前，必须至少调用一次 search_physics_knowledge 工具，必要时可多次调用并综合多个案例。
2. 先根据检索结果在心中拟定脚本整体结构，再输出最终代码。
3. 确保生成的脚本完整、可执行，并与上述需求高度一致。
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
                "【必须优先使用】用于搜索 CDEM 软件的技术手册、API 接口文档和脚本案例。"
                "编写脚本前，必须先调用此工具：优先阅读技术手册/API 确认接口与参数含义，再参考案例的流程结构。"
                "请使用具体的关键词进行搜索，参数 query 必须是纯字符串（例如 'BallBlast'），禁止传入 JSON 或字典。"
            )
        )
        return physics_tool


class AgentConstructionModule:
    """智能体构造与执行模块：负责LLM初始化、Agent构建及代码生成"""
    def __init__(
        self,
        tools: List[Any],
        model_name: str = "llama3.1:latest",
        enable_preprocessing: bool = True,
        vectorstore: Optional[Any] = None,
    ):
        self.tools = tools
        self.model_name = model_name
        self.enable_preprocessing = enable_preprocessing
        self.vectorstore = vectorstore
        self.last_run_metrics: Dict[str, Any] = {}
        self._build_agent()
        
        # 初始化预处理器 (即使禁用了预处理，也初始化以便后续开启)
        self.preprocessor = QueryPreprocessor(self.llm)

    def _build_agent(self):
        print("\n🤖 构建智能体...")
        self.llm = ChatOllama(
            model=self.model_name,
            temperature=0.0,
            keep_alive="5m",
            callbacks=[StreamingStdOutCallbackHandler()]
        )
        
        # 3. 系统提示词
        if globals().get('HAS_CUSTOM_PROMPT', False) and globals().get('agent_system') is not None:
            system_prompt = agent_system.AGENT_SYSTEM_PROMPT2
        else:
            system_prompt = self._get_default_system_prompt()
            
        # 移除 ReAct 格式强制引导，因为我们已经转为 Pre-retrieval (RAG) 模式
        # system_prompt += """..."""
        
        self.system_prompt = system_prompt
        
        # 4. 使用 LangChain 构建 AgentExecutor（必须走工具链）
        self.agent_executor = create_agent(
            model=self.llm,
            tools=self.tools,
            system_prompt=system_prompt
        )
        print("✅ 智能体构建完成（LangChain Agent 模式）")

    def _determine_category(self, query: str) -> str:
        """从查询中推断目标类别，用于过滤检索结果"""
        if "CDyna" in query: return "CDyna"
        if "GFlow" in query: return "GFlow"
        if "MudSim" in query: return "MudSim"
        if "SuperCDEM" in query: return "SuperCDEM"
        if "建模" in query or "网格" in query: return "建模" # Maps to 建模及网格
        return ""

    def _extract_keywords(self, query: str) -> str:
        """提取强关键词（英文单词 > 3 chars，排除通用词）"""
        english_keywords = re.findall(r'[a-zA-Z0-9]+', query)
        stop_words = {
            'cdyna', 'case', 'script', 'gflow', 'mudsim', 'supercdem', 
            '3d', '2d', 'js', 'example', 'simulation', 'model', 'file',
            'test', 'analysis', 'method', 'using', 'with', 'for', 'function'
        }
        specific_keywords = [
            k for k in english_keywords 
            if k.lower() not in stop_words and len(k) > 3
        ]
        return " ".join(specific_keywords)

    def _build_reference_context(self, query: str) -> tuple[str, int]:
        if not getattr(self, "vectorstore", None):
            return "", 0
        
        # 1. 确定类别（用于后处理过滤）
        category = self._determine_category(query)
        
        docs = []
        try:
            def search_with_fallback(q: str, k: int, source_types: Optional[List[str]] = None) -> List:
                if not source_types:
                    return self.vectorstore.similarity_search(q, k=k)
                
                where = None
                if len(source_types) == 1:
                    where = {"source_type": source_types[0]}
                else:
                    where = {"source_type": {"$in": source_types}}
                
                try:
                    return self.vectorstore.similarity_search(q, k=k, filter=where)
                except TypeError:
                    pass
                except Exception:
                    pass
                
                raw = self.vectorstore.similarity_search(q, k=max(k * 5, 20))
                filtered = [d for d in raw if (d.metadata or {}).get("source_type") in set(source_types)]
                return filtered[:k]
            
            # 2. 混合检索策略
            # 方案：分桶检索（手册/API 与 案例分开取），避免案例把手册挤出 TopK
            manual_types = ["api_reference", "manual"]
            case_types = ["training_case", "case"]
            
            results_manual_sem = search_with_fallback(query, k=10, source_types=manual_types)
            results_case_sem = search_with_fallback(query, k=10, source_types=case_types)
            
            # 手册增强：从 query 中提取模块名，再做一轮“模块关键词”手册检索
            module_tokens = self._extract_required_modules(query)
            results_manual_module = []
            if module_tokens:
                module_query = " ".join(module_tokens)
                results_manual_module = search_with_fallback(module_query, k=8, source_types=manual_types)
            
            # 策略 B: 关键词检索 (k=10)
            keywords = self._extract_keywords(query)
            results_manual_kw = []
            results_case_kw = []
            if keywords:
                print(f"🔍 [Debug] Keyword Search: {keywords}")
                results_manual_kw = search_with_fallback(keywords, k=10, source_types=manual_types)
                results_case_kw = search_with_fallback(keywords, k=10, source_types=case_types)
            
            # 3. 合并与去重
            seen_sources = set()
            combined_candidates = []
            
            def add_docs(candidates):
                for doc in candidates:
                    src = doc.metadata.get('source', '')
                    if src not in seen_sources:
                        # 4. 类别过滤
                        if category:
                            if category == "建模":
                                if "建模" not in src and "网格" not in src:
                                    continue
                            elif category not in src:
                                continue
                        
                        seen_sources.add(src)
                        combined_candidates.append(doc)

            add_docs(results_manual_sem)
            add_docs(results_manual_kw)
            add_docs(results_manual_module)
            add_docs(results_case_sem)
            add_docs(results_case_kw)
            
            # 取 Top 10 进入二次排序（手册/API优先）
            docs = combined_candidates[:10]
            
        except Exception as e:
            print(f"❌ 检索失败: {e}")
            return "", 0
            
        if not docs:
            return "", 0
        
        def source_priority(d) -> int:
            st = (d.metadata or {}).get("source_type", "")
            if st == "api_reference":
                return 0
            if st == "manual":
                return 1
            if st == "training_case":
                return 3
            if st == "case":
                return 4
            return 2
        
        docs_sorted = sorted(docs, key=source_priority)
        api_docs = [d for d in docs_sorted if (d.metadata or {}).get("source_type") == "api_reference"]
        manual_docs = [d for d in docs_sorted if (d.metadata or {}).get("source_type") == "manual"]
        case_docs = [d for d in docs_sorted if (d.metadata or {}).get("source_type") in {"case", "training_case"}]
        other_docs = [
            d for d in docs_sorted
            if (d.metadata or {}).get("source_type") not in {"api_reference", "manual", "case", "training_case"}
        ]
        
        def clip(text: str, limit: int = 4000) -> str:
            if not text:
                return ""
            return text[:limit] + ("\n...（已截断）" if len(text) > limit else "")
        
        context_parts: List[str] = []
        
        def render_group(title: str, docs_group: List, label: str, max_n: int):
            if not docs_group:
                return
            context_parts.append(f"\n【{title}】\n")
            for i, doc in enumerate(docs_group[:max_n], 1):
                ref = clip(doc.page_content)
                meta = doc.metadata or {}
                source = meta.get("source", "unknown")
                if not ref:
                    continue
                print(f"\n🔍 [Debug] Retrieved Doc {i} ({source})\n")
                context_parts.append(f"--- {label} {i} (来源: {source}) ---\n{ref}\n")
        
        render_group("技术手册 / API（优先依据）", api_docs + manual_docs, "手册/接口", max_n=6)
        render_group("案例参考（仅供结构与参数范围参考，禁止逐行抄写）", case_docs, "案例", max_n=4)
        render_group("其他检索片段", other_docs, "片段", max_n=2)
        
        if not context_parts:
            return "", 0
        
        return (
            "\n\n【知识库检索结果】\n"
            "请优先依据【技术手册/API】确认接口与参数含义；【案例参考】仅用于借鉴流程结构与参数范围，禁止逐行抄写。\n"
            + "".join(context_parts)
            + "\n"
        ), len(docs_sorted)

    def _extract_required_modules(self, query: str) -> List[str]:
        modules: List[str] = []
        q_lower = query.lower()
        # 清洗 Query：移除无意义的目录前缀词，提高关键词密度
        clean_query = q_lower.replace("案例库", "").replace("案例", "").replace("扩展", "").replace("脚本", "")
        
        candidates = [
            ("dyna", "dyna"),
            ("blkdyn", "blkdyn"),
            ("igeo", "igeo"),
            ("imeshing", "imeshing"),
            ("pdyna", "pdyna"),
            ("rdface", "rdface"),
            ("skwave", "skwave"),
            ("scdem", "scdem"),
            ("sfracsp", "SFracsp"),
            ("fem", "fem"),
        ]
        for token, mod in candidates:
            if token in q_lower and mod not in modules:
                modules.append(mod)
        if "粒子模块案例" in query and "pdyna" not in modules:
            modules.append("pdyna")
        if "冲击波模块案例" in query and "skwave" not in modules:
            modules.append("skwave")
        if "supercdem案例" in q_lower and "scdem" not in modules:
            modules.append("scdem")
        if "建模及网格案例" in query:
            if "igeo" not in modules:
                modules.append("igeo")
            if "imeshing" not in modules:
                modules.append("imeshing")
        return modules

    def _missing_required_modules(self, code: str, modules: List[str]) -> List[str]:
        missing: List[str] = []
        for mod in modules:
            if f"{mod}." not in code:
                missing.append(mod)
        return missing

    def _estimate_token_cost(self, text: str) -> int:
        if not text:
            return 0
        return int((len(text) + 3) / 4)

    def _score_simplicity(self, token_est: int, duration_s: float) -> float:
        if token_est <= 0:
            return 0.0
        t_score = 10.0
        if token_est > 2800:
            t_score -= 6.0
        elif token_est > 1800:
            t_score -= 4.0
        elif token_est > 1200:
            t_score -= 2.0
        elif token_est > 800:
            t_score -= 1.0

        d_score = 10.0
        if duration_s > 60:
            d_score -= 6.0
        elif duration_s > 40:
            d_score -= 4.0
        elif duration_s > 25:
            d_score -= 2.0
        elif duration_s > 15:
            d_score -= 1.0

        return max(0.0, min(10.0, (t_score * 0.7 + d_score * 0.3)))

    def _score_fit(self, code: str, required_modules: List[str]) -> tuple[float, List[str]]:
        issues: List[str] = []
        if not code or len(code.strip()) < 10:
            return 0.0, ["代码为空或过短"]

        if "search_physics_knowledge" in code:
            issues.append("包含 search_physics_knowledge")
        if "setCurDir(getSrcDir());" not in code:
            issues.append("缺少 setCurDir(getSrcDir());")
        if re.search(r"\bwhile\s*\(\s*true\s*\)", code):
            issues.append("包含 while(true)")
        if code.count("{") != code.count("}"):
            issues.append("花括号不匹配")
        if code.count("(") != code.count(")"):
            issues.append("括号不匹配")

        missing = self._missing_required_modules(code, required_modules)
        if missing:
            issues.append("缺少必要模块调用: " + ", ".join(missing))

        solve_like = bool(re.search(r"\bSolve\s*\(|\.\s*Solve\s*\(", code))
        if not solve_like:
            issues.append("未检测到求解/执行入口（Solve）")

        quality = CodeQualityEvaluator.evaluate(code)
        base = quality
        if issues:
            base -= min(5.0, 0.8 * len(issues))
        return max(0.0, min(10.0, base)), issues

    def _score_physics_consistency(self, code: str) -> tuple[float, List[str]]:
        issues: List[str] = []
        if not code or len(code.strip()) < 10:
            return 0.0, ["代码为空或过短"]

        def extract_named_values(names: List[str]) -> List[tuple[str, float]]:
            out: List[tuple[str, float]] = []
            for name in names:
                pat = rf"{re.escape(name)}\s*[:=,]\s*([-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)"
                for m in re.finditer(pat, code):
                    try:
                        out.append((name, float(m.group(1))))
                    except Exception:
                        continue
            return out

        for k, v in extract_named_values(["density", "rho", "Density", "Rho"]):
            if v <= 0:
                issues.append(f"{k} <= 0")

        for k, v in extract_named_values(["dt", "Dt", "timeStep", "TimeStep", "timestep"]):
            if v <= 0:
                issues.append(f"{k} <= 0")
            if v > 1:
                issues.append(f"{k} 过大（>1s）")

        for k, v in extract_named_values(["poisson", "nu", "Poisson", "Nu"]):
            if v <= 0 or v >= 0.5:
                issues.append(f"{k} 不在 (0, 0.5) 内")

        for k, v in extract_named_values(["young", "Young", "E", "ElasticModulus"]):
            if v <= 0:
                issues.append(f"{k} <= 0")

        g_match = re.search(r"\bgravity\b.*?\[([^\]]+)\]", code, re.IGNORECASE)
        if g_match:
            try:
                parts = [float(x.strip()) for x in g_match.group(1).split(",")[:3]]
                if len(parts) == 3:
                    gmag = (parts[0] ** 2 + parts[1] ** 2 + parts[2] ** 2) ** 0.5
                    if gmag > 200:
                        issues.append("重力加速度幅值异常（>200）")
            except Exception:
                pass

        score = 10.0
        if issues:
            score -= min(7.0, 1.2 * len(issues))
        return max(0.0, min(10.0, score)), issues

    def _pareto_front(self, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        front: List[Dict[str, Any]] = []
        for a in candidates:
            dominated = False
            for b in candidates:
                if a is b:
                    continue
                if (
                    b["simplicity_score"] >= a["simplicity_score"]
                    and b["fit_score"] >= a["fit_score"]
                    and b["physics_score"] >= a["physics_score"]
                    and (
                        b["simplicity_score"] > a["simplicity_score"]
                        or b["fit_score"] > a["fit_score"]
                        or b["physics_score"] > a["physics_score"]
                    )
                ):
                    dominated = True
                    break
            if not dominated:
                front.append(a)
        return front

    def _select_from_pareto(self, pareto: List[Dict[str, Any]], target_fit: float, target_physics: float) -> Dict[str, Any]:
        if not pareto:
            return {}
        best = None
        best_score = -1e9
        for c in pareto:
            fit = c["fit_score"]
            phys = c["physics_score"]
            simp = c["simplicity_score"]
            lam_fit = 1.0 + max(0.0, target_fit - fit) / max(target_fit, 1e-6)
            lam_phys = 1.0 + max(0.0, target_physics - phys) / max(target_physics, 1e-6)
            lam_simp = 1.0
            total = lam_fit * fit + lam_phys * phys + lam_simp * simp
            if total > best_score:
                best_score = total
                best = c
        assert best is not None
        best["reward_total"] = best_score
        best["reward_breakdown"] = {
            "simplicity_score": float(best["simplicity_score"]),
            "fit_score": float(best["fit_score"]),
            "physics_score": float(best["physics_score"]),
        }
        return best

    def _get_default_system_prompt(self) -> str:
        """默认系统提示词"""
        return """你是一个专业的CDEM物理仿真脚本生成助手。

你的任务是：
1. **分析需求**：仔细阅读用户的详细需求规范，特别是推荐的搜索关键词。
2. **检索知识**：必须调用 `search_physics_knowledge` 工具。请尝试使用推荐的关键词进行搜索。
   - 优先查找具体的 API 接口说明（如 `API参考` 类型的文档）。
   - 其次查找类似的完整脚本案例。
3. **生成脚本**：基于检索到的 API 文档和案例，编写准确的 JavaScript 脚本。

重要规则：
- **API 优先**：如果检索到了具体的 API 文档（如 `API名称: Set`），请严格按照文档中的参数说明和示例来编写代码，不要臆造 API。
- **强制检索**：在编写任何代码前，必须先调用检索工具。
- **模仿案例**：参考检索到的案例代码结构。
- **代码规范**：保持代码风格一致，添加必要的注释。
- **自我修正**：如果发现检索结果中没有直接相关的案例，请根据检索到的 API 文档进行逻辑组合，并在注释中说明推导过程。

输出格式：
只输出JavaScript代码，不要添加任何解释性文字。代码应该可以直接执行。
"""

    def generate_code(self, query: str, verbose: bool = False, dynamic_sys_prompt: str = "") -> tuple[str, float, int]:
        """生成代码的主入口"""
        start_time = time.time()
        retrieved_count = 0
        self.last_run_metrics = {}
        
        max_recursion_limit = int(os.environ.get("CDEM_AGENT_RECURSION_LIMIT", "25"))
        max_tool_calls = int(os.environ.get("CDEM_AGENT_MAX_TOOL_CALLS", "6"))
        enable_opt = os.environ.get("CDEM_ENABLE_GAME_OPT", "1").strip() in {"1", "true", "True"}
        max_opt_iters = int(os.environ.get("CDEM_OPT_MAX_ITERS", "2"))
        target_fit = float(os.environ.get("CDEM_OPT_TARGET_FIT", "7.0"))
        target_physics = float(os.environ.get("CDEM_OPT_TARGET_PHYSICS", "7.0"))
        
        if not hasattr(self, "_generation_memory"):
            self._generation_memory = {
                "last_feedback": "",
                "last_query": "",
                "global_feedback": [],
            }
        
        def build_memory_prompt() -> str:
            parts: List[str] = []
            last_feedback = (self._generation_memory.get("last_feedback") or "").strip()
            if last_feedback:
                parts.append("【上一次生成复盘（必须改进）】\n" + last_feedback)
            global_fb = self._generation_memory.get("global_feedback") or []
            if global_fb:
                parts.append("【近期常见失败点（请主动规避）】\n- " + "\n- ".join(global_fb[-5:]))
            return "\n\n".join(parts).strip()

        def run_once(prompt_text: str, dyn_prompt: str = "") -> tuple[str, int, float]:
            t0 = time.time()
            local_retrieved = 0
            local_generated = ""
            final_messages = []
            
            input_messages = [HumanMessage(content=prompt_text)]
            memory_prompt = build_memory_prompt()
            if memory_prompt:
                input_messages.insert(0, SystemMessage(content=memory_prompt))
            if dynamic_sys_prompt:
                input_messages.insert(0, SystemMessage(content=f"【动态优化指令】\n{dynamic_sys_prompt}"))
            if dyn_prompt:
                input_messages.insert(0, SystemMessage(content=f"【动态优化指令】\n{dyn_prompt}"))

            # 兼容性处理：如果 executor 期待 list，传入 list；如果期待 dict，传入 dict
            # 标准 create_agent 生成的 executor 通常接受 {"messages": ...}
            
            step = 0
            tool_calls = 0
            hit_limit = False
            for chunk in self.agent_executor.stream(
                {"messages": input_messages},
                stream_mode="values",
                config={"recursion_limit": max_recursion_limit},
            ):
                step += 1
                final_messages = chunk["messages"]
                last_message = chunk["messages"][-1]

                if isinstance(last_message, AIMessage):
                    if last_message.tool_calls:
                        tool_calls += len(last_message.tool_calls)
                        if verbose:
                            tc = last_message.tool_calls[0]
                            print(f"\n🛠️  调用工具: {tc['name']}")
                            print(f"   参数: {tc['args']}")
                    else:
                        local_generated = last_message.content
                        if verbose:
                            print("\n✅ Agent 输出最终脚本")
                
                if tool_calls >= max_tool_calls:
                    if verbose:
                        print(f"\n⚠️ 达到最大工具调用次数限制: {tool_calls}/{max_tool_calls}，提前结束以避免循环。")
                    hit_limit = True
                    break
                if step >= max_recursion_limit:
                    if verbose:
                        print(f"\n⚠️ 达到最大步数限制: {step}/{max_recursion_limit}，提前结束以避免循环。")
                    hit_limit = True
                    break
            
            # 准确统计工具调用次数 (遍历最终消息历史)
            local_retrieved = sum(1 for m in final_messages if hasattr(m, "type") and m.type == "tool")
            
            if hit_limit and not local_generated:
                try:
                    resp = self.llm.invoke(input_messages)
                    if hasattr(resp, "content") and resp.content:
                        local_generated = resp.content
                except Exception as e:
                    if verbose:
                        print(f"\n⚠️ 降级为直连模型生成失败: {e}")
            
            return local_generated, local_retrieved, time.time() - t0

        try:
            if verbose:
                print(f"\n{'='*60}")
                print(f"查询: {query}")
                print(f"{'='*60}")

            final_query = query

            if self.enable_preprocessing:
                if verbose:
                    print("⚙️  正在进行需求扩写与分析...")
                pre_result = self.preprocessor.expand_query(query)

                if pre_result["needs_clarification"]:
                    print(f"⚠️  警告: 需求置信度低 ({pre_result['confidence']:.2f})")

                final_query = pre_result["expanded_prompt"]
                if verbose:
                    print("✅ 需求扩写完成")

            reference_context, system_retrieved_count = self._build_reference_context(final_query)
            retrieved_count = max(retrieved_count, system_retrieved_count)
            
            # 增强检索逻辑：如果检索结果为空，或者第一轮检索质量可能不佳，尝试混合策略
            if system_retrieved_count == 0:
                print("⚠️ [警告] 检索结果为空！启动 Fallback 混合检索...")
                
                # 策略 1: 提取英文关键词 (针对 "FracS", "UCTest" 等)
                english_keywords = re.findall(r'[a-zA-Z0-9]+', final_query)
                # 过滤掉通用词
                stop_words = {'cdyna', 'case', 'script', 'gflow', 'mudsim', 'supercdem', '3d', '2d'}
                specific_keywords = [k for k in english_keywords if k.lower() not in stop_words and len(k) > 3]
                
                if specific_keywords:
                    keyword_query = " ".join(specific_keywords)
                    print(f"🔄 Fallback 1 (English Keywords): {keyword_query}")
                    ref_ctx_1, count_1 = self._build_reference_context(keyword_query)
                    if count_1 > 0:
                        reference_context = ref_ctx_1
                        retrieved_count = max(retrieved_count, count_1)
                
                # 策略 2: 如果策略1还是没结果，尝试模块名提取
                if retrieved_count == 0:
                    modules = self._extract_required_modules(final_query)
                    if modules:
                        module_query = " ".join(modules) + " case example"
                        print(f"🔄 Fallback 2 (Modules): {module_query}")
                        ref_ctx_2, count_2 = self._build_reference_context(module_query)
                        if count_2 > 0:
                            reference_context = ref_ctx_2
                            retrieved_count = max(retrieved_count, count_2)

            base_prompt = (
                "【用户需求与背景】\n"
                + final_query
                + reference_context
                + "\n\n【生成要求】\n"
                "1. 请仔细分析上述提供的【知识库检索结果】（如果有）。\n"
                "2. 以【技术手册/API】为准确认接口与参数含义；【案例参考】仅用于借鉴流程结构与参数范围，禁止逐行抄写整段代码。\n"
                "3. 最终输出：只提供完整的 JavaScript 脚本代码（使用 ```javascript 包裹）。\n"
                "4. 严禁在代码中包含 `search_physics_knowledge` 调用，严禁输出 JSON 格式。"
            )

            required_modules = self._extract_required_modules(query)

            generated_text, retrieved_once, dur_once = run_once(base_prompt)
            retrieved_count = max(retrieved_count, retrieved_once)
            generated_code = self._extract_code(generated_text)
            
            # 检测是否输出了 JSON 格式的伪代码
            is_json_output = generated_code.strip().startswith("{") and '"name":' in generated_code

            # 检测缺失的模块
            missing_modules = self._missing_required_modules(generated_code, required_modules)

            normalized = CodeSimilarityCalculator._normalize_code(generated_code)
            
            # 移除 retrieved_once == 0 的检查，因为我们采用了 Pre-retrieval 模式
            if ("search_physics_knowledge" in generated_code) or len(normalized.splitlines()) < 10 or is_json_output or missing_modules:
                if verbose:
                    print("⚠️ 首轮生成不符合要求，将触发一次严格重试...")
                
                retry_instruction = "上一次你没有正确完成任务。"
                if is_json_output:
                    retry_instruction += "错误原因：你输出了 JSON 格式的工具调用描述，而不是 JavaScript 代码。请不要列出工具名，而是直接写代码。"
                elif "search_physics_knowledge" in generated_code:
                     retry_instruction += "错误原因：你**在生成的代码中**调用了 `search_physics_knowledge`。这是极其严重的错误！\n"
                     retry_instruction += "请直接根据提供的【知识库检索结果】编写代码，不要在代码里写检索函数。"
                elif len(normalized.splitlines()) < 10:
                    retry_instruction += "错误原因：生成的代码太短，可能不完整。"
                elif missing_modules:
                    retry_instruction += f"错误原因：生成的代码缺少必要的模块调用: {', '.join(missing_modules)}。请确保使用了这些模块。"
                
                strict_prompt = (
                    base_prompt
                    + f"\n\n【严重错误修正】{retry_instruction}\n"
                    "这次请务必：\n"
                    "1. 参考上文提供的检索结果。\n"
                    "2. 只输出 JavaScript 代码块，不要 JSON，不要包含 `search_physics_knowledge`。"
                )
                generated_text_strict, retrieved_retry, dur_retry = run_once(strict_prompt, dyn_prompt="拟合度优先：确保脚本可直接运行，补全缺失模块调用与求解入口，禁止输出 JSON/工具名。")
                if generated_text_strict:
                    generated_code = self._extract_code(generated_text_strict)
                    retrieved_count = max(retrieved_count, retrieved_retry, retrieved_count)
                    dur_once = max(dur_once, dur_retry)

            candidates: List[Dict[str, Any]] = []
            base_tokens = self._estimate_token_cost(base_prompt) + self._estimate_token_cost(generated_code)
            simp = self._score_simplicity(base_tokens, dur_once)
            fit_score, fit_issues = self._score_fit(generated_code, required_modules)
            phys_score, phys_issues = self._score_physics_consistency(generated_code)
            candidates.append(
                {
                    "name": "baseline",
                    "code": generated_code,
                    "token_est": base_tokens,
                    "duration_s": dur_once,
                    "simplicity_score": simp,
                    "fit_score": fit_score,
                    "physics_score": phys_score,
                    "fit_issues": fit_issues,
                    "physics_issues": phys_issues,
                }
            )

            need_opt = enable_opt and (
                len(query.strip()) < 160
                or fit_score < target_fit
                or phys_score < target_physics
                or retrieved_count == 0
            )

            opt_iters = 0
            if need_opt:
                opt_objectives = [
                    "简约性优先：在不降低可执行性的前提下，减少冗余注释与重复设置，减少不必要的变量与输出，缩短脚本长度，并保持运行更快。",
                    "拟合度优先：优先保证脚本能正确运行并输出结果，确保必要模块调用齐全、求解入口存在、关键参数完整，避免臆造 API。",
                    "物理一致性优先：检查并修正明显违反基本物理规律的参数（例如密度/时间步长/弹性参数/泊松比等），保证参数取值合理且为正，边界条件与载荷方向自洽。",
                ]
                for _ in range(max_opt_iters):
                    opt_iters += 1
                    for obj in opt_objectives:
                        cand_text, cand_retrieved, cand_dur = run_once(base_prompt, dyn_prompt=obj)
                        cand_code = self._extract_code(cand_text)
                        if not cand_code:
                            continue
                        token_est = self._estimate_token_cost(base_prompt) + self._estimate_token_cost(cand_code)
                        simp_s = self._score_simplicity(token_est, cand_dur)
                        fit_s, fit_is = self._score_fit(cand_code, required_modules)
                        phys_s, phys_is = self._score_physics_consistency(cand_code)
                        candidates.append(
                            {
                                "name": f"opt{opt_iters}",
                                "code": cand_code,
                                "token_est": token_est,
                                "duration_s": cand_dur,
                                "simplicity_score": simp_s,
                                "fit_score": fit_s,
                                "physics_score": phys_s,
                                "fit_issues": fit_is,
                                "physics_issues": phys_is,
                            }
                        )
                    pareto = self._pareto_front(candidates)
                    selected = self._select_from_pareto(pareto, target_fit=target_fit, target_physics=target_physics)
                    if selected:
                        if selected["fit_score"] >= target_fit and selected["physics_score"] >= target_physics:
                            break
                pareto = self._pareto_front(candidates)
                selected = self._select_from_pareto(pareto, target_fit=target_fit, target_physics=target_physics)
            else:
                selected = candidates[0]
                pareto = [selected]

            if selected and selected.get("code"):
                generated_code = selected["code"]
                if selected.get("name") != "baseline":
                    dur_once = max(dur_once, float(selected.get("duration_s", 0.0)))
            
            self.last_run_metrics = {
                "token_estimate": int(selected.get("token_est", 0)) if selected else 0,
                "simplicity_score": float(selected.get("simplicity_score", 0.0)) if selected else 0.0,
                "physics_consistency_score": float(selected.get("physics_score", 0.0)) if selected else 0.0,
                "fit_score": float(selected.get("fit_score", 0.0)) if selected else 0.0,
                "reward_total": float(selected.get("reward_total", 0.0)) if selected else 0.0,
                "reward_breakdown": dict(selected.get("reward_breakdown", {})) if selected else {},
                "optimization_used": bool(need_opt),
                "optimization_iterations": int(opt_iters),
                "pareto_size": int(len(pareto)),
                "candidates_count": int(len(candidates)),
            }
            
            feedback_items: List[str] = []
            if "setCurDir(getSrcDir());" not in generated_code:
                feedback_items.append("缺少脚本起手式：setCurDir(getSrcDir());")
            if "search_physics_knowledge" in generated_code:
                feedback_items.append("代码中出现 search_physics_knowledge（严禁出现在最终脚本）")
            if re.search(r"\bwhile\s*\(\s*true\s*\)", generated_code):
                feedback_items.append("包含 while(true) 可能导致脚本自身无限循环")
            missing_modules = self._missing_required_modules(generated_code, required_modules)
            if missing_modules:
                feedback_items.append(f"缺少必要模块调用：{', '.join(missing_modules)}")
            _, fit_issues_final = self._score_fit(generated_code, required_modules)
            _, phys_issues_final = self._score_physics_consistency(generated_code)
            if fit_issues_final:
                for it in fit_issues_final[:3]:
                    if it not in feedback_items:
                        feedback_items.append(it)
            if phys_issues_final:
                for it in phys_issues_final[:3]:
                    if it not in feedback_items:
                        feedback_items.append(it)
            
            if feedback_items:
                self._generation_memory["last_query"] = query
                self._generation_memory["last_feedback"] = "\n".join(f"- {x}" for x in feedback_items)
                for item in feedback_items:
                    if item not in self._generation_memory["global_feedback"]:
                        self._generation_memory["global_feedback"].append(item)
            else:
                self._generation_memory["last_query"] = query
                self._generation_memory["last_feedback"] = ""

            elapsed_time = time.time() - start_time
            return generated_code, elapsed_time, retrieved_count

        except Exception as e:
            elapsed_time = time.time() - start_time
            print(f"❌ 生成失败: {e}")
            return "", elapsed_time, 0
    
    def _extract_code(self, text: str) -> str:
        """提取代码块"""
        if "```" in text:
            pattern = r"```(?:javascript|js)?\s*\n(.*?)```"
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches:
                return matches[0].strip()
        return text.strip()


class EvaluationModule:
    """评估模块：负责执行测试用例评估、A/B测试和生成报告"""
    def __init__(self, agent_module: AgentConstructionModule, test_data_dir: str, output_dir: str, query_dataset_json: Optional[str] = None):
        self.agent_module = agent_module
        self.test_data_dir = Path(test_data_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results: List[EvaluationResult] = []
        self.query_map: Dict[str, List[str]] = {}
        if query_dataset_json:
            try:
                with open(query_dataset_json, "r", encoding="utf-8") as f:
                    data = json.load(f)
                for case in data.get("cases", []):
                    fname = case.get("filename")
                    if not fname:
                        continue
                    queries = case.get("test_queries") or []
                    if not queries and case.get("default_query"):
                        queries = [case["default_query"]]
                    if queries:
                        self.query_map[fname] = queries
                print(f"✅ 已加载查询数据集，共 {len(self.query_map)} 条记录")
            except Exception as e:
                print(f"⚠️ 无法加载查询数据集 {query_dataset_json}: {e}")
                self.query_map = {}

    def evaluate_single_case(self, filename: str, ground_truth_code: str, verbose: bool = False) -> EvaluationResult:
        """评估单个测试案例"""
        if self.query_map:
            queries = self.query_map.get(filename)
            if queries:
                query = queries[0]
            else:
                query = QueryGenerator.generate_query_from_filename(filename)
        else:
            query = QueryGenerator.generate_query_from_filename(filename)
        
        # 生成代码 (调用 Agent 模块)
        generated_code, gen_time, retrieved_count = self.agent_module.generate_code(query, verbose)
        extra = getattr(self.agent_module, "last_run_metrics", {}) or {}
        
        # 计算评估指标
        similarity = CodeSimilarityCalculator.calculate_similarity(ground_truth_code, generated_code)
        quality = CodeQualityEvaluator.evaluate(generated_code)
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
            
        # 调试日志
        if similarity < 0.3:
            self._save_debug_info(filename, query, ground_truth_code, generated_code)
        
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
            evaluation_time=datetime.now().isoformat(),
            token_estimate=int(extra.get("token_estimate", 0) or 0),
            simplicity_score=float(extra.get("simplicity_score", 0.0) or 0.0),
            physics_consistency_score=float(extra.get("physics_consistency_score", 0.0) or 0.0),
            reward_total=float(extra.get("reward_total", 0.0) or 0.0),
            reward_breakdown=dict(extra.get("reward_breakdown", {}) or {}),
            optimization_used=bool(extra.get("optimization_used", False)),
            optimization_iterations=int(extra.get("optimization_iterations", 0) or 0),
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
        if not code or len(code.strip()) < 10: return 0.0
        score = 5.0
        if '{' in code and '}' in code: score += 2
        if 'function' in code or '=>' in code: score += 1
        if ';' in code: score += 1
        if code.count('(') == code.count(')'): score += 1
        return min(10.0, score)

    def _determine_category(self, filename: str) -> str:
        """从文件名确定类别"""
        if 'CDyna' in filename: return 'CDyna案例'
        elif 'GFlow' in filename: return 'GFlow案例'
        elif 'MudSim' in filename: return 'MudSim案例'
        elif 'SuperCDEM' in filename: return 'SuperCDEM案例'
        elif '建模' in filename or '网格' in filename: return '建模及网格案例'
        else: return '其他案例'

    def run_ab_test(self, test_files: List[str], verbose: bool = False):
        """运行A/B测试"""
        print("\n" + "="*60)
        print("🔍 运行预处理模块 A/B 对比测试")
        print("="*60)
        
        results_a = [] # A组：开启预处理
        results_b = [] # B组：关闭预处理
        
        # 保存原始状态
        original_state = self.agent_module.enable_preprocessing
        
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
            self.agent_module.enable_preprocessing = False
            res_b = self.evaluate_single_case(filename, ground_truth, verbose=False)
            results_b.append(res_b)
            
            # --- A组：开启预处理 (Experimental) ---
            print("  Running Experimental (Preproc ON)...")
            self.agent_module.enable_preprocessing = True
            res_a = self.evaluate_single_case(filename, ground_truth, verbose=False)
            results_a.append(res_a)
            
            # 打印单次对比
            imp_sim = res_a.similarity_score - res_b.similarity_score
            imp_func = res_a.functionality_score - res_b.functionality_score
            print(f"  > 相似度变化: {imp_sim:+.3f} | 功能分变化: {imp_func:+.2f}")
            
        # 恢复状态
        self.agent_module.enable_preprocessing = original_state
        
        # 生成对比报告
        self._print_ab_test_summary(results_a, results_b)

    def _print_ab_test_summary(self, results_a: List[EvaluationResult], results_b: List[EvaluationResult]):
        """打印A/B测试总结"""
        def avg(lst, key): return sum(getattr(x, key) for x in lst) / len(lst) if lst else 0
            
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
        success_b = len([r for r in results_b if r.functionality_score >= 8.0]) / len(results_b) * 100
        success_a = len([r for r in results_a if r.functionality_score >= 8.0]) / len(results_a) * 100
        print(f"{'生成成功率':<15} | {success_b:<12.1f}% | {success_a:<12.1f}% | {success_a-success_b:+.1f}%")

    def validate_training_set(self, dataset_split_json: str, sample_size: Optional[int] = None, verbose: bool = True):
        """验证训练集"""
        print("\n" + "="*60)
        print("训练集验证开始")
        print("="*60)
        
        with open(dataset_split_json, 'r', encoding='utf-8') as f:
            split_data = json.load(f)
        
        train_files = split_data['train']
        if sample_size:
            import random
            train_files = random.sample(train_files, min(sample_size, len(train_files)))
            print(f"📊 从训练集中随机抽取 {len(train_files)} 个样本进行验证")
        else:
            print(f"📊 验证全部训练集 ({len(train_files)} 个文件)")
        
        for i, filename in enumerate(train_files, 1):
            print(f"\n[{i}/{len(train_files)}] 验证: {filename}")
            file_path = self.test_data_dir / filename
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    ground_truth = f.read()
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            self.results.append(result)
            
            print(f"  相似度: {result.similarity_score:.3f} | 质量: {result.code_quality_score:.1f}/10 | 功能: {result.functionality_score:.1f}/10 | 耗时: {result.generation_time:.1f}s")
            if result.similarity_score < 0.7:
                print(f"  ⚠️  警告：训练集案例相似度较低！")
        
        self._generate_report("training_set", "训练集验证报告")

    def evaluate_test_set(self, dataset_split_json: str, verbose: bool = False):
        """评估测试集"""
        print("\n" + "="*60)
        print("测试集评估开始")
        print("="*60)
        
        with open(dataset_split_json, 'r', encoding='utf-8') as f:
            split_data = json.load(f)
        
        test_files = split_data['test']
        print(f"📊 测试集包含 {len(test_files)} 个文件")
        
        for i, filename in enumerate(test_files, 1):
            print(f"\n[{i}/{len(test_files)}] 评估: {filename}")
            file_path = self.test_data_dir / filename
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    ground_truth = f.read()
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            self.results.append(result)
            print(f"  ✓ 相似度: {result.similarity_score:.3f} | 质量: {result.code_quality_score:.1f}/10 | 功能: {result.functionality_score:.1f}/10")
        
        self._generate_report("test_set", "测试集评估报告")

    def _generate_report(self, dataset_name: str, title: str):
        """生成评估报告"""
        print("\n" + "="*60)
        print(f"生成{title}")
        print("="*60)
        
        if not self.results:
            print("⚠️  没有评估结果")
            return
        
        total = len(self.results)
        avg_similarity = sum(r.similarity_score for r in self.results) / total
        avg_quality = sum(r.code_quality_score for r in self.results) / total
        avg_functionality = sum(r.functionality_score for r in self.results) / total
        avg_time = sum(r.generation_time for r in self.results) / total
        
        category_stats = {}
        for result in self.results:
            cat = result.category
            if cat not in category_stats:
                category_stats[cat] = {'count': 0, 'similarity': [], 'quality': [], 'functionality': []}
            category_stats[cat]['count'] += 1
            category_stats[cat]['similarity'].append(result.similarity_score)
            category_stats[cat]['quality'].append(result.code_quality_score)
            category_stats[cat]['functionality'].append(result.functionality_score)
        
        json_path = self.output_dir / f"{dataset_name}_results.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': {
                    'title': title,
                    'total_cases': total,
                    'evaluation_date': datetime.now().isoformat(),
                    'model': self.agent_module.model_name
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
        
        md_path = self.output_dir / f"{dataset_name}_report.md"
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(f"**评估时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**模型**: {self.agent_module.model_name}\n\n")
            f.write("## 总体性能\n\n")
            f.write(f"| 指标 | 平均分数 |\n|------|----------|\n")
            f.write(f"| 代码相似度 | {avg_similarity:.3f} |\n")
            f.write(f"| 代码质量 | {avg_quality:.2f}/10 |\n")
            f.write(f"| 功能正确性 | {avg_functionality:.2f}/10 |\n")
            f.write(f"| 平均生成时间 | {avg_time:.2f}s |\n\n")
            
            f.write("## 各类别表现\n\n")
            f.write("| 类别 | 测试数 | 平均相似度 | 平均质量 | 平均功能分 |\n|------|--------|------------|----------|------------|\n")
            for cat in sorted(category_stats.keys()):
                stats = category_stats[cat]
                avg_sim = sum(stats['similarity']) / len(stats['similarity'])
                avg_qual = sum(stats['quality']) / len(stats['quality'])
                avg_func = sum(stats['functionality']) / len(stats['functionality'])
                f.write(f"| {cat} | {stats['count']} | {avg_sim:.3f} | {avg_qual:.2f} | {avg_func:.2f} |\n")
            
            f.write("\n## Top 10 最佳案例\n\n")
            f.write("| 排名 | 文件名 | 功能分 | 相似度 |\n|------|--------|--------|--------|\n")
            top_cases = sorted(self.results, key=lambda x: x.functionality_score, reverse=True)[:10]
            for i, r in enumerate(top_cases, 1):
                f.write(f"| {i} | {r.filename} | {r.functionality_score:.2f} | {r.similarity_score:.3f} |\n")
                
            f.write("\n## Top 10 需改进案例\n\n")
            f.write("| 排名 | 文件名 | 功能分 | 相似度 |\n|------|--------|--------|--------|\n")
            bottom_cases = sorted(self.results, key=lambda x: x.functionality_score)[:10]
            for i, r in enumerate(bottom_cases, 1):
                f.write(f"| {i} | {r.filename} | {r.functionality_score:.2f} | {r.similarity_score:.3f} |\n")
        
        print(f"✓ Markdown报告: {md_path}")
        print(f"\n📊 {title}总结:\n   总测试数: {total}\n   平均相似度: {avg_similarity:.3f}\n   平均质量分: {avg_quality:.2f}/10\n   平均功能分: {avg_functionality:.2f}/10\n   平均耗时: {avg_time:.2f}秒/案例")


class CDEMAgentEvaluator:
    """(Wrapper) 兼容旧版接口的包装类"""
    
    def __init__(self, vector_db_path: str, test_data_dir: str, output_dir: str, model_name: str = "llama3.1:latest", enable_preprocessing: bool = True, query_dataset_json: Optional[str] = None):
        # 1. 向量库模块
        self.vector_module = VectorKnowledgeBaseModule.connect(vector_db_path)
        
        # 2. 工具构造模块
        self.tool_module = ToolConstructionModule()
        physics_tool = self.tool_module.build_physics_search_tool(self.vector_module)
        
        # 3. 智能体构造模块
        self.agent_module = AgentConstructionModule(
            tools=[physics_tool],
            model_name=model_name,
            enable_preprocessing=enable_preprocessing,
            vectorstore=self.vector_module,
        )
        
        self.eval_module = EvaluationModule(
            agent_module=self.agent_module,
            test_data_dir=test_data_dir,
            output_dir=output_dir,
            query_dataset_json=query_dataset_json
        )
        
    @property
    def results(self):
        return self.eval_module.results
    
    @results.setter
    def results(self, value):
        self.eval_module.results = value
    
    def run_ab_test(self, test_files: List[str], verbose: bool = False):
        self.eval_module.run_ab_test(test_files, verbose)
    
    def validate_training_set(self, dataset_split_json: str, sample_size: Optional[int] = None, verbose: bool = True):
        self.eval_module.validate_training_set(dataset_split_json, sample_size, verbose)
    
    def evaluate_test_set(self, dataset_split_json: str, verbose: bool = False):
        self.eval_module.evaluate_test_set(dataset_split_json, verbose)


def main():
    """主函数"""
    # =====================================================================
    # 配置区域
    # =====================================================================
    
    # 1. 向量数据库配置（使用增强版）
    project_root = Path(__file__).resolve().parents[2]
    default_vector_db_path = project_root / "tools" / "js_store" / "chroma_db_cdem"
    VECTOR_DB_PATH = os.environ.get("CDEM_VECTOR_DB_PATH", str(default_vector_db_path))
    
    # 2. 数据集配置
    dataset_root = project_root / "dataset_split_results"
    default_dataset_split_json = dataset_root / "dataset_split.json"
    default_query_dataset_json = dataset_root / "case_queries_content.json"
    DATASET_SPLIT_JSON = os.environ.get("CDEM_DATASET_SPLIT_JSON", str(default_dataset_split_json))
    QUERY_DATASET_JSON = os.environ.get("CDEM_QUERY_DATASET_JSON", str(default_query_dataset_json))
    
    docs_root = project_root / "docs"
    default_test_data_dir = docs_root / "案例"
    TEST_DATA_DIR = os.environ.get("CDEM_CASE_DIR", str(default_test_data_dir))
    
    # 3. 输出目录
    OUTPUT_DIR = os.environ.get("CDEM_EVAL_OUTPUT_DIR", str(Path(__file__).resolve().parent / "results/evaluation_results.3.12.5(加入优化目标)"))
    
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
        enable_preprocessing=ENABLE_PREPROCESSING,
        query_dataset_json=QUERY_DATASET_JSON
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
