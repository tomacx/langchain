#!/usr/bin/env python3
"""
CDEM 案例库及手册向量数据库构建器 (Windows/Chroma版)
专门处理 CDEM案例库及手册 目录 + 训练集JS文件
"""

import os
import re
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime

# LangChain imports
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

# Markdown processing
import markdown
from bs4 import BeautifulSoup

# JavaScript parsing
import esprima
import fitz  # PyMuPDF

@dataclass
class CDEMDocument:
    """CDEM统一文档模型"""
    doc_id: str
    source_type: str  # "manual" | "case" | "modeling" | "training_case"
    content: str
    metadata: Dict[str, Any]
    file_path: str
    category: str
    tags: List[str]

class CDEMKnowledgeBuilder:
    """CDEM知识库构建器 (Chroma版) - 增强支持训练集"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
        # 1. 初始化 Embedding 模型
        print(f"🔄 初始化 Embedding 模型: {config.get('embedding_model')}")
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # 2. 配置 Chroma 持久化目录 (自动创建)
        self.persist_directory = config.get("persist_directory", "./chroma_db")
        self.collection_name = config.get("collection_name", "cdem_knowledge")
        
        # 3. 文本分割器 - 普通文档
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.get("chunk_size", 1000),
            chunk_overlap=config.get("chunk_overlap", 200),
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

        # 4. 脚本分割器 - 专门用于JS代码
        # 脚本通常较长且需要保持完整上下文，因此使用更大的 chunk_size
        self.script_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.get("script_chunk_size", 8000),
            chunk_overlap=config.get("script_chunk_overlap", 0),
            length_function=len,
            separators=["\n\n", "\n", ";", ""]
        )
        
        # 5. 暂存文档列表
        self.documents: List[CDEMDocument] = []
        
    def scan_cdem_directory(self, directory: str) -> Dict[str, List[Path]]:
        """扫描CDEM目录，分类文件 (Windows路径适配) - 原有逻辑保持不变"""
        base_path = Path(directory)
        print(f"📂 扫描技术手册目录: {base_path.resolve()}")
        
        if not base_path.exists():
            raise FileNotFoundError(f"找不到目录: {base_path}")

        file_categories = {
            "manuals": [],       # 技术手册
            "cdyna_cases": [],   # CDyna案例
            "gflow_cases": [],   # GFlow案例
            "mudsim_cases": [],  # MudSim案例
            "supercdem_cases": [], # SuperCDEM案例
            "modeling_cases": [], # 建模及网格案例
            "pdf_files": []      # PDF文件
        }
        
        # 递归遍历所有文件
        for file_path in base_path.rglob("*"):
            if file_path.is_file() and file_path.name != ".DS_Store":
                file_name = file_path.name
                
                # 路径转为字符串用于判断，统一使用小写
                path_str = str(file_path).lower()
                
                if file_name.endswith(".md"):
                    file_categories["manuals"].append(file_path)
                        
                elif file_name.endswith(".pdf"):
                    file_categories["pdf_files"].append(file_path)
                    
                elif file_name.endswith(".js") or file_name.endswith(".txt"):
                    if "cdyna" in path_str:
                        file_categories["cdyna_cases"].append(file_path)
                    elif "gflow" in path_str:
                        file_categories["gflow_cases"].append(file_path)
                    elif "mudsim" in path_str:
                        file_categories["mudsim_cases"].append(file_path)
                    elif "supercdem" in path_str:
                        file_categories["supercdem_cases"].append(file_path)
                    elif "建模" in path_str or "网格" in path_str:
                        file_categories["modeling_cases"].append(file_path)
                    else:
                        # 默认归类
                        file_categories["cdyna_cases"].append(file_path)
        
        print("\n📊 技术手册文件分类统计:")
        for category, files in file_categories.items():
            print(f"  {category}: {len(files)} 个文件")
            
        return file_categories

    def load_training_set_files(self, dataset_split_json: str, case_dir: str) -> List[Path]:
        """
        【新增功能】从dataset_split.json加载80%训练集文件
        
        Args:
            dataset_split_json: dataset_split.json文件路径
            case_dir: 案例文件所在的根目录（419个脚本的目录）
            
        Returns:
            训练集文件的Path列表
        """
        training_files = []
        
        # 检查JSON文件是否存在
        split_file = Path(dataset_split_json)
        if not split_file.exists():
            print(f"⚠️  警告: 找不到数据集划分文件 {dataset_split_json}")
            print("   跳过训练集加载，仅使用技术手册构建向量库")
            return training_files
        
        print(f"\n📂 加载训练集文件列表: {dataset_split_json}")
        
        # 读取JSON
        try:
            with open(split_file, 'r', encoding='utf-8') as f:
                split_data = json.load(f)
        except Exception as e:
            print(f"❌ 读取数据集划分文件失败: {e}")
            return training_files
        
        # 获取训练集文件名列表
        train_filenames = split_data.get('train', [])
        print(f"✓ 训练集包含 {len(train_filenames)} 个文件")
        
        # 转换为完整路径
        case_base_path = Path(case_dir)
        if not case_base_path.exists():
            print(f"⚠️  警告: 案例目录不存在 {case_dir}")
            return training_files
        
        # 查找每个训练集文件
        found_count = 0
        missing_count = 0
        
        for filename in train_filenames:
            file_path = case_base_path / filename
            if file_path.exists():
                training_files.append(file_path)
                found_count += 1
            else:
                # 尝试递归查找
                found = list(case_base_path.rglob(filename))
                if found:
                    training_files.append(found[0])
                    found_count += 1
                else:
                    missing_count += 1
                    if missing_count <= 5:  # 只打印前5个缺失文件
                        print(f"  ⚠️  找不到: {filename}")
        
        if missing_count > 5:
            print(f"  ... 还有 {missing_count - 5} 个文件未找到")
        
        print(f"✓ 成功找到 {found_count}/{len(train_filenames)} 个训练集文件")
        
        return training_files

    def parse_training_case(self, file_path: Path) -> List[CDEMDocument]:
        """
        【新增功能】解析训练集案例文件
        使用与原有案例相同的解析逻辑，但标记为training_case
        
        Args:
            file_path: 训练集JS文件路径
            
        Returns:
            解析后的文档列表
        """
        documents = []
        content = self._read_file_content(file_path)
        if not content:
            return documents

        metadata = self._extract_common_metadata(file_path)
        
        # 从文件名推断案例类型
        filename_lower = file_path.name.lower()
        if 'cdyna' in filename_lower:
            case_type = 'CDyna'
        elif 'gflow' in filename_lower:
            case_type = 'GFlow'
        elif 'mudsim' in filename_lower:
            case_type = 'MudSim'
        elif 'supercdem' in filename_lower:
            case_type = 'SuperCDEM'
        elif '建模' in file_path.name or '网格' in file_path.name:
            case_type = 'Modeling'
        else:
            case_type = 'General'
        
        metadata['case_type'] = case_type
        metadata['is_training_set'] = True  # 标记为训练集
        
        # 整个文件作为一个文档（保证上下文完整）
        documents.append(CDEMDocument(
            doc_id=f"training_{case_type}_{file_path.stem}",
            source_type="training_case",
            content=content,
            metadata={**metadata, 'type': 'training_script'},
            file_path=str(file_path),
            category=f"{case_type}案例(训练集)",
            tags=[case_type, 'javascript', 'training']
        ))
            
        return documents

    def _read_file_content(self, file_path: Path) -> Optional[str]:
        """尝试多种编码读取文件 - 原有逻辑保持不变"""
        encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
            except Exception as e:
                print(f"⚠️ 读取错误 {file_path.name}: {e}")
                return None
        print(f"❌ 无法识别文件编码: {file_path.name}")
        return None

    def parse_cdem_manual_pdf(self, file_path: Path) -> List[CDEMDocument]:
        """
        解析 PDF 技术手册
        使用 PyMuPDF 提取文本，并尝试保留结构
        """
        documents = []
        try:
            doc = fitz.open(file_path)
            content = ""
            for page in doc:
                content += page.get_text() + "\n\n"
            doc.close()
        except Exception as e:
            print(f"❌ 解析 PDF 失败 {file_path.name}: {e}")
            return documents

        if not content.strip():
            return documents

        metadata = self._extract_common_metadata(file_path)
        
        # 1. 整体文档
        doc_id = f"manual_pdf_{file_path.stem}"
        doc = CDEMDocument(
            doc_id=doc_id,
            source_type="manual_pdf",
            content=content,
            metadata=metadata,
            file_path=str(file_path),
            category=metadata.get('category', '技术手册'),
            tags=['manual', 'pdf', metadata.get('module', 'general')]
        )
        documents.append(doc)
        
        # 2. 尝试简单的 API 提取 (基于 PDF 文本特征)
        # PDF 提取的文本通常没有 Markdown 那样的明确锚点，
        # 这里使用简单的关键词匹配来尝试提取可能的 API 章节
        # 例如查找类似 "Function:", "接口:", "说明:" 等模式
        
        # 简单的基于段落的分割，尝试找到函数定义
        # 假设函数定义通常独立成段，且包含 "function" 或 "接口" 字样
        # 这是一个简化的启发式策略
        
        return documents

    def parse_cdem_manual(self, file_path: Path) -> List[CDEMDocument]:
        """
        解析技术手册，提取 API 接口信息
        优化点：从技术手册中提取结构化的 API 描述
        """
        documents = []
        content = self._read_file_content(file_path)
        if not content:
            return documents

        metadata = self._extract_common_metadata(file_path)
        
        # 1. 保留原始手册文档（作为整体参考）
        doc_id = f"manual_{file_path.stem}"
        doc = CDEMDocument(
            doc_id=doc_id,
            source_type="manual",
            content=content,
            metadata=metadata,
            file_path=str(file_path),
            category=metadata.get('category', '技术手册'),
            tags=['manual', metadata.get('module', 'general')]
        )
        documents.append(doc)
        
        # 2. 提取 API 条目（增强索引）
        # 利用 <!--HJS_...--> 锚点分割 API
        api_sections = re.split(r'<!--HJS_', content)
        
        for section in api_sections[1:]: # 跳过第一个（通常是文件头）
            # 恢复 HJS_ 前缀以便后续可能需要
            section_content = "<!--HJS_" + section
            
            # 提取 API 名称
            # 通常在 ### Header 中
            header_match = re.search(r'###\s+(.+?)(?:\n|\r)', section)
            if header_match:
                api_name = header_match.group(1).strip()
                # 进一步清洗名称，去除 "方法"、"接口" 等后缀
                clean_api_name = re.sub(r'(方法|接口|函数|变量)$', '', api_name)
                
                # 提取简要说明
                desc_match = re.search(r'####\s+说明\s+(.+?)(?:\n####|\r####)', section, re.DOTALL)
                description = desc_match.group(1).strip() if desc_match else ""
                
                # 提取参数列表（简单提取）
                params_match = re.search(r'####\s+参数\s+(.+?)(?:\n####|\r####)', section, re.DOTALL)
                params = params_match.group(1).strip() if params_match else ""
                
                # 构建 API 专用文档块
                # 这个文档块专门用于回答 "如何使用 xxx 函数"
                api_doc_content = (
                    f"API名称: {clean_api_name}\n"
                    f"所属模块: {metadata.get('module', 'General')}\n"
                    f"功能说明: {description}\n"
                    f"参数详情: {params}\n"
                    f"完整文档:\n{section}"
                )
                
                api_doc = CDEMDocument(
                    doc_id=f"api_{clean_api_name}_{file_path.stem}",
                    source_type="api_reference",
                    content=api_doc_content,
                    metadata={
                        **metadata,
                        'api_name': clean_api_name,
                        'type': 'api_doc'
                    },
                    file_path=str(file_path),
                    category="API参考",
                    tags=['api', clean_api_name, metadata.get('module', 'general')]
                )
                documents.append(api_doc)
                
        return documents

    def parse_cdem_case(self, file_path: Path, case_type: str) -> List[CDEMDocument]:
        """解析案例文件 (JS/TXT) - 原有逻辑保持不变"""
        documents = []
        content = self._read_file_content(file_path)
        if not content:
            return documents

        metadata = self._extract_common_metadata(file_path)
        metadata['case_type'] = case_type
        
        # 如果是JS文件，尝试提取函数结构
        if file_path.suffix == '.js':
            # 1. 整体文件作为一个文档 (保证上下文完整)
            documents.append(CDEMDocument(
                doc_id=f"case_{case_type}_{file_path.stem}_full",
                source_type="case",
                content=content,
                metadata={**metadata, 'type': 'full_script'},
                file_path=str(file_path),
                category=f"{case_type}案例",
                tags=[case_type, 'javascript']
            ))
            
            # 2. 尝试解析函数 (可选增强)
            # 如果文件太大，可以基于 AST 拆分，但在 RAG 中通常直接切片即可
        
        else:
            # 配置文件或数据文件
            documents.append(CDEMDocument(
                doc_id=f"case_{case_type}_{file_path.stem}_config",
                source_type="case",
                content=content,
                metadata={**metadata, 'type': 'config'},
                file_path=str(file_path),
                category=f"{case_type}配置",
                tags=[case_type, 'config']
            ))
            
        return documents

    def _extract_common_metadata(self, file_path: Path) -> Dict[str, Any]:
        """提取通用元数据，利用文件名语义 - 原有逻辑保持不变"""
        # 将文件名切分为关键词，作为语义增强
        clean_name = file_path.stem
        # 简单的中文分词策略：按特殊符号分割
        keywords = re.split(r'[-_\s\(\)（）]', clean_name)
        keywords = [k for k in keywords if k]
        
        return {
            'file_name': file_path.name,
            'file_stem': file_path.stem,
            'keywords': keywords,
            'module': self._guess_module(file_path.name),
            'parent_folder': file_path.parent.name
        }

    def _guess_module(self, filename: str) -> str:
        """推测模块类型 - 原有逻辑保持不变"""
        if 'CDyna' in filename: return 'CDyna'
        if 'GFlow' in filename: return 'GFlow'
        if 'SuperCDEM' in filename: return 'SuperCDEM'
        if 'MudSim' in filename: return 'MudSim'
        return 'General'

    def chunk_and_convert_to_langchain(self) -> List[Document]:
        """
        核心逻辑 - 原有逻辑保持不变
        1. 对文档进行分块。
        2. **关键步骤**：将文件名和路径信息拼接到 content 头部。
           这确保了文件名中的语义信息（如"刚性面Part计算"）与代码内容紧密结合。
        """
        langchain_docs = []
        
        print(f"✂️  开始分块处理 {len(self.documents)} 个源文件...")
        
        for doc in self.documents:
            # 1. 切分文本
            # 根据源类型选择不同的分割器
            if doc.source_type == "api_reference":
                # API文档通常不需要再次切分，因为它们已经是按条目提取的
                chunks = [doc.content]
            elif doc.source_type in ["case", "training_case"]:
                # 脚本文件使用大块分割，尽可能保留完整代码
                chunks = self.script_splitter.split_text(doc.content)
            else:
                # 手册等文档使用常规分割
                chunks = self.text_splitter.split_text(doc.content)
            
            # 2. 构建语义增强的头部信息
            # Windows路径分隔符如果是反斜杠，显示时可能不美观，可转为 / 
            display_path = Path(doc.file_path).name # 只保留文件名，或者相对路径
            
            if doc.source_type == "api_reference":
                semantic_header = (
                    f"【API参考】\n"
                    f"API名称: {doc.metadata.get('api_name')}\n"
                    f"所属模块: {doc.metadata.get('module')}\n"
                    f"内容:\n"
                )
            else:
                semantic_header = (
                    f"文件名: {doc.metadata['file_name']}\n"
                    f"类别: {doc.category}\n"
                    f"关键词: {' '.join(doc.metadata['keywords'])}\n"
                    f"内容:\n"
                )
            
            for i, chunk in enumerate(chunks):
                # 拼接头部信息
                enhanced_content = semantic_header + chunk
                
                # 构建 LangChain Document
                lc_doc = Document(
                    page_content=enhanced_content,
                    metadata={
                        "doc_id": doc.doc_id,
                        "chunk_index": i,
                        "source": str(doc.file_path), # Chroma 喜欢 'source' 字段
                        "category": doc.category,
                        "file_name": doc.metadata['file_name'],
                        "source_type": doc.source_type  # 添加源类型标记
                    }
                )
                langchain_docs.append(lc_doc)
                
        return langchain_docs

    def store_to_chroma(self, documents: List[Document]):
        """存储到本地 Chroma - 原有逻辑保持不变"""
        if not documents:
            print("⚠️ 没有文档需要存储")
            return

        print(f"💾 正在将 {len(documents)} 个文档块存入 Chroma (目录: {self.persist_directory})...")
        
        # 初始化 Chroma，直接传入 Document 列表进行持久化
        # client_settings 可用于优化性能，但在 Windows 本地默认即可
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=self.persist_directory,
            collection_name=self.collection_name
        )
        
        print("✅ 数据存储完成!")
        return vectorstore

    async def build(self, 
                   manual_directory: str,
                   training_set_json: Optional[str] = None,
                   case_directory: Optional[str] = None):
        """
        构建流程主入口 - 增强版
        
        Args:
            manual_directory: 技术手册目录（原有的docs/技术手册）
            training_set_json: dataset_split.json文件路径（可选）
            case_directory: 案例文件根目录（419个脚本所在目录，可选）
        """
        print("=" * 60)
        print("CDEM 向量知识库构建")
        print("=" * 60)
        print()
        
        # 1. 扫描与分类技术手册（原有逻辑）
        file_cats = self.scan_cdem_directory(manual_directory)
        
        # 2. 解析技术手册文件（原有逻辑）
        print("\n📚 解析技术手册内容...")
        # 手册
        for p in file_cats['manuals']:
            self.documents.extend(self.parse_cdem_manual(p))
            
        # PDF 手册
        for p in file_cats['pdf_files']:
            self.documents.extend(self.parse_cdem_manual_pdf(p))
        
        # 原有案例
        case_map = [
            ('cdyna_cases', 'CDyna'), ('gflow_cases', 'GFlow'),
            ('mudsim_cases', 'MudSim'), ('supercdem_cases', 'SuperCDEM'),
            ('modeling_cases', 'Modeling')
        ]
        for cat_key, type_name in case_map:
            for p in file_cats[cat_key]:
                self.documents.extend(self.parse_cdem_case(p, type_name))
        
        print(f"✓ 技术手册解析完成，共 {len(self.documents)} 个文档")
        
        # 3. 【新增】加载并解析训练集文件
        if training_set_json and case_directory:
            print("\n📚 解析训练集案例...")
            training_files = self.load_training_set_files(training_set_json, case_directory)
            
            training_doc_count = 0
            for file_path in training_files:
                docs = self.parse_training_case(file_path)
                self.documents.extend(docs)
                training_doc_count += len(docs)
            
            print(f"✓ 训练集解析完成，新增 {training_doc_count} 个文档")
        else:
            print("\n⚠️  未提供训练集配置，跳过训练集加载")
        
        print(f"\n📊 总文档数: {len(self.documents)}")
                
        # 4. 分块并转换为 LangChain 格式 (含语义增强)
        lc_docs = self.chunk_and_convert_to_langchain()
        
        # 5. 存入 Chroma
        self.store_to_chroma(lc_docs)
        
        print("\n" + "=" * 60)
        print("✅ 向量知识库构建完成！")
        print("=" * 60)


class CDEMKnowledgeRetriever:
    """CDEM 检索器 (Chroma版) - 原有逻辑保持不变"""
    
    def __init__(self, persist_dir: str, embedding_model_name: str = "bge-m3:latest"):
        print(f"🔍 加载 Chroma 数据库: {persist_dir}")
        self.embeddings = OllamaEmbeddings(
            model=embedding_model_name,
            base_url="http://localhost:11434"
        )
        self.vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=self.embeddings,
            collection_name="cdem_knowledge"
        )
        
    def search(self, query: str, k: int = 5):
        """语义搜索"""
        print(f"\n❓ 搜索: {query}")
        results = self.vectorstore.similarity_search_with_score(query, k=k)
        
        for doc, score in results:
            # score 在 Chroma 中越低越相似 (距离)
            print(f"  [Score: {score:.4f}] {doc.metadata.get('file_name')}")
            # 打印一小段内容预览
            preview = doc.page_content.replace('\n', ' ')[:100]
            print(f"    摘要: {preview}...")
            
        return results

async def main():
    """主函数 - 增强版配置"""
    
    # =====================================================================
    # 配置区域 - 请根据您的实际情况修改
    # =====================================================================
    
    # 1. 技术手册目录（原有配置，保持不变）
    # MANUAL_DIR = r"D:/Codes/langchain/physic/docs/技术手册"  # Windows路径，请修改
    MANUAL_DIR = "/Users/cxh/Codes/langchain/physic/docs/技术手册"  # macOS路径
    
    # 2. 【新增】训练集配置
    # DATASET_SPLIT_JSON = r"D:/Codes/langchain/physic/dataset_split.json"  # 数据集划分文件
    DATASET_SPLIT_JSON = "/Users/cxh/Codes/langchain/physic/dataset_split_results/dataset_split.json"  # macOS
    
    # CASE_DIR = r"D:/Codes/langchain/physic/docs/案例"  # 419个案例脚本所在目录
    CASE_DIR = "/Users/cxh/Codes/langchain/physic/docs/案例"  # macOS
    
    # 3. Chroma数据库配置
    CHROMA_DB_DIR = "./chroma_db_cdem"  # 数据库存储路径（建议用新名称）
    
    # 4. Embedding模型配置
    config = {
        # 推荐使用 bge-m3:latest，它支持长文本(8k)且对中文和代码理解能力强
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "persist_directory": CHROMA_DB_DIR,
        "collection_name": "cdem_knowledge",
        # bge-m3 支持长文本，但为了检索精度，建议适度切分
        "chunk_size": 1000, 
        "chunk_overlap": 200,
        # 脚本文件保持较大切片以保留上下文
        "script_chunk_size": 8000,
        "script_chunk_overlap": 0
    }
    
    # =====================================================================
    # 构建流程
    # =====================================================================
    
    print("🚀 开始构建增强版CDEM向量知识库")
    print(f"   技术手册目录: {MANUAL_DIR}")
    print(f"   案例目录: {CASE_DIR}")
    print(f"   数据集划分: {DATASET_SPLIT_JSON}")
    print()
    
    # 1. 构建过程
    if os.path.exists(MANUAL_DIR):
        builder = CDEMKnowledgeBuilder(config)
        await builder.build(
            manual_directory=MANUAL_DIR,
            training_set_json=DATASET_SPLIT_JSON,
            case_directory=CASE_DIR
        )
    else:
        print(f"⚠️ 警告: 找不到技术手册目录 {MANUAL_DIR}")
        print("请检查路径配置是否正确。")
        return
    
    # 2. 检索测试
    print("\n" + "=" * 60)
    print("检索测试")
    print("=" * 60)
    
    if os.path.exists(CHROMA_DB_DIR):
        retriever = CDEMKnowledgeRetriever(
            config["persist_directory"], 
            config["embedding_model"]
        )
        
        # 测试查询（包含对训练集的测试）
        test_queries = [
            "刚性面Part计算",          # 技术手册
            "滑坡模拟与分析",          # GFlow案例
            "爆炸冲击波模拟",          # CDyna案例
            "球形爆破漏斗",            # SuperCDEM训练集
            "泥石流模拟",              # MudSim训练集
            "如何创建三维几何模型",     # 建模案例
        ]
        
        for q in test_queries:
            retriever.search(q, k=3)
    
    print("\n✅ 全部完成！")
    
if __name__ == "__main__":
    asyncio.run(main())