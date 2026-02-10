"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, CheckCircle, Clock, FileText, 
  Activity, Power, LogOut, ShieldAlert 
} from "lucide-react";

export default function DoctorPortal() {
  const router = useRouter();
  
  // SECURE STATE
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1. SECURITY CHECK (The "Bouncer")
  useEffect(() => {
    // Check for ID Badge in browser pocket
    const storedId = localStorage.getItem("beavers_doctor_id");
    const storedName = localStorage.getItem("beavers_doctor_name");

    if (!storedId) {
      // No badge? Kick them out!
      router.push("/doctor/login");
    } else {
      setDoctorId(storedId);
      setDoctorName(storedName || "Doctor");
      fetchData(storedId);
    }
  }, []);

  // 2. FETCH PRIVATE DATA
  const fetchData = async (id: string) => {
    try {
      // Get Appointments
      const resAppts = await fetch(`http://localhost:3000/appointments/doctor/${id}`);
      const dataAppts = await resAppts.json();
      setAppointments(dataAppts);

      // Get Status
      const resStaff = await fetch("http://localhost:3000/appointments/admin/staff");
      const dataStaff = await resStaff.json();
      const myProfile = dataStaff.find((d: any) => d.id === id);
      if (myProfile) setIsOnline(myProfile.is_online);
      
    } catch (e) {
      console.error("Data error", e);
    } finally {
      setLoading(false);
    }
  };

  // 3. ACTIONS
  const toggleStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await fetch(`http://localhost:3000/appointments/doctor/${doctorId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_online: newStatus })
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("beavers_doctor_id");
    localStorage.removeItem("beavers_doctor_name");
    router.push("/doctor/login");
  };

  const handleConsultation = (id: string) => {
    const diagnosis = prompt("Enter Diagnosis:");
    if(diagnosis) {
       fetch(`http://localhost:3000/appointments/${id}/consultation`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ diagnosis, prescription: "Standard Care", notes: "None" })
       }).then(() => {
         alert("Consultation Saved!");
         window.location.reload();
       });
    }
  };

  if (loading) return <div className="p-10 text-center">Verifying Credentials...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dr. {doctorName.split(' ')[1]}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-green-500"/> Secure Session Active
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
              isOnline 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            <Power className={`w-4 h-4 ${isOnline ? "fill-current" : ""}`} />
            {isOnline ? "Online" : "Busy"}
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* APPOINTMENT LIST */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600"/> Today's Rounds
        </h2>

        {appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
             <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No appointments found</h3>
             <p className="text-gray-400">Your schedule is clear.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {app.patient.user.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{app.patient.user.full_name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                       <Activity className="w-3 h-3" /> {app.service_booked.service.name}
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">
                      {new Date(app.start_time).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                   {app.status === 'COMPLETED' ? (
                     <span className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg flex items-center gap-2">
                       <CheckCircle className="w-4 h-4"/> Done
                     </span>
                   ) : (
                     <button onClick={() => handleConsultation(app.id)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
                       <FileText className="w-4 h-4" /> Consult
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