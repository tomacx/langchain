import os
import pickle
import traceback
from .preprocessors.pdf_processor import PDFProcessor
from .preprocessors.ppt_processor import PPTProcessor
from .preprocessors.word_processor import WordProcessor
from .preprocessors.md_processor import MDProcessor
from .preprocessors.image_processor import ImageProcessor
from .cleaning import clean_text
from .formatter import format_to_json
from .chunker import Chunker
from langchain_mistralai import MistralAIEmbeddings
from langchain_community.vectorstores import FAISS

# Step 1: 根据文件类型加载、预处理、清洗、格式化并分块
def load_file_chunks(file_path):
    """
    主入口，返回经过清洗、分块后的 chunk 列表。
    对应 views.py 中：
        chunks = load_file_chunks(local_path)
    """

    try:
        ext = os.path.splitext(file_path)[1].lower()

        # 1）选择预处理器
        if ext == ".pdf":
            raw_docs = PDFProcessor().extract(file_path)

        elif ext in [".ppt", ".pptx"]:
            raw_docs = PPTProcessor().extract(file_path)

        elif ext in [".doc", ".docx"]:
            raw_docs = WordProcessor().extract(file_path)

        elif ext == ".md":
            raw_docs = MDProcessor().extract(file_path)

        elif ext in [".jpg", ".jpeg", ".png"]:
            raw_docs = ImageProcessor().extract(file_path)

        else:
            raise Exception(f"Unsupported file type: {ext}")
        
        # 2）清洗
        cleaned_docs = []
        for d in raw_docs:
            cleaned_docs.append({
                "content": clean_text(d["content"]),
                "metadata": d["metadata"],
            })

        # 3）统一结构化输出格式
        formatted = format_to_json(cleaned_docs)

        # 4）分块
        chunker = Chunker()
        chunks = chunker.split(formatted)

        # 返回进 views.py
        return chunks

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"Error during chunking: {e}")

# Step 2: 构建 FAISS 向量库并持久化
def build_vectorstore(chunks, index_path):
    """
    接收分块链式处理结果，生成向量库并写入本地。
    对应 views.py 中：
        build_vectorstore(chunks, index_path)
    """

    try:
        # 从 chunk 中拆出文本和元数据
        texts = [c["content"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        # 1）Mistral Embedding
        embedding = MistralAIEmbeddings(model="mistral-embed")

        # 2）FAISS 构建向量库
        vs = FAISS.from_texts(
            texts=texts,
            embedding=embedding,
            metadatas=metadatas
        )

        # 3）持久化向量库
        vs.save_local(index_path)

        print(f"[build_vectorstore] Saved FAISS index: {index_path}")

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"Error building vectorstore: {e}")
