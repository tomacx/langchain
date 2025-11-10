from rest_framework import serializers
from .models import FileDocument, QAHistory

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDocument
        fields = ("id", "filename", "original_name", "file", "uploaded_at")

class QAHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QAHistory
        fields = ("id", "document", "question", "answer", "created_at")