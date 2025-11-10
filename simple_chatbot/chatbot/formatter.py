def format_to_json(cleaned_docs):
    formatted = []
    for d in cleaned_docs:
        formatted.append({
            "content": d["content"],
            "metadata": d["metadata"]
        })
    return formatted