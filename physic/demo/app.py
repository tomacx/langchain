import streamlit as st
import os
import sys
from pathlib import Path
import traceback
import json

# ==========================================
# 路径配置与核心模块导入
# ==========================================
current_dir = Path(__file__).resolve().parent
project_root = current_dir.parents[1]
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
    st.set_page_config(page_title="CDEM 统一交互平台", page_icon="🤖", layout="wide")
    
    # --- 侧边栏配置 ---
    with st.sidebar:
        st.header("⚙️ 引擎配置")
        default_db_path = str(project_root / "physic" / "tools" / "js_store" / "new_db_cdem")
        
        db_path = st.text_input("向量库路径 (Chroma)", value=default_db_path)
        collection_name = st.text_input("集合名称", value="new_db_cdem")
        model_name = st.selectbox("选择模型", ["qwen3.5-flash", "qwen-max", "qwen2.5-coder", "llama3.1:latest"], index=0)
        enable_preproc = st.toggle("启用预处理 (任务拆解)", value=True)
        
        st.divider()
        st.caption("核心架构: 多智能体协同")
        st.caption("上下文记忆: 双路滑动窗口与向量存储")

    st.title("🤖 CDEM 软件多智能体统一交互平台")

    # 获取 Agent
    agent_module = init_agent(db_path, collection_name, model_name, enable_preproc)
    if not agent_module:
        st.stop()

    # 初始化会话状态
    if "messages" not in st.session_state:
        st.session_state["messages"] = [
            {"role": "assistant", "content": "您好！我是 CDEM 多智能体助手。请问需要生成脚本、检索知识还是运行仿真？", "metrics": None}
        ]
    if "current_script" not in st.session_state:
        st.session_state["current_script"] = "// 在此处编辑或由智能体生成 CDEM 脚本\n"
    if "simulation_logs" not in st.session_state:
        st.session_state["simulation_logs"] = []

    # 三大核心功能模块 Tab
    tab1, tab2, tab3 = st.tabs(["💻 脚本生成模块", "📚 CDEM软件问答模块", "🚀 脚本仿真测试模块"])

    # ==========================
    # Tab 1: 脚本生成模块
    # ==========================
    with tab1:
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("💬 需求对话")
            chat_container = st.container(height=500)
            with chat_container:
                for msg in st.session_state.messages:
                    with st.chat_message(msg["role"]):
                        st.markdown(msg["content"])
                        if msg.get("metrics"):
                            with st.expander("📊 生成详情"):
                                metrics = msg["metrics"]
                                st.write(f"- **生成耗时**: {metrics.get('duration_s', 0)} 秒")
                                st.write(f"- **检索文档数**: {metrics.get('retrieved_docs_count', 0)}")
                                wf = metrics.get("workflow") or {}
                                if wf:
                                    st.write(f"- **工作流选择**: {wf.get('selected', '')} (score={wf.get('score', '')})")
                                    if wf.get("issue_tags") is not None:
                                        st.write(f"- **失败信号**: {wf.get('issue_tags')}")
                                    if wf.get("tool_names") is not None:
                                        st.write(f"- **工具集合**: {wf.get('tool_names')}")
                                    if wf.get("candidates"):
                                        st.write("**候选对比:**")
                                        st.json(wf.get("candidates"))
                                    if wf.get("trace"):
                                        st.write("**优化迭代轨迹:**")
                                        st.json(wf.get("trace"))
            
            if user_input := st.chat_input("描述仿真需求 (如: 建立10x10的二维模型)..."):
                st.session_state.messages.append({"role": "user", "content": user_input, "metrics": None})
                with chat_container:
                    with st.chat_message("user"):
                        st.markdown(user_input)
                    with st.chat_message("assistant"):
                        with st.status("🧠 智能体规划与生成中...", expanded=True) as status:
                            st.write("1. 检索长时上下文与知识库...")
                            try:
                                generated_code, gen_time, retrieved_count = agent_module.generate_code(user_input, verbose=False)
                                metrics = getattr(agent_module, "last_run_metrics", {})
                                status.update(label="✅ 脚本生成完成", state="complete", expanded=False)
                                
                                if generated_code:
                                    st.session_state["current_script"] = generated_code
                                    output_content = f"已生成脚本，耗时 {gen_time:.1f}s，请在右侧编辑器查看与修改。"
                                else:
                                    output_content = "⚠️ 未能生成有效代码，请重试。"
                                    
                                st.markdown(output_content)
                                st.session_state.messages.append({
                                    "role": "assistant", 
                                    "content": output_content, 
                                    "metrics": metrics
                                })
                                st.rerun()
                            except Exception as e:
                                status.update(label="❌ 生成出错", state="error")
                                st.error(f"运行出错: {str(e)}")

        with col2:
            st.subheader("📝 可视化脚本编辑器")
            # 模拟模板库
            template_choice = st.selectbox("选择模板片段插入", ["-- 无 --", "标准2D模型初始化", "施加重力场", "网格划分"])
            if template_choice == "标准2D模型初始化":
                st.session_state["current_script"] += "\nsetCurDir(getSrcDir());\nSolve('2D', 'model_name');"
            elif template_choice == "施加重力场":
                st.session_state["current_script"] += "\nsetGravity(0, -9.8, 0);"
            
            # 编辑器
            edited_script = st.text_area("JavaScript Code", value=st.session_state["current_script"], height=450, key="editor")
            if edited_script != st.session_state["current_script"]:
                st.session_state["current_script"] = edited_script

            if st.button("同步至仿真测试台", type="primary"):
                st.success("已同步！请前往【🚀 脚本仿真测试模块】运行。")

    # ==========================
    # Tab 2: CDEM软件问答模块
    # ==========================
    with tab2:
        st.subheader("📚 知识图谱与技术文档问答")
        qa_input = st.text_input("请输入您对 CDEM 软件的疑问或 API 查询：")
        if st.button("查询文档"):
            if qa_input:
                with st.spinner("检索向量库中..."):
                    try:
                        # 直接调用底层检索或通过 agent 生成回答
                        docs = agent_module.vectorstore.similarity_search(qa_input, k=4)
                        if docs:
                            st.success(f"找到 {len(docs)} 条相关结果：")
                            for i, doc in enumerate(docs):
                                with st.expander(f"📄 结果 {i+1} (来源: {doc.metadata.get('source', '未知')})"):
                                    st.markdown(f"```javascript\n{doc.page_content}\n```")
                            
                            # 结果导出模拟
                            export_data = json.dumps([d.page_content for d in docs], ensure_ascii=False, indent=2)
                            st.download_button(label="📥 导出检索结果 (JSON)", data=export_data, file_name="cdem_qa_results.json", mime="application/json")
                        else:
                            st.info("未找到强相关文档。")
                    except Exception as e:
                        st.error(f"检索失败: {e}")

    # ==========================
    # Tab 3: 脚本仿真测试模块
    # ==========================
    with tab3:
        st.subheader("🚀 在线仿真控制台")
        col_run1, col_run2 = st.columns([2, 1])
        
        with col_run1:
            st.markdown("**待运行脚本预览**")
            st.code(st.session_state["current_script"], language="javascript")
            if st.button("▶️ 一键运行仿真 (Mock)"):
                st.session_state["simulation_logs"].append(">>> 开始初始化 CDEM 仿真环境...")
                st.session_state["simulation_logs"].append(">>> 加载脚本内容成功...")
                st.session_state["simulation_logs"].append(">>> 语法检查通过，开始执行...")
                
                # 简单模拟错误定位
                if "error" in st.session_state["current_script"].lower():
                    st.session_state["simulation_logs"].append("❌ [Error] 发现语法错误：未定义的标识符 'error'")
                else:
                    st.session_state["simulation_logs"].append("✅ [Success] 网格划分完成: 1200 nodes, 1050 elements")
                    st.session_state["simulation_logs"].append("✅ [Success] 仿真步进计算结束。耗时: 1.2s")
                    
                st.session_state["simulation_logs"].append(">>> 仿真任务结束。")
                
                # 存入上下文记忆
                if getattr(agent_module, "memory_manager", None):
                    agent_module.memory_manager.add_simulation_summary(
                        result="Simulation completed successfully" if "error" not in st.session_state["current_script"].lower() else "Simulation failed with errors",
                        metrics={"nodes": 1200, "elements": 1050, "time_s": 1.2}
                    )
        
        with col_run2:
            st.markdown("**实时日志输出**")
            log_box = st.container(height=300)
            with log_box:
                for log in st.session_state["simulation_logs"]:
                    if "Error" in log:
                        st.error(log)
                    elif "Success" in log:
                        st.success(log)
                    else:
                        st.text(log)
            
            if st.button("🗑️ 清空日志"):
                st.session_state["simulation_logs"] = []
                st.rerun()
                
            st.markdown("**性能指标可视化 (Mock)**")
            if "Success" in "".join(st.session_state["simulation_logs"]):
                st.progress(100, text="仿真进度")
                st.metric(label="最大内存占用", value="245 MB", delta="12 MB")
                st.metric(label="计算耗时", value="1.2 s", delta="-0.3 s")

if __name__ == "__main__":
    main()
