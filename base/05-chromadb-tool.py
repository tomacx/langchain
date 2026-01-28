import chromadb

# 列出向量数据库的collections和记录
def list_collection(db_path):
    client = chromadb.PersistentClient(db_path)
    collections = client.list_collections()
    print(f"chromadb:{db_path} 有 {len(collections)} 个表")

    for i, collection in enumerate(collections):
        print(f"collection {i}: {collection.name}, 共有 {collection.count()} 个记录")

def delete_collection(db_path, collection_name):
    try: 
        client = chromadb.PersistentClient(db_path)
        client.delete_collection(collection_name)
    except Exception as e:
        print(f"删除{collection_name} 时出错，{e}")

db_path="./chroma_langchain_db"

list_collection(db_path)