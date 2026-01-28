#!/usr/bin/env python3
"""
CDEM 案例库及手册向量数据库构建器 (Windows/Chroma版)
专门处理 CDEM案例库及手册 目录
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
from langchain_ollama import OllamaEmbeddings  # 更新为 langchain_ollama
from langchain_chroma import Chroma  # 使用 langchain_chroma
from langchain_core.documents import Document

# Markdown processing
import markdown
from bs4 import BeautifulSoup

# JavaScript parsing
import esprima

@dataclass
class CDEMDocument:
    """CDEM统一文档模型"""
    doc_id: str
    source_type: str  # "manual" | "case" | "modeling"
    content: str
    metadata: Dict[str, Any]
    file_path: str
    category: str
    tags: List[str]

class CDEMKnowledgeBuilder:
    """CDEM知识库构建器 (Chroma版)"""
    
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
        
        # 3. 文本分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.get("chunk_size", 1000),
            chunk_overlap=config.get("chunk_overlap", 200),
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # 4. 暂存文档列表
        self.documents: List[CDEMDocument] = []
        
    def scan_cdem_directory(self, directory: str) -> Dict[str, List[Path]]:
        """扫描CDEM目录，分类文件 (Windows路径适配)"""
        base_path = Path(directory)
        print(f"📂 扫描目录: {base_path.resolve()}")
        
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
        
        print("\n📊 文件分类统计:")
        for category, files in file_categories.items():
            print(f"  {category}: {len(files)} 个文件")
            
        return file_categories

    def _read_file_content(self, file_path: Path) -> Optional[str]:
        """尝试多种编码读取文件"""
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

    def parse_cdem_manual(self, file_path: Path) -> List[CDEMDocument]:
        """解析技术手册"""
        documents = []
        content = self._read_file_content(file_path)
        if not content:
            return documents

        metadata = self._extract_common_metadata(file_path)
        
        # 将Markdown转换为HTML以便分割
        html_content = markdown.markdown(content, extensions=['tables', 'fenced_code'])
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 简单按标题分割，如果太短则合并
        # 这里简化处理，直接按文本长度分割，保留完整上下文
        doc_id = f"manual_{file_path.stem}"
        
        doc = CDEMDocument(
            doc_id=doc_id,
            source_type="manual",
            content=content, # 保留Markdown原始内容
            metadata=metadata,
            file_path=str(file_path),
            category=metadata.get('category', '技术手册'),
            tags=['manual', metadata.get('module', 'general')]
        )
        documents.append(doc)
        return documents

    def parse_cdem_case(self, file_path: Path, case_type: str) -> List[CDEMDocument]:
        """解析案例文件 (JS/TXT)"""
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
        """提取通用元数据，利用文件名语义"""
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
        if 'CDyna' in filename: return 'CDyna'
        if 'GFlow' in filename: return 'GFlow'
        if 'SuperCDEM' in filename: return 'SuperCDEM'
        if 'MudSim' in filename: return 'MudSim'
        return 'General'

    def chunk_and_convert_to_langchain(self) -> List[Document]:
        """
        核心逻辑：
        1. 对文档进行分块。
        2. **关键步骤**：将文件名和路径信息拼接到 content 头部。
           这确保了文件名中的语义信息（如"刚性面Part计算"）与代码内容紧密结合。
        """
        langchain_docs = []
        
        print(f"✂️  开始分块处理 {len(self.documents)} 个源文件...")
        
        for doc in self.documents:
            # 1. 切分文本
            chunks = self.text_splitter.split_text(doc.content)
            
            # 2. 构建语义增强的头部信息
            # Windows路径分隔符如果是反斜杠，显示时可能不美观，可转为 / 
            display_path = Path(doc.file_path).name # 只保留文件名，或者相对路径
            
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
                        "file_name": doc.metadata['file_name']
                    }
                )
                langchain_docs.append(lc_doc)
                
        return langchain_docs

    def store_to_chroma(self, documents: List[Document]):
        """存储到本地 Chroma"""
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

    async def build(self, cdem_directory: str):
        """构建流程主入口"""
        # 1. 扫描与分类
        file_cats = self.scan_cdem_directory(cdem_directory)
        
        # 2. 解析文件
        print("\n📚 解析文件内容...")
        # 手册
        for p in file_cats['manuals']:
            self.documents.extend(self.parse_cdem_manual(p))
        
        # 案例
        case_map = [
            ('cdyna_cases', 'CDyna'), ('gflow_cases', 'GFlow'),
            ('mudsim_cases', 'MudSim'), ('supercdem_cases', 'SuperCDEM'),
            ('modeling_cases', 'Modeling')
        ]
        for cat_key, type_name in case_map:
            for p in file_cats[cat_key]:
                self.documents.extend(self.parse_cdem_case(p, type_name))
                
        # 3. 分块并转换为 LangChain 格式 (含语义增强)
        lc_docs = self.chunk_and_convert_to_langchain()
        
        # 4. 存入 Chroma
        self.store_to_chroma(lc_docs)


class CDEMKnowledgeRetriever:
    """CDEM 检索器 (Chroma版)"""
    
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
    # === 配置区域 ===
    # 请根据您的实际目录修改这里
    # 在 Windows 上建议使用 r"" 原始字符串避免转义问题
    CDEM_DIR = "D:/Codes/langchain/physic/docs/CDEM案例库及手册"
    CHROMA_DB_DIR = "./chroma_db_cdem"  # 数据库存储路径

    config = {
        "embedding_model": "bge-m3:latest", # 请确保您的 Ollama 中有此模型
        "persist_directory": CHROMA_DB_DIR,
        "collection_name": "cdem_knowledge",
        "chunk_size": 800,
        "chunk_overlap": 150
    }
    
    # 1. 构建过程
    if os.path.exists(CDEM_DIR):
        builder = CDEMKnowledgeBuilder(config)
        await builder.build(CDEM_DIR)
    else:
        print(f"⚠️ 警告: 找不到输入目录 {CDEM_DIR}，跳过构建步骤。")
        print("如果这是第一次运行，请确保目录路径正确。")
    
    # 2. 检索测试
    if os.path.exists(CHROMA_DB_DIR):
        retriever = CDEMKnowledgeRetriever(config["persist_directory"], config["embedding_model"])
        
        # 测试几个针对文件名的语义查询
        test_queries = [
            "刚性面Part计算",          # 直接命中文件名关键词
            "滑坡模拟与分析",          # 命中 GFlow/MudSim 相关
            "爆炸冲击波模拟",          # 命中 冲击波模块
            "如何创建三维几何模型",     # 命中 建模手册或案例
            "两端固定的平面壳运动"      # 具体案例名
        ]
        
        for q in test_queries:
            retriever.search(q, k=3)
    
if __name__ == "__main__":
    asyncio.run(main())