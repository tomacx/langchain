#!/usr/bin/env python3
"""
CDEM知识库测试脚本
测试向量数据库的检索功能和性能
"""

import time
from cdem_vector_db import CDEMKnowledgeRetriever

def test_cdem_retrieval():
    """测试CDEM知识检索"""
    
    print("🔍 CDEM知识库检索测试")
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
        
        # 测试查询列表
        test_queries = [
            # CDyna相关
            ("CDyna块体模块基础功能", "CDyna"),
            ("CDyna孔隙渗流分析", "CDyna"),
            ("CDyna热传导模块", "CDyna"),
            ("CDyna刚体动力学", "CDyna"),
            
            # SuperCDEM相关
            ("SuperCDEM粒子离散元", "SuperCDEM"),
            ("SuperCDEM爆炸计算", "SuperCDEM"),
            ("SuperCDEM裂隙流", "SuperCDEM"),
            
            # GFlow相关
            ("GFlow滑坡模拟", "GFlow"),
            ("GFlow地形分析", "GFlow"),
            
            # MudSim相关
            ("MudSim泥石流", "MudSim"),
            ("MudSim流体计算", "MudSim"),
            
            # 建模相关
            ("参数化几何创建", "Modeling"),
            ("网格剖分方法", "Modeling"),
            ("复杂边界粒子填充", "Modeling"),
            
            # 通用功能
            ("JavaScript接口函数", None),
            ("本构模型设置", None),
            ("边界条件施加", None),
            ("后处理结果分析", None)
        ]
        
        print(f"\n🧪 开始测试 {len(test_queries)} 个查询...")
        
        total_time = 0
        successful_queries = 0
        
        for i, (query, module) in enumerate(test_queries, 1):
            print(f"\n--- 测试 {i}/{len(test_queries)}: {query} ---")
            
            try:
                start_time = time.time()
                
                if module:
                    results = retriever.search_by_module(query, module, k=3)
                else:
                    results = retriever.search(query, k=3)
                
                end_time = time.time()
                query_time = end_time - start_time
                total_time += query_time
                successful_queries += 1
                
                print(f"⏱️  查询时间: {query_time:.3f}秒")
                print(f"📊 结果数量: {len(results)}")
                
                # 显示前3个结果
                for j, doc in enumerate(results[:3], 1):
                    file_name = doc.metadata.get('file_name', 'unknown')
                    source_type = doc.metadata.get('source_type', 'unknown')
                    category = doc.metadata.get('category', 'unknown')
                    score = doc.metadata.get('score', 0)
                    
                    print(f"  {j}. [{source_type}] {file_name}")
                    print(f"     分类: {category}")
                    print(f"     相似度: {score:.3f}")
                    
                    # 显示内容摘要
                    content_preview = doc.page_content[:100].replace('\n', ' ')
                    print(f"     摘要: {content_preview}...")
                    
            except Exception as e:
                print(f"❌ 查询失败: {e}")
        
        # 统计信息
        if successful_queries > 0:
            avg_time = total_time / successful_queries
            print(f"\n📈 测试统计:")
            print(f"  ✅ 成功查询: {successful_queries}/{len(test_queries)}")
            print(f"  ⏱️  总查询时间: {total_time:.3f}秒")
            print(f"  📊 平均查询时间: {avg_time:.3f}秒")
            print(f"  🚀 查询速度: {1/avg_time:.1f} 查询/秒")
        
        # 高级检索测试
        print(f"\n🔬 高级检索测试...")
        
        # 混合搜索测试
        hybrid_query = "CDyna块体模块与网格建模"
        print(f"\n📝 混合搜索: {hybrid_query}")
        hybrid_results = retriever.hybrid_search(hybrid_query, k=5)
        
        print(f"📚 手册结果: {len(hybrid_results['manual'])} 个")
        for doc in hybrid_results['manual']:
            title = doc.metadata.get('section_title', doc.metadata.get('title', '无标题'))
            print(f"  - {title}")
            
        print(f"🔧 CDyna案例: {len(hybrid_results['cdyna'])} 个")
        for doc in hybrid_results['cdyna']:
            file_name = doc.metadata.get('file_name', '无文件名')
            print(f"  - {file_name}")
        
        # 按模块检索测试
        modules = ["CDyna", "SuperCDEM", "GFlow", "MudSim", "Modeling"]
        print(f"\n🏗️  按模块检索测试...")
        
        for module in modules:
            try:
                module_results = retriever.search_by_module("基础功能", module, k=2)
                print(f"  {module}: {len(module_results)} 个结果")
            except Exception as e:
                print(f"  {module}: 检索失败 - {e}")
        
        print(f"\n🎉 CDEM知识库测试完成!")
        
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
                start_time = time.time()
                
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
                        
                    print(f"\n🔧 案例结果 ({len(results['cdyna']) + len(results['other_cases'])} 个):")
                    all_cases = results['cdyna'] + results['other_cases']
                    for doc in all_cases:
                        file_name = doc.metadata.get('file_name', '无文件名')
                        case_type = doc.metadata.get('case_type', '未知类型')
                        score = doc.metadata.get('score', 0)
                        print(f"  - [{case_type}] {file_name} (相似度: {score:.3f})")
                        
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
                
                end_time = time.time()
                print(f"\n⏱️  查询时间: {end_time - start_time:.3f}秒")
                
            except Exception as e:
                print(f"❌ 查询失败: {e}")
                
    except Exception as e:
        print(f"❌ 初始化失败: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "interactive":
        interactive_search()
    else:
        test_cdem_retrieval()
