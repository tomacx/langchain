from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain.tools import tool

model = ChatOpenAI(
    model_name="deepseek-chat",
    api_key="sk-eed4bab55ab7417c856ceaeba950e282",
    base_url="https://api.deepseek.com"
)

@tool
def search(query: str) -> str:
    """
    搜索信息
    """
    return f"搜索到的关于'{query}'的信息是：这是一个示例搜索结果。"

@tool
def get_weather(location: str) -> str:
    """
    搜索信息
    """
    return f"当前{location}的天气是：晴，温度25度，湿度60%" 

agent = create_agent(
    model=model,
    tools=[search, get_weather],
)

response = agent.invoke(
    {"messages":[{"role":"user","content":"北京天气如何？"}]}
)

print(response)