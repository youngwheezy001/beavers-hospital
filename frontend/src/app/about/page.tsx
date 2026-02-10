"use client";
import React from "react";
import Link from "next/link";
import { 
  Activity, Users, Award, Clock, MapPin, Phone, 
  ArrowRight, Heart, Target, Sparkles 
} from "lucide-react";

export default function AboutPage() {
  
  // --- DATA: LEADERSHIP TEAM ---
  const team = [
    {
      name: "Dr. James Mwaura",
      role: "Chief Medical Officer",
      bio: "A leading Cardiologist with over 15 years of experience in interventional cardiology. Former head of department at KNH.",
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Dr. Sarah Njoroge",
      role: "Head of Pediatrics",
      bio: "Specializes in neonatal care and child development. passionate about accessible healthcare for families.",
      img: "https://images.unsplash.com/photo-1594824476969-513344f23308?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Mr. David Omondi",
      role: "Hospital Administrator",
      bio: "Ensures the smooth operation of our facilities, focusing on patient experience and operational efficiency.",
      img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Dr. Amina Hassan",
      role: "Lead Dental Surgeon",
      bio: "Expert in cosmetic dentistry and oral surgery. Dedicated to creating confident smiles.",
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
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
            <Link href="/services" className="hover:text-purple-700 transition">Departments</Link>
            <Link href="/about" className="text-purple-900">About Us</Link>
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
          2. HERO SECTION
      ======================== */}
      <header className="relative pt-40 pb-20 overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm text-xs font-bold uppercase tracking-widest text-purple-700">
              Since 2015
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1]">
              More Than Just a Hospital. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">We Are Family.</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Founded with a mission to bring world-class healthcare to Kajiado County. We believe in treating the person, not just the disease.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516574187841-693025f1d411?q=80&w=1000&auto=format&fit=crop" 
              alt="Medical Team" 
              className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition duration-500 border-4 border-white"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-gray-100">
              <p className="font-bold text-gray-900 text-lg">"Compassion is at the heart of everything we do."</p>
              <p className="text-sm text-gray-400 mt-2">- Dr. Mwaura, CMO</p>
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          3. MISSION & VALUES
      ======================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          
          <div className="space-y-4 p-8 rounded-3xl bg-purple-50 hover:bg-purple-100 transition duration-300">
            <div className="w-12 h-12 bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">To provide accessible, affordable, and high-quality healthcare services to our community through innovation and dedication.</p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-green-50 hover:bg-green-100 transition duration-300">
            <div className="w-12 h-12 bg-green-200 text-green-700 rounded-xl flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">To be the preferred healthcare provider in East Africa, known for clinical excellence and patient-centered care.</p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-blue-50 hover:bg-blue-100 transition duration-300">
            <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">Integrity, Compassion, Innovation, and Teamwork guide every decision we make at Beavers FamilyCare.</p>
          </div>

        </div>
      </section>

      {/* =======================
          4. LEADERSHIP TEAM
      ======================== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-green-600 font-bold tracking-wide uppercase text-sm mb-3">Meet the Experts</h2>
            <h3 className="text-4xl font-black text-gray-900">Our Leadership Team</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group">
                <div className="h-64 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-purple-600 font-medium text-sm mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          5. CTA STRIP
      ======================== */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Join the Family.</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Experience the difference of compassionate care. We are open 24/7 to serve you.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/booking">
              <button className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition">
                Book an Appointment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================
          6. FOOTER
      ======================== */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-purple-900"/>
              <span className="text-xl font-bold text-purple-900">BEAVERS <span className="text-green-600">FamilyCare</span></span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><Link href="/" className="hover:text-purple-700">Home</Link></li>
              <li><Link href="/booking" className="hover:text-purple-700">Book Now</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-lg mb-4 text-gray-900">Legal</h4>
             <ul className="space-y-2 text-gray-500 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Contact</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16}/> Nairobi, Kenya</li>
              <li className="flex items-center gap-2"><Phone size={16}/> +254 700 000 000</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs">
          © 2026 Beavers Hospital Project.
        </div>
      </footer>
    </div>
  );
}