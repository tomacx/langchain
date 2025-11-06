# LangChain实现
from langchain.prompts.chat import ChatPromptTemplate
# 运行测试
import os
from langchain_openai import OpenAI

# # 读取本地/项目的环境变量。
# # find_dotenv()寻找并定位.env文件的路径
# # load_dotenv()读取该.env文件，并将其中的环境变量加载到当前的运行环境中  
# _ = load_dotenv(find_dotenv()); # 如果环境变量是全局的，这行代码可以省略

import getpass
import os

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
    
# 实例化一个ChatMistralAI类：然后设置其Mistral API_KEY；
llm = OpenAI()
print(llm)

# system prompt template
template = "你当前是一个翻译助手，请将 {input_language} 翻译成 {output_language}."

human_template = "翻译内容：{text}"

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", human_template),
])

text = "Babylon是一个开源的JavaScript解析器和代码转换工具，用于分析和转换JavaScript代码。"
messages  = chat_prompt.format_messages(input_language="中文", output_language="英文", text=text)
print(messages)
print("---------")
print(messages[0].content)

# 做一个输出
output = llm.invoke(messages)
print(output.content) # 其返回结果也是一个Message对象
