import { useState, useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams,NavLink } from 'react-router';
import { FaPlay, FaCode } from 'react-icons/fa';
import { FaCheckCircle, FaTimesCircle, FaClock, FaMemory, FaLightbulb } from 'react-icons/fa';
import { FiArrowUpRight } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import Editor from '@monaco-editor/react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

const editorLangMap= {
    'C++' : "cpp",
    "Java":"java",
    "JavaScript":"javascript"
}
const ProblemPage = () => {
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [activeTab, setActiveTab] = useState('problem');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState('C++');
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission,setSubmission] = useState([]);
  const [viewCode,setViewCode] = useState(null);
  const editorRef = useRef(null);

  const { problemId } = useParams();
  const {user} = useSelector((state)=> state.auth);
    useEffect(() => {
      setLoading(true);
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblemData(response.data);
        updateCodeForLanguage(language, response.data.startCode);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching problem:", error);
        setCode("// Error loading problem data");
      }
    };
    fetchProblem();
  }, [problemId]);

   useEffect(() => {
      setLoading(true);
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/submission/getAllSubmissions/${problemId}`);
        setSubmission(response.data);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching problem:", error);
        setCode("// Error loading problem data");
      }
    };
    fetchProblem();
  }, [output]);

const updateCodeForLanguage = (newLanguage, startCodes) => {
    // Convert both to lowercase for case-insensitive comparison
    const startCode = startCodes?.find(sc => 
      sc.language.toLowerCase() === newLanguage.toLowerCase()
    )?.initialCode;
    
    setCode(startCode || `// Default ${newLanguage} code`);
  };
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Only update code if problemData is available
    if (problemData?.startCode) {
      updateCodeForLanguage(newLanguage, problemData.startCode);
    }
  };
  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  const handleRun = async () => {
    setIsRunning(true);
    try{
      const response = await axiosClient.post(`/submission/run/${problemId}`,{
        code,
        language
      });

      // console.log(response.data);
      setOutput(response.data);
    }
    catch(error)
    {
      console.log(error);
    }
    finally{
      setIsRunning(false);
    }
  };

  const handleSubmit = async() => {
    setIsSubmitting(true);
    try{
      const response = await axiosClient.post(`/submission/submit/${problemId}`,{
        code,
        language
      });

      // console.log(response.data);
      setOutput(response.data);
    }
    catch(error)
    {
      console.log(error);
    }
    finally{
      setActiveTab("submissions");
      setIsSubmitting(false);
    }
  };
      const handleLogout = () => {
      dispatch(logoutUser());
      setSolvedProblems([]); // Clear solved problems on logout
    };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Problem</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">No Problem Found</h2>
          <p className="text-gray-600">The requested problem doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-sm px-4">
                    <div className="flex-1">
                      <NavLink to="/" className="btn btn-ghost text-xl"><FaCode className='text-green-800'/>DSAInsights</NavLink>
                    </div>
                    <div className="flex-none gap-4">
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">
                          {user?.firstName}
                        </div>
                        <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                          <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                      </div>
                    </div>
                  </nav>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Problem Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex flex-col sm:flex-row -mb-px">
                {[
                  { label: 'Problem', value: 'problem' },
                  { label: 'Editorial', value: 'editorial' },
                  { label: 'Submissions', value: 'submissions' },
                  { label: 'Reference Code', value: 'referenceCode' },
                  { label: 'WhiteBoard', value: 'whiteboard' },
                  { label: 'AI Chat', value: 'ai' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`w-full sm:w-auto py-3 px-4 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.value
                        ? 'text-[#2F855A]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'problem' && (
                <>
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{problemData.title}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      problemData.difficulty === 'Easy'
                        ? 'shimmer-text'
                        : problemData.difficulty === 'Medium'
                          ? 'shimmer-text-green'
                          : 'shimmer-text-red'
                    }`}>
                      {problemData.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 my-4">
                    {problemData.tags.map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border border-gray-200 shimmer-text-gray">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-600 whitespace-pre-line mb-6">
                      {problemData.description}
                    </p>

                    {problemData.visibleTestCases.map((example, index) => (
                      <div key={index} className="mb-6 bg-gray-50 p-4 rounded">
                        <h4 className="font-medium text-gray-800 mb-2">Example {index + 1}:</h4>
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Input: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm block mt-1">
                            {example.input}
                          </code>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Output: </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm block mt-1">
                            {example.output}
                          </code>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Explanation: </span>
                            <p className="text-gray-600 text-sm whitespace-pre-line mt-1">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaLightbulb/>
                      <h3 className="font-medium text-gray-800">Hints</h3>
                    </div>

                    <div className="space-y-2">
                      {problemData.hints.map((hint, index) => (
                        <div 
                          key={index} 
                          className="collapse collapse-plus border border-base-300 bg-base-200"
                        >
                          <input 
                            type="checkbox"
                            className="peer"
                          /> 
                          <div className="collapse-title text-sm font-medium">
                            Hint {index + 1}
                          </div>
                          <div className="collapse-content">
                            <p className="text-sm text-gray-700">{hint}</p>
                          </div>
                        </div>
                      ))}
                     
                    </div>
                  </div>
                </>
              )}

             {activeTab === 'submissions' && (
  <>
    {submission.length === 0 ? (
      <div className="text-sm text-gray-500 py-4 px-6">No submissions found for this problem.</div>
    ) : (
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">Runtime</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">Memory</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#13643c] uppercase tracking-wider">View Code</th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submission.map((sub) => (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sub.status === 'Accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-500">{sub.language}</td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-500 flex items-center gap-1"><FaClock/> {sub.runtime}ms</td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-1">
    <FaMemory />
    {sub.memory}KB
  </span>

                </td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.createdAt).toLocaleDateString()}<br></br>
                  {new Date(sub.createdAt).toLocaleTimeString()}
                </td>
                <td className="underline px-6 py-4 whitespace-nowrap text-sm text-[#2F855A] font-semibold flex" onClick={()=> setViewCode({language:sub.language, code:sub.code })}>Code <FiArrowUpRight className='mt-1' /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
)}
               {activeTab === 'editorial' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Editorial</h3>
                </div>
              )}
               {activeTab === 'referenceCode' && (
                <div>
  <h2 className="text-xl font-bold mb-4">Reference Solutions</h2>
  <div className="space-y-6">
    {problemData.referenceCode?.length > 0 ? (
      problemData.referenceCode.map((solution, index) => (
        <>
        <h1 className='font-semibold text-[#2F855A]'>{solution?.language}</h1>
        <div key={index} className="border border-base-300 rounded-lg">
          <div className="p-4 max-h-64 overflow-y-auto border border-[#2F855A] rounded">
            <pre className="bg-base-100 p-4 rounded text-sm whitespace-pre-wrap text-gray-900">
              <code>{solution?.completeCode}</code>
            </pre>
          </div>
        </div>
        </>
      ))
    ) : (
      <p className="text-gray-500 italic">
        Solutions will be available after you solve the problem.
      </p>
    )}
  </div>
</div>
              )}
              {activeTab === 'whiteboard' && (
        <div className="h-[70vh] relative">
          <Tldraw 
            persistenceKey={`whiteboard-${problemId}-${user._id}`}
            autoFocus
            inferDarkMode
            className="absolute inset-0 rounded-lg"
          />
        </div>
      )}
            </div>
          </div>

          {/* Right Column - Editor */}

          {
            viewCode ? (
               <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="h-[80vh] border border-gray-200 rounded-md">
                <button
  onClick={()=>setViewCode(null)}
  className={`btn btn-sm px-4 py-2 rounded-md font-medium inline-flex items-center justify-center gap-2 m-2 bg-rose-900 text-white`}
>
  <IoMdCloseCircle />
  Close
</button>
<div className="h-86 border border-gray-200 rounded-md m-4">
              <Editor
                height="100%"
                defaultLanguage={editorLangMap[viewCode.language]}
                language={editorLangMap[viewCode.language]}
                theme="vs-dark"
                value={viewCode.code}
                options={{
                  readOnly:true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            </div>
              </div>
              </div>
            ):(
          <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-center">
              <button
  onClick={handleRun}
  disabled={isRunning}
  className={`btn btn-sm mr-1 px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white
  `}
>
  <FaPlay />
  {isRunning ? 'Running...' : 'Run Code'}
</button>

<button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className={`btn btn-sm px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center gap-2 bg-[#2f7d56] hover:bg-[#059669] text-white
  `}
>
  <FaCode />
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
              </div>
            </div>
            <div className='p-4'>
                <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="select select-bordered w-full max-w-xs bg-white text-gray-800 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>
              <div className="h-86 border border-gray-200 rounded-md">
              <Editor
                height="100%"
                defaultLanguage={editorLangMap[language]}
                language={editorLangMap[language]}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            </div>
          </div>
 {/* Output Section */}
{output ? (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
<div className="px-4 py-3 border border-gray-200 rounded-md bg-white shadow-sm">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-0 sm:gap-x-6 text-sm">
    <div className="flex items-center space-x-4 text-gray-700">
      {output.status === 'Accepted' ? (
        <span className="flex items-center text-green-600 font-semibold">
          <FaCheckCircle className="mr-1" />
          Accepted
        </span>
      ) : (
        <span className="flex items-center text-red-600 font-semibold">
          <FaTimesCircle className="mr-1" />
          {output.status}
        </span>
      )}

      <span className="flex items-center text-gray-600">
        <FaClock className="mr-1" />
        {output.runtime}
      </span>

      <span className="flex items-center text-gray-600">
        <FaMemory className="mr-1" />
        {output.memory}
      </span>
    </div>

    <div className="text-sm text-right text-gray-700 font-medium sm:flex sm:justify-end sm:items-center">
      {output.passedTestCases}/{output.totalTestCases} test cases passed
    </div>
  </div>
</div>
    </div>
) : (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {/* Test case tabs */}
    <div className="border-b border-gray-200 flex overflow-x-auto">
      {problemData.visibleTestCases.map((testCase, index) => (
        <button
          key={index}
          onClick={() => setActiveTestCase(index)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            index === activeTestCase
              ? 'border-b-2 border-[#2F855A] text-[#2F855A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Case {index + 1}
        </button>
      ))}
    </div>

    {/* Current test case content */}
    <div className="p-4">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Input</h4>
        <pre className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
          {problemData.visibleTestCases[activeTestCase].input}
        </pre>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1">Expected Output</h4>
        <pre className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
          {problemData.visibleTestCases[activeTestCase].output}
        </pre>
      </div>
    </div>
  </div>
)}
        </div>
            )
}
      </div>
      </div>
    </div>
  );
};

export default ProblemPage