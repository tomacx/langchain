import os
import json
from typing import List, Optional
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings
from langchain_core.documents import Document

os.getenv("MISTRAL_API_KEY")

SYSTEM_PROMPT = """
    你是一个 CDEM 仿真软件的技术文档分析专家。
    你的任务是从 Markdown 文档中提取标准的 API 接口定义。

    文档结构通常包含：
    1. 接口功能描述
    2. 参数列表（通常在表格中）
    3. 返回值说明

    请注意：
    - 如果参数在表格中，请准确提取类型和说明。
    - 必须根据文件路径上下文判断所属软件（CDyna, GFlow 等）。
"""

# Step1:定义知识的结构
# 定义参数结构
class FunctionParameter(BaseModel):
    name: str = Field(description="参数名，如'stiffness'")
    type: str = Field(description="参数类型，如'float'")
    description: str = Field(description="参数说明")
    required: bool = Field(description="是否必需")


# 定义函数/接口结构
class APITool(BaseModel):
    tool_name: str = Field(description="函数/接口名称，如'cdem.create_bar'")
    summary: str = Field(description="功能简介")
    parameters: List[FunctionParameter] = Field(description="参数列表")
    related_software: str = Field(description="所属软件名称，如'CDyna','GFlow'")
    source_file: str = Field(description="来源文件名")

# 定义Agent提取目标
class ExtractionResult(BaseModel):
    tools: List[APITool]

# Step2:定义Agent

# 初始化模型
llm = init_chat_model(
    model="deepseek-chat",
    temperature=0.5,
    timeout=1000,
    max_tokens=2048
)

structured_llm = llm.with_structured_output(ExtractionResult)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "所属软件：{software}\n文件名：{filename}\n\n文档内容：\n{content}")
])

# 创建处理链
extractor_chain = prompt_template | structured_llm

# Step3:遍历目录并处理
# 目录
ROOT_DIR = "D:/Codes/langchain/physic/docs/技术手册"

def process_technical_manuals(root_dir):
    knowledge_base = []   # 临时存储，后续存入向量库

    # os.walk 遍历目录树
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 1.从路径中解析meta data
        # 例如 dirpath = "./技术手册/CDyna软件"
        path_parts = dirpath.split(os.sep)

        # 简单判断：如果名字包含 "软件" 或者 "模块"，提取出来作为标签
        software_context = "Unknown"
        for part in path_parts:
            if "软件" in part or "模块" in part:
                software_context = part.replace("软件", "").replace("模块", "")
                
        for file in filenames:
            if file.endswith(".md"):
                full_path = os.path.join(dirpath, file)
                print(f"正在由 Agent 处理: [{software_context}] {file} ...")

                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 2. 调用 Agent 进行提取
                    result = extractor_chain.invoke({
                        "software": software_context,
                        "filename": file,
                        "content": content
                    })
                    
                    # 3. 增强元数据并存储
                    for tool in result.tools:
                        tool_record = tool.dict()
                        tool_record['file_path'] = full_path # 记录绝对路径，方便回溯
                        knowledge_base.append(tool_record)
                        
                        # 这里可以打印一下看看效果
                        print(f"  -> 提取成功: {tool.tool_name} (参数数量: {len(tool.parameters)})")
                        
                except Exception as e:
                    print(f"  [Error] 处理文件 {file} 失败: {e}")
                    # 在这里可以将失败的文件记录到 "error_log.txt"，用于后续回溯优化
    return knowledge_base

# 执行处理
# extracted_data = process_technical_manuals(ROOT_DIR)

# Step4:构建向量库与回溯机制
def save_to_vectorstore(data_list):
    docs = []
    for item in data_list:
        # 将结构化数据序列化为文本，作为向量化的内容
        # 这样检索时，搜 "创建刚性面" 就能搜到这个 JSON
        page_content = f"函数名: {item['tool_name']}\n功能: {item['summary']}\n参数: {item['parameters']}"
        
        # 关键：构建丰富的 Metadata 用于过滤和回溯
        metadata = {
            "source": item['source_file'],
            "software": item['related_software'],
            "tool_name": item['tool_name'],
            "type": "api_definition" 
        }
        
        docs.append(Document(page_content=page_content, metadata=metadata))
    
    # 存入 Chroma
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=MistralAIEmbeddings(model="mistral-embed"),
        collection_name="cdem_technical_manual",
        persist_directory="./cdem_db"
    )
    print("知识库构建完成！")
    return vectorstore