#!/usr/bin/env python3
"""
CDEM案例库及手册向量数据库构建器
专门处理 /Users/cxh/Codes/langchain/physic/docs/CDEM案例库及手册 目录
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

# Markdown and PDF processing
import markdown
from bs4 import BeautifulSoup
import PyPDF2

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
    embedding: Optional[List[float]] = None


class CDEMKnowledgeBuilder:
    """CDEM知识库构建器"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        # 使用Ollama本地bge-m3模型
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # Milvus本地文件配置
        self.milvus_uri = config.get("milvus_uri", "./cdem_knowledge_db.db")
        self.collection_name = config.get("collection_name", "cdem_knowledge")
        
        # 文本分割器
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.get("chunk_size", 1000),
            chunk_overlap=config.get("chunk_overlap", 200),
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # 知识文档存储
        self.documents: List[CDEMDocument] = []
        
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
            FieldSchema(name="doc_id", dtype=DataType.VARCHAR, max_length=200, is_primary=True),
            FieldSchema(name="source_type", dtype=DataType.VARCHAR, max_length=20),
            FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=65535),
            FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=100),
            FieldSchema(name="file_path", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="metadata", dtype=DataType.JSON),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1024)
        ]
        
        schema = CollectionSchema(
            fields=fields,
            description="CDEM统一知识库"
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
    
    def scan_cdem_directory(self, directory: str) -> Dict[str, List[str]]:
        """扫描CDEM目录，分类文件"""
        print(f"扫描CDEM目录: {directory}")
        
        file_categories = {
            "manuals": [],      # 技术手册
            "cdyna_cases": [],  # CDyna案例
            "gflow_cases": [],  # GFlow案例
            "mudsim_cases": [], # MudSim案例
            "supercdem_cases": [], # SuperCDEM案例
            "modeling_cases": [], # 建模及网格案例
            "pdf_files": []     # PDF文件
        }
        
        for file_path in Path(directory).glob("*"):
            if file_path.is_file() and file_path.name != ".DS_Store":
                file_name = file_path.name
                
                if file_name.endswith(".md"):
                    if "技术手册" in file_name:
                        file_categories["manuals"].append(str(file_path))
                    else:
                        file_categories["manuals"].append(str(file_path))
                        
                elif file_name.endswith(".pdf"):
                    file_categories["pdf_files"].append(str(file_path))
                    
                elif file_name.endswith(".js"):
                    if "CDyna案例" in file_name:
                        file_categories["cdyna_cases"].append(str(file_path))
                    elif "GFlow案例" in file_name:
                        file_categories["gflow_cases"].append(str(file_path))
                    elif "MudSim案例" in file_name:
                        file_categories["mudsim_cases"].append(str(file_path))
                    elif "SuperCDEM案例" in file_name:
                        file_categories["supercdem_cases"].append(str(file_path))
                    elif "建模及网格案例" in file_name:
                        file_categories["modeling_cases"].append(str(file_path))
                    else:
                        file_categories["cdyna_cases"].append(str(file_path))  # 默认归类到CDyna
                        
                elif file_name.endswith(".txt"):
                    # 根据文件名分类
                    if "CDyna案例" in file_name:
                        file_categories["cdyna_cases"].append(str(file_path))
                    elif "建模及网格案例" in file_name:
                        file_categories["modeling_cases"].append(str(file_path))
                    else:
                        file_categories["cdyna_cases"].append(str(file_path))
        
        # 打印统计信息
        print("\n📊 文件分类统计:")
        for category, files in file_categories.items():
            print(f"  {category}: {len(files)} 个文件")
            
        return file_categories
    
    def parse_cdem_manual(self, file_path: str) -> List[CDEMDocument]:
        """解析CDEM技术手册"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"✅ 成功使用 {encoding} 编码读取: {Path(file_path).name}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"❌ 无法读取文件: {Path(file_path).name}")
                return documents
                
            # 提取元数据
            metadata = self._extract_cdem_manual_metadata(file_path, content)
            
            # 解析Markdown结构
            html_content = markdown.markdown(content, extensions=['tables', 'fenced_code'])
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # 按章节分割
            sections = self._split_markdown_sections(soup, file_path)
            
            for i, section in enumerate(sections):
                doc_id = f"cdem_manual_{Path(file_path).stem}_{i}"
                
                doc = CDEMDocument(
                    doc_id=doc_id,
                    source_type="manual",
                    content=section['content'],
                    metadata={**metadata, **section['metadata']},
                    file_path=file_path,
                    category=metadata.get('category', 'CDEM技术手册'),
                    tags=metadata.get('tags', [])
                )
                
                documents.append(doc)
                
        except Exception as e:
            print(f"❌ 解析手册文件失败 {Path(file_path).name}: {e}")
            
        return documents
    
    def parse_cdem_case(self, file_path: str, case_type: str) -> List[CDEMDocument]:
        """解析CDEM案例文件"""
        documents = []
        
        try:
            file_name = Path(file_path).name
            
            if file_name.endswith('.js'):
                js_docs = self._parse_cdem_javascript_file(file_path, case_type)
                documents.extend(js_docs)
            elif file_name.endswith('.txt'):
                txt_docs = self._parse_cdem_config_file(file_path, case_type)
                documents.extend(txt_docs)
                
        except Exception as e:
            print(f"❌ 解析案例文件失败 {Path(file_path).name}: {e}")
            
        return documents
    
    def _parse_cdem_javascript_file(self, file_path: str, case_type: str) -> List[CDEMDocument]:
        """解析CDEM JavaScript案例文件"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"✅ 成功使用 {encoding} 编码读取JS: {Path(file_path).name}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"❌ 无法读取JS文件: {Path(file_path).name}")
                return documents
                
            # 使用esprima解析JavaScript
            try:
                ast = esprima.parseScript(content, {'range': True})
                functions_info = self._extract_functions_from_ast(ast)
            except Exception as e:
                print(f"⚠️  JavaScript AST解析失败 {Path(file_path).name}: {e}")
                functions_info = []
                
            # 提取元数据
            metadata = self._extract_cdem_case_metadata(file_path, content, case_type)
            
            # 按函数分割文档
            if functions_info:
                for func_info in functions_info:
                    doc_id = f"cdem_case_{case_type}_{Path(file_path).stem}_{func_info['name']}"
                    
                    doc = CDEMDocument(
                        doc_id=doc_id,
                        source_type="case",
                        content=func_info['code'],
                        metadata={
                            **metadata,
                            'function_name': func_info['name'],
                            'function_type': func_info['type'],
                            'parameters': func_info['params']
                        },
                        file_path=file_path,
                        category=metadata.get('category', f'CDEM{case_type}案例'),
                        tags=metadata.get('tags', []) + ['javascript', 'function', case_type.lower()]
                    )
                    
                    documents.append(doc)
            
            # 整体文件文档
            doc_id = f"cdem_case_{case_type}_full_{Path(file_path).stem}"
            
            doc = CDEMDocument(
                doc_id=doc_id,
                source_type="case",
                content=content,
                metadata={**metadata, 'document_type': 'full_file'},
                file_path=file_path,
                category=metadata.get('category', f'CDEM{case_type}案例'),
                tags=metadata.get('tags', []) + ['javascript', 'full_file', case_type.lower()]
            )
            
            documents.append(doc)
            
        except Exception as e:
            print(f"❌ 解析JS文件失败 {Path(file_path).name}: {e}")
            
        return documents
    
    def _parse_cdem_config_file(self, file_path: str, case_type: str) -> List[CDEMDocument]:
        """解析CDEM配置文件"""
        documents = []
        
        try:
            # 尝试多种编码方式
            content = None
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"✅ 成功使用 {encoding} 编码读取配置: {Path(file_path).name}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"❌ 无法读取配置文件: {Path(file_path).name}")
                return documents
                
            # 提取元数据
            metadata = self._extract_cdem_case_metadata(file_path, content, case_type)
            
            # 分析配置内容
            config_info = self._analyze_cdem_config_content(content, case_type)
            
            doc_id = f"cdem_config_{case_type}_{Path(file_path).stem}"
            
            doc = CDEMDocument(
                doc_id=doc_id,
                source_type="case",
                content=content,
                metadata={
                    **metadata,
                    'config_type': config_info['type'],
                    'parameters': config_info['parameters'],
                    'description': config_info['description']
                },
                file_path=file_path,
                category=metadata.get('category', f'CDEM{case_type}配置'),
                tags=metadata.get('tags', []) + ['config', 'parameters', case_type.lower()]
            )
            
            documents.append(doc)
            
        except Exception as e:
            print(f"❌ 解析配置文件失败 {Path(file_path).name}: {e}")
            
        return documents
    
    def _extract_cdem_manual_metadata(self, file_path: str, content: str) -> Dict[str, Any]:
        """提取CDEM技术手册元数据"""
        file_name = Path(file_path).name
        metadata = {
            'file_name': file_name,
            'file_size': len(content),
            'created_time': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat(),
            'modified_time': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
        }
        
        # 从文件名提取软件模块信息
        if 'CDyna软件' in file_name:
            metadata['module'] = 'CDyna'
            metadata['category'] = 'CDyna技术手册'
        elif 'SuperCDEM软件' in file_name:
            metadata['module'] = 'SuperCDEM'
            metadata['category'] = 'SuperCDEM技术手册'
        elif 'GFlow软件' in file_name:
            metadata['module'] = 'GFlow'
            metadata['category'] = 'GFlow技术手册'
        elif 'MudSim软件' in file_name:
            metadata['module'] = 'MudSim'
            metadata['category'] = 'MudSim技术手册'
        elif 'imath模块' in file_name:
            metadata['module'] = 'imath'
            metadata['category'] = 'imath模块手册'
        elif 'imeshing模块' in file_name or 'imesh模块' in file_name:
            metadata['module'] = 'imeshing'
            metadata['category'] = 'imeshing模块手册'
        elif 'pargen模块' in file_name:
            metadata['module'] = 'pargen'
            metadata['category'] = 'pargen模块手册'
        else:
            metadata['module'] = 'Other'
            metadata['category'] = '其他CDEM手册'
            
        # 提取标题和章节号
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            metadata['title'] = title_match.group(1).strip()
            
        # 从文件名提取章节号
        chapter_match = re.search(r'-(\d+)-', file_name)
        if chapter_match:
            metadata['chapter'] = chapter_match.group(1)
            
        return metadata
    
    def _extract_cdem_case_metadata(self, file_path: str, content: str, case_type: str) -> Dict[str, Any]:
        """提取CDEM案例库元数据"""
        file_name = Path(file_path).name
        metadata = {
            'file_name': file_name,
            'file_size': len(content),
            'created_time': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat(),
            'modified_time': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat(),
            'case_type': case_type
        }
        
        # 从文件名提取具体案例类型
        if '基本案例' in file_name:
            metadata['case_category'] = '基本案例'
        elif '扩展案例' in file_name:
            metadata['case_category'] = '扩展案例'
        elif '粒子模块案例' in file_name:
            metadata['case_category'] = '粒子模块案例'
        elif '块体模块案例' in file_name:
            metadata['case_category'] = '块体模块案例'
        elif '冲击波模块案例' in file_name:
            metadata['case_category'] = '冲击波模块案例'
        elif '其他模块案例' in file_name:
            metadata['case_category'] = '其他模块案例'
        elif '脚本功能库' in file_name:
            metadata['case_category'] = '脚本功能库'
        elif '参数化几何及网格创建案例' in file_name:
            metadata['case_category'] = '参数化几何及网格创建案例'
        elif '复杂几何边界球形粒子快速填充案例' in file_name:
            metadata['case_category'] = '复杂几何边界球形粒子快速填充案例'
        elif '网格导入导出案例' in file_name:
            metadata['case_category'] = '网格导入导出案例'
        else:
            metadata['case_category'] = '其他案例'
            
        # 设置分类
        metadata['category'] = f'CDEM{case_type}{metadata["case_category"]}'
        
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
                        print(f"⚠️  处理标题时出错 {Path(file_path).name}: {e}")
                        continue
                        
        except Exception as e:
            print(f"⚠️  分割Markdown章节失败 {Path(file_path).name}: {e}")
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
                print(f"⚠️  AST遍历错误: {e}")
                pass
                    
        try:
            traverse(ast)
        except Exception as e:
            print(f"⚠️  AST解析失败: {e}")
            
        return functions
    
    def _analyze_cdem_config_content(self, content: str, case_type: str) -> Dict[str, Any]:
        """分析CDEM配置文件内容"""
        lines = content.strip().split('\n')
        parameters = {}
        config_type = 'unknown'
        description = ''
        
        # 根据案例类型识别配置类型
        if case_type == 'CDyna':
            if any('coord' in line.lower() for line in lines[:5]):
                config_type = 'coordinates'
                description = 'CDyna坐标数据配置'
            elif any('frac' in line.lower() for line in lines[:5]):
                config_type = 'fracture'
                description = 'CDyna裂隙配置参数'
            elif any('load' in line.lower() for line in lines[:5]):
                config_type = 'load'
                description = 'CDyna载荷配置'
            elif len(lines) > 0 and re.match(r'^[\d\.\s-]+$', lines[0]):
                config_type = 'numeric_data'
                description = 'CDyna数值数据文件'
        elif case_type == 'Modeling':
            config_type = 'meshing_config'
            description = '建模网格配置参数'
        else:
            config_type = f'{case_type.lower()}_config'
            description = f'{case_type}配置文件'
            
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
    
    def chunk_documents(self):
        """文档分块处理"""
        chunked_docs = []
        
        for doc in self.documents:
            # 使用LangChain文本分割器
            chunks = self.text_splitter.split_text(doc.content)
            
            for i, chunk in enumerate(chunks):
                chunked_doc = CDEMDocument(
                    doc_id=f"{doc.doc_id}_chunk_{i}",
                    source_type=doc.source_type,
                    content=chunk,
                    metadata={
                        **doc.metadata,
                        'parent_doc_id': doc.doc_id,
                        'chunk_index': i,
                        'total_chunks': len(chunks)
                    },
                    file_path=doc.file_path,
                    category=doc.category,
                    tags=doc.tags + ['chunk']
                )
                chunked_docs.append(chunked_doc)
                
        return chunked_docs
    
    async def build_embeddings(self, documents: List[CDEMDocument]):
        """构建文档嵌入向量"""
        print(f"🔄 构建 {len(documents)} 个文档的嵌入向量...")
        
        texts = [doc.content for doc in documents]
        embeddings_list = self.embeddings.embed_documents(texts)
        
        for doc, embedding in zip(documents, embeddings_list):
            doc.embedding = embedding
            
        print("✅ 嵌入向量构建完成")
    
    def store_to_milvus(self, documents: List[CDEMDocument]):
        """存储到Milvus本地数据库"""
        print(f"💾 存储 {len(documents)} 个文档到本地Milvus...")
        
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
            print(f"  已插入 {min(i+batch_size, len(data))}/{len(data)} 个文档")
        
        # 刷新数据
        self.client.flush(self.collection_name)
        
        print("✅ 数据存储完成")
        print(f"📍 数据库文件位置: {self.milvus_uri}")
        
    async def build_cdem_knowledge_base(self, cdem_directory: str):
        """构建CDEM统一知识库"""
        print("🚀 开始构建CDEM统一知识库...")
        
        # 1. 扫描目录并分类文件
        file_categories = self.scan_cdem_directory(cdem_directory)
        
        # 2. 解析技术手册
        print("\n📚 解析技术手册...")
        for manual_file in file_categories["manuals"]:
            docs = self.parse_cdem_manual(manual_file)
            self.documents.extend(docs)
            
        # 3. 解析各类案例
        case_categories = [
            ("cdyna_cases", "CDyna"),
            ("gflow_cases", "GFlow"), 
            ("mudsim_cases", "MudSim"),
            ("supercdem_cases", "SuperCDEM"),
            ("modeling_cases", "Modeling")
        ]
        
        for category_key, case_type in case_categories:
            print(f"\n🔧 解析{case_type}案例...")
            for case_file in file_categories[category_key]:
                docs = self.parse_cdem_case(case_file, case_type)
                self.documents.extend(docs)
        
        print(f"\n📊 总共解析了 {len(self.documents)} 个文档")
        
        # 4. 文档分块
        chunked_documents = self.chunk_documents()
        print(f"🔄 分块后得到 {len(chunked_documents)} 个文档块")
        
        # 5. 构建嵌入向量
        await self.build_embeddings(chunked_documents)
        
        # 6. 存储到本地Milvus
        self.store_to_milvus(chunked_documents)
        
        print("\n🎉 CDEM统一知识库构建完成!")
        
        return chunked_documents


class CDEMKnowledgeRetriever:
    """CDEM知识检索器"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        # 使用Ollama本地bge-m3模型
        self.embeddings = OllamaEmbeddings(
            model=config.get("embedding_model", "bge-m3:latest"),
            base_url=config.get("ollama_base_url", "http://localhost:11434")
        )
        
        # 连接本地Milvus
        self.milvus_uri = config.get("milvus_uri", "./cdem_knowledge_db.db")
        self.client = MilvusClient(self.milvus_uri)
        self.collection_name = config.get("collection_name", "cdem_knowledge")
        
        print(f"🔍 CDEM知识检索器已连接到本地数据库: {self.milvus_uri}")
        
    def search(self, query: str, k: int = 5, source_filter: Optional[str] = None, 
               case_type_filter: Optional[str] = None) -> List[Document]:
        """搜索CDEM知识"""
        
        # 构建查询向量
        query_embedding = self.embeddings.embed_query(query)
        
        # 先进行无过滤搜索
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                data=[query_embedding],
                limit=k * 2,  # 获取更多结果用于过滤
                output_fields=["doc_id", "source_type", "content", "category", "file_path", "metadata"]
            )
        except Exception as e:
            print(f"❌ 搜索失败: {e}")
            return []
        
        # 转换为LangChain Document格式并进行后过滤
        documents = []
        for hit in results[0]:  # 第一个查询的结果
            # 获取metadata
            metadata = hit["entity"]["metadata"]
            if isinstance(metadata, str):
                try:
                    metadata = json.loads(metadata)
                except:
                    metadata = {}
            
            # 应用过滤条件
            if source_filter and hit["entity"].get("source_type") != source_filter:
                continue
                
            if case_type_filter and metadata.get("case_type") != case_type_filter:
                continue
            
            doc = Document(
                page_content=hit["entity"]["content"],
                metadata={
                    "doc_id": hit["entity"]["doc_id"],
                    "source_type": hit["entity"]["source_type"],
                    "category": hit["entity"]["category"],
                    "file_path": hit["entity"]["file_path"],
                    "score": hit["distance"],
                    **metadata
                }
            )
            documents.append(doc)
            
            # 限制结果数量
            if len(documents) >= k:
                break
        
        return documents
    
    def search_by_module(self, query: str, module: str, k: int = 5) -> List[Document]:
        """按模块搜索"""
        return self.search(query, k=k, case_type_filter=module)
    
    def hybrid_search(self, query: str, k: int = 5) -> Dict[str, List[Document]]:
        """混合搜索：同时搜索手册和各类案例"""
        
        manual_results = self.search(query, k=k//3, source_filter="manual")
        cdyna_results = self.search(query, k=k//4, case_type_filter="CDyna")
        other_cases = self.search(query, k=k//4)
        
        all_results = manual_results + cdyna_results + other_cases
        all_results = all_results[:k]  # 限制总数量
        
        return {
            "manual": manual_results,
            "cdyna": cdyna_results,
            "other_cases": other_cases,
            "all": all_results
        }


async def main():
    """主函数"""
    
    # 配置
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "milvus_uri": "./cdem_knowledge_db.db",
        "collection_name": "cdem_unified_knowledge",
        "chunk_size": 1000,
        "chunk_overlap": 200
    }
    
    # CDEM目录路径
    cdem_directory = "/Users/cxh/Codes/langchain/physic/docs/CDEM案例库及手册"
    
    # 构建知识库
    builder = CDEMKnowledgeBuilder(config)
    documents = await builder.build_cdem_knowledge_base(cdem_directory)
    
    # 测试检索
    retriever = CDEMKnowledgeRetriever(config)
    
    # 测试查询
    test_queries = [
        "CDyna块体模块基础功能",
        "SuperCDEM粒子离散元方法",
        "GFlow滑坡模拟",
        "建模网格参数化创建",
        "MudSim泥石流计算",
        "冲击波爆炸模拟"
    ]
    
    print("\n=== 🔍 测试CDEM知识检索 ===")
    for query in test_queries:
        print(f"\n📝 查询: {query}")
        results = retriever.hybrid_search(query, k=3)
        
        print(f"📚 手册结果 ({len(results['manual'])} 个):")
        for doc in results['manual']:
            title = doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))
            module = doc.metadata.get('module', '未知模块')
            print(f"  - [{module}] {title}")
            
        print(f"🔧 CDyna案例结果 ({len(results['cdyna'])} 个):")
        for doc in results['cdyna']:
            file_name = doc.metadata.get('file_name', '无文件名')
            case_category = doc.metadata.get('case_category', '未知类别')
            print(f"  - [{case_category}] {file_name}")
    
    print(f"\n📍 数据库文件已保存至: {config['milvus_uri']}")
    print("🎉 CDEM知识库构建完成！")


if __name__ == "__main__":
    asyncio.run(main())
