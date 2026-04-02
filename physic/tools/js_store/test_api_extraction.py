import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None

from langchain_chroma import Chroma
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama, OllamaEmbeddings


def _resolve_env_path(key: str, default_path: Path) -> str:
    raw = (os.environ.get(key) or "").strip()
    if not raw:
        return str(default_path)
    p = Path(raw)
    if not p.is_absolute():
        p = (Path.cwd() / p).resolve()
    return str(p)


def _get_vector_db_config() -> tuple[str, str, str]:
    repo_root = Path(__file__).resolve().parents[3]
    default_db_dir = repo_root / "physic" / "tools" / "js_store" / "new_db_cdem"
    persist_dir = _resolve_env_path("CDEM_TEST_DB_DIR", Path(_resolve_env_path("CDEM_CHROMA_DB_DIR", default_db_dir)))
    collection = (os.environ.get("CDEM_TEST_COLLECTION") or "new_db_cdem").strip()
    base_url = (os.environ.get("CDEM_OLLAMA_BASE_URL") or "http://localhost:11434").strip()
    return persist_dir, collection, base_url


def main() -> None:
    if load_dotenv is not None:
        try:
            load_dotenv(encoding="utf-8")
        except Exception:
            pass

    persist_dir, collection_name, ollama_base_url = _get_vector_db_config()
    embedding_model = (os.environ.get("CDEM_EMBEDDING_MODEL") or "bge-m3:latest").strip()
    llm_model = (os.environ.get("CDEM_TEST_LLM_MODEL") or "llama3.1:latest").strip()
    k_raw = (os.environ.get("CDEM_TEST_TOP_K") or "").strip()
    k = int(k_raw) if k_raw.isdigit() else 8
    once = (os.environ.get("CDEM_TEST_ONCE") or "").strip().lower() in {"1", "true", "yes"}
    no_llm = (os.environ.get("CDEM_TEST_NO_LLM") or "").strip().lower() in {"1", "true", "yes"}
    max_ctx_raw = (os.environ.get("CDEM_TEST_MAX_CONTEXT_CHARS") or "").strip()
    max_ctx_chars = int(max_ctx_raw) if max_ctx_raw.isdigit() else 8000

    embeddings = OllamaEmbeddings(model=embedding_model, base_url=ollama_base_url)
    vectorstore = Chroma(
        persist_directory=persist_dir,
        collection_name=collection_name,
        embedding_function=embeddings,
    )

    print(f"DB: {persist_dir} (collection={collection_name})")
    print(f"Embedding: {embedding_model} (base_url={ollama_base_url})")
    print(f"LLM: {llm_model} (base_url={ollama_base_url})")

    llm = ChatOllama(model=llm_model, base_url=ollama_base_url, temperature=0.1)
    sys_prompt = (
        "你是CDEM技术手册与案例库的知识库助手。"
        "基于给定的检索资料回答问题。"
        "必须使用资料中的信息组织答案，给出可执行的入库策略。"
        "引用资料时使用 [来源N] 标注。"
    )

    while True:
        if once:
            query = (os.environ.get("CDEM_TEST_QUERY") or "").strip()
            if not query:
                query = "这些技术手册里的表格、备注、范例、以及任务拆解流程，这些语义信息如何存入到向量数据库当中？"
        else:
            query = input("\n请输入问题（输入 quit 退出）：").strip()

        if query.lower() in {"quit", "exit", "q"}:
            return
        if not query:
            if once:
                return
            continue

        results = vectorstore.similarity_search_with_score(query, k=k)
        print(f"\nQuery: {query}")
        print(f"Hits: {len(results)}")

        blocks: list[str] = []
        seen: set[tuple[str, str]] = set()
        for idx, (doc, score) in enumerate(results, start=1):
            md = doc.metadata or {}
            dedupe_key = (str(md.get("source") or ""), doc.page_content[:200])
            if dedupe_key in seen:
                continue
            seen.add(dedupe_key)
            blocks.append(
                "\n".join(
                    [
                        f"[来源{idx}] score={score}",
                        f"source={md.get('source')}",
                        f"category={md.get('category')}",
                        f"source_type={md.get('source_type')}",
                        f"content_type={md.get('content_type')}",
                        "",
                        doc.page_content[:2000],
                    ]
                )
            )

        print("==== 检索结果（用于检查入库内容） ====")
        if not blocks:
            print("(无检索结果，通常是 persist_directory / collection_name 不匹配，或库尚未构建)")
            if once:
                return
            continue
        for b in blocks[: min(6, len(blocks))]:
            print(b[:1000])
            print()

        if no_llm:
            if once:
                return
            continue

        context = "\n\n---\n\n".join(blocks)
        if len(context) > max_ctx_chars:
            context = context[:max_ctx_chars]
        messages = [
            SystemMessage(content=sys_prompt),
            HumanMessage(content=f"问题：{query}\n\n检索资料：\n{context}\n\n请用中文回答。"),
        ]

        try:
            answer = llm.invoke(messages)
        except Exception as e:
            fallback = "llama3.1:latest"
            if llm_model != fallback:
                llm = ChatOllama(model=fallback, base_url=ollama_base_url, temperature=0.1)
                llm_model = fallback
                answer = llm.invoke(messages)
            else:
                raise e
        print("==== LLM回答 ====")
        print(getattr(answer, "content", str(answer)))

        if once:
            return


if __name__ == "__main__":
    main()
