import React, { useState } from 'react';
import '../components/ResumeParsing.css';

// Chart.js
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Gemini AI
import { GoogleGenerativeAI } from '@google/generative-ai';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MessageBox = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200';

  return (
    <div className={`mt-6 p-4 ${bgColor} border ${borderColor} ${textColor} rounded-lg flex items-start justify-between`}>
      <div className="flex items-start">
        <p className="ml-3 font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-lg font-bold text-gray-500 hover:text-gray-700 transition">
        &times;
      </button>
    </div>
  );
};

const ResumeParsing = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setParsedData(null);
    setMessage(null);
    setAnalysis(null);
    setAiFeedback(null);
  };

  // Render text block with line breaks
  const renderTextBlock = (text) => {
    if (!text) return <p className="text-gray-400">Not available</p>;
    return text.split(/[\r\n]+/).map((line, index) =>
      line.trim() ? <p key={index} className="mb-1 last:mb-0">{line.trim()}</p> : null
    );
  };

  // Handle file upload to backend
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

  // Handle resume analysis with Gemini
  const handleAnalyze = async () => {
    if (!parsedData) return;

    setIsAnalyzing(true);

    // Mock analysis scores
    setAnalysis({
      skillsMatch: 75,
      experienceScore: 80,
      keywordsMatch: 65,
    });

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBc1q_jtHKuXYnkZhyCsNCoZ5hKl5Wgkh0");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Analyze the following resume and provide actionable feedback:
        Name: ${parsedData.name || "N/A"}
        Skills: ${parsedData.skills || "None"}
        Experience: ${parsedData.experience || "None"}
        Education: ${parsedData.education || "None"}
        
        Please provide:
        - Flaws in the resume
        - Suggestions for improvement
        - Example of how to rephrase a weak section
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setAiFeedback(text);
    } catch (err) {
      console.error("AI analysis failed:", err);
      setAiFeedback("Failed to fetch AI insights.");
    }

    setIsAnalyzing(false);
  };

  // Chart configuration
  const chartData = {
    labels: ['Skills Match', 'Experience Score', 'Keywords Match'],
    datasets: [
      {
        label: 'Resume Score (%)',
        data: [analysis?.skillsMatch || 0, analysis?.experienceScore || 0, analysis?.keywordsMatch || 0],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Resume Analysis Score',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Parser & Analyzer</h1>
          <p className="mt-2 text-sm text-gray-600">Upload your resume and get AI-powered insights</p>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Upload Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <label htmlFor="file-upload" className="cursor-pointer text-center">
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedFile ? (
                        <span className="font-medium text-blue-600">{selectedFile.name}</span>
                      ) : (
                        <>
                          <span className="font-medium">Drag & drop your resume or </span>
                          <span className="text-blue-600 hover:text-blue-500">browse</span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF or DOCX files up to 5MB
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>
  
                <button
                  onClick={handleUpload}
                  disabled={loading || !selectedFile}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !selectedFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Parse Resume'}
                </button>
              </div>
            </div>
  
            {/* Results Section */}
            {message && (
              <div className={`mt-6 p-4 ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'} border rounded-lg flex justify-between items-center`}>
                <p className="font-medium">{message.text}</p>
                <button onClick={() => setMessage(null)} className="text-lg font-bold">&times;</button>
              </div>
            )}
  
            {parsedData && (
              <div className="divide-y divide-gray-200">
                {/* Basic Info */}
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Candidate Info</h2>
                  <div className="mt-3 grid grid-cols-1 gap-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1 text-sm text-gray-900">{parsedData.name || "Not available"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 text-sm text-gray-900">{parsedData.email || "Not available"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <div className="mt-1 text-sm text-gray-900">{parsedData.phone || "Not available"}</div>
                    </div>
                  </div>
                </div>
  
                {/* Skills */}
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                  <div className="mt-2">
                    {parsedData.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.split(',').map((skill, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No skills found</p>
                    )}
                  </div>
                </div>
  
                {/* Experience */}
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Experience</h2>
                  <div className="mt-2 text-sm text-gray-600">
                    {parsedData.experience ? parsedData.experience.split('\n').map((line, i) => <p key={i}>{line}</p>) : "Not available"}
                  </div>
                </div>
  
                {/* Education */}
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Education</h2>
                  <div className="mt-2 text-sm text-gray-600">
                    {parsedData.education ? parsedData.education.split('\n').map((line, i) => <p key={i}>{line}</p>) : "Not available"}
                  </div>
                </div>
              </div>
            )}
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Parsed Resume Data */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Parsed Resume Data</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Name:</h3>
                <p>{parsedData?.name || "Not available"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Email:</h3>
                <p>{parsedData?.email || "Not available"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Phone:</h3>
                <p>{parsedData?.phone || "Not available"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Skills:</h3>
                {parsedData?.skills ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {parsedData.skills.split(',').map((skill, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Not available</p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Experience:</h3>
                {renderTextBlock(parsedData?.experience)}
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Education:</h3>
                {renderTextBlock(parsedData?.education)}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className={`mt-6 w-full py-2 px-4 rounded-md text-white ${
                loading || !selectedFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Parse Resume'}
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !parsedData}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white ${
                isAnalyzing || !parsedData
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>

          {/* Right Panel: Graph + AI Feedback */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}

            {analysis ? (
              <>
                <div className="h-64">
                  <Bar data={chartData} options={options} />
                </div>
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">AI Insights:</h3>
                  {aiFeedback ? (
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {aiFeedback}
                    </pre>
                  ) : (
                    <p className="text-gray-500">Generating AI insights...</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Click 'Analyze Resume' to see graphical insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeParsing;