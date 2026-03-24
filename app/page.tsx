"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LandingPage from './landing/page'; 
import { Send, Cpu, MessageSquare, LogOut, Loader2 } from "lucide-react";

export default function NexoraApp() {
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Consolidated useChat hook - Handles input, messages, and loading automatically
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ 
    api: '/api/chat' 
  }) as any;

  // 2. Auth & Hydration logic
  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 3. Smooth Auto-scroll
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
      
      {/* Sidebar Navigation */}
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

        <button 
          onClick={() => supabase.auth.signOut()} 
          className="text-[10px] font-black uppercase text-slate-600 hover:text-red-400 flex items-center gap-3 transition-all hover:translate-x-1"
        >
          <LogOut size={14}/> Deactivate Session
        </button>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative bg-[#030305]">
        <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-[#030305]/50 backdrop-blur-xl z-10">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
             Authenticated // {session.user.email}
           </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 group">
              <Cpu size={64} className="mb-4 text-[#6C63FF] group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[1.5em] text-center ml-[1.5em]">Execution Engine Ready</h2>
            </div>
          )}
          
          {messages.map((m: any, i: number) => (
            <div 
              key={i} 
              className={`max-w-3xl mx-auto p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-700 ${
                m.role === 'assistant' 
                ? 'bg-white/[0.02] border border-white/5 shadow-xl' 
                : 'bg-transparent'
              }`}
            >
              <div className="text-[9px] font-black uppercase mb-4 opacity-30 tracking-[0.3em] italic">
                {m.role === 'assistant' ? 'Nexora Intelligence' : 'Source Query'}
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed selection:bg-[#6C63FF]/30">
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl border border-white/5 my-4 shadow-2xl"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-slate-800 px-1.5 py-0.5 rounded text-[#6C63FF] font-mono font-bold">
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="max-w-3xl mx-auto px-8 py-2 flex items-center gap-3">
              <Loader2 className="w-3 h-3 text-[#6C63FF] animate-spin" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#6C63FF]/50 italic">Processing Node...</span>
            </div>
          )}
        </div>

        {/* Command Input Area */}
        <div className="p-8 max-w-3xl mx-auto w-full bg-gradient-to-t from-[#030305] via-[#030305] to-transparent">
          <form 
            onSubmit={handleSubmit} 
            className="bg-[#0D0D14] border border-white/10 rounded-[2rem] p-2 flex items-center shadow-2xl focus-within:border-[#6C63FF]/50 focus-within:ring-1 focus-within:ring-[#6C63FF]/20 transition-all group"
          >
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Execute intelligence command..." 
              className="flex-1 bg-transparent border-none outline-none px-6 text-sm text-white placeholder:text-slate-700 placeholder:italic" 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="w-12 h-12 bg-[#6C63FF] rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#6C63FF]/20 disabled:opacity-20 cursor-pointer"
            >
              <Send size={18} className="text-white"/>
            </button>
          </form>
          <p className="text-[8px] text-center mt-4 text-slate-700 font-black uppercase tracking-[0.4em]">Powered by YashNav IT Solutions</p>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a24; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6C63FF; }
      `}</style>
    </div>
  );
}