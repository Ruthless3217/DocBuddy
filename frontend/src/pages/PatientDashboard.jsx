import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MessageSquare, Activity, ShieldCheck, Heart, 
  Stethoscope, Sparkles, ArrowUpRight, Target, Plus, Search,
  Clock, Bot, ChevronRight, Bell, Pill, Thermometer,
  TrendingUp, Video, Phone, MapPin, Star, CheckCircle2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ─── Vitals Card ──────────────────────────────────────────────────────────────
const VitalCard = ({ title, value, unit, icon: Icon, color, trend, trendVal, normal }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass-card p-5 relative overflow-hidden group cursor-default"
  >
    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${color} blur-xl`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
        <Icon size={18} />
      </div>
      {trend && (
        <span className={`text-[9px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
          <ArrowUpRight size={11} className={trend === 'down' ? 'rotate-90' : ''} />{trendVal}
        </span>
      )}
    </div>
    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <h3 className="text-2xl font-display font-extrabold text-secondary-900 tracking-tighter">{value}</h3>
      {unit && <span className="text-xs text-slate-400 font-semibold">{unit}</span>}
    </div>
    {normal && <p className="text-[9px] text-slate-400 mt-1.5">Normal: {normal}</p>}
  </motion.div>
);

// ─── Appointment Row ──────────────────────────────────────────────────────────
const AppointmentItem = ({ appt }) => {
  const typeIcon = { video: Video, phone: Phone, 'in-person': MapPin };
  const TypeIcon = typeIcon[appt.type] || MapPin;

  return (
    <div className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white/90 rounded-2xl border border-white hover:border-primary-100 transition-all group cursor-pointer">
      <img
        src={`https://ui-avatars.com/api/?name=${appt.doctorName}&background=FFF7ED&color=F97316&size=80`}
        alt={appt.doctorName}
        className="w-12 h-12 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-extrabold text-slate-800 truncate">Dr. {appt.doctorName}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{appt.specialty}</p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <div className="flex items-center gap-1 text-primary-500 text-[10px] font-extrabold bg-primary-50 px-2 py-1 rounded-lg border border-primary-100">
          <Clock size={11} /> {appt.time}
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{appt.date}</p>
        <div className={`flex items-center gap-1 text-[9px] font-bold justify-end ${appt.type === 'video' ? 'text-secondary-500' : appt.type === 'phone' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <TypeIcon size={10} /> {appt.type}
        </div>
      </div>
    </div>
  );
};

// ─── Medication Reminder ──────────────────────────────────────────────────────
const MedReminder = ({ med }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${med.taken ? 'border-emerald-100 bg-emerald-50/40 opacity-60' : 'border-slate-100 bg-white/50 hover:border-primary-200 cursor-pointer hover:bg-white/80'}`}>
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${med.taken ? 'bg-emerald-100 text-emerald-500' : 'bg-primary-50 text-primary-500'}`}>
      {med.taken ? <CheckCircle2 size={16} /> : <Pill size={16} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-800 truncate">{med.name}</p>
      <p className="text-[10px] text-slate-400">{med.dose} · {med.time}</p>
    </div>
    {!med.taken && (
      <button className="text-[9px] font-bold bg-primary-50 text-primary-600 px-2 py-1 rounded-lg border border-primary-100 uppercase tracking-wider hover:bg-primary-500 hover:text-white transition-all">
        Mark
      </button>
    )}
  </div>
);

// ─── Main Patient Dashboard ───────────────────────────────────────────────────
export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const vitals = [
    { title: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'bg-rose-500', trend: 'up', trendVal: '2%', normal: '< 120/80' },
    { title: 'Heart Rate', value: '72', unit: 'BPM', icon: Heart, color: 'bg-primary-500', trend: 'down', trendVal: '1.5%', normal: '60-100 BPM' },
    { title: 'Blood Glucose', value: '98', unit: 'mg/dL', icon: Thermometer, color: 'bg-emerald-500', trend: null, trendVal: null, normal: '70-100 mg/dL' },
    { title: 'Vulnerability', value: 'Low', unit: null, icon: ShieldCheck, color: 'bg-secondary-500', trend: null, trendVal: null, normal: null },
  ];

  const appointments = [
    { doctorName: 'Yash Ranjan', specialty: 'Cardiologist', time: '10:30 AM', date: 'Tomorrow', type: 'video' },
    { doctorName: 'Anjali Singh', specialty: 'Neurologist', time: '02:00 PM', date: '15 Apr', type: 'in-person' },
    { doctorName: 'Rohit Mehta', specialty: 'Dermatologist', time: '11:00 AM', date: '18 Apr', type: 'phone' },
  ];

  const medications = [
    { name: 'Amlodipine 5mg', dose: '1 tablet', time: '8:00 AM', taken: true },
    { name: 'Metformin 500mg', dose: '1 tablet', time: '1:00 PM', taken: false },
    { name: 'Atorvastatin 10mg', dose: '1 tablet', time: '9:00 PM', taken: false },
  ];

  const activities = [
    { icon: MessageSquare, text: 'AI Consultation: Chest Pain Inquiry', color: 'bg-primary-500', time: '2h ago' },
    { icon: Activity, text: 'Heart rate reported: 72 BPM', color: 'bg-secondary-600', time: '4h ago' },
    { icon: Heart, text: 'Vitals: Blood Pressure 118/76', color: 'bg-rose-500', time: 'Yesterday' },
    { icon: Calendar, text: 'Appointment confirmed with Dr. Yash', color: 'bg-emerald-500', time: '2 days ago' },
  ];

  const goals = [
    { label: 'Daily Water Intake', current: 2.4, target: 3.0, unit: 'L', color: 'bg-secondary-500' },
    { label: 'Steps Count', current: 8402, target: 10000, unit: 'steps', color: 'bg-primary-500' },
    { label: 'Sleep Duration', current: 7.2, target: 8.0, unit: 'hrs', color: 'bg-purple-500' },
    { label: 'Mindfulness', current: 15, target: 20, unit: 'min', color: 'bg-emerald-500' },
  ];

  const aiSuggestions = [
    'Why do I feel breathless after climbing stairs?',
    'Is my blood pressure reading normal?',
    'What foods should I avoid with hypertension?',
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl space-y-10">

        {/* ───── AI Quick Prompt (Floating) ───── */}
        <AnimatePresence>
          {showAIPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed bottom-8 right-8 z-50 bg-white rounded-3xl shadow-2xl border border-white p-6 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-secondary-900 flex items-center gap-2">
                  <Bot size={18} className="text-primary-500" /> Quick AI Ask
                </h4>
                <button onClick={() => setShowAIPrompt(false)} className="w-7 h-7 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                {aiSuggestions.map((s, i) => (
                  <Link key={i} to="/ai-chat" className="block text-xs text-slate-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-xl px-3 py-2.5 font-medium transition-all hover:translate-x-1">
                    {s}
                  </Link>
                ))}
              </div>
              <Link to="/ai-chat" className="btn-primary w-full !rounded-2xl !h-11 text-sm">
                <Bot size={15} /> Open AI Chat
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Header ───── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-full mb-4">
              <Sparkles size={14} className="text-primary-500" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600">My Health Hub</span>
            </div>
            <h1 className="text-4xl font-display font-extrabold text-secondary-900 tracking-tighter">
              Hi, {user.firstName || 'Patient'} <span className="text-primary-500">✦</span> Stay Healthy!
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              You have <strong className="text-primary-600">3 upcoming appointments</strong> and <strong className="text-amber-600">2 medications</strong> pending today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIPrompt(!showAIPrompt)}
              className="btn-primary !rounded-2xl !h-12 !px-6 shadow-xl shadow-primary-200 group"
            >
              <Bot size={20} className="group-hover:rotate-12 transition-transform" />
              Ask AI Assistant
            </button>
            <Link to="/doctors" className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-all shadow-sm">
              <Search size={20} />
            </Link>
            <button className="relative w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-all shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
          </div>
        </motion.header>

        {/* ───── Vitals Row ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {vitals.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <VitalCard {...v} />
            </motion.div>
          ))}
        </div>

        {/* ───── Tab Bar ───── */}
        <div className="flex gap-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-white shadow-sm w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'goals', label: 'Health Goals', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ───── Tab Content ───── */}
        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming + Activity */}
              <div className="lg:col-span-2 space-y-8">
                {/* Next Appointment */}
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-100 relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <p className="text-primary-100 text-[10px] font-bold uppercase tracking-widest mb-3">Next Appointment</p>
                  <div className="flex items-center gap-4">
                    <img src="https://ui-avatars.com/api/?name=Yash+Ranjan&background=ffffff&color=F97316&size=80" alt="Dr Yash" className="w-14 h-14 rounded-2xl" />
                    <div>
                      <h3 className="font-extrabold text-xl">Dr. Yash Ranjan</h3>
                      <p className="text-primary-100 text-sm">Cardiologist · Video Consultation</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">Tomorrow</span>
                        <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">10:30 AM</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <button className="w-12 h-12 bg-white text-primary-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Video size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                  <h3 className="font-display font-extrabold text-secondary-900 mb-5 flex items-center gap-2">
                    <Clock size={18} className="text-primary-500" /> Recent Activity
                  </h3>
                  <div className="relative ml-4 space-y-5">
                    <div className="absolute top-0 left-[-17px] bottom-0 w-px bg-slate-100" />
                    {activities.map((act, i) => {
                      const ActIcon = act.icon;
                      return (
                        <div key={i} className="flex gap-4 relative group">
                          <div className={`absolute top-1 left-[-23px] w-3 h-3 rounded-full border-2 border-white group-hover:scale-125 z-10 transition-transform ${act.color}`} />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.time}</p>
                            <h4 className="text-xs font-extrabold text-secondary-800 leading-tight mt-0.5">{act.text}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Medication Quick View */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                  <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Pill size={16} className="text-primary-500" /> Today's Medications
                  </h3>
                  <div className="space-y-3">
                    {medications.map((m, i) => <MedReminder key={i} med={m} />)}
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div className="bg-gradient-to-br from-secondary-700 to-secondary-900 rounded-3xl p-6 text-white shadow-xl shadow-secondary-100 overflow-hidden relative">
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                  <Star size={28} className="text-amber-300 mb-4" />
                  <h3 className="font-extrabold text-xl mb-2">Upgrade to Gold</h3>
                  <p className="text-xs text-secondary-300 mb-5 leading-relaxed">Unlimited AI consultations, priority booking & premium health analytics.</p>
                  <button className="w-full h-10 bg-white text-secondary-700 rounded-xl font-bold text-xs hover:scale-105 transition-transform">
                    Explore Plans
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Appointments ── */}
          {activeTab === 'appointments' && (
            <motion.div key="appts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-extrabold text-secondary-900 text-lg">Upcoming Consultations</h2>
                  <Link to="/doctors" className="btn-primary !rounded-xl !h-9 !px-4 text-xs">
                    <Plus size={14} /> Book New
                  </Link>
                </div>
                {appointments.map((appt, i) => <AppointmentItem key={i} appt={appt} />)}
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm h-fit">
                <h3 className="font-bold text-secondary-900 mb-4">Appointment History</h3>
                {[
                  { doctor: 'Dr. Priya Sharma', date: '5 Apr 2025', status: 'Completed', rating: 5 },
                  { doctor: 'Dr. Arun Verma', date: '20 Mar 2025', status: 'Completed', rating: 4 },
                  { doctor: 'Dr. Nisha Roy', date: '10 Mar 2025', status: 'Cancelled', rating: null },
                ].map((h, i) => (
                  <div key={i} className="py-3 border-b border-slate-50 last:border-none">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">{h.doctor}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${h.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>{h.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-slate-400">{h.date}</p>
                      {h.rating && <div className="flex">{Array.from({length: h.rating}).map((_, j) => <Star key={j} size={10} className="text-amber-400 fill-amber-400" />)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Medications ── */}
          {activeTab === 'medications' && (
            <motion.div key="meds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-extrabold text-secondary-900">Today's Medications</h2>
                  <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded-full">2 pending</span>
                </div>
                <div className="space-y-3">
                  {medications.map((m, i) => <MedReminder key={i} med={m} />)}
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                <h3 className="font-bold text-secondary-900 mb-5">Current Prescriptions</h3>
                {[
                  { name: 'Amlodipine 5mg', prescribedBy: 'Dr. Yash Ranjan', since: 'Jan 2025', duration: 'Ongoing' },
                  { name: 'Metformin 500mg', prescribedBy: 'Dr. Priya Sharma', since: 'Feb 2025', duration: '6 months' },
                  { name: 'Atorvastatin 10mg', prescribedBy: 'Dr. Yash Ranjan', since: 'Jan 2025', duration: 'Ongoing' },
                ].map((p, i) => (
                  <div key={i} className="py-4 border-b border-slate-50 last:border-none">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Pill size={14} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.prescribedBy} · Since {p.since}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-secondary-50 text-secondary-600 font-bold px-2 py-0.5 rounded-full ml-11">{p.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Health Goals ── */}
          {activeTab === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-secondary-900 text-sm">{goal.label}</h3>
                    <span className="text-xs font-extrabold text-slate-500">
                      {goal.current} <span className="text-slate-300">/ {goal.target}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{goal.unit}</span>
                    </span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                    <motion.div
                      className={`h-full ${goal.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">{Math.round((goal.current / goal.target) * 100)}% of daily goal achieved</p>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center transition-colors">
                  <Plus size={22} className="text-primary-500" />
                </div>
                <p className="text-sm font-bold text-slate-500 group-hover:text-primary-600 transition-colors">Add New Goal</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
