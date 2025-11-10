import os
import pickle
from langchain.chains import RetrievalQA
from langchain.vectorstores import InMemoryVectorStore

from langchain.chat_models import init_chat_model

def load_vectorstore_from_path(index_path):
    with open(index_path, "rb") as f:
        vs = pickle.load(f)
    return vs

def answer_question(index_path, question, top_k=4):
    vs = load_vectorstore_from_path(index_path)
    retriever = vs.as_retriever(search_kwargs={"k": top_k})

    # 初始化聊天模型
    model = init_chat_model("deepseek-chat")
    
    # 创建检索问答链
    qa = RetrievalQA.from_chain_type(llm=model, chain_type="stuff", retriever=retriever)
    response = qa.run(question)
    return response