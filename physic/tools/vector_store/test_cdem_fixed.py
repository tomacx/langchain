#!/usr/bin/env python3
"""
CDEM知识库修复测试脚本
修复Milvus过滤表达式问题后的测试
"""

import sys
import os
sys.path.append('/Users/cxh/Codes/langchain/physic/tools/vector_store')

from cdem_vector_db import CDEMKnowledgeRetriever

def test_fixed_search():
    """测试修复后的搜索功能"""
    
    print("🔧 CDEM知识库修复测试")
    print("=" * 40)
    
    # 配置
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "milvus_uri": "./cdem_knowledge_db.db",
        "collection_name": "cdem_unified_knowledge"
    }
    
    try:
        # 初始化检索器
        retriever = CDEMKnowledgeRetriever(config)
        print("✅ 检索器初始化成功")
        
        # 测试普通搜索
        print("\n📝 测试1: 普通搜索")
        results = retriever.search("CDyna块体模块", k=3)
        print(f"结果数量: {len(results)}")
        for i, doc in enumerate(results, 1):
            print(f"  {i}. {doc.metadata.get('file_name', 'unknown')} (相似度: {doc.metadata.get('score', 0):.3f})")
        
        # 测试按模块搜索
        print("\n🏗️  测试2: 按模块搜索 (CDyna)")
        results = retriever.search_by_module("块体模块", "CDyna", k=3)
        print(f"结果数量: {len(results)}")
        for i, doc in enumerate(results, 1):
            print(f"  {i}. {doc.metadata.get('file_name', 'unknown')} (相似度: {doc.metadata.get('score', 0):.3f})")
        
        # 测试按源类型搜索
        print("\n📚 测试3: 按源类型搜索 (manual)")
        results = retriever.search("接口函数", k=3, source_filter="manual")
        print(f"结果数量: {len(results)}")
        for i, doc in enumerate(results, 1):
            print(f"  {i}. {doc.metadata.get('file_name', 'unknown')} (相似度: {doc.metadata.get('score', 0):.3f})")
        
        # 测试混合搜索
        print("\n🔀 测试4: 混合搜索")
        results = retriever.hybrid_search("CDyna网格建模", k=5)
        print(f"手册结果: {len(results['manual'])} 个")
        print(f"CDyna案例: {len(results['cdyna'])} 个")
        print(f"其他案例: {len(results['other_cases'])} 个")
        print(f"总结果: {len(results['all'])} 个")
        
        # 详细显示混合搜索结果
        for category, docs in results.items():
            if category != 'all' and docs:
                print(f"\n{category} 结果:")
                for doc in docs:
                    file_name = doc.metadata.get('file_name', 'unknown')
                    score = doc.metadata.get('score', 0)
                    print(f"  - {file_name} (相似度: {score:.3f})")
        
        print("\n🎉 所有测试通过!")
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()

def interactive_search():
    """交互式搜索"""
    
    print("\n🔍 CDEM知识库交互式搜索")
    print("=" * 40)
    print("输入查询关键词，输入 'quit' 退出")
    print("支持格式:")
    print("  普通查询: CDyna块体模块")
    print("  模块查询: CDyna:块体模块")
    print("  混合查询: hybrid:CDyna网格")
    print("  手册查询: manual:接口函数")
    
    config = {
        "embedding_model": "bge-m3:latest", 
        "ollama_base_url": "http://localhost:11434",
        "milvus_uri": "./cdem_knowledge_db.db",
        "collection_name": "cdem_unified_knowledge"
    }
    
    try:
        retriever = CDEMKnowledgeRetriever(config)
        
        while True:
            query = input("\n📝 请输入查询: ").strip()
            
            if query.lower() in ['quit', 'exit', 'q']:
                print("👋 再见!")
                break
                
            if not query:
                continue
            
            try:
                # 解析查询类型
                if query.startswith("hybrid:"):
                    # 混合搜索
                    search_query = query[7:].strip()
                    results = retriever.hybrid_search(search_query, k=5)
                    
                    print(f"\n📚 手册结果 ({len(results['manual'])} 个):")
                    for doc in results['manual']:
                        title = doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))
                        score = doc.metadata.get('score', 0)
                        print(f"  - {title} (相似度: {score:.3f})")
                        
                    print(f"\n🔧 CDyna案例 ({len(results['cdyna'])} 个):")
                    for doc in results['cdyna']:
                        file_name = doc.metadata.get('file_name', '无文件名')
                        score = doc.metadata.get('score', 0)
                        print(f"  - {file_name} (相似度: {score:.3f})")
                        
                    print(f"\n📋 其他案例 ({len(results['other_cases'])} 个):")
                    for doc in results['other_cases']:
                        file_name = doc.metadata.get('file_name', '无文件名')
                        score = doc.metadata.get('score', 0)
                        print(f"  - {file_name} (相似度: {score:.3f})")
                        
                elif query.startswith("manual:"):
                    # 手册搜索
                    search_query = query[7:].strip()
                    results = retriever.search(search_query, k=5, source_filter="manual")
                    
                    print(f"\n📚 手册搜索结果 ({len(results)} 个):")
                    for doc in results:
                        title = doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))
                        score = doc.metadata.get('score', 0)
                        print(f"  - {title} (相似度: {score:.3f})")
                        
                elif ":" in query:
                    # 模块搜索
                    module, search_query = query.split(":", 1)
                    module = module.strip()
                    search_query = search_query.strip()
                    
                    results = retriever.search_by_module(search_query, module, k=5)
                    
                    print(f"\n🔍 {module}模块搜索结果 ({len(results)} 个):")
                    for doc in results:
                        file_name = doc.metadata.get('file_name', '无文件名')
                        category = doc.metadata.get('category', '未知分类')
                        score = doc.metadata.get('score', 0)
                        print(f"  - {file_name}")
                        print(f"    分类: {category} (相似度: {score:.3f})")
                        
                else:
                    # 普通搜索
                    results = retriever.search(query, k=5)
                    
                    print(f"\n🔍 搜索结果 ({len(results)} 个):")
                    for doc in results:
                        file_name = doc.metadata.get('file_name', '无文件名')
                        source_type = doc.metadata.get('source_type', '未知类型')
                        category = doc.metadata.get('category', '未知分类')
                        score = doc.metadata.get('score', 0)
                        
                        print(f"  - [{source_type}] {file_name}")
                        print(f"    分类: {category} (相似度: {score:.3f})")
                        
                        # 显示内容摘要
                        content_preview = doc.page_content[:150].replace('\n', ' ')
                        print(f"    摘要: {content_preview}...")
                
            except Exception as e:
                print(f"❌ 查询失败: {e}")
                
    except Exception as e:
        print(f"❌ 初始化失败: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "interactive":
        interactive_search()
    else:
        test_fixed_search()
