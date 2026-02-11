"use client";
import React, { useState } from 'react';
import { MessageCircle, Instagram, Video, Share2, X, ChevronUp } from 'lucide-react';

export default function SocialDock() {
  const [isOpen, setIsOpen] = useState(false);

  const socials = [
    { 
      icon: <MessageCircle size={22}/>, 
      color: 'bg-green-500', 
      link: 'https://wa.me/254700000000', 
      label: 'WhatsApp' 
    },
    { 
      icon: <Instagram size={22}/>, 
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600', 
      link: 'https://instagram.com/beavershospital', 
      label: 'Instagram' 
    },
    { 
      icon: <Video size={22}/>, 
      color: 'bg-slate-900', 
      link: 'https://tiktok.com/@beavershospital', 
      label: 'TikTok' 
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-4">
      {/* EXPANDABLE ICONS (Collapsible Logic) */}
      {isOpen && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {socials.map((s, i) => (
            <div key={i} className="group flex items-center gap-3">
              {/* Tooltip label that appears on hover */}
              <span className="bg-white px-3 py-1 rounded-lg text-xs font-black text-slate-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {s.label}
              </span>
              <a 
                href={s.link} 
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.color} text-white p-4 rounded-2xl shadow-xl hover:scale-110 hover:-rotate-6 transition-all duration-300 flex items-center justify-center`}
              >
                {s.icon}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* MAIN TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0f172a] text-white p-5 rounded-3xl shadow-2xl hover:bg-[#2563eb] transition-all duration-300 flex flex-col items-center gap-1 border-2 border-white/10 group"
      >
        {isOpen ? (
          <X size={26} /> 
        ) : (
          <>
            <ChevronUp size={16} className="animate-bounce group-hover:text-blue-300" />
            <Share2 size={24} />
          </>
        )}
      </button>
    </div>
  );
}