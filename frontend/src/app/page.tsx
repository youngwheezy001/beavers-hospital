"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Activity, Calendar, Shield, UserCog, ArrowRight, 
  Phone, MapPin, Clock, Star, CheckCircle, Heart, 
  Eye, Baby, Stethoscope, Menu, X, Microscope, Award, Users,
  // NEW IMPORTS FOR PHARMACY
  Search, Truck, ShieldCheck, AlertCircle, UploadCloud, PlusCircle, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// --- PHARMACY DATA CONSTANTS ---
const inventory = [
  { id: 1, name: 'Panadol Extra', price: 150, costPrice: 90, category: 'Pain Relief', image: '/images/panadol.jpg', requiresRx: false, inStock: true },
  { id: 2, name: 'Amoxicillin 500mg', price: 850, costPrice: 400, category: 'Antibiotics', image: '/images/amoxicillin.jpg', requiresRx: true, inStock: true },
  { id: 3, name: 'Cetirizine (Allergy)', price: 300, costPrice: 120, category: 'Antihistamine', image: '/images/cetirizine.jpg', requiresRx: false, inStock: true },
  { id: 4, name: 'Benylin Cough Syrup', price: 950, costPrice: 600, category: 'Cold & Flu', image: '/images/benylin.jpg', requiresRx: false, inStock: true },
  { id: 5, name: 'Vitamin C + Zinc', price: 1200, costPrice: 800, category: 'Supplements', image: '/images/vitamin-c.jpg', requiresRx: false, inStock: true },
  { id: 6, name: 'Augmentin 625mg', price: 3500, costPrice: 2200, category: 'Antibiotics', image: '/images/augmentin.jpg', requiresRx: true, inStock: false },
  { id: 7, name: 'Ventolin Inhaler', price: 1500, costPrice: 950, category: 'Asthma', image: '/images/ventolin.jpg', requiresRx: true, inStock: true },
  { id: 8, name: 'AL (Malaria Tabs)', price: 600, costPrice: 350, category: 'Antimalarial', image: '/images/malaria.jpg', requiresRx: true, inStock: true },
  { id: 9, name: 'Omeprazole 20mg', price: 400, costPrice: 150, category: 'Digestion', image: '/images/omeprazole.jpg', requiresRx: false, inStock: true },
  { id: 10, name: 'First Aid Kit (Pro)', price: 4500, costPrice: 3000, category: 'Accessories', image: '/images/first-aid.jpg', requiresRx: false, inStock: true },
];

const DELIVERY_ZONES = [
  { id: 'pickup', name: 'Self Pickup (Ready in 15m)', fee: 0 },
  { id: 'ngong', name: 'Ngong / Kiserian Delivery', fee: 150 },
  { id: 'express', name: 'Express Bike (Under 1 hr)', fee: 400 },
  { id: 'other', name: 'Other Locations (Select Below)', fee: 0, isDropdown: true },
];

const EXTENDED_LOCATIONS = [
  { id: 'nrb', name: 'Nairobi CBD', fee: 300 },
  { id: 'kmb', name: 'Kiambu County', fee: 400 },
  { id: 'mks', name: 'Machakos', fee: 500 },
  { id: 'msa', name: 'Mombasa (Courier)', fee: 800 },
];

const categories = ['All', ...Array.from(new Set(inventory.map(item => item.category)))];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- PHARMACY STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [checkoutMed, setCheckoutMed] = useState<typeof inventory[0] | null>(null);
  const [delivery, setDelivery] = useState(DELIVERY_ZONES[0]);
  const [extendedLoc, setExtendedLoc] = useState(EXTENDED_LOCATIONS[0]);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [addUpsell, setAddUpsell] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Scroll Effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- PHARMACY LOGIC ---
  const filteredMeds = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrescriptionUploaded(true);
    }
  };

  const openCheckout = (med: typeof inventory[0]) => {
    setCheckoutMed(med);
    setPrescriptionUploaded(false); 
    setAddUpsell(false); 
  };

  const activeDeliveryFee = delivery.id === 'other' ? extendedLoc.fee : delivery.fee;

  const handlePay = async () => {
    if (!phone || phone.length < 10) {
      setPhoneError(true);
      setTimeout(() => setPhoneError(false), 500); 
      return;
    }
    
    setIsProcessing(true);
    
    // CALCULATE FINANCIALS
    const medPrice = checkoutMed!.price;
    const medCost = checkoutMed!.costPrice;
    const upsellPrice = addUpsell ? 1200 : 0;
    const upsellCost = addUpsell ? 800 : 0; 
    const total = medPrice + activeDeliveryFee + upsellPrice;
    const totalCost = medCost + upsellCost; 

    setTimeout(() => {
      // Create Order Object (In a real app, this goes to backend)
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: { phone: phone, location: delivery.id === 'other' ? extendedLoc.name : delivery.name },
        items: [{ name: checkoutMed!.name }, ...(addUpsell ? [{ name: 'Vitamin C + Zinc' }] : [])],
        total: total,
        cost: totalCost,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };

      // Save to Local Storage
      const existingOrders = JSON.parse(localStorage.getItem('beavers_orders') || '[]');
      localStorage.setItem('beavers_orders', JSON.stringify([newOrder, ...existingOrders]));

      alert(`M-Pesa Prompt sent to ${phone} for KES ${total}.`);
      setIsProcessing(false);
      setCheckoutMed(null);
      setPhone('');
    }, 2000);
  };

  const isPayLocked = checkoutMed?.requiresRx && !prescriptionUploaded;

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
            <a href="pharmacy" className="hover:text-green-400 transition">E-Pharmacy</a>
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
          NEW SECTION: E-PHARMACY (INTEGRATED)
      ======================== */}
      <section id="pharmacy" className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20 mb-6">
              <Truck size={14} /> Instant Delivery
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Beavers <span className="text-emerald-500">ePharmacy.</span></h2>
            <p className="text-gray-400 text-lg">Order verified medicine, upload prescriptions, and get fast delivery to your doorstep.</p>
            
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex items-center mt-10 border border-white/10 shadow-xl max-w-2xl mx-auto">
              <Search className="text-slate-400 ml-4" />
              <input type="text" placeholder="Search medication (e.g. Panadol)..." className="bg-transparent outline-none text-white placeholder:text-slate-400 flex-1 p-4 font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-800/50 text-slate-300'}`}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredMeds.map((med) => (
                <motion.div layout key={med.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-4 shadow-xl border border-slate-100 flex flex-col">
                  <div className="relative h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                    {med.requiresRx && <span className="absolute top-3 left-3 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-lg">Rx Only</span>}
                  </div>
                  <h3 className="text-lg font-black text-slate-800">{med.name}</h3>
                  <p className="text-slate-400 font-bold text-[10px] uppercase mb-4">{med.category}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-emerald-600 font-black text-xl">KES {med.price}</p>
                    <button onClick={() => openCheckout(med)} disabled={!med.inStock} className="px-5 py-3 rounded-xl bg-[#0f172a] text-white font-black text-xs hover:bg-emerald-500 transition">Buy</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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

      {/* =======================
          PHARMACY CHECKOUT MODAL
      ======================== */}
      <AnimatePresence>
        {checkoutMed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">Complete Order</h2>
                <button onClick={() => setCheckoutMed(null)} className="p-2 bg-slate-200 text-slate-600 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"><X size={20}/></button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 flex gap-4 items-center">
                <img src={checkoutMed.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div>
                  <p className="font-black text-slate-800 text-lg">{checkoutMed.name}</p>
                  <p className="text-emerald-600 font-bold">KES {checkoutMed.price}</p>
                </div>
              </div>

              {checkoutMed.requiresRx && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-amber-600"><AlertCircle size={18}/> Prescription Required</h3>
                  <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${prescriptionUploaded ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                    {prescriptionUploaded ? <p className="text-emerald-600 font-black">Document Uploaded ✓</p> : <p className="text-slate-500 text-sm font-bold">Tap to upload doctor's note</p>}
                  </div>
                </div>
              )}

              {(checkoutMed.category === 'Cold & Flu' || checkoutMed.category === 'Antibiotics') && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <h3 className="font-bold text-blue-800 text-sm mb-2 uppercase tracking-wider">Frequently Bought Together</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-xl">🍋</div>
                      <div>
                        <p className="font-black text-slate-800">Vitamin C + Zinc</p>
                        <p className="text-blue-600 font-bold text-sm">+KES 1200</p>
                      </div>
                    </div>
                    <button onClick={() => setAddUpsell(!addUpsell)} className={`p-2 rounded-full transition-all ${addUpsell ? 'bg-blue-600 text-white shadow-md rotate-45' : 'bg-white text-blue-600 hover:bg-blue-100'}`}><PlusCircle size={24} /></button>
                  </div>
                </div>
              )}

              <h3 className="font-bold mb-3 flex items-center gap-2 text-slate-700"><Truck size={18} className="text-emerald-500"/> Select Delivery</h3>
              <div className="space-y-3 mb-8">
                {DELIVERY_ZONES.map(zone => (
                  <div key={zone.id} className="flex flex-col gap-2">
                    <label onClick={() => setDelivery(zone)} className={`flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${delivery.id === zone.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${delivery.id === zone.id ? 'border-emerald-500' : 'border-slate-300'}`}>
                          {delivery.id === zone.id && <motion.div layoutId="activeDot" className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                        </div>
                        <span className="font-bold text-slate-700">{zone.name}</span>
                      </div>
                      <span className="font-black text-emerald-600">{zone.isDropdown ? (delivery.id === zone.id ? `+${extendedLoc.fee}` : '--') : `+${zone.fee}`}</span>
                    </label>
                    <AnimatePresence>
                      {zone.isDropdown && delivery.id === zone.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-2 pb-2 overflow-hidden">
                          <select className="w-full p-3 border-2 border-emerald-200 rounded-xl bg-white text-slate-900 font-bold outline-none cursor-pointer" value={extendedLoc.id} onChange={(e) => setExtendedLoc(EXTENDED_LOCATIONS.find(l => l.id === e.target.value)!)}>
                            {EXTENDED_LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name} (+KES {loc.fee})</option>)}
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <h3 className="font-bold mb-3 flex items-center gap-2 text-slate-700"><Phone size={18} className="text-emerald-500"/> M-Pesa Number</h3>
              <motion.div animate={phoneError ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                <input type="tel" placeholder="e.g. 0712345678" className={`w-full p-4 border-2 rounded-2xl mb-2 font-bold tracking-wider outline-none transition-colors text-slate-900 placeholder:text-slate-500 ${phoneError ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 focus:border-emerald-500'}`} value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }} />
              </motion.div>

              <div className="border-t-2 border-slate-100 pt-6 mt-4 mb-6 flex justify-between items-end">
                <span className="text-slate-500 font-bold">Total to Pay</span>
                <span className="text-4xl font-black text-slate-900">KES {checkoutMed.price + (delivery.id === 'other' ? extendedLoc.fee : delivery.fee) + (addUpsell ? 1200 : 0)}</span>
              </div>
              <button onClick={handlePay} disabled={isProcessing || isPayLocked} className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-2 shadow-xl ${isPayLocked ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-emerald-500/20'}`}>
                {isProcessing ? 'Waiting for PIN...' : isPayLocked ? 'Upload Prescription First' : <><ShieldCheck size={24} /> Pay Securely</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}