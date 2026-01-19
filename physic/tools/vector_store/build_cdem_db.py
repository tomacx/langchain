#!/usr/bin/env python3
"""
CDEM案例库及手册向量数据库 - 快速构建脚本
专门处理 /Users/cxh/Codes/langchain/physic/docs/CDEM案例库及手册 目录
"""

import asyncio
import os
from pathlib import Path
from cdem_vector_db import CDEMKnowledgeBuilder, CDEMKnowledgeRetriever

async def build_cdem_vector_database():
    """构建CDEM向量数据库"""
    
    print("🚀 CDEM案例库及手册向量数据库构建")
    print("=" * 50)
    
    # 配置参数
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "milvus_uri": "./cdem_knowledge_db.db",
        "collection_name": "cdem_unified_knowledge",
        "chunk_size": 1000,
        "chunk_overlap": 200
    }
    
    # 检查Ollama是否运行
    try:
        import requests
        response = requests.get(f"{config['ollama_base_url']}/api/tags", timeout=5)
        if response.status_code != 200:
            print("❌ Ollama服务未运行，请先启动Ollama")
            print("   运行: ollama serve")
            return
        print("✅ Ollama服务已连接")
    except Exception as e:
        print(f"❌ 无法连接Ollama: {e}")
        print("   请确保Ollama已安装并运行: ollama serve")
        return
    
    # 检查bge-m3模型
    try:
        models = response.json().get('models', [])
        if not any('bge-m3' in model['name'] for model in models):
            print("❌ bge-m3模型未安装")
            print("   运行: ollama pull bge-m3:latest")
            return
        print("✅ bge-m3模型已就绪")
    except:
        print("⚠️  无法检查bge-m3模型，请确保已安装: ollama pull bge-m3:latest")
    
    # 检查CDEM目录
    cdem_directory = Path("/Users/cxh/Codes/langchain/physic/docs/CDEM案例库及手册")
    
    if not cdem_directory.exists():
        print(f"❌ CDEM目录不存在: {cdem_directory}")
        return
    
    print(f"📁 CDEM目录: {cdem_directory}")
    
    # 统计文件数量
    md_files = list(cdem_directory.glob("*.md"))
    js_files = list(cdem_directory.glob("*.js"))
    txt_files = list(cdem_directory.glob("*.txt"))
    pdf_files = list(cdem_directory.glob("*.pdf"))
    
    print(f"📊 文件统计:")
    print(f"  📄 Markdown手册: {len(md_files)} 个")
    print(f"  📜 JavaScript案例: {len(js_files)} 个")
    print(f"  📝 配置文件: {len(txt_files)} 个")
    print(f"  📋 PDF文档: {len(pdf_files)} 个")
    print(f"  📁 总计: {len(md_files) + len(js_files) + len(txt_files) + len(pdf_files)} 个文件")
    
    # 构建知识库
    try:
        builder = CDEMKnowledgeBuilder(config)
        documents = await builder.build_cdem_knowledge_base(str(cdem_directory))
        
        print(f"\n✅ 成功构建CDEM向量数据库，共处理 {len(documents)} 个文档块")
        print(f"📍 数据库文件位置: {config['milvus_uri']}")
        
        # 测试检索
        print("\n🔍 测试CDEM知识检索...")
        retriever = CDEMKnowledgeRetriever(config)
        
        test_queries = [
            "CDyna块体模块基础功能",
            "SuperCDEM粒子离散元方法", 
            "GFlow滑坡模拟",
            "建模网格参数化创建",
            "MudSim泥石流计算"
        ]
        
        for query in test_queries:
            print(f"\n📝 查询: {query}")
            results = retriever.hybrid_search(query, k=3)
            
            print(f"📚 手册结果 ({len(results['manual'])} 个):")
            for doc in results['manual']:
                title = doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))
                module = doc.metadata.get('module', '未知模块')
                score = doc.metadata.get('score', 0)
                print(f"  - [{module}] {title} (相似度: {score:.3f})")
                
            print(f"🔧 案例结果 ({len(results['cdyna']) + len(results['other_cases'])} 个):")
            all_cases = results['cdyna'] + results['other_cases']
            for doc in all_cases:
                file_name = doc.metadata.get('file_name', '无文件名')
                case_type = doc.metadata.get('case_type', '未知类型')
                score = doc.metadata.get('score', 0)
                print(f"  - [{case_type}] {file_name} (相似度: {score:.3f})")
        
        print("\n🎉 CDEM向量数据库构建完成!")
        print("\n📖 使用方法:")
        print("   python3 -c \"")
        print("   from cdem_vector_db import CDEMKnowledgeRetriever")
        print("   retriever = CDEMKnowledgeRetriever({'milvus_uri': './cdem_knowledge_db.db'})")
        print("   results = retriever.search('你的查询', k=5)")
        print("   for doc in results: print(doc.metadata.get('file_name', 'unknown'), doc.metadata.get('score', 0))")
        print("   \"")
        
    except Exception as e:
        print(f"❌ 构建失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(build_cdem_vector_database())
