from langchain.agents import create_agent
import os
from dotenv import load_dotenv
# 加载 .env 文件中的环境变量
load_dotenv(encoding='utf-8')

os.getenv("DEEPSEEK_API_KEY")
os.getenv("LANGCHAIN_TRACING_V2")
os.getenv("LANGCHAIN_ENDPOINT")
os.getenv("LANGCHAIN_PROJECT")
os.getenv("LANGCHAIN_API_KEY")

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"


agent = create_agent(
    model="deepseek-chat",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "What is the weather in Shanghai?"}]}
)