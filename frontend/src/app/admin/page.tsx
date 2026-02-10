"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, LogOut, Calendar, MapPin, User, Clock, Filter, CheckCircle, Trash2, Check, Stethoscope } from 'lucide-react';

export default function AdminDashboard() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All"); 

  // --- 1. LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://beavers-hospital.onrender.com/appointments/login', { 
        email: "admin@beavers.com", 
        password: password 
      });
      
      if (res.data.success) {
        setIsLoggedIn(true);
        fetchAppointments();
      } else {
        alert("Incorrect Password!");
      }
    } catch (err) {
      alert("Login Failed. Is backend running?");
    }
  };

  // --- 2. FETCH DATA ---
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://beavers-hospital.onrender.com/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    // --- AUTO-REFRESH FIX 🚨 ---
  useEffect(() => {
    if (isLoggedIn) {
      // Fetch immediately
      fetchAppointments();

      // Then fetch every 5 seconds
      const interval = setInterval(() => {
        fetchAppointments();
      }, 5000);

      // Cleanup when leaving the page
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]); // Only run when logged in
  };

  // --- 3. ACTIONS: ASSIGN DOCTOR ---
  const handleAssignDoctor = async (id: string) => {
    const doctorName = prompt("Enter Doctor's Name (e.g., Dr. Mwaura):");
    if (!doctorName) return;

    const doctorEmail = prompt(`Enter email for ${doctorName}:`);
    if (!doctorEmail) return;

    try {
      await axios.patch(`https://beavers-hospital.onrender.com/appointments/${id}/assign`, { 
        doctorName, 
        doctorEmail 
      });
      alert(`✅ Assigned to ${doctorName}! Email sent.`);
      fetchAppointments();
    } catch (err) {
      alert("Failed to assign doctor.");
    }
  };

  // --- 4. ACTIONS: UPDATE STATUS ---
  const handleStatusChange = async (id: string, currentStatus: string) => {
    let newStatus = "CONFIRMED";
    if (currentStatus === "CONFIRMED") newStatus = "COMPLETED";
    if (currentStatus === "COMPLETED") return; 

    try {
      await axios.patch(`https://beavers-hospital.onrender.com/appointments/${id}/status`, { status: newStatus });
      fetchAppointments(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // --- 5. ACTIONS: DELETE ---
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`https://beavers-hospital.onrender.com/appointments/${id}`);
      fetchAppointments(); 
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // --- 6. FILTER LOGIC ---
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    return app.branch?.name.includes(filter);
  });

  // ==========================================
  // VIEW 1: THE LOGIN PAGE
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-gray-200">
          <div className="bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Beavers Admin</h1>
          <p className="text-gray-600 font-semibold mb-8">Enter secure access code</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="password" 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-purple-900 focus:ring-2 focus:ring-purple-200 outline-none text-center text-xl font-bold tracking-widest text-gray-900 placeholder-gray-400 bg-gray-50"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-purple-900 text-white py-4 rounded-lg font-bold hover:bg-purple-800 transition shadow-lg text-lg uppercase tracking-wide">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 font-sans">
      
      {/* 1. TOP NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-900 p-2 rounded-lg shadow-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-tight">Command Center</span>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-5 py-2.5 rounded-full hover:bg-red-100 transition border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        
        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 w-full border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Appointments</h2>
            <p className="text-gray-500 font-medium">Manage patient bookings and schedules.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Branch</span>
            <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-300">
              {["All", "Ngong", "El Paso", "Uthiru"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    filter === f 
                      ? 'bg-purple-900 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="w-[30%] pl-8 py-5 font-extrabold text-gray-700 uppercase text-xs tracking-wider text-left">Patient</th>
                  <th className="w-[20%] pl-8 py-5 font-extrabold text-gray-700 uppercase text-xs tracking-wider text-left">Service</th>
                  <th className="w-[20%] pl-8 py-5 font-extrabold text-gray-700 uppercase text-xs tracking-wider text-left">Date & Time</th>
                  <th className="w-[15%] pl-8 py-5 font-extrabold text-gray-700 uppercase text-xs tracking-wider text-left">Status</th>
                  <th className="w-[15%] py-5 font-extrabold text-gray-700 uppercase text-xs tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-medium">Loading data...</td></tr>
                ) : filteredApps.length === 0 ? (
                  <tr><td colSpan={5} className="p-16 text-center text-gray-500 font-medium">No appointments found.</td></tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-purple-50 transition duration-150 group">
                      
                      {/* Patient Details */}
                      <td className="pl-8 py-5 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {app.patient?.user?.full_name?.charAt(0) || "?"}
                          </div>
                          <div className="truncate pr-4">
                            <p className="font-bold text-gray-900 text-base truncate">{app.patient?.user?.full_name || "Guest"}</p>
                            <p className="text-sm text-gray-500 font-medium truncate">{app.patient?.user?.phone || "No Phone"}</p>
                            {/* SHOW ASSIGNED DOCTOR IF EXISTS */}
                            {app.doctor_name && (
                              <p className="text-xs text-purple-700 font-bold mt-1 bg-purple-100 inline-block px-2 py-0.5 rounded">
                                👨‍⚕️ {app.doctor_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="pl-8 py-5 align-middle">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md border border-blue-100 font-bold whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" /> Standard
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="pl-8 py-5 align-middle">
                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                             <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                               {new Date(app.start_time).toLocaleDateString()}
                             </span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                             <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                               {new Date(app.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="pl-8 py-5 align-middle">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                          app.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-5 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* 1. ASSIGN DOCTOR (VISIBLE ALWAYS unless Completed) */}
                          {app.status !== 'COMPLETED' && (
                            <button 
                              onClick={() => handleAssignDoctor(app.id)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-full transition shadow-sm border border-purple-200"
                              title="Assign Doctor"
                            >
                              <Stethoscope className="w-4 h-4" />
                            </button>
                          )}

                          {/* 2. Confirm / Complete Button */}
                          {app.status !== 'COMPLETED' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, app.status)}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition shadow-sm border border-green-200"
                              title={app.status === 'PENDING' ? "Confirm Booking" : "Mark Completed"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* 3. Delete Button */}
                          <button 
                            onClick={() => handleDelete(app.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full transition shadow-sm border border-red-200"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}