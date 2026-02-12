"use client";
import React from "react";
import Link from "next/link";
import { 
  Activity, Heart, Eye, Baby, Shield, Stethoscope, 
  Microscope, Brain, Bone, ArrowRight, CheckCircle, 
  Phone, MapPin, Clock, ShoppingCart, Truck, ShieldCheck, 
  FileText, Scan, Syringe
} from "lucide-react";

// --- COMPONENT: E-PHARMACY CARD ---
export function PharmacyFeatureCard() {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative z-10">
        <div className="bg-emerald-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/30">
          <ShoppingCart className="text-emerald-400" size={40} />
        </div>
        
        <h3 className="text-4xl font-black mb-4">Beavers ePharmacy</h3>
        <p className="text-slate-400 font-medium mb-8 text-lg leading-relaxed max-w-md">
          Skip the queue. Order verified medication, upload prescriptions, and get fast delivery directly to your doorstep in Nairobi & Kajiado.
        </p>

        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-3 text-emerald-300 font-bold">
            <ShieldCheck size={20} /> <span>100% Verified Medication</span>
          </li>
          <li className="flex items-center gap-3 text-emerald-300 font-bold">
            <Truck size={20} /> <span>Express Delivery (Under 1 Hour)</span>
          </li>
        </ul>

        <Link href="/pharmacy">
          <button className="bg-emerald-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all transform group-hover:-translate-y-1">
            Order Medicine Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  
  // --- DATA: DEPARTMENTS ---
  const departments = [
    {
      id: "cardiology",
      title: "Cardiology & Heart Health",
      desc: "Our Cardiac Center offers comprehensive heart care, from non-invasive diagnostics to management of complex heart conditions.",
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
      desc: "Compassionate care for conditions affecting the brain and nervous system, alongside a dedicated mental wellness clinic.",
      img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop",
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      features: ["Stroke Management", "Epilepsy Care", "Counseling Services", "Psychiatric Evaluations"]
    }
  ];

  // --- DATA: DETAILED PRICING (Extracted from Uploaded Files) ---
  const labServices = [
    { name: "MECS", price: "1,700" }, 
    { name: "Troponin", price: "3,000" },
    { name: "LFTs", price: "1,700" }, 
    { name: "D-Dimer", price: "3,000" },
    { name: "PT/INR", price: "1,500" }, 
    { name: "APT T", price: "1,500" },
    { name: "HB", price: "500" }, 
    { name: "FHG", price: "1,000" },
    { name: "RBS", price: "200" }, 
    { name: "HbA1c", price: "2,500" },
    { name: "CRP/ESR", price: "1,500" }, 
    { name: "TFTs", price: "5,500" },
    { name: "Urinalysis", price: "400" }, 
    { name: "Urine C/S", price: "3,500" },
    { name: "H. Pylori Ag", price: "1,000" }, 
    { name: "Beta HCG", price: "3,000" }
  ];

  const imagingServices = [
    { name: "Abdominal U/S (ANC)", price: "1,500" }, 
    { name: "Obstetrics U/S", price: "1,500" },
    { name: "Pelvic U/S", price: "1,500" }, 
    { name: "Trans-Abdominal U/S", price: "2,500" },
    { name: "Thyroid/Neck U/S", price: "6,000" }, 
    { name: "Breast U/S", price: "3,500" },
    { name: "Echocardiogram", price: "8,500" }, 
    { name: "ECG", price: "1,500" },
    { name: "Carotid Doppler", price: "6,000" }, 
    { name: "Venous Doppler", price: "6,500" },
    { name: "Renal Doppler", price: "5,000" }
  ];

  const ancProfile = [
    { name: "RBS", price: "300" }, 
    { name: "HB", price: "500" },
    { name: "VDRL", price: "800" }, 
    { name: "Hepatitis B", price: "1,200" },
    { name: "Blood Grouping", price: "400" }, 
    { name: "Urinalysis", price: "400" },
    { name: "HIV Screening", price: "500" },
    { name: "TOTAL PACKAGE", price: "4,100", highlight: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* =======================
          1. NAVBAR (UPDATED)
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
            
            {/* ADDED E-PHARMACY LINK */}
            <Link href="/pharmacy" className="hover:text-purple-700 transition">E-Pharmacy</Link>
            
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
          3. FEATURED: E-PHARMACY
      ======================== */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-24">
        <PharmacyFeatureCard />
      </section>

      {/* =======================
          4. DEPARTMENTS LIST
      ======================== */}
      <section className="py-10 max-w-7xl mx-auto px-6 space-y-24">
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
          5. DETAILED SERVICE MENU & PRICING
      ======================== */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Transparent Pricing</h2>
            <h3 className="text-4xl font-black text-gray-900">Detailed Service Menu</h3>
            <p className="text-gray-500 mt-4">Standard rates for our most common diagnostic and imaging procedures.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* LAB INVESTIGATIONS CARD */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-700"><Microscope size={24}/></div>
                <h4 className="text-xl font-bold text-gray-900">Lab Investigations</h4>
              </div>
              <ul className="space-y-4">
                {labServices.map((service, i) => (
                  <li key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-600 font-medium">{service.name}</span>
                    <span className="font-bold text-gray-900">KES {service.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* IMAGING SERVICES CARD */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-700"><Scan size={24}/></div>
                <h4 className="text-xl font-bold text-gray-900">Imaging & Ultrasound</h4>
              </div>
              <ul className="space-y-4">
                {imagingServices.map((service, i) => (
                  <li key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="text-gray-600 font-medium">{service.name}</span>
                    <span className="font-bold text-gray-900">KES {service.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ANC PROFILE CARD */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-100 p-3 rounded-xl text-pink-700"><Syringe size={24}/></div>
                <h4 className="text-xl font-bold text-gray-900">ANC Profile</h4>
              </div>
              <ul className="space-y-4">
                {ancProfile.map((service, i) => (
                  <li key={i} className={`flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 ${service.highlight ? 'bg-purple-50 p-3 rounded-lg border-none mt-4' : ''}`}>
                    <span className={`font-medium ${service.highlight ? 'text-purple-900 font-bold uppercase' : 'text-gray-600'}`}>{service.name}</span>
                    <span className={`font-bold ${service.highlight ? 'text-purple-700 text-lg' : 'text-gray-900'}`}>KES {service.price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                <p className="text-green-800 text-sm font-medium">Complete Antenatal Care Package Available</p>
                <Link href="/booking">
                  <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition">Book ANC Visit</button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =======================
          6. FOOTER
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