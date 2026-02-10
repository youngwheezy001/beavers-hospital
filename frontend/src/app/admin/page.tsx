"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, Calendar, Clock, RefreshCw, Trash2, Stethoscope, Check, User, AlertTriangle, Wifi, Database } from 'lucide-react';

// 🚨 CONFIRM THIS IS YOUR LIVE BACKEND URL
const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  
  // DIAGNOSTIC STATES
  const [lastUpdated, setLastUpdated] = useState<string>("Never"); 
  const [networkStatus, setNetworkStatus] = useState<string>("Waiting...");
  const [recordCount, setRecordCount] = useState<number>(0);

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/appointments/login`, { email: "admin@beavers.com", password: password });
      if (res.data.success) { setIsLoggedIn(true); } 
      else { alert("Incorrect Password!"); }
    } catch (err) { alert("Login Failed. Backend might be sleeping."); }
  };

  // --- FETCH DATA (ROBUST VERSION) ---
  const fetchAppointments = async () => {
    setNetworkStatus("Fetching...");
    try {
      // Force fresh data with timestamp
      const uniqueUrl = `${BACKEND_URL}/appointments/all?t=${new Date().getTime()}`;
      const res = await axios.get(uniqueUrl);
      
      console.log("🔥 DATA RECEIVED:", res.data); // Check Console (F12) if stuck

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
        setRecordCount(res.data.length); // Count how many we found
        setNetworkStatus("Online");
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setNetworkStatus("Format Error");
        console.error("Data is not an array:", res.data);
      }

    } catch (err: any) { 
      console.error("Sync failed:", err);
      setNetworkStatus("Connection Failed");
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

  // --- SAFE FILTERING ---
  // (Prevents crashes if data is missing 'branch')
  const uniqueBranches = ["All", ...Array.from(new Set(appointments.map(app => app.branch?.name || "Unknown").filter(Boolean)))];
  
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    const branchName = app.branch?.name || "Unknown";
    return branchName === filter;
  });

  // ===============================================
  // VIEW 1: LOGIN
  // ===============================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <h1 className="text-3xl font-extrabold text-purple-900 mb-6">Beavers Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="w-full p-3 border rounded-lg text-center text-xl font-bold" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit" className="w-full bg-purple-900 text-white py-3 rounded-lg font-bold hover:bg-purple-800">Login</button>
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
      
      {/* Navbar with DEBUG BAR */}
      <nav className="bg-white border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <span className="font-bold text-xl">Command Center</span>
           
           {/* 🚨 DEBUG STATUS BAR 🚨 */}
           <div className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-2 border ${networkStatus === 'Online' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
              <Wifi size={12}/> {networkStatus}
              <span className="mx-1">|</span>
              <Database size={12}/> Found: {recordCount}
              <span className="mx-1">|</span>
              <Clock size={12}/> {lastUpdated}
           </div>
        </div>

        <div className="flex gap-2">
            <button onClick={fetchAppointments} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <RefreshCw size={12} /> Reload
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm font-bold border border-red-100">Logout</button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-4xl font-black text-gray-900">Appointments</h2>
          <div className="flex gap-2">
            {uniqueBranches.map(f => (
              <button key={f} onClick={() => setFilter(f as string)} className={`px-4 py-2 rounded-lg font-bold ${filter === f ? 'bg-purple-900 text-white' : 'bg-white text-gray-600 border'}`}>{f as string}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? 
                <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-bold">
                  {networkStatus === 'Online' ? "No appointments found yet." : "Waiting for connection..."}
                </td></tr> 
              : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-purple-50 border-b">
                  <td className="p-4">
                    <div className="font-bold text-lg">{app.patient?.user?.full_name || "Unknown Patient"}</div>
                    <div className="text-sm text-gray-500">{app.patient?.user?.phone || "No Phone"}</div>
                    {app.doctor_name && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">👨‍⚕️ Dr. {app.doctor_name}</span>}
                  </td>
                  <td className="p-4">
                    <span className="font-bold block">{app.service?.name || "General"}</span>
                    <span className="text-xs text-gray-400">{app.branch?.name || "Unknown"} Branch</span>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    <div>{new Date(app.start_time).toLocaleDateString()}</div>
                    <div className="text-gray-500">{new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">{app.status}</span></td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleAssignDoctor(app.id)} className="p-2 bg-purple-100 text-purple-700 rounded-full" title="Assign"><Stethoscope size={16}/></button>
                    <button onClick={() => handleStatusChange(app.id, app.status)} className="p-2 bg-green-100 text-green-700 rounded-full" title="Complete"><Check size={16}/></button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 bg-red-100 text-red-700 rounded-full" title="Delete"><Trash2 size={16}/></button>
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