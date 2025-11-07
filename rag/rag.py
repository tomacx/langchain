from langchain.agents import create_agent
import os
from dotenv import load_dotenv
# 加载 .env 文件中的环境变量
load_dotenv(encoding='utf-8')

# os.getenv("DEEPSEEK_API_KEY")
os.getenv("LANGCHAIN_TRACING_V2")
os.getenv("LANGCHAIN_ENDPOINT")
os.getenv("LANGCHAIN_PROJECT")
os.getenv("LANGCHAIN_API_KEY")
# os.getenv("MISTRAL_API_KEY")
# os.getenv("OPENAI_API_KEY")
os.getenv("GEMINI_API_KEY")

from langchain_core.documents import Document

# 文档
documents = [
    Document(
        page_content="Dogs are great companions, known for their loyalty and friendliness.",
        metadata={"source": "mammal-pets-doc"},
    ),
    Document(
        page_content="Cats are independent pets that often enjoy their own space.",
        metadata={"source": "mammal-pets-doc"},
    ),
]

# 文档加载
from langchain_community.document_loaders import PyPDFLoader

file_path = "d:/docs/nke-10k-2023.pdf"
loader = PyPDFLoader(file_path)

docs = loader.load()

# print(len(docs))

# print(f"{docs[0].page_content[:200]}\n")
# print(docs[0].metadata)

# 拆分文档

from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    add_start_index=True,
)
all_splits = text_splitter.split_documents(docs)

# print(len(all_splits))

# 嵌入
# from langchain_mistralai import MistralAIEmbeddings
# from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# embeddings = MistralAIEmbeddings(model="mistral-embed")
# embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

vector_1 = embeddings.embed_query(all_splits[0].page_content)
vector_2 = embeddings.embed_query(all_splits[1].page_content)

assert len(vector_1) == len(vector_2)
# print(f"Generated vectors of length: {len(vector_1)}\n")
# print(vector_1[:10])

# 向量存储
from langchain_core.vectorstores import InMemoryVectorStore

# 包含文档
vector_store = InMemoryVectorStore(embeddings)

ids = vector_store.add_documents(all_splits)

# vector_store 中根据与字符串查询的相似度返回文档
results = vector_store.similarity_search("How many distribution centers does Nike have in the US?")

print(results[0])