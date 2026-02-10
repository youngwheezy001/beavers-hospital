"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, Calendar, Clock, Filter, CheckCircle, Trash2, Stethoscope, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All"); 

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://beavers-hospital.onrender.com/appointments/login', { email: "admin@beavers.com", password: password });
      if (res.data.success) { setIsLoggedIn(true); } 
      else { alert("Incorrect Password!"); }
    } catch (err) { alert("Login Failed."); }
  };

  // --- FETCH DATA ---
  const fetchAppointments = async () => {
    try {
      const res = await axios.get('https://beavers-hospital.onrender.com/appointments/all');
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  // --- 🚨 AUTO-REFRESH FIX (MOVED TO CORRECT PLACE) ---
  useEffect(() => {
    if (isLoggedIn) {
      // 1. Fetch immediately
      fetchAppointments();
      // 2. Fetch every 5 seconds
      const interval = setInterval(() => { fetchAppointments(); }, 5000);
      // 3. Cleanup
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
      await axios.patch(`https://beavers-hospital.onrender.com/appointments/${id}/assign`, { doctorName, doctorEmail });
      alert(`✅ Assigned to ${doctorName}!`); fetchAppointments();
    } catch (err) { alert("Failed."); }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    let newStatus = currentStatus === "CONFIRMED" ? "COMPLETED" : "CONFIRMED";
    if (currentStatus === "COMPLETED") return; 
    try { await axios.patch(`https://beavers-hospital.onrender.com/appointments/${id}/status`, { status: newStatus }); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete?")) return;
    try { await axios.delete(`https://beavers-hospital.onrender.com/appointments/${id}`); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  // --- FILTER ---
  const uniqueBranches = ["All", ...Array.from(new Set(appointments.map(app => app.branch?.name).filter(Boolean)))];
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    return app.branch?.name === filter;
  });

  // --- VIEW 1: LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold mb-4">Beavers Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" className="w-full p-3 border rounded text-center text-xl" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-purple-900 text-white py-3 rounded font-bold">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-2xl">Command Center</span>
        <button onClick={() => setIsLoggedIn(false)} className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-full">Logout</button>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-4xl font-black">Appointments</h2>
          <div className="flex gap-2">
            {/* DYNAMIC BRANCH BUTTONS */}
            {uniqueBranches.map(f => (
              <button key={f} onClick={() => setFilter(f as string)} className={`px-4 py-2 rounded-lg font-bold ${filter === f ? 'bg-purple-900 text-white' : 'bg-white text-gray-600'}`}>{f as string}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-5">Patient</th><th className="p-5">Service</th><th className="p-5">Date</th><th className="p-5">Status</th><th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? <tr><td colSpan={5} className="p-10 text-center">No appointments found.</td></tr> : filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-purple-50 border-b">
                  <td className="p-5 font-bold">{app.patient?.user?.full_name} <br/><span className="text-xs font-normal text-gray-500">{app.patient?.user?.phone}</span></td>
                  <td className="p-5">{app.service?.name}</td>
                  <td className="p-5">{new Date(app.start_time).toLocaleString()}</td>
                  <td className="p-5"><span className="px-2 py-1 bg-yellow-100 rounded text-xs font-bold">{app.status}</span></td>
                  <td className="p-5 flex justify-center gap-2">
                    <button onClick={() => handleAssignDoctor(app.id)} className="p-2 bg-purple-100 text-purple-700 rounded-full" title="Assign Doctor"><Stethoscope size={16}/></button>
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