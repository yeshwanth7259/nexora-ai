"use client";
import Link from 'next/link';
import { Cpu, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center px-6 py-24"> 
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <Sparkles size={16} className="text-[#6C63FF]" />
          <span className="text-xs font-black uppercase tracking-wider">NEXORA SUITE</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-black leading-tight text-transparent bg-gradient-to-r from-[#6C63FF] via-cyan-400 to-[#6C63FF] bg-clip-text">
          Enterprise AI for YashNav Ecosystem
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl max-w-2xl mx-auto">
          Seamless code generation, business intelligence, and next-gen logic for DSR EV, Sri Sai Copier, Load Maker, and Death Riders.
        </p>

        <Link href="/login" className="inline-flex items-center gap-3 px-10 py-4 bg-[#6C63FF] hover:bg-[#5a52e0] rounded-2xl font-black uppercase tracking-wider shadow-xl transition-all active:scale-95">
          GET STARTED
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
