from django.db import models

# Create your models here.
import uuid

class FileDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    filename = models.CharField(max_length=512)
    original_name = models.CharField(max_length=512, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="uploads/")
    # faiss index file path or vectorstore id
    vector_index_path = models.CharField(max_length=1024, blank=True, null=True)

    def __str__(self):
        return f"{self.filename}"

class QAHistory(models.Model):
    id = models.AutoField(primary_key=True)
    document = models.ForeignKey(FileDocument, on_delete=models.CASCADE, related_name="qas")
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
