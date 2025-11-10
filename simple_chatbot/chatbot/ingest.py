import os
from .preprocessors.pdf_processor import PDFProcessor
from .preprocessors.ppt_processor import PPTProcessor
from .preprocessors.word_processor import WordProcessor
from .preprocessors.md_processor import MDProcessor
from .preprocessors.image_processor import ImageProcessor
from .cleaning import clean_text
from .formatter import format_to_json
from .chunker import Chunker
from langchain_mistralai import MistralAIEmbeddings
from langchain.vectorstores import FAISS
import pickle

def preprocess(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        docs = PDFProcessor().extract(file_path)
    elif ext in [".pptx", ".ppt"]:
        docs = PPTProcessor().extract(file_path)
    elif ext in [".doc", ".docx"]:
        docs = WordProcessor().extract(file_path)
    elif ext == ".md":
        docs = MDProcessor().extract(file_path)
    elif ext in [".jpg", ".png"]:
        docs = ImageProcessor().extract(file_path)
    else:
        raise Exception("Unsupported file type!")

    cleaned = []
    for d in docs:
        cleaned.append({
            "content": clean_text(d["content"]),
            "metadata": d["metadata"]
        })

    formatted = format_to_json(cleaned)
    chunks = Chunker().split(formatted)

    embeddings = MistralAIEmbeddings(model="mistral-embed")

    texts = [c["content"] for c in chunks]
    metas = [c["metadata"] for c in chunks]

    vs = FAISS.from_texts(texts, embeddings, metas)

    with open(f"{file_path}.faiss.pkl", "wb") as f:
        pickle.dump(vs, f)

    return f"{file_path}.faiss.pkl"