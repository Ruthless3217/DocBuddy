import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, Activity, ShieldAlert, TrendingUp, 
  Stethoscope, Calendar, MessageSquare, BarChart3,
  CheckCircle2, XCircle, Clock, Search, Filter,
  ArrowUpRight, Sparkles, Bell, Settings, Eye,
  Ban, RefreshCw, Database, Globe, Zap, Star
} from 'lucide-react';
import axios from 'axios';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, gradient, change, changeDir }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl"
    style={{ background: gradient }}
  >
    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full blur-xl" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <Icon size={22} />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${changeDir === 'up' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'}`}>
            <ArrowUpRight size={12} className={changeDir === 'down' ? 'rotate-90' : ''} />
            {change}
          </span>
        )}
      </div>
      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-display font-extrabold tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

// ─── Doctor Verification Row ───────────────────────────────────────────────────
const DoctorVerifyRow = ({ doctor, onApprove, onReject }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white hover:border-secondary-200 hover:bg-white/90 transition-all group"
  >
    <img
      src={`https://ui-avatars.com/api/?name=${doctor.name}&background=2563EB&color=fff&size=80`}
      alt={doctor.name}
      className="w-12 h-12 rounded-xl object-cover"
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-slate-800 text-sm truncate">Dr. {doctor.name}</h4>
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{doctor.specialty} · {doctor.city}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <Clock size={10} /> Pending
      </span>
      <button
        onClick={() => onApprove(doctor.id)}
        className="w-8 h-8 bg-emerald-50 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
      >
        <CheckCircle2 size={16} />
      </button>
      <button
        onClick={() => onReject(doctor.id)}
        className="w-8 h-8 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-xl flex items-center justify-center transition-all"
      >
        <XCircle size={16} />
      </button>
    </div>
  </motion.div>
);

// ─── Activity Log Row ──────────────────────────────────────────────────────────
const ActivityLog = ({ log }) => {
  const iconMap = { 'user' : Users, 'doctor': Stethoscope, 'appointment': Calendar, 'query': MessageSquare, 'alert': ShieldAlert };
  const colorMap = { 'user': 'bg-secondary-500', 'doctor': 'bg-emerald-500', 'appointment': 'bg-primary-500', 'query': 'bg-purple-500', 'alert': 'bg-red-500' };
  const Icon = iconMap[log.type] || Activity;
  const color = colorMap[log.type] || 'bg-slate-500';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-none group">
      <div className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-700 leading-tight">{log.message}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{log.time}</p>
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    { title: 'Total Patients', value: '2,847', icon: Users, gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', change: '+12%', changeDir: 'up' },
    { title: 'Active Doctors', value: '143', icon: Stethoscope, gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', change: '+3%', changeDir: 'up' },
    { title: 'Appointments Today', value: '86', icon: Calendar, gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', change: '+8%', changeDir: 'up' },
    { title: 'Pending Verifications', value: '12', icon: ShieldAlert, gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', change: '-2', changeDir: 'down' },
  ];

  const pendingDoctors = [
    { id: 1, name: 'Arjun Sharma', specialty: 'Cardiologist', city: 'Mumbai' },
    { id: 2, name: 'Priya Patel', specialty: 'Dermatologist', city: 'Pune' },
    { id: 3, name: 'Rohit Mehta', specialty: 'Neurologist', city: 'Delhi' },
    { id: 4, name: 'Nisha Kapoor', specialty: 'Pediatrician', city: 'Bengaluru' },
  ];

  const allUsers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@email.com', role: 'patient', status: 'active', joined: '12 Mar 2025' },
    { id: 2, name: 'Dr. Arjun Sharma', email: 'arjun@medmail.com', role: 'doctor', status: 'pending', joined: '10 Apr 2025' },
    { id: 3, name: 'Sneha Rao', email: 'sneha@email.com', role: 'patient', status: 'active', joined: '5 Apr 2025' },
    { id: 4, name: 'Dr. Priya Patel', email: 'priya@medmail.com', role: 'doctor', status: 'pending', joined: '8 Apr 2025' },
    { id: 5, name: 'Anjali Singh', email: 'anjali@email.com', role: 'patient', status: 'banned', joined: '1 Jan 2025' },
  ];

  const activityLogs = [
    { type: 'user', message: 'New patient registered: Rahul Kumar', time: '2 min ago' },
    { type: 'doctor', message: 'Dr. Arjun Sharma submitted verification docs', time: '15 min ago' },
    { type: 'appointment', message: 'Appointment #A2041 completed successfully', time: '32 min ago' },
    { type: 'query', message: 'AI answered query: Hypertension symptoms', time: '1h ago' },
    { type: 'alert', message: 'User ID #P8823 flagged for unusual activity', time: '2h ago' },
    { type: 'doctor', message: 'Dr. Nisha Kapoor profile approved', time: '3h ago' },
    { type: 'user', message: 'Mass notification sent to 2,800+ patients', time: '5h ago' },
  ];

  const systemHealth = [
    { label: 'API Uptime', value: '99.9%', color: 'bg-emerald-500', width: '99.9%' },
    { label: 'AI Model Load', value: '67%', color: 'bg-primary-500', width: '67%' },
    { label: 'DB Response', value: '24ms', color: 'bg-secondary-500', width: '88%' },
    { label: 'Storage Used', value: '48%', color: 'bg-purple-500', width: '48%' },
  ];

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* ───── Header ───── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full mb-4">
              <ShieldAlert size={14} className="text-red-500" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500">Admin Control Panel</span>
            </div>
            <h1 className="text-4xl font-display font-extrabold text-secondary-900 tracking-tighter">
              Platform Command <span className="text-primary-500">Center</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Welcome back, {user.firstName || 'Admin'}. Here's your platform at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-all shadow-sm">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-secondary-500 hover:border-secondary-300 transition-all shadow-sm">
              <Settings size={18} />
            </button>
            <button className="btn-primary !rounded-2xl !h-11 !px-5 text-sm">
              <RefreshCw size={15} /> Refresh Data
            </button>
          </div>
        </motion.header>

        {/* ───── Stat Cards ───── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* ───── Tabs ───── */}
        <div className="flex gap-2 mb-8 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-white shadow-sm w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'doctors', label: 'Doctor Verification', icon: UserCheck },
            { id: 'system', label: 'System Health', icon: Zap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-200'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-extrabold text-secondary-900 text-lg flex items-center gap-3">
                    <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-600">
                      <Activity size={18} />
                    </div>
                    Live Activity Feed
                  </h2>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
                  </span>
                </div>
                <div className="space-y-1">
                  {activityLogs.map((log, i) => <ActivityLog key={i} log={log} />)}
                </div>
              </div>

              {/* Platform Stats + Quick Info */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                  <h3 className="font-display font-extrabold text-secondary-900 mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary-500" /> This Week
                  </h3>
                  {[
                    { label: 'New Registrations', value: '127', color: 'text-secondary-600' },
                    { label: 'AI Consultations', value: '843', color: 'text-primary-600' },
                    { label: 'Appointments Booked', value: '312', color: 'text-emerald-600' },
                    { label: 'Queries Answered', value: '1,204', color: 'text-purple-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none">
                      <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                      <span className={`font-extrabold font-display text-lg ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Top Specializations */}
                <div className="bg-gradient-to-br from-secondary-600 to-secondary-800 rounded-3xl p-6 text-white shadow-xl">
                  <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
                    <Star size={16} className="text-amber-300" /> Top Specializations
                  </h3>
                  {['Cardiologist', 'Neurologist', 'Dermatologist', 'Pediatrics'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-secondary-200 w-4">{i + 1}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-white/60 rounded-full" style={{ width: `${90 - i * 15}%` }} />
                      </div>
                      <span className="text-[10px] text-secondary-200 font-bold w-20 text-right">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── User Management Tab ── */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-extrabold text-secondary-900 text-lg">All Platform Users</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchUser}
                        onChange={e => setSearchUser(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100 w-56 transition-all"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-500 hover:text-secondary-600 rounded-xl text-xs font-bold transition-all">
                      <Filter size={14} /> Filter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-4 pl-2">User</th>
                        <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-4">Role</th>
                        <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-4">Status</th>
                        <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-4">Joined</th>
                        <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <img src={`https://ui-avatars.com/api/?name=${u.name}&background=EFF6FF&color=2563EB&size=60`} alt={u.name} className="w-9 h-9 rounded-xl" />
                              <div>
                                <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                <p className="text-[10px] text-slate-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full ${u.role === 'doctor' ? 'bg-emerald-50 text-emerald-600' : 'bg-secondary-50 text-secondary-600'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : u.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-slate-500 font-medium">{u.joined}</td>
                          <td className="py-4 text-right">
                            <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-8 h-8 bg-secondary-50 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                <Eye size={14} />
                              </button>
                              <button className="w-8 h-8 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                <Ban size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Doctor Verification Tab ── */}
          {activeTab === 'doctors' && (
            <motion.div key="doctors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-extrabold text-secondary-900 text-lg">Pending Verifications</h2>
                  <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-full">{pendingDoctors.length} Awaiting</span>
                </div>
                {pendingDoctors.map(doc => (
                  <DoctorVerifyRow
                    key={doc.id}
                    doctor={doc}
                    onApprove={(id) => console.log('Approve', id)}
                    onReject={(id) => console.log('Reject', id)}
                  />
                ))}
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                  <h3 className="font-bold text-secondary-900 mb-5 flex items-center gap-2">
                    <UserCheck size={18} className="text-emerald-500" /> Verification Stats
                  </h3>
                  {[
                    { label: 'Approved This Month', value: 23, color: 'text-emerald-600' },
                    { label: 'Rejected This Month', value: 4, color: 'text-red-500' },
                    { label: 'Total Verified Doctors', value: 143, color: 'text-secondary-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className={`font-extrabold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white">
                  <CheckCircle2 size={32} className="mb-4 text-emerald-200" />
                  <h3 className="font-bold text-lg mb-2">Verification Checklist</h3>
                  <ul className="space-y-2">
                    {['Medical License', 'Degree Certificate', 'Identity Proof', 'Specialization Certificate'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-emerald-100">
                        <CheckCircle2 size={14} className="text-emerald-300 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── System Health Tab ── */}
          {activeTab === 'system' && (
            <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl border border-white p-6 shadow-sm">
                <h2 className="font-display font-extrabold text-secondary-900 text-lg mb-6 flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Database size={18} className="text-purple-600" />
                  </div>
                  System Performance
                </h2>
                <div className="space-y-6">
                  {systemHealth.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                        <span>{item.label}</span>
                        <span className="font-extrabold">{item.value}</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: item.width }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { label: 'Avg Response', value: '24ms', icon: Zap, color: 'text-amber-500 bg-amber-50' },
                    { label: 'Active Sessions', value: '312', icon: Globe, color: 'text-secondary-500 bg-secondary-50' },
                    { label: 'Error Rate', value: '0.02%', icon: ShieldAlert, color: 'text-emerald-500 bg-emerald-50' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center">
                      <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <item.icon size={18} />
                      </div>
                      <p className="text-lg font-extrabold font-display text-secondary-900">{item.value}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-secondary-700 to-secondary-900 rounded-3xl p-6 text-white">
                  <Sparkles size={28} className="text-secondary-300 mb-4" />
                  <h3 className="font-bold text-lg mb-2">All Systems Nominal</h3>
                  <p className="text-xs text-secondary-300 mb-6 leading-relaxed">All microservices are running within expected parameters. No critical alerts.</p>
                  <div className="space-y-2">
                    {['API Gateway', 'Auth Service', 'AI Engine', 'Database', 'Notification Service'].map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-secondary-300">{s}</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Operational
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
