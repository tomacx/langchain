import cv2
import pytesseract

class ImageProcessor:
    def preprocess_img(self, img_path):
        img = cv2.imread(img_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5,5), 0)
        thresh = cv2.threshold(blur, 0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]
        return thresh

    def extract(self, img_path):
        img = self.preprocess_img(img_path)
        text = pytesseract.image_to_string(img, lang="chi_sim+eng")
        return [{"content": text, "metadata": {"file_type": "image"}}]