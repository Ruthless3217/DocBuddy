import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Plus, Search, Filter, Bot, User, 
  ChevronRight, Heart, Share2, MoreHorizontal, 
  ShieldCheck, Clock, Sparkles, Send
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const QueryCard = ({ query }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-10 relative overflow-hidden border-white/50 group hover:shadow-2xl hover:shadow-primary-100/20 transition-all duration-500 mb-8"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden ring-4 ring-white shadow-lg">
           <User size={24} />
        </div>
        <div>
          <h4 className="text-lg font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Anonymous Patient</h4>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
             <Clock size={12} />
             {query.createdAt || '2 hours ago'} • {query.category || 'General'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
         <button className="p-3 text-slate-400 hover:text-primary-500 transition-colors"><Heart size={20} /></button>
         <button className="p-3 text-slate-400 hover:text-secondary-500 transition-colors"><Share2 size={20} /></button>
      </div>
    </div>

    <div className="space-y-6">
       <h3 className="text-2xl font-display font-extrabold text-secondary-900 leading-tight tracking-tightest group-hover:text-primary-600 transition-colors">
         {query.title}
       </h3>
       <p className="text-slate-600 text-base font-medium leading-relaxed tracking-tightest">
         {query.description}
       </p>
    </div>

    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col gap-6">
       {/* AI Response Preview */}
       <div className="p-6 bg-primary-50/50 rounded-[28px] border border-primary-100/50 relative group/ai overflow-hidden shadow-inner flex flex-col sm:flex-row gap-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 -mr-12 -mt-12 rounded-full group-hover/ai:scale-150 transition-transform duration-700"></div>
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200">
            <Bot size={24} />
          </div>
          <div className="flex-1 space-y-2">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest">AI Health Assistant Intelligence</span>
                <Sparkles size={14} className="text-primary-400 animate-pulse" />
             </div>
             <p className="text-sm font-bold text-secondary-800 leading-relaxed tracking-tightest italic">
               "Based on your symptoms, it could be common acidity. However, a constant pain in the chest area should never be ignored..."
             </p>
             <button className="text-[10px] text-primary-500 font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
               Read Full AI Analysis <ChevronRight size={14} />
             </button>
          </div>
       </div>

       {/* Doctors Response Count */}
       <div className="flex items-center justify-between">
          <div className="flex -space-x-3 overflow-hidden">
             {[1,2,3].map(i => (
               <div key={i} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-slate-200">
                  <img className="h-full w-full object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
               </div>
             ))}
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 ring-4 ring-white text-[10px] font-bold text-white uppercase tracking-widest leading-none">
                +4
             </div>
          </div>
          <button className="btn-primary !h-12 !px-6 !rounded-2xl group shadow-lg shadow-primary-100 text-xs">
            Join Discussion
            <MessageCircle size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
       </div>
    </div>
  </motion.div>
);

const AddQueryModal = ({ isOpen, onClose, onAdd }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary-900/40 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-2xl p-10 relative z-10 border-white/80 shadow-2xl"
        >
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 bg-primary-500 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-200">
              <Plus size={32} />
            </div>
            <h2 className="text-3xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">Post Medical Query</h2>
            <p className="text-slate-500 font-medium tracking-tightest leading-tightest">Get answers from AI and certified doctors anonymously.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onAdd(); }} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">Title of Query</label>
              <input required className="form-input" placeholder="e.g. Constant mild fever for 3 days" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-800 ml-1">Detailed Description Symptoms</label>
              <textarea required className="form-input min-h-[150px] py-4" placeholder="Describe your symptoms, medicine history, and concerns in detail..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-secondary-800 ml-1">Category</label>
                 <select className="form-input">
                    <option>General Health</option>
                    <option>Symptoms Doubt</option>
                    <option>Medicine Inquiry</option>
                    <option>Test Reports</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-secondary-800 ml-1">Urgency</label>
                 <select className="form-input">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                 </select>
               </div>
            </div>
            <button type="submit" className="btn-primary w-full h-16 group shadow-xl shadow-primary-200">
               Post Anonymously
               <Send size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function QueryList() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setQueries([
        { 
          id: 1, 
          title: "Chest tightness after workout", 
          description: "I've been experiencing a strange tightness in my chest for about 30 minutes after completing my high-intensity cardio sessions. No history of asthma.",
          category: "Symptoms Doubt",
          createdAt: "1 hour ago"
        },
        { 
          id: 2, 
          title: "Alternative for Aspirin", 
          description: "I have stomach sensitivity issues and was prescribed Aspirin for mild muscle pain. Are there any gentler alternatives you would recommend?",
          category: "Medicine Inquiry",
          createdAt: "Yesterday"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 overflow-hidden relative">
      <div className="glow-orb -top-20 -right-20 !bg-primary-500/20 w-[600px] h-[600px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-in slide-in-from-top duration-700">
             <div className="space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl">
                  <ShieldCheck size={14} className="text-primary-400" />
                  HIPAA Compliant Queries
                </div>
                <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-secondary-900 tracking-tightest leading-[1.1]">Health Community <br/><span className="text-primary-500">& Insights.</span></h1>
                <p className="text-slate-500 font-medium text-lg tracking-tightest leading-relaxed">Join a community of patients and medical experts. Get dual insights from our DocBuddy AI and verified Doctors.</p>
             </div>
             
             <button 
               onClick={() => setIsModalOpen(true)}
               className="btn-primary !h-20 !px-10 !rounded-[32px] group shadow-2xl shadow-primary-200 shrink-0"
             >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                New Medical Query
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
               <div className="relative group mb-12">
                  <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <Search size={22} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search queries by symptom or medicine name..."
                    className="form-input !h-20 pl-16 pr-8 !rounded-[32px] !border-white bg-white shadow-2xl shadow-slate-200/50 !text-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>

               <div className="space-y-4">
                 {queries.map(q => <QueryCard key={q.id} query={q} />)}
               </div>
            </div>

            <aside className="space-y-12">
               <div className="glass-card p-10 bg-white/40 border-white/50">
                  <div className="flex items-center gap-3 mb-8">
                     <Filter size={20} className="text-primary-500" />
                     <h3 className="text-sm font-extrabold text-secondary-900 tracking-[2px] uppercase">Browse Categories</h3>
                  </div>
                  <div className="space-y-2">
                     {['All Queries', 'General Health', 'Symptoms Doubt', 'Medicine Doubt', 'Chronic Disease', 'Lifestyle Care'].map(cat => (
                        <button key={cat} className="w-full text-left p-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-primary-500 transition-all flex items-center justify-between group">
                          {cat}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="glass-card p-10 border-white/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="text-primary-200" size={32} />
                  </div>
                  <h4 className="text-lg font-display font-extrabold text-secondary-900 leading-tight mb-4 tracking-tightest">Expert Responses</h4>
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-plus-glow shadow-emerald-500/20"></div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest leading-none">12 Doctors Online</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium tracking-tightest mb-8 leading-relaxed">Our verified medical panel reviewed over 450 queries in the last 24 hours.</p>
                  <button className="w-full h-14 bg-secondary-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-colors">
                    Join Expert Panel
                  </button>
               </div>
            </aside>
          </div>

        </div>
      </div>

      <AddQueryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={() => {
          setIsModalOpen(false);
          toast.success('Your query has been posted anonymously');
        }} 
      />
    </div>
  );
}
