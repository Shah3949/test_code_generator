// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [files, setFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [summaries, setSummaries] = useState([]);
//   const [generatedCode, setGeneratedCode] = useState("");

//   const fetchFiles = async () => {
//     const res = await axios.get("http://localhost:5000/files", {
//       params: { owner: "Shah3949", repo: "test-case-demo" } // change
//     });
//     setFiles(res.data);
//   };

//   const getSummaries = async () => {
//     if (!selectedFile) return;
//     const fileRes = await axios.get(selectedFile.download_url);
//     const res = await axios.post("http://localhost:5000/summaries", {
//       fileContents: fileRes.data
//     });
//     setSummaries(res.data.candidates[0].content.parts.map(p => p.text));
//   };

//   const generateCode = async (summary) => {
//     const fileRes = await axios.get(selectedFile.download_url);
//     const res = await axios.post("http://localhost:5000/generate", {
//       summary,
//       fileContents: fileRes.data
//     });
//     setGeneratedCode(res.data.candidates[0].content.parts[0].text);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Test Case Generator</h1>
//       <button onClick={fetchFiles}>Fetch Files</button>

//       <ul>
//         {files.map(f => (
//           <li key={f.sha}>
//             {f.name} <button onClick={() => setSelectedFile(f)}>Select</button>
//           </li>
//         ))}
//       </ul>

//       {selectedFile && <button onClick={getSummaries}>Generate Summaries</button>}

//       <ul>
//         {summaries.map((s, i) => (
//           <li key={i}>
//             {s} <button onClick={() => generateCode(s)}>Generate Code</button>
//           </li>
//         ))}
//       </ul>

//       {generatedCode && (
//         <pre style={{ background: "#eee", padding: 10 }}>
//           {generatedCode}
//         </pre>
//       )}
//     </div>
//   );
// }

// export default App;



import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [copied, setCopied] = useState(false);




  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/files", {
        params: { owner: username, repo: repoName } // change
      });
      setFiles(res.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };


  const getSummaries = async () => {
    if (!selectedFile) return;
    try {
      const fileRes = await axios.get(selectedFile.download_url);
      const res = await axios.post("http://localhost:5000/summaries", {
        fileContents: fileRes.data
      });

      const parts = res?.data?.candidates?.[0]?.content?.parts || [];
      setSummaries(parts.map(p => p.text || "").filter(Boolean));
    } catch (error) {
      console.error("Error generating summaries:", error);
      alert("Failed to generate summaries");
    }
  };

  const generateCode = async (summary) => {
    if (!selectedFile) return;
    try {
      const fileRes = await axios.get(selectedFile.download_url);
      const res = await axios.post("http://localhost:5000/generate", {
        summary,
        fileContents: fileRes.data
      });

      const code = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setGeneratedCode(code);
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Failed to generate code");
    }
  };

  const selectFile = (file) => {
    setSelectedFile(file);
    setSummaries([]);
    setGeneratedCode("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 8000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Case Generator</h1>
          <p className="text-gray-600">Generate intelligent test cases from your code files</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Files & Summaries */}
          <div className="space-y-6">
            {/* {custom user and repo} */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col justify-between ">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-2">
                  User Name
                </h2>
                <input
                  type="text"
                  placeholder="Enter github username"
                  className="border border-gray-800 px-5 py-3 rounded-xl"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <h2 className="text-xl font-semibold text-gray-800 flex items-center m-2">
                  Repo Name
                </h2>
                <input
                  type="text"
                  placeholder="Enter github repo name"
                  className="border border-gray-800 px-5 py-3 rounded-xl"
                  onChange={(e) => setRepoName(e.target.value)}
                />
              </div>
            </div>
            {/* Fetch Files Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Repository Files
                </h2>
                <button
                  onClick={fetchFiles}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Fetch Files</span>
                </button>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto ">
                  {files.map(f => (
                    <div
                      key={f.sha}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${selectedFile?.sha === f.sha
                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-gray-700 truncate">{f.name}</span>
                      </div>
                      <button
                        onClick={() => selectFile(f)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${selectedFile?.sha === f.sha
                          ? 'bg-blue-500 text-white cursor-pointer'
                          : 'bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 cursor-pointer'
                          }`}
                      >
                        {selectedFile?.sha === f.sha ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summaries Section */}
            {selectedFile && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Code Summaries
                  </h2>
                  <button
                    onClick={getSummaries}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Summaries</span>
                  </button>
                </div>

                {summaries.length > 0 && (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {summaries.map((s, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                        <p className="text-gray-700 mb-3 leading-relaxed">{s}</p>
                        <button
                          onClick={() => generateCode(s)}
                          className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2 text-sm cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span>Generate Code</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Generated Code */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            {generatedCode && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Generated Test Code
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                </div>

                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed font-mono shadow-inner max-h-screen overflow-y-auto border">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {!generatedCode && selectedFile && summaries.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Generate</h3>
                <p className="text-gray-500">Generate summaries first, then create your test code</p>
              </div>
            )}

            {!selectedFile && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Get Started</h3>
                <p className="text-gray-500">Fetch files and select one to begin generating test cases</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
