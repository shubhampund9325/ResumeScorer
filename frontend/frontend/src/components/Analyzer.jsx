// import React, { useState, useEffect } from 'react';

// const MessageBox = ({ message, type, onClose }) => {
//   const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
//   const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
//   const borderColor = type === 'error' ? 'border-red-400' : 'border-green-400';

//   return (
//     <div className={`mt-6 p-4 ${bgColor} border ${borderColor} ${textColor} rounded-lg flex justify-between items-center animate-fade-in`}>
//       <p className="font-semibold">{message}</p>
//       <button onClick={onClose} className="text-lg font-bold px-2 py-1 rounded-full hover:bg-gray-200 transition-colors">
//         &times;
//       </button>
//     </div>
//   );
// };

// // Main App component
// const ResumeParsing = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [parsedData, setParsedData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null); // For success/error messages
//   const [showParsedData, setShowParsedData] = useState(false); // State to trigger fade-in

//   // Handle file selection
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setParsedData(null); // Clear previous data
//     setMessage(null);    // Clear previous messages
//     setShowParsedData(false); // Hide parsed data
//   };

//   // Handle file upload
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setMessage({ text: "Please select a file first.", type: "error" });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     setParsedData(null);
//     setShowParsedData(false); // Ensure it's hidden before new data arrives

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       // Replace with your Django backend URL
//       const response = await fetch('http://127.0.0.1:8000/api/upload/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Something went wrong during upload.');
//       }

//       const data = await response.json();
//       setParsedData(data);
//       setMessage({ text: "Resume parsed successfully!", type: "success" });
//       setShowParsedData(true); // Trigger fade-in
//     } catch (err) {
//       console.error("Upload error:", err);
//       setMessage({ text: err.message || "Failed to parse resume. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to render text blocks with newlines
//   const renderTextBlock = (text) => {
//     if (!text) return <p className="text-gray-500 italic">Not available</p>;
//     // Split by common newline patterns and render each as a paragraph
//     return text.split(/[\r\n]+/).map((line, index) => (
//       line.trim() ? <p key={index} className="mb-1 last:mb-0">{line.trim()}</p> : null
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center py-10 font-sans">
//       {/* Custom CSS for animations */}
//       <style>
//         {`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes popIn {
//           from { opacity: 0; transform: scale(0.8); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         @keyframes pulseBorder {
//           0% { border-color: #93c5fd; }
//           50% { border-color: #60a5fa; }
//           100% { border-color: #93c5fd; }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.5s ease-out forwards;
//         }
//         .animate-pop-in {
//           animation: popIn 0.3s ease-out forwards;
//         }
//         .animate-pulse-border {
//           animation: pulseBorder 2s infinite alternate;
//         }
//         .button-press-effect:active {
//           transform: scale(0.98);
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }
//         `}
//       </style>

//       <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-200">
//         <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
//           Intelligent Resume Parser
//         </h1>
       

//         <div className="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-xl text-center bg-blue-50 hover:border-blue-500 transition-all duration-300 ease-in-out cursor-pointer animate-pulse-border">
//           <label htmlFor="file-upload" className="block text-blue-700 hover:text-blue-900 font-semibold text-lg transition duration-300 ease-in-out">
//             <input
//               id="file-upload"
//               type="file"
//               accept=".pdf,.docx"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//             {selectedFile ? (
//               <p className="text-xl text-gray-800">Selected: <span className="font-bold text-blue-800">{selectedFile.name}</span></p>
//             ) : (
//               <p className="text-xl">Drag & drop your resume here, or <span className="underline">click to browse</span></p>
//             )}
//           </label>
//           <p className="text-sm text-gray-500 mt-2">Accepted formats: PDF, DOCX</p>
//         </div>

//         <button
//           onClick={handleUpload}
//           disabled={loading || !selectedFile}
//           className={`w-full py-4 px-6 rounded-xl text-white font-bold text-xl transition duration-300 ease-in-out button-press-effect
//             ${loading || !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl'}`}
//         >
//           {loading ? 'Parsing...' : 'Parse Resume'}
//         </button>

//         {message && (
//           <MessageBox
//             message={message.text}
//             type={message.type}
//             onClose={() => setMessage(null)}
//           />
//         )}

//         {parsedData && showParsedData && (
//           <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200 animate-fade-in">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-3 border-blue-200">Parsed Resume Data</h2>

//             {/* Basic Information Table */}
//             <div className="mb-8 overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//                 <thead>
//                   <tr className="bg-blue-50 border-b">
//                     <th className="py-3 px-4 text-left text-base font-semibold text-gray-700 uppercase tracking-wider rounded-tl-lg">Field</th>
//                     <th className="py-3 px-4 text-left text-base font-semibold text-gray-700 uppercase tracking-wider rounded-tr-lg">Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="border-b last:border-b-0 hover:bg-gray-100 transition-colors">
//                     <td className="py-3 px-4 font-medium text-gray-800">Name</td>
//                     <td className="py-3 px-4 text-gray-700">{parsedData.name || <span className="italic text-gray-500">Not available</span>}</td>
//                   </tr>
//                   <tr className="border-b last:border-b-0 hover:bg-gray-100 transition-colors">
//                     <td className="py-3 px-4 font-medium text-gray-800">Email</td>
//                     <td className="py-3 px-4 text-gray-700">{parsedData.email || <span className="italic text-gray-500">Not available</span>}</td>
//                   </tr>
//                   <tr className="border-b last:border-b-0 hover:bg-gray-100 transition-colors">
//                     <td className="py-3 px-4 font-medium text-gray-800">Phone</td>
//                     <td className="py-3 px-4 text-gray-700">{parsedData.phone || <span className="italic text-gray-500">Not available</span>}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Skills Analysis */}
//             <div className="mb-8 p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '0.1s' }}>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Skills Analysis</h3>
//               {parsedData.skills ? (
//                 <div className="flex flex-wrap gap-2">
//                   {parsedData.skills.split(',').map((skill, index) => (
//                     <span key={index} className="inline-block bg-blue-100 text-blue-800 text-base font-medium px-4 py-1.5 rounded-full shadow-sm hover:bg-blue-200 transition-colors animate-pop-in" style={{ animationDelay: `${0.05 * index}s` }}>
//                       {skill.trim()}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 italic">No skills identified.</p>
//               )}
//             </div>

//             {/* Experience Analysis */}
//             <div className="mb-8 p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Experience Analysis</h3>
//               {parsedData.experience ? (
//                 <div className="space-y-4 text-gray-700 leading-relaxed">
//                   {renderTextBlock(parsedData.experience)}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 italic">No experience details found.</p>
//               )}
//             </div>

//             {/* Education */}
//             <div className="mb-8 p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Education</h3>
//               {parsedData.education ? (
//                 <div className="space-y-4 text-gray-700 leading-relaxed">
//                   {renderTextBlock(parsedData.education)}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 italic">No education details found.</p>
//               )}
//             </div>

//             {/* Certifications (Placeholder) */}
//             <div className="mb-8 p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Certifications</h3>
//               <p className="text-gray-500 italic">
//                 Certifications parsing requires more advanced NLP. This section is a placeholder.
//               </p>
//               {/* Example of how you might display if parsed:
//               <ul className="list-disc list-inside text-gray-700 space-y-1">
//                 <li>Certified Scrum Master</li>
//                 <li>AWS Certified Solutions Architect</li>
//               </ul>
//               */}
//             </div>

//             {/* Achievements (Placeholder) */}
//             <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in" style={{ animationDelay: '0.5s' }}>
//               <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Achievements</h3>
//               <p className="text-gray-500 italic">
//                 Achievements parsing requires more advanced NLP. This section is a placeholder.
//               </p>
//               {/* Example of how you might display if parsed:
//               <ul className="list-disc list-inside text-gray-700 space-y-1">
//                 <li>Increased team productivity by 20%</li>
//                 <li>Led successful migration project</li>
//               </ul>
//               */}
//             </div>

//             {/* Full Extracted Text (for debugging/reference) */}
//             {parsedData.full_text && (
//               <div className="border-t pt-6 mt-10 border-gray-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>
//                 <p className="text-xl font-semibold text-gray-700 mb-3">Full Extracted Text (for reference):</p>
//                 <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 max-h-60 overflow-y-auto whitespace-pre-wrap border border-gray-300">
//                   {parsedData.full_text}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };