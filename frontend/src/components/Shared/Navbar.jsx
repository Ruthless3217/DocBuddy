import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, Search, MessageCircle, Calendar, User, LogOut, 
  Menu, X, Bell, Stethoscope, ShieldAlert, LayoutDashboard,
  Users, UserCheck, Activity, Bot, FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─── Role-specific nav config ─────────────────────────────────────────────────
const NAV_CONFIG = {
  patient: [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/doctors', icon: Search },
    { name: 'AI Assistant', path: '/ai-chat', icon: Bot },
    { name: 'Queries', path: '/queries', icon: MessageCircle },
  ],
  doctor: [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/dashboard', icon: Calendar },
    { name: 'My Patients', path: '/doctor/dashboard', icon: Users },
    { name: 'Queries', path: '/queries', icon: MessageCircle },
  ],
  admin: [
    { name: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/dashboard', icon: Users },
    { name: 'Doctor Verify', path: '/admin/dashboard', icon: UserCheck },
    { name: 'Activity', path: '/admin/dashboard', icon: Activity },
  ],
  guest: [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Doctors', path: '/doctors', icon: Search },
    { name: 'Queries', path: '/queries', icon: Stethoscope },
  ],
};

// ─── Role badge styles ────────────────────────────────────────────────────────
const ROLE_STYLES = {
  patient: { badge: 'bg-primary-50 text-primary-600', dot: 'bg-primary-500', label: 'Patient' },
  doctor: { badge: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', label: 'Doctor' },
  admin: { badge: 'bg-red-50 text-red-500', dot: 'bg-red-500', label: 'Admin' },
};

// ─── Dashboard path per role ──────────────────────────────────────────────────
const DASHBOARD_PATH = {
  patient: '/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'guest';

  const navLinks = NAV_CONFIG[role] || NAV_CONFIG.guest;
  const roleStyle = ROLE_STYLES[role] || null;
  const dashboardPath = DASHBOARD_PATH[role] || '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#user-menu-anchor')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-5'
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Heart className="text-white fill-white" size={22} />
          </div>
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-secondary-700">
            DocBuddy<span className="text-primary-500">AI</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2',
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-secondary-900 hover:bg-slate-50'
                )}
              >
                <link.icon size={16} className={isActive ? 'text-primary-500' : ''} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* ── Auth Actions ── */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-all">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border border-white" />
              </button>

              {/* User Avatar + Dropdown */}
              <div className="relative" id="user-menu-anchor">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600 overflow-hidden ring-2 ring-transparent hover:ring-primary-400 transition-all shrink-0">
                    {user.avatar
                      ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <User size={18} />
                    }
                    {/* Online dot */}
                    <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white', roleStyle?.dot || 'bg-slate-400')} />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-bold text-secondary-900">{user.firstName || 'User'}</span>
                    <span className={cn('text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full mt-0.5', roleStyle?.badge || 'bg-slate-50 text-slate-400')}>
                      {roleStyle?.label || role}
                    </span>
                  </div>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-50">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-secondary-900 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to={dashboardPath}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                      >
                        <LayoutDashboard size={16} /> My Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                      >
                        <User size={16} /> Profile Settings
                      </Link>
                      {role === 'doctor' && (
                        <Link
                          to="/doctor/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-all"
                        >
                          <FileText size={16} /> Prescriptions
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                        >
                          <ShieldAlert size={16} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-secondary-900 hover:text-primary-500 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !rounded-xl !py-2.5 !text-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="lg:hidden p-2 text-secondary-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={cn(
        'lg:hidden fixed inset-0 top-[68px] bg-white/98 backdrop-blur-xl z-40 transition-all duration-300',
        isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      )}>
        <div className="p-6 flex flex-col gap-4 h-full overflow-y-auto">

          {/* Role badge in mobile */}
          {isLoggedIn && roleStyle && (
            <div className={cn('flex items-center gap-3 p-4 rounded-2xl border mb-2', roleStyle.badge, 'border-current/20')}>
              <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-70">{roleStyle.label} Account</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'text-base font-semibold flex items-center gap-4 p-4 rounded-2xl transition-all',
                location.pathname === link.path
                  ? 'bg-primary-50 text-primary-600 border border-primary-100'
                  : 'text-secondary-900 hover:bg-slate-50'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <link.icon size={20} />
              </div>
              {link.name}
            </Link>
          ))}

          <hr className="border-slate-100 my-2" />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-2xl text-base font-semibold text-red-400 hover:bg-red-50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut size={20} className="text-red-400" />
              </div>
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-outline text-center rounded-xl">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center rounded-xl">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
