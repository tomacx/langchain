## 索引
# 1. 读取PDF，按照页来管理的，Document，List[Document]
# 2. 分割文本，文本段（chunk），Document，List[Document]
# 3. 向量化：文本段 <-> 向量，需要一个嵌入模型来辅助
# 4. 向量库：把多个文本段/向量存到向量库中

# pip install pypdf

from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("/Users/cxh/Zotero/storage/MHUZSKL7/Wang 等 - 2025 - EvoAgentX An Automated Framework for Evolving Agentic Workflows.pdf")

docs = loader.load()

print(f"文档总页数: {len(docs)}")
# print(type(docs[0])) # <class 'langchain_core.documents.base.Document'>
# print(docs[0])

# page_content='...' 
# metadata={
#   'producer': 'macOS 版本15.1（版号24B2083） Quartz PDFContext', 
#   'creator': 'Typora', 
#   'creationdate': "D:20250617023633Z00'00'", 
#   'moddate': "D:20250617023633Z00'00'", 
#   'source': '/Users/cxh/Desktop/ppt设计.pdf',
#   'total_pages': 2, 
#   'page': 0, 
#   'page_label': '1'}

from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,    # char/token/chunk
    chunk_overlap=200,  # 
    add_start_index=True
)

all_splits = text_splitter.split_documents(docs) # List[Document]

print ("分割后长度:", len(all_splits))
# print (all_splits[0])

# page_content='...'
# metadata={
#     'producer': 'macOS 版本15.1（版号24B2083） Quartz PDFContext', 
#     'creator': 'Typora', 
#     'creationdate': "D:20250617023633Z00'00'", 
#     'moddate': "D:20250617023633Z00'00'", 
#     'source': '/Users/cxh/Desktop/ppt设计.pdf', 
#     'total_pages': 2, 
#     'page': 0, 
#     'page_label': '1', 
#     'start_index': 0}

from langchain_ollama import OllamaEmbeddings

embedding=OllamaEmbeddings(
    model="nomic-embed-text"
)

vector_0 = embedding.embed_query(all_splits[0].page_content)
print("向量长度:", len(vector_0)) # 768 这个维度和嵌入模型有关系
# print(vector_0)

from langchain_chroma import Chroma
vector_store = Chroma(
    collection_name='example_collection',
    embedding_function=embedding,
    persist_directory='./chroma_langchain_db'
)

ids = vector_store.add_documents(documents=all_splits)

print("添加的向量数量:", len(ids))
print("添加的向量ID:", ids)