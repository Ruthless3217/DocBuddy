import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Star, Clock, ChevronRight,
  MessageSquare, Activity, Stethoscope, TrendingUp,
  CheckCircle2, XCircle, ToggleLeft, ToggleRight,
  Bell, Edit3, Video, Phone, MapPin, Sparkles,
  ArrowUpRight, DollarSign, Heart, FileText, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Appointment Card ──────────────────────────────────────────────────────────
const AppointmentCard = ({ appt, onApprove, onDecline }) => {
  const statusColors = {
    pending: 'bg-amber-50 border-amber-200 text-amber-600',
    approved: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    completed: 'bg-secondary-50 border-secondary-200 text-secondary-600',
    declined: 'bg-red-50 border-red-200 text-red-500',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white/70 backdrop-blur-sm border border-white hover:border-emerald-200 rounded-3xl p-5 transition-all shadow-sm hover:shadow-lg group"
    >
      <div className="flex items-start gap-4">
        <img
          src={`https://ui-avatars.com/api/?name=${appt.patientName}&background=F0FDF4&color=059669&size=80`}
          alt={appt.patientName}
          className="w-12 h-12 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-extrabold text-slate-800 text-sm truncate">{appt.patientName}</h4>
            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full border ${statusColors[appt.status]}`}>
              {appt.status}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{appt.reason}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <Calendar size={11} /> {appt.date}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <Clock size={11} /> {appt.time}
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-semibold ${appt.type === 'video' ? 'text-secondary-500' : appt.type === 'phone' ? 'text-emerald-500' : 'text-primary-500'}`}>
              {appt.type === 'video' ? <Video size={11} /> : appt.type === 'phone' ? <Phone size={11} /> : <MapPin size={11} />}
              {appt.type}
            </span>
          </div>
        </div>
      </div>
      {appt.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onApprove(appt.id)}
            className="flex-1 h-9 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <CheckCircle2 size={14} /> Confirm
          </button>
          <button
            onClick={() => onDecline(appt.id)}
            className="flex-1 h-9 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <XCircle size={14} /> Decline
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatPill = ({ title, value, icon: Icon, color, change }) => (
  <div className={`flex items-center gap-4 p-5 rounded-2xl border ${color} bg-white/60 backdrop-blur-sm`}>
    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
      <Icon size={20} className="text-slate-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-display font-extrabold text-secondary-900 tracking-tight">{value}</h3>
        {change && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><ArrowUpRight size={12} />{change}</span>}
      </div>
    </div>
  </div>
);

// ─── Patient Row ──────────────────────────────────────────────────────────────
const PatientRow = ({ patient }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-none group hover:bg-slate-50/50 px-2 rounded-xl transition-all cursor-pointer">
    <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=ECFDF5&color=059669&size=60`} alt={patient.name} className="w-9 h-9 rounded-xl" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p>
      <p className="text-[10px] text-slate-400 font-medium">{patient.condition} · Last seen {patient.lastSeen}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${patient.risk === 'High' ? 'bg-red-50 text-red-500' : patient.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {patient.risk}
      </span>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
    </div>
  </div>
);

// ─── Main Doctor Dashboard ─────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [isAvailable, setIsAvailable] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const appointments = [
    { id: 1, patientName: 'Rahul Kumar', reason: 'Chest Pain Consultation', date: 'Today', time: '10:30 AM', type: 'video', status: 'pending' },
    { id: 2, patientName: 'Anjali Singh', reason: 'Follow-up: Hypertension', date: 'Today', time: '11:15 AM', type: 'in-person', status: 'approved' },
    { id: 3, patientName: 'Vikram Reddy', reason: 'ECG Report Review', date: 'Tomorrow', time: '2:00 PM', type: 'phone', status: 'pending' },
    { id: 4, patientName: 'Neha Iyer', reason: 'Routine Checkup', date: '15 Apr', time: '9:00 AM', type: 'video', status: 'approved' },
  ];

  const recentPatients = [
    { name: 'Rahul Kumar', condition: 'Hypertension', lastSeen: '2 days ago', risk: 'Medium' },
    { name: 'Priya Verma', condition: 'Diabetes T2', lastSeen: '1 week ago', risk: 'High' },
    { name: 'Amit Saha', condition: 'Post-op Recovery', lastSeen: '3 days ago', risk: 'Low' },
    { name: 'Simran Kaur', condition: 'Atrial Fibrillation', lastSeen: 'Today', risk: 'High' },
    { name: 'Dev Joshi', condition: 'Asthma Management', lastSeen: '5 days ago', risk: 'Low' },
  ];

  const earningsData = [
    { month: 'Jan', amount: 42000 },
    { month: 'Feb', amount: 38000 },
    { month: 'Mar', amount: 55000 },
    { month: 'Apr', amount: 48000 },
  ];

  const maxEarning = Math.max(...earningsData.map(e => e.amount));

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl space-y-10">

        {/* ───── Header ───── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
              <Stethoscope size={14} className="text-emerald-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Doctor Portal</span>
            </div>
            <h1 className="text-4xl font-display font-extrabold text-secondary-900 tracking-tighter">
              Welcome, Dr. {user.firstName || 'Doctor'} <span className="text-emerald-500">👋</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">You have <strong className="text-emerald-600">4 appointments</strong> today and <strong className="text-amber-600">2 pending approvals</strong>.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm transition-all ${isAvailable ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-200 text-slate-500'}`}
            >
              {isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              {isAvailable ? 'Available' : 'Offline'}
            </button>
            <button className="relative w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-300 transition-all shadow-sm">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <Link to="/doctor/profile" className="btn-secondary !rounded-2xl !h-11 !px-5 !bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-100 text-sm">
              <Edit3 size={15} /> Edit Profile
            </Link>
          </div>
        </motion.header>

        {/* ───── Stat Pills ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Today's Appointments", value: '4', icon: Calendar, color: 'border-emerald-100', change: null },
            { title: 'Total Patients', value: '248', icon: Users, color: 'border-secondary-100', change: '+3 this week' },
            { title: 'Average Rating', value: '4.8★', icon: Star, color: 'border-amber-100', change: null },
            { title: 'Monthly Earnings', value: '₹48K', icon: DollarSign, color: 'border-primary-100', change: '+12%' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatPill {...s} />
            </motion.div>
          ))}
        </div>

        {/* ───── Main Grid ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Appointments & Patients */}
          <div className="lg:col-span-2 space-y-8">

            {/* Tab Bar */}
            <div className="flex gap-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-white shadow-sm w-fit">
              {[
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'patients', label: 'My Patients', icon: Users },
                { id: 'queries', label: 'Queries', icon: MessageSquare },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'appointments' && (
                <motion.div key="appts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  {appointments.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      onApprove={(id) => console.log('Approve', id)}
                      onDecline={(id) => console.log('Decline', id)}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'patients' && (
                <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-secondary-900">Recent Patients</h3>
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                        View All <ChevronRight size={13} />
                      </button>
                    </div>
                    {recentPatients.map((p, i) => <PatientRow key={i} patient={p} />)}
                  </div>
                </motion.div>
              )}

              {activeTab === 'queries' && (
                <motion.div key="queries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-secondary-900">Patient Queries</h3>
                      <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded-full">3 Unanswered</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { patient: 'Rahul Kumar', question: 'Can I take ibuprofen with my current medication?', time: '1h ago', answered: false },
                        { patient: 'Priya Verma', question: 'When should I next check my blood sugar?', time: '3h ago', answered: false },
                        { patient: 'Dev Joshi', question: 'Is it normal to feel breathless after my inhaler?', time: 'Yesterday', answered: true },
                      ].map((q, i) => (
                        <div key={i} className={`p-4 rounded-2xl border transition-all ${q.answered ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30 hover:border-amber-300 cursor-pointer'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700">{q.patient}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">{q.time}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${q.answered ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {q.answered ? 'Answered' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{q.question}</p>
                          {!q.answered && (
                            <button className="mt-3 text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                              Answer Query <ChevronRight size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Stats Sidebar */}
          <div className="space-y-6">
            {/* Earnings Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
              <h3 className="font-bold text-secondary-900 mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" /> Earnings Overview
              </h3>
              <div className="flex items-end gap-3 h-28 mb-3">
                {earningsData.map((e, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-300 rounded-xl"
                      initial={{ height: 0 }}
                      animate={{ height: `${(e.amount / maxEarning) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {earningsData.map((e, i) => (
                  <div key={i} className="flex-1 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{e.month}</p>
                    <p className="text-[10px] font-extrabold text-emerald-600">₹{(e.amount / 1000).toFixed(0)}K</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
              <h3 className="font-bold text-secondary-900 mb-5 flex items-center gap-2">
                <Clock size={18} className="text-primary-500" /> Today's Schedule
              </h3>
              <div className="space-y-3">
                {[
                  { time: '9:00 AM', patient: 'Anjali Singh', type: 'in-person', done: true },
                  { time: '10:30 AM', patient: 'Rahul Kumar', type: 'video', done: false },
                  { time: '11:15 AM', patient: 'Dev Joshi', type: 'phone', done: false },
                  { time: '2:00 PM', patient: 'Neha Iyer', type: 'video', done: false },
                ].map((slot, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${slot.done ? 'opacity-50' : 'bg-slate-50 border border-slate-100'}`}>
                    <span className="text-[10px] font-extrabold text-slate-500 w-14 shrink-0">{slot.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{slot.patient}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">{slot.type}</p>
                    </div>
                    {slot.done && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions CTA */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
              <Sparkles size={28} className="text-emerald-200 mb-4" />
              <h3 className="font-bold text-lg mb-2">Manage Your Profile</h3>
              <p className="text-xs text-emerald-100 mb-5 leading-relaxed">Update your specializations, availability, and fees to attract more patients.</p>
              <div className="space-y-2">
                <button className="w-full h-10 bg-white text-emerald-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <FileText size={14} /> Update Prescriptions
                </button>
                <button className="w-full h-10 bg-white/20 text-white border border-white/30 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                  <Plus size={14} /> Set Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
