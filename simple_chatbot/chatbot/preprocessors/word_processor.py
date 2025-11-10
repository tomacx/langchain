from docx import Document
import re

class WordProcessor:
    chapter_patterns = [
        r"\d+\.+\d*\.*\d*\.*[a-zA-Z\s]*[\u4e00-\u9fa5，]+",  # 多级数字编号
        r"[一二三四五六七八九十]*[、][\u4e00-\u9fa5a-zA-Z]+",  # 中文章节编号
        r"[第][一二三四五六七八九十]+[章][ \u4e00-\u9fa5a-zA-Z]+",  # 小说式章节
        r"[一二三四五六七八九十|1-9]+[、|.][1-9]*[.]*[1-9]*[ \u4e00-\u9fa5a-zA-Z]+"  # 多级中文+数字
    ]

    def extract(self, file_path):
        doc = Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])

        for pattern in self.chapter_patterns:
            sections = re.split(pattern, text)
            if len(sections) > 1:
                break

        return [{"content": s, "metadata": {"file_type": "word"}} for s in sections if s.strip()]