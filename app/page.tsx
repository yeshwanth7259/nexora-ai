"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Send, Plus, MessageSquare, Cpu, Menu, Rocket, 
  Binary, Zap, ChevronRight, ShieldCheck, Users, IndianRupee, ArrowUpRight, Calendar
} from "lucide-react";

// --- SUB-COMPONENTS ---
const StatCard = ({ icon, label, value, change, color = "text-[#6C63FF]" }: any) => (
  <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-[#6C63FF]/30 transition-all">
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C63FF] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 bg-white/5 rounded-2xl ${color} border border-white/5`}>{icon}</div>
      <div className="flex items-center gap-1 text-green-500 text-xs font-black italic">
        <ArrowUpRight size={14} /> {change}
      </div>
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">{value}</h2>
  </div>
);

export default function NexoraApp() {
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ users: 0, chats: 0, revenue: "₹45,200" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput, isLoading } = useChat({
    api: '/api/chat',
  });

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
      }
    };
    const fetchStats = async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: chatCount } = await supabase.from('chats').select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, users: userCount || 0, chats: chatCount || 0 }));
    };
    checkRole();
    fetchStats();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0F] border-r border-white/5 transform transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <Cpu className="text-[#6C63FF]" size={24} />
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">NEXORA AI</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <button onClick={() => { setMessages([]); setCurrentView('chat'); }} className="w-full bg-[#6C63FF] text-white py-3 rounded-2xl font-bold mb-8 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[#6C63FF]/20">
              <Plus size={18} /> New Session
            </button>
            
            <button onClick={() => setCurrentView('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${currentView === 'chat' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
              <MessageSquare size={16}/> Intelligence Chat
            </button>

            {isAdmin && (
              <button onClick={() => setCurrentView('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${currentView === 'admin' ? 'bg-[#6C63FF] text-white' : 'text-slate-500 hover:text-white'}`}>
                <ShieldCheck size={16} className={currentView === 'admin' ? 'text-white' : 'text-amber-500'}/> Admin Console
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative bg-[#030305]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030305]/60 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400"><Menu /></button>
          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">YashNav Production Node Live</span>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {currentView === 'admin' ? (
            <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <header className="flex justify-between items-end mb-12 px-4">
                <div>
                  <p className="text-[#6C63FF] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Nexora Intelligence // Analytics</p>
                  <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-white uppercase">Project Overview</h1>
                </div>
                <div className="hidden lg:flex bg-white/5 border border-white/10 px-4 py-2 rounded-xl items-center gap-2 text-[10px] font-black text-slate-400">
                   <Calendar size={14} /> MARCH 2026
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <StatCard icon={<Users />} label="Total Users" value={stats.users} change="+12%" />
                <StatCard icon={<MessageSquare />} label="Active Sessions" value={stats.chats} change="+24%" />
                <StatCard icon={<IndianRupee />} label="Revenue" value={stats.revenue} change="+8%" color="text-green-500" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                      <h2 className="text-sm lg:text-base font-black text-white tracking-[0.6em] mt-20 uppercase italic opacity-50">
                        Nexora Intelligence // Build the Future.
                      </h2>
                    </div>
                  ) : (
                    messages.map((m: any, i: number) => (
                      <div key={i} className={`flex gap-6 mb-12 text-left animate-in slide-in-from-bottom-4 ${m.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5' : 'px-4'}`}>
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-[10px] ${m.role === 'assistant' ? 'bg-[#6C63FF] text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
                          {m.role === 'assistant' ? 'NX' : 'Y'}
                        </div>
                        <div className="prose prose-invert max-w-none text-slate-200 flex-1">
                          <ReactMarkdown components={{
                            code({inline, className, children}: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{borderRadius: '1rem', background: '#0D0D12'}}>{String(children)}</SyntaxHighlighter>
                              ) : <code className="bg-slate-800 px-1 rounded text-[#6C63FF]">{children}</code>
                            }
                          }}>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 lg:p-12 max-w-4xl mx-auto w-full sticky bottom-0 bg-gradient-to-t from-[#030305] via-[#030305] to-transparent">
                <div className="relative flex items-center bg-[#0D0D14] border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl group focus-within:border-[#6C63FF]/50 transition-all">
                  <input 
                    value={input} 
                    onChange={handleInputChange} 
                    placeholder="Brief your business requirements..." 
                    className="flex-1 bg-transparent border-none outline-none px-6 text-white text-sm font-medium" 
                  />
                  <button type="submit" disabled={isLoading || !input?.trim()} className="w-14 h-14 bg-[#6C63FF] rounded-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50">
                    <Send size={24} className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6C63FF; }
      `}</style>
    </div>
  );
}