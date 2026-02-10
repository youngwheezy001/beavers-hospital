"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, MessageCircle, Calendar, Star, 
  User, ArrowLeft, Send, X 
} from "lucide-react";

// --- CHAT COMPONENT ---
const ChatWindow = ({ doctor, onClose }: { doctor: any, onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { sender: 'doc', text: `Hello! I am Dr. ${doctor.user.full_name.split(' ')[1]}. How can I help you today?` }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add User Message
    setMessages([...messages, { sender: 'me', text: input }]);
    setInput("");

    // Simulate Doctor Reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'doc', 
        text: "Thank you. Please book an appointment so I can examine this closely." 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
            {doctor.user.full_name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-sm">{doctor.user.full_name}</div>
            <div className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
            </div>
          </div>
        </div>
        <button onClick={onClose}><X className="w-5 h-5 hover:text-red-200" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 bg-gray-50 h-64 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              m.sender === 'me' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
        <input 
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// --- MAIN DIRECTORY ---
function DoctorsList() {
  const searchParams = useSearchParams();
  // Get the ?dept=Dentist from the URL
  const initialDept = searchParams.get("dept") || "All"; 

  const [doctors, setDoctors] = useState<any[]>([]);
  const [filter, setFilter] = useState(initialDept);
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    fetch("https://beavers-hospital.onrender.com")
      .then(r => r.json())
      .then(data => setDoctors(data || []));
  }, []);

  // Filter Logic
  const filteredDoctors = filter === "All" 
    ? doctors 
    : doctors.filter(d => 
        (d.department || "").toLowerCase().includes(filter.toLowerCase()) ||
        (d.position || "").toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Find a Specialist</h1>
            <p className="text-xs text-gray-500">Connect with our medical team</p>
          </div>
        </div>
        
        {/* Filter Scrollbar */}
        <div className="border-t border-gray-100 overflow-x-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2">
            {['All', 'General Medicine', 'Dentist', 'Pediatrician', 'Optical', 'Physiotherapy'].map(dept => (
              <button 
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition
                  ${filter.includes(dept) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold">No specialists found</h3>
            <p className="text-gray-500 text-sm">Try selecting "All" to see everyone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition group">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-600">
                      {doc.user.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{doc.user.full_name}</h3>
                      <p className="text-blue-600 text-sm font-medium">{doc.department}</p>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                        <Star className="w-3 h-3 fill-current" /> 4.9 (120 reviews)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setActiveChat(doc)}
                    className="flex-1 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat
                  </button>
                  <Link href="/book" className="flex-1 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Chat If Active */}
      {activeChat && (
        <ChatWindow doctor={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Directory...</div>}>
      <DoctorsList />
    </Suspense>
  );
}