# 导入需要用的模型
from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings

# 导入向量库
from langchain_milvus import Milvus

# 构建工具 - 使用新版本的导入
from langchain_core.tools import tool
from langchain_core.tools import create_retriever_tool

# 构建 Agent
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

import os
from typing import List

# 导入 LangSmith 查看过程
from dotenv import load_dotenv
# 加载 .env 文件中的环境变量
load_dotenv(encoding='utf-8')
os.getenv("LANGCHAIN_TRACING_V2")
os.getenv("LANGCHAIN_ENDPOINT")
os.getenv("LANGCHAIN_PROJECT")
os.getenv("LANGCHAIN_API_KEY")

# 连接向量数据库
class VectorStoreManager:
    @staticmethod
    def connect(path: str, collection_name: str):
        try:
            embeddings = OllamaEmbeddings(
                model="bge-m3:latest",
                base_url="http://localhost:11434"
            )

            vectorstore = Milvus(
                embedding_function=embeddings,
                collection_name=collection_name,
                connection_args={"uri": path},
                vector_field="embedding",
                text_field="content",
                auto_id=True
            )

            print("✅ 连接向量数据库成功")
            return vectorstore

        except Exception as e:
            print(f"❌ 连接向量数据库失败: {e}")
            raise


# 工具构建
class ToolFactory:
    @staticmethod
    def create_physics_lookup_tool(vectorstore, k: int = 5):
        """
        构建知识库检索工具
        使用 LangChain v1.0+ 的 create_retriever_tool 方法
        """
        # 将 VectorStore 转换为 Retriever 接口
        # retriever = vectorstore.as_retriever(
        #     search_type="similarity",
        #     search_kwargs={"k": k}
        # )

        retriever = vectorstore.as_retriever(
            search_type="similarity", # 使用最大边际相关性算法，防止搜索结果太雷同
            search_kwargs={
                "k": k, 
                "fetch_k": 10, # 先取10个再筛选出最不同的5个
                "lambda_mult": 0.7
            }
        )

        # 使用 create_retriever_tool 创建标准检索工具
        return create_retriever_tool(
            retriever=retriever,
            name="search_physics_knowledge",
            description=(
                "【必须使用】专门用于搜索 CDEM 软件的技术手册、API 接口文档和完整脚本案例。"
                "当用户要求编写脚本、查询如何实现某功能（如导入DXF、划分网格）时，必须先调用此工具。"
                "查询词建议包含具体的任务描述，例如 '导入dxf文件并划分网格的脚本案例'。"
            )
        )


# 构建智能体
class AgentBuilder:
    def __init__(self, model_name: str = "llama3.1:latest"):
        self.llm = ChatOllama(
            model=model_name,
            temperature=0.1
        )

    def _get_script_writer_prompt(self) -> ChatPromptTemplate:
        """
        定义专用的脚本作家 Prompt
        使用 ChatPromptTemplate 替代旧的 PromptTemplate
        """
        system_prompt = """你是一位精通 CDEM 仿真软件的 JavaScript 脚本编写专家。

### 核心职责
根据用户的需求，搜索知识库中的**完整案例**和**API文档**，编写可执行的 CDEM 脚本。

### 必须遵守的编程规范 (System Rules)
1. **全局对象**：必须使用系统预置对象 `igeo` (几何), `imeshing` (网格), `blkdyn` (计算)。
2. **起手式**：脚本第一行通常是 `setCurDir(getSrcDir());`。
3. **坐标定义**：坐标点必须定义为数组格式，例如 `var coords = [[0,0,0,0.1], ...];`。
4. **严禁瞎编**：如果检索不到对应的 API，请直接告诉用户“知识库中未找到相关接口”，绝对不要凭空捏造函数名。
5. **优先参考案例**：如果你在检索结果中看到了 "Source: case_workflow" 或 "任务意图" 等内容，请优先模仿该案例的代码结构。

### 输出要求
- 先解释你的思路。
- 输出完整的 JavaScript 代码块。
- 代码中必须包含注释。
"""

        return system_prompt

    def build_executor(self, tools: List):
        """构建并返回可执行的智能体"""
        system_prompt = self._get_script_writer_prompt()

        # 构建智能体
        agent = create_agent(
            model=self.llm,
            tools=tools,
            system_prompt=system_prompt
        )

        # 封装为 Executor，加入容错和日志
        return agent


def main():
    """主函数"""
    db_path = "/Users/cxh/Codes/langchain/physic/tools/vector_store/cdem_knowledge_db.db"
    collection_name = "cdem_unified_knowledge"

    # 检查数据库文件是否存在
    if not os.path.exists(db_path):
        print(f"⚠️  注意：数据库文件 {db_path} 不存在。")
        print("请先创建向量数据库再运行此程序。")
        return

    try:
        # 1. 连接向量数据库
        vector_store = VectorStoreManager.connect(db_path, collection_name)

        # 2. 创建检索工具
        physics_tool = ToolFactory.create_physics_lookup_tool(vector_store, k=3)
        tools_list = [physics_tool]

        # 3. 构建 Agent
        builder = AgentBuilder(model_name="llama3.1:latest")
        agent_executor = builder.build_executor(tools_list)

        # 4. 执行任务
        query = "请为我写一个SuperCDEM中的爆破应力波传播的脚本"
        print(f"\n🚀 任务开始：{query}\n")
        print("=" * 60)

        # 使用 invoke 方法执行
        result = agent_executor.invoke({
            "messages": [{"role": "user", "content": query}]
        })

        # 5. 输出结果
        print("\n" + "=" * 60)
        print("📝 最终脚本产出：")
        print("=" * 60)
        if "messages" in result:
            last_message = result["messages"][-1]
            if hasattr(last_message, "content"):
                print(last_message.content)
            else:
                print(last_message)
        else:
            print(result)

        print("=" * 60)

    except Exception as e:
        print(f"\n❌ 程序运行出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()