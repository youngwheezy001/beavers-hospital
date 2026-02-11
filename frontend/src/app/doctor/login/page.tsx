"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Lock, Stethoscope, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

const BACKEND_URL = "https://beavers-hospital.onrender.com";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${BACKEND_URL}/staff/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem("doctor_email", email);
        localStorage.setItem("doctor_name", res.data.staff.name);
        router.push("/doctor/portal");
      }
    } catch (err: any) {
      if (err.response) {
         setError(err.response.data.message || "Invalid credentials.");
      } else {
         setError("Connection error. Is the server awake?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 🌌 DYNAMIC BACKGROUND SHAPES */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* LOGO AREA */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-2xl shadow-blue-500/20 mb-4 transform rotate-3">
                <Stethoscope className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Staff Login</h1>
            <p className="text-blue-200/60 font-medium mt-2">Beavers Family Clinic Portal</p>
        </div>

        {/* 💳 FROSTED GLASS LOGIN CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3">
              <AlertCircle size={18}/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest ml-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="dr.mwaura@beavers.com"
                className="w-full mt-2 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition font-medium text-white placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-200/50 uppercase tracking-widest ml-1">Password</label>
              <div className="relative mt-2">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition font-medium text-white placeholder:text-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : <>Access Portal <ArrowRight size={20}/></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
             <div className="flex items-center justify-center gap-2 text-blue-200/30 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>End-to-End Encrypted</span>
             </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-white/20 text-xs font-medium">
            &copy; 2026 Beavers Family Clinic Management System
        </p>
      </div>
    </div>
  );
}