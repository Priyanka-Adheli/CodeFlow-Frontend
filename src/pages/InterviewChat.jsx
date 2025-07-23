import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import Markdown from "react-markdown";

function InterviewChat() {
  const { id } = useParams();
  const [chatInterview, setChatInterview] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const fetchInterviewByIndex = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.post('/ai/interviewById', { index: id });
        console.log(response.data);
        setChatInterview(response.data.InterviewChat);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewByIndex();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-3/4">
          <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto" />
          <div className="h-6 bg-gray-300 rounded w-full" />
          <div className="h-6 bg-gray-300 rounded w-2/3 ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-50 px-4 py-8">
      {/* Title */}
      <h1 className="text-center text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
        {chatInterview?.title || "Interview History"}
      </h1>

      {/* Chat Messages */}
     <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
            {chatInterview?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`
                  px-4 py-3 max-w-[80%] text-sm sm:text-base whitespace-pre-line rounded-xl shadow
                  ${msg.role === "user"
                    ? "bg-indigo-700 text-white rounded-br-none"
                    : "bg-indigo-50 text-black rounded-bl-none"}
                `}>
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            ))}
          </div>
    </div>
  );
}

export default InterviewChat;