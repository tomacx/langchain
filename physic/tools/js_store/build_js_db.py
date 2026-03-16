#!/usr/bin/env python3
"""
CDEM 案例库及手册向量数据库构建器 (Windows/Chroma版)
专门处理 CDEM案例库及手册 目录 + 训练集JS文件
"""

import os
import re
import json
import shutil
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

# LangChain imports
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

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
        
        self.context_window = int(config.get("context_window", 0) or 0)
        self.max_context_chars = int(config.get("max_context_chars", 2000) or 2000)
        self.include_headers = bool(config.get("include_headers", True))
        self.split_by_character = (config.get("split_by_character") or None)
        self.split_by_character_only = bool(config.get("split_by_character_only", False))
        self.use_raganything = bool(config.get("use_raganything", False))
        self.raganything_working_dir = str(config.get("raganything_working_dir") or "./rag_storage_cdem")
        self.raganything_parser = str(config.get("raganything_parser") or "mineru")
        self.raganything_parse_method = str(config.get("raganything_parse_method") or "auto")
        self.raganything_max_context_tokens = int(config.get("raganything_max_context_tokens", 2000) or 2000)
        self._rag = None
        self._rag_parser_ready = False
        if self.use_raganything:
            try:
                from raganything import RAGAnything, RAGAnythingConfig
                
                ra_cfg = RAGAnythingConfig(
                    working_dir=self.raganything_working_dir,
                    parser=self.raganything_parser,
                    parse_method=self.raganything_parse_method,
                    display_content_stats=False,
                    enable_image_processing=False,
                    enable_table_processing=False,
                    enable_equation_processing=False,
                    context_window=max(1, int(self.context_window or 1)),
                    context_mode="page",
                    max_context_tokens=self.raganything_max_context_tokens,
                    include_headers=self.include_headers,
                    include_captions=True,
                )
                self._rag = RAGAnything(config=ra_cfg)
                self._rag_parser_ready = bool(self._rag.check_parser_installation())
                if not self._rag_parser_ready:
                    print("⚠️ RAG-Anything 解析器未就绪，自动回退到本地解析/切分。")
            except Exception as e:
                self._rag = None
                self._rag_parser_ready = False
                print(f"⚠️ RAG-Anything 初始化失败，自动回退到本地解析/切分：{e}")
        
        # 5. 暂存文档列表
        self.documents: List[CDEMDocument] = []
    
    def _split_markdown_sections(self, content: str) -> List[Dict[str, Any]]:
        lines = content.splitlines()
        sections: List[Dict[str, Any]] = []
        header_stack: List[tuple[int, str]] = []
        cur_lines: List[str] = []
        cur_header_path = ""
        
        def flush():
            nonlocal cur_lines, cur_header_path
            txt = "\n".join(cur_lines).strip()
            if txt:
                sections.append({"header_path": cur_header_path, "text": txt})
            cur_lines = []
        
        for line in lines:
            m = re.match(r"^(#{1,6})\\s+(.+?)\\s*$", line)
            if m:
                flush()
                level = len(m.group(1))
                title = m.group(2).strip()
                while header_stack and header_stack[-1][0] >= level:
                    header_stack.pop()
                header_stack.append((level, title))
                cur_header_path = " > ".join([t for _, t in header_stack])
                cur_lines.append(line)
            else:
                cur_lines.append(line)
        
        flush()
        return sections
    
    def _build_context_text(self, units: List[str], idx: int) -> str:
        if self.context_window <= 0 or not units:
            return ""
        start = max(0, idx - self.context_window)
        end = min(len(units) - 1, idx + self.context_window)
        if start == idx and end == idx:
            return ""
        parts: List[str] = []
        for j in range(start, end + 1):
            if j == idx:
                continue
            s = units[j].strip()
            if not s:
                continue
            if len(s) > 800:
                s = s[:800] + "…"
            parts.append(s)
        if not parts:
            return ""
        ctx = "\n\n".join(parts)
        if len(ctx) > self.max_context_chars:
            ctx = ctx[: self.max_context_chars] + "…"
        return ctx
    
    def _split_text_units(self, text: str) -> List[str]:
        split_by = self.split_by_character
        if not split_by:
            return [text]
        if self.split_by_character_only:
            return [t for t in (s.strip() for s in text.split(split_by)) if t]
        return [text.replace(split_by, "\n\n")]
        
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
        encodings = ["utf-8", "utf-8-sig", "gb18030", "gbk", "gb2312", "cp936", "latin-1", "cp1252"]
        try:
            data = file_path.read_bytes()
        except Exception as e:
            print(f"⚠️ 读取错误 {file_path.name}: {e}")
            return None
        for encoding in encodings:
            try:
                return data.decode(encoding)
            except UnicodeDecodeError:
                continue
            except Exception:
                continue
        try:
            return data.decode("utf-8", errors="replace")
        except Exception:
            return None

    def parse_cdem_manual_pdf(self, file_path: Path) -> List[CDEMDocument]:
        """
        解析 PDF 技术手册
        使用 PyMuPDF 提取文本，并尝试保留结构
        """
        documents: List[CDEMDocument] = []
        try:
            pdf = fitz.open(file_path)
        except Exception as e:
            print(f"❌ 解析 PDF 失败 {file_path.name}: {e}")
            return documents

        metadata = self._extract_common_metadata(file_path)
        all_pages: List[str] = []
        try:
            for idx, page in enumerate(pdf):
                txt = (page.get_text() or "").strip()
                if not txt:
                    continue
                all_pages.append(txt)
                documents.append(
                    CDEMDocument(
                        doc_id=f"manual_pdf_{file_path.stem}_p{idx+1}",
                        source_type="manual_pdf",
                        content=txt,
                        metadata={**metadata, "page_number": idx + 1, "type": "pdf_page"},
                        file_path=str(file_path),
                        category=metadata.get("category", "技术手册"),
                        tags=["manual", "pdf", metadata.get("module", "general")],
                    )
                )
        finally:
            try:
                pdf.close()
            except Exception:
                pass

        full_text = "\n\n".join(all_pages).strip()
        if full_text:
            documents.append(
                CDEMDocument(
                    doc_id=f"manual_pdf_{file_path.stem}_full",
                    source_type="manual_pdf",
                    content=full_text,
                    metadata={**metadata, "type": "pdf_full"},
                    file_path=str(file_path),
                    category=metadata.get("category", "技术手册"),
                    tags=["manual", "pdf", metadata.get("module", "general")],
                )
            )

        return documents

    def _extract_markdown_tables(self, content: str) -> List[Dict[str, Any]]:
        """
        提取 Markdown 表格并转换为结构化数据
        
        Args:
            content: Markdown 文本内容
            
        Returns:
            表格列表，每个表格包含 'caption' (如果有) 和 'text' (表格的文本表示)
        """
        tables = []
        lines = content.splitlines()
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # 检测表格标题 (e.g. <center>表4.1 孔隙渗流接口函数列表</center>)
            caption = ""
            if line.startswith("<center>") and "表" in line:
                match = re.search(r"<center>(.*?)</center>", line)
                if match:
                    caption = match.group(1)
                i += 1
                if i >= len(lines): break
                line = lines[i].strip()
            
            # 检测表格开始 (Markdown 表格通常以 | ... | 开始，或者第二行是分隔线 |---|)
            if "|" in line:
                # 检查下一行是否是分隔线
                if i + 1 < len(lines) and re.match(r"^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?$", lines[i+1].strip()):
                    # 这是一个表格
                    table_lines = []
                    # 如果有标题，先加上
                    if caption:
                        table_lines.append(f"表格标题: {caption}")
                    
                    # 提取表头
                    table_lines.append(line)
                    i += 1 # 跳过表头
                    table_lines.append(lines[i]) # 分隔线
                    i += 1 # 跳过分隔线
                    
                    # 提取表体
                    while i < len(lines):
                        row = lines[i].strip()
                        if not row or "|" not in row:
                            break
                        table_lines.append(row)
                        i += 1
                    
                    tables.append({
                        "caption": caption,
                        "text": "\n".join(table_lines)
                    })
                    continue
            
            i += 1
        return tables

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
        
        # 2. 提取概览表格（模块功能列表）
        tables = self._extract_markdown_tables(content)
        for idx, table in enumerate(tables):
            # 过滤掉太小的表格，或者不含“函数”、“方法”、“接口”等关键词的表格（可能是普通数据表）
            if len(table['text']) > 50 and any(k in table.get('caption', '') + table['text'] for k in ['函数', '方法', '接口', '功能', '列表']):
                table_doc = CDEMDocument(
                    doc_id=f"manual_overview_table_{file_path.stem}_{idx}",
                    source_type="manual_overview",
                    content=f"【模块功能概览】\n所属模块: {metadata.get('module', 'General')}\n{table['text']}",
                    metadata={
                        **metadata,
                        'type': 'overview_table',
                        'table_caption': table.get('caption', '')
                    },
                    file_path=str(file_path),
                    category="模块概览",
                    tags=['overview', 'table', metadata.get('module', 'general')]
                )
                documents.append(table_doc)
        
        # 3. 提取 API 条目（增强索引）
        # 利用 <!--HJS_...--> 锚点分割 API
        api_sections = re.split(r'<!--HJS_', content)
        
        for section in api_sections[1:]: # 跳过第一个（通常是文件头）
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
                
                # 提取格式定义
                fmt_match = re.search(r'####\s+格式定义\s+(.+?)(?:\n####|\r####)', section, re.DOTALL)
                format_def = fmt_match.group(1).strip() if fmt_match else ""

                # 提取参数列表
                params_match = re.search(r'####\s+参数\s+(.+?)(?:\n####|\r####)', section, re.DOTALL)
                params = params_match.group(1).strip() if params_match else ""

                # 提取备注
                remarks_match = re.search(r'####\s+备注\s+(.+?)(?:\n####|\r####)', section, re.DOTALL)
                remarks = remarks_match.group(1).strip() if remarks_match else ""

                # 提取范例
                example_match = re.search(r'####\s+范例\s+(.+?)(?:\n####|\r####|$)', section, re.DOTALL)
                example = example_match.group(1).strip() if example_match else ""
                
                # 构建 API 专用文档块
                # 这个文档块专门用于回答 "如何使用 xxx 函数"
                api_doc_content = (
                    f"API名称: {clean_api_name}\n"
                    f"所属模块: {metadata.get('module', 'General')}\n"
                    f"功能说明: {description}\n"
                    f"格式定义: {format_def}\n"
                    f"参数详情: {params}\n"
                    f"备注: {remarks}\n"
                    f"范例: {example}\n"
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

                # 3. 提取范例（如果存在且长度适中，单独作为案例存入）
                if example and len(example) > 20:
                    example_doc = CDEMDocument(
                        doc_id=f"api_example_{clean_api_name}_{file_path.stem}",
                        source_type="api_example",
                        content=f"API: {clean_api_name}\n说明: {description}\n\n范例代码:\n{example}",
                        metadata={
                            **metadata,
                            'api_name': clean_api_name,
                            'type': 'api_example'
                        },
                        file_path=str(file_path),
                        category="API范例",
                        tags=['example', clean_api_name, metadata.get('module', 'general')]
                    )
                    documents.append(example_doc)
                
        return documents
    
    async def parse_cdem_manual_raganything(self, file_path: Path) -> List[CDEMDocument]:
        if not self._rag or not self._rag_parser_ready:
            return self.parse_cdem_manual(file_path)
        
        metadata = self._extract_common_metadata(file_path)
        try:
            content_list, content_based_doc_id = await self._rag.parse_document(
                file_path=str(file_path),
                output_dir=None,
                parse_method=self.raganything_parse_method,
                display_stats=False,
            )
        except Exception as e:
            print(f"⚠️ RAG-Anything 解析失败，回退到本地解析：{file_path.name} ({e})")
            return self.parse_cdem_manual(file_path)
        
        docs: List[CDEMDocument] = []
        for i, item in enumerate(content_list):
            t = (item.get("type") or "").strip()
            page_idx = item.get("page_idx")
            text = ""
            if t == "text":
                text = item.get("text") or ""
            elif t == "table":
                body = item.get("table_body") or ""
                caps = item.get("table_caption") or []
                foot = item.get("table_footnote") or []
                text = "\n".join([*caps, body, *foot]).strip()
            elif t == "equation":
                latex = item.get("latex") or ""
                desc = item.get("text") or ""
                text = "\n".join([latex, desc]).strip()
            elif t == "image":
                path = item.get("img_path") or ""
                caps = item.get("image_caption") or []
                foot = item.get("image_footnote") or []
                text = "\n".join([path, *caps, *foot]).strip()
            else:
                text = item.get("text") or item.get("content") or ""
            
            if not str(text).strip():
                continue
            
            md = {**metadata, "type": f"raganything_{t or 'unknown'}"}
            if page_idx is not None:
                md["page_idx"] = page_idx
                try:
                    md["page_number"] = int(page_idx) + 1
                except Exception:
                    pass
            
            docs.append(
                CDEMDocument(
                    doc_id=f"manual_ra_{file_path.stem}_{content_based_doc_id}_{i}",
                    source_type="manual",
                    content=str(text),
                    metadata=md,
                    file_path=str(file_path),
                    category=metadata.get("category", "技术手册"),
                    tags=["manual", "raganything", metadata.get("module", "general")],
                )
            )
        
        return docs

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
            elif doc.source_type == "manual" and str(doc.file_path).lower().endswith(".md"):
                sections = self._split_markdown_sections(doc.content)
                units = [s.get("text", "") for s in sections]
                md_chunks: List[str] = []
                for idx, sec in enumerate(sections):
                    header_path = (sec.get("header_path") or "").strip()
                    body = sec.get("text", "")
                    base = body
                    if self.include_headers and header_path:
                        base = f"标题路径: {header_path}\n\n{body}"
                    ctx = self._build_context_text(units, idx)
                    if ctx:
                        base = f"{base}\n\n关联上下文:\n{ctx}"
                    for unit in self._split_text_units(base):
                        md_chunks.extend(self.text_splitter.split_text(unit))
                chunks = md_chunks if md_chunks else self.text_splitter.split_text(doc.content)
            elif doc.source_type == "manual_pdf" and doc.metadata.get("type") == "pdf_page":
                page_number = int(doc.metadata.get("page_number") or 0)
                base = doc.content
                if self.context_window > 0 and page_number > 0:
                    all_pages = [
                        d.content
                        for d in self.documents
                        if d.source_type == "manual_pdf"
                        and d.file_path == doc.file_path
                        and d.metadata.get("type") == "pdf_page"
                    ]
                    units = all_pages
                    idx = page_number - 1
                    ctx = self._build_context_text(units, idx)
                    if ctx:
                        base = f"{base}\n\n关联上下文:\n{ctx}"
                pdf_chunks: List[str] = []
                for unit in self._split_text_units(base):
                    pdf_chunks.extend(self.text_splitter.split_text(unit))
                chunks = pdf_chunks if pdf_chunks else self.text_splitter.split_text(base)
            else:
                # 手册等文档使用常规分割
                chunks = self.text_splitter.split_text(doc.content)
            
            # 2. 构建语义增强的头部信息
            # Windows路径分隔符如果是反斜杠，显示时可能不美观，可转为 / 
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
                        "source_type": doc.source_type,
                        "content_type": doc.metadata.get("type"),
                        "page_number": doc.metadata.get("page_number"),
                        "page_idx": (int(doc.metadata.get("page_number") or 0) - 1) if doc.metadata.get("page_number") else None,
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
        reset_db = (os.environ.get("CDEM_RESET_DB") or "").strip().lower() in {"1", "true", "yes"}
        if reset_db:
            try:
                shutil.rmtree(self.persist_directory, ignore_errors=True)
            except Exception:
                pass
        
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
        build_limit_raw = (os.environ.get("CDEM_BUILD_LIMIT") or "").strip()
        build_limit = int(build_limit_raw) if build_limit_raw.isdigit() else None
        if build_limit and build_limit > 0:
            for k in list(file_cats.keys()):
                file_cats[k] = file_cats[k][:build_limit]
        
        # 2. 解析技术手册文件（原有逻辑）
        print("\n📚 解析技术手册内容...")
        # 手册
        for p in file_cats['manuals']:
            if self._rag_parser_ready:
                self.documents.extend(await self.parse_cdem_manual_raganything(p))
            else:
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
            if build_limit and build_limit > 0:
                training_files = training_files[:build_limit]
            
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
    
    def __init__(
        self,
        persist_dir: str,
        embedding_model_name: str = "bge-m3:latest",
        collection_name: str = "cdem_knowledge",
        ollama_base_url: str = "http://localhost:11434",
    ):
        print(f"🔍 加载 Chroma 数据库: {persist_dir}")
        self.embeddings = OllamaEmbeddings(
            model=embedding_model_name,
            base_url=ollama_base_url
        )
        self.vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=self.embeddings,
            collection_name=collection_name
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
    
    project_root = Path(__file__).resolve().parents[2]
    repo_root = Path(__file__).resolve().parents[3]
    docs_root = project_root / "docs"
    dataset_root = project_root / "dataset_split_results"
    js_store_root = Path(__file__).resolve().parent
    
    manual_dir_candidate = docs_root / "技术手册"
    case_dir_candidate = docs_root / "案例"
    combined_dir_candidate = docs_root / "CDEM案例库及手册"
    
    default_manual_dir = manual_dir_candidate if manual_dir_candidate.exists() else combined_dir_candidate
    default_case_dir = case_dir_candidate if case_dir_candidate.exists() else combined_dir_candidate
    default_dataset_split_json = dataset_root / "dataset_split.json"
    
    def resolve_env_path(key: str, default_path: Path) -> str:
        raw = (os.environ.get(key) or "").strip()
        if not raw:
            return str(default_path)
        p = Path(raw)
        if not p.is_absolute():
            p = (repo_root / p).resolve()
        return str(p)

    MANUAL_DIR = resolve_env_path("CDEM_MANUAL_DIR", default_manual_dir)
    DATASET_SPLIT_JSON = resolve_env_path("CDEM_DATASET_SPLIT_JSON", default_dataset_split_json)
    CASE_DIR = resolve_env_path("CDEM_CASE_DIR", default_case_dir)
    CHROMA_DB_DIR = resolve_env_path("CDEM_CHROMA_DB_DIR", js_store_root / "new_db_cdem")
    
    # 4. Embedding模型配置
    embedding_model = (os.environ.get("CDEM_EMBEDDING_MODEL") or "bge-m3:latest").strip()
    ollama_base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
    context_window_raw = (os.environ.get("CDEM_CONTEXT_WINDOW") or "").strip()
    max_context_chars_raw = (os.environ.get("CDEM_MAX_CONTEXT_CHARS") or "").strip()
    include_headers_raw = (os.environ.get("CDEM_INCLUDE_HEADERS") or "").strip().lower()
    split_by_character_raw = (os.environ.get("CDEM_SPLIT_BY_CHARACTER") or "").strip()
    split_by_character_only_raw = (os.environ.get("CDEM_SPLIT_BY_CHARACTER_ONLY") or "").strip().lower()
    use_raganything_raw = (os.environ.get("CDEM_USE_RAGANYTHING") or "").strip().lower()
    raganything_working_dir_raw = (os.environ.get("CDEM_RAGANYTHING_DIR") or "").strip()
    raganything_parser_raw = (os.environ.get("CDEM_RAGANYTHING_PARSER") or "").strip()
    raganything_parse_method_raw = (os.environ.get("CDEM_RAGANYTHING_PARSE_METHOD") or "").strip()
    raganything_max_context_tokens_raw = (os.environ.get("CDEM_RAGANYTHING_MAX_CONTEXT_TOKENS") or "").strip()
    context_window = int(context_window_raw) if context_window_raw.isdigit() else 2
    max_context_chars = int(max_context_chars_raw) if max_context_chars_raw.isdigit() else 2000
    include_headers = include_headers_raw not in {"0", "false", "no"}
    split_by_character = split_by_character_raw or None
    split_by_character_only = split_by_character_only_raw in {"1", "true", "yes"}
    use_raganything = use_raganything_raw in {"1", "true", "yes"}
    raganything_working_dir = raganything_working_dir_raw or str((js_store_root / "rag_storage_cdem").resolve())
    raganything_parser = raganything_parser_raw or "mineru"
    raganything_parse_method = raganything_parse_method_raw or "auto"
    raganything_max_context_tokens = int(raganything_max_context_tokens_raw) if raganything_max_context_tokens_raw.isdigit() else 2000
    config = {
        "embedding_model": embedding_model,
        "ollama_base_url": ollama_base_url,
        "persist_directory": CHROMA_DB_DIR,
        "collection_name": "new_db_cdem",
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "script_chunk_size": 8000,
        "script_chunk_overlap": 0,
        "context_window": context_window,
        "max_context_chars": max_context_chars,
        "include_headers": include_headers,
        "split_by_character": split_by_character,
        "split_by_character_only": split_by_character_only,
        "use_raganything": use_raganything,
        "raganything_working_dir": raganything_working_dir,
        "raganything_parser": raganything_parser,
        "raganything_parse_method": raganything_parse_method,
        "raganything_max_context_tokens": raganything_max_context_tokens,
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
    if Path(MANUAL_DIR).exists():
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
    
    if Path(CHROMA_DB_DIR).exists():
        retriever = CDEMKnowledgeRetriever(
            config["persist_directory"], 
            config["embedding_model"],
            collection_name=config["collection_name"],
            ollama_base_url=config["ollama_base_url"],
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
