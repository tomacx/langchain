# from langchain_deepseek import ChatDeepSeek

from dotenv import load_dotenv
import os 

load_dotenv(encoding='utf-8')
os.getenv("DEEPSEEK_API_KEY")

# model = ChatDeepSeek(
#     model_name="deepseek-chat",
#     temperature=0.1,
#     max_tokens=2000,
#     timeout=None,
#     max_retries=2,
# )

from langchain.chat_models import init_chat_model

model = init_chat_model(
    model="deepseek:deepseek-chat",
    # model_provider="deepseek",
    temperature=0.1,
)

for chunk in model.stream("再来一段唐诗"):
    print(chunk.content, end='', flush=True)