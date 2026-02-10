"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, Calendar, FileText, Pill, 
  User, Clock, LogOut, CheckCircle 
} from "lucide-react";

export default function PatientPortal() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. SECURITY CHECK & FETCH DATA
  useEffect(() => {
    const id = localStorage.getItem("beavers_patient_id");
    const name = localStorage.getItem("beavers_patient_name");

    if (!id) {
      router.push("/portal/login");
      return;
    }

    setPatientName(name || "Patient");

    // Fetch Medical History
    fetch(`http://localhost:3000/appointments/patient/${id}/records`)
      .then(r => r.json())
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("beavers_patient_id");
    localStorage.removeItem("beavers_patient_name");
    router.push("/");
  };

  if (loading) return <div className="p-10 text-center">Loading Records...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{patientName}</h1>
            <p className="text-gray-500 text-sm">Patient ID: #{Math.floor(Math.random() * 9000) + 1000}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* MEDICAL RECORDS LIST */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600"/> Medical History & Reports
        </h2>

        {records.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
            <p className="text-gray-400">No medical records found yet.</p>
          </div>
        ) : (
          records.map((rec) => (
            <div key={rec.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              
              {/* Appointment Header */}
              <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {new Date(rec.start_time).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rec.start_time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  rec.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {rec.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                  {rec.status}
                </div>
              </div>

              {/* Appointment Body */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                
                {/* Left: Visit Details */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Visit Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Dr. {rec.doctor.user.full_name}</div>
                        <div className="text-xs text-gray-500">Specialist</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{rec.service_booked.service.name}</div>
                        <div className="text-xs text-gray-500">Service</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: The Diagnosis (Only if Completed) */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-400 uppercase mb-2">Doctor's Report</h3>
                  
                  {rec.status === 'COMPLETED' && rec.consultation ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-gray-500">Diagnosis:</span>
                        <p className="text-sm font-medium text-gray-900">{rec.consultation.diagnosis}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Pill className="w-3 h-3"/> Prescription:
                        </span>
                        <p className="text-sm font-medium text-gray-900">{rec.consultation.prescription}</p>
                      </div>
                      {rec.consultation.notes && (
                        <div className="pt-2 border-t border-blue-200 mt-2">
                           <p className="text-xs text-gray-500 italic">"{rec.consultation.notes}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                      <Clock className="w-8 h-8 mb-2 opacity-20" />
                      <p>Report pending...</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}