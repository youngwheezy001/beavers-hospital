"use client";
import React from 'react';
import { Instagram, MessageCircle, Video, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight">Beavers <span className="text-blue-500">Clinic</span></h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Providing world-class healthcare with a personal touch. Connect with us on our digital platforms.
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          <h4 className="font-bold text-lg">Follow Our Journey</h4>
          <div className="flex justify-center md:justify-start gap-4">
            {/* WhatsApp */}
            <a href="https://wa.me/254XXXXXXXXX" target="_blank" className="bg-green-500/10 p-3 rounded-2xl text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10">
              <MessageCircle size={24} />
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/yourhandle" target="_blank" className="bg-pink-500/10 p-3 rounded-2xl text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-lg shadow-pink-500/10">
              <Instagram size={24} />
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@yourhandle" target="_blank" className="bg-slate-100/10 p-3 rounded-2xl text-white hover:bg-white hover:text-black transition-all">
              <Video size={24} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm text-slate-400">
          <h4 className="font-bold text-white text-lg mb-4">Visit Us</h4>
          <p>Main Branch: Ngong, Kajiado County</p>
          <p>Emergency: +254 700 000 000</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
        <p>&copy; 2026 Beavers Family Clinic</p>
        <p className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500"/> for our community</p>
      </div>
    </footer>
  );
}