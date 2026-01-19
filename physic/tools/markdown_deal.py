import os
import json
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_mistralai import MistralAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv(encoding='utf-8')

os.getenv("DEEPSEEK_API_KEY")
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
ROOT_DIR = "/Users/cxh/Codes/langchain/physic/docs/技术手册"

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

def main():
    # ================= 配置区域 =================
    # 1. 设置你的 API Key (如果在终端 export 过，这里可以注释掉)
    # os.environ["DEEPSEEK_API_KEY"] = "你的sk-xxxxxxxx"

    # 2. 设置要处理的目标根目录
    # 注意：根据你的截图，脚本似乎在 tools 文件夹下，而技术手册在上一级或同级
    # 建议填写绝对路径，或者根据相对位置调整，例如 "../技术手册"
    target_dir = "/Users/cxh/Codes/langchain/physic/docs/技术手册" 
    
    # 3. 设置中间结果保存路径
    output_json = "extracted_knowledge.json"
    # ===========================================

    # 检查目录是否存在
    if not os.path.exists(target_dir):
        print(f"❌ 错误: 找不到目录 {target_dir}")
        print("💡 建议: 请使用绝对路径，或者检查文件夹名称是否正确")
        return

    print(f"🚀 启动 Agent ETL 流程，目标目录: {target_dir}")
    print("⏳ 正在遍历并提取，这可能需要一些时间...")

    # --- 执行提取核心逻辑 ---
    # 调用你之前定义的 process_technical_manuals 函数
    knowledge_base = process_technical_manuals(target_dir)

    # --- 结果处理 ---
    if knowledge_base:
        count = len(knowledge_base)
        print(f"\n✅ 提取完成！共获取 {count} 个知识条目。")

        # 步骤 A: 保存为 JSON (中间态备份，非常重要！)
        try:
            with open(output_json, 'w', encoding='utf-8') as f:
                json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
            print(f"💾 中间数据已保存至: {os.path.abspath(output_json)}")
        except Exception as e:
            print(f"⚠️ 保存 JSON 失败: {e}")

        # 步骤 B: 存入向量库 (如果你已经准备好这一步)
        # print("📥 正在存入 ChromaDB 向量库...")
        # save_to_vectorstore(knowledge_base)
        # print("🎉 全部流程结束！")
        
    else:
        print("⚠️ 警告: 未提取到任何数据。请检查：")
        print("1. 目录下是否有 .md 文件")
        print("2. Agent 是否报错 (查看上方日志)")

if __name__ == "__main__":
    main()