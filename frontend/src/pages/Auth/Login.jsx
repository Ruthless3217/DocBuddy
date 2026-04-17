import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await authService.login(email, password);
      toast.success('Welcome back to DocBuddy AI!');
      
      const roleDashboard = {
        admin: '/admin/dashboard',
        doctor: '/doctor/dashboard',
        patient: '/dashboard'
      };
      
      navigate(roleDashboard[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient p-6 pt-24 overflow-hidden relative">
      <div className="glow-orb -top-20 -left-20 !bg-primary-500"></div>
      <div className="glow-orb -bottom-20 -right-20 !bg-secondary-500"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 relative z-10 border-white/50"
      >
        <div className="text-center space-y-4 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="text-white fill-white" size={28} />
            </div>
          </Link>
          <h2 className="text-3xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium tracking-tightest leading-tightest">Your health journey continues here</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary-800 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                required
                className="form-input pl-11"
                placeholder="yash@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-secondary-800">Password</label>
              <Link to="/forgot" className="text-xs font-bold text-primary-500 hover:text-primary-600">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                required
                className="form-input pl-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full h-14 group disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : (
              <>
                Sign In
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-primary-500 font-bold hover:underline">Sign Up Now</Link>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest leading-tightest">
          <ShieldCheck size={16} className="text-secondary-400" />
          End-to-End Encrypted Secure Login
        </div>
      </motion.div>
    </div>
  );
}
