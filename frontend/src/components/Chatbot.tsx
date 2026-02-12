"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, Sparkles, Phone, Calendar, 
  User, HeartPulse, Clock, Shield, Activity, Mic, 
  Paperclip, AlertCircle  
} from 'lucide-react';

// --- DATA SOURCE: SERVICES & PRICING ---
const CLINIC_CONTEXT = {
  name: "Beavers FamilyCare",
  locations: ["Ngong (Main)", "Nairobi", "El Paso"],
  pricing: {
    consultation: "1,500 KES",
    specialist: "3,500 KES",
    lab_fbc: "800 KES",
    maternity_package: "45,000 KES"
  },
  emergency_contact: "+254 700 000 000"
};

const SERVICES_DATA = [
  { category: "Consultation", items: [
    { name: "General Practitioner", price: "1,500 KES" },
    { name: "Pediatrician (Child Specialist)", price: "3,000 KES" },
    { name: "Nutritionist", price: "2,500 KES" }
  ]},
  { category: "Laboratory", items: [
    { name: "Full Blood Count", price: "800 KES" },
    { name: "Blood Sugar Test", price: "400 KES" },
    { name: "Urinalysis", price: "500 KES" },
    { name: "Malaria Test", price: "600 KES" }
  ]},
  { category: "Pharmacy", items: [
    { name: "Standard Antibiotics", price: "Starts at 1,200 KES" },
    { name: "Pain Management Pack", price: "500 KES" }
  ]}
];

export default function BeaversChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm Bavi 🦫 Welcome to Beavers Family Care. I'm here to guide your health journey. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [sentiment, setSentiment] = useState<'neutral' | 'urgent' | 'happy'>('neutral');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // --- GEMINI API INTEGRATION ---
  const askGemini = async (userPrompt: string) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const systemInstruction = `
      You are Bavi, the AI Concierge for ${CLINIC_CONTEXT.name}. 
      Tone: Professional, empathetic, and efficient.
      Context: We are located in ${CLINIC_CONTEXT.locations.join(", ")}. 
      Pricing: Consultation starts at ${CLINIC_CONTEXT.pricing.consultation}. 
      Rules: 
      1. Always refer to "your health journey."
      2. If an emergency is detected, provide the hotline: ${CLINIC_CONTEXT.emergency_contact}.
      3. Use Markdown for bolding key info.
      4. Use the specific pricing: Lab tests (FBC: 800, Malaria: 600), Pharmacy (Antibiotics: 1200+).
      5. AT THE END OF EVERY RESPONSE, ADD ONE OF THESE TAGS: [URGENT], [HAPPY], or [NEUTRAL].
    `;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nUser: ${userPrompt}` }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        let rawText = data.candidates[0].content.parts[0].text;

        // Detect Sentiment and update UI state
        if (rawText.includes('[URGENT]')) setSentiment('urgent');
        else if (rawText.includes('[HAPPY]')) setSentiment('happy');
        else setSentiment('neutral');

        // Remove the tag from the text shown to the user
        return rawText.replace(/\[URGENT\]|\[HAPPY\]|\[NEUTRAL\]/g, "").trim();
      }
      throw new Error("Invalid response");
    } catch (error) {
      return getLocalResponse(userPrompt);
    }
  };

  // --- LOCAL FALLBACK LOGIC ---
  const getLocalResponse = (userMsg: string) => {
    const msg = userMsg.toLowerCase();
    if (msg.includes('price') || msg.includes('cost')) return `Consultation at Beavers starts at 1,500 KES. Lab tests like FBC are 800 KES. [NEUTRAL]`;
    if (msg.includes('emergency')) {
        setSentiment('urgent');
        return `🚨 Emergency detected. Call ${CLINIC_CONTEXT.emergency_contact} immediately. [URGENT]`;
    }
    return "I've noted your request. Would you like to speak with a human representative? [NEUTRAL]";
  };

  // --- SINGLE HANDLE SEND ---
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const aiResponse = await askGemini(userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    setIsTyping(false);
  };

  // --- DYNAMIC HEADER COLOR LOGIC ---
  const getHeaderStyle = () => {
    if (sentiment === 'urgent') return 'bg-red-600 animate-pulse';
    if (sentiment === 'happy') return 'bg-emerald-600';
    return 'bg-[#0f172a]';
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] font-sans">
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2563eb] text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20 group"
      >
        {isOpen ? <X size={24} /> : (
          <div className="flex items-center gap-3">
            <div className="relative">
                <Bot size={28} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-[#2563eb] rounded-full"></span>
            </div>
            <span className="font-bold text-sm tracking-wide">Chat with Bavi</span>
          </div>
        )}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[380px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
          
          {/* HEADER (DYNAMIC COLOR INTEGRATED) */}
          <div className={`${getHeaderStyle()} p-6 text-white relative overflow-hidden transition-colors duration-500`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <HeartPulse size={80} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-[#2563eb] p-2.5 rounded-2xl shadow-lg shadow-blue-500/40 border border-white/10">
                  <Sparkles size={22} className="text-white"/>
                </div>
                <div>
                  <p className="font-black text-2xl tracking-tighter">Bavi <span className="text-blue-500">🦫</span></p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                        {sentiment === 'urgent' ? 'Urgent Assistance' : 'Online Support'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#f8fafc]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-[#2563eb] text-white rounded-tr-none font-medium' 
                    : 'bg-white text-[#0f172a] border border-slate-200 rounded-tl-none font-semibold'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#f8fafc]">
            {['Prices', 'Location', 'Insurance'].map((label) => (
                <button 
                    key={label}
                    onClick={() => { setInput(label); }}
                    className="whitespace-nowrap bg-white border border-slate-200 text-slate-600 text-[12px] px-3 py-1.5 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors font-bold"
                >
                    {label}
                </button>
            ))}
          </div>

          {/* INPUT AREA */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                  <input 
                  className="w-full text-[15px] outline-none bg-slate-100 px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-slate-800 placeholder:text-slate-400" 
                  placeholder="Type your health query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  />
              </div>
              <button type="submit" className="bg-[#0f172a] text-white p-3.5 rounded-2xl hover:bg-[#2563eb] transition-all duration-300 shadow-lg active:scale-90 flex items-center justify-center">
                <Send size={20} />
              </button>
            </div>
            
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                <Shield size={10} className="text-green-500"/> Secure Data
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                <AlertCircle size={10} /> Emergency? Dial {CLINIC_CONTEXT.emergency_contact}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}