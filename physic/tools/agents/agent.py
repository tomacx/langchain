import os
import json
import time
import difflib
import re
import importlib.util
from pathlib import Path, PurePosixPath
from typing import List, Dict, Any, Optional, Tuple, Sequence, Protocol
from dataclasses import dataclass, asdict, field
from datetime import datetime

try:
    from dotenv import load_dotenv

    load_dotenv(encoding="utf-8")
except Exception:
    pass

# LangChain imports
from langchain_chroma import Chroma
from langchain_core.tools import create_retriever_tool
try:
    from langchain_core.tools import tool as lc_tool
except Exception:
    lc_tool = None
from langchain_ollama import ChatOllama, OllamaEmbeddings
try:
    from langchain_openai import ChatOpenAI
except Exception:
    ChatOpenAI = None
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

    # 对比信息
    diff_unified: str = ""
    diff_file: str = ""

    dataset_split: str = ""
    saved_generated_script: str = ""
    saved_ground_truth_script: str = ""

    task_steps: List[str] = field(default_factory=list)
    
    # 额外信息
    error_message: str = ""
    notes: str = ""
    evaluation_time: str = ""
    last_run_metrics: Dict[str, Any] = field(default_factory=dict)


def _env_flag(key: str, default: bool) -> bool:
    raw = (os.environ.get(key) or "").strip().lower()
    if not raw:
        return bool(default)
    if raw in {"1", "true", "yes", "y", "on"}:
        return True
    if raw in {"0", "false", "no", "n", "off"}:
        return False
    return bool(default)


@dataclass
class AgentFeatureFlags:
    enable_vector_kb: bool = True
    enable_tools: bool = True
    enable_tool_query_rewrite: bool = True
    enable_rag: bool = True
    enable_rag_fallback: bool = True
    enable_task_steps: bool = True
    enable_generation_memory: bool = True
    enable_strict_retry: bool = True
    enable_prompt_optimizer: bool = True
    prompt_optimizer: str = "textgrad"

    @staticmethod
    def from_env() -> "AgentFeatureFlags":
        return AgentFeatureFlags(
            enable_vector_kb=_env_flag("CDEM_ENABLE_VECTOR_KB", True),
            enable_tools=_env_flag("CDEM_ENABLE_TOOLS", True),
            enable_tool_query_rewrite=_env_flag("CDEM_ENABLE_TOOL_QUERY_REWRITE", True),
            enable_rag=_env_flag("CDEM_ENABLE_RAG", True),
            enable_rag_fallback=_env_flag("CDEM_ENABLE_RAG_FALLBACK", True),
            enable_task_steps=_env_flag("CDEM_ENABLE_TASK_STEPS", True),
            enable_generation_memory=_env_flag("CDEM_ENABLE_GENERATION_MEMORY", True),
            enable_strict_retry=_env_flag("CDEM_ENABLE_STRICT_RETRY", True),
            enable_prompt_optimizer=_env_flag("CDEM_ENABLE_PROMPT_OPTIMIZER", True),
            prompt_optimizer=(os.environ.get("CDEM_PROMPT_OPTIMIZER") or "textgrad").strip().lower() or "textgrad",
        )


UtilityVector = Tuple[float, float, float]


class PromptOptimizer(Protocol):
    def optimize_retry_prompt(self, issues: Sequence[str], query: str) -> str: ...


class TextGradPromptOptimizer:
    def __init__(self, llm: Any):
        self.llm = llm

    def optimize_retry_prompt(self, issues: Sequence[str], query: str) -> str:
        base = "拟合度优先：确保脚本可直接运行，补全缺失模块调用与求解入口，禁止输出 JSON/工具名。物理合规性优先：强调收敛与能量监测（若 API 支持）。"
        candidates = [base]

        if "json_output" in issues:
            candidates.append(base + " 严禁输出 JSON；只允许输出 ```javascript 代码块```。")
        if "tool_leak" in issues:
            candidates.append(base + " 严禁在代码中出现 search_physics_knowledge；不要写任何检索函数。")
        if "missing_modules" in issues:
            candidates.append(base + " 必须补齐必要模块调用；不要省略初始化与求解入口。")
        if "too_short" in issues:
            candidates.append(base + " 生成完整脚本，不要输出片段或伪代码。")

        allow_llm = _env_flag("CDEM_PROMPT_OPTIMIZER_USE_LLM", True)
        if allow_llm and self.llm is not None:
            sys = (
                "你是提示词优化器。给定失败信号(issues)与用户需求(query)，输出一条更强的【动态优化指令】。\n"
                "要求：必须短（<=120字）；必须包含“物理合规性优先”；必须明确禁止 JSON 与工具名；不要输出解释。"
            )
            user = {"issues": list(issues), "query": query}
            try:
                resp = self.llm.invoke([SystemMessage(content=sys), HumanMessage(content=json.dumps(user, ensure_ascii=False))])
                text = (getattr(resp, "content", "") or "").strip()
                if text:
                    candidates.append(text)
            except Exception:
                pass

        best = max(candidates, key=lambda x: self._score_prompt(x, issues))
        return best

    def _score_prompt(self, prompt: str, issues: Sequence[str]) -> float:
        s = 0.0
        p = prompt.lower()
        if "物理合规" in prompt:
            s += 3.0
        if "禁止" in prompt and ("json" in p or "工具" in prompt):
            s += 2.0
        if "search_physics_knowledge" in p:
            s += 1.0
        if "收敛" in prompt or "能量" in prompt:
            s += 1.0
        if "```javascript" in p:
            s += 0.5
        for it in issues:
            if it == "missing_modules" and ("模块" in prompt or "补齐" in prompt):
                s += 1.0
            if it == "json_output" and "json" in p:
                s += 1.0
            if it == "tool_leak" and "search_physics_knowledge" in p:
                s += 1.0
            if it == "too_short" and ("完整" in prompt or "不要输出片段" in prompt):
                s += 1.0
        return s


class VectorKnowledgeBaseModule:
    """向量知识库模块：负责连接和管理向量数据库"""
    @staticmethod
    def connect(persist_directory: str, collection_name: str = "new_db_cdem") -> Chroma:
        try:
            print(f"Loading vector DB: {persist_directory} (collection={collection_name})")
            
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
                print(f"Vector DB ready: {count} chunks")
                if count == 0:
                    candidates = []
                    if collection_name != "new_db_cdem":
                        candidates.append("new_db_cdem")
                    if collection_name != "cdem_knowledge":
                        candidates.append("cdem_knowledge")
                    for cand in candidates:
                        try:
                            alt = Chroma(
                                persist_directory=persist_directory,
                                embedding_function=embeddings,
                                collection_name=cand
                            )
                            alt_count = alt._collection.count()
                            if alt_count > 0:
                                print(f"Switching to non-empty collection: {cand} ({alt_count} chunks)")
                                return alt
                        except Exception:
                            continue
            except:
                print("Vector DB ready")
            
            return vectorstore

        except Exception as e:
            print(f"Failed to load vector DB: {e}")
            raise

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
    def __init__(self, model_name: Optional[str] = None, feature_flags: Optional[AgentFeatureFlags] = None):
        self.model_name = (model_name or os.environ.get("CDEM_TOOL_LLM_MODEL") or os.environ.get("CDEM_LLM_MODEL") or "qwen3.5-flash").strip()
        self.provider = (os.environ.get("CDEM_TOOL_LLM_PROVIDER") or os.environ.get("CDEM_LLM_PROVIDER") or "bailian").strip().lower()
        if feature_flags is not None:
            self.enable_query_rewrite = bool(feature_flags.enable_tool_query_rewrite)
        else:
            self.enable_query_rewrite = (os.environ.get("CDEM_TOOL_QUERY_REWRITE") or "1").strip() not in {"0", "false", "off", "no"}
        self.debug = (os.environ.get("CDEM_TOOL_DEBUG") or "").strip() in {"1", "true", "on", "yes"}
        self._llm = self._build_llm() if self.enable_query_rewrite else None

    def _build_llm(self):
        if self.provider in {"ollama", "local"}:
            ollama_base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
            return ChatOllama(model=self.model_name, temperature=0.0, base_url=ollama_base_url, streaming=False, keep_alive="5m")
        if ChatOpenAI is None:
            return None
        api_key = (
            os.environ.get("CDEM_BAILIAN_API_KEY")
            or os.environ.get("DASHSCOPE_API_KEY")
            or os.environ.get("OPENAI_API_KEY")
            or ""
        ).strip()
        base_url = (os.environ.get("CDEM_BAILIAN_BASE_URL") or "https://dashscope.aliyuncs.com/compatible-mode/v1").strip()
        if not api_key:
            return None
        return ChatOpenAI(model_name=self.model_name, api_key=api_key, base_url=base_url, temperature=0.0, streaming=False)

    def _extract_keywords(self, query: str) -> str:
        english_keywords = re.findall(r"[a-zA-Z0-9]+", query or "")
        stop_words = {
            "cdyna", "case", "script", "gflow", "mudsim", "supercdem",
            "3d", "2d", "js", "example", "simulation", "model", "file",
            "test", "analysis", "method", "using", "with", "for", "function",
        }
        specific = [k for k in english_keywords if k.lower() not in stop_words and len(k) > 3]
        return " ".join(specific)

    def _extract_modules(self, query: str) -> List[str]:
        q = (query or "").lower()
        modules = [
            "igeo", "imeshing", "blkdyn", "dyna", "pdyna", "rdface",
            "gfun", "imesh", "gflow", "mudsim", "supercdem",
        ]
        out: List[str] = []
        for m in modules:
            if m in q and m not in out:
                out.append(m)
        return out

    def _rewrite_search_queries(self, query: str) -> List[str]:
        q = (query or "").strip()
        if not q:
            return []

        api_like = []
        for m in re.findall(r"\b[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\b", q):
            if m not in api_like:
                api_like.append(m)
        if len(api_like) > 8:
            api_like = api_like[:8]

        keywords = self._extract_keywords(q)
        modules = self._extract_modules(q)

        # 针对 API 形式的 token，追加“全字段检索”变体，确保检索到说明/参数/范例
        api_expanded = []
        for m in api_like:
            api_expanded.append(f"{m} 说明 格式定义 参数 备注 范例")

        variants: List[str] = []
        candidates = [q] + api_expanded + [" ".join(api_like) if api_like else "", keywords, " ".join(modules) if modules else ""]
        for v in candidates:
            v = (v or "").strip()
            if v and v not in variants:
                variants.append(v)

        if not self._llm:
            return variants[:6]

        sys = (
            "你是CDEM知识库检索意图理解器。你的任务：把用户的一句话需求改写为用于向量库检索的关键词/短语列表。\n"
            "输出必须是严格 JSON 数组（只能输出数组），数组元素为字符串。\n"
            "要求：\n"
            "1) 只输出 3~6 条检索短语；每条尽量短（建议 2~10 个词/字）。\n"
            "2) 优先包含可区分的动作/对象/现象/边界/结果（例如 旋转、接触、爆破、渗流、投影拉伸、非球形颗粒）。\n"
            "3) 如能推断到模块/API英文关键词，务必加入具体API名称（例如 RotateGrid, Import, SetMat），并尝试组合 '参数'、'范例'、'说明' 等词（例如 'RotateGrid 参数'）。\n"
            "4) 严禁只给泛词：例如 案例/脚本/模拟/生成/CDyna/CDEM。\n"
        )
        user = {"query": q, "hints": {"api_like": api_like, "keywords": keywords, "modules": modules}}
        try:
            resp = self._llm.invoke([{"role": "system", "content": sys}, {"role": "user", "content": json.dumps(user, ensure_ascii=False)}])
            content = (getattr(resp, "content", "") or "").strip()
            m = re.search(r"\[[\s\S]*\]", content)
            if m:
                data = json.loads(m.group(0))
                if isinstance(data, list):
                    out: List[str] = []
                    for x in data:
                        s = str(x).strip()
                        if not s:
                            continue
                        if s not in out:
                            out.append(s)
                    for v in variants:
                        if v not in out:
                            out.append(v)
                    return out[:8]
        except Exception:
            pass
        return variants[:6]

    def _search_with_filter(self, vectorstore: Chroma, query: str, k: int, source_types: Optional[List[str]] = None) -> List[Any]:
        if not source_types:
            try:
                if hasattr(vectorstore, "max_marginal_relevance_search"):
                    return vectorstore.max_marginal_relevance_search(query, k=k, fetch_k=max(10, k * 4), lambda_mult=0.7)
            except Exception:
                pass
            return vectorstore.similarity_search(query, k=k)

        where = None
        if len(source_types) == 1:
            where = {"source_type": source_types[0]}
        else:
            where = {"source_type": {"$in": source_types}}
        try:
            return vectorstore.similarity_search(query, k=k, filter=where)
        except TypeError:
            pass
        except Exception:
            pass
        raw = vectorstore.similarity_search(query, k=max(k * 5, 20))
        st_set = set(source_types)
        filtered = [d for d in raw if (d.metadata or {}).get("source_type") in st_set]
        return filtered[:k]

    def _format_docs(self, docs: List[Any]) -> str:
        if not docs:
            return "【知识库检索结果】\n（未检索到相关内容）"

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
        other_docs = [d for d in docs_sorted if (d.metadata or {}).get("source_type") not in {"api_reference", "manual", "case", "training_case"}]

        per_doc_chars = int(os.environ.get("CDEM_TOOL_MAX_CHARS_PER_DOC", "1400"))
        max_manual_n = int(os.environ.get("CDEM_TOOL_MAX_MANUAL_DOCS", "4"))
        max_case_n = int(os.environ.get("CDEM_TOOL_MAX_CASE_DOCS", "3"))
        max_other_n = int(os.environ.get("CDEM_TOOL_MAX_OTHER_DOCS", "1"))

        def clip(text: str, limit: int) -> str:
            if not text:
                return ""
            t = text.strip()
            return t[:limit] + ("\n...（已截断）" if len(t) > limit else "")

        parts: List[str] = ["【知识库检索结果】"]

        def render(title: str, docs_group: List[Any], label: str, max_n: int, hide_content: bool = False):
            if not docs_group:
                return
            parts.append(f"\n【{title}】")
            for i, doc in enumerate(docs_group[:max_n], 1):
                meta = doc.metadata or {}
                source = meta.get("source") or meta.get("path") or meta.get("doc_id") or "unknown"
                st = meta.get("source_type") or "unknown"
                
                if hide_content:
                    parts.append(f"--- {label}{i} ({st}; {source}) ---\n(内容已隐藏，仅供参考来源)")
                    continue
                    
                content = clip(getattr(doc, "page_content", "") or "", per_doc_chars)
                if not content:
                    continue
                parts.append(f"--- {label}{i} ({st}; {source}) ---\n{content}")

        render("技术手册 / API（优先依据）", api_docs + manual_docs, "手册/接口", max_n=max_manual_n)
        render("案例参考（仅供结构与参数范围参考，禁止逐行抄写）", case_docs, "案例", max_n=max_case_n, hide_content=True)
        render("其他补充", other_docs, "补充", max_n=max_other_n)
        return "\n".join(parts).strip()

    def build_physics_search_tool(self, vectorstore: Chroma, k: int = 3) -> Any:
        if lc_tool is None:
            retriever = vectorstore.as_retriever(
                search_type="mmr",
                search_kwargs={"k": k, "fetch_k": 10, "lambda_mult": 0.7},
            )
            return create_retriever_tool(
                retriever=retriever,
                name="search_physics_knowledge",
                description=(
                    "用于搜索 CDEM 软件的技术手册、API 接口文档和脚本案例。"
                    "支持自然语言查询；请尽量描述关键动作/对象/现象。参数 query 必须是纯字符串。"
                ),
            )

        @lc_tool("search_physics_knowledge")
        def search_physics_knowledge(query: str) -> str:
            """用于搜索 CDEM 软件的技术手册、API 接口文档和脚本案例。

            支持自然语言查询：工具会先对 query 做意图理解并自动改写为更有效的检索短语，
            再对向量数据库进行检索，返回最匹配的资料片段。
            """
            q = (query or "").strip()
            if not q:
                return "【知识库检索结果】\n（空查询）"
            rewritten = self._rewrite_search_queries(q)
            manual_types = ["api_reference", "manual"]
            case_types = ["training_case", "case"]

            seen = set()
            merged: List[Any] = []

            def add(docs_in: List[Any]):
                for d in docs_in:
                    meta = d.metadata or {}
                    key = meta.get("source") or meta.get("path") or meta.get("doc_id") or (getattr(d, "page_content", "") or "")[:80]
                    if not key or key in seen:
                        continue
                    seen.add(key)
                    merged.append(d)

            for qv in rewritten[:8]:
                add(self._search_with_filter(vectorstore, qv, k=max(4, k), source_types=manual_types))
                add(self._search_with_filter(vectorstore, qv, k=max(3, k), source_types=case_types))
                if len(merged) >= max(10, k * 3):
                    break

            if self.debug:
                return f"【Tool Debug】rewritten={rewritten}\n\n{self._format_docs(merged[:14])}"
            return self._format_docs(merged[:14])

        search_physics_knowledge.description = (
            "用于搜索 CDEM 软件的技术手册、API 接口文档和脚本案例。"
            "你可以直接输入自然语言需求，本工具会先做意图理解并自动改写为更有效的检索短语，再检索并返回最匹配的资料。"
        )
        return search_physics_knowledge


class AgentConstructionModule:
    """智能体构造与执行模块：负责LLM初始化、Agent构建及代码生成"""
    def __init__(
        self,
        tools: List[Any],
        model_name: str = "llama3.1:latest",
        enable_preprocessing: bool = True,
        vectorstore: Optional[Any] = None,
        feature_flags: Optional[AgentFeatureFlags] = None,
        prompt_optimizer: Optional[PromptOptimizer] = None,
    ):
        self.tools = tools
        self.model_name = model_name
        self.enable_preprocessing = enable_preprocessing
        self.vectorstore = vectorstore
        self.feature_flags = feature_flags or AgentFeatureFlags.from_env()
        self.prompt_optimizer = prompt_optimizer
        self.last_run_metrics: Dict[str, Any] = {}
        self._build_agent()
        if self.prompt_optimizer is None and self.feature_flags.enable_prompt_optimizer:
            self.prompt_optimizer = TextGradPromptOptimizer(llm=getattr(self, "llm", None))
        
        self.preprocessor = None
        self.reset_generation_memory()

    def reset_generation_memory(self):
        self._generation_memory = {
            "last_feedback": "",
            "last_query": "",
            "global_feedback": [],
        }

    def _build_task_steps(self, query: str, reference_context: str) -> List[str]:
        prompt = (
            "你是 CDEM 物理仿真脚本执行规划专家。请把用户需求拆解为可执行步骤，要求步骤具体、可操作、可按顺序执行。\n"
            "输出必须是严格 JSON 数组（只能输出一个 JSON 数组，数组元素为字符串），禁止输出任何额外文字。\n"
            "每个步骤必须以动词开头，建议 6-10 步。\n\n"
            f"用户原始需求:\n{query}\n\n"
            f"可用参考资料（可能为空）:\n{reference_context[:4000] if reference_context else ''}\n"
        )
        try:
            resp = self.llm.invoke(prompt)
            content = getattr(resp, "content", "") or ""
            m = re.search(r"\[[\s\S]*\]", content)
            if m:
                data = json.loads(m.group(0))
                if isinstance(data, list):
                    steps: List[str] = []
                    for x in data:
                        if not x:
                            continue
                        s = str(x).strip()
                        if s and s not in steps:
                            steps.append(s)
                    if steps:
                        return steps[:12]
        except Exception:
            pass
        return [
            "解析需求并确定目标模块与物理过程",
            "从检索结果确认可用 API 与关键参数含义",
            "搭建几何与网格/颗粒初始化并设置材料参数",
            "设置接触/本构/边界条件与载荷输入",
            "配置求解控制参数、时间步长与输出",
            "调用求解入口并保存结果文件",
        ]

    def _build_feedback_items(self, code: str, required_modules: List[str]) -> List[str]:
        issues: List[str] = []
        if not code or len(code.strip()) < 10:
            return ["代码为空或过短"]
        if "search_physics_knowledge" in code:
            issues.append("代码中出现 search_physics_knowledge（严禁出现在最终脚本）")
        if "setCurDir(getSrcDir());" not in code:
            issues.append("缺少脚本起手式：setCurDir(getSrcDir());")
        if re.search(r"\bwhile\s*\(\s*true\s*\)", code):
            issues.append("包含 while(true) 可能导致脚本自身无限循环")
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
        return issues

    def _build_agent(self):
        print("Building agent...")
        streaming_enabled = (os.environ.get("CDEM_STREAMING") or "").strip() in {"1", "true", "on", "yes"}
        callbacks = [StreamingStdOutCallbackHandler()] if streaming_enabled else None
        provider = (os.environ.get("CDEM_LLM_PROVIDER") or "bailian").strip().lower()
        if provider in {"ollama", "local"}:
            ollama_base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
            self.llm = ChatOllama(
                model=self.model_name,
                temperature=0.0,
                base_url=ollama_base_url,
                keep_alive="5m",
                streaming=streaming_enabled,
                callbacks=callbacks,
            )
        else:
            if ChatOpenAI is None:
                raise ImportError("未安装 langchain-openai：请先安装后再使用百炼/千问（CDEM_LLM_PROVIDER=bailian）。")
            api_key = (
                os.environ.get("CDEM_BAILIAN_API_KEY")
                or os.environ.get("DASHSCOPE_API_KEY")
                or os.environ.get("OPENAI_API_KEY")
                or ""
            ).strip()
            base_url = (os.environ.get("CDEM_BAILIAN_BASE_URL") or "https://dashscope.aliyuncs.com/compatible-mode/v1").strip()

            if not api_key:
                raise ValueError("缺少百炼/千问 API Key：请设置环境变量 CDEM_BAILIAN_API_KEY（或 DASHSCOPE_API_KEY/OPENAI_API_KEY）。")

            self.llm = ChatOpenAI(
                model_name=self.model_name,
                api_key=api_key,
                base_url=base_url,
                temperature=0.0,
                streaming=streaming_enabled,
                callbacks=callbacks,
            )
        
        # 3. 系统提示词
        if globals().get('HAS_CUSTOM_PROMPT', False) and globals().get('agent_system') is not None:
            system_prompt = agent_system.AGENT_SYSTEM_PROMPT2
        else:
            system_prompt = self._get_default_system_prompt()
            
        # 移除 ReAct 格式强制引导，因为我们已经转为 Pre-retrieval (RAG) 模式
        # system_prompt += """..."""
        
        self.system_prompt = system_prompt
        
        self.agent_executor = None
        if self.tools:
            self.agent_executor = create_agent(
                model=self.llm,
                tools=self.tools,
                system_prompt=system_prompt
            )
            print("✅ 智能体构建完成（LangChain Agent 模式）")
        else:
            print("✅ 智能体构建完成（直连模型模式，无工具）")

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

    def _build_reference_context(self, query: str, search_hints: Optional[List[str]] = None) -> tuple[str, int]:
        if not getattr(self, "vectorstore", None):
            return "", 0

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
            
            # 2. 混合检索策略（不做“类别过滤”，完全依赖查询信号与文档 source_type）
            # 方案：分桶检索（手册/API 与 案例分开取），避免案例把手册挤出 TopK
            manual_types = ["api_reference", "manual"]
            case_types = ["training_case", "case"]
            
            hints: List[str] = []
            if search_hints:
                for h in search_hints:
                    if not h:
                        continue
                    hs = str(h).strip()
                    if not hs:
                        continue
                    if hs not in hints:
                        hints.append(hs)
            if len(hints) > 5:
                hints = hints[:5]
            
            # 手册增强：从 query 中提取模块名，再做一轮“模块关键词”手册检索
            module_tokens = self._extract_required_modules(query)
            
            # 策略 B: 关键词检索 (k=10)
            keywords = self._extract_keywords(query)

            api_like_tokens = []
            for m in re.findall(r"\b[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\b", query):
                if m not in api_like_tokens:
                    api_like_tokens.append(m)
            if len(api_like_tokens) > 8:
                api_like_tokens = api_like_tokens[:8]
            
            # 针对 API 形式的 token，追加“全字段检索”变体，确保检索到说明/参数/范例
            api_expanded_queries = []
            for token in api_like_tokens:
                api_expanded_queries.append(f"{token} 说明 格式定义 参数 备注 范例")

            query_variants: List[str] = []
            candidates = [query] + api_expanded_queries + [keywords, " ".join(module_tokens) if module_tokens else "", " ".join(api_like_tokens) if api_like_tokens else ""]
            
            for qv in candidates:
                qv = (qv or "").strip()
                if qv and qv not in query_variants:
                    query_variants.append(qv)
            for h in hints:
                if h and h not in query_variants:
                    query_variants.append(h)

            results_manual = []
            results_case = []
            for qv in query_variants:
                if keywords and qv == keywords and (os.environ.get("CDEM_RAG_DEBUG") or "").strip() in {"1", "true", "on", "yes"}:
                    print(f"RAG debug keyword search: {keywords}")
                results_manual.extend(search_with_fallback(qv, k=6, source_types=manual_types))
                results_case.extend(search_with_fallback(qv, k=4, source_types=case_types))
            
            # 3. 合并与去重
            seen_sources = set()
            combined_candidates = []
            
            def add_docs(candidates):
                for doc in candidates:
                    src = doc.metadata.get('source', '')
                    if not src:
                        src = (doc.metadata or {}).get("doc_id", "") or (doc.metadata or {}).get("path", "") or "unknown"
                    if src in seen_sources:
                        continue
                    seen_sources.add(src)
                    combined_candidates.append(doc)

            add_docs(results_manual)
            add_docs(results_case)
            
            # 取 Top N 进入二次排序（手册/API优先）
            docs = combined_candidates[:14]
            
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
        
        per_doc_chars = int(os.environ.get("CDEM_RAG_MAX_CHARS_PER_DOC", "1600"))
        total_chars_limit = int(os.environ.get("CDEM_RAG_MAX_TOTAL_CHARS", "14000"))

        def clip(text: str, limit: int) -> str:
            if not text:
                return ""
            return text[:limit] + ("\n...（已截断）" if len(text) > limit else "")
        
        context_parts: List[str] = []
        used_chars = 0
        
        def render_group(title: str, docs_group: List, label: str, max_n: int):
            nonlocal used_chars
            if not docs_group:
                return
            context_parts.append(f"\n【{title}】\n")
            for i, doc in enumerate(docs_group[:max_n], 1):
                if used_chars >= total_chars_limit:
                    break
                remaining = max(0, total_chars_limit - used_chars)
                limit = min(per_doc_chars, remaining) if remaining else 0
                if limit <= 0:
                    break
                ref = clip(doc.page_content, limit=limit)
                meta = doc.metadata or {}
                source = meta.get("source", "unknown")
                if not ref:
                    continue
                if (os.environ.get("CDEM_RAG_DEBUG") or "").strip() in {"1", "true", "on", "yes"}:
                    print(f"RAG debug retrieved doc {i}: {source}")
                context_parts.append(f"--- {label} {i} (来源: {source}) ---\n{ref}\n")
                used_chars += len(ref)
        
        max_manual_n = int(os.environ.get("CDEM_RAG_MAX_MANUAL_DOCS", "6"))
        max_case_n = int(os.environ.get("CDEM_RAG_MAX_CASE_DOCS", "4"))
        max_other_n = int(os.environ.get("CDEM_RAG_MAX_OTHER_DOCS", "2"))
        render_group("技术手册 / API（优先依据）", api_docs + manual_docs, "手册/接口", max_n=max_manual_n)
        render_group("案例参考（仅供结构与参数范围参考，禁止逐行抄写）", case_docs, "案例", max_n=max_case_n)
        render_group("其他检索片段", other_docs, "片段", max_n=max_other_n)
        
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

    def _get_default_system_prompt(self) -> str:
        """默认系统提示词"""
        return """你是一个专业的CDEM物理仿真脚本生成助手。

你的任务是：
1. **分析需求**：仔细阅读用户的详细需求规范，特别是推荐的搜索关键词。
2. **使用知识**：
   - 如果输入中已经包含【知识库检索结果】，请直接基于其中的【技术手册/API】编写脚本，不要再次调用 `search_physics_knowledge`。
   - 如果输入中没有提供【知识库检索结果】，才允许调用 `search_physics_knowledge` 进行检索，并优先查找具体的 API 接口说明（如 `API参考` 类型的文档），其次查找类似的完整脚本案例。
3. **生成脚本**：基于技术手册/API（优先）与案例（仅参考流程结构与参数范围），编写准确的 JavaScript 脚本。

重要规则：
- **API 优先**：如果检索到了具体的 API 文档（如 `API名称: Set`），请严格按照文档中的参数说明和示例来编写代码，不要臆造 API。
- **禁止重复检索**：当输入已经提供【知识库检索结果】时，不要反复检索同一关键词。
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
        flags = getattr(self, "feature_flags", None) or AgentFeatureFlags.from_env()
        
        max_recursion_limit = int(os.environ.get("CDEM_AGENT_RECURSION_LIMIT", "25"))
        max_tool_calls = int(os.environ.get("CDEM_AGENT_MAX_TOOL_CALLS", "6"))
        stream_timeout_s = float(os.environ.get("CDEM_AGENT_STREAM_TIMEOUT_SECONDS", "90"))
        total_timeout_s = float(os.environ.get("CDEM_AGENT_TOTAL_TIMEOUT_SECONDS", "240"))
        max_repeat_signature = int(os.environ.get("CDEM_AGENT_MAX_REPEAT_SIGNATURE", "6"))
        max_chunks = int(os.environ.get("CDEM_AGENT_MAX_CHUNKS", str(max_recursion_limit * 4)))

        if flags.enable_generation_memory and os.environ.get("CDEM_RESET_MEMORY_EACH_CALL", "0").strip() in {"1", "true", "True"}:
            self.reset_generation_memory()
        
        if not hasattr(self, "_generation_memory"):
            self._generation_memory = {
                "last_feedback": "",
                "last_query": "",
                "global_feedback": [],
            }
        
        def build_memory_prompt() -> str:
            if not flags.enable_generation_memory:
                return ""
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
            last_ai_text = ""
            final_messages = []
            
            input_messages = [HumanMessage(content=prompt_text)]
            memory_prompt = build_memory_prompt()
            if memory_prompt and flags.enable_generation_memory:
                input_messages.insert(0, SystemMessage(content=memory_prompt))
            if dynamic_sys_prompt:
                input_messages.insert(0, SystemMessage(content=f"【动态优化指令】\n{dynamic_sys_prompt}"))
            if dyn_prompt:
                input_messages.insert(0, SystemMessage(content=f"【动态优化指令】\n{dyn_prompt}"))

            # 兼容性处理：如果 executor 期待 list，传入 list；如果期待 dict，传入 dict
            # 标准 create_agent 生成的 executor 通常接受 {"messages": ...}
            
            if not getattr(self, "agent_executor", None):
                try:
                    resp = self.llm.invoke(input_messages)
                    local_generated = getattr(resp, "content", "") or ""
                except Exception:
                    local_generated = ""
                return local_generated, 0, time.time() - t0

            step = 0
            tool_calls = 0
            hit_limit = False
            hit_reason = ""
            last_sig = ""
            repeat_sig = 0
            for chunk in self.agent_executor.stream(
                {"messages": input_messages},
                stream_mode="values",
                config={"recursion_limit": max_recursion_limit},
            ):
                now = time.time()
                if (now - t0) >= stream_timeout_s:
                    if verbose:
                        print(f"\n⏱️ 达到单次生成超时限制: {now - t0:.1f}s/{stream_timeout_s}s，截断以避免循环。")
                    hit_limit = True
                    hit_reason = "stream_timeout"
                    break
                if (now - start_time) >= total_timeout_s:
                    if verbose:
                        print(f"\n⏱️ 达到总超时限制: {now - start_time:.1f}s/{total_timeout_s}s，截断以避免循环。")
                    hit_limit = True
                    hit_reason = "total_timeout"
                    break

                step += 1
                final_messages = chunk["messages"]
                last_message = chunk["messages"][-1]
                
                if step >= max_chunks:
                    if verbose:
                        print(f"\n⚠️ 达到最大chunk限制: {step}/{max_chunks}，提前结束以避免循环。")
                    hit_limit = True
                    hit_reason = "max_chunks"
                    break

                if isinstance(last_message, AIMessage):
                    if last_message.content:
                        last_ai_text = last_message.content

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

                    sig = ""
                    if last_message.tool_calls:
                        try:
                            tc0 = last_message.tool_calls[0]
                            sig = f"tool:{tc0.get('name')}:{json.dumps(tc0.get('args', {}), ensure_ascii=False, sort_keys=True)}"
                        except Exception:
                            sig = "tool:unknown"
                    else:
                        sig = "final:" + (last_message.content or "").strip()[:200]
                    if sig and sig == last_sig:
                        repeat_sig += 1
                    else:
                        repeat_sig = 0
                        last_sig = sig
                    if repeat_sig >= max_repeat_signature:
                        if verbose:
                            print(f"\n⚠️ 检测到重复行为（signature 连续重复 {repeat_sig} 次），截断以避免循环。")
                        hit_limit = True
                        hit_reason = "repeat_signature"
                        break
                elif hasattr(last_message, "type") and last_message.type == "tool":
                    tool_calls += 1
                
                if tool_calls >= max_tool_calls:
                    if verbose:
                        print(f"\n⚠️ 达到最大工具调用次数限制: {tool_calls}/{max_tool_calls}，提前结束以避免循环。")
                    hit_limit = True
                    hit_reason = "max_tool_calls"
                    break
                if step >= max_recursion_limit:
                    if verbose:
                        print(f"\n⚠️ 达到最大步数限制: {step}/{max_recursion_limit}，提前结束以避免循环。")
                    hit_limit = True
                    hit_reason = "max_steps"
                    break
            
            # 准确统计工具调用次数 (遍历最终消息历史)
            local_retrieved = sum(1 for m in final_messages if hasattr(m, "type") and m.type == "tool")
            
            if hit_limit and not local_generated:
                if last_ai_text:
                    local_generated = last_ai_text

            if hit_limit and not local_generated and (time.time() - start_time) < total_timeout_s:
                try:
                    resp = self.llm.invoke(input_messages)
                    if hasattr(resp, "content") and resp.content:
                        local_generated = resp.content
                except Exception as e:
                    if verbose:
                        print(f"\n⚠️ 降级为直连模型生成失败: {e}")
            
            if hit_limit:
                self.last_run_metrics["cutoff"] = {
                    "hit": True,
                    "reason": hit_reason,
                    "steps": step,
                    "tool_calls": tool_calls,
                    "elapsed_s": round(time.time() - t0, 3),
                }

            return local_generated, local_retrieved, time.time() - t0

        try:
            if verbose:
                print(f"\nQuery: {query}")

            search_hints: List[str] = []

            retrieval_query = query
            reference_context = ""
            system_retrieved_count = 0
            if flags.enable_rag:
                reference_context, system_retrieved_count = self._build_reference_context(retrieval_query, search_hints=search_hints)
                retrieved_count = max(retrieved_count, system_retrieved_count)
            
            # 增强检索逻辑：如果检索结果为空，或者第一轮检索质量可能不佳，尝试混合策略
            if flags.enable_rag and flags.enable_rag_fallback and system_retrieved_count == 0:
                if verbose:
                    print("RAG: 0 chunks, trying fallback...")
                
                # 策略 1: 提取英文关键词 (针对 "FracS", "UCTest" 等)
                english_keywords = re.findall(r'[a-zA-Z0-9]+', retrieval_query)
                # 过滤掉通用词
                stop_words = {'cdyna', 'case', 'script', 'gflow', 'mudsim', 'supercdem', '3d', '2d'}
                specific_keywords = [k for k in english_keywords if k.lower() not in stop_words and len(k) > 3]
                
                if specific_keywords:
                    keyword_query = " ".join(specific_keywords)
                    if verbose:
                        print(f"Fallback keywords: {keyword_query}")
                    ref_ctx_1, count_1 = self._build_reference_context(keyword_query, search_hints=search_hints)
                    if count_1 > 0:
                        reference_context = ref_ctx_1
                        retrieved_count = max(retrieved_count, count_1)
                
                # 策略 2: 如果策略1还是没结果，尝试模块名提取
                if retrieved_count == 0:
                    modules = self._extract_required_modules(retrieval_query)
                    if modules:
                        module_query = " ".join(modules) + " case example"
                        if verbose:
                            print(f"Fallback modules: {module_query}")
                        ref_ctx_2, count_2 = self._build_reference_context(module_query, search_hints=search_hints)
                        if count_2 > 0:
                            reference_context = ref_ctx_2
                            retrieved_count = max(retrieved_count, count_2)

            if verbose:
                print(f"RAG: {retrieved_count} chunks")
                print("\n【参考文档内容】")
                print(reference_context)
                print("【参考文档结束】\n")
            
            # --- 意图识别与分支 ---
            # 简单启发式：如果包含“脚本”、“生成”、“代码”、“case”、“example”且不包含“问”、“什么”、“解释”，则倾向于生成脚本
            # 否则如果是纯疑问句，倾向于 QA
            
            is_coding_task = True
            q_lower = query.lower()
            qa_triggers = ["如何", "怎么", "什么", "解释", "含义", "介绍", "which", "what", "how", "explain", "meaning", "？", "?"]
            code_triggers = ["脚本", "代码", "生成", "写一个", "实现", "script", "code", "generate", "implement"]
            
            # 1. 优先判定 Coding Task
            if any(t in q_lower for t in code_triggers):
                is_coding_task = True
            # 2. 如果包含 QA 触发词，且不包含明确的代码生成指令，则判定为 QA
            elif any(t in q_lower for t in qa_triggers):
                is_coding_task = False
            
            if not is_coding_task:
                if verbose:
                    print("🔍 识别为 QA 问答任务")
                
                qa_prompt = (
                    "【角色设定】\n"
                    "你是 CDEM 物理仿真软件的技术支持专家。请基于参考资料回答用户问题。\n\n"
                    "【用户问题】\n"
                    f"{query}\n\n"
                    "【参考资料】\n"
                    f"{reference_context}\n\n"
                    "【回答要求】\n"
                    "1. 必须基于参考资料回答，不要编造。\n"
                    "2. 如果资料中没有相关信息，请直接说明“资料不足”。\n"
                    "3. 如果涉及 API 用法，请给出简短的代码示例（使用 ```javascript ... ```）。\n"
                    "4. 回答要简洁明了，使用中文。\n"
                )
                
                qa_resp, _, _ = run_once(qa_prompt)
                
                self.last_run_metrics = {
                    "task_type": "qa",
                    "retrieved_docs_count": int(retrieved_count),
                    "duration_s": 0.0, 
                }
                
                if verbose:
                    print("\n【QA 回答】")
                    print(qa_resp)
                    print("【QA 回答结束】\n")
                    
                return qa_resp, time.time() - start_time, retrieved_count

            if verbose:
                print("💻 识别为 脚本生成任务")
            
            if flags.enable_task_steps:
                steps = self._build_task_steps(query=query, reference_context=reference_context)
            else:
                steps = [
                    "解析需求并确定目标模块与物理过程",
                    "确认关键 API 与参数约束",
                    "搭建初始化、边界、载荷与求解设置",
                    "输出可运行脚本并包含监测与输出",
                ]
            if verbose:
                print("任务拆解:")
                for i, s in enumerate(steps, 1):
                    print(f"{i}. {s}")

            steps_text = "\n".join([f"{i}. {s}" for i, s in enumerate(steps, 1)])

            base_prompt = (
                "【任务拆解】\n"
                + steps_text
                + "\n\n"
                "【用户需求与背景】\n"
                + query
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
            
            if verbose:
                print("\n【生成脚本】")
                print(generated_code)
                print("【生成脚本结束】\n")
            
            # 检测是否输出了 JSON 格式的伪代码
            is_json_output = generated_code.strip().startswith("{") and '"name":' in generated_code

            # 检测缺失的模块
            missing_modules = self._missing_required_modules(generated_code, required_modules)

            normalized = CodeSimilarityCalculator._normalize_code(generated_code)
            used_strict_retry = False
            
            # 移除 retrieved_once == 0 的检查，因为我们采用了 Pre-retrieval 模式
            if flags.enable_strict_retry and (("search_physics_knowledge" in generated_code) or len(normalized.splitlines()) < 10 or is_json_output or missing_modules):
                used_strict_retry = True
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
                issues: List[str] = []
                if is_json_output:
                    issues.append("json_output")
                if "search_physics_knowledge" in generated_code:
                    issues.append("tool_leak")
                if len(normalized.splitlines()) < 10:
                    issues.append("too_short")
                if missing_modules:
                    issues.append("missing_modules")

                dyn = "拟合度优先：确保脚本可直接运行，补全缺失模块调用与求解入口，禁止输出 JSON/工具名。"
                if flags.enable_prompt_optimizer and self.prompt_optimizer is not None:
                    try:
                        dyn = self.prompt_optimizer.optimize_retry_prompt(issues=issues, query=query)
                    except Exception:
                        pass

                generated_text_strict, retrieved_retry, dur_retry = run_once(strict_prompt, dyn_prompt=dyn)
                if generated_text_strict:
                    generated_code = self._extract_code(generated_text_strict)
                    retrieved_count = max(retrieved_count, retrieved_retry, retrieved_count)
                    dur_once = max(dur_once, dur_retry)
            
            final_is_json_output = generated_code.strip().startswith("{") and '"name":' in generated_code
            final_missing_modules = self._missing_required_modules(generated_code, required_modules)
            cutoff_info = dict(self.last_run_metrics.get("cutoff") or {}) if isinstance(self.last_run_metrics, dict) else {}
            self.last_run_metrics = {
                "retrieved_docs_count": int(retrieved_count),
                "used_strict_retry": bool(used_strict_retry),
                "final_is_json_output": bool(final_is_json_output),
                "final_missing_modules": list(final_missing_modules),
                "duration_s": round(float(dur_once), 3),
                "task_steps": list(steps),
            }
            if cutoff_info:
                self.last_run_metrics["cutoff"] = cutoff_info
            
            feedback_items = self._build_feedback_items(generated_code, required_modules)
            
            if flags.enable_generation_memory:
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

    def _normalize_script_content(self, text: str) -> str:
        if text is None:
            return ""
        t = str(text)
        t = t.replace("\r\n", "\n").replace("\r", "\n")
        t = t.strip()
        if not t:
            return ""
        if "```" in t:
            pattern = r"```(?:javascript|js)?\s*\n(.*?)```"
            matches = re.findall(pattern, t, re.DOTALL | re.IGNORECASE)
            if matches:
                t = (matches[0] or "").strip()
        t = re.sub(r"[ \t]+\n", "\n", t)
        if not t.endswith("\n"):
            t += "\n"
        return t

    def _safe_relpath(self, filename: str) -> Path:
        raw = (filename or "").strip()
        if not raw:
            return Path("unknown.js")
        if Path(raw).is_absolute():
            raw = Path(raw).name
        p = PurePosixPath(raw.replace("\\", "/"))
        parts = [x for x in p.parts if x not in {"", ".", ".."}]
        if not parts:
            return Path("unknown.js")
        safe_parts = []
        for x in parts:
            x2 = re.sub(r'[<>:"/\\|?*\x00-\x1F]+', "_", x).strip()
            safe_parts.append(x2 or "_")
        return Path(*safe_parts)

    def _append_jsonl(self, path: Path, obj: Dict[str, Any]) -> None:
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(path, "a", encoding="utf-8") as f:
                f.write(json.dumps(obj, ensure_ascii=False) + "\n")
        except Exception:
            return

    def _organize_case_outputs(self, dataset_split: str, filename: str, query: str, ground_truth: str, generated: str) -> Dict[str, str]:
        enabled = (os.environ.get("CDEM_EVAL_ORGANIZE_SCRIPTS") or "1").strip().lower() not in {"0", "false", "off", "no"}
        if not enabled:
            return {"generated": "", "ground_truth": ""}

        split = (dataset_split or "").strip().lower()
        if split not in {"train", "test"}:
            split = "other"

        base_dir = Path((os.environ.get("CDEM_EVAL_SCRIPTS_DIR") or "").strip())
        if not base_dir:
            base_dir = self.output_dir / "scripts"
        if not base_dir.is_absolute():
            base_dir = (self.output_dir / base_dir).resolve()

        rel = self._safe_relpath(filename)
        generated_path = (base_dir / split / "generated" / rel).with_suffix(".js")
        ground_truth_path = (base_dir / split / "ground_truth" / rel).with_suffix(".js")
        manifest_path = base_dir / split / "manifest.jsonl"

        gen_text = self._normalize_script_content(generated)
        gt_text = self._normalize_script_content(ground_truth)

        try:
            generated_path.parent.mkdir(parents=True, exist_ok=True)
            generated_path.write_text(gen_text, encoding="utf-8")
        except Exception:
            generated_path = Path("")

        try:
            ground_truth_path.parent.mkdir(parents=True, exist_ok=True)
            ground_truth_path.write_text(gt_text, encoding="utf-8")
        except Exception:
            ground_truth_path = Path("")

        self._append_jsonl(
            manifest_path,
            {
                "filename": filename,
                "query": query,
                "generated_script": str(generated_path) if str(generated_path) else "",
                "ground_truth_script": str(ground_truth_path) if str(ground_truth_path) else "",
                "saved_at": datetime.now().isoformat(),
            },
        )
        return {
            "generated": str(generated_path) if str(generated_path) else "",
            "ground_truth": str(ground_truth_path) if str(ground_truth_path) else "",
        }

    def _read_case_text(self, file_path: Path) -> tuple[str, str]:
        data = file_path.read_bytes()
        encodings = ["utf-8", "utf-8-sig", "gb18030", "gbk", "cp936"]
        for enc in encodings:
            try:
                return data.decode(enc), enc
            except UnicodeDecodeError:
                continue
        return data.decode("utf-8", errors="replace"), "utf-8(replace)"

    def evaluate_single_case(self, filename: str, ground_truth_code: str, verbose: bool = False, dataset_split: Optional[str] = None) -> EvaluationResult:
        """评估单个测试案例"""
        if os.environ.get("CDEM_EVAL_RESET_MEMORY_PER_CASE", "1").strip() in {"1", "true", "True"}:
            try:
                self.agent_module.reset_generation_memory()
            except Exception:
                pass

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
        
        diff_unified = self._build_unified_diff(
            filename=filename,
            ground_truth_code=ground_truth_code,
            generated_code=generated_code,
        )
        diff_file = self._save_diff_file(filename=filename, diff_text=diff_unified)

        category = self._determine_category(filename)
        saved = {"generated": "", "ground_truth": ""}
        if dataset_split:
            saved = self._organize_case_outputs(dataset_split=dataset_split, filename=filename, query=query, ground_truth=ground_truth_code, generated=generated_code)
        
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
            diff_unified=diff_unified[:12000] if diff_unified else "",
            diff_file=str(diff_file) if diff_file else "",
            dataset_split=str(dataset_split or ""),
            saved_generated_script=saved.get("generated") or "",
            saved_ground_truth_script=saved.get("ground_truth") or "",
            task_steps=[str(x).strip() for x in (extra.get("task_steps") or []) if str(x).strip()],
            evaluation_time=datetime.now().isoformat(),
            last_run_metrics=dict(extra),
        )
        return result

    def _build_unified_diff(self, filename: str, ground_truth_code: str, generated_code: str) -> str:
        gt_lines = (ground_truth_code or "").splitlines()
        gen_lines = (generated_code or "").splitlines()
        diff = difflib.unified_diff(
            gt_lines,
            gen_lines,
            fromfile=f"{filename} (ground_truth)",
            tofile=f"{filename} (generated)",
            lineterm="",
            n=3,
        )
        return "\n".join(diff)

    def _save_diff_file(self, filename: str, diff_text: str) -> Optional[Path]:
        if not diff_text:
            return None
        diff_dir = self.output_dir / "diffs"
        diff_dir.mkdir(exist_ok=True)
        safe_name = Path(filename).stem
        diff_path = diff_dir / f"{safe_name}.diff"
        try:
            diff_path.write_text(diff_text, encoding="utf-8")
            return diff_path
        except Exception:
            return None

    def _save_debug_info(self, filename, query, ground_truth, generated):
        """保存调试信息到文件"""
        debug_dir = self.output_dir / "debug_failures"
        debug_dir.mkdir(exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = Path(filename).stem
        debug_file = debug_dir / f"{safe_name}_{timestamp}.md"
        diff_unified = self._build_unified_diff(filename=filename, ground_truth_code=ground_truth, generated_code=generated)
        with open(debug_file, "w", encoding="utf-8") as f:
            f.write(f"# Failure Analysis: {filename}\n\n")
            f.write(f"## Query\n{query}\n\n")
            f.write(f"## Generated Code\n```javascript\n{generated}\n```\n\n")
            f.write(f"## Ground Truth\n```javascript\n{ground_truth}\n```\n")
            if diff_unified:
                f.write("\n## Unified Diff\n```diff\n")
                f.write(diff_unified)
                f.write("\n```\n")

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

    def run_custom_query(self, query: str, case_filename: Optional[str] = None, verbose: bool = True) -> Dict[str, Any]:
        generated_code, gen_time, retrieved_count = self.agent_module.generate_code(query, verbose=verbose)
        extra = dict(getattr(self.agent_module, "last_run_metrics", {}) or {})
        out: Dict[str, Any] = {
            "query": query,
            "generation_time": float(gen_time),
            "retrieved_docs_count": int(retrieved_count),
            "generated_code": generated_code,
            "task_steps": list(extra.get("task_steps") or []),
            "last_run_metrics": extra,
        }
        if not case_filename:
            return out
        file_path = self.test_data_dir / case_filename
        try:
            ground_truth, used_enc = self._read_case_text(file_path)
        except Exception as e:
            out["error"] = f"无法读取对比案例: {file_path} ({e})"
            return out
        similarity = CodeSimilarityCalculator.calculate_similarity(ground_truth, generated_code)
        diff_unified = self._build_unified_diff(
            filename=case_filename,
            ground_truth_code=ground_truth,
            generated_code=generated_code,
        )
        diff_file = self._save_diff_file(filename=case_filename, diff_text=diff_unified)
        out.update(
            {
                "case_filename": case_filename,
                "ground_truth_encoding": used_enc,
                "similarity_score": float(similarity),
                "diff_unified": diff_unified[:12000] if diff_unified else "",
                "diff_file": str(diff_file) if diff_file else "",
            }
        )
        return out

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
                ground_truth, used_enc = self._read_case_text(file_path)
            except Exception as e:
                print(f"❌ 读取失败: {e}")
                continue
            
            # --- B组：关闭预处理 (Baseline) ---
            print("  Running Baseline (Preproc OFF)...")
            self.agent_module.enable_preprocessing = False
            res_b = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            res_b.last_run_metrics["ground_truth_encoding"] = used_enc
            results_b.append(res_b)
            
            # --- A组：开启预处理 (Experimental) ---
            print("  Running Experimental (Preproc ON)...")
            self.agent_module.enable_preprocessing = True
            res_a = self.evaluate_single_case(filename, ground_truth, verbose=verbose)
            res_a.last_run_metrics["ground_truth_encoding"] = used_enc
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
                ground_truth, used_enc = self._read_case_text(file_path)
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose, dataset_split="train")
            result.last_run_metrics["ground_truth_encoding"] = used_enc
            self.results.append(result)
            
            print(f"  相似度: {result.similarity_score:.3f} | 质量: {result.code_quality_score:.1f}/10 | 功能: {result.functionality_score:.1f}/10 | 耗时: {result.generation_time:.1f}s")
            if result.task_steps:
                print("  任务拆解:")
                for j, s in enumerate(result.task_steps, 1):
                    print(f"    {j}. {s}")
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
                ground_truth, used_enc = self._read_case_text(file_path)
            except Exception as e:
                print(f"  ❌ 无法读取文件: {e}")
                continue
            
            result = self.evaluate_single_case(filename, ground_truth, verbose=verbose, dataset_split="test")
            result.last_run_metrics["ground_truth_encoding"] = used_enc
            self.results.append(result)
            print(f"  ✓ 相似度: {result.similarity_score:.3f} | 质量: {result.code_quality_score:.1f}/10 | 功能: {result.functionality_score:.1f}/10")
            if result.task_steps:
                print("  任务拆解:")
                for j, s in enumerate(result.task_steps, 1):
                    print(f"    {j}. {s}")
        
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
    
    def __init__(
        self,
        vector_db_path: str,
        test_data_dir: str,
        output_dir: str,
        model_name: str = "llama3.1:latest",
        enable_preprocessing: bool = True,
        query_dataset_json: Optional[str] = None,
        vector_db_collection: Optional[str] = None,
        feature_flags: Optional[AgentFeatureFlags] = None,
    ):
        self.feature_flags = feature_flags or AgentFeatureFlags.from_env()

        self.vector_module = None
        if self.feature_flags.enable_vector_kb:
            collection = (vector_db_collection or os.environ.get("CDEM_VECTOR_DB_COLLECTION") or "new_db_cdem").strip()
            self.vector_module = VectorKnowledgeBaseModule.connect(vector_db_path, collection_name=collection)
        
        self.tool_module = None
        tools: List[Any] = []
        if self.feature_flags.enable_tools and self.vector_module is not None:
            self.tool_module = ToolConstructionModule(model_name=model_name, feature_flags=self.feature_flags)
            physics_tool = self.tool_module.build_physics_search_tool(self.vector_module)
            tools = [physics_tool]
        
        self.agent_module = AgentConstructionModule(
            tools=tools,
            model_name=model_name,
            enable_preprocessing=enable_preprocessing,
            vectorstore=self.vector_module if self.feature_flags.enable_rag else None,
            feature_flags=self.feature_flags,
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
    
    def run_custom_query(self, query: str, case_filename: Optional[str] = None, verbose: bool = True) -> Dict[str, Any]:
        return self.eval_module.run_custom_query(query=query, case_filename=case_filename, verbose=verbose)


def main():
    """主函数"""
    # =====================================================================
    # 配置区域
    # =====================================================================
    
    project_root = Path(__file__).resolve().parents[2]
    repo_root = Path(__file__).resolve().parents[3]

    def resolve_env_path(key: str, default_path: Path) -> str:
        raw = (os.environ.get(key) or "").strip()
        if not raw:
            return str(default_path)
        p = Path(raw)
        if not p.is_absolute():
            p = (repo_root / p).resolve()
        return str(p)
    
    default_vector_db_path = project_root / "tools" / "js_store" / "new_db_cdem"
    VECTOR_DB_PATH = resolve_env_path("CDEM_VECTOR_DB_PATH", default_vector_db_path)
    VECTOR_DB_COLLECTION = (os.environ.get("CDEM_VECTOR_DB_COLLECTION") or "new_db_cdem").strip()
    
    # 2. 数据集配置
    dataset_root = project_root / "dataset_split_results"
    default_dataset_split_json = dataset_root / "dataset_split.json"
    default_query_dataset_json = dataset_root / "case_queries_content.json"
    DATASET_SPLIT_JSON = resolve_env_path("CDEM_DATASET_SPLIT_JSON", default_dataset_split_json)
    QUERY_DATASET_JSON = resolve_env_path("CDEM_QUERY_DATASET_JSON", default_query_dataset_json)
    
    docs_root = project_root / "docs"
    default_test_data_dir = docs_root / "CDEM案例库及手册"
    TEST_DATA_DIR = resolve_env_path("CDEM_CASE_DIR", default_test_data_dir)
    
    # 3. 输出目录
    default_output_dir = Path(__file__).resolve().parent / "results/evaluation_results"
    OUTPUT_DIR = resolve_env_path("CDEM_EVAL_OUTPUT_DIR", default_output_dir)
    
    # 4. LLM模型
    provider = (os.environ.get("CDEM_LLM_PROVIDER") or "bailian").strip().lower()
    default_model = "llama3.1:latest" if provider in {"ollama", "local"} else "qwen3.5-flash"
    MODEL_NAME = os.environ.get("CDEM_LLM_MODEL", default_model)
    
    # 5. 功能配置
    ENABLE_PREPROCESSING = False
    RUN_AB_TEST = False          # 是否运行A/B对比测试
    
    # =====================================================================
    # 评估流程
    # =====================================================================
    
    print("CDEM Agent Eval")
    print(f"DB: {VECTOR_DB_PATH} (collection={VECTOR_DB_COLLECTION})")
    print(f"Cases: {TEST_DATA_DIR}")
    print(f"Model: {MODEL_NAME}")
    print(f"Output: {OUTPUT_DIR}")
    
    # 创建评估器
    evaluator = CDEMAgentEvaluator(
        vector_db_path=VECTOR_DB_PATH,
        vector_db_collection=VECTOR_DB_COLLECTION,
        test_data_dir=TEST_DATA_DIR,
        output_dir=OUTPUT_DIR,
        model_name=MODEL_NAME,
        enable_preprocessing=ENABLE_PREPROCESSING,
        query_dataset_json=QUERY_DATASET_JSON
    )

    custom_query = (os.environ.get("CDEM_CUSTOM_QUERY") or "").strip()
    custom_case = (os.environ.get("CDEM_CUSTOM_CASE") or "").strip() or None
    if not custom_query:
        try:
            custom_query = (input("请输入自定义query（回车跳过进入数据集评估）: ") or "").strip()
        except Exception:
            custom_query = ""
    if custom_query:
        if not custom_case:
            try:
                custom_case = (input("可选：输入要对比的案例文件名（相对案例目录，回车跳过）: ") or "").strip() or None
            except Exception:
                custom_case = None
        out = evaluator.run_custom_query(custom_query, case_filename=custom_case, verbose=True)
        print("\n" + "=" * 60)
        print("✅ 自定义Query测试完成")
        if out.get("case_filename"):
            print(f"对比案例: {out.get('case_filename')}")
            print(f"相似度: {out.get('similarity_score')}")
            if out.get("diff_file"):
                print(f"Diff文件: {out.get('diff_file')}")
        print("=" * 60)
        return
    
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
