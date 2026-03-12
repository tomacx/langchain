import os
import operator
from pathlib import Path
from typing import Annotated, List, TypedDict, Union

# 导入向量数据库
from langchain_chroma import Chroma

# 构建工具
from langchain_core.tools import tool
from langchain_core.tools import create_retriever_tool

# 引入需要用的模型
from langchain_ollama import ChatOllama, OllamaEmbeddings

# 引入必要消息组件
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

# 构建 Agent
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate

# 加载提示词
from prompt import agent_system

# 加载环境变量
from dotenv import load_dotenv
load_dotenv(encoding='utf-8')

class VectorStoreManager:
    """向量数据库管理器 (Chroma 版)"""
    @staticmethod
    def connect(persist_directory: str, collection_name: str):
        try:
            print(f"🔄 正在加载本地 Chroma 数据库: {persist_directory}")
            
            # 1. 初始化 Embedding 模型 (需与构建时一致)
            embeddings = OllamaEmbeddings(
                model="bge-m3:latest",
                base_url="http://localhost:11434"
            )

            # 2. 连接本地 Chroma
            # 注意：Chroma 不需要像 Milvus 那样建立 Socket 连接，它直接读取文件
            vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings,
                collection_name=collection_name
            )

            print("✅ 向量数据库加载成功")
            return vectorstore

        except Exception as e:
            print(f"❌ 加载向量数据库失败: {e}")
            raise

class ToolFactory:
    """工具构建工厂"""
    @staticmethod
    def create_physics_lookup_tool(vectorstore, k: int = 3):
        """
        构建知识库检索工具
        """
        # 使用最大边际相关性 (MMR) 搜索，保证结果的多样性
        retriever = vectorstore.as_retriever(
            search_type="mmr", 
            search_kwargs={
                "k": k, 
                "fetch_k": 10,  # 先获取10个候选
                "lambda_mult": 0.7 # 多样性因子
            }
        )

        return create_retriever_tool(
            retriever=retriever,
            name="search_physics_knowledge",
            description=(
                "【必须优先使用】用于搜索 CDEM 软件的技术手册、API 接口文档和完整脚本案例。"
                "编写脚本前，必须先调用此工具查找类似的现成案例。"
                "查询词应包含具体的技术点，例如 '冲击波反射案例' 或 '刚性面创建接口'。"
            )
        )
    
    # 搜索对应的物理知识
    # @tool
    # def search_physics_knowledge_tool("search", description="Performs arithmetic calculations. Use this for any math problems."):
       
    #    return
        

class AgentBuilder:
    """Agent 构建器"""
    def __init__(self, model_name: str = "llama3.1:latest"):
        self.llm = ChatOllama(
            model=model_name,
            temperature=0.1, # 降低温度以保证代码生成的准确性
            keep_alive="5m"
        )

    def _get_system_prompt(self) -> str:
        """定义系统提示词"""
        return agent_system.AGENT_SYSTEM_PROMTP2

    def build_executor(self, tools: List):
        """构建 LangGraph ReAct Agent"""
        system_prompt = self._get_system_prompt()
        
        # 构建智能体
        agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=system_prompt # 在这里传入 System Prompt
        )
        
        return agent

def main():
    # === 配置区域 ===
    # 这里的路径需要指向上一段代码生成的目录
    tools_root = Path(__file__).resolve().parent
    default_db_path = tools_root / "chroma_db" / "chroma_db_cdem"
    DB_PATH = os.environ.get("CDEM_DEMO_DB_PATH", str(default_db_path))
    COLLECTION_NAME = "cdem_knowledge" # 必须与构建时一致
    
    # 检查数据库目录
    if not os.path.exists(DB_PATH):
        print(f"⚠️ 错误：找不到数据库目录 {DB_PATH}")
        print("请确保您已经运行了上面的构建脚本 (build_cdem_db_windows.py)！")
        return

    try:
        # 1. 连接向量数据库
        vector_store = VectorStoreManager.connect(DB_PATH, COLLECTION_NAME)

        # 2. 创建工具
        physics_tool = ToolFactory.create_physics_lookup_tool(vector_store, k=4)
        tools_list = [physics_tool]

        # 3. 构建 Agent
        builder = AgentBuilder(model_name="llama3.1:latest")
        agent_executor = builder.build_executor(tools_list)

        # 4. 执行任务
        query = "请为我写一个冲击波爆炸在墙面处进行反射的脚本"
        print(f"\n🚀 任务开始：{query}\n")
        print("=" * 60)

        # 执行 Agent
        # stream 方法可以实时看到中间步骤（工具调用过程）
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=query)]},
            stream_mode="values"
        ):
            # 获取最新的一条消息并打印
            last_message = chunk["messages"][-1]
            
            if isinstance(last_message, AIMessage):
                # 区分是工具调用请求还是最终回答
                if last_message.tool_calls:
                    print(f"\n🛠️  AI 请求调用工具: {last_message.tool_calls[0]['name']}")
                    print(f"    参数: {last_message.tool_calls[0]['args']}")
                else:
                    # 最终回答
                    print("\n" + "=" * 60)
                    print("📝 AI 最终回复：")
                    print("=" * 60)
                    print(last_message.content)
            
            elif isinstance(last_message, BaseMessage) and last_message.type == "tool":
                 print(f"🔍 工具返回结果 (长度: {len(last_message.content)})")

    except Exception as e:
        print(f"\n❌ 程序运行出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
