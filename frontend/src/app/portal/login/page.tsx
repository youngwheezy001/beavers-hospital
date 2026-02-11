"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, ArrowRight, Activity, Phone } from "lucide-react";

const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function PatientLogin() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Check if phone exists in DB
      const res = await axios.post(`${BACKEND_URL}/appointments/patient-login`, { phone });
      
      // 2. Save ID and Redirect
      if (res.data.success) {
        localStorage.setItem("patient_id", res.data.patientId);
        localStorage.setItem("patient_name", res.data.name);
        router.push("/portal/dashboard");
      }
    } catch (err) {
      setError("Phone number not found. Have you booked an appointment with us before?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-green-100">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Patient Portal</h1>
          <p className="text-gray-500 text-sm mt-2">View your medical history and results.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
            <div className="relative mt-2">
              <Phone className="absolute left-4 top-3.5 text-gray-400" size={20}/>
              <input 
                required 
                type="tel" 
                placeholder="0700 000 000"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
            {loading ? "Checking..." : <>Access Records <ArrowRight size={20}/></>}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Not a patient yet?</p>
          <a href="/booking" className="text-green-600 font-bold text-sm hover:underline">Book your first appointment</a>
        </div>
      </div>
    </div>
  );
}