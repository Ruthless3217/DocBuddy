import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Shared/Navbar';

// Lazy load pages for performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const AIChat = lazy(() => import('./pages/AIChatInterface'));
const DoctorDiscovery = lazy(() => import('./pages/DoctorList'));
const Queries = lazy(() => import('./pages/QueryList'));

// Loading component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    <p className="text-secondary-900 font-medium font-display tracking-tightest leading-tightest animate-pulse">
      DocBuddy AI Loading...
    </p>
  </div>
);

// Protected Route Shield
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  
  return children;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '16px', background: '#333', color: '#fff' },
        success: { theme: { primary: '#F97316' } }
      }} />
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorDiscovery />} />
            <Route path="/queries" element={<Queries />} />

            {/* Protected Patient Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/ai-chat" element={
              <ProtectedRoute role="patient">
                <AIChat />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Global Footer simplified for development */}
      <footer className="py-12 bg-secondary-900 text-white mt-auto overflow-hidden relative">
        <div className="glow-orb -bottom-20 -left-20 !bg-primary-500"></div>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold mb-6">DocBuddy<span className="text-primary-500">AI</span></h3>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              Empowering healthcare accessibility with ethical AI guidance and verified medical discovery.
            </p>
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-500 transition-all cursor-pointer">In</span>
              <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-500 transition-all cursor-pointer">X</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary-400">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Find a Doctor</li>
              <li className="hover:text-white cursor-pointer transition-colors">Ask AI Assistant</li>
              <li className="hover:text-white cursor-pointer transition-colors">Medical Queries</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-primary-400">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors text-xs opacity-50">Disclaimer: AI is not a substitute for diagnosis.</li>
            </ul>
          </div>
        </div>
      </footer>
    </Router>
  );
}
