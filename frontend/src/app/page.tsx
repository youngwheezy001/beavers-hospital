"use client";
import React from "react";
import Link from "next/link";
import { 
  Activity, Calendar, Shield, Stethoscope, UserCog, ArrowRight, 
  Phone, MapPin, Clock, Star, CheckCircle, Heart, User 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* =======================
          1. NAVBAR
      ======================== */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo - Matches Booking Page Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-purple-900 p-2 rounded-xl text-white shadow-lg">
              <Activity size={24} strokeWidth={3} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-purple-900 leading-none block">
                BEAVERS <span className="text-green-600">FamilyCare</span>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link href="#services" className="hover:text-purple-700 transition">Departments</Link>
            <Link href="#doctors" className="hover:text-purple-700 transition">Specialists</Link>
            <Link href="#about" className="hover:text-purple-700 transition">About Us</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/doctor/login" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-purple-700 transition">
              <UserCog size={16} /> Staff Login
            </Link>
            <Link href="/booking">
              <button className="bg-purple-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-purple-900/20 hover:bg-purple-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Book Now <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* =======================
          2. HERO SECTION
      ======================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/3 -translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Accepting New Patients
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
              Modern Healthcare <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-600">Simplified.</span>
            </h1>
            
            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Say goodbye to long queues. Book appointments instantly, access your records online, and get treated by Kenya's top specialists.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/booking" className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <Calendar size={20} />
                Book Appointment
              </Link>
              <button className="flex items-center justify-center gap-3 bg-white text-red-600 border-2 border-red-50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 hover:border-red-200 transition">
                <Phone size={20} />
                Emergency: 911
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-8 flex items-center gap-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                ))}
              </div>
              <div className="text-sm font-bold text-gray-600">
                <div className="flex text-yellow-400 mb-0.5"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                Trusted by 10,000+ Families
              </div>
            </div>
          </div>

          {/* Right: Immersive Image Composition */}
          <div className="relative animate-in slide-in-from-right duration-700 fade-in delay-200 hidden lg:block">
            {/* Main Image */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
              <img 
                src="https://images.unsplash.com/photo-1638202993631-4325c9a1a972?q=80&w=1000&auto=format&fit=crop" 
                alt="Modern Hospital" 
                className="w-full h-[600px] object-cover"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg flex items-center gap-4 max-w-xs border border-white/50">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">System Online</p>
                  <p className="text-xs text-gray-500 font-medium">Wait time: &lt; 5 mins</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-purple-200 rounded-[3rem] -z-10"></div>
          </div>
        </div>
      </section>

      {/* =======================
          3. STATS STRIP
      ======================== */}
      <section className="bg-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-purple-800/50">
          {[
            { label: "Expert Doctors", val: "50+" },
            { label: "Medical Departments", val: "15+" },
            { label: "Patients Served", val: "12k+" },
            { label: "Years Experience", val: "25+" },
          ].map((stat, i) => (
            <div key={i} className="px-4">
              <div className="text-4xl lg:text-5xl font-black mb-2 text-green-400">{stat.val}</div>
              <div className="text-purple-200 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =======================
          4. DEPARTMENTS (Visual Grid)
      ======================== */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Our Expertise</h2>
            <h3 className="text-4xl font-black text-purple-900 mb-4">Specialized Care for You</h3>
            <p className="text-gray-500 text-lg">We offer a wide range of specialized medical services using state-of-the-art technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Dental */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/0 transition z-10"></div>
                <img src="https://images.unsplash.com/photo-1588776814546-1ffcf4722e12?auto=format&fit=crop&q=80&w=800" alt="Dental" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Dental Care</h4>
                <p className="text-gray-500 mb-6 line-clamp-2">Comprehensive dental services including cleaning, surgery, and cosmetic procedures.</p>
                <Link href="/booking" className="text-blue-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Book Visit <ArrowRight size={16}/></Link>
              </div>
            </div>

            {/* Card 2: Maternity */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/0 transition z-10"></div>
                <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800" alt="Maternity" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Heart size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Maternal Health</h4>
                <p className="text-gray-500 mb-6 line-clamp-2">Expert care for mothers and babies, from prenatal checkups to safe delivery.</p>
                <Link href="/booking" className="text-pink-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Book Visit <ArrowRight size={16}/></Link>
              </div>
            </div>

            {/* Card 3: Cardiology */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="h-56 overflow-hidden relative">
                 <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/0 transition z-10"></div>
                <img src="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800" alt="Cardiology" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                  <Activity size={24} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Cardiology</h4>
                <p className="text-gray-500 mb-6 line-clamp-2">Advanced heart care diagnostics, monitoring, and treatment plans.</p>
                <Link href="/booking" className="text-red-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Book Visit <ArrowRight size={16}/></Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/booking">
                <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:border-purple-900 hover:text-purple-900 transition">View All 15+ Departments</button>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================
          5. FOOTER
      ======================== */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg text-white">
                <Activity size={20} />
              </div>
              <span className="text-xl font-bold">BEAVERS <span className="text-green-500">FamilyCare</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing world-class healthcare with a personal touch. Your health journey starts here.
            </p>
          </div>
          
          {/* Links Col */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/booking" className="hover:text-green-400 transition">Book Appointment</Link></li>
              <li><Link href="/doctor/login" className="hover:text-green-400 transition">Doctor Portal</Link></li>
              <li><Link href="/admin" className="hover:text-green-400 transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-green-500"/> +254 700 000 000</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-green-500"/> Ngong Road, Nairobi</li>
              <li className="flex items-center gap-3"><Clock size={16} className="text-green-500"/> Open 24/7</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs">
          © 2026 Beavers Hospital Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}