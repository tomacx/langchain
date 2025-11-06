from django.http import JsonResponse
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate

import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

def get_answer(request):
    user_question = request.GET.get("question")
    
    # 创建模型实例
    llm = OpenAI()
    
    # 简单的回答模板
    template = PromptTemplate(input_variables=["question"], template="Answer the following question: {question}")
    
    # 获取答案
    prompt = template.format(question=user_question)
    answer = llm(prompt)
    
    return JsonResponse({"answer": answer})