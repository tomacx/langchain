
import os
import re
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

# LangChain imports
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    # Try langchain.text_splitter but ensure langchain is installed
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ImportError:
         print("Warning: Could not import RecursiveCharacterTextSplitter. Using mock.")
         # Simple mock if everything fails, though this shouldn't happen with langchain installed
         class RecursiveCharacterTextSplitter:
             def __init__(self, **kwargs): pass
             def split_text(self, text): return [text]

# Markdown processing
import markdown
from bs4 import BeautifulSoup

@dataclass
class CDEMDocument:
    """CDEM统一文档模型"""
    doc_id: str
    source_type: str  # "manual" | "case"
    content: str
    metadata: Dict[str, Any]
    file_path: str
    category: str

class CDEMKnowledgeBuilderV2:
    """
    CDEM知识库构建器 V2 (增强版)
    核心改进：构建【案例内容】与【查询内容】的显式映射，提升检索准确率
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
        # 1. 初始化 Embedding 模型
        print(f"🔄 初始化 Embedding 模型: {config.get('embedding_model')}")
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # 2. 配置 Chroma
        self.persist_directory = config.get("persist_directory", "./chroma_db_v2")
        self.collection_name = config.get("collection_name", "cdem_knowledge")
        
        # 3. 分割器配置
        # 手册分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        # 脚本分割器 (尽可能保留完整上下文)
        self.script_splitter = RecursiveCharacterTextSplitter(
            chunk_size=8000,
            chunk_overlap=500,
            separators=["\n\n", "\n", ";", ""]
        )
        
        self.documents: List[CDEMDocument] = []
        self.query_map: Dict[str, Dict] = {}

    def load_query_mappings(self, query_json_path: str):
        """加载查询映射文件"""
        print(f"📂 加载查询映射: {query_json_path}")
        try:
            with open(query_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                cases = data.get('cases', [])
                for case in cases:
                    # 建立 filename -> queries 的映射
                    # 注意：json中的filename可能是相对路径或仅文件名，需做归一化匹配
                    fname = os.path.basename(case['filename'])
                    self.query_map[fname] = {
                        'default_query': case.get('default_query', ''),
                        'test_queries': case.get('test_queries', []),
                        'modules': case.get('modules', []),
                        'category': case.get('category', '未知案例')
                    }
            print(f"✓ 已加载 {len(self.query_map)} 条查询映射数据")
        except Exception as e:
            print(f"❌ 加载查询映射失败: {e}")

    def scan_and_parse_manuals(self, manual_dir: str):
        """扫描并解析技术手册"""
        print(f"\n📚 解析技术手册: {manual_dir}")
        base_path = Path(manual_dir)
        if not base_path.exists():
            print(f"⚠️ 手册目录不存在: {manual_dir}")
            return

        count = 0
        for file_path in base_path.rglob("*.md"):
            content = self._read_file(file_path)
            if not content: continue
            
            # 简单的元数据提取
            metadata = {
                'file_name': file_path.name,
                'type': 'manual',
                'category': '技术手册'
            }
            
            self.documents.append(CDEMDocument(
                doc_id=f"manual_{file_path.stem}",
                source_type="manual",
                content=content,
                metadata=metadata,
                file_path=str(file_path),
                category="技术手册"
            ))
            count += 1
        print(f"✓ 解析了 {count} 本技术手册")

    def scan_and_parse_cases(self, case_dir: str):
        """扫描并解析案例脚本 (结合查询映射)"""
        print(f"\n📚 解析案例脚本: {case_dir}")
        base_path = Path(case_dir)
        if not base_path.exists():
            print(f"⚠️ 案例目录不存在: {case_dir}")
            return

        count = 0
        matched_queries = 0
        
        for file_path in base_path.rglob("*.js"):
            content = self._read_file(file_path)
            if not content: continue
            
            fname = file_path.name
            query_info = self.query_map.get(fname, {})
            
            # 构建增强型内容
            if query_info:
                matched_queries += 1
                default_q = query_info.get('default_query', '')
                test_qs = query_info.get('test_queries', [])
                modules = query_info.get('modules', [])
                category = query_info.get('category', '通用案例')
                
                # 拼接查询意图到文档头部
                queries_text = "\n".join([f"- {q}" for q in test_qs])
                
                enhanced_content = (
                    f"【案例元数据】\n"
                    f"文件名: {fname}\n"
                    f"类别: {category}\n"
                    f"涉及模块: {', '.join(modules)}\n\n"
                    f"【任务描述与查询映射】\n"
                    f"标准任务: {default_q}\n"
                    f"用户常见提问:\n{queries_text}\n\n"
                    f"【脚本代码】\n"
                    f"{content}"
                )
                
                metadata = {
                    'file_name': fname,
                    'type': 'case_script',
                    'category': category,
                    'has_queries': True,
                    'modules': modules
                }
            else:
                # 未匹配到查询数据的案例 (Fallback)
                enhanced_content = (
                    f"文件名: {fname}\n"
                    f"内容:\n{content}"
                )
                metadata = {
                    'file_name': fname,
                    'type': 'case_script',
                    'category': '其他案例',
                    'has_queries': False
                }

            self.documents.append(CDEMDocument(
                doc_id=f"case_{file_path.stem}",
                source_type="case",
                content=enhanced_content,
                metadata=metadata,
                file_path=str(file_path),
                category=metadata['category']
            ))
            count += 1
            
        print(f"✓ 解析了 {count} 个案例文件 (其中 {matched_queries} 个匹配到查询映射)")

    def _read_file(self, path: Path) -> Optional[str]:
        encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1']
        for enc in encodings:
            try:
                with open(path, 'r', encoding=enc) as f:
                    return f.read()
            except: continue
        return None

    def build_and_save(self):
        """分块并存储"""
        print(f"\n✂️  正在分块处理 {len(self.documents)} 个文档...")
        langchain_docs = []
        
        for doc in self.documents:
            splitter = self.script_splitter if doc.source_type == "case" else self.text_splitter
            chunks = splitter.split_text(doc.content)
            
            for i, chunk in enumerate(chunks):
                # 如果是Case，且是第2+个块，可能丢失了头部的查询信息？
                # 由于 chunk_size 设置很大 (8000)，大多数脚本应该只有一个块。
                # 对于多块的大脚本，我们可以在每个块头部保留最基本的元数据。
                
                final_content = chunk
                if i > 0 and doc.source_type == "case":
                     final_content = f"文件名: {doc.metadata['file_name']} (Part {i+1})\n{chunk}"

                lc_doc = Document(
                    page_content=final_content,
                    metadata={
                        "source": doc.file_path,
                        "file_name": doc.metadata.get('file_name'),
                        "category": doc.category,
                        "chunk_index": i
                    }
                )
                langchain_docs.append(lc_doc)
        
        print(f"💾 正在存入 Chroma (目录: {self.persist_directory})...")
        if langchain_docs:
            Chroma.from_documents(
                documents=langchain_docs,
                embedding=self.embeddings,
                persist_directory=self.persist_directory,
                collection_name=self.collection_name
            )
            print("✅ 数据库构建完成！")
        else:
            print("⚠️ 无数据可存储")

def main():
    # Configuration
    MANUAL_DIR = "/Users/cxh/Codes/langchain/physic/docs/技术手册"
    CASE_DIR = "/Users/cxh/Codes/langchain/physic/docs/案例"
    QUERY_JSON = "/Users/cxh/Codes/langchain/physic/dataset_split_results/case_queries_content.json"
    DB_DIR = "/Users/cxh/Codes/langchain/physic/tools/js_store/chroma_db_cdem_v2"
    
    config = {
        "persist_directory": DB_DIR,
        "collection_name": "cdem_knowledge",
        "embedding_model": "bge-m3:latest"
    }
    
    builder = CDEMKnowledgeBuilderV2(config)
    
    # 1. 加载映射
    builder.load_query_mappings(QUERY_JSON)
    
    # 2. 扫描手册
    builder.scan_and_parse_manuals(MANUAL_DIR)
    
    # 3. 扫描案例
    builder.scan_and_parse_cases(CASE_DIR)
    
    # 4. 构建存储
    builder.build_and_save()

if __name__ == "__main__":
    main()
