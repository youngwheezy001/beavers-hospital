"use client";
import React from "react";
import Link from "next/link";
import { 
  Activity, Heart, Eye, Baby, Shield, Stethoscope, 
  Microscope, Brain, Bone, ArrowRight, CheckCircle, Phone, MapPin, Clock 
} from "lucide-react";

export default function ServicesPage() {
  
  // --- DATA: DEPARTMENTS ---
  // This makes the content "Heavy" and easy to edit later
  const departments = [
    {
      id: "cardiology",
      title: "Cardiology & Heart Health",
      desc: "Our Cardiac Center offers comprehensive heart care, from non-invasive diagnostics to management of complex heart conditions. Led by Dr. Mwaura.",
      img: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      features: ["ECG & Echocardiograms", "Hypertension Management", "Cardiac Rehabilitation", "24/7 Heart Attack Care"]
    },
    {
      id: "dental",
      title: "Advanced Dental Clinic",
      desc: "A state-of-the-art dental wing focusing on painless procedures, cosmetic dentistry, and oral surgery.",
      img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      features: ["Root Canals", "Teeth Whitening", "Braces & Orthodontics", "Dental Implants"]
    },
    {
      id: "optics",
      title: "Optical & Eye Care",
      desc: "Comprehensive eye examinations and vision correction services using the latest digital phoropter technology.",
      img: "https://images.unsplash.com/photo-1570222094114-2819cd0db397?q=80&w=1000&auto=format&fit=crop",
      icon: <Eye className="w-8 h-8 text-green-500" />,
      features: ["Computerized Eye Testing", "Glaucoma Screening", "Designer Frames", "Contact Lens Fitting"]
    },
    {
      id: "maternity",
      title: "Maternity & Obs/Gyn",
      desc: "We ensure a safe and comfortable journey from conception to delivery. Our labor wards are private and fully equipped.",
      img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1000&auto=format&fit=crop",
      icon: <Baby className="w-8 h-8 text-pink-500" />,
      features: ["Antenatal Clinics", "Normal & CS Delivery", "Postnatal Care", "Family Planning"]
    },
    {
      id: "orthopedics",
      title: "Orthopedics & Trauma",
      desc: "Specialized care for bones, joints, and ligaments. We handle everything from sports injuries to joint replacements.",
      img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
      icon: <Bone className="w-8 h-8 text-orange-500" />,
      features: ["Fracture Management", "Physiotherapy", "Arthritis Care", "Spine Surgery"]
    },
    {
      id: "neurology",
      title: "Neurology & Mental Health",
      desc: " compassionate care for conditions affecting the brain and nervous system, alongside a dedicated mental wellness clinic.",
      img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop",
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      features: ["Stroke Management", "Epilepsy Care", "Counseling Services", "Psychiatric Evaluations"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* =======================
          1. NAVBAR (Consistent)
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
            <Link href="/services" className="text-purple-900">Departments</Link>
            <Link href="/about" className="hover:text-purple-700 transition">About Us</Link>
            <Link href="/contact" className="hover:text-purple-700 transition">Contact</Link>
          </div>

          <Link href="/booking">
            <button className="bg-purple-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-800 transition shadow-lg">
              Book Appointment
            </button>
          </Link>
        </div>
      </nav>

      {/* =======================
          2. PAGE HEADER
      ======================== */}
      <header className="bg-purple-900 text-white pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-[150px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">Our Medical Specialties</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Combining advanced technology with compassionate care. Explore our centers of excellence below.
          </p>
        </div>
      </header>

      {/* =======================
          3. DEPARTMENTS LIST
      ======================== */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-24">
        
        {departments.map((dept, index) => (
          <div key={dept.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
            
            {/* Image Side */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] group">
                <img 
                  src={dept.img} 
                  alt={dept.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition"></div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                {dept.icon}
                <span className="font-bold text-gray-700 uppercase text-xs tracking-widest">{dept.id} Dept</span>
              </div>
              
              <h2 className="text-4xl font-black text-gray-900">{dept.title}</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                {dept.desc}
              </p>
              
              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {dept.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/booking">
                  <button className="flex items-center gap-2 text-purple-700 font-bold hover:gap-4 transition-all">
                    Book {dept.title.split(" ")[0]} Appointment <ArrowRight size={20}/>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

      </section>

      {/* =======================
          4. FOOTER
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
              <li className="flex items-center gap-3"><Clock size={16} className="text-green-500"/> Open 24/7</li>
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