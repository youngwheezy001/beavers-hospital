"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Activity, Calendar, Clock, CheckCircle, User, 
  LogOut, ClipboardList, MapPin, Search, ChevronRight 
} from "lucide-react";

const BACKEND_URL = "https://beavers-hospital.onrender.com";

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("doctor_email");
    if (!email) {
      router.push("/doctor/login");
      return;
    }
    setDoctorEmail(email);
    fetchMyPatients(email);
  }, []);

  const fetchMyPatients = async (email: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/appointments/all?t=${Date.now()}`);
      const myPatients = res.data.filter((app: any) => 
        app.doctor_email?.toLowerCase() === email.toLowerCase()
      );
      setAppointments(myPatients);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load patients", err);
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    if(!confirm("Mark this patient visit as complete?")) return;
    try {
      await axios.patch(`${BACKEND_URL}/appointments/${id}/status`, { status: "COMPLETED" });
      fetchMyPatients(doctorEmail); 
    } catch (err) { alert("Error updating status"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor_email");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800">
      
      {/* PROFESSIONAL NAVBAR */}
      <nav className="bg-slate-900 text-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-2 rounded-xl shadow-blue-500/50 shadow-lg">
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none tracking-tight">Doctor Workspace</h1>
            <p className="text-xs text-slate-400 font-mono mt-1 opacity-80">{doctorEmail}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-full transition border border-slate-700">
          <LogOut size={16} /> <span className="hidden md:inline">Sign Out</span>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* HEADER SECTION */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Daily Rounds</h2>
            <p className="text-slate-500 font-medium text-lg">Good Morning, Doctor. Here is your schedule.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3 text-blue-900 font-bold">
                <ClipboardList size={20} className="text-blue-500"/>
                <span>{appointments.filter(a => a.status !== 'COMPLETED').length} Active</span>
             </div>
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-green-100 flex items-center gap-3 text-green-900 font-bold">
                <CheckCircle size={20} className="text-green-500"/>
                <span>{appointments.filter(a => a.status === 'COMPLETED').length} Done</span>
             </div>
          </div>
        </header>

        {/* LOADING & EMPTY STATES */}
        {loading ? (
          <div className="text-center py-32">
             <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-slate-400 font-medium">Syncing records...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl shadow-blue-900/5 border border-white">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300">
              <User size={40}/>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">All Clear</h3>
            <p className="text-slate-500 mt-2 text-lg">You have no patients assigned at the moment.</p>
          </div>
        ) : (
          
          /* PATIENT CARDS GRID */
          <div className="grid gap-6">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white p-1 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-blue-100/50">
                <div className="bg-white p-6 rounded-[20px] flex flex-col md:flex-row justify-between gap-6 h-full">
                  
                  {/* Left: Patient Profile */}
                  <div className="flex gap-6 items-start">
                     {/* Avatar */}
                     <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-inner ${
                        app.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-600 text-white'
                     }`}>
                        {app.patient?.user?.full_name?.charAt(0) || "P"}
                     </div>
                     
                     {/* Details */}
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {app.patient?.user?.full_name}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-slate-500">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                             <Clock size={14} className="text-blue-500"/> 
                             {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                             <MapPin size={14} className="text-red-400"/> 
                             {app.branch?.name} Branch
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service:</span>
                            <span className="text-sm font-bold text-slate-700">{app.service?.name}</span>
                        </div>
                     </div>
                  </div>

                  {/* Right: Action Area */}
                  <div className="flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                     {/* Status Badge */}
                     <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                        app.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse'
                     }`}>
                        {app.status === 'COMPLETED' ? 'Case Closed' : 'In Progress'}
                     </span>
                     
                     {/* Action Button */}
                     {app.status !== 'COMPLETED' ? (
                       <button 
                         onClick={() => handleComplete(app.id)}
                         className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-600 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                       >
                         <CheckCircle size={18}/> Mark Complete
                       </button>
                     ) : (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm mt-2">
                            <CheckCircle size={18}/> Completed
                        </div>
                     )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}