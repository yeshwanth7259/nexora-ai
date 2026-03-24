"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import LandingPage from './landing/page'; 
import { Send, Cpu, MessageSquare, LogOut, Loader2 } from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/chat' 
  });

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  if (!mounted) return <div className="min-h-screen bg-[#030305]" />;
  if (!session) return <LandingPage />;

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 font-sans overflow-hidden">
      <aside className="w-64 bg-[#0A0A0F] border-r border-white/5 p-6 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-[#6C63FF]/10 rounded-lg border border-[#6C63FF]/20">
            <Cpu className="text-[#6C63FF]" size={20} />
          </div>
          <h1 className="text-sm font-black italic uppercase tracking-tighter text-white">Nexora AI</h1>
        </div>
        <nav className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-white border border-white/5 italic">
             <MessageSquare size={14} className="text-[#6C63FF]"/> Intelligence Node
           </div>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase text-slate-600 hover:text-red-400 flex items-center gap-3 transition-all">
          <LogOut size={14}/> Deactivate Session
        </button>
      </aside>

      <main className="flex-1 flex flex-col relative bg-[#030305]">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-[#030305]/50 backdrop-blur-xl z-10">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
             Authenticated // {session.user.email}
           </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Cpu size={64} className="mb-4 text-[#6C63FF]" />
              <h2 className="text-[10px] font-black uppercase tracking-[1.5em] text-center ml-[1.5em]">Engine Ready</h2>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-3xl mx-auto p-8 rounded-[2.5rem] ${m.role === 'assistant' ? 'bg-white/[0.02] border border-white/5 shadow-2xl' : ''}`}> 
              <div className="text-[9px] font-black uppercase mb-4 opacity-30 tracking-[0.3em] italic">{m.role === 'assistant' ? 'Nexora' : 'User'}</div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="max-w-3xl mx-auto px-8 py-2 flex items-center gap-3">
              <Loader2 className="w-3 h-3 text-[#6C63FF] animate-spin" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#6C63FF]/50 italic">Processing...</span>
            </div>
          )}
        </div>

        <div className="p-8 max-w-3xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="bg-[#0D0D14] border border-white/10 rounded-[2rem] p-2 flex items-center shadow-2xl focus-within:border-[#6C63FF]/50 transition-all">
            <input value={input} onChange={handleInputChange} placeholder="Execute command..." className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-white" />
            <button type="submit" disabled={isLoading || !input.trim()} className="w-12 h-12 bg-[#6C63FF] rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={18} className="text-white"/>
            </button>
          </form>
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a24; border-radius: 10px; }
      `}</style>
    </div>
  );
}