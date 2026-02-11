"use client";
import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am Beavers AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simple AI Logic (Keyword Matching)
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Would you like to speak to a human representative?";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes('hour') || lowerMsg.includes('open')) botResponse = "We are open Monday to Saturday, 8:00 AM to 6:00 PM.";
      if (lowerMsg.includes('location') || lowerMsg.includes('where')) botResponse = "We have branches in Ngong, Nairobi, and El Paso.";
      if (lowerMsg.includes('book') || lowerMsg.includes('appoint')) botResponse = "You can book an appointment by clicking the 'Book Now' button on our homepage!";
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center gap-2 font-bold">
            <Bot size={20}/> <span>Beavers Assistant</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
            <input 
              className="flex-1 text-sm outline-none bg-slate-100 p-2 rounded-xl focus:ring-1 focus:ring-blue-400 transition" 
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}