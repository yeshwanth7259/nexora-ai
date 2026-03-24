"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Path logic: points to the landing folder inside app
import LandingPage from './landing/page'; 
import { 
  Send, Plus, MessageSquare, Cpu, Menu, ShieldCheck, 
  Users, IndianRupee, ArrowUpRight, LogOut
} from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserRole(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserRole(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', uid).single();
    if (data?.role === 'admin') setIsAdmin(true);
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  // PROTECT: Show landing if no session
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
            <button onClick={() => setCurrentView('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${currentView === 'chat' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
              <MessageSquare size={16}/> Intelligence Chat
            </button>
            {isAdmin && (
              <button onClick={() => setCurrentView('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${currentView === 'admin' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                <ShieldCheck size={16} className="text-amber-500"/> Admin Console
              </button>
            )}
          </nav>
          <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
            <LogOut size={16} /> Sign Out Node
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-[#030305] relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030305]/80 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400"><Menu /></button>
          <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase italic">System Active: {session.user.email}</span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentView === 'admin' ? (
             <div className="p-8 lg:p-12 animate-in fade-in duration-500">
                <h1 className="text-4xl font-black italic text-white mb-12 uppercase tracking-tighter">YashNav Overview</h1>
                <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] w-fit min-w-[300px] shadow-2xl">
                   <Users className="text-[#6C63FF] mb-4" />
                   <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">User Status</p>
                   <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Authorized Admin</h2>
                </div>
             </div>
          ) : (
            <div className="flex flex-col h-full">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {messages.map((m: any, i: number) => (
                    <div key={i} className={`flex gap-6 mb-12 animate-in slide-in-from-bottom-2 ${m.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 shadow-xl' : 'px-4'}`}>
                      <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-[10px] ${m.role === 'assistant' ? 'bg-[#6C63FF] text-white' : 'bg-slate-800 text-slate-500'}`}>
                        {m.role === 'assistant' ? 'NX' : 'YO'}
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-300 flex-1 text-sm leading-relaxed">
                        <ReactMarkdown components={{
                          code({inline, className, children}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{borderRadius: '1rem', background: '#0D0D12'}}>{String(children)}</SyntaxHighlighter>
                            ) : <code className="bg-slate-800 px-1 rounded text-[#6C63FF] font-bold">{children}</code>
                          }
                        }}>{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 lg:p-12 max-w-4xl mx-auto w-full sticky bottom-0 bg-gradient-to-t from-[#030305] via-[#030305] to-transparent">
                <div className="relative flex items-center bg-[#0D0D14] border border-white/10 p-2.5 rounded-[2.5rem] shadow-2xl">
                  <input value={input} onChange={handleInputChange} placeholder="Command Nexora Intelligence..." className="flex-1 bg-transparent border-none outline-none px-6 text-white text-sm" />
                  <button type="submit" disabled={isLoading || !input?.trim()} className="w-14 h-14 bg-[#6C63FF] rounded-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
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