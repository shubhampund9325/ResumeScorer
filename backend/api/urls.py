# scorer_app/urls.py
from django.urls import path
from .views import ResumeUploadAPI

urlpatterns = [
    
    path('upload/', ResumeUploadAPI.as_view(),name='score_resume')
]

# backend/urls.py

