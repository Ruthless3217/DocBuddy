import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, MessageSquare, Shield, Activity, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "AI Health Assistant",
    description: "Get instant, medical-grade guidance from our fine-tuned medical LLM with context-aware responses.",
    icon: MessageSquare,
    color: "bg-primary-50 text-primary-600",
    link: "/ai-chat"
  },
  {
    title: "Doctor Discovery",
    description: "Find verified specialists by location, reviews, and experience with direct appointment booking.",
    icon: Search,
    color: "bg-secondary-50 text-secondary-600",
    link: "/doctors"
  },
  {
    title: "Medical Queries",
    description: "Post medical concerns and get answers from verified doctors and community specialists.",
    icon: Activity,
    color: "bg-primary-100 text-primary-700",
    link: "/queries"
  }
];

export default function LandingPage() {
  return (
    <div className="pt-24 bg-mesh-gradient overflow-hidden">
      {/* Decorative Orbs */}
      <div className="glow-orb top-20 -right-20 bg-primary-400"></div>
      <div className="glow-orb top-[400px] -left-20 bg-secondary-400"></div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-full shadow-premium text-secondary-900 font-bold text-sm">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></span>
            Your Intelligent Healthcare Companion
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-secondary-900 leading-tight">
            Next-Gen Care <br/>
            With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 underline-offset-8 underline decoration-secondary-200">Ethical AI</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 max-w-lg leading-relaxed">
            Empower your health journey with direct doctor discovery and real-time AI guidance. Reliable, secure, and always by your side.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:pt-4">
            <Link to="/register" className="btn-primary w-full sm:w-auto h-14 group">
              Start Free Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/doctors" className="btn-outline w-full sm:w-auto h-14 bg-white/50">
              Browse Doctors
            </Link>
          </div>
          
          {/* Trust Metrics */}
          <div className="flex flex-wrap items-center gap-8 pt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-4 ring-primary-50 ring-opacity-20 shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-secondary-900 flex items-center gap-1">
                4.9/5 <Star size={16} className="fill-primary-500 text-primary-500" />
              </span>
              <span className="text-sm text-slate-500 font-medium">From 1k+ patients</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:block"
        >
          <div className="relative glass-card border border-white/50 w-full aspect-square max-w-[500px] mx-auto p-4 flex items-center justify-center animate-float">
             {/* Mock AI Avatar Visual */}
             <div className="absolute inset-0 bg-gradient-to-tr from-secondary-50 to-primary-50 rounded-2xl -z-10 blur-2xl opacity-60"></div>
             <div className="text-center space-y-4">
               <div className="w-32 h-32 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-primary-200 ring-8 ring-white/50">
                 <Heart size={64} fill="white" />
               </div>
               <h3 className="text-xl font-bold font-display text-secondary-900">DocBuddy Virtual assistant</h3>
               <div className="flex flex-col gap-2 max-w-[280px] mx-auto">
                 <div className="h-2 w-32 bg-slate-100 rounded-full animate-pulse mx-auto opacity-50"></div>
                 <div className="h-2 w-24 bg-slate-100 rounded-full animate-pulse mx-auto opacity-40"></div>
               </div>
             </div>
             
             {/* Floating UI Elements */}
             <div className="absolute -top-4 -right-4 glass-card p-4 shadow-2xl scale-75 lg:scale-100 whitespace-nowrap flex items-center gap-3">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-600"><Activity size={24} /></div>
               <div>
                  <div className="text-xs font-bold text-secondary-900 tracking-tightest leading-tightest">98% Accuracy</div>
                  <p className="text-[10px] text-slate-500 leading-tightest">On Medical Diagnosis</p>
               </div>
             </div>

             <div className="absolute -bottom-8 -left-8 glass-card p-6 shadow-2xl scale-75 lg:scale-100 flex items-center gap-4">
               <div className="flex -space-x-2">
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-500 flex items-center justify-center text-white text-xs font-bold">1k+</div>
               </div>
               <div className="text-sm font-bold text-secondary-900 whitespace-nowrap">Verified Doctors Joined</div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-24 lg:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-20">
            <h4 className="text-primary-500 font-bold uppercase tracking-widest text-sm">Advanced Solutions</h4>
            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">
              One Platform <br/><span className="text-slate-400">Complete Healthcare Ecosystem</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group glass-card p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 relative border-slate-100/50"
              >
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4 font-display tracking-tightest leading-tightest">{f.title}</h3>
                <p className="text-slate-500 mb-10 leading-relaxed leading-tightest">
                  {f.description}
                </p>
                <Link to={f.link} className="flex items-center gap-2 text-primary-500 font-bold group-hover:gap-4 transition-all">
                  Explore Now <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-24 bg-secondary-900 text-white relative overflow-hidden">
        <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !bg-primary-500/10"></div>
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center items-center">
           {[
             { label: "Active Patients", val: "50k+" },
             { label: "Expert Doctors", val: "1.2k+" },
             { label: "AI Conversations", val: "200k+" },
             { label: "Patient Satisfaction", val: "99.2%" }
           ].map((stat, i) => (
             <div key={i} className="space-y-3 p-6 glass-card border-white/5">
                <div className="text-4xl lg:text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 tracking-tightest leading-tightest">
                  {stat.val}
                </div>
                <p className="text-slate-400 font-medium font-display tracking-tightest leading-tightest">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-32">
        <div className="bg-primary-500 rounded-[40px] p-8 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary-200">
           <div className="glow-orb -top-20 -right-20 !bg-white/20"></div>
           <div className="glow-orb -bottom-20 -left-20 !bg-secondary-900/10"></div>
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="text-center lg:text-left space-y-6 max-w-xl">
                 <h2 className="text-4xl lg:text-6xl font-display font-extrabold text-white tracking-tightest leading-tight">
                   Ready to Join The Health Digital Revolution?
                 </h2>
                 <p className="text-white/80 text-lg lg:text-xl font-medium tracking-tightest leading-relaxed">
                   Join DocBuddy AI today and experience healthcare like never before with experts by your side.
                 </p>
              </div>
              <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                 <Link to="/register" className="h-16 px-10 bg-secondary-900 hover:bg-secondary-800 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl hover:-translate-y-1 transition-all">
                    Register as Patient
                 </Link>
                 <Link to="/register?role=doctor" className="h-16 px-10 bg-white hover:bg-slate-50 text-secondary-900 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl hover:-translate-y-1 transition-all">
                    Join as Doctor
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
