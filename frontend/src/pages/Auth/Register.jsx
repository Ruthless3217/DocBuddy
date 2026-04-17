import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Heart, UserPlus, Stethoscope } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';

const RoleCard = ({ type, icon: Icon, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(type)}
    className={`flex-1 p-6 rounded-[24px] border-2 transition-all duration-300 relative group overflow-hidden ${
      isSelected 
        ? 'border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-100 ring-2 ring-primary-500/10' 
        : 'border-slate-100 bg-white hover:border-primary-400 hover:shadow-xl'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
      isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50'
    } transition-colors duration-300`}>
      <Icon size={24} />
    </div>
    <span className={`block font-bold text-sm tracking-tightest leading-tightest ${isSelected ? 'text-primary-700' : 'text-slate-400'}`}>
      {type === 'patient' ? 'I am a Patient' : 'I am a Doctor'}
    </span>
    {isSelected && (
      <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white scale-75">
        <ShieldCheck size={14} />
      </div>
    )}
  </button>
);

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await authService.register({ ...formData, role });
      toast.success('Welcome to DocBuddy AI!');
      
      const roleDashboard = {
        admin: '/admin/dashboard',
        doctor: '/doctor/dashboard',
        patient: '/dashboard'
      };
      
      navigate(roleDashboard[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient p-6 pt-24 pb-12 overflow-hidden relative">
      <div className="glow-orb -top-20 -left-20 !bg-primary-500"></div>
      <div className="glow-orb -bottom-20 -right-20 !bg-secondary-500"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-xl p-10 relative z-10 border-white/50"
      >
        <div className="text-center space-y-4 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="text-white fill-white" size={28} />
            </div>
          </Link>
          <h2 className="text-3xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Create Account</h2>
          <p className="text-slate-500 font-medium tracking-tightest leading-tightest">Start your journey with intelligent healthcare</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="flex gap-4">
            <RoleCard 
              type="patient" 
              icon={UserPlus} 
              isSelected={role === 'patient'} 
              onSelect={setRole} 
            />
            <RoleCard 
              type="doctor" 
              icon={Stethoscope} 
              isSelected={role === 'doctor'} 
              onSelect={setRole} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">First Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  name="firstName"
                  required
                  className="form-input pl-11"
                  placeholder="Yash"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">Last Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  name="lastName"
                  required
                  className="form-input pl-11"
                  placeholder="Ranjan"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary-800 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                name="email"
                type="email" 
                required
                className="form-input pl-11"
                placeholder="yash@example.com"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Phone size={18} />
                </div>
                <input 
                  name="phone"
                  required
                  className="form-input pl-11"
                  placeholder="+91 9876543210"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  name="password"
                  type="password" 
                  required
                  className="form-input pl-11"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full h-16 group disabled:opacity-70 mt-4 shadow-xl shadow-primary-200"
          >
            {isLoading ? 'Creating Account...' : (
              <>
                Join DocBuddy AI
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign In Now</Link>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[2px] leading-tightest">
          <ShieldCheck size={16} className="text-secondary-400" />
          GDPR Compliant & HIPAA Ready Infrastructure
        </div>
      </motion.div>
    </div>
  );
}
