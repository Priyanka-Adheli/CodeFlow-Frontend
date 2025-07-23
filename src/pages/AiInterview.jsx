import { useState, useRef, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { GoClockFill } from "react-icons/go";
import { FaFileAlt } from 'react-icons/fa'; // Similar document icon
function AIInterviewBot() {
    const [chatInterviews,setChatInterviews] = useState(null);
    const [loading,setLoading] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchAllInterviews = async() =>{
            try{
                setLoading(true);
                const response = await axiosClient.get('/ai/getAllInterviewChats');
                console.log(response.data);
                setChatInterviews(response.data);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }

    fetchAllInterviews();
    },[]);
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
return (
  <div className="mt-16 min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 transition duration-300">
    {/* CTA Button */}
    <div className="flex justify-center mb-8">
      <button 
        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105 active:scale-95"
        onClick={() => navigate('/interview/start')}
      >
        Start New Interview
        <span className="ml-2">🚀</span>
      </button>
    </div>

    {/* Interview Cards */}
    <h1 className="text-3xl text-indigo-600 dark:text-indigo-400 p-4 text-center font-bold mb-6">
      <span className="relative">
        Interview History
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 dark:bg-indigo-500"></span>
      </span>
    </h1>
    
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {chatInterviews && chatInterviews.map((chat, index) => (
        <div
          key={index}
          className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => navigate(`/interviewChat/${index}`)}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white relative z-10">
            {chat.topic}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 relative z-10">
            {chat.title}
          </p>
          
          {/* Date/time indicator */}
          <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 relative z-10">
            <GoClockFill className="w-4 h-4 mr-1" />
            {new Date(chat.messages[0].createdAt).toLocaleString()}
          </div>
          
          {/* Shimmer effect on dark mode */}
          <div className="absolute inset-0 dark:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] dark:bg-[length:200%_100%] dark:animate-shimmer pointer-events-none"></div>
        </div>
      ))}
    </div>

    {/* Empty state */}
    {!chatInterviews?.length && (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
          <FaFileAlt className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
          No interviews yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Start your first interview and it will appear here for future reference.
        </p>
      </div>
    )}
  </div>
);
}

export default AIInterviewBot;