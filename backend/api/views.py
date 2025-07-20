from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from backend.resume_parser import extract_text_from_pdf, extract_text_from_docx, clean_text, parse_resume_content

class ResumeUploadAPI(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=400)
        try:
            if file.name.endswith('.pdf'):
                text_content = extract_text_from_pdf(file)
            elif file.name.endswith('.docx'):
                file.seek(0)  # Ensure pointer is at start for docx
                text_content = extract_text_from_docx(file)
            else:
                return Response({"error": "Unsupported file format. Only PDF and DOCX are supported."}, status=400)
            cleaned_text = clean_text(text_content)
            parsed_data = parse_resume_content(cleaned_text)
            return Response(parsed_data)
        except Exception as e:
            return Response({"error": f"Failed to parse resume: {str(e)}"}, status=500)
