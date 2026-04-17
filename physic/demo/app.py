import streamlit as st
import sys
from pathlib import Path
import json
from typing import Any, List, Tuple

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

def answer_question_with_rag(
    agent_module: Any,
    question: str,
    *,
    k: int = 4,
) -> Tuple[str, List[Any]]:
    question = (question or "").strip()
    if not question:
        return "请输入问题。", []

    docs: List[Any] = []
    try:
        docs = agent_module.vectorstore.similarity_search(question, k=k)
    except Exception:
        docs = []

    def _doc_to_text(d: Any) -> str:
        source = ""
        try:
            source = (d.metadata or {}).get("source", "") or ""
        except Exception:
            source = ""
        content = (getattr(d, "page_content", "") or "").strip()
        if source:
            return f"[source: {source}]\n{content}"
        return content

    context = "\n\n---\n\n".join([_doc_to_text(d) for d in docs]).strip()

    system_prompt = (
        "你是 CDEM 软件助手，负责基于检索到的资料回答用户问题。\n"
        "规则：\n"
        "1) 优先引用资料内容，不要臆造 API 或参数。\n"
        "2) 若资料不足以回答，请明确说明“资料不足/未检索到”，并给出建议的检索关键词。\n"
        "3) 回答用中文，尽量简洁、可操作。\n"
    )
    user_prompt = f"【用户问题】\n{question}\n\n【检索资料】\n{context if context else '(空)'}\n"

    try:
        from langchain_core.messages import HumanMessage, SystemMessage

        resp = agent_module.llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
        answer = (getattr(resp, "content", "") or "").strip()
        return (answer or "未能生成回答。"), docs
    except Exception:
        try:
            resp = agent_module.llm.invoke(system_prompt + "\n\n" + user_prompt)
            answer = (getattr(resp, "content", "") or str(resp) or "").strip()
            return (answer or "未能生成回答。"), docs
        except Exception as e:
            return f"回答生成失败：{e}", docs

def answer_small_talk(agent_module: Any, text: str) -> str:
    text = (text or "").strip()
    if not text:
        return "请输入聊天内容。"
    system_prompt = (
        "你是一个友好、礼貌的中文聊天助手，可以和用户进行日常闲聊、讨论想法或简单问题。\n"
        "用户如果提到 CDEM 或仿真相关内容，可以结合你的专业知识给出简洁解释；"
        "如果不确定，就如实说明自己不确定，并用轻松的方式继续对话。\n"
        "保持回答简洁自然，不需要输出列表或标题，像正常人聊天一样。"
    )
    try:
        from langchain_core.messages import HumanMessage, SystemMessage

        resp = agent_module.llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=text)])
        answer = (getattr(resp, "content", "") or "").strip()
        return answer or "我一时不知道该怎么回答，可以换个话题聊聊。"
    except Exception:
        try:
            resp = agent_module.llm.invoke(system_prompt + "\n\n用户：" + text)
            answer = (getattr(resp, "content", "") or str(resp) or "").strip()
            return answer or "我一时不知道该怎么回答，可以换个话题聊聊。"
        except Exception as e:
            return f"聊天失败：{e}"

def build_script_generation_query(
    task: str,
    *,
    current_script: str,
    messages: List[dict],
    simulation_logs: List[str],
    feedback: str = "",
    inject_context: bool = True,
) -> str:
    task = (task or "").strip()
    if not inject_context:
        return task

    parts: List[str] = []
    if task:
        parts.append(f"【本次任务】\n{task}")
    fb = (feedback or "").strip()
    if fb:
        parts.append(f"【改进反馈】\n{fb}")

    script = (current_script or "").strip()
    if script and "在此处编辑或由智能体生成" not in script:
        parts.append(f"【当前脚本（请在此基础上修改完善）】\n```javascript\n{script}\n```")

    recent_msgs = []
    for m in (messages or [])[-10:]:
        role = (m.get("role") or "").strip()
        content = (m.get("content") or "").strip()
        if not role or not content:
            continue
        if role not in {"user", "assistant"}:
            continue
        recent_msgs.append(f"{role}: {content}")
    if recent_msgs:
        parts.append("【最近对话上下文】\n" + "\n".join(recent_msgs))

    logs = [str(x) for x in (simulation_logs or []) if str(x).strip()]
    if logs:
        tail = "\n".join(logs[-30:])
        parts.append(f"【最近仿真/运行日志（如有报错请优先修复）】\n{tail}")

    return "\n\n".join(parts).strip()

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
    st.set_page_config(page_title="CDEM小助手", page_icon="🤖", layout="wide")
    
    # --- 侧边栏配置 ---
    with st.sidebar:
        st.header("⚙️ 引擎配置")
        default_db_path = str(project_root / "physic" / "tools" / "js_store" / "new_db_cdem")
        
        db_path = st.text_input("向量库路径 (Chroma)", value=default_db_path)
        collection_name = st.text_input("集合名称", value="new_db_cdem")
        model_name = st.selectbox("选择模型", ["qwen2.5:latest", "qwen-max", "qwen2.5-coder", "llama3.1:latest"], index=0)
        enable_preproc = st.toggle("启用预处理 (任务拆解)", value=True)
        inject_context = st.toggle("注入上下文（脚本/日志/对话）", value=True)
        
        st.divider()
        st.caption("核心架构: 多智能体协同")
        st.caption("上下文记忆: 双路滑动窗口与向量存储")

    st.title("CDEM小助手")

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
    if "qa_messages" not in st.session_state:
        st.session_state["qa_messages"] = [
            {"role": "assistant", "content": "你好！这里是 CDEM 对话页。可以随便聊天，也可以问我 CDEM 软件、API、报错原因等问题。", "docs": None}
        ]
    if "script_feedback" not in st.session_state:
        st.session_state["script_feedback"] = ""
    if "last_user_task" not in st.session_state:
        st.session_state["last_user_task"] = ""

    seed = st.session_state.pop("script_feedback_seed", None)
    if isinstance(seed, str) and seed.strip():
        st.session_state["script_feedback"] = seed.strip()

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
                        if msg.get("generated_code"):
                            with st.expander("✅ 最终脚本", expanded=False):
                                st.code((msg.get("generated_code") or "").strip(), language="javascript")
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
                st.session_state["last_user_task"] = (user_input or "").strip()
                with chat_container:
                    with st.chat_message("user"):
                        st.markdown(user_input)
                    with st.chat_message("assistant"):
                        with st.status("🧠 智能体规划与生成中...", expanded=True) as status:
                            st.write("1. 检索长时上下文与知识库...")
                            try:
                                query_text = build_script_generation_query(
                                    user_input,
                                    current_script=st.session_state.get("current_script", ""),
                                    messages=st.session_state.get("messages", []) or [],
                                    simulation_logs=st.session_state.get("simulation_logs", []) or [],
                                    inject_context=bool(inject_context),
                                )
                                dynamic_sys_prompt = (
                                    "你将基于提供的【当前脚本】与【最近对话上下文/日志】完成【本次任务】。\n"
                                    "优先在现有脚本上做最小必要修改，不要推倒重写，除非现有脚本明显不适用。\n"
                                    "最终输出必须是可直接执行的 JavaScript 脚本正文，不要输出解释性中文，不要输出多余格式。"
                                )
                                generated_code, gen_time, retrieved_count = agent_module.generate_code(
                                    query_text,
                                    verbose=False,
                                    dynamic_sys_prompt=dynamic_sys_prompt,
                                )
                                metrics = getattr(agent_module, "last_run_metrics", {}) or {}
                                metrics["duration_s"] = float(gen_time or 0)
                                metrics["retrieved_docs_count"] = int(retrieved_count or 0)
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
                                    "metrics": metrics,
                                    "generated_code": generated_code or ""
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
            st.text_area("JavaScript Code", value=st.session_state["current_script"], height=450, key="current_script")

            if st.button("从仿真日志填充改进反馈", key="fill_feedback_from_logs"):
                logs = [str(x) for x in (st.session_state.get("simulation_logs") or []) if str(x).strip()]
                if logs:
                    st.session_state["script_feedback_seed"] = "\n".join(logs[-20:])
                st.rerun()

            st.text_area("改进反馈（可选）", height=110, key="script_feedback")
            if st.button("🔁 基于当前脚本迭代改进", type="primary", key="iterate_script"):
                base_task = (st.session_state.get("last_user_task") or "").strip() or "请改进当前脚本以更符合用户需求"
                query_text = build_script_generation_query(
                    base_task,
                    current_script=st.session_state.get("current_script", ""),
                    messages=st.session_state.get("messages", []) or [],
                    simulation_logs=st.session_state.get("simulation_logs", []) or [],
                    feedback=st.session_state.get("script_feedback", "") or "",
                    inject_context=True,
                )
                dynamic_sys_prompt = (
                    "你将对【当前脚本】进行迭代改进。\n"
                    "要求：\n"
                    "1) 保持已有正确结构，尽量小改动修复问题与补齐功能。\n"
                    "2) 如果日志中有错误，先修复错误；如果反馈有约束，优先满足。\n"
                    "3) 输出必须是完整可运行 JavaScript 脚本正文，不要输出解释、不要输出多余格式。"
                )
                with st.spinner("迭代改进中..."):
                    generated_code, gen_time, retrieved_count = agent_module.generate_code(
                        query_text,
                        verbose=False,
                        dynamic_sys_prompt=dynamic_sys_prompt,
                    )
                metrics = getattr(agent_module, "last_run_metrics", {}) or {}
                metrics["duration_s"] = float(gen_time or 0)
                metrics["retrieved_docs_count"] = int(retrieved_count or 0)
                if generated_code:
                    st.session_state["current_script"] = generated_code
                    st.session_state.messages.append(
                        {
                            "role": "assistant",
                            "content": f"已迭代改进脚本，耗时 {gen_time:.1f}s，可在右侧查看更新。",
                            "metrics": metrics,
                            "generated_code": generated_code or "",
                        }
                    )
                else:
                    st.session_state.messages.append(
                        {
                            "role": "assistant",
                            "content": "⚠️ 迭代改进未能生成有效代码，请补充更具体的改进反馈或错误信息。",
                            "metrics": metrics,
                            "generated_code": "",
                        }
                    )
                st.rerun()

            if st.button("同步至仿真测试台", type="primary"):
                st.success("已同步！请前往【🚀 脚本仿真测试模块】运行。")

    # ==========================
    # Tab 2: CDEM软件问答模块
    # ==========================
    with tab2:
        st.subheader("💬 聊天问答")
        mode = st.radio(
            "对话模式",
            ["专业问答（检索文档）", "闲聊模式（不检索，仅聊天）"],
            index=0,
            horizontal=True,
        )
        col_qa1, col_qa2 = st.columns([1.2, 0.8])

        with col_qa1:
            qa_chat = st.container(height=520)
            with qa_chat:
                for msg in st.session_state["qa_messages"]:
                    with st.chat_message(msg["role"]):
                        st.markdown(msg["content"])
                        if msg.get("docs"):
                            with st.expander("📚 参考资料"):
                                docs = msg["docs"] or []
                                for i, d in enumerate(docs):
                                    source = ""
                                    try:
                                        source = (d.metadata or {}).get("source", "") or "未知"
                                    except Exception:
                                        source = "未知"
                                    st.markdown(f"**{i+1}. 来源**: {source}")
                                    st.code((getattr(d, "page_content", "") or "").strip(), language="javascript")

            c1, c2 = st.columns([1, 1])
            with c1:
                qa_k = st.number_input("检索条数", min_value=1, max_value=12, value=4, step=1)
            with c2:
                if st.button("🗑️ 清空对话", key="qa_clear"):
                    st.session_state["qa_messages"] = [
                        {"role": "assistant", "content": "你好！这里是 CDEM 对话页。可以随便聊天，也可以问我 CDEM 软件、API、报错原因等问题。", "docs": None}
                    ]
                    st.rerun()

            qa_user_text = st.text_input("输入问题并发送：", key="qa_user_text")
            if st.button("发送", type="primary", key="qa_send"):
                q = (qa_user_text or "").strip()
                if not q:
                    st.warning("请输入问题。")
                else:
                    st.session_state["qa_messages"].append({"role": "user", "content": q, "docs": None})
                    if mode.startswith("专业"):
                        with st.spinner("检索并生成回答中..."):
                            answer, docs = answer_question_with_rag(agent_module, q, k=int(qa_k))
                    else:
                        with st.spinner("生成聊天回复中..."):
                            answer = answer_small_talk(agent_module, q)
                            docs = []
                    st.session_state["qa_messages"].append({"role": "assistant", "content": answer, "docs": docs})
                    st.rerun()

        with col_qa2:
            st.markdown("**最新检索结果**")
            latest_docs = []
            for msg in reversed(st.session_state["qa_messages"]):
                if msg.get("role") == "assistant" and msg.get("docs"):
                    latest_docs = msg.get("docs") or []
                    break
            if latest_docs:
                st.success(f"已检索到 {len(latest_docs)} 条文档片段")
                for i, doc in enumerate(latest_docs):
                    source = ""
                    try:
                        source = (doc.metadata or {}).get("source", "") or "未知"
                    except Exception:
                        source = "未知"
                    with st.expander(f"📄 结果 {i+1} (来源: {source})"):
                        st.markdown(f"```javascript\n{(getattr(doc, 'page_content', '') or '').strip()}\n```")
                export_data = json.dumps([(getattr(d, "page_content", "") or "") for d in latest_docs], ensure_ascii=False, indent=2)
                st.download_button(
                    label="📥 导出最新检索结果 (JSON)",
                    data=export_data,
                    file_name="cdem_qa_results.json",
                    mime="application/json",
                )
            else:
                st.info("暂无检索结果。先在左侧发送一个问题。")

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
