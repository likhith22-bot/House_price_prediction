import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatbotWidget = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: `Hello ${user ? user.username : 'Guest'}! I'm your Real Estate AI. How can I help you today?`, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:8080/api/chatbot/chat', { message: input });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the brain.", isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <span className="font-bold flex items-center gap-2">🤖 Real Estate AI</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">×</button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.isBot ? 'bg-indigo-50 text-indigo-900 rounded-bl-none' : 'bg-indigo-600 text-white rounded-br-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
            <input 
              type="text"
              placeholder="Ask me anything..."
              className="flex-grow p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 rounded-lg">↑</button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition active:scale-95"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
