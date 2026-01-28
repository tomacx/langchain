import streamlit as st
from langchain_community.callbacks import StreamlitCallbackHandler # 用于在前端展示思考过程

# ==========================================
# 1. 保持原有的导入不变
# ==========================================
from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings
from langchain_milvus import Milvus
from langchain_core.tools import tool
from langchain_core.tools import create_retriever_tool
from langchain.agents import create_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
import os
import operator
from typing import Annotated, List, TypedDict, Sequence, Union
from dotenv import load_dotenv

# 加载环境变量
load_dotenv(encoding='utf-8')

# ==========================================
# 2. 保持原有的类定义逻辑 (VectorStoreManager, ToolFactory, AgentBuilder)
# ==========================================

class VectorStoreManager:
    @staticmethod
    @st.cache_resource # 使用 Streamlit 缓存，避免每次交互都重连数据库
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

class ToolFactory:
    @staticmethod
    def create_physics_lookup_tool(vectorstore, k: int = 3):
        """
        构建知识库检索工具
        """
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": k, 
                "fetch_k": 10,
                "lambda_mult": 0.7
            }
        )

        return create_retriever_tool(
            retriever=retriever,
            name="search_physics_knowledge",
            description=(
                "【必须使用】专门用于搜索 CDEM 软件的技术手册、API 接口文档和完整脚本案例。"
                "当用户要求编写脚本、查询如何实现某功能（如导入DXF、划分网格）时，必须先调用此工具。"
                "查询词建议包含具体的任务描述，例如 '导入dxf文件并划分网格的脚本案例'。"
            )
        )

class AgentBuilder:
    def __init__(self, model_name: str = "llama3.1:latest"):
        self.llm = ChatOllama(
            model=model_name,
            # temperature=0.1
        )

    def _get_script_writer_prompt(self) -> ChatPromptTemplate:
        """
        定义专用的脚本 Prompt
        """
        # 使用 ChatPromptTemplate 构建更符合 Llama 3 格式的提示词
        return ChatPromptTemplate.from_messages([
            ("system", """你是一位精通 CDEM 仿真软件的 JavaScript 脚本编写专家。

### 严厉的执行指令 (CRITICAL INSTRUCTIONS)
1. **必须调用工具**：你**绝对不能**凭借记忆写代码。你必须**强制**先调用 `search_physics_knowledge` 工具搜索相关案例。
2. **禁止直接回答**：在没有看到工具返回的搜索结果之前，不要输出任何脚本代码。
3. **思考过程**：
   - 第一步：调用工具搜索关键词（如 "爆破应力波脚本"）。
   - 第二步：观察工具返回的文档内容。
   - 第三步：基于文档内容编写最终代码。

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

如果工具搜索不到内容，请直接回答“未找到相关资料”，不要编造。
"""),
            # 这里的 MessagesPlaceholder 是关键，它给 Agent 留出了“存放思考历史”的位置
            # 必须加上 optional=True，防止第一次运行时报错
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])

    def build_executor(self, tools: List):
        """构建并返回可执行的智能体"""
        prompt = self._get_script_writer_prompt()

        # 1. 使用 create_tool_calling_agent
        # 这是最适配 Llama 3 的方式，能极大提高工具调用的成功率
        from langchain_classic.agents import create_tool_calling_agent
        agent = create_tool_calling_agent(
            llm=self.llm,
            tools=tools,
            prompt=prompt
        )

        # 2. 构建 Executor
        # handle_parsing_errors=True: 防止模型输出格式错误导致崩溃
        from langchain_classic.agents import AgentExecutor
        return AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5 # 限制最大重试次数，防止死循环
        )

# ==========================================
# 3. Streamlit 前端交互界面
# ==========================================

def main():
    st.set_page_config(page_title="CDEM 智能脚本生成助手", page_icon="📒", layout="wide")
    
    st.title("CDEM 智能脚本助手")
    st.markdown("该助手会连接本地知识库，搜索 API 文档和案例，为您编写 CDEM 脚本。")

    # --- 侧边栏设置 ---
    with st.sidebar:
        st.header("🗄️ 数据库设置")
        # 默认使用你代码中的路径，但也允许在界面修改
        default_path = "/Users/cxh/Codes/langchain/physic/tools/vector_store/cdem_knowledge_db.db"
        db_path = st.text_input("DB 文件路径", value=default_path)
        collection_name = st.text_input("集合名称", value="cdem_unified_knowledge")
        
        st.divider()
        st.caption("Model: Llama 3.1 | Knowledge Base: Milvus Lite")

    # --- 初始化 Session State (聊天记录) ---
    if "messages" not in st.session_state:
        st.session_state["messages"] = [
            {"role": "assistant", "content": "你好！我是 CDEM 脚本助手。请告诉我你想模拟什么场景？（例如：爆破应力波传播、单轴压缩试验等）"}
        ]

    # --- 展示历史聊天记录 ---
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # --- 处理用户输入 ---
    if user_input := st.chat_input("请输入您的需求..."):
        
        # 1. 立即上屏用户消息
        st.session_state.messages.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.markdown(user_input)

        # 2. 检查数据库文件
        if not os.path.exists(db_path):
            st.error(f"❌ 错误：找不到数据库文件 {db_path}")
            st.stop()

        # 3. 智能体响应
        with st.chat_message("assistant"):
            try:
                # --- 连接资源 (使用你的类逻辑) ---
                # 使用 st.spinner 给用户反馈
                with st.spinner("正在连接知识库并构建智能体..."):
                    vector_store = VectorStoreManager.connect(db_path, collection_name)
                    physics_tool = ToolFactory.create_physics_lookup_tool(vector_store, k=3)
                    tools_list = [physics_tool]
                    
                    builder = AgentBuilder(model_name="llama3.1:latest")
                    generator_agent = builder.build_executor(tools_list)

                # --- 核心：展示思考过程 ---
                # StreamlitCallbackHandler 会自动渲染 Agent 的 Actions, Observations
                st_callback = StreamlitCallbackHandler(st.container())
                
                # --- 执行 Agent ---
                # 注意：这里我们注入 callbacks 来实现前端可视化
                # 你的 invoke 逻辑保持不变: {"messages": ...}
                chat_history = []
                for msg in st.session_state.messages[:-1]: # 不包含当前最新的一条
                    if msg["role"] == "user":
                        chat_history.append(HumanMessage(content=msg["content"]))
                    elif msg["role"] == "assistant":
                        chat_history.append(AIMessage(content=msg["content"]))

                # ✅ 修正：key 必须是 "input"，与 Prompt 中的 {input} 对应
                response = generator_agent.invoke(
                    {
                        "input": user_input,         # 对应 Prompt 中的 {input}
                        "chat_history": chat_history # 对应 Prompt 中的 {chat_history}
                    },
                    config={"callbacks": [st_callback]} 
                )
                
                # --- 解析结果 (保持你的解析逻辑) ---
                output_content = response.get("output", "⚠️ 模型未返回有效内容 (KeyError: output)")
                
                # 如果有时候内容藏在 return_values 里 (旧版兼容)
                if not output_content and "return_values" in response:
                     output_content = response["return_values"].get("output")

                # 显示最终结果
                st.markdown(output_content)
                
                # 保存到历史记录
                st.session_state.messages.append({"role": "assistant", "content": output_content})

            except Exception as e:
                st.error(f"运行出错: {str(e)}")
                # 打印详细错误方便调试
                import traceback
                st.code(traceback.format_exc())

if __name__ == "__main__":
    main()