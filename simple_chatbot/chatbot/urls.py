from django.urls import path
from .views import UploadView, IngestView, QueryView

urlpatterns = [
    path("upload/", UploadView.as_view(), name="upload"),
    path("ingest/", IngestView.as_view(), name="ingest"),
    path("query/", QueryView.as_view(), name="query"),
]