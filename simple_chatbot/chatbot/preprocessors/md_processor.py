import markdown
from bs4 import BeautifulSoup

class MDProcessor:
    def extract(self, file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            raw = f.read()

        html = markdown.markdown(raw)
        soup = BeautifulSoup(html, "html.parser")

        results = []
        for element in soup.find_all(["h1","h2","h3","p","li"]):
            level = 0
            if element.name.startswith("h"):
                level = int(element.name[1])
            results.append({
                "content": element.get_text(),
                "metadata": {"file_type": "md", "section_level": level}
            })
        return results