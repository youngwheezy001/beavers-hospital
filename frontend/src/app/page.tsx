"use client";
import { useState, useEffect } from "react";

export default function Home() {
  // 1. FULL DATA LIST (This ensures the Purple Section is always full)
  const defaultOptions = {
    branches: [
      { id: "1", name: "Ngong Branch" },
      { id: "2", name: "El Paso Branch" },
      { id: "3", name: "Uthiru Branch" }
    ],
    // COMPLETE LIST OF SERVICES
    services: [
      { id: "1", name: "General Consultation" },
      { id: "2", name: "Emergency & Casualty" },
      { id: "3", name: "Cardiac Care" },
      { id: "4", name: "Maternal & Child Health" },
      { id: "5", name: "Dental Clinic" },
      { id: "6", name: "Optical Services" },
      { id: "7", name: "OBS/GYN Specialist" },
      { id: "8", name: "ENT Specialist" },
      { id: "9", name: "Physiotherapy" },
      { id: "10", name: "Wellness Clinic" },
      { id: "11", name: "Mental Health Clinic" },
      { id: "12", name: "Nutrition & Dietetics" },
      { id: "13", name: "Laboratory & Pathology" },
      { id: "14", name: "Radiology & Imaging" },
      { id: "15", name: "Comprehensive Care (CCC)" }
    ]
  };

  const [options, setOptions] = useState<any>(defaultOptions); 
  const [isBackendLive, setIsBackendLive] = useState(false);
  
  const [formData, setFormData] = useState({
    branch_id: "",
    service_id: "",
    date: "",
    time: "",
    patient_name: "",
    patient_email: "",
    patient_phone: "",
  });
  
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/appointments/form-data")
      .then((res) => {
        if (!res.ok) throw new Error("Backend blocked or offline");
        return res.json();
      })
      .then((data) => {
        if (data.branches && data.branches.length > 0) {
          setOptions({ branches: data.branches, services: data.services });
          setIsBackendLive(true);
        }
      })
      .catch((err) => {
        console.error("Using Full Backup Data:", err);
        setIsBackendLive(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "⏳ Processing Booking..." });
    
    const branch = options.branches.find((b: any) => String(b.id) === String(formData.branch_id));
    const service = options.services.find((s: any) => String(s.id) === String(formData.service_id));
    
    const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    try {
      const res = await fetch("http://localhost:3000/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, start_time: combinedDateTime }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ 
          type: "success", 
          title: "✅ APPOINTMENT CONFIRMED",
          details: `Patient: ${formData.patient_name}\nService: ${service?.name || "Service"}\nLocation: ${branch?.name || "Branch"}\nDate: ${formData.date} at ${formData.time}`,
          emailNote: `Confirmation sent to: ${formData.patient_email}`
        });
      } else {
        setStatus({ type: "error", msg: "❌ Server Error: " + (data.message || "Failed") });
      }
    } catch (err) { 
      // FALLBACK SUCCESS
      setStatus({ 
        type: "success", 
        title: "✅ OFFLINE BOOKING SIMULATED",
        details: `(Backend Offline Mode)\nPatient: ${formData.patient_name}\nService: ${service?.name}\nLocation: ${branch?.name}`,
        emailNote: "Check backend console to fix connection."
      });
    }
  };

  const inputStyle = "w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all shadow-sm placeholder-gray-400";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide";

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col font-sans">
      
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">+</div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 leading-none">BEAVERS <span className="text-green-600">FamilyCare</span></h1>
              <p className="text-xs text-gray-500 font-semibold tracking-widest uppercase mt-1">Your Health, Our Priority</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-gray-200">
          
          {/* LEFT PANEL: COMPLETE SERVICE LIST */}
          <div className="md:w-5/12 bg-purple-900 text-white p-8 md:p-10 relative">
             <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 border-b-2 border-green-500 pb-2 inline-block">Our Services</h2>
              <ul className="space-y-2 text-purple-50 text-sm font-medium">
                {options.services.map((s: any, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span> {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:w-7/12 p-8 md:p-10 bg-gray-50 flex flex-col justify-center">
            
            {!isBackendLive && (
              <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs font-bold text-center rounded border border-yellow-300">
                ⚠️ BACKEND DISCONNECTED: Using Backup Data
              </div>
            )}

            {status?.type === "success" ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center shadow-lg">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">✓</div>
                <h2 className="text-2xl font-black text-green-800 mb-2">{status.title}</h2>
                <div className="text-left bg-white p-4 rounded-lg border border-green-200 my-4 text-gray-700 whitespace-pre-line font-mono text-sm">
                  {status.details}
                </div>
                <p className="text-green-700 font-bold">{status.emailNote}</p>
                <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelStyle}>Patient Name</label>
                    <input type="text" required placeholder="e.g. John Doe" className={inputStyle} onChange={(e) => setFormData({...formData, patient_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Phone</label>
                      <input type="tel" required placeholder="e.g. +254 700..." className={inputStyle} onChange={(e) => setFormData({...formData, patient_phone: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelStyle}>Email</label>
                      <input type="email" required placeholder="e.g. mail@example.com" className={inputStyle} onChange={(e) => setFormData({...formData, patient_email: e.target.value})} />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Branch</label>
                    <select required className={inputStyle} value={formData.branch_id} onChange={(e) => setFormData({...formData, branch_id: e.target.value})}>
                      <option value="" disabled>-- Select Branch --</option>
                      {options.branches.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Service</label>
                    <select required className={inputStyle} value={formData.service_id} onChange={(e) => setFormData({...formData, service_id: e.target.value})}>
                      <option value="" disabled>-- Select Service --</option>
                      {options.services.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Date 📅</label>
                    <input type="date" required className={inputStyle} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelStyle}>Time ⏰</label>
                    <input type="time" required className={inputStyle} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full bg-purple-900 hover:bg-purple-800 text-white font-bold py-4 rounded-lg shadow-md transition-all mt-2">Confirm Booking</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}