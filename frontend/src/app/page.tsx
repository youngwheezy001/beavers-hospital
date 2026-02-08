"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, User, Mail, Phone, Activity, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// --- TYPES ---
interface Branch { id: string; name: string; }
interface Service { id: string; name: string; }

export default function BookingPage() {
  // --- STATE ---
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // CHANGED: We now track date and time separately
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    branch_id: "",
    service_id: "",
    date: "",  // Separate Date string
    time: ""   // Separate Time string
  });

  // --- 1. LOAD DATA ON START ---
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Fetching data from backend...");
        const res = await axios.get('http://localhost:3000/appointments/form-data');
        setBranches(res.data.branches);
        setServices(res.data.services);
        setLoading(false);
      } catch (err) {
        console.error("Backend Connection Error:", err);
        setError("Could not connect to the server. Is the Backend running on Port 3000?");
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- 2. HANDLE SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // CRITICAL FIX: Combine Date and Time into a standard ISO format for the backend
      // This ensures the backend understands the time and sends the email.
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const payload = {
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone,
        branch_id: formData.branch_id,
        service_id: formData.service_id,
        start_time: combinedDateTime.toISOString() // Sends standardized time
      };

      await axios.post('http://localhost:3000/appointments/book', payload);
      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      console.error("Booking Error:", err);
      setError("Failed to submit. Please check your internet or backend connection.");
      setSubmitting(false);
    }
  };

  // --- 3. SUCCESS MESSAGE ---
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border-t-8 border-green-600 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you, <strong>{formData.patient_name}</strong>.<br/>We have sent a confirmation email to <br/><strong>{formData.patient_email}</strong>.
          </p>
          <button 
            onClick={() => { setSuccess(false); setFormData({...formData, patient_name: "", patient_email: "", patient_phone: "", date: "", time: ""}); }}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // --- 4. MAIN FORM LAYOUT ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 md:p-8">
      
      {/* CARD CONTAINER: Equal Size Split */}
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden h-auto md:h-[700px]">
        
        {/* LEFT: SIDEBAR (Services List) */}
        <div className="flex-1 bg-purple-900 text-white p-10 flex flex-col relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-800 rounded-full opacity-50 blur-xl"></div>
          
          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-green-500 p-3 rounded-2xl shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight">BEAVERS<br/>FamilyCare</h1>
            </div>
            <p className="text-purple-200 text-sm font-medium tracking-wide ml-1">Your Health, Our Priority.</p>
          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-6 border-b border-purple-700 pb-3">Available Services</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {loading ? (
              <div className="flex items-center gap-3 text-purple-200 animate-pulse mt-10">
                <Loader2 className="w-6 h-6 animate-spin" /> 
                <span className="text-lg">Loading services...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-purple-800 transition-all cursor-default">
                    <span className="w-2 h-2 bg-green-400 rounded-full group-hover:bg-green-300 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                    <span className="text-purple-100 font-medium group-hover:text-white group-hover:translate-x-1 transition-transform">{s.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT: BOOKING FORM */}
        <div className="flex-1 p-10 md:p-12 overflow-y-auto bg-white relative">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Book an Appointment</h2>
            <p className="text-gray-500 mb-8 text-base">Fill in the details below to schedule your visit.</p>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm border border-red-100 shadow-sm animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 transition-all font-medium placeholder-gray-400"
                    placeholder="e.g. John Doe"
                    value={formData.patient_name}
                    onChange={e => setFormData({...formData, patient_name: e.target.value})}
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="email" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 transition-all font-medium"
                      placeholder="john@example.com"
                      value={formData.patient_email}
                      onChange={e => setFormData({...formData, patient_email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Phone</label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="tel" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 transition-all font-medium"
                      placeholder="+254 7..."
                      value={formData.patient_phone}
                      onChange={e => setFormData({...formData, patient_phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Branch & Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Branch</label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <select 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 appearance-none font-medium cursor-pointer"
                      value={formData.branch_id}
                      onChange={e => setFormData({...formData, branch_id: e.target.value})}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Service</label>
                  <div className="relative mt-1.5">
                    <Activity className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <select 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 appearance-none font-medium cursor-pointer"
                      value={formData.service_id}
                      onChange={e => setFormData({...formData, service_id: e.target.value})}
                    >
                      <option value="">Select Service</option>
                      {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: DATE & TIME SEPARATED */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DATE FIELD */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Date</label>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="date" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium cursor-pointer"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                {/* TIME FIELD */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Time</label>
                  <div className="relative mt-1.5">
                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="time" 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium cursor-pointer"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 mt-6 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                  submitting ? "bg-gray-400 cursor-not-allowed" : "bg-purple-900 hover:bg-purple-800"
                }`}
              >
                {submitting ? "Confirming Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}