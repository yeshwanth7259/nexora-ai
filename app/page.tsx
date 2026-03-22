"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LandingPage from './landing/page'; // Ensure this path is correct
import { 
  Send, Plus, MessageSquare, Cpu, Menu, ShieldCheck, 
  Users, IndianRupee, ArrowUpRight, Calendar, LogOut
} from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ users: 0, chats: 0, revenue: "₹45,200" });
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. SESSION & ROLE CHECK ---
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkAdminRole(session.user.id);
    });

    // Listen for login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) checkAdminRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (profile?.role === 'admin') setIsAdmin(true);
  };

  // --- 2. CHAT ENGINE ---
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat({
    api: '/api/chat',
  });

  // --- 3. DASHBOARD STATS ---
  useEffect(() => {
    if (session) {
      const fetchStats = async () => {
        const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: c } = await supabase.from('chats').select('*', { count: 'exact', head: true });
        setStats(prev => ({ ...prev, users: u || 0, chats: c || 0 }));
      };
      fetchStats();
    }
  }, [session]);

  // --- 4. REDIRECT LOGIC ---
  if (!session) return <LandingPage />;

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
            <button onClick={() => { setMessages([]); setCurrentView('chat'); }} className="w-full bg-[#6C63FF] text-white py-3 rounded-2xl font-bold mb-8 flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/20">
              <Plus size={18} /> New Session
            </button>
            
            <NavBtn active={currentView === 'chat'} onClick={() => setCurrentView('chat')} icon={<MessageSquare size={16}/>} label="Intelligence Chat" />

            {isAdmin && (
              <NavBtn active={currentView === 'admin'} onClick={() => setCurrentView('admin')} icon={<ShieldCheck size={16} className="text-amber-500"/>} label="Admin Console" />
            )}
          </nav>

          <button 
            onClick={() => supabase.auth.signOut()}
            className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative bg-[#030305]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030305]/60 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400"><Menu /></button>
          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">YashNav Node: {session.user.email}</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentView === 'admin' ? (
            <div className="p-8 lg:p-12 animate-in fade-in duration-500">
               <h1 className="text-4xl font-black italic text-white mb-12">PROJECT OVERVIEW</h1>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard icon={<Users />} label="Total Users" value={stats.users} />
                  <StatCard icon={<MessageSquare />} label="Active Chats" value={stats.chats} />
                  <StatCard icon={<IndianRupee />} label="Revenue" value={stats.revenue} color="text-green-500" />
               </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
                      <h2 className="text-sm font-black text-white tracking-[0.6em] uppercase italic">Nexora Intelligence // Active</h2>
                    </div>
                  ) : (
                    messages.map((m: any, i: number) => (
                      <div key={i} className={`flex gap-6 mb-12 animate-in slide-in-from-bottom-2 ${m.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-[10px] ${m.role === 'assistant' ? 'bg-[#6C63FF] text-white' : 'bg-slate-800 text-slate-500'}`}>
                          {m.role === 'assistant' ? 'NX' : 'YO'}
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
              <form onSubmit={handleSubmit} className="p-6 lg:p-12 max-w-4xl mx-auto w-full sticky bottom-0">
                <div className="relative flex items-center bg-[#0D0D14] border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl">
                  <input value={input} onChange={handleInputChange} placeholder="Execute Command..." className="flex-1 bg-transparent border-none outline-none px-6 text-white text-sm" />
                  <button type="submit" className="w-14 h-14 bg-[#6C63FF] rounded-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                    <Send size={24} className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-components
function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${active ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white transition-all'}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ icon, label, value, color = "text-[#6C63FF]" }: any) {
  return (
    <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
      <div className={`p-4 w-fit bg-white/5 rounded-2xl ${color} mb-6`}>{icon}</div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <h2 className="text-3xl font-black italic text-white">{value}</h2>
    </div>
  );
}