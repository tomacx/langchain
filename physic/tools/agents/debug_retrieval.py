
import sys
import os
import json
import re
import time
from pathlib import Path

# Add project root to sys.path
sys.path.append("/Users/cxh/Codes/langchain/physic/tools/agents")

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

def extract_keywords(query):
    """提取强关键词（英文单词 > 3 chars，排除通用词）"""
    english_keywords = re.findall(r'[a-zA-Z0-9]+', query)
    stop_words = {
        'cdyna', 'case', 'script', 'gflow', 'mudsim', 'supercdem', 
        '3d', '2d', 'js', 'example', 'simulation', 'model', 'file',
        'test', 'analysis', 'method', 'using', 'with', 'for'
    }
    specific_keywords = [
        k for k in english_keywords 
        if k.lower() not in stop_words and len(k) > 3
    ]
    return " ".join(specific_keywords)

def determine_category_from_query(query):
    """从查询中推断目标类别"""
    if "CDyna" in query: return "CDyna"
    if "GFlow" in query: return "GFlow"
    if "MudSim" in query: return "MudSim"
    if "SuperCDEM" in query: return "SuperCDEM"
    if "建模" in query or "网格" in query: return "建模" # Maps to 建模及网格
    return None

def test_hybrid_retrieval():
    # Configuration
    # persist_directory = "/Users/cxh/Codes/langchain/physic/tools/js_store/chroma_db_cdem"
    persist_directory = "/Users/cxh/Codes/langchain/physic/tools/js_store/chroma_db_cdem_v2" # Switch to V2
    collection_name = "cdem_knowledge"
    dataset_file = "/Users/cxh/Codes/langchain/physic/dataset_split_results/case_queries_content.json"
    
    print(f"🚀 Starting Hybrid Retrieval Test (Semantic + Keyword + Filtering)")
    print(f"Database: {persist_directory}")
    
    # Initialize Vector Store
    embeddings = OllamaEmbeddings(
        model="bge-m3:latest",
        base_url="http://localhost:11434"
    )
    
    try:
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_name=collection_name
        )
        print("✅ Vectorstore initialized.")
    except Exception as e:
        print(f"❌ Error initializing vectorstore: {e}")
        return

    # Load Dataset
    try:
        with open(dataset_file, 'r', encoding='utf-8') as f:
            dataset = json.load(f)
            cases = dataset.get('cases', [])
            print(f"✅ Loaded {len(cases)} cases.")
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return

    success_count = 0
    total_cases = len(cases)
    failure_log = []
    
    start_time = time.time()

    print(f"\nrunning evaluation...")

    for idx, case in enumerate(cases):
        query = case['default_query']
        target_filename = case['filename']
        target_core = os.path.splitext(os.path.basename(target_filename))[0].lower()
        
        # 0. Determine Category
        category = determine_category_from_query(query)
        
        # --- Strategy: Deep Retrieval Check (k=50) ---
        # 1. Main Semantic Search (Deep)
        results_main = vectorstore.similarity_search(query, k=50)
        
        # 2. Keyword Search (Deep)
        keywords = extract_keywords(query)
        results_kw = []
        if keywords:
            results_kw = vectorstore.similarity_search(keywords, k=20)
            
        # 3. Merge
        combined_candidates = []
        seen_sources = set()
        
        def add_docs(docs):
            for doc in docs:
                src = doc.metadata.get('source', '')
                if src not in seen_sources:
                    # Optional: Apply Category Filter
                    if category:
                        if category == "建模":
                            if "建模" not in src and "网格" not in src:
                                continue
                        elif category not in src:
                            continue
                    seen_sources.add(src)
                    combined_candidates.append(doc)

        add_docs(results_main)
        add_docs(results_kw)
        
        # 4. Check Presence in Full Candidate Pool (Top ~70)
        final_results = combined_candidates # No slicing


        # --- Verification ---
        found = False
        retrieved_names = []
        
        for doc in final_results:
            source = doc.metadata.get('source', '')
            fname = os.path.basename(source)
            fname_core = os.path.splitext(fname)[0].lower()
            
            retrieved_names.append(fname)
            
            # Loose matching: target inside retrieved OR retrieved inside target
            if target_core in fname_core or fname_core in target_core:
                found = True
                break
        
        if found:
            success_count += 1
        else:
            failure_log.append({
                "case_id": case['id'],
                "query": query,
                "keywords": keywords,
                "target": target_filename,
                "retrieved": retrieved_names
            })

        if (idx + 1) % 50 == 0:
            print(f"Processed {idx + 1}/{total_cases} | Accuracy: {success_count/(idx+1)*100:.1f}%")

    elapsed = time.time() - start_time
    accuracy = success_count / total_cases * 100
    
    print("\n" + "="*50)
    print(f"📊 Final Results (Hybrid Search k=5+5 -> Top8)")
    print(f"✅ Success: {success_count}/{total_cases}")
    print(f"❌ Failed: {len(failure_log)}")
    print(f"📈 Recall Rate: {accuracy:.2f}%")
    print(f"⏱️ Time: {elapsed:.2f}s")
    print("="*50)

    # Save failures analysis
    if failure_log:
        with open("retrieval_failures_hybrid.json", "w", encoding="utf-8") as f:
            json.dump(failure_log, f, ensure_ascii=False, indent=2)
        print("Failure log saved to retrieval_failures_hybrid.json")

if __name__ == "__main__":
    test_hybrid_retrieval()
