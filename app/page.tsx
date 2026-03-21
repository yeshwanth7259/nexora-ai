"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Send, Plus, MessageSquare, Search, Settings, Cpu, Sparkles, Menu, X, Rocket, 
  Binary, Zap, ChevronRight, ShieldCheck, BarChart4, Users, IndianRupee, ArrowUpRight, Calendar
} from "lucide-react";

export default function NexoraApp() {
  // --- UI STATES ---
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ users: 0, chats: 0, revenue: "₹45,200" });
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- CHAT ENGINE ---
  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput, isLoading } = useChat({
    api: '/api/chat',
  });

  // --- DATABASE & AUTH LOGIC ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile to check role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') setIsAdmin(true);
      }
    };
    
    const fetchStats = async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: chatCount } = await supabase.from('chats').select('*', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, users: userCount || 0, chats: chatCount || 0 }));
    };

    checkUser();
    fetchStats();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0F]/90 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-[#6C63FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
              <Cpu className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">NEXORA <span className="text-[#6C63FF]">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-2">
            <button onClick={() => { setMessages([]); setInput(""); setCurrentView('chat'); }} className="w-full bg-[#6C63FF] text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mb-8 shadow-lg active:scale-95">
              <Plus size={18} /> New Session
            </button>

            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Console View</p>
            
            <NavButton 
              active={currentView === 'chat'} 
              onClick={() => setCurrentView('chat')} 
              icon={<MessageSquare size={18}/>} 
              label="Intelligence Chat" 
            />

            {isAdmin && (
              <NavButton 
                active={currentView === 'admin'} 
                onClick={() => setCurrentView('admin')} 
                icon={<ShieldCheck size={18} className="text-amber-500"/>} 
                label="Admin Overview" 
              />
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-[10px] font-bold">Y</div>
              <div className="flex-1 text-[10px] font-bold">Yashu • {isAdmin ? 'Admin' : 'Pro'}</div>
              <Settings size={14} className="text-slate-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#030305]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030305]/50 backdrop-blur-md z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400"><Menu /></button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Node: YashNav-Production-Live</span>
          </div>
        </header>

        {/* --- VIEW CONDITIONAL RENDERING --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {currentView === 'admin' ? (
            <div className="p-8 lg:p-12 animate-in fade-in duration-700">
               <AdminView stats={stats} />
            </div>
          ) : (
            <ChatView messages={messages} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLoading={isLoading} scrollRef={scrollRef} />
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all ${active ? 'bg-white/10 text-white border border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="font-black italic uppercase tracking-tight">{label}</span>
    </button>
  );
}

function AdminView({ stats }: any) {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <p className="text-[#6C63FF] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Nexora Intelligence // Analytics</p>
          <h1 className="text-4xl font-black italic tracking-tighter">PROJECT OVERVIEW</h1>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-400">
          <Calendar size={14} /> MARCH 2026
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<Users />} label="Total Users" value={stats.users} change="+12%" />
        <StatCard icon={<MessageSquare />} label="Active Sessions" value={stats.chats} change="+24%" />
        <StatCard icon={<IndianRupee />} label="Revenue" value={stats.revenue} change="+8%" color="text-green-500" />
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 className="font-black italic text-sm tracking-widest uppercase mb-6 text-slate-500">Live User Registry</h3>
        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-slate-600 text-xs font-bold italic">
          Fetching live node data from YashNav Cloud...
        </div>
      </div>
    </div>
  );
}

function ChatView({ messages, input, handleInputChange, handleSubmit, isLoading, scrollRef }: any) {
  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-base font-black text-white tracking-[0.5em] mb-12 uppercase italic leading-loose">
                Nexora Intelligence // Build the Future.
              </h2>
            </div>
          ) : (
            messages.map((m: any, i: number) => (
              <div key={i} className={`flex gap-6 mb-12 animate-in fade-in ${m.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5' : ''}`}>
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-xs ${m.role === 'assistant' ? 'bg-[#6C63FF]' : 'bg-slate-800'}`}>{m.role === 'assistant' ? 'NX' : 'Y'}</div>
                <div className="flex-1 prose prose-invert max-w-none text-slate-200">
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

      {/* FLOATING INPUT */}
      <div className="p-6 lg:p-12 bg-gradient-to-t from-[#030305] to-transparent sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1.5 bg-[#6C63FF] rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
          <div className="relative flex items-center bg-[#0D0D14] border border-white/10 p-2.5 rounded-[2.2rem] shadow-3xl">
            <input value={input} onChange={handleInputChange} placeholder="Command Nexora..." className="flex-1 bg-transparent border-none outline-none px-6 text-base text-white font-medium" />
            <button type="submit" disabled={isLoading || !input?.trim()} className="w-14 h-14 bg-[#6C63FF] rounded-3xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <Send size={24} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color = "text-[#6C63FF]" }: any) {
  return (
    <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-[#6C63FF]/30 transition-all">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C63FF] blur-[80px] opacity-10 group-hover:opacity-20"></div>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 bg-white/5 rounded-2xl ${color} border border-white/5`}>{icon}</div>
        <div className="flex items-center gap-1 text-green-500 text-xs font-black italic">
          <ArrowUpRight size={14} /> {change}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <h2 className="text-3xl font-black italic tracking-tighter">{value}</h2>
    </div>
  );
}