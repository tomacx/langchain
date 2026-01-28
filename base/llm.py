from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model_name="deepseek-chat",
    api_key="sk-eed4bab55ab7417c856ceaeba950e282",
    base_url="https://api.deepseek.com"
)

response = llm.invoke("中国有几个省份？")

print(response)