"use client";
import React, { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import LandingPage from './landing/page'; 
import { Send, Cpu, MessageSquare, LogOut, Menu } from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <LandingPage />;

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 font-sans">
      <aside className="w-64 bg-[#0A0A0F] border-r border-white/5 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10"><Cpu className="text-[#6C63FF]" /><h1 className="text-sm font-black italic uppercase tracking-tighter">Nexora AI</h1></div>
        <nav className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-white"><MessageSquare size={14}/> Chat Node</div>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-bold uppercase text-slate-600 hover:text-red-400 flex items-center gap-3"><LogOut size={14}/> Exit System</button>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between">
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Authorized: {session.user.email}</span>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-3xl mx-auto p-6 rounded-3xl ${m.role === 'assistant' ? 'bg-white/[0.03] border border-white/5' : ''}`}>
              <div className="text-[10px] font-black uppercase mb-2 opacity-30">{m.role}</div>
              <div className="prose prose-invert text-sm leading-relaxed text-slate-300"><ReactMarkdown>{m.content}</ReactMarkdown></div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-w-3xl mx-auto w-full">
          <div className="bg-[#0D0D14] border border-white/10 rounded-full p-2 flex items-center">
            <input value={input} onChange={handleInputChange} placeholder="Command Nexora..." className="flex-1 bg-transparent border-none outline-none px-6 text-sm" />
            <button type="submit" disabled={isLoading} className="w-12 h-12 bg-[#6C63FF] rounded-full flex items-center justify-center hover:scale-105 transition-all"><Send size={18}/></button>
          </div>
        </form>
      </main>
    </div>
  );
}