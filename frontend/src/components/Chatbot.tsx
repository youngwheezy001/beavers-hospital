"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, Sparkles, Shield, MapPin, 
  CreditCard, PhoneCall, Activity 
} from 'lucide-react';

export default function BaviUltimate() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "Hello! I'm Bavi 🦫. How can I support your health journey today?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  // --- AI ENGINE ---
  const askGemini = async (userPrompt: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt }),
      });

      const data = await response.json();

      if (data.error || !data.candidates) {
        return "I'm having trouble connecting to the clinic database. Please try again.";
      }

      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      return "Connection failed. Please check your internet.";
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: textToSend, time: userTime }]);
    setInput('');
    setIsTyping(true);

    const responseText = await askGemini(textToSend);
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'bot', text: responseText, time: botTime }]);
    setIsTyping(false);
  };

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] font-sans">
      {/* FLOATING TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0f172a] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 border border-white/10 group"
      >
        {isOpen ? <X size={24} /> : (
          <>
            <div className="relative">
              <Bot size={28} className="text-blue-400 group-hover:rotate-12 transition-transform"/>
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide hidden md:block">Chat with Bavi</span>
          </>
        )}
      </button>

      {/* MAIN CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[360px] md:w-[380px] h-[600px] bg-white rounded-[24px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* HEADER: Professional Gradient */}
          <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-6 text-white relative shadow-lg z-20">
            <Sparkles className="absolute top-4 right-6 text-blue-400/20 w-20 h-20 rotate-12" />
            
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shadow-lg">
                  <Bot size={24} className="text-blue-300"/>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Bavi 🦫</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Medical Assistant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGES AREA: High-Visibility Background */}
          <div className="flex-1 relative bg-slate-50 overflow-hidden">
            
            {/* BACKGROUND DECORATION (The "Eye-Catching" Part) */}
            <div className="absolute inset-0 z-0">
               {/* Soft Gradient */}
               <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 via-white to-blue-50/30"></div>
               
               {/* Giant Watermark Icon - Increased Opacity to 40% */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-200 opacity-40 pointer-events-none">
                 <Activity size={300} strokeWidth={1.5} />
               </div>

               {/* Subtle Grid Pattern - Increased Opacity to 8% */}
               <div className="absolute inset-0 opacity-[0.08]" 
                    style={{ backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
               </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div ref={scrollRef} className="relative z-10 h-full overflow-y-auto p-4 space-y-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div 
                    className={`max-w-[85%] p-4 text-[14px] leading-relaxed shadow-sm relative backdrop-blur-sm ${
                      m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]' 
                      : 'bg-white/95 text-slate-700 border border-blue-100/50 rounded-2xl rounded-tl-none font-medium shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ 
                      __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                    }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1 font-semibold opacity-80">
                    {m.time}
                  </span>
                </div>
              ))}
              
              {/* Typing Animation */}
              {isTyping && (
                <div className="flex items-center gap-1 ml-2 bg-white/90 border border-blue-100 w-fit px-4 py-3 rounded-2xl rounded-tl-none shadow-sm backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          {!isTyping && (
            <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white/90 backdrop-blur-md border-t border-slate-100 z-20">
              <button onClick={() => handleQuickReply("Consultation prices?")} className="flex items-center gap-1.5 whitespace-nowrap bg-blue-50 border border-blue-100 text-blue-700 text-[11px] px-3 py-2 rounded-lg hover:bg-blue-100 transition-all font-bold">
                <CreditCard size={14}/> Prices
              </button>
              <button onClick={() => handleQuickReply("Clinic locations?")} className="flex items-center gap-1.5 whitespace-nowrap bg-blue-50 border border-blue-100 text-blue-700 text-[11px] px-3 py-2 rounded-lg hover:bg-blue-100 transition-all font-bold">
                <MapPin size={14}/> Locations
              </button>
              <button onClick={() => handleQuickReply("I have an emergency")} className="flex items-center gap-1.5 whitespace-nowrap bg-red-50 border border-red-100 text-red-600 text-[11px] px-3 py-2 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all font-bold">
                <PhoneCall size={14}/> Emergency
              </button>
            </div>
          )}

          {/* INPUT AREA */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-100 flex gap-2 z-20">
            <input 
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-400" 
              placeholder="Ask Bavi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-[#0f172a] text-white p-3 rounded-xl hover:bg-[#2563eb] transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
          
          {/* FOOTER */}
          <div className="bg-slate-50 px-4 py-2 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-widest border-t border-slate-200 z-20">
            <span className="flex items-center gap-1 text-emerald-600"><Shield size={8}/> HIPAA Compliant</span>
            <span>Bavi 3.1</span>
          </div>
        </div>
      )}
    </div>
  );
}