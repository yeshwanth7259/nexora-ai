"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Rocket, Code, Paintbrush, Globe, Zap, ShieldCheck, 
  ArrowRight, Cpu, Sparkles, BarChart3 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-slate-200 font-sans selection:bg-[#6C63FF]/30">
      
      {/* 1. NAV BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="text-[#6C63FF]" size={28} />
            <span className="text-xl font-black italic tracking-tighter text-white">NEXORA AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#solutions" className="hover:text-white transition-colors">YashNav Suites</a>
            <Link href="/login" className="bg-[#6C63FF] text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#6C63FF]/20">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#6C63FF] blur-[150px] opacity-10 rounded-full"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">v1.2 Production Engine Live</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white leading-[0.9] mb-8 uppercase">
            Execute Faster.<br/>
            <span className="text-[#6C63FF]">Build Smarter.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed">
            The elite AI Execution Engine for YashNav IT Solutions. Nexora architect's your code, engineers your designs, and deploys your future in seconds.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/login" className="w-full md:w-auto px-10 py-5 bg-[#6C63FF] text-white rounded-[2rem] font-black italic text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
              GET STARTED <ArrowRight size={20} />
            </Link>
            <button className="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black italic text-lg hover:bg-white/10 transition-all">
              VIEW DOCUMENTATION
            </button>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES GRID */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#6C63FF] text-center text-[10px] font-black uppercase tracking-[0.5em] mb-16">Core Intelligence Modules</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Code />} 
              title="Autonomous Coding" 
              desc="Full-stack React, Node, and Python execution with zero syntax errors." 
            />
            <FeatureCard 
              icon={<Paintbrush />} 
              title="UX/UI Design" 
              desc="Generates modern wireframes, Tailwind palettes, and brand identities." 
            />
            <FeatureCard 
              icon={<Globe />} 
              title="SEO Strategy" 
              desc="Deep keyword analysis, meta-automation, and visibility planning." 
            />
            <FeatureCard 
              icon={<Rocket />} 
              title="Auto-Deploy" 
              desc="One-click deployment strategies for Vercel, AWS, and Cloud nodes." 
            />
          </div>
        </div>
      </section>

      {/* 4. YASHNAV ECOSYSTEM */}
      <section id="solutions" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-6 leading-tight">
              Optimized for the <br/> <span className="text-[#6C63FF]">YashNav Ecosystem.</span>
            </h3>
            <p className="text-slate-400 text-lg mb-8">
              Nexora is fine-tuned to handle YashNav IT Solutions' specific business branches including DSR EV Mobility, Load Maker, and Sri Sai Copier.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold"><Zap size={18} className="text-[#6C63FF]"/> Logistics Optimization for DSR EV</li>
              <li className="flex items-center gap-3 text-sm font-bold"><BarChart3 size={18} className="text-[#6C63FF]"/> Revenue Analytics for IT Services</li>
              <li className="flex items-center gap-3 text-sm font-bold"><ShieldCheck size={18} className="text-[#6C63FF]"/> Enterprise-Grade Security Protocol</li>
            </ul>
          </div>
          <div className="flex-1 w-full aspect-video bg-gradient-to-br from-[#6C63FF]/20 to-cyan-500/20 rounded-[3rem] border border-white/10 relative group overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-8 bg-[#0D0D14] rounded-3xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">
                   <Cpu size={60} className="text-[#6C63FF] animate-pulse" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Cpu className="text-[#6C63FF]" size={24} />
          <span className="text-sm font-black italic tracking-tighter text-white">NEXORA AI</span>
        </div>
        <p className="text-[10px] font-black text-slate-700 tracking-[0.5em] uppercase italic">
          Think Faster • Build Smarter • Nexora AI © 2026
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] hover:border-[#6C63FF]/30 transition-all group">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#6C63FF] mb-8 group-hover:bg-[#6C63FF] group-hover:text-white transition-all shadow-xl">
        {icon}
      </div>
      <h4 className="text-xl font-black italic text-white uppercase mb-4 tracking-tighter">{title}</h4>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}