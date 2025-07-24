import {useState,useEffect,useRef} from "react";
import { useDispatch,useSelector } from "react-redux";
import { useParams,NavLink } from "react-router";
import { FaPlay,FaCode,FaCheckCircle,FaClock,FaMemory, FaLightbulb } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { FaRegTimesCircle } from "react-icons/fa";
import ChatAi from '../components/ChatAi';
import { Tldraw } from "tldraw"; //for whiteboard
import { Editor } from "@monaco-editor/react"; //for code editor
// CSS
import 'tldraw/tldraw.css';
import axiosClient from "../utils/axiosClient";

const editorLangMap={
    "C++":"cpp",
    "Java":"java",
    "JavaScript":"javascript"
}

const ProblemInfo = () =>{
    const [problemData,setProblemData] = useState(null);
    const [solvedProblems,setSolvedProblems] = useState(null);
    const [activeTab,setActiveTab] = useState('problem');
    const [activeTestCase,setActiveTestCase]=useState(0);
    const [language,setLanguage] = useState('C++');
    const [code,setCode] = useState('');
    const [output,setOutput] = useState(null);
    const [isRunning,setIsRunning] = useState(false);
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [submissions,setSubmission] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [viewCode,setViewCode] = useState(null);
    const [menuOpen,setMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const editorRef = useRef(false);
    const {user} = useSelector((state)=>state.auth);
    const {problemId} = useParams();

    // To fetch the problem Info
    useEffect(()=>{
        setLoading(true);
        const fetchProblem = async() =>{
            try{
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                console.log(response.data);
                setProblemData(response.data);
                updateCodeForLanguage(language,response.data.startCode);
            }
            catch(error){
                setError(error);
            }
            finally{
                setLoading(false);
            }
        }

        fetchProblem();
    },[problemId]);

    // To fetch all the submissions of user when page loaded
    useEffect(()=>{
        setLoading(true);
        const fetchSubmissions = async() =>{
            try{
                const response = await axiosClient.get(`/submission/getProblemSubmissions/${problemId}`);
                setSubmission(response.data);
            }
            catch(error){
                setError(error);
            }
            finally{
                setLoading(false);
            }
        }

        fetchSubmissions();
    },[output]);

    // method to update the starter code as per language
    const updateCodeForLanguage = (lang,startCodes) =>{
        console.log(startCodes);
        const startCode = startCodes.find(sc=> sc.language.toLowerCase() === lang.toLowerCase())?.initialCode;

        setCode(startCode || `Default ${lang} code`);
    }

    // method to handle language change
    const handleLanguageChange = (e) =>{
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        // update the problem start code as well
        if(problemData?.startCode)
            updateCodeForLanguage(newLanguage,problemData?.startCode);
    }

    // code editor useRef handlers to presist the value written on editor even after component renders
    const handleEditorChange= (value) =>{
        setCode(value || '');
    }

    const handleEditorDidMount = (editor) =>{
        editorRef.current = editor;
    }

    // api endpoint to handle run
    const runCode = async() =>{
        setIsRunning(true);
        try{
            const response = await axiosClient.post(`/submission/run/${problemId}`,{
                code,
                language
            });

            setOutput(response.data);
        }
        catch(error)
        {
            setError(error);
        }
        finally{
            setIsRunning(false);
        }
    }

    // api endpoint to handle submit
    const submitCode = async() =>{
        setIsSubmitting(true);
        try{
            const response = await axiosClient.post(`/submission/submit/${problemId}`,{
                code,
                language
            });

            setOutput(response.data);
        }
        catch(error)
        {
            setError(error);
        }
        finally{
            setActiveTab("submissions");
            setIsSubmitting(false);
        }
    }
    // if loading case return loading effect
    if(loading)
    {
        return(
            <div className="min h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // if error case return error
    if(error)
    {
        return(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-lg shadow-md p-6">
                    <h2 className="font-bold text-xl text-red-600 mb-2">Error Loading</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={()=> window.location.reload()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Retry</button>
                </div>
            </div>
        )
    }

    // if problemData is not fetched they display error
    if(!problemData)
    {
        return(
            <div className="min h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-bold text-gray-800 text-xl">No Problem Found</h2>
                    <p className="text-gray-600">The requested problem doesn't exist or may have been removed.</p>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition duration-300">
            {/* Main Content to display problem Info */}
            <div className="mt-14 max-w-8xl mx-auto sm:px-6 lg:px-8 py-6">
                {/* Two cols problem info , code editor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left col */}
                 <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800/90 backdrop-blur-xl dark:border dark:border-gray-700 dark:shadow-gray-900/50 transition duration-300">
                        <div className="broder-gray-200">
                            <nav className="flex flex-col sm:flex-row -mb-px">
                                {[
                                    {label:'Problem',value:'problem'},
                                    {label:'Submissions',value:'submissions'},
                                    {label:'Reference Code',value:'referenceCode'},
                                    {label:'WhiteBoard',value:'whiteboard'},
                                    {label:'AI Chat',value:'ai'},
                                ].map((tab)=>(
                                     <button
    key={tab.value}
    onClick={() => setActiveTab(tab.value)}
    className={`px-4 py-2 transition-all duration-200 ${
     activeTab === tab.value
  ? 'text-indigo-800 border-b-2 border-indigo-900 font-semibold dark:text-white dark:border-white'
       :'text-indigo-700 hover:text-indigo-800 border-b-2 border-transparent hover:border-indigo-900 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-gray-300'
          }`}
  >
    {tab.label}
  </button>
))}                       
                            </nav>
                        </div>
                        <div className="p-6">
                            {/* problem tab */}
{
    activeTab == 'problem' && (
        <>
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{problemData.title}</h2>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    problemData.difficulty === 'Easy' ? 'shimmer-text-green' : 
                    problemData.difficulty === 'Medium' ? 'shimmer-text' : 'shimmer-text-red'
                }`}>
                    {problemData.difficulty}
                </span>
            </div>

            <div className="flex flex-wrap gap-2 my-4">
                {problemData.tags.map((topic, index) => (
                    <span 
                        key={index} 
                         className="font-semibold px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded 
                        border border-gray-200 dark:bg-gray-800 dark:border-white dark:text-white">
                        {topic}
                    </span>
                ))}
            </div>

            <div className="mt-6">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line mb-6">{problemData.description}</p>

                {problemData.visibleTestCases.map((example, index) => (
                    <div key={index} className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Example {index + 1}</h4>
                        <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Input: </span>
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm block mt-1 text-gray-900 dark:text-gray-200">
                                {example.input}
                            </code>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output: </span>
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm block mt-1 text-gray-900 dark:text-gray-200">
                                {example.output}
                            </code>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Explanation: </span>
                            <p className="text-gray-900 dark:text-gray-200 text-sm whitespace-pre-line mt-1">
                                {example.explanation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <div className="bg-base-200 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Constraints</h4>
                    <p className="text-base text-gray-800 dark:text-gray-300">{problemData.constraints}</p>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                    <FaLightbulb className="text-gray-700 dark:text-gray-300" />
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Hints</h3>
                </div>

                <div className="space-y-2">
                    {problemData.hints.map((hint, index) => (
                        <div key={index+1} className="collapse collapse-plus border border-base-300 dark:border-gray-700 bg-base-200 dark:bg-gray-800">
                            <input type="checkbox" className="peer" />
                            <div className="collapse-title text-sm font-medium dark:text-gray-200">Hint {index + 1}</div>
                            <div className="collapse-content">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{hint}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

                            {/* submission tab code */}
                            {
                                activeTab === 'submissions' && (
                                    <>
                                    {submissions.length === 0 ? (
      <div className="text-sm text-gray-500 py-4 px-6">No submissions found for this problem.</div>
                                    ):(
                                        <div className="overflow-x-auto scrollbar-hide">
                                            <table className="min-w-full divide-y divide-gray-200 rounded-3xl">
                                                <thead className="bg-gray-50">
                                                   <tr className="bg-indigo-50 border-b border-indigo-200">
                                                {["Status", "Language", "Runtime", "Memory", "Date", "View Code"].map((heading, i) => (
                                                    <th
                                                    key={i}
                                                    className="text-indigo-700 uppercase tracking-wider px-6 py-3 text-left text-xs font-bold"
                                                    >
                                                    {heading}
                                                    </th>
                                                ))}
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {
                                                        submissions.map((sub)=>(
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status==='Accepted'? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{sub.status}</span>
                                                                </td>
                                                                <td className="font-semibold whitespace-nowrap text-sm text-gray-500 px-6 py-4">{sub.language}</td>
                                                                <td className="font-semibold whitespace-nowrap text-sm text-gray-500 px-6 py-4 flex items-center gap-1"><FaClock/>{sub.runtime}ms</td>
                                                                <td className="font-semibold whitespace-nowrap text-sm text-gray-500 px-6 py-4">
                                                                    <span className="flex items-center gap-1"><FaMemory/>{sub.memory}KB</span></td>
                                                                <td className="font-semibold whitespace-nowrap text-sm text-gray-500 px-6 py-4">
                                                                 {new Date(sub.createdAt).toLocaleDateString()}<br></br>
                                                                 {new Date(sub.createdAt).toLocaleTimeString()}
                                                                </td>
                                                                <td className="underline px-6 py-4 whitespace-nowrap text-sm text-indigo-800 font-semibold flex" onClick={()=>setViewCode({language:sub.language,code:sub.code})}>Code <FiArrowUpRight className="mt-1"/></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    </>
                                )
                            }
                            {/* Reference Solution tab */}
                            {
                                activeTab=='referenceCode' && (
                                    <>
                                    <h2 className="font-bold text-xl mb-4 dark:text-white">Reference Solutions</h2>
                                    <div className="space-y-6">
                                        {
                                            problemData?.referenceCode?.length > 0 ? (
                                                problemData.referenceCode.map((solution,index)=>(
                                                    <>
                                                   <h1 className="inline-block px-3 py-1 mb-3 text-sm font-semibold text-white bg-indigo-700 rounded-full shadow-sm">
  {solution.language}
</h1>

<div key={index} className="border border-indigo-800 rounded-lg shadow-sm bg-white transition hover:shadow-md">
  <div className="p-4 max-h-64 overflow-y-auto rounded-lg">
    <pre className="bg-white p-4 rounded-md text-sm whitespace-pre-wrap text-gray-800 font-mono overflow-x-auto">
      <code>{solution?.completeCode}</code>
    </pre>
  </div>
</div>

                                                    </>
                                                ))
                                            ):(
                                                <p className="text-gray-500 font-semibold">
                                                    Solutions will be soon posted...
                                                </p>
                                            )
                                        }
                                    </div>
                                    </>
                                )
                            }

                            {/* WhiteBoard tab */}
                            {
                                activeTab=='whiteboard' && (
                                    <div className="h-[75vh] relative">
                                        <Tldraw persistenceKey={`whiteborad-${problemId}-${user._id}`} autoFocus inferDarkMode className="absolute inset-0 rounded-lg"/>
                                    </div>
                                )
                            }
                            {
                                activeTab == 'ai' && (
                    <ChatAi problem={problemData}></ChatAi>
                                )
                            }
                        </div>
                    </div>

                    {/* Right column */}

                    {
                        viewCode ? (
                           <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800/90 backdrop-blur-xl dark:border dark:border-gray-700 dark:shadow-gray-900/50">
                                <div className="border-b border-gray-200 p-4 dark:border-none">
                                    <div className="h-[80vh] border border-gray-200 rounded-md dark:border-none">
                                        <button onClick={()=> setViewCode(null)}
                                        className="btn btn-sm px-4 py-2 mt-4 ml-4 rounded-md font-semibold inline-flex items-center justify-center btn-primary"
                                        >
                                        <IoMdCloseCircle className="mr-1" />
                                        Close
                                        </button>
                                    <div className="h-86 border border-gray-200 rounded-md m-4 dark:border-none">

                                        {/* Editor readonly mode */}
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
                                {/* Code editor and language selection */}
                                 <div className="bg-white shadow-md overflow-hidden rounded-lg dark:bg-gray-800/90 backdrop-blur-xl dark:border dark:border-gray-700 dark:shadow-gray-900/50 transition duration-300">
                                    <div className="border-b border-gray-200 p-4">
                                        <div className="flex items-center justify-center">
                                            {isRunning || isSubmitting ?
                                            <button className={`text-white btn btn-sm mr-1 px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center bg-indigo-100`}>Pending ...</button>:
                                            <>
                                           <button 
  onClick={runCode} 
  disabled={isRunning}
  className={`btn btn-sm mr-4 px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center bg-indigo-700 hover:bg-indigo-800 text-white transition-transform duration-300 ease-in-out hover:scale-120 dark:border-gray-800`}
>
  <FaPlay className="mr-2" />
  Run
</button>

<button 
  onClick={submitCode} 
  disabled={isSubmitting}
  className={`btn btn-sm mr-1 px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center bg-[#fefcfb] border border-indigo-700 text-indigo-800 transition-transform duration-300 ease-in-out hover:scale-120`}
>
  <FaCode/>
Submit
</button>
</>
                                            }
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-6">
                                             <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                                Select Language
                                                </label>
                                                <select
                                                value={language}
                                                onChange={handleLanguageChange}
                                                className="select select-bordered w-full max-w-xs font-semibold 
                                                border border-indigo-700
                                                focus:border-indigo-800
                                                focus:ring-2 focus:ring-teal-800
                                                focus:outline-none
                                                ">
                                                <option value="C++">C++</option>
                                                <option value="Java">Java</option>
                                                <option value="JavaScript">JavaScript</option>
                                                </select>
                                        </div>
                                        <div className="h-86 border border-gray-200 rounded-md m-4 dark:border-none">

                                        {/* Editor readonly mode */}
                                        <Editor height="100%" defaultLanguage={editorLangMap[language]} language={editorLangMap[language]} theme="vs-dark" value={code}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorDidMount}
                                        options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}/>
                                    </div>
                                    </div>
                                </div>

                                {/* To display output to user */}
                                {
                                    (isRunning || isSubmitting) ? (
  // Show loading state in test case area
  <div className="p-6 text-center text-gray-600">
    <div className="flex items-center justify-center space-x-2">
      <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10"
          stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
      </svg>
      <span>{isRunning ? "Running your code..." : "Submitting your code..."}</span>
    </div>
  </div>
) :
                                    output ? (
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                            <div className="px-4 py-3 border border-gray-200 rounded-md bg-white shadow-sm">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-0 sm:gap-x-6 text-sm">
                                                    <div className="flex items-center space-x-4 text-gray-700">
                                                        {
                                                            output.status === 'Accepted' ? (<span className="flex items-center text-green-600 font-semibold">
                                                                <FaCheckCircle className="mr-1"/>
                                                                {output.status}
                                                            </span>):(
                                                                <span className="flex items-center text-red-600 font-semibold">
                                                                <FaRegTimesCircle className="mr-1"/>
                                                                {output.status}
                                                            </span> 
                                                            )
                                                        }

                                                        <span className="flex items-center text-gray-600 font-semibold">
                                                                <FaClock className="mr-1"/>
                                                                {output.runtime}ms
                                                        </span>
                                                         <span className="flex items-center text-gray-600 font-semibold">
                                                                <FaMemory className="mr-1"/>
                                                                {output.memory}KB
                                                        </span> 
                                                    </div>
                                                    <div className="text-sm text-right text-gray-700 font-semibold sm:flex sm:justify-center sm:items-center">
                                                        {output.passedTestCases} / {output.totalTestCases} test cases Passed
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    ):(
                                         <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800/90">
    {/* Test case tabs */}
        <div className="border-b border-gray-200 flex overflow-x-auto dark:bg-gray-800/90 backdrop-blur-xl dark:border dark:border-gray-700 dark:shadow-gray-900/50">
      {problemData.visibleTestCases.map((testCase, index) => (
        <button
          key={index}
          onClick={() => setActiveTestCase(index)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
            index === activeTestCase
            ? 'text-indigo-800 border-b-2 border-indigo-900 font-semibold dark:text-white dark:border-white'
       :'text-indigo-700 hover:text-indigo-800 border-b-2 border-transparent hover:border-indigo-900 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Case {index + 1}
        </button>
      ))}
    </div>

    {/* Current test case content */}
    <div className="p-4">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-white">Input</h4>
        <pre className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto dark:bg-gray-700 dark:text-white">
          {problemData.visibleTestCases[activeTestCase].input}
        </pre>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-white">Expected Output</h4>
        <pre className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto dark:bg-gray-700 dark:text-white">
          {problemData.visibleTestCases[activeTestCase].output}
        </pre>
      </div>
    </div>
  </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
};
export default ProblemInfo;
