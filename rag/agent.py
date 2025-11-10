import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv(encoding='utf-8')

os.getenv("DEEPSEEK_API_KEY")
os.getenv("LANGCHAIN_TRACING_V2")
os.getenv("LANGCHAIN_ENDPOINT")
os.getenv("LANGCHAIN_PROJECT")
os.getenv("LANGCHAIN_API_KEY")
os.getenv("MISTRAL_API_KEY")

# 选择聊天模型
from langchain.chat_models import init_chat_model

model = init_chat_model("deepseek-chat")

# 选择嵌入模型
from langchain_mistralai import MistralAIEmbeddings

embeddings = MistralAIEmbeddings(model="mistral-embed")

# 选择一个向量存储
from langchain_core.vectorstores import InMemoryVectorStore

vector_store = InMemoryVectorStore(embeddings)

# 索引

# Step1: 加载文档
import bs4
from langchain_community.document_loaders import WebBaseLoader

# Only keep post title, headers, and content from the full HTML.
bs4_strainer = bs4.SoupStrainer(class_=("post-title","post-header","post-content"))
loader = WebBaseLoader(
    web_paths=("https://lilianweng.github.io/posts/2023-06-23-agent/",),
    bs_kwargs={"parse_only": bs4_strainer}
)
docs = loader.load()

assert len(docs) == 1
# print(f"Total characters: {len(docs[0].page_content)}")
# print(docs[0].page_content[:500])

# Step2: 拆分文档
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,         # chunk_size (characters)
    chunk_overlap=200,       # chunk_overlap (characters)
    add_start_index=True,    # track index in original document
)
all_splits = text_splitter.split_documents(docs)

# print(f"Split blog post into {len(all_splits)} sub-documents.")

# Step3: 将拆分后的文档添加到向量存储中
document_ids = vector_store.add_documents(documents=all_splits)

# print(document_ids[:3])

# 检索与生成

# RAG 代理
from langchain.tools import tool

# 创建检索工具
@tool(response_format="content_and_artifact")
def retrieve_content(query: str) -> str:
    """Retrieve information to help answer a query."""
    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\nContent: {doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs

# 创建 RAG 代理
from langchain.agents import create_agent

# tools = [retrieve_content]
# # 可以使用自定义的 system prompt 来指导代理如何使用检索工具
# prompt = (
#     "You have access to a tool that retrieves context from a blog post. "
#     "Use the tool to help answer user queries."
# )
# agent = create_agent(model, tools, system_prompt=prompt)

# # 测试
# query = (
#     "What is the standard method for Task Decomposition?\n\n"
#     "Once you get the answer, look up common extensions of that method."
# )

# for event in agent.stream(
#     {"messages": [{"role": "user", "content": query}]},
#     stream_mode = "values",
# ):
#     event["messages"][-1].pretty_print()


# RAG链
from langchain.agents.middleware import dynamic_prompt, ModelRequest

@dynamic_prompt
def prompt_with_context(request: ModelRequest) -> str:
    """Inject context into state messages."""
    last_query = request.state["messages"][-1].text
    retrieved_docs = vector_store.similarity_search(last_query)

    docs_content = "\n\n".join(doc.page_content for doc in retrieved_docs)

    system_message = (
         "You are a helpful assistant. Use the following context in your response:"
        f"\n\n{docs_content}"
    )

    return system_message

agent = create_agent(model, tools=[], middleware=[prompt_with_context])

# 测试
query = "What is task decomposition?"
# for step in agent.stream(
#     {"messages": [{"role": "user", "content": query}]},
#     stream_mode="values",
# ):
#     step["messages"][-1].pretty_print()

# 跟着部分跟新
# for chunk in agent.stream(
#     {"messages": [{"role": "user", "content": query}]},
#     stream_mode="messages",
# ):
#     for step, data in chunk.items():
#         print(f"step: {step}")
#         print(f"content: {data['messages'][-1].content_blocks}")

# 流式输出
# for token, metadata in agent.stream(  
#     {"messages": [{"role": "user", "content": query}]},
#     stream_mode="messages",
# ):
#     print(token.content_blocks)