import streamlit as st
import os
import sys
from pathlib import Path
import traceback

# ==========================================
# 路径配置与核心模块导入
# ==========================================
# 将项目根目录加入 sys.path 以便导入 agent.py
current_dir = Path(__file__).resolve().parent
project_root = current_dir.parents[1]  # 指向 d:\Codes\langchain
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

try:
    from physic.tools.agents.agent import (
        VectorKnowledgeBaseModule,
        ToolConstructionModule,
        AgentConstructionModule
    )
except ImportError as e:
    st.error(f"导入核心 Agent 模块失败: {e}\n请确保项目路径配置正确。")
    st.stop()

# ==========================================
# 1. 缓存初始化智能体
# ==========================================
@st.cache_resource
def init_agent(db_path: str, collection_name: str, model_name: str, enable_preprocessing: bool):
    try:
        vector_module = VectorKnowledgeBaseModule.connect(db_path, collection_name=collection_name)
        tool_module = ToolConstructionModule(model_name=model_name)
        physics_tool = tool_module.build_physics_search_tool(vector_module)
        
        agent_module = AgentConstructionModule(
            tools=[physics_tool],
            model_name=model_name,
            enable_preprocessing=enable_preprocessing,
            vectorstore=vector_module,
        )
        return agent_module
    except Exception as e:
        st.error(f"❌ 智能体初始化失败: {e}")
        return None

# ==========================================
# 2. 前端界面与交互
# ==========================================
def main():
    st.set_page_config(page_title="CDEM 智能脚本生成助手", page_icon="🤖", layout="wide")
    
    # --- 侧边栏配置 ---
    with st.sidebar:
        st.header("⚙️ 引擎配置")
        
        # 默认路径计算
        default_db_path = str(project_root / "physic" / "tools" / "js_store" / "new_db_cdem")
        
        db_path = st.text_input("向量库路径 (Chroma)", value=default_db_path)
        collection_name = st.text_input("集合名称", value="new_db_cdem")
        model_name = st.selectbox("选择模型", ["qwen3.5-flash", "qwen-max", "qwen2.5-coder", "llama3.1:latest"], index=0)
        enable_preproc = st.toggle("启用预处理 (任务拆解)", value=True)
        
        st.divider()
        st.header("🎨 界面配置")
        user_msg_bg_color = st.color_picker("用户消息背景色", "#ffffff")
        assistant_msg_bg_color = st.color_picker("助手消息背景色", "#ffffff")
        
        st.divider()
        st.caption("核心架构: AgentConstructionModule")
        st.caption("向量引擎: Chroma DB")

    # 注入自定义 CSS 以美化页面风格
    st.markdown(f"""
    <style>
        /* 整体背景与字体 */
        .stApp {{
            background-color: #f8fafc;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }}
        /* 侧边栏 */
        [data-testid="stSidebar"] {{
            background-color: #1e293b;
        }}
        [data-testid="stSidebar"] * {{
            color: #f1f5f9 !important;
        }}
        /* 主标题 */
        h1 {{
            color: #0f172a;
            font-weight: 700;
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 30px;
        }}
        /* 聊天消息气泡样式 */
        .stChatMessage {{
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }}
        /* 助手消息背景 */
        [data-testid="stChatMessage"]:nth-child(even) {{
            background-color: {assistant_msg_bg_color};
        }}
        /* 用户消息高亮 */
        [data-testid="stChatMessage"]:nth-child(odd) {{
            background-color: {user_msg_bg_color};
        }}
        /* 输入框提示 */
        .stChatInputContainer textarea {{
            border-radius: 20px;
            border: 1px solid #cbd5e1;
        }}
        /* Expander 标题 */
        .streamlit-expanderHeader {{
            font-weight: 600;
            color: #334155;
        }}
        /* 按钮美化 */
        .stButton>button {{
            border-radius: 8px;
            transition: all 0.3s;
        }}
        .stButton>button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
    </style>
    """, unsafe_allow_html=True)
    
    st.title("🤖 CDEM 智能脚本生成助手")

    # --- 初始化会话状态 ---
    if "messages" not in st.session_state:
        st.session_state["messages"] = [
            {"role": "assistant", "content": "您好！我是全新的 CDEM 脚本助手。请描述您的仿真需求（如：建立一个 10x10 的二维模型并划分网格）。", "metrics": None}
        ]

    # --- 渲染历史消息 ---
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            # 如果有指标数据，则展示
            if msg.get("metrics"):
                with st.expander("📊 生成详情"):
                    metrics = msg["metrics"]
                    st.write(f"- **生成耗时**: {metrics.get('duration_s', 0)} 秒")
                    st.write(f"- **检索文档数**: {metrics.get('retrieved_docs_count', 0)}")
                    if metrics.get("task_steps"):
                        st.write("**任务拆解步骤:**")
                        for i, step in enumerate(metrics["task_steps"], 1):
                            st.write(f"  {i}. {step}")

    # --- 处理用户输入 ---
    if user_input := st.chat_input("请输入您的需求..."):
        st.session_state.messages.append({"role": "user", "content": user_input, "metrics": None})
        with st.chat_message("user"):
            st.markdown(user_input)

        # --- 助手响应 ---
        with st.chat_message("assistant"):
            agent_module = init_agent(db_path, collection_name, model_name, enable_preproc)
            if not agent_module:
                st.stop()
                
            with st.status("🧠 智能体正在思考并生成脚本...", expanded=True) as status:
                st.write("1. 解析用户需求并检索知识库...")
                try:
                    # 调用新版 agent.py 中的生成逻辑，关闭 verbose 以隐藏内部重试过程
                    generated_code, gen_time, retrieved_count = agent_module.generate_code(user_input, verbose=False)
                    metrics = getattr(agent_module, "last_run_metrics", {})
                    
                    st.write("2. 代码生成完毕。")
                    status.update(label="✅ 脚本生成完成", state="complete", expanded=False)
                except Exception as e:
                    status.update(label="❌ 生成出错", state="error")
                    st.error(f"运行出错: {str(e)}")
                    st.code(traceback.format_exc())
                    st.stop()

            # --- 组装并展示最终结果 ---
            if generated_code:
                output_content = f"```javascript\n{generated_code}\n```"
            else:
                output_content = "⚠️ 未能生成有效代码，请重试或补充更多提示细节。"
            
            st.markdown("### 生成的脚本")
            st.markdown(output_content)
            
            # 展示指标
            if metrics:
                with st.expander("📊 生成详情", expanded=False):
                    st.write(f"- **生成耗时**: {metrics.get('duration_s', 0)} 秒")
                    st.write(f"- **检索文档数**: {metrics.get('retrieved_docs_count', 0)}")
                    if metrics.get("task_steps"):
                        st.write("**任务拆解步骤:**")
                        for i, step in enumerate(metrics["task_steps"], 1):
                            st.write(f"  {i}. {step}")

            # 保存助手消息
            st.session_state.messages.append({
                "role": "assistant", 
                "content": f"### 生成的脚本\n{output_content}", 
                "metrics": metrics
            })

if __name__ == "__main__":
    main()
