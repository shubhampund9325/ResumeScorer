# resume_parser_app/views.py
import io
import re
import docx
from pdfminer.high_level import extract_text
import spacy
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Resume
from api.serializers import ResumeSerializer

# Load spaCy model once
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model 'en_core_web_sm'...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def extract_text_from_docx(file):
    """Extracts text from a DOCX file."""
    doc = docx.Document(file)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_text_from_pdf(file):
    """Extracts text from a PDF file."""
    file.seek(0)
    file_bytes = file.read()
    file_stream = io.BytesIO(file_bytes)
    text = extract_text(file_stream)
    return text

def clean_text(text):
    """Cleans the extracted text by removing tags, extra spaces, and non-ASCII characters."""
    # Remove HTML/XML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)
    # Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    return text.strip()

def parse_resume_content(text):
    """
    Parses the cleaned resume text to extract professional information.
    Uses spaCy for named entity recognition and regex for specific patterns.
    """
    doc = nlp(text)

    # 1. Extract Name (using spaCy's PERSON entity)
    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Heuristic: Often the first PERSON entity in a resume is the name
            name = ent.text
            # Simple filtering for common non-name entities that might be tagged as PERSON
            if len(name.split()) > 1 and not any(keyword in name.lower() for keyword in ["experience", "education", "skills"]):
                break
            else:
                name = None # Reset if it looks like a false positive

    # Fallback for name if spaCy doesn't find it
    if not name:
        # Try to find a common name pattern at the beginning of the document
        match = re.search(r'^[A-Z][a-z]+(?: [A-Z][a-z]+){1,3}', text)
        if match:
            name = match.group(0)

    # 2. Extract Email
    email = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    email = email.group(0) if email else None

    # 3. Extract Phone Number (common formats)
    phone = re.search(r'(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}', text)
    phone = phone.group(0) if phone else None
    # Clean phone number (remove spaces, dashes, parentheses)
    if phone:
        phone = re.sub(r'[\s\(\)\-]', '', phone)


    # 4. Extract Skills (simple keyword matching for demonstration)
    # In a real-world scenario, you'd have a much larger, domain-specific list
    # or use more advanced NLP techniques (e.g., text classification, custom NER).
    keywords = [
        "Python", "Java", "C++", "JavaScript", "React", "Angular", "Vue.js", "Django", "Flask",
        "Node.js", "Express.js", "SQL", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure",
        "GCP", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "REST API", "Machine Learning",
        "Deep Learning", "TensorFlow", "PyTorch", "Data Analysis", "Pandas", "NumPy",
        "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Linux", "Windows", "Networking",
        "Cybersecurity", "Project Management", "Communication", "Leadership", "Problem Solving"
    ]
    found_skills = []
    text_lower = text.lower()
    for keyword in keywords:
        if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower):
            found_skills.append(keyword)
    skills = ", ".join(sorted(list(set(found_skills)))) # Remove duplicates and sort

    # 5. Extract Education
    education_section = ""
    # Look for common section headers
    edu_match = re.search(r'(?i)(education|academic background|qualifications)\s*([\s\S]*?)(?=(work experience|experience|skills|projects|awards|references|$))', text)
    if edu_match:
        education_section = edu_match.group(2).strip()
    # Further refine by looking for degrees/universities within the section
    # This is a basic example; complex parsing would involve more regex/NLP
    degrees = re.findall(r'(?i)(b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor|master|doctorate|associate)\s+in\s+[\w\s&,]+(?:from|at)?[\w\s,.-]+(?:university|college|institute)', education_section)
    if not education_section and degrees: # If no section found, but degrees are
        education_section = "\n".join(degrees)
    elif not education_section:
        # Fallback: try to find common education patterns anywhere
        edu_patterns = re.findall(r'(?i)(?:university|college|institute|academy)\s+[\w\s,.-]+(?:\d{4})?', text)
        if edu_patterns:
            education_section = "\n".join(edu_patterns)


    # 6. Extract Experience
    experience_section = ""
    exp_match = re.search(r'(?i)(work experience|experience|employment history|professional experience)\s*([\s\S]*?)(?=(education|skills|projects|awards|references|$))', text)
    if exp_match:
        experience_section = exp_match.group(2).strip()
    # Further refine by looking for job titles/companies/dates
    # This is a basic example; complex parsing would involve more regex/NLP
    job_titles = re.findall(r'(?i)(?:[A-Z][a-z]+\s+){1,3}(?:engineer|developer|manager|analyst|specialist|architect|consultant|director)', experience_section)
    companies = re.findall(r'(?i)(?:at|for)\s+([A-Z][a-zA-Z\s,.-]+(?:Inc|LLC|Corp|Ltd|\.))', experience_section)
    dates = re.findall(r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(?:Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b', experience_section)

    if not experience_section and (job_titles or companies or dates):
        experience_section = "\n".join(list(set(job_titles + companies + dates))) # Combine and deduplicate
    elif not experience_section:
        # Fallback: try to find common experience patterns anywhere
        exp_patterns = re.findall(r'(?i)(?:company|organization)\s+[\w\s,.-]+(?:\d{4})?', text)
        if exp_patterns:
            experience_section = "\n".join(exp_patterns)


    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": education_section,
        "experience": experience_section,
        "full_text": text
    }


class ResumeParseView(APIView):
    """
    API endpoint for uploading and parsing resumes.
    Handles both PDF and DOCX files.
    """
    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']

        text_content = ""
        if uploaded_file.name.endswith(".pdf"):
            try:
                text_content = extract_text_from_pdf(uploaded_file)
            except Exception as e:
                return Response({"error": f"Error extracting text from PDF: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        elif uploaded_file.name.endswith(".docx"):
            try:
                text_content = extract_text_from_docx(uploaded_file)
            except Exception as e:
                return Response({"error": f"Error extracting text from DOCX: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Unsupported file format. Only PDF and DOCX are supported."}, status=status.HTTP_400_BAD_REQUEST)

        cleaned_text = clean_text(text_content)
        parsed_data = parse_resume_content(cleaned_text)

        # Create and save the Resume instance
        resume_instance = Resume(
            file=uploaded_file,
            full_text=parsed_data.get("full_text"),
            name=parsed_data.get("name"),
            email=parsed_data.get("email"),
            phone=parsed_data.get("phone"),
            skills=parsed_data.get("skills"),
            education=parsed_data.get("education"),
            experience=parsed_data.get("experience")
        )
        try:
            resume_instance.save()
        except Exception as e:
            return Response({"error": f"Error saving resume to database: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = ResumeSerializer(resume_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

