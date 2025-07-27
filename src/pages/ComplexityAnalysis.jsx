import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import Markdown from "react-markdown";

function ComplexityAnalysis() {
  function TypingMarkdown({ text }) {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        index++;
        if (index >= text.length) clearInterval(interval);
      }, 20); // Adjust speed here
  
      return () => clearInterval(interval);
    }, [text]);
  
    return (
      <Markdown>
        {displayedText}
      </Markdown>
    );
  }
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi, how can I help you analyze the time and space complexity of a code?",
        },
      ],
    },
    {
      role: "user",
      parts: [{ text: "Explain me Time and Space complexity of Merge Sort" }],
    },
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: data.message }] },
    ]);
    reset();

    try {
      const response = await axiosClient.post("ai/analyzeComplexity", {
        messages: messages,
        text: data.message,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: response.data.message }] },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Error from AI Chatbot." }] },
      ]);
    }
  };

  return (
    <div className="mt-16 h-[calc(100vh-4rem)] flex flex-col shadow-lg overflow-hidden dark:bg-gray-900 transition duration-300">

      {/* Header */}
      <div className="text-center p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 dark:text-indigo-50 transition duration-500">Complexity Analysis Assistant</h1>
        <p className="text-sm sm:text-base mt-2 text-indigo-700 dark:text-indigo-100 transition duration-500">
          Learn to break down time and space complexity with ease!
        </p>
        <p className="text-sm text-indigo-700 dark:text-indigo-200 transition duration-500">
          Ask me anything from loops to recursion, or Big-O logic.
        </p>
        <p className="text-xs mt-1 italic text-indigo-800 dark:text-indigo-300 transition duration-500">
          Try: "What is the time complexity of Merge Sort?" or "Explain O(log n)"
        </p>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        {messages.map((msg, index) => (
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
              {msg.role === 'model' && index === messages.length - 1 ? (
                           <TypingMarkdown text={msg.parts[0].text} />
                          ) : (
                            <Markdown>{msg.parts[0].text}</Markdown>
                          )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-[#fefcfb] border-t border-gray-200 flex items-center gap-2 dark:bg-gray-900 transition duration-300"
      >
        <input
          type="text"
          placeholder="Ask about time & space complexity..."
          className="input input-bordered flex-1 placeholder-slate-500 focus:outline-none font-semibold dark:bg-gray-800 dark:text-white transition duration-300"
          {...register("message", { required: true, minLength: 2 })}
        />
        <button
          type="submit"
          disabled={errors.message}
          className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md transition-transform duration-200 active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ComplexityAnalysis;
