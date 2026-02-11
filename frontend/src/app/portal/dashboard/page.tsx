"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  Activity, Calendar, Clock, MapPin, FileText, 
  LogOut, Stethoscope, CheckCircle 
} from "lucide-react";

const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function PatientDashboard() {
  const [records, setRecords] = useState<any[]>([]);
  const [name, setName] = useState("Patient");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Get ID from storage
    const id = localStorage.getItem("patient_id");
    const storedName = localStorage.getItem("patient_name");
    
    if (!id) {
      router.push("/portal/login");
      return;
    }
    setName(storedName || "Valued Patient");

    // 2. Fetch History
    axios.get(`${BACKEND_URL}/appointments/patient/${id}/records`)
      .then(res => setRecords(res.data))
      .catch(err => console.error("Error fetching records", err))
      .finally(() => setLoading(false));

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-gray-900">My Health Portal</h1>
            <p className="text-xs text-gray-500 mt-1">Welcome, {name}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-red-600 text-sm font-bold flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-full transition">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="text-green-600"/> Medical History
        </h2>

        {loading ? (
           <div className="text-center py-20 text-gray-400">Loading your records...</div>
        ) : records.length === 0 ? (
           <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300">
             <Calendar size={48} className="mx-auto text-gray-300 mb-4"/>
             <p className="text-gray-500">No medical records found.</p>
             <a href="/booking" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm">Book Appointment</a>
           </div>
        ) : (
           <div className="space-y-6">
             {records.map((rec) => (
               <div key={rec.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                 {/* Header */}
                 <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-start">
                   <div>
                     <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                       <Calendar size={18} className="text-purple-500"/> 
                       {new Date(rec.start_time).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                       <span className="flex items-center gap-1"><Clock size={14}/> {new Date(rec.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       <span className="flex items-center gap-1"><MapPin size={14}/> {rec.branch?.name} Branch</span>
                     </div>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      rec.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                   }`}>
                      {rec.status}
                   </span>
                 </div>

                 {/* Body */}
                 <div className="p-6">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                       <Stethoscope size={18}/>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-900">{rec.service?.name}</p>
                       <p className="text-xs text-gray-500">Dr. {rec.doctor_name || "Assigned Specialist"}</p>
                     </div>
                   </div>

                   {/* Here we can add Diagnosis Results later when we expand the schema */}
                   {rec.status === 'COMPLETED' && (
                     <div className="bg-green-50 border border-green-100 p-4 rounded-xl mt-4">
                        <p className="text-xs font-bold text-green-700 uppercase mb-1 flex items-center gap-1"><CheckCircle size={12}/> Visit Complete</p>
                        <p className="text-sm text-gray-600">Your results and prescription are available at the pharmacy.</p>
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}