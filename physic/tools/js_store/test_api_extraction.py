
import sys
from pathlib import Path
import asyncio

# Add the directory to sys.path to import the builder
sys.path.append(str(Path(r"d:\Codes\langchain\physic\tools\js_store")))
from build_js_db import CDEMKnowledgeBuilder

async def test_extraction():
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "persist_directory": "./test_chroma",
        "collection_name": "test_collection",
    }
    builder = CDEMKnowledgeBuilder(config)
    
    # Test with one manual file
    manual_file = Path(r"d:\Codes\langchain\physic\docs\CDEM案例库及手册\技术手册-CDyna软件-1-Dyna公共接口.md")
    if manual_file.exists():
        docs = builder.parse_cdem_manual(manual_file)
        print(f"Total documents extracted: {len(docs)}")
        
        api_docs = [d for d in docs if d.source_type == "api_reference"]
        print(f"API reference documents: {len(api_docs)}")
        
        if api_docs:
            print("\nFirst API Doc Sample:")
            print(f"ID: {api_docs[0].doc_id}")
            print(f"Content Preview:\n{api_docs[0].content[:200]}...")
    else:
        print(f"File not found: {manual_file}")

if __name__ == "__main__":
    asyncio.run(test_extraction())
