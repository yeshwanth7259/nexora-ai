"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LandingPage from './landing/page'; 
import { Send, Plus, MessageSquare, Cpu, Menu, ShieldCheck, Users, IndianRupee, LogOut } from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [isAdmin, setIsAdmin] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api: '/api/chat' });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!session) return <LandingPage />;

  return (
    <div className="flex h-screen w-full bg-[#030305] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0A0A0F] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <Cpu className="text-[#6C63FF]" size={24} />
          <h1 className="text-xl font-black italic tracking-tighter">NEXORA AI</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setCurrentView('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase italic ${currentView === 'chat' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
            <MessageSquare size={16}/> Intelligence Chat
          </button>
          <button onClick={() => setCurrentView('admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase italic text-slate-500 hover:text-white">
            <ShieldCheck size={16}/> Admin Panel
          </button>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center gap-3 text-slate-600 hover:text-red-400 text-[10px] font-bold uppercase">
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#030305]">
        <header className="h-20 border-b border-white/5 flex items-center px-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Node Active // {session.user.email}
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar" ref={scrollRef}>
          <div className="max-w-4xl mx-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-6 mb-12 ${m.role === 'assistant' ? 'bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5' : ''}`}>
                <div className="prose prose-invert max-w-none text-slate-300 flex-1">
                  <ReactMarkdown components={{
                    code({inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">{String(children)}</SyntaxHighlighter>
                      ) : <code className="bg-slate-800 px-1 rounded text-[#6C63FF]">{children}</code>
                    }
                  }}>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-10 max-w-4xl mx-auto w-full">
          <div className="relative flex items-center bg-[#0D0D14] border border-white/10 p-2 rounded-[2.5rem] focus-within:border-[#6C63FF]/50 transition-all">
            <input value={input} onChange={handleInputChange} placeholder="Ask Nexora anything..." className="flex-1 bg-transparent border-none outline-none px-6 text-white" />
            <button type="submit" disabled={isLoading} className="w-12 h-12 bg-[#6C63FF] rounded-2xl flex items-center justify-center disabled:opacity-50"><Send size={20}/></button>
          </div>
        </form>
      </main>
    </div>
  );
}