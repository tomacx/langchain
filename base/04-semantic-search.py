from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# 嵌入模型
embedding=OllamaEmbeddings(model="nomic-embed-text")

# 向量库（知识库）
vector_store = Chroma(
    collection_name='example_collection',
    embedding_function=embedding,
    persist_directory='./chroma_langchain_db'
)

# 相似度查询
results = vector_store.similarity_search(
    "What optimizations does EvoAgentX implement?",
)

for index, result in enumerate(results):
    print(index)
    print(result.page_content[:100])

# 带分数的相似度查询
results = vector_store.similarity_search_with_score(
    "What optimizations does EvoAgentX implement?",
)

for doc, score in results:
    print(score)
    print(doc.page_content[:100])

# 用向量进行相似度查询
print("用向量进行相似度查询")
vector = embedding.embed_query("What optimizations does EvoAgentX implement?")

results = vector_store.similarity_search_by_vector(
    vector
)

for index, result in enumerate(results):
    print(index)
    print(result.page_content[:100])


# chain: langchain: 大模型、提示词模板、tools, output、Runnable
print("用检索器进行查询")
from typing import List

from langchain_core.documents import Document
from langchain_core.runnables import chain

@chain
def retriever(query: str) -> List[Document]:
    return vector_store.similarity_search(query, k=1)


results = retriever.invoke("What optimizations does EvoAgentX implement?")

for index, result in enumerate(results):
    print(index)
    print(result.page_content[:100])
