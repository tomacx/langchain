import os
from pdfminer.high_level import extract_text
import fitz # pymupdf 判断是否为扫描的pdf
from paddleocr import PaddleOCR

class PDFProcessor:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang="ch", rec=True)
    
    def is_scanned_pdf(self, file_path):
        doc = fitz.open(file_path)
        for page in doc:
            if page.get_text().strip():  # 有文本层
                continue
            else:
                return True
        return False
    
    def extract(self, file_path):
        scanned = self.is_scanned_pdf(file_path)

        if not scanned:
            # 机器生成PDF处理（PDFMiner）
            text = extract_text(file_path)
            return [{"content": text, "metadata": {"file_type": "pdf"}}]

        else:
            # 扫描PDF处理（OCR）
            doc = fitz.open(file_path)
            results = []
            for page_num, page in enumerate(doc):
                pix = page.get_pixmap()
                img = pix.pil_tobytes()
                ocr_res = self.ocr.ocr(img, cls=True)
                text = "\n".join([line[1][0] for line in ocr_res[0]])
                results.append({
                    "content": text,
                    "metadata": {"file_type": "pdf", "page": page_num + 1}
                })
            return results