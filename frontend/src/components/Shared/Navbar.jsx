import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  MessageCircle, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle mock auth state
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Doctors', path: '/doctors', icon: Search },
    { name: 'AI Assistant', path: '/ai-chat', icon: MessageCircle },
    { name: 'Queries', path: '/queries', icon: Stethoscope },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Heart className="text-white fill-white" size={24} />
          </div>
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-secondary-700">
            DocBuddy<span className="text-primary-500">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "font-medium transition-colors duration-200 hover:text-primary-500 flex items-center gap-2",
                location.pathname === link.path ? "text-primary-500" : "text-secondary-900"
              )}
            >
              <link.icon size={18} className={location.pathname === link.path ? "animate-pulse" : ""} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              <button className="text-secondary-900 hover:text-primary-500 transition-colors relative">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 border-2 border-white rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 pr-4 border-r border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 overflow-hidden ring-2 ring-transparent hover:ring-primary-400 transition-all">
                    {user.avatar ? <img src={user.avatar} alt="User" /> : <User size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-secondary-900">{user.firstName}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-secondary-900 font-bold hover:text-primary-500">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-secondary-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[72px] bg-white z-40 transition-transform duration-300 transform",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display font-medium text-secondary-900 flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600">
                <link.icon size={22} />
              </div>
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-100 my-4" />
          {!isLoggedIn && (
            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" className="btn-outline text-center" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
