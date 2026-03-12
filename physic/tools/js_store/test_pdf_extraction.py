
import sys
from pathlib import Path
import asyncio
import fitz  # PyMuPDF

# Add the directory to sys.path to import the builder
sys.path.append(str(Path(__file__).resolve().parent))
from build_js_db import CDEMKnowledgeBuilder

async def test_pdf_extraction():
    project_root = Path(__file__).resolve().parents[2]
    docs_root = project_root / "docs"
    manuals_root = docs_root / "技术手册"
    combined_root = docs_root / "CDEM案例库及手册"

    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "persist_directory": str(Path(__file__).resolve().parent / "test_chroma_pdf"),
        "collection_name": "test_collection_pdf",
    }
    builder = CDEMKnowledgeBuilder(config)
    
    # Test with one PDF file
    pdf_file = manuals_root / "技术手册-SuperCDEM软件-SuperCDEM环境安装教程.pdf"
    if not pdf_file.exists():
        pdf_file = combined_root / "技术手册-SuperCDEM软件-SuperCDEM环境安装教程.pdf"
    
    if pdf_file.exists():
        print(f"Parsing PDF: {pdf_file.name}")
        docs = builder.parse_cdem_manual_pdf(pdf_file)
        print(f"Total documents extracted: {len(docs)}")
        
        if docs:
            print("\nFirst Doc Sample:")
            print(f"ID: {docs[0].doc_id}")
            print(f"Content Preview:\n{docs[0].content[:500]}...")
            print(f"Metadata: {docs[0].metadata}")
    else:
        print(f"File not found: {pdf_file}")

if __name__ == "__main__":
    asyncio.run(test_pdf_extraction())

import sys
from pathlib import Path
import asyncio
import fitz  # PyMuPDF

# Add the directory to sys.path to import the builder
sys.path.append(str(Path(r"d:\Codes\langchain\physic\tools\js_store")))
from build_js_db import CDEMKnowledgeBuilder

async def test_pdf_extraction():
    config = {
        "embedding_model": "bge-m3:latest",
        "ollama_base_url": "http://localhost:11434",
        "persist_directory": "./test_chroma_pdf",
        "collection_name": "test_collection_pdf",
    }
    builder = CDEMKnowledgeBuilder(config)
    
    # Test with one PDF file
    pdf_file = Path(r"d:\Codes\langchain\physic\docs\CDEM案例库及手册\技术手册-SuperCDEM软件-SuperCDEM环境安装教程.pdf")
    
    if pdf_file.exists():
        print(f"Parsing PDF: {pdf_file.name}")
        docs = builder.parse_cdem_manual_pdf(pdf_file)
        print(f"Total documents extracted: {len(docs)}")
        
        if docs:
            print("\nFirst Doc Sample:")
            print(f"ID: {docs[0].doc_id}")
            print(f"Content Preview:\n{docs[0].content[:500]}...")
            print(f"Metadata: {docs[0].metadata}")
    else:
        print(f"File not found: {pdf_file}")

if __name__ == "__main__":
    asyncio.run(test_pdf_extraction())
