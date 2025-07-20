# resume_parser_app/models.py
from django.db import models

class Resume(models.Model):
    # Basic fields
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # Parsed fields
    full_text = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    skills = models.TextField(blank=True, null=True) # Storing as comma-separated string
    education = models.TextField(blank=True, null=True) # Storing as text block
    experience = models.TextField(blank=True, null=True) # Storing as text block

    def __str__(self):
        return self.name if self.name else f"Resume {self.id}"
