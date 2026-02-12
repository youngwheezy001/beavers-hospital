"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Search, Phone, X, Truck, ShieldCheck, AlertCircle, 
  UploadCloud, PlusCircle, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- DATA ---
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

export default function Pharmacy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Checkout States
  const [checkoutMed, setCheckoutMed] = useState<typeof inventory[0] | null>(null);
  const [delivery, setDelivery] = useState(DELIVERY_ZONES[0]);
  const [extendedLoc, setExtendedLoc] = useState(EXTENDED_LOCATIONS[0]);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  
  // Advanced Features States
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [addUpsell, setAddUpsell] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');


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

  // --- FIX: Calculate Total Here so it's visible to the return statement ---
  const totalToDisplay = checkoutMed 
    ? (checkoutMed.price + activeDeliveryFee + (addUpsell ? 1200 : 0)) 
    : 0;

  // --- REAL STK PUSH LOGIC ---
const handlePay = async () => {
    // 1. Validation
    if (!phone || phone.length < 10) {
      setPhoneError(true);
      setTimeout(() => setPhoneError(false), 500); 
      return;
    }

    setStatus('processing');
    setIsProcessing(true);

    try {
      // 2. Trigger Backend API (Use only one method)
      const response = await fetch('/api/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phone, 
          amount: totalToDisplay // Sends the actual total including delivery/upsells
        }),
      });
      
      const data = await response.json();

      if (data.ResponseCode === "0") {
        // 3. Save Order Data to LocalStorage
        const newOrder = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: { phone, location: delivery.id === 'other' ? extendedLoc.name : delivery.name },
          items: [{ name: checkoutMed!.name }, ...(addUpsell ? [{ name: 'Vitamin C + Zinc' }] : [])],
          total: totalToDisplay,
          status: 'PENDING',
          timestamp: new Date().toISOString()
        };

        const existingOrders = JSON.parse(localStorage.getItem('beavers_orders') || '[]');
        localStorage.setItem('beavers_orders', JSON.stringify([newOrder, ...existingOrders]));

        // 4. Show Success Screen after simulated delay
        setTimeout(() => {
          setStatus('success');
          setIsProcessing(false);
        }, 4000); 

      } else {
        setStatus('error');
        setIsProcessing(false);
        alert("⚠️ Payment Request Failed: " + (data.errorMessage || "Try again"));
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setIsProcessing(false);
      alert("❌ System Error. Ensure backend is running.");
    }
  };

  const isPayLocked = checkoutMed?.requiresRx && !prescriptionUploaded;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20 text-slate-900">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-[#0f172a] border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-lg"><CheckCircle2 className="text-[#0f172a]" size={20}/></div>
            <span className="text-white font-black text-xl tracking-tight">BEAVERS FamilyCare</span>
         </div>
         
         <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <Link href="/services" className="hover:text-emerald-400 transition">Departments</Link>
            <Link href="/about" className="hover:text-emerald-400 transition">About Us</Link>
            <Link href="/pharmacy" className="text-emerald-400">E-Pharmacy</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition">Contact</Link>
         </div>

         <Link href="/admin" className="px-5 py-2 bg-emerald-500 text-white rounded-full font-bold text-xs hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
            Staff Portal
         </Link>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#0f172a] text-white pb-32 pt-10 px-6 rounded-b-[3rem] shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black tracking-tight relative z-10">
          Beavers <span className="text-emerald-500">Pharmacy.</span>
        </motion.h1>
        <motion.div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex items-center max-w-2xl mx-auto mt-10 border border-white/10 shadow-xl relative z-10">
          <Search className="text-slate-400 ml-4" />
          <input type="text" placeholder="Search medication (e.g. Panadol)..." className="bg-transparent outline-none text-white placeholder:text-slate-400 flex-1 p-4 font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2 mt-8 relative z-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-800/50 text-slate-300'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Checkout Modal */}
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
                <span className="text-4xl font-black text-slate-900">KES {totalToDisplay}</span>
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