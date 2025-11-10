from langchain.text_splitters import RecursiveCharacterTextSplitter

class Chunker:
    def split(self, formatted_docs):
        chunks = []
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=512,
            chunk_overlap=80
        )
        for item in formatted_docs:
            sub_docs = splitter.split_text(item["content"])
            for idx, chunk in enumerate(sub_docs):
                chunks.append({
                    'content': chunk,
                    'metadata': {
                        **item['metadata'],"chunk_id": idx}
                })
        return chunks