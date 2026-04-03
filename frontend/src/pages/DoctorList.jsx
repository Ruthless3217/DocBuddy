import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Filter, Calendar, Heart, ShieldCheck, ChevronRight, Stethoscope, Award, Users } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryPill = ({ name, active, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
      active 
        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200 scale-105' 
        : 'bg-white border-slate-100 text-slate-500 hover:border-primary-300 hover:text-primary-500'
    }`}
  >
    {name}
  </button>
);

const DoctorCard = ({ doctor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="glass-card p-6 flex flex-col md:flex-row gap-8 items-start md:items-center relative border-white/50 group hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500"
  >
    <div className="relative shrink-0">
      <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden shadow-2xl relative">
        <img src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=f3f4f6&color=475569&size=200`} alt={doctor.firstName} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent"></div>
      </div>
      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        <Heart size={20} fill="currentColor" />
      </div>
      {doctor.isVerified && (
        <div className="absolute -top-3 -left-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-emerald-50 text-emerald-600 font-extrabold text-[9px] uppercase tracking-widest scale-90">
          <ShieldCheck size={14} className="fill-emerald-100" />
          Verified
        </div>
      )}
    </div>

    <div className="flex-1 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-primary-100 shadow-sm">
          {doctor.specialization}
        </span>
        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 shadow-sm">
          <Star size={14} fill="currentColor" />
          <span className="text-[11px] font-extrabold tracking-tightest leading-tightest">{doctor.averageRating || '4.9'}</span>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">({doctor.totalReviews || '120+'})</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Dr. {doctor.firstName} {doctor.lastName}</h3>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">
          <MapPin size={14} className="text-primary-500" />
          {doctor.city}, {doctor.experience}+ Years Exp.
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
            <Users size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Patients</p>
            <p className="text-xs font-extrabold text-secondary-800 leading-tight">1.2k+ Served</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
            <Award size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Qualification</p>
            <p className="text-xs font-extrabold text-secondary-800 leading-tight">MBBS, MS, DNB</p>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 pt-4 md:pt-0">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Consultation Fee</p>
         <p className="text-xl font-display font-extrabold text-secondary-900">₹{doctor.consultationFee || '500'}</p>
      </div>
      <Link to={`/doctor/${doctor._id}`} className="btn-primary !h-14 !rounded-2xl group shadow-lg shadow-primary-200">
        Book Now
        <Calendar size={18} className="group-hover:scale-110 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Specialists');
  const [search, setSearch] = useState('');

  const categories = ['All Specialists', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics'];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctor/search');
        setDoctors(response.data.data || []);
      } catch (err) {
        // Fallback for demo
        setDoctors([
          { _id: '1', firstName: 'Yash', lastName: 'Ranjan', specialization: 'Cardiology', experience: 12, city: 'Delhi', averageRating: 4.8, isVerified: true },
          { _id: '2', firstName: 'Priya', lastName: 'Sharma', specialization: 'Dermatology', experience: 8, city: 'Mumbai', averageRating: 4.9, isVerified: true },
          { _id: '3', firstName: 'Rahul', lastName: 'Verma', specialization: 'Neurology', experience: 15, city: 'Bangalore', averageRating: 4.7, isVerified: false },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => (
    (filter === 'All Specialists' || doc.specialization === filter) &&
    (doc.firstName + doc.lastName + doc.specialization).toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <Stethoscope size={14} />
                Doctor Discovery
             </div>
             <h1 className="text-5xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Find Your Specialist</h1>
             <p className="text-slate-500 font-medium tracking-tightest leading-tight max-w-xl mx-auto">Access world-class medical expertise with AI-assisted doctor recommendations based on your symptoms.</p>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Search by specialty, location, or doctor's name..."
                className="form-input !h-20 pl-16 pr-8 !rounded-[32px] !border-white bg-white shadow-2xl shadow-slate-200/50 !text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="absolute right-3 top-3 bottom-3 px-8 bg-secondary-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2 shadow-xl shadow-slate-200">
                <Filter size={16} />
                Filters
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mask-linear">
              {categories.map(cat => (
                <CategoryPill key={cat} name={cat} active={filter === cat} onClick={setFilter} />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-sm font-extrabold text-secondary-900 tracking-widest uppercase flex items-center gap-3">
                 <Users size={18} className="text-primary-500" />
                 Found {filteredDoctors.length} Specialists
               </h2>
               <div className="flex gap-1.5 items-center text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                  Sort By: Rating
                  <ChevronRight size={14} />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredDoctors.map((doc) => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </AnimatePresence>

              {!loading && filteredDoctors.length === 0 && (
                <div className="glass-card p-20 text-center space-y-6">
                   <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <Search size={48} />
                   </div>
                   <h3 className="text-xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">No Specialists Found</h3>
                   <p className="text-slate-500 font-medium tracking-tightest leading-tightest max-w-xs mx-auto">Try adjusting your filters or search keywords to find more results.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
