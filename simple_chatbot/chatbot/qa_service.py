import os

from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain.chat_models import init_chat_model
from langchain_mistralai import MistralAIEmbeddings

def load_vectorstore_from_path(index_path):
    embedding = MistralAIEmbeddings(model="mistral-embed")
    return FAISS.load_local(index_path, embedding, allow_dangerous_deserialization=True)

def answer_question(index_path: str, question: str, top_k: int=4):
    vs = load_vectorstore_from_path(index_path)
    retriever = vs.as_retriever(
        search_type="similarity",
        search_kwargs={"k": top_k}
    )

    system_template = """
    你是专业知识问答助手。
    根据提供的上下文回答用户问题。
    如果上下文中找不到答案，请回答：“我无法从文档中找到答案”。
    上下文：
    {context}
    问题：
    {question}
    请给出你的回答：
    """

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=system_template
    )

    # 初始化聊天模型
    model = init_chat_model("deepseek-chat")
    
    # 创建检索问答链
    rag_chain = (
        {
            "context": retriever,
            "question": RunnablePassthrough() 
        }
        | prompt
        | model
    )

    response = rag_chain.invoke(question)
    
    return response.content