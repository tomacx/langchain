import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileUploadSerializer
from .models import FileDocument, QAHistory
from .ingest import load_file_chunks, build_vectorstore
from .qa_service import answer_question

class UploadView(APIView):
    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"error": "No file"}, status=status.HTTP_400_BAD_REQUEST)
        doc = FileDocument.objects.create(filename=f.name, original_name=f.name, file=f)
        serializer = FileUploadSerializer(doc)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class IngestView(APIView):
    def post(self, request):
        file_id = request.data.get("file_id")
        try:
            doc = FileDocument.objects.get(id=file_id)
        except FileDocument.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        local_path = doc.file.path
        chunks = load_file_chunks(local_path)
        index_path = os.path.join("vector_indexes", f"{doc.id}_faiss.pkl")
        os.makedirs("vector_indexes", exist_ok=True)
        build_vectorstore(chunks, index_path)
        doc.vector_index_path = index_path
        doc.save()
        return Response({"message": "ingested", "index_path": index_path})
    
class QueryView(APIView):
    def post(self, request):
        file_id = request.data.get("file_id")
        question = request.data.get("question")
        if not (file_id and question):
            return Response({"error": "file_id and question required"}, status=400)
        try:
            doc = FileDocument.objects.get(id=file_id)
        except FileDocument.DoesNotExist:
            return Response({"error": "file not found"}, status=404)
        if not doc.vector_index_path:
            return Response({"error": "file not ingested"}, status=400)
        answer = answer_question(doc.vector_index_path, question, top_k=int(request.data.get("top_k", 4)))
        # save QA history
        QAHistory.objects.create(document=doc, question=question, answer=answer)
        return Response({"answer": answer})