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
import re

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

def evaluate_script_quality(script_content: str) -> list[str]:
    """
    评估生成的脚本质量。
    返回错误信息列表。如果列表为空，说明质量合格。
    """
    errors = []
    
    # 提取可能包含在 markdown 里的代码块
    code_blocks = re.findall(r"```(?:python|javascript|js)?\s*\n(.*?)```", script_content, re.DOTALL | re.IGNORECASE)
    code_to_check = code_blocks[0] if code_blocks else script_content

    # 1. 长度检查：如果代码太短，认为没有真正完成任务
    if len(code_to_check.strip()) < 50:
        errors.append("生成的脚本过短，缺少实质性逻辑。")
        
    # 2. 是否输出了无法执行的内容（比如 JSON 格式说明）
    if code_to_check.strip().startswith("{") and '"' in code_to_check:
        errors.append("输出了 JSON 格式的文本，要求必须是可执行的代码。")

    # 3. 未完成的标志（如 "TODO" 或 "..."）
    if "TODO" in code_to_check or "..." in code_to_check:
         errors.append("生成的代码中包含未完成的占位符(TODO或...)。")
         
    return errors

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
query = "Can you write a python script about Task Decomposition? The script should be runnable and complete."

def generate_with_retry(query: str, max_retries: int = 2) -> str:
    current_query = query
    
    for attempt in range(max_retries + 1):
        print(f"\n--- 尝试第 {attempt + 1} 次生成 ---")
        
        # 运行 Agent
        final_answer = ""
        for step in agent.stream(
            {"messages": [{"role": "user", "content": current_query}]},
            stream_mode="values",
        ):
            last_message = step["messages"][-1]
            if hasattr(last_message, "content") and last_message.content:
                final_answer = last_message.content
                
        # 验证质量
        errors = evaluate_script_quality(final_answer)
        
        if not errors:
            print("\n✅ 生成质量合格！")
            return final_answer
            
        # 如果质量不合格，打印警告信息并准备重试
        print(f"\n⚠️ 警告: 脚本生成质量过低 (尝试 {attempt + 1}/{max_retries + 1})")
        for err in errors:
            print(f"   - {err}")
            
        if attempt < max_retries:
            print("🔄 正在准备根据反馈信息重新生成...")
            feedback = "\n".join(errors)
            current_query = (
                f"{query}\n\n"
                f"【注意】你上次生成的脚本存在以下问题，请在这次生成中务必修正：\n{feedback}\n"
                "请提供一段完整、可执行的代码，不要有TODO占位符，且逻辑要充分。"
            )
        else:
            print("❌ 已达到最大重试次数，返回最后一次生成的结果。")
            
    return final_answer

# 执行带重试的生成
final_result = generate_with_retry(query)
print("\n=== 最终结果 ===")
print(final_result)

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