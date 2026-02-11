"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios
import { Activity, Lock, Stethoscope, ArrowRight, AlertCircle } from "lucide-react";

// The Backend Address
const BACKEND_URL = "https://beavers-hospital.onrender.com";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added Password State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
    
    try {
      const res = await axios.post(`${BACKEND_URL}/staff/login`, { 
        email, 
        password 
      });

      if (res.data.success) {
        localStorage.setItem("doctor_email", email);
        localStorage.setItem("doctor_name", res.data.staff.name);
        
        // 🚨 THIS WAS THE PROBLEM. CHANGE IT TO THIS:
        router.push("/doctor/portal"); 
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.response) {
         setError(err.response.data.message || "Login failed.");
      } else {
         setError("Server is sleeping. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Stethoscope className="text-white" size={32} />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Doctor Access</h1>
          <p className="text-gray-500 mb-8">Beavers Family Clinic Portal</p>

          {/* Error Message Box */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold flex items-center gap-2 animate-pulse">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative mt-2">
                <input
                  type="email"
                  required
                  placeholder="dr.mwaura@beavers.com"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition font-medium text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">Password</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition font-medium text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : <>Login Securely <ArrowRight size={20}/></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
             Authorized Personnel Only. Access is monitored.
          </div>
        </div>
      </div>
    </div>
  );
}