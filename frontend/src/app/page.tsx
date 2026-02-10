"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, Calendar, Shield, UserCog, ArrowRight, 
  Phone, MapPin, Clock, Star, CheckCircle, Heart, 
  Eye, Baby, Stethoscope, Menu, X, Microscope, Award, Users 
} from "lucide-react";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* =======================
          1. INTELLIGENT NAVBAR
      ======================== */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`p-2.5 rounded-xl shadow-lg transition-colors ${isScrolled ? "bg-purple-900 text-white" : "bg-white text-purple-900"}`}>
              <Activity size={24} strokeWidth={3} />
            </div>
            <div>
              <span className={`text-2xl font-black tracking-tight leading-none block ${isScrolled ? "text-purple-900" : "text-white"}`}>
                BEAVERS <span className="text-green-500">FamilyCare</span>
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className={`hidden md:flex items-center gap-8 text-sm font-bold ${isScrolled ? "text-gray-600" : "text-white/90"}`}>
            <Link href="/" className="hover:text-green-400 transition">Home</Link>
            <Link href="/services" className="hover:text-green-400 transition">Departments</Link>
            <Link href="/about" className="hover:text-green-400 transition">About Us</Link>
            <Link href="/contact" className="hover:text-green-400 transition">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/doctor/login" className={`flex items-center gap-2 text-sm font-bold transition ${isScrolled ? "text-gray-500 hover:text-purple-700" : "text-white/80 hover:text-white"}`}>
              <UserCog size={16} /> Staff Portal
            </Link>
            <Link href="/booking">
              <button className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-green-600 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Book Now <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`md:hidden ${isScrolled ? "text-gray-900" : "text-white"}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 space-y-4 shadow-xl">
             <Link href="/services" className="block font-bold text-gray-700">Departments</Link>
             <Link href="/about" className="block font-bold text-gray-700">About Us</Link>
             <Link href="/contact" className="block font-bold text-gray-700">Contact</Link>
             <Link href="/booking" className="block w-full text-center bg-purple-900 text-white py-3 rounded-xl font-bold">Book Appointment</Link>
          </div>
        )}
      </nav>

      {/* =======================
          2. CINEMATIC HERO SECTION
      ======================== */}
      <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2800&auto=format&fit=crop" 
            alt="Hospital Interior" 
            className="w-full h-full object-cover"
          />
          {/* Professional Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center mt-10">
          <div className="space-y-8 animate-in slide-in-from-bottom duration-1000 fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Level 5 Excellence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
              Healthcare <br/>
              Reimagined.
            </h1>
            
            <p className="text-xl text-gray-200 leading-relaxed max-w-lg font-medium drop-shadow-md border-l-4 border-green-500 pl-6">
              Advanced diagnostics. Expert specialists. Compassionate care. 
              Serving Kajiado County with international standards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/booking" className="flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition shadow-lg shadow-green-900/50 hover:-translate-y-1">
                <Calendar size={20} />
                Book Visit
              </Link>
              <Link href="/services" className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transition">
                <Stethoscope size={20} />
                Our Services
              </Link>
            </div>
          </div>

          {/* Floating Glass Card Stats */}
          <div className="hidden md:flex flex-col gap-4 justify-self-end">
             {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl w-64 text-white transform hover:scale-105 transition duration-300">
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-blue-500 p-2 rounded-lg"><Users size={20}/></div>
                 <p className="font-bold text-lg">15k+ Patients</p>
               </div>
               <p className="text-xs opacity-70">Trusted by families across Nairobi.</p>
            </div>
             {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl w-64 text-white transform hover:scale-105 transition duration-300 ml-8">
               <div className="flex items-center gap-3 mb-2">
                 <div className="bg-green-500 p-2 rounded-lg"><CheckCircle size={20}/></div>
                 <p className="font-bold text-lg">98% Success</p>
               </div>
               <p className="text-xs opacity-70">Surgery & treatment success rate.</p>
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          3. INSURANCE STRIP
      ======================== */}
      <section className="bg-gray-50 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">We accept all major insurance providers</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-black text-gray-800 tracking-tighter">NHIF</span>
            <span className="text-2xl font-black text-blue-900 tracking-tighter">JUBILEE</span>
            <span className="text-2xl font-black text-red-700 tracking-tighter">AAR</span>
            <span className="text-2xl font-black text-blue-600 tracking-tighter">BRITAM</span>
            <span className="text-2xl font-black text-orange-600 tracking-tighter">MADISON</span>
            <span className="text-2xl font-black text-green-700 tracking-tighter">KCB HEALTH</span>
          </div>
        </div>
      </section>

      {/* =======================
          4. "WHY US" FEATURES
      ======================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Zero Wait Time</h3>
              <p className="text-gray-500 leading-relaxed">Our smart digital booking system ensures you are seen exactly when you are scheduled. No more crowded waiting rooms.</p>
           </div>
           <div className="space-y-4">
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                <Microscope size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Modern Labs</h3>
              <p className="text-gray-500 leading-relaxed">Fully equipped pathology and radiology labs providing accurate results in under 2 hours.</p>
           </div>
           <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Top Specialists</h3>
              <p className="text-gray-500 leading-relaxed">Home to Kenya's leading consultants in Cardiology, Pediatrics, and Orthopedics.</p>
           </div>
        </div>
      </section>

      {/* =======================
          5. DEPARTMENTS GRID
      ======================== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Center of Excellence</h2>
              <h3 className="text-4xl font-black text-purple-900 mb-4">Specialized Departments</h3>
              <p className="text-gray-500 text-lg">Comprehensive care under one roof.</p>
            </div>
            <Link href="/services" className="text-purple-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All 15+ Services <ArrowRight size={18}/>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cards with Hover Zoom Effect */}
            {[
              { title: "Dental Care", img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800", icon: <Shield size={24}/>, color: "text-blue-300" },
              { title: "Cardiology", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800", icon: <Heart size={24}/>, color: "text-red-300" },
              { title: "Optics", img: "https://images.unsplash.com/photo-1570222094114-2819cd0db397?w=800", icon: <Eye size={24}/>, color: "text-green-300" },
              { title: "Pediatrics", img: "https://images.unsplash.com/photo-1632053002928-19349c28fb43?w=800", icon: <Baby size={24}/>, color: "text-orange-300" }
            ].map((card, i) => (
              <div key={i} className="group rounded-3xl overflow-hidden cursor-pointer relative h-[400px] shadow-lg">
                <img src={card.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={card.title}/>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                  <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                    {card.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-1">{card.title}</h4>
                  <p className="text-sm opacity-80 mb-4">World-class facilities.</p>
                  <span className={`${card.color} font-bold text-sm group-hover:underline flex items-center gap-2`}>Explore <ArrowRight size={14}/></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          6. TESTIMONIALS (Social Proof)
      ======================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-black text-gray-900 mb-16">What Our Patients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah K.", role: "Mother", text: "The maternity wing is world-class. The nurses were so kind and attentive during my delivery. Truly grateful." },
              { name: "James M.", role: "Patient", text: "I booked online and saw Dr. Mwaura within 10 minutes. The system works perfectly. No more wasting time!" },
              { name: "Anita O.", role: "Dental Patient", text: "Best dental experience I've had. The equipment is brand new and the procedure was painless." }
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div>
                <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">{review.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          7. CALL TO ACTION STRIP
      ======================== */}
      <section className="py-20 bg-purple-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Your Health, Our Priority.</h2>
          <p className="text-xl text-purple-200 mb-10">
            Join 10,000+ families who trust Beavers FamilyCare. 
            Book your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <button className="bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-600 transition shadow-xl transform hover:-translate-y-1">
                Book Appointment Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================
          8. FOOTER
      ======================== */}
      <footer className="bg-gray-950 text-white pt-24 pb-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-16 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Activity size={24} className="text-green-500"/>
              <span className="text-2xl font-bold">BEAVERS <span className="text-green-500">FamilyCare</span></span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Leading the way in medical excellence. Kajiado County's preferred healthcare provider.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link href="/booking" className="hover:text-green-400 transition">Book Appointment</Link></li>
              <li><Link href="/doctor/login" className="hover:text-green-400 transition">Doctor Portal</Link></li>
              <li><Link href="/admin" className="hover:text-green-400 transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Departments</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link href="/services" className="hover:text-green-400 transition">Cardiology</Link></li>
              <li><Link href="/services" className="hover:text-green-400 transition">Dental Clinic</Link></li>
              <li><Link href="/services" className="hover:text-green-400 transition">Maternity</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-green-500 mt-1"/> Ngong Road, Nairobi</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-green-500"/> +254 700 000 000</li>
              <li className="flex items-center gap-3"><Clock size={18} className="text-green-500"/> Open 24 Hours</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs font-medium">
          © 2026 Beavers Hospital Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}