"use client";
import Link from 'next/link';
import { Cpu, ArrowRight, Sparkles, Code2, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#030712]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center">
              <Cpu size={18} className="text-white" />
            </div>
            <span className="font-black italic text-lg">NEXORA</span>
          </div>
          <Link href="/login" className="px-6 py-2 bg-[#6C63FF] hover:bg-[#5a52e0] rounded-lg font-bold text-sm transition-all active:scale-95">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6C63FF]/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-[#6C63FF]" />
              Elite AI Execution Engine
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-black italic tracking-tighter leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-[#6C63FF] via-cyan-400 to-[#6C63FF] bg-clip-text text-transparent">
                Development
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Meet NEXORA, the AI-powered engine built for YashNav IT Solutions. Generate code, design systems, optimize logistics, and scale your business faster than ever.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-gradient-to-br from-[#6C63FF] to-[#5a52e0] hover:shadow-2xl hover:shadow-[#6C63FF]/50 rounded-2xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all active:scale-95 group"
            >
              GET STARTED
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="#features"
              className="px-8 py-4 border-2 border-white/10 hover:border-white/20 rounded-2xl font-black text-lg uppercase tracking-wider transition-all hover:bg-white/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black italic text-center mb-16 tracking-tighter">
            Powered by Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:border-white/20">
              <div className="w-12 h-12 bg-[#6C63FF] rounded-xl flex items-center justify-center mb-6">
                <Code2 size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Production Code</h3>
              <p className="text-slate-400 leading-relaxed">
                Generate battle-tested code for React, Node.js, Python, and more. Ship faster with AI-assisted development.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:border-white/20">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Business Logic</h3>
              <p className="text-slate-400 leading-relaxed">
                Specialized insights for EV logistics, enterprise printing, last-mile delivery, and tourism optimization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:border-white/20">
              <div className="w-12 h-12 bg-[#6C63FF] rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Enterprise Grade</h3>
              <p className="text-slate-400 leading-relaxed">
                Built on Google Gemini Pro with secure Supabase integration. Enterprise-ready architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black italic text-center mb-16 tracking-tighter">
            Powering YashNav Ecosystem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'DSR EV Mobility', color: 'from-green-500' },
              { name: 'Sri Sai Copier', color: 'from-blue-500' },
              { name: 'Load Maker', color: 'from-orange-500' },
              { name: 'Death Riders', color: 'from-pink-500' },
            ].map((company) => (
              <div key={company.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${company.color} to-[#6C63FF] rounded-lg mx-auto mb-4`}></div>
                <h3 className="font-black uppercase tracking-wider text-sm">{company.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black italic tracking-tighter">
            Ready to Transform Your Business?
          </h2>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join the revolution. Experience AI-powered development and business optimization.
          </p>

          <Link 
            href="/login" 
            className="inline-block px-10 py-5 bg-gradient-to-br from-[#6C63FF] to-[#5a52e0] hover:shadow-2xl hover:shadow-[#6C63FF]/50 rounded-2xl font-black text-lg uppercase tracking-wider transition-all active:scale-95 group"
          >
            GET STARTED NOW
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-slate-500 text-xs font-black uppercase tracking-widest">
        <p>Think Faster • Build Smarter • NEXORA AI</p>
      </footer>
    </div>
  );
}