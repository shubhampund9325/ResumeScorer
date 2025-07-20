const ResumeParsing = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      setParsedData(null);
      setMessage(null);
    };
  
    const handleUpload = async () => {
      if (!selectedFile) {
        setMessage({ text: "Please select a file first.", type: "error" });
        return;
      }
  
      setLoading(true);
      setMessage(null);
      setParsedData(null);
  
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/upload/', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong during upload.');
        }
  
        const data = await response.json();
        setParsedData(data);
        setMessage({ text: "Resume parsed successfully!", type: "success" });
      } catch (err) {
        console.error("Upload error:", err);
        setMessage({ text: err.message || "Failed to parse resume. Please try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Resume Parser</h1>
            <p className="mt-2 text-sm text-gray-600">Upload your resume to extract key information</p>
          </div>
  
         
        </div>
      </div>
    );
  };
  