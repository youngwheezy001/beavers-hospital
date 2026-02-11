"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Phone, Calendar } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello there! I'm Bavi 🦫 Welcome to Beavers Family Care facility. I'm here to guide your health journey. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // --- TRAINED AI LOGIC ---
    setTimeout(() => {
      let botResponse = "I've noted that. Would you like me to connect you with a human representative, or would you like to know about our services?";
      const msg = userMsg.toLowerCase();

      if (msg.includes('hello') || msg.includes('hi')) {
        botResponse = "Hello! It's a pleasure to meet you. How are you feeling today?";
      } else if (msg.includes('book') || msg.includes('appoint') || msg.includes('see a doctor')) {
        botResponse = "You can book an appointment easily by clicking the 'Book Now' button on our homepage. We have slots available this week!";
      } else if (msg.includes('hour') || msg.includes('open') || msg.includes('time') || msg.includes('close')) {
        botResponse = "We are open Monday to Friday (8:00 AM - 6:00 PM) and Saturdays (9:00 AM - 3:00 PM). We are closed on Sundays and Public Holidays.";
      } else if (msg.includes('where') || msg.includes('location') || msg.includes('place') || msg.includes('find')) {
        botResponse = "Our main facility is in Ngong. We also have satellite branches in Nairobi and El Paso to serve you better.";
      } else if (msg.includes('insurance') || msg.includes('card') || msg.includes('pay') || msg.includes('nhif')) {
        botResponse = "We accept NHIF (SHA), AAR, Britam, Old Mutual, and Jubilee. For cash payers, consultation starts at 1,500 KES.";
      } else if (msg.includes('record') || msg.includes('result') || msg.includes('portal') || msg.includes('history')) {
        botResponse = "You can view your medical history in our 'Patient Portal'. Just use the phone number you registered with to log in.";
      } else if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('hurt')) {
        botResponse = "🚨 If this is a life-threatening emergency, please call our 24/7 hotline at +254 700 000 000 immediately.";
      } else if (msg.includes('thank')) {
        botResponse = "You're very welcome! Stay healthy. Is there anything else I can do for you?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2563eb] text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/20 group"
      >
        {isOpen ? <X size={24} /> : (
          <div className="flex items-center gap-2">
            <Bot size={24} className="group-hover:rotate-12 transition-transform" />
            {!isOpen && <span className="font-bold text-sm pr-2">Chat with Bavi</span>}
          </div>
        )}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[350px] h-[520px] bg-white rounded-t-[2.5rem] rounded-br-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-left-4 duration-300">
          
          {/* HEADER */}
          <div className="bg-[#0f172a] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#2563eb] p-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <Sparkles size={20} className="text-white"/>
                </div>
                <div>
                  <p className="font-black text-xl tracking-tight">Bavi</p>
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black opacity-80">Digital Concierge</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
  {messages.map((m, i) => (
    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-md border ${
          m.role === 'user' 
          ? 'bg-[#2563eb] text-white border-blue-600 rounded-tr-none' // User: White text on Blue
          : 'bg-[#f8fafc] text-[#0f172a] border-slate-200 rounded-tl-none font-bold' // Bavi: Deep Black/Navy text on Light Grey
        }`}
      >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              className="flex-1 text-sm outline-none bg-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium" 
              placeholder="Ask me about booking, hours, or insurance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-[#0f172a] text-white p-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}