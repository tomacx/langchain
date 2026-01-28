from langchain.chat_models import init_chat_model

model = init_chat_model(
    model="ollama:deepseek-r1:32b",
    base_url="http://localhost:11434",
    temperature=0.1,
)

for chunk in model.stream("来一段唐诗"):
    print(chunk.content, end='', flush=True)