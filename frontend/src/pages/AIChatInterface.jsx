import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, ShieldAlert, Sparkles, MessageSquare, Info, History } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Message = ({ message, isLast }) => {
  const isAI = message.role === 'assistant';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200">
          <Bot size={22} />
        </div>
      )}
      
      <div className={`max-w-[80%] space-y-2 ${isAI ? 'text-left' : 'text-right'}`}>
        <div className={`p-5 rounded-[24px] shadow-sm transform-gpu ${
          isAI 
            ? 'bg-white border border-slate-100 rounded-tl-none text-slate-800' 
            : 'bg-primary-500 text-white rounded-tr-none shadow-primary-200'
        }`}>
          <p className="font-medium text-sm leading-relaxed tracking-tightest whitespace-pre-wrap">
            {message.content}
          </p>
          
          {isAI && message.disclaimer && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
              <ShieldAlert size={14} className="text-secondary-500 shrink-0" />
              <span>{message.disclaimer}</span>
            </div>
          )}

          {isAI && message.suggestions && message.suggestions.length > 0 && (
             <div className="mt-4 flex flex-wrap gap-2">
                {message.suggestions.map((s, i) => (
                  <button key={i} className="text-[10px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full border border-slate-100 hover:border-primary-300 hover:text-primary-500 transition-colors uppercase tracking-widest font-bold">
                    {s}
                  </button>
                ))}
             </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 leading-tightest">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isAI && (
        <div className="w-10 h-10 rounded-2xl bg-secondary-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-secondary-200">
          <User size={22} />
        </div>
      )}
    </motion.div>
  );
};

export default function AIChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am DocBuddy AI, your intelligent health assistant. How can I help you today?',
      timestamp: new Date(),
      disclaimer: 'DISCLAIMER: For information only. Consult a real doctor for diagnosis.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/ai/chat', { 
        message: input 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const aiMsg = {
        role: 'assistant',
        content: response.data.content,
        disclaimer: response.data.disclaimer,
        suggestions: response.data.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      toast.error('AI is taking a nap. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-mesh-gradient overflow-hidden">
      {/* Sidebar Histoy (Mock) */}
      <div className="hidden lg:flex w-80 bg-white/40 backdrop-blur-3xl border-r border-white/50 flex-col">
        <div className="p-8 pb-4">
          <h2 className="text-xl font-display font-extrabold text-secondary-900 tracking-tightest leading-tight flex items-center gap-3">
             <History size={20} className="text-primary-500" />
             Chat History
          </h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1 leading-tightest">Secure & Private</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-4 bg-white/80 rounded-[20px] border border-primary-100 shadow-sm shadow-primary-50/50 cursor-pointer hover:scale-[1.02] transition-transform">
            <h4 className="text-sm font-extrabold text-secondary-900 tracking-tightest leading-tightest">Chest Pain Symptoms</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tightest">2 hours ago</p>
          </div>
          <div className="p-4 bg-white/40 rounded-[20px] border border-slate-100 cursor-pointer hover:bg-white/60 transition-colors">
            <h4 className="text-sm font-bold text-secondary-600 tracking-tightest leading-tightest">COVID-19 Booster Doubt</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tightest">Yesterday</p>
          </div>
        </div>
        <div className="p-6 border-t border-white/50">
          <button className="flex items-center justify-center gap-2 w-full p-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 transition-transform">
             <MessageSquare size={16} />
             New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-6 bg-white/40 backdrop-blur-xl border-b border-white/50 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 overflow-hidden relative group">
              <Bot size={28} />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
            <div>
              <h1 className="text-lg font-display font-extrabold text-secondary-900 tracking-tightest leading-tight">DocBuddy AI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-plus-glow shadow-emerald-500/50"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-tightest">Online & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="p-3 text-slate-400 hover:text-secondary-500 transition-colors"><Info size={20} /></button>
             <button className="p-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg mb-4">
                 <Sparkles size={14} className="text-primary-400" />
                 Secured by Advanced Medical Intelligence
               </div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[2px] leading-tightest max-w-xs mx-auto">All conversations are encrypted and private between you and the AI.</p>
             </div>
             
             {messages.map((msg, i) => (
                <Message key={i} message={msg} isLast={i === messages.length - 1} />
             ))}

             {isLoading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex gap-4 mb-6"
               >
                 <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200">
                   <Bot size={22} className="animate-bounce" />
                 </div>
                 <div className="p-5 rounded-[24px] bg-white border border-slate-100 rounded-tl-none shadow-sm flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-150"></div>
                 </div>
               </motion.div>
             )}
          </div>
        </div>

        <div className="p-6 md:p-10 bg-gradient-to-t from-white/80 via-white/40 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <form onSubmit={handleSend}>
              <div className="glass-card !rounded-[32px] p-2 flex items-center gap-2 border-white/80 shadow-2xl shadow-primary-100/20 group-focus-within:border-primary-400/50 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms or ask a health question..."
                  className="flex-1 bg-transparent border-none focus:ring-0 px-6 font-bold text-secondary-900 placeholder:text-slate-400 tracking-tightest leading-tightest"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-14 h-14 bg-primary-500 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-primary-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all group/btn"
                >
                  <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-6">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[2px] leading-tightest">
                 <ShieldAlert size={14} className="text-secondary-400" />
                 Always consult a medical professional for critical conditions
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
