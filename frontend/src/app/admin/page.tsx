"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, LogOut, Calendar, Clock, RefreshCw, Trash2, 
  Stethoscope, Check, User, AlertTriangle, Wifi, Database, 
  Users, UserPlus, Lock, Shield, 
  // NEW IMPORTS FOR PHARMACY
  DollarSign, TrendingUp, Package 
} from 'lucide-react';
import { div } from 'framer-motion/client';

// 🚨 CHECK THIS URL: Is this your CURRENT Render URL?
const BACKEND_URL = "https://beavers-hospital.onrender.com"; 

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  
  // --- NEW: STAFF MANAGEMENT STATES ---
  // UPDATED: Added "PHARMACY" to the allowed tabs
  const [activeTab, setActiveTab] = useState<"APPOINTMENTS" | "STAFF" | "PHARMACY">("APPOINTMENTS");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "DOCTOR", department: "" });
  const [generatedPass, setGeneratedPass] = useState("");

  // --- NEW: PHARMACY STATE ---
  const [pharmacyOrders, setPharmacyOrders] = useState<any[]>([]);
  
  // Debugging States
  const [lastUpdated, setLastUpdated] = useState<string>(""); 
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [networkStatus, setNetworkStatus] = useState<"Checking" | "OK" | "Error">("Checking");

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/appointments/login`, { email: "admin@beavers.com", password: password });
      if (res.data.success) { setIsLoggedIn(true); } 
      else { alert("Incorrect Password!"); }
    } catch (err) { alert("Login Failed. Backend might be sleeping."); }
  };

  // --- FETCH DATA (The Diagnostic Version) ---
  const fetchAppointments = async () => {
    setNetworkStatus("Checking");
    setErrorMsg("");
    
    try {
      // 1. Fetch Appointments (Existing Logic)
      const uniqueUrl = `${BACKEND_URL}/appointments/all?t=${new Date().getTime()}`;
      console.log("Fetching from:", uniqueUrl);

      const res = await axios.get(uniqueUrl);
      
      console.log("Raw Data Received:", res.data); // Look at Console (F12) if empty

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
        setNetworkStatus("OK");
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error("Data format incorrect. Expected Array.");
      }

      // 2. Fetch Staff (New Logic - Only if on Staff Tab)
      if (activeTab === "STAFF") {
        const staffRes = await axios.get(`${BACKEND_URL}/staff/all`);
        setStaffList(staffRes.data);
      }

      // 3. NEW: Fetch Pharmacy Orders (Read from LocalStorage to show Real Profits)
      if (activeTab === "PHARMACY") {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem('beavers_orders');
            if (storedData) {
                setPharmacyOrders(JSON.parse(storedData));
            }
        }
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
  }, [isLoggedIn, activeTab]); // Added activeTab dependency

  // --- ACTIONS ---
  const handleAssignDoctor = async (id: string) => {
    // UPDATED: Now supports picking from registered staff or manual entry
    let doctorEmail = prompt("Enter Doctor's Email:");
    if (!doctorEmail) return;
    
    // Check if email is in our registered staff list (Optional User Experience enhancement)
    const registeredStaff = staffList.find(s => s.email === doctorEmail);
    const doctorName = registeredStaff ? registeredStaff.name : prompt("Enter Doctor's Name (Manual Entry):");
    
    if (!doctorName) return;

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

  // --- NEW: PRINT & PHARMACY ACTIONS ---
  const handlePrint = (order: any) => {
    const printContent = document.getElementById(`invoice-${order.id}`);
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); 
    }
  };

  const toggleOrderStatus = (orderId: string) => {
    const updatedOrders = pharmacyOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: order.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' };
      }
      return order;
    });
    setPharmacyOrders(updatedOrders);
    localStorage.setItem('beavers_orders', JSON.stringify(updatedOrders));
  };


  // --- NEW: STAFF ACTIONS ---
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/staff/create`, newStaff);
      setGeneratedPass(res.data.generatedPassword); 
      alert(`✅ Staff Created!\n\nPASSWORD: ${res.data.generatedPassword}\n\n(Copy this now, it won't be shown again)`);
      fetchAppointments();
      setNewStaff({ name: "", email: "", role: "DOCTOR", department: "" });
    } catch (err) { alert("Failed to create staff. Email might exist."); }
  };

  const handleRemoveStaff = async (id: string) => {
    if(!confirm("Remove this staff member? They will no longer be able to login.")) return;
    try { await axios.delete(`${BACKEND_URL}/staff/${id}`); fetchAppointments(); } catch (err) { alert("Failed"); }
  };

  // --- FILTER ---
  const uniqueBranches = ["All", ...Array.from(new Set(appointments.map(app => app.branch?.name).filter(Boolean)))];
  const filteredApps = appointments.filter(app => {
    if (filter === "All") return true;
    return app.branch?.name === filter;
  });

  // --- CALCULATE PROFIT FOR PHARMACY ---
  const totalRevenue = pharmacyOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalProfit = pharmacyOrders.reduce((acc, curr) => acc + ((curr.total || 0) - (curr.cost || 0)), 0);

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
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="bg-purple-900 p-2 rounded-lg text-white shadow-md"><LayoutDashboard size={22}/></div>
             <span className="font-bold text-2xl tracking-tight text-gray-800">Command Center</span>
           </div>

           {/* --- NEW: TAB SWITCHER --- */}
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab("APPOINTMENTS")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === "APPOINTMENTS" ? "bg-white shadow text-purple-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Appointments
              </button>
              <button 
                onClick={() => setActiveTab("STAFF")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === "STAFF" ? "bg-white shadow text-purple-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Staff Management
              </button>
              {/* ADDED PHARMACY BUTTON */}
              <button 
                onClick={() => setActiveTab("PHARMACY")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === "PHARMACY" ? "bg-white shadow text-purple-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Pharmacy Logs
              </button>
           </div>
           
           {/* DIAGNOSTIC PANEL */}
           <div className={`hidden md:flex ml-4 px-3 py-1 rounded text-xs font-mono items-center gap-2 border ${networkStatus === 'OK' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {networkStatus === 'OK' ? <Wifi size={14}/> : <AlertTriangle size={14}/>}
              {networkStatus === 'OK' ? `Live: ${lastUpdated}` : `Error: ${errorMsg}`}
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
        
        {/* =======================
            TAB 1: APPOINTMENTS
        ======================== */}
        {activeTab === "APPOINTMENTS" && (
          <>
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
          </>
        )}

        {/* =======================
            TAB 2: STAFF MANAGEMENT
        ======================== */}
        {activeTab === "STAFF" && (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* LEFT: CREATE FORM */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-900"><UserPlus size={24} className="text-purple-600"/> Add New Staff</h3>
                <form onSubmit={handleCreateStaff} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                    <input required className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl mt-1 focus:bg-white focus:border-purple-500 outline-none transition" placeholder="e.g. Dr. Sarah" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email (Login ID)</label>
                    <input required type="email" className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl mt-1 focus:bg-white focus:border-purple-500 outline-none transition" placeholder="sarah@beavers.com" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Department</label>
                    <select className="w-full border-2 border-gray-100 bg-gray-50 p-3 rounded-xl mt-1 focus:bg-white focus:border-purple-500 outline-none transition cursor-pointer" value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})}>
                      <option value="">Select Dept</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dental">Dental</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <button className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-purple-800 transition transform hover:-translate-y-1">Generate Access</button>
                </form>

                {generatedPass && (
                  <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-2xl animate-in fade-in zoom-in">
                    <p className="text-xs text-green-800 font-bold uppercase mb-1 flex items-center gap-2"><Check size={14}/> Success! Share this:</p>
                    <div className="flex items-center gap-2 mt-2 bg-white p-3 rounded-xl border border-green-100">
                       <Lock size={18} className="text-green-600"/>
                       <span className="text-xl font-mono font-black text-gray-900 tracking-wider">{generatedPass}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">This password is only shown once.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: STAFF LIST */}
            <div className="md:col-span-2">
               <h3 className="font-bold text-2xl mb-6 text-gray-900 flex items-center gap-2"><Shield size={24} className="text-blue-600"/> Active Medical Staff</h3>
               <div className="grid gap-4">
                 {staffList.length === 0 ? (
                   <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                       <Users size={40} className="mx-auto text-gray-300 mb-4"/>
                       <p className="text-gray-500 font-medium">No active staff found.</p>
                       <p className="text-sm text-gray-400">Use the form on the left to add doctors.</p>
                   </div>
                 ) : staffList.map(staff => (
                   <div key={staff.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center hover:shadow-lg transition duration-200 group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{staff.name}</h4>
                          <p className="text-sm text-gray-500 font-medium">{staff.email}</p>
                          <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wide">{staff.department || "General"}</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveStaff(staff.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition" title="Revoke Access">
                        <Trash2 size={20} />
                      </button>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        )}

        {/* =======================
            TAB 3: PHARMACY LOGS (NEW SECTION)
        ======================== */}
        {activeTab === "PHARMACY" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Pharmacy Financials</h2>
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2 text-gray-400 font-bold uppercase text-xs tracking-wider"><DollarSign size={16}/> Total Revenue</div>
                    <div className="text-4xl font-black text-gray-900">KES {totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50">
                    <div className="flex items-center gap-3 mb-2 text-emerald-600 font-bold uppercase text-xs tracking-wider"><TrendingUp size={16}/> Gross Profit</div>
                    <div className="text-4xl font-black text-emerald-600">KES {totalProfit.toLocaleString()}</div>
                    <div className="text-xs text-emerald-500 font-bold mt-2">
                        Margin: {totalRevenue > 0 ? ((totalProfit/totalRevenue)*100).toFixed(1) : 0}%
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider"><Package size={16}/> Total Orders</div>
                    <div className="text-4xl font-black text-blue-600">{pharmacyOrders.length}</div>
                </div>
            </div>

            {/* SALES TABLE */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-gray-400 font-extrabold uppercase text-xs">ID</th>
                            <th className="p-6 text-gray-400 font-extrabold uppercase text-xs">Customer</th>
                            <th className="p-6 text-gray-400 font-extrabold uppercase text-xs">Items Sold</th>
                            <th className="p-6 text-gray-400 font-extrabold uppercase text-xs text-right">Sale Value</th>
                            <th className="p-6 text-gray-400 font-extrabold uppercase text-xs text-right">Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pharmacyOrders.length === 0 ? (
                            <tr><td colSpan={5} className="p-16 text-center text-gray-400 font-medium">No sales recorded yet.</td></tr>
                        ) : pharmacyOrders.map((order, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition">
                                <td className="p-6 font-mono text-sm text-gray-500">#{order.id || "ORD"}</td>
                                <td className="p-6">
                                    <div className="font-bold text-gray-900">{order.customer?.phone || "Unknown"}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase">{order.customer?.location || "Walk-in"}</div>
                                </td>
                                <td className="p-6">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> {item.name}
                                        </div>
                                    ))}
                                </td>
                                <td className="p-6 text-right font-black text-gray-900">KES {order.total}</td>
                                <td className="p-6 text-right font-black text-emerald-600">+KES {(order.total - order.cost)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

      </div>

      {/* HIDDEN PRINT TEMPLATES */}
      <div className="hidden">
        {pharmacyOrders.map((order) => (
          <div key={`invoice-${order.id}`} id={`invoice-${order.id}`} className="p-10 bg-white text-slate-900 font-sans">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-6 mb-8">
              <div><h1 className="text-2xl font-black">BEAVERS FamilyCare</h1><p className="text-sm font-bold text-slate-500">Pharmacy Receipt</p></div>
              <div className="text-right"><p className="font-black">#{order.id?.slice(-8)}</p><p className="text-xs">{new Date(order.timestamp).toLocaleDateString()}</p></div>
            </div>
            <div className="mb-10"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Customer Details</p><p className="font-bold">Phone: {order.customer?.phone}</p><p className="font-bold">Location: {order.customer?.location}</p></div>
            <table className="w-full mb-10"><thead className="border-b border-slate-200 text-left text-[10px] uppercase font-black"><tr><th className="py-2">Description</th><th className="py-2 text-right">Price</th></tr></thead><tbody>{order.items?.map((it: any, k: number) => (<tr key={k} className="border-b border-slate-50"><td className="py-3 font-bold">{it.name}</td><td className="py-3 text-right">Paid</td></tr>))}<tr className="text-lg font-black"><td className="py-6">Total Paid via M-Pesa</td><td className="py-6 text-right">KES {order.total}</td></tr></tbody></table>
            <div className="text-center pt-10 border-t border-slate-100 text-[9px] uppercase font-black text-slate-400 tracking-widest"><p>Thank you for choosing Beavers, Lewis!</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}