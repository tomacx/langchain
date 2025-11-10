import tempfile
import comtypes.client
from .pdf_processor import PDFProcessor

class PPTProcessor:
    def convert_to_pdf(self, ppt_path):
        pdf_path = os.path.splitext(ppt_path)[0] + ".pdf"
        powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
        ppt = powerpoint.Presentations.Open(ppt_path)
        ppt.SaveAs(pdf_path, 32)
        ppt.Close()
        powerpoint.Quit()
        return pdf_path

    def extract(self, ppt_path):
        pdf_path = self.convert_to_pdf(ppt_path)
        return PDFProcessor().extract(pdf_path)