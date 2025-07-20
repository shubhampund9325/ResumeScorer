# resume_parser_app/serializers.py
from rest_framework import serializers
from .models import Resume # Correct relative import

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'