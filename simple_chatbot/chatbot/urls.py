from django.urls import path
from . import views

urlpatterns = [
    path('get-answer/', views.get_answer, name='get_answer'),
]