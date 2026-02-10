"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, Calendar, Clock, RefreshCw, Trash2, Stethoscope, Check, User, AlertTriangle, Wifi, Database } from 'lucide-react';

// 🚨 CHECK THIS URL: Is this your CURRENT Render URL?
const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  
  // --- NEW DIAGNOSTIC STATES ---
  const [lastUpdated, setLastUpdated] = useState<string>("Waiting..."); 
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [networkStatus, setNetworkStatus] = useState<string>("Initializing");
  const [recordCount, setRecordCount] = useState<number>(0); // Stores the "Found" count

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/appointments/login`, { email: "admin@beavers.com", password: password });
      if (res.data.success) { setIsLoggedIn(true); } 
      else { alert("Incorrect Password!"); }
    } catch (err) { alert("Login Failed. Backend might be sleeping."); }
  };

  // --- FETCH DATA (Updated with "Found" Count) ---
  const fetchAppointments = async () => {
    // 1. Set status to fetching so you see the update happening
    setNetworkStatus("Fetching...");
    setErrorMsg("");
    
    try {
      // timestamp forces a fresh request every time (No Caching)
      const uniqueUrl = `${BACKEND_URL}/appointments/all?t=${new Date().getTime()}`;
      
      const res = await axios.get(uniqueUrl);
      
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
        // 2. Update the "Found" count
        setRecordCount(res.data.length); 
        // 3. Set status to Online
        setNetworkStatus("Online");
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error("Data format incorrect. Expected Array.");
      }

    } catch (err: any) { 
      console.error("Sync failed:", err);
      setNetworkStatus("Error");
      setErrorMsg(err.message || "Unknown Network Error");
    }
  };

  // --- AUTO-REFRESH ---
  useEffect(() => {
    if (isLoggedIn) {
      fetchAppointments(); 
      const interval = setInterval(fetchAppointments, 5000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // --- ACTIONS ---
  const handleAssignDoctor = async (id: string) => {
    const doctorName = prompt("Enter Doctor's Name:");
    if (!doctorName) return;
    const doctorEmail = prompt(`Enter email for ${doctorName}:`);
    if (!doctorEmail) return;
    try {
      await axios.patch(`${BACKEND_URL}/appointments/${id}/assign`, { doctorName, doctorEmail });
      alert(`✅ Assigned to ${doctorName}!`); fetchAppointments();
    } catch (err) { alert("Failed."); }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    let newStatus = currentStatus === "CONFIRMED" ? "COMPLETED" : "CONFIRMED";
    if (currentStatus === "COMPLETED") return; 
    try { await axios.patch(`${BACKEND_URL}/appointments/${id}/status`, { status: newStatus }); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete?")) return;
    try { await axios.delete(`${BACKEND_URL}/appointments/${id}`); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  // --- FILTER ---
  const uniqueBranches = ["All", ...Array.from(new Set(appointments.map(app => app.branch?.name).filter(Boolean)))];
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    return app.branch?.name === filter;
  });

  // ===============================================
  // VIEW 1: PROFESSIONAL LOGIN
  // ===============================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md text-center border-4 border-purple-100">
          <div className="bg-purple-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition duration-300">
             <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-purple-900 mb-2 tracking-tight">Beavers Admin</h1>
          <p className="text-gray-500 font-medium mb-10 text-lg">Secure Command Center</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit" className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-800 hover:shadow-lg transition transform hover:-translate-y-1">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===============================================
  // VIEW 2: THE DASHBOARD
  // ===============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-purple-900 p-2 rounded-lg text-white shadow-md"><LayoutDashboard size={22}/></div>
           <span className="font-bold text-2xl tracking-tight text-gray-800">Command Center</span>
           
           {/* 🔥 NEW DIAGNOSTIC PANEL (Top of Dashboard) */}
           <div className="ml-4 flex items-center gap-2">
              {/* 1. Status Pill */}
              <div className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border ${networkStatus === 'Online' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {networkStatus === 'Online' ? <Wifi size={14}/> : <AlertTriangle size={14}/>}
                  {networkStatus === 'Online' ? `Live: ${lastUpdated}` : `Error: ${errorMsg}`}
              </div>

              {/* 2. Found / Count Pill */}
              <div className="px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border bg-blue-50 text-blue-700 border-blue-200">
                  <Database size={14}/>
                  <span>Found: {recordCount}</span>
              </div>
           </div>
        </div>

        <div className="flex gap-2">
            <button onClick={fetchAppointments} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition">
                <RefreshCw size={14} /> Force Reload
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition border border-red-100">
                <LogOut size={16} /> Logout
            </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-5xl font-black text-gray-900 mb-3 tracking-tight">Appointments</h2>
            <p className="text-gray-500 font-medium text-lg">
              Welcome back, Admin. Real-time overview of patient bookings across all branches.
            </p>
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            {uniqueBranches.map(f => (
              <button key={f} onClick={() => setFilter(f as string)} className={`px-5 py-2 rounded-lg font-bold transition-all ${filter === f ? 'bg-purple-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>{f as string}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100/50">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Patient Details</th>
                <th className="p-6 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Service</th>
                <th className="p-6 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Schedule</th>
                <th className="p-6 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Status</th>
                <th className="p-6 text-center text-gray-400 font-extrabold uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? 
                <tr><td colSpan={5} className="p-16 text-center text-gray-400 font-medium text-lg">
                    {networkStatus === 'Error' ? "⚠️ Network connection failed." : "No appointments found today."}
                </td></tr> 
              : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-purple-50/50 transition duration-150 group">
                  <td className="p-6 align-top">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                        {app.patient?.user?.full_name?.charAt(0) || <User size={20}/>}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{app.patient?.user?.full_name}</div>
                        <div className="text-sm text-gray-500 font-medium mb-2">{app.patient?.user?.phone}</div>
                        {app.doctor_name ? (
                          <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold w-fit shadow-sm">
                            <Stethoscope size={12} /> Dr. {app.doctor_name}
                          </div>
                        ) : (
                          <span className="text-xs text-orange-400 font-bold bg-orange-50 px-2 py-1 rounded">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <span className="font-bold text-gray-700 block text-base">{app.service?.name}</span>
                    <span className="text-xs text-gray-400 font-medium">{app.branch?.name} Branch</span>
                  </td>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-2 text-gray-700 font-bold"><Calendar size={16} className="text-purple-400"/> {new Date(app.start_time).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 font-medium"><Clock size={16} className="text-purple-300"/> {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="p-6 align-top">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                      app.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                      app.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-6 align-top flex justify-center gap-2">
                    <button onClick={() => handleAssignDoctor(app.id)} className="p-3 bg-white border border-gray-200 text-purple-600 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition shadow-sm group-hover:shadow-md" title="Assign Doctor"><Stethoscope size={18}/></button>
                    <button onClick={() => handleStatusChange(app.id, app.status)} className="p-3 bg-white border border-gray-200 text-green-600 rounded-xl hover:bg-green-50 hover:border-green-200 transition shadow-sm group-hover:shadow-md" title="Complete"><Check size={18}/></button>
                    <button onClick={() => handleDelete(app.id)} className="p-3 bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition shadow-sm group-hover:shadow-md" title="Delete"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}