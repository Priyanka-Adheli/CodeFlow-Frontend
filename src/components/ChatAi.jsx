import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';
import Markdown from 'react-markdown'
function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How i can help you to solve this Problem?"}]},
        { role: 'user', parts:[{text: "Explain me Constraints"}]}
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();

    const onSubmit = async (data) => {
        
        setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
        reset();

        try {
            
            const response = await axiosClient.post("ai/problemChat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode,
                constraints:problem.constraints,
                hints:problem.hints
            });

           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
    };

    return (
        <div className="mt-4 flex flex-col h-[75vh] relative dark:bg-gray-800">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="font-semibold chat-bubble bg-base-200 text-base-content">
                            <Markdown>{msg.parts[0].text}</Markdown>
                        </div>
                    </div>
                ))}
                {/* <div ref={messagesEndRef} /> */}
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t border-[#001f54] dark:bg-gray-800"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-ghost ml-2"
                        disabled={errors.message}
                    >
                        <Send className='text-[#001f54] dark:text-white' size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;
