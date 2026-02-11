"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Activity, Calendar, Clock, CheckCircle, User, 
  LogOut, ClipboardList, MapPin 
} from "lucide-react";

const BACKEND_URL = "https://beavers-hospital.onrender.com";

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check who is logged in
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
      // Fetch ALL appointments
      const res = await axios.get(`${BACKEND_URL}/appointments/all?t=${Date.now()}`);
      
      // FILTER: Only show appointments where doctor_email matches the logged-in doctor
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
      fetchMyPatients(doctorEmail); // Refresh list
    } catch (err) { alert("Error updating status"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor_email");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none text-gray-900">Doctor Portal</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">{doctorEmail}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-red-600 text-sm font-bold flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-full transition">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">My Appointments</h2>
            <p className="text-gray-500">Manage your daily schedule and patient records.</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <ClipboardList size={20}/>
            <span>{appointments.length} Pending Visits</span>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading records...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <User size={32}/>
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Patients Assigned</h3>
            <p className="text-gray-500 mt-2">You have no pending appointments at the moment.</p>
            <p className="text-xs text-gray-400 mt-4">(Ask Admin to assign patients to {doctorEmail})</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 group">
                
                {/* Patient Info */}
                <div className="flex gap-5">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {app.patient?.user?.full_name?.charAt(0) || "P"}
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.patient?.user?.full_name}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Clock size={14} className="text-blue-400"/> {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-400"/> {new Date(app.start_time).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-400"/> {app.branch?.name} Branch</span>
                      </div>
                      <div className="mt-3 inline-block bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-600 uppercase tracking-wide">
                        {app.service?.name}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center items-end gap-3 min-w-[150px]">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      app.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                   }`}>
                      {app.status}
                   </span>
                   
                   {app.status !== 'COMPLETED' && (
                     <button 
                       onClick={() => handleComplete(app.id)}
                       className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                     >
                       <CheckCircle size={16}/> Complete
                     </button>
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