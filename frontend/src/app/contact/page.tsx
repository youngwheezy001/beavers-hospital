"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, Phone, MapPin, Mail, Clock, Send, 
  MessageSquare, User, AlertCircle, CheckCircle, Car, Building 
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate network request (We will connect this to backend later)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* =======================
          1. NAVBAR
      ======================== */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-purple-900 p-2 rounded-xl text-white shadow-lg">
              <Activity size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tight text-purple-900 leading-none block">
              BEAVERS <span className="text-green-600">FamilyCare</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link href="/" className="hover:text-purple-700 transition">Home</Link>
            <Link href="/services" className="hover:text-purple-700 transition">Departments</Link>
            <Link href="/about" className="hover:text-purple-700 transition">About Us</Link>
            <Link href="/contact" className="text-purple-900">Contact</Link>
          </div>

          <Link href="/booking">
            <button className="bg-purple-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-800 transition shadow-lg">
              Book Appointment
            </button>
          </Link>
        </div>
      </nav>

      {/* =======================
          2. HEADER
      ======================== */}
      <header className="bg-purple-900 text-white pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">Get in Touch</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? We are here to listen and help 24/7.
          </p>
        </div>
      </header>

      {/* =======================
          3. CONTACT GRID & FORM
      ======================== */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 pb-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: INFO CARDS */}
          <div className="space-y-6">
            
            {/* Address Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-700 mt-1">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Our Location</h3>
                <p className="text-gray-600 leading-relaxed">
                  NCBA Building, 2nd Floor<br/>
                  Ngong Road, Ngong Town<br/>
                  Kajiado County, Kenya
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Building size={16}/> <span>Opposite Naivas Supermarket</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Car size={16}/> <span>Free Basement Parking</span>
                </div>
              </div>
            </div>

            {/* Contacts Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Phone & Email</h3>
                <p className="text-gray-600 font-medium mb-1">+254 700 000 000 (Main)</p>
                <p className="text-red-500 font-bold mb-3">+254 711 111 111 (Emergency)</p>
                <p className="text-purple-700 font-medium break-all">admin@beavers-hospital.com</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-700 mt-1">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Opening Hours</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between w-48 border-b border-gray-100 pb-1">
                    <span>Emergency / Casualty</span>
                    <span className="font-bold text-green-600">24 Hours</span>
                  </div>
                  <div className="flex justify-between w-48 border-b border-gray-100 pb-1">
                    <span>Specialist Clinics</span>
                    <span className="font-bold">8 AM - 5 PM</span>
                  </div>
                  <div className="flex justify-between w-48">
                    <span>Visiting Hours</span>
                    <span className="font-bold">1 PM - 2 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: FEEDBACK FORM (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-purple-600"/> Send Us a Message
              </h3>
              <p className="text-gray-500 text-sm">Your feedback is sent directly to our administration team.</p>
            </div>
            
            <div className="p-8 md:p-10">
              {status === "success" ? (
                <div className="text-center py-10 animate-in fade-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40}/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 mt-2">Thank you for contacting us. Our team will respond shortly.</p>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-purple-700 font-bold underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                        <input 
                          type="text" required 
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                        <input 
                          type="tel" required 
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                          placeholder="+254 7..."
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                        <input 
                          type="email" required 
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Subject</label>
                      <div className="relative">
                        <AlertCircle className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                        <select 
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition appearance-none"
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                        >
                          <option>General Inquiry</option>
                          <option>Feedback / Complaint</option>
                          <option>Appointment Issue</option>
                          <option>Billing Inquiry</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Message</label>
                    <textarea 
                      required rows={5}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-800 transition flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? "Sending..." : <>Send Message <Send size={20}/></>}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* =======================
          4. GOOGLE MAP (NCBA NGONG)
      ======================== */}
      <section className="h-[500px] w-full bg-gray-200 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6655610899047!2d36.65345727496587!3d-1.3534219986341256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f2070e1766629%3A0xc375003504383437!2sNCBA%20Bank%20-%20Ngong%20Branch!5e0!3m2!1sen!2ske!4v1707604100000!5m2!1sen!2ske" 
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: "grayscale(20%) contrast(1.2)" }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        {/* Map Overlay Card */}
        <div className="absolute bottom-6 left-6 md:left-20 bg-white p-6 rounded-2xl shadow-2xl max-w-sm border-l-4 border-green-500 hidden md:block">
           <h4 className="font-bold text-gray-900 text-lg">Easy Accessibility</h4>
           <p className="text-gray-500 text-sm mt-1">Located at the heart of Ngong Town, inside the NCBA Building. Ample parking available.</p>
           <a 
             href="https://www.google.com/maps/search/?api=1&query=NCBA+Bank+Ngong+Branch" 
             target="_blank"
             className="inline-block mt-3 text-purple-700 font-bold text-sm hover:underline"
           >
             Get Directions →
           </a>
        </div>
      </section>

      {/* =======================
          5. FOOTER
      ======================== */}
      <footer className="bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-green-500"/>
              <span className="text-xl font-bold">BEAVERS <span className="text-green-500">FamilyCare</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing world-class healthcare with a personal touch.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/booking" className="hover:text-green-400 transition">Book Appointment</Link></li>
              <li><Link href="/doctor/login" className="hover:text-green-400 transition">Doctor Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-green-500"/> +254 700 000 000</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-green-500"/> Ngong Road, Nairobi</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs">
          © 2026 Beavers Hospital Project.
        </div>
      </footer>
    </div>
  );
}