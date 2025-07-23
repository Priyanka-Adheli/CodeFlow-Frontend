import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import Markdown from 'react-markdown';
import { TypeAnimation } from 'react-type-animation';

const InterviewPage = () => {
  const [chat, setChat] = useState([]);
  const [topic,setTopic] = useState('');
  const [input, setInput] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  // Fetch last chat
  useEffect(() => {
    const fetchLastChat = async () => {
      try {
        const res = await axiosClient.get('/ai/history'); // <- new API
        console.log(res.data);
        const messages = res.data.messages || [];
        setTopic(res.data.topic);
        setChat(messages);

        // Check if last model message is JSON (Interview End)
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === 'model' && isJson(lastMsg.text)) {
          setDisabled(true);
        }
      } catch (err) {
        console.error('Error loading chat', err);
      }
    };

    fetchLastChat();
  }, []);

  const isJson = (str) => {
  try {
    const cleaned = str.startsWith('```json') ? str.replace(/```json|```/g, '').trim() : str;
    const parsed = JSON.parse(cleaned);
    return parsed?.InterviewEnded === true;
  } catch (e) {
    return false;
  }
};


  const sendMessage = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { role: 'user', text: input }];
    setChat(newChat);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/ai/interviewWithAi', { text: input });

      const aiReply = res.data.reply;
      const updatedChat = [...newChat, { role: 'model', text: aiReply }];

      setChat(updatedChat);
      setLoading(false);

      if (isJson(aiReply)) {
        setDisabled(true);
      }
    } catch (err) {
      console.error('Failed to send', err);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='mt-16 h-screen dark:bg-gray-900 transition duration-300'>
        <h1 className='text-3xl text-indigo-600 font-bold text-center p-4'>Interview on Topic {topic}</h1>
    <div className="max-w-7xl mx-auto p-4 h-[80vh] flex flex-col rounded-lg shadow-lg border border-indigo-100 dark:bg-gray-800 dark:border-gray-700 transition duration-300">
      <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-2">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg w-fit max-w-[80%] m-4 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white self-end ml-auto' : 'bg-indigo-50 text-black self-start mr-auto'
            }`}
          >
            {msg.role === 'model' && idx === chat.length - 1 ? (
              
              <TypeAnimation
                sequence={[msg.text]}
                speed={50}
                wrapper="span"
                style={{ whiteSpace: 'pre-wrap' }}
                omitDeletionAnimation
              />
            ) : (
              <Markdown>{msg.text}</Markdown>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <textarea
          rows={1}
          className="flex-1 p-2 border rounded bg-white text-black resize-none"
          placeholder="Type your response... or Enter `Hii i wanna start Interview` to start an Interview"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={disabled || loading}
        >
          Send
        </button>
      </div>

      {disabled && (
        <div className="text-center text-sm text-gray-400 mt-2">Interview ended. Please start a new one.</div>
      )}
    </div>
    </div>
  );
};

export default InterviewPage;
