#!/usr/bin/env python3
"""
CDEM 统一知识库构建器 (V2.0 Refactored)
功能：
1. 集成 Ollama 本地 BGE-M3 模型
2. 增强型 JS 解析：捕获完整工作流与脚本意图
3. 结构化 Markdown 解析：保留 API 层级上下文
4. 注入系统级编程规范
"""

import os
import re
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime

# LangChain imports
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Milvus
from langchain_core.documents import Document
from langchain_community.document_loaders import TextLoader

# Milvus imports
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility
from pymilvus import MilvusClient
from pymilvus.milvus_client import IndexParams

# Markdown processing
import markdown
from bs4 import BeautifulSoup

# JavaScript parsing
import esprima


@dataclass
class KnowledgeDocument:
    """统一知识文档模型"""
    doc_id: str
    source_type: str  # "manual" | "case"
    content: str
    metadata: Dict[str, Any]
    cross_references: List[str]
    file_path: str
    category: str
    tags: List[str]
    embedding: Optional[List[float]] = None


class UnifiedKnowledgeBuilder:
    """统一知识库构建器"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        # 使用Ollama本地bge-m3模型
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # Milvus本地文件配置
        self.milvus_uri = config.get("milvus_uri", "./knowledge_db.db")
        self.collection_name = config.get("collection_name", "unified_knowledge")
        
        # 文本分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.get("chunk_size", 1000),
            chunk_overlap=config.get("chunk_overlap", 200),
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # 知识文档存储
        self.documents: List[KnowledgeDocument] = []
        
    def connect_milvus(self):
        """连接Milvus本地数据库"""
        self.client = MilvusClient(self.milvus_uri)
        print(f"连接到本地Milvus数据库: {self.milvus_uri}")
        
    def create_collection(self):
        """创建Milvus集合"""
        # 检查集合是否存在，存在则删除
        if self.client.has_collection(self.collection_name):
            self.client.drop_collection(self.collection_name)
            print(f"删除已存在的集合: {self.collection_name}")
            
        # 定义字段
        fields = [
            FieldSchema(name="doc_id", dtype=DataType.VARCHAR, max_length=100, is_primary=True),
            FieldSchema(name="source_type", dtype=DataType.VARCHAR, max_length=20),
            FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=65535),
            FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=100),
            FieldSchema(name="file_path", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="metadata", dtype=DataType.JSON),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1024)
        ]
        
        schema = CollectionSchema(
            fields=fields,
            description="统一物理模拟知识库"
        )
        
        # 创建集合
        self.client.create_collection(
            collection_name=self.collection_name,
            schema=schema
        )
        
        print(f"创建集合: {self.collection_name}")
        
        # 创建索引
        index_params = IndexParams()
        index_params.add_index(
            field_name="embedding",
            index_type="IVF_FLAT",
            metric_type="IP",
            params={"nlist": 128}
        )
        
        self.client.create_index(
            collection_name=self.collection_name,
            index_params=index_params
        )
        
        return self.client
    
    def parse_manual_markdown(self, file_path: str) -> List[KnowledgeDocument]:
        """解析技术手册Markdown文件"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"成功使用 {encoding} 编码读取文件: {file_path}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"无法读取文件 {file_path}，跳过处理")
                return documents
                
            # 提取元数据
            metadata = self._extract_manual_metadata(file_path, content)
            
            # 解析Markdown结构
            html_content = markdown.markdown(content, extensions=['tables', 'fenced_code'])
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 按章节分割
            sections = self._split_markdown_sections(soup, file_path)
            
            for i, section in enumerate(sections):
                doc_id = f"manual_{Path(file_path).stem}_{i}"
                
                doc = KnowledgeDocument(
                    doc_id=doc_id,
                    source_type="manual",
                    content=section['content'],
                    metadata={**metadata, **section['metadata']},
                    cross_references=[],
                    file_path=file_path,
                    category=metadata.get('category', '技术手册'),
                    tags=metadata.get('tags', [])
                )
                
                documents.append(doc)
                
        except Exception as e:
            print(f"解析手册文件失败 {file_path}: {e}")
            
        return documents
    
    def parse_case_files(self, case_dir: str) -> List[KnowledgeDocument]:
        """解析案例库文件"""
        documents = []
        
        for root, dirs, files in os.walk(case_dir):
            for file in files:
                file_path = os.path.join(root, file)
                
                if file.endswith('.js'):
                    js_docs = self._parse_javascript_file(file_path)
                    documents.extend(js_docs)
                elif file.endswith('.txt'):
                    txt_docs = self._parse_config_file(file_path)
                    documents.extend(txt_docs)
                    
        return documents
    
    def _parse_javascript_file(self, file_path: str) -> List[KnowledgeDocument]:
        """解析JavaScript案例文件"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"成功使用 {encoding} 编码读取JS文件: {file_path}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"无法读取JS文件 {file_path}，跳过处理")
                return documents
                
            # 使用esprima解析JavaScript
            try:
                ast = esprima.parseScript(content, {'range': True})
                functions_info = self._extract_functions_from_ast(ast)
            except Exception as e:
                print(f"JavaScript AST解析失败 {file_path}: {e}")
                functions_info = []
                
            # 提取元数据
            metadata = self._extract_case_metadata(file_path, content)
            
            # 按函数分割文档
            if functions_info:
                for func_info in functions_info:
                    doc_id = f"case_js_{Path(file_path).stem}_{func_info['name']}"
                    
                    doc = KnowledgeDocument(
                        doc_id=doc_id,
                        source_type="case",
                        content=func_info['code'],
                        metadata={
                            **metadata,
                            'function_name': func_info['name'],
                            'function_type': func_info['type'],
                            'parameters': func_info['params']
                        },
                        cross_references=[],
                        file_path=file_path,
                        category=metadata.get('category', 'JavaScript案例'),
                        tags=metadata.get('tags', []) + ['javascript', 'function']
                    )
                    
                    documents.append(doc)
            
            # 整体文件文档
            doc_id = f"case_js_full_{Path(file_path).stem}"
            
            doc = KnowledgeDocument(
                doc_id=doc_id,
                source_type="case",
                content=content,
                metadata={**metadata, 'document_type': 'full_file'},
                cross_references=[],
                file_path=file_path,
                category=metadata.get('category', 'JavaScript案例'),
                tags=metadata.get('tags', []) + ['javascript', 'full_file']
            )
            
            documents.append(doc)
            
        except Exception as e:
            print(f"解析JS文件失败 {file_path}: {e}")
            
        return documents
    
    def _parse_config_file(self, file_path: str) -> List[KnowledgeDocument]:
        """解析配置文件"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"成功使用 {encoding} 编码读取配置文件: {file_path}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"无法读取配置文件 {file_path}，跳过处理")
                return documents
                
            # 提取元数据
            metadata = self._extract_case_metadata(file_path, content)
            
            # 分析配置内容
            config_info = self._analyze_config_content(content)
            
            doc_id = f"case_config_{Path(file_path).stem}"
            
            doc = KnowledgeDocument(
                doc_id=doc_id,
                source_type="case",
                content=content,
                metadata={
                    **metadata,
                    'config_type': config_info['type'],
                    'parameters': config_info['parameters'],
                    'description': config_info['description']
                },
                cross_references=[],
                file_path=file_path,
                category=metadata.get('category', '配置文件'),
                tags=metadata.get('tags', []) + ['config', 'parameters']
            )
            
            documents.append(doc)
            
        except Exception as e:
            print(f"解析配置文件失败 {file_path}: {e}")
            
        return documents
    
    def _extract_manual_metadata(self, file_path: str, content: str) -> Dict[str, Any]:
        """提取技术手册元数据"""
        path_parts = Path(file_path).parts
        metadata = {
            'file_name': Path(file_path).name,
            'file_size': len(content),
            'created_time': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat(),
            'modified_time': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
        }
        
        # 从路径提取模块信息
        if 'CDyna软件' in path_parts:
            metadata['module'] = 'CDyna'
            metadata['category'] = 'CDyna技术手册'
        elif 'SuperCDEM软件' in path_parts:
            metadata['module'] = 'SuperCDEM'
            metadata['category'] = 'SuperCDEM技术手册'
        elif 'GFlow软件' in path_parts:
            metadata['module'] = 'GFlow'
            metadata['category'] = 'GFlow技术手册'
        else:
            metadata['module'] = 'Other'
            metadata['category'] = '其他技术手册'
            
        # 提取标题
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            metadata['title'] = title_match.group(1).strip()
            
        return metadata
    
    def _extract_case_metadata(self, file_path: str, content: str) -> Dict[str, Any]:
        """提取案例库元数据"""
        path_parts = Path(file_path).parts
        metadata = {
            'file_name': Path(file_path).name,
            'file_size': len(content),
            'created_time': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat(),
            'modified_time': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
        }
        
        # TODO: 具体的数据类型

        # 从路径提取案例类型
        if 'CDyna案例' in path_parts:
            metadata['module'] = 'CDyna'
            metadata['category'] = 'CDyna案例'
        elif '建模及网格案例' in path_parts:
            metadata['module'] = 'imeshing'
            metadata['category'] = '建模网格案例'
        elif 'SuperCDEM案例' in path_parts:
            metadata['module'] = 'SuperCDEM'
            metadata['category'] = 'SuperCDEM案例'
        else:
            metadata['module'] = 'Other'
            metadata['category'] = '其他案例'
            
        return metadata
    
    def _split_markdown_sections(self, soup: BeautifulSoup, file_path: str) -> List[Dict[str, Any]]:
        """分割Markdown章节"""
        sections = []
        
        try:
            # 提取标题和内容
            headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            
            if not headings:
                # 没有标题，整个文件作为一个section
                sections.append({
                    'content': soup.get_text(strip=True),
                    'metadata': {'section_type': 'full_document', 'level': 0}
                })
            else:
                # 按标题分割
                for i, heading in enumerate(headings):
                    try:
                        level = int(heading.name[1])
                        title = heading.get_text(strip=True)
                        
                        # 获取到下一个标题之间的内容
                        content_parts = [heading.get_text(strip=True)]
                        next_element = heading.next_sibling
                        
                        while next_element:
                            if next_element.name and next_element.name.startswith('h') and int(next_element.name[1]) <= level:
                                break
                            if hasattr(next_element, 'get_text'):
                                text = next_element.get_text(strip=True)
                                if text:
                                    content_parts.append(text)
                            next_element = next_element.next_sibling
                            
                        content = '\n'.join(content_parts)
                        
                        if len(content.strip()) > 50:  # 过滤太短的section
                            sections.append({
                                'content': content,
                                'metadata': {
                                    'section_title': title,
                                    'section_level': level,
                                    'section_index': i
                                }
                            })
                    except Exception as e:
                        print(f"处理标题时出错 {file_path}: {e}")
                        continue
                        
        except Exception as e:
            print(f"分割Markdown章节失败 {file_path}: {e}")
            # 返回整个文档作为一个section
            sections.append({
                'content': soup.get_text(strip=True),
                'metadata': {'section_type': 'fallback_full_document', 'level': 0}
            })
                    
        return sections
    
    def _extract_functions_from_ast(self, ast) -> List[Dict[str, Any]]:
        """从AST提取函数信息"""
        functions = []
        
        def traverse(node, depth=0):
            try:
                if node.type == 'FunctionDeclaration':
                    func_name = node.id.name if node and hasattr(node, 'id') and node.id else 'anonymous'
                    params = [param.name for param in node.params] if node and hasattr(node, 'params') and node.params else []
                    
                    functions.append({
                        'name': func_name,
                        'type': 'function',
                        'params': params,
                        'code': node.source[node.range[0]:node.range[1]] if hasattr(node, 'source') and hasattr(node, 'range') else str(node),
                        'depth': depth
                    })
                elif node.type == 'CallExpression':
                    if node.callee and hasattr(node.callee, 'type') and node.callee.type == 'Identifier':
                        func_name = node.callee.name if hasattr(node.callee, 'name') else 'unknown'
                        functions.append({
                            'name': func_name,
                            'type': 'call',
                            'params': [],
                            'code': node.source[node.range[0]:node.range[1]] if hasattr(node, 'source') and hasattr(node, 'range') else str(node),
                            'depth': depth
                        })
                        
                # 递归遍历子节点
                if hasattr(node, 'items'):
                    for key, value in node.items():
                        if isinstance(value, list):
                            for item in value:
                                if hasattr(item, 'type'):
                                    traverse(item, depth + 1)
                        elif hasattr(value, 'type'):
                            traverse(value, depth + 1)
                elif hasattr(node, 'body') and node.body:
                    if hasattr(node.body, 'type'):
                        traverse(node.body, depth + 1)
                    elif isinstance(node.body, list):
                        for item in node.body:
                            if hasattr(item, 'type'):
                                traverse(item, depth + 1)
            except Exception as e:
                print(f"AST遍历错误: {e}")
                pass
                    
        try:
            traverse(ast)
        except Exception as e:
            print(f"AST解析失败: {e}")
            
        return functions
    
    def _analyze_config_content(self, content: str) -> Dict[str, Any]:
        """分析配置文件内容"""
        lines = content.strip().split('\n')
        parameters = {}
        config_type = 'unknown'
        description = ''
        
        # 尝试识别配置类型
        if any('coord' in line.lower() for line in lines[:5]):
            config_type = 'coordinates'
            description = '坐标数据配置'
        elif any('frac' in line.lower() for line in lines[:5]):
            config_type = 'fracture'
            description = '裂隙配置参数'
        elif any('load' in line.lower() for line in lines[:5]):
            config_type = 'load'
            description = '载荷配置'
        elif len(lines) > 0 and re.match(r'^[\d\.\s-]+$', lines[0]):
            config_type = 'numeric_data'
            description = '数值数据文件'
            
        # 解析参数
        for i, line in enumerate(lines):
            line = line.strip()
            if line and not line.startswith('#'):
                if '=' in line:
                    key, value = line.split('=', 1)
                    parameters[key.strip()] = value.strip()
                elif config_type == 'coordinates':
                    coords = line.split()
                    if len(coords) >= 3:
                        parameters[f'point_{i}'] = {
                            'x': coords[0],
                            'y': coords[1], 
                            'z': coords[2] if len(coords) > 2 else '0'
                        }
                        
        return {
            'type': config_type,
            'parameters': parameters,
            'description': description,
            'line_count': len(lines)
        }
    
    def discover_cross_references(self):
        """发现跨源关联"""
        print("发现跨源关联...")
        
        # 基于关键词匹配发现关联
        manual_docs = [doc for doc in self.documents if doc.source_type == 'manual']
        case_docs = [doc for doc in self.documents if doc.source_type == 'case']
        
        for manual_doc in manual_docs:
            manual_keywords = set(re.findall(r'\b[A-Z][a-zA-Z]+\b', manual_doc.content))
            
            for case_doc in case_docs:
                case_keywords = set(re.findall(r'\b[A-Z][a-zA-Z]+\b', case_doc.content))
                
                # 计算关键词重叠度
                overlap = manual_keywords & case_keywords
                if len(overlap) >= 3:  # 至少3个共同关键词
                    manual_doc.cross_references.append(case_doc.doc_id)
                    case_doc.cross_references.append(manual_doc.doc_id)
                    
        print(f"发现 {sum(len(doc.cross_references) for doc in self.documents)} 个跨源关联")
    
    def chunk_documents(self):
        """文档分块处理"""
        chunked_docs = []
        
        for doc in self.documents:
            # 使用LangChain文本分割器
            chunks = self.text_splitter.split_text(doc.content)
            
            for i, chunk in enumerate(chunks):
                chunked_doc = KnowledgeDocument(
                    doc_id=f"{doc.doc_id}_chunk_{i}",
                    source_type=doc.source_type,
                    content=chunk,
                    metadata={
                        **doc.metadata,
                        'parent_doc_id': doc.doc_id,
                        'chunk_index': i,
                        'total_chunks': len(chunks)
                    },
                    cross_references=doc.cross_references,
                    file_path=doc.file_path,
                    category=doc.category,
                    tags=doc.tags + ['chunk']
                )
                chunked_docs.append(chunked_doc)
                
        return chunked_docs
    
    async def build_embeddings(self, documents: List[KnowledgeDocument]):
        """构建文档嵌入向量"""
        print(f"构建 {len(documents)} 个文档的嵌入向量...")
        
        texts = [doc.content for doc in documents]
        embeddings_list = self.embeddings.embed_documents(texts)
        
        for doc, embedding in zip(documents, embeddings_list):
            doc.embedding = embedding
            
        print("嵌入向量构建完成")
    
    def store_to_milvus(self, documents: List[KnowledgeDocument]):
        """存储到Milvus本地数据库"""
        print(f"存储 {len(documents)} 个文档到本地Milvus...")
        
        # 连接并创建集合
        self.connect_milvus()
        self.create_collection()
        
        # 准备数据
        data = []
        for doc in documents:
            data.append({
                'doc_id': doc.doc_id,
                'source_type': doc.source_type,
                'content': doc.content,
                'category': doc.category,
                'file_path': doc.file_path,
                'metadata': asdict(doc)['metadata'],
                'embedding': doc.embedding
            })
        
        # 批量插入数据
        batch_size = 100
        for i in range(0, len(data), batch_size):
            batch_data = data[i:i+batch_size]
            self.client.insert(
                collection_name=self.collection_name,
                data=batch_data
            )
            print(f"已插入 {min(i+batch_size, len(data))}/{len(data)} 个文档")
        
        # 刷新数据
        self.client.flush(self.collection_name)
        
        print("数据存储完成")
        print(f"数据库文件位置: {self.milvus_uri}")
        
    async def build_knowledge_base(self, manual_dir: str, case_dir: str):
        """构建统一知识库"""
        print("开始构建统一知识库...")
        
        # 1. 解析技术手册
        print("解析技术手册...")
        manual_files = []
        for root, dirs, files in os.walk(manual_dir):
            for file in files:
                if file.endswith('.md'):
                    manual_files.append(os.path.join(root, file))
                    
        for manual_file in manual_files:
            docs = self.parse_manual_markdown(manual_file)
            self.documents.extend(docs)
            
        # 2. 解析案例库
        print("解析案例库...")
        case_docs = self.parse_case_files(case_dir)
        self.documents.extend(case_docs)
        
        print(f"总共解析了 {len(self.documents)} 个文档")
        
        # 3. 发现跨源关联
        self.discover_cross_references()
        
        # 4. 文档分块
        chunked_documents = self.chunk_documents()
        print(f"分块后得到 {len(chunked_documents)} 个文档块")
        
        # 5. 构建嵌入向量
        await self.build_embeddings(chunked_documents)
        
        # 6. 存储到本地Milvus
        self.store_to_milvus(chunked_documents)
        
        print("统一知识库构建完成!")
        
        return chunked_documents


class KnowledgeRetriever:
    """知识检索器"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        # 使用Ollama本地bge-m3模型
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # 连接本地Milvus
        self.milvus_uri = config.get("milvus_uri", "./knowledge_db.db")
        self.client = MilvusClient(self.milvus_uri)
        self.collection_name = config.get("collection_name", "unified_knowledge")
        
        # 使用本地Milvus客户端直接检索
        print(f"知识检索器已连接到本地数据库: {self.milvus_uri}")
        
    def search(self, query: str, k: int = 5, source_filter: Optional[str] = None) -> List[Document]:
        """搜索知识"""
        
        # 构建查询向量
        query_embedding = self.embeddings.embed_query(query)
        
        # 构建过滤表达式
        filter_expr = None
        if source_filter:
            filter_expr = f"source_type == '{source_filter}'"
        
        # 使用Milvus客户端直接搜索
        results = self.client.search(
            collection_name=self.collection_name,
            data=[query_embedding],
            limit=k,
            filter=filter_expr,
            output_fields=["doc_id", "source_type", "content", "category", "file_path", "metadata"]
        )
        
        # 转换为LangChain Document格式
        documents = []
        for hit in results[0]:  # 第一个查询的结果
            doc = Document(
                page_content=hit["entity"]["content"],
                metadata={
                    "doc_id": hit["entity"]["doc_id"],
                    "source_type": hit["entity"]["source_type"],
                    "category": hit["entity"]["category"],
                    "file_path": hit["entity"]["file_path"],
                    "score": hit["distance"],
                    **hit["entity"]["metadata"]
                }
            )
            documents.append(doc)
        
        return documents
    
    def hybrid_search(self, query: str, k: int = 5) -> Dict[str, List[Document]]:
        """混合搜索：同时搜索手册和案例"""
        
        manual_results = self.search(query, k=k//2, source_filter="manual")
        case_results = self.search(query, k=k//2, source_filter="case")
        
        return {
            "manual": manual_results,
            "case": case_results,
            "all": manual_results + case_results
        }


async def main():
    """主函数"""
    
    # 配置
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "milvus_uri": "./knowledge_db.db",  # 本地文件数据库
        "collection_name": "unified_physics_knowledge",
        "chunk_size": 1000,
        "chunk_overlap": 200
    }
    
    # 路径配置
    manual_dir = "/Users/cxh/Codes/langchain/physic/docs/技术手册"
    case_dir = "/Users/cxh/Codes/langchain/physic/docs/案例库"
    
    # 构建知识库
    builder = UnifiedKnowledgeBuilder(config)
    documents = await builder.build_knowledge_base(manual_dir, case_dir)
    
    # 测试检索
    retriever = KnowledgeRetriever(config)
    
    # 测试查询
    test_queries = [
        "如何创建二维砖块网格",
        "渗流分析参数设置",
        "块体模块基础功能",
        "网格导入方法"
    ]
    
    print("\n=== 测试知识检索 ===")
    for query in test_queries:
        print(f"\n查询: {query}")
        results = retriever.hybrid_search(query, k=3)
        
        print(f"手册结果 ({len(results['manual'])} 个):")
        for doc in results['manual']:
            print(f"  - {doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))}")
            
        print(f"案例结果 ({len(results['case'])} 个):")
        for doc in results['case']:
            print(f"  - {doc.metadata.get('file_name', '无文件名')}")
    
    print(f"\n数据库文件已保存至: {config['milvus_uri']}")
    print("知识库构建完成！")


if __name__ == "__main__":
    asyncio.run(main())