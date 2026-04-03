import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MessageSquare, Activity, User, ChevronRight, 
  Clock, ShieldCheck, Heart, Stethoscope, Sparkles, 
  ArrowUpRight, Target, Plus, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 border-white/50 relative overflow-hidden group h-full"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 bg-gradient-to-br ${color} transition-all duration-700 group-hover:scale-150`}></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <ArrowUpRight size={14} className={trend === 'down' ? 'rotate-90' : ''} />
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{title}</p>
      <h3 className="text-3xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">{value}</h3>
    </div>
  </motion.div>
);

const AppointmentRow = ({ session }) => (
  <div className="flex items-center gap-4 p-5 bg-white/40 rounded-[24px] border border-white hover:bg-white/80 hover:border-primary-100 transition-all group group-hover:shadow-xl group-hover:shadow-primary-100/10 mb-4 h-24">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
      <img src={`https://ui-avatars.com/api/?name=${session.doctorName}&background=f1f5f9&color=6366f1&size=100`} alt={session.doctorName} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-extrabold text-secondary-900 truncate leading-tightest tracking-tightest">Dr. {session.doctorName}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 leading-tightest">{session.specialty}</p>
    </div>
    <div className="text-right flex flex-col items-end gap-1 shrink-0">
      <div className="flex items-center gap-1.5 text-primary-500 font-extrabold text-[11px] uppercase tracking-tightest leading-tightest bg-primary-50/50 px-3 py-1 rounded-lg border border-primary-100/50">
        <Clock size={12} />
        {session.time}
      </div>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tightest mr-1">{session.date}</p>
    </div>
  </div>
);

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const appointments = [
    { doctorName: 'Yash Ranjan', specialty: 'Cardiologist', time: '10:30 AM', date: 'Tomorrow' },
    { doctorName: 'Anjali Singh', specialty: 'Neurologist', time: '02:00 PM', date: '5 Apr' }
  ];

  const activities = [
    { icon: MessageSquare, text: 'AI Consultation: Chest Pain Inquiry', color: 'bg-primary-500', time: '2h ago' },
    { icon: Activity, text: 'Heart rate reported by SmartWatch', color: 'bg-secondary-900', time: '4h ago' },
    { icon: Heart, text: 'Vitals: Blood Pressure checked', color: 'bg-rose-500', time: 'Yesterday' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in slide-in-from-top duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                <Sparkles size={14} className="text-primary-400" />
                Live Health Tracking
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">
                Welcome back, {user.firstName || 'User'}!
              </h1>
              <p className="text-slate-500 font-medium tracking-tightest leading-tightest flex items-center gap-2">
                Your health is our priority. You have <span className="text-primary-600 font-bold px-2 py-0.5 bg-primary-50 rounded-lg">2 appointments</span> today.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/ai-chat" className="btn-primary !h-16 !px-8 !rounded-[24px] group shadow-xl shadow-primary-200">
                <Bot size={22} className="group-hover:rotate-12 transition-transform" />
                Ask AI Assistant
              </Link>
              <Link to="/doctors" className="h-16 w-16 bg-white border-2 border-slate-100 rounded-[24px] flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-400 hover:shadow-xl transition-all shadow-sm">
                 <Search size={24} />
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DashboardCard title="Blood Pressure" value="120/80" icon={Activity} color="bg-rose-500" trend="up" trendValue="2%" />
            <DashboardCard title="Avg Heart Rate" value="72 BPM" icon={Heart} color="bg-primary-500" trend="down" trendValue="1.5%" />
            <DashboardCard title="Upcoming Visit" value="April 4" icon={Calendar} color="bg-secondary-900" />
            <DashboardCard title="Vulnerability Index" value="Low" icon={ShieldCheck} color="bg-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
            <div className="lg:col-span-2 space-y-10">
               <div>
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-500">
                          <Stethoscope size={20} />
                       </div>
                       Upcoming Consultations
                    </h2>
                    <Link to="/appointments" className="text-[10px] font-bold text-primary-500 uppercase tracking-[2px] leading-tightest hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Schedule <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {appointments.map((session, i) => (
                      <AppointmentRow key={i} session={session} />
                    ))}
                  </div>
               </div>

               <div>
                 <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-secondary-100 border border-secondary-200 flex items-center justify-center text-secondary-600">
                          <Target size={20} />
                       </div>
                       Active Health Goals
                    </h2>
                    <button className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 transition-transform">
                      <Plus size={14} /> Add Goal
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 border-white/50 group h-32 flex flex-col justify-between">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Daily Water Intake</p>
                       <div className="flex items-end justify-between">
                          <div className="text-2xl font-display font-extrabold text-secondary-900 tracking-tightest leading-none mb-1">
                            2.4L <span className="text-sm text-slate-400">/ 3.0L</span>
                          </div>
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                             <div className="bg-primary-500 h-full w-[80%] rounded-full group-hover:scale-x-110 origin-left transition-transform duration-1000"></div>
                          </div>
                       </div>
                    </div>
                    <div className="glass-card p-6 border-white/50 group h-32 flex flex-col justify-between">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Step Counter</p>
                       <div className="flex items-end justify-between">
                          <div className="text-2xl font-display font-extrabold text-secondary-900 tracking-tightest leading-none mb-1">
                            8,402 <span className="text-sm text-slate-400">/ 10k</span>
                          </div>
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                             <div className="bg-secondary-900 h-full w-[84%] rounded-full group-hover:scale-x-110 origin-left transition-transform duration-1000"></div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <aside className="space-y-12">
               <div>
                  <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-[2px] leading-tightest px-2 mb-8">Recent Activity</h2>
                  <div className="space-y-6 relative ml-4">
                    <div className="absolute top-0 left-[-17px] bottom-0 w-px bg-slate-200"></div>
                    {activities.map((act, i) => {
                      const ActIcon = act.icon;
                      return (
                        <div key={i} className="flex gap-6 relative group">
                          <div className={`absolute top-0 left-[-23px] w-3 h-3 rounded-full border-2 border-slate-50 transition-colors duration-500 group-hover:scale-125 z-10 ${act.color}`}></div>
                          <div className="flex-1 pt-0.5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">{act.time}</p>
                            <h4 className="text-xs font-extrabold text-secondary-800 leading-tight tracking-tightest">{act.text}</h4>
                          </div>
                        </div>
                      )
                    })}
                  </div>
               </div>

               <div className="glass-card p-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-2xl shadow-primary-200 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <Sparkles className="text-primary-200 mb-6 group-hover:rotate-45 transition-transform" size={40} />
                  <h3 className="text-2xl font-display font-extrabold leading-tight mb-4 tracking-tightest">Upgrade to Gold</h3>
                  <p className="text-sm text-primary-50 font-medium tracking-tightest mb-8 leading-relaxed">Get unlimited AI consultation and zero wait time at premium clinics.</p>
                  <button className="w-full h-14 bg-white text-primary-600 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-700/20 hover:scale-105 active:scale-95 transition-all">
                    Explore Plans
                  </button>
               </div>
            </aside>
          </div>

        </div>
      </div>
    </div>
  );
}
