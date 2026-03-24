"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import LandingPage from './landing/page'; 
import { Send, Cpu, MessageSquare, LogOut } from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  
  // FIXED: Updated destructured properties to match latest AI SDK types
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/chat' 
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Auto-scroll to latest intelligence output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!session) return <LandingPage />;

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 font-sans overflow-hidden">
      {/* Side Console */}
      <aside className="w-64 bg-[#0A0A0F] border-r border-white/5 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Cpu className="text-[#6C63FF]" />
          <h1 className="text-sm font-black italic uppercase tracking-tighter text-white">Nexora AI</h1>
        </div>
        <nav className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-white border border-white/5 italic">
             <MessageSquare size={14}/> Intelligence Node
           </div>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-bold uppercase text-slate-600 hover:text-red-400 flex items-center gap-3 transition-colors">
          <LogOut size={14}/> Deactivate Session
        </button>
      </aside>

      {/* Main Execution Workspace */}
      <main className="flex-1 flex flex-col relative bg-[#030305]">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-[#030305]/50 backdrop-blur-xl z-10">
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
             Authenticated: {session.user.email}
           </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Cpu size={48} className="mb-4" />
              <h2 className="text-xs font-black uppercase tracking-[1em]">Execution Engine Ready</h2>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`max-w-3xl mx-auto p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-2 duration-500 ${m.role === 'assistant' ? 'bg-white/[0.02] border border-white/5 shadow-2xl' : ''}`}>
              <div className="text-[9px] font-black uppercase mb-4 opacity-30 tracking-widest italic">{m.role === 'assistant' ? 'Nexora Intelligence' : 'User Query'}</div>
              <div className="prose prose-invert text-sm leading-relaxed text-slate-300">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="max-w-3xl mx-auto p-6 text-[10px] italic text-[#6C63FF] animate-pulse">
              Nexora is processing...
            </div>
          )}
        </div>

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="p-8 max-w-3xl mx-auto w-full">
          <div className="bg-[#0D0D14] border border-white/10 rounded-3xl p-2 flex items-center shadow-2xl focus-within:border-[#6C63FF]/50 transition-all group">
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Enter instruction for Nexora..." 
              className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-white placeholder:text-slate-700" 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="w-12 h-12 bg-[#6C63FF] rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#6C63FF]/20 disabled:opacity-30"
            >
              <Send size={18} className="text-white"/>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}