"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, Calendar, Clock, RefreshCw, Trash2, Stethoscope, Check, User, Wifi, Database, Search } from 'lucide-react';

// 🚨 CHECK THIS URL: Is this your CURRENT Render URL?
const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  
  // Debugging States
  const [lastUpdated, setLastUpdated] = useState<string>(""); 
  const [networkStatus, setNetworkStatus] = useState<string>("Waiting");

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/appointments/login`, { email: "admin@beavers.com", password: password });
      if (res.data.success) { setIsLoggedIn(true); } 
      else { alert("Incorrect Password!"); }
    } catch (err) { alert("Login Failed. Backend might be sleeping."); }
  };

  // --- FETCH DATA ---
  const fetchAppointments = async () => {
    setNetworkStatus("Syncing...");
    try {
      // Force fresh data with timestamp
      const uniqueUrl = `${BACKEND_URL}/appointments/all?t=${new Date().getTime()}`;
      const res = await axios.get(uniqueUrl);

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
        setNetworkStatus("Live");
        setLastUpdated(new Date().toLocaleTimeString());
      } 
    } catch (err) { 
      console.error("Sync failed:", err);
      setNetworkStatus("Error");
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
      fetchAppointments();
    } catch (err) { alert("Failed."); }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    let newStatus = currentStatus === "CONFIRMED" ? "COMPLETED" : "CONFIRMED";
    try { await axios.patch(`${BACKEND_URL}/appointments/${id}/status`, { status: newStatus }); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete?")) return;
    try { await axios.delete(`${BACKEND_URL}/appointments/${id}`); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  // --- ROBUST FILTERING (The Fix) ---
  // 1. Get unique branches safely
  const uniqueBranches = ["All", ...Array.from(new Set(appointments.map(app => app.branch?.name || "Unassigned").filter(Boolean)))];
  
  // 2. Filter logic that captures "Unassigned" branches too
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    const branchName = app.branch?.name || "Unassigned";
    return branchName === filter;
  });

  // ===============================================
  // VIEW 1: LOGIN
  // ===============================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div className="bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
             <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Beavers Admin</h1>
          <p className="text-gray-500 mb-6">Secure Access</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold focus:border-purple-900 outline-none" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit" className="w-full bg-purple-900 text-white py-3 rounded-lg font-bold hover:bg-purple-800 transition">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // ===============================================
  // VIEW 2: DASHBOARD
  // ===============================================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="bg-purple-900 p-1.5 rounded text-white"><LayoutDashboard size={18}/></div>
             <span className="font-bold text-xl tracking-tight">Command Center</span>
           </div>
           
           {/* STATUS PILL */}
           <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border ${networkStatus === 'Live' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
              <Wifi size={12}/> {networkStatus}: {lastUpdated}
           </div>
           
           {/* COUNT PILL */}
           <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-2">
              <Database size={12}/> Total: {appointments.length}
           </div>
        </div>

        <div className="flex gap-2">
            <button onClick={fetchAppointments} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 transition">
                <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 transition border border-red-100">
                <LogOut size={14} /> Logout
            </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Appointments</h2>
            <p className="text-gray-500 font-medium">Real-time overview of patient bookings.</p>
          </div>
          
          {/* BRANCH FILTER TABS */}
          <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            {uniqueBranches.map(f => (
              <button key={f} onClick={() => setFilter(f as string)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-purple-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>{f as string}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Patient</th>
                <th className="p-5 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Service</th>
                <th className="p-5 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Date</th>
                <th className="p-5 text-gray-400 font-extrabold uppercase text-xs tracking-wider">Status</th>
                <th className="p-5 text-center text-gray-400 font-extrabold uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? 
                <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center gap-2">
                  <Search size={32} className="opacity-20"/>
                  <span>No appointments found for this filter.</span>
                </td></tr> 
              : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-purple-50/50 transition duration-150 group">
                  <td className="p-5 align-top">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md">
                        {app.patient?.user?.full_name?.charAt(0) || <User size={18}/>}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{app.patient?.user?.full_name || "Unknown Guest"}</div>
                        <div className="text-xs text-gray-500 font-bold">{app.patient?.user?.phone || "No Phone"}</div>
                        
                        {/* DOCTOR BADGE */}
                        {app.doctor_name && (
                          <div className="mt-1 flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold w-fit uppercase tracking-wide">
                            <Stethoscope size={10} /> Dr. {app.doctor_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-5 align-top">
                    <div className="font-bold text-gray-700">{app.service?.name || "General Service"}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">{app.branch?.name || "No Branch"}</div>
                  </td>
                  <td className="p-5 align-top">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm"><Calendar size={14} className="text-gray-400"/> {new Date(app.start_time).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-1 font-bold"><Clock size={14} className="text-gray-300"/> {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="p-5 align-top">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      app.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                      app.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 align-top flex justify-center gap-2">
                    <button onClick={() => handleAssignDoctor(app.id)} className="p-2 bg-white border border-gray-200 text-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition shadow-sm" title="Assign Doctor"><Stethoscope size={16}/></button>
                    <button onClick={() => handleStatusChange(app.id, app.status)} className="p-2 bg-white border border-gray-200 text-green-600 rounded-lg hover:bg-green-50 hover:border-green-200 transition shadow-sm" title="Complete"><Check size={16}/></button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition shadow-sm" title="Delete"><Trash2 size={16}/></button>
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