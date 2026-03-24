"use client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { Cpu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center p-6">
      <Link href="/" className="absolute top-10 left-10 text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="w-full max-w-md bg-[#0A0A0F] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#6C63FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#6C63FF]/20">
            <Cpu className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black italic text-white uppercase">Nexora Intelligence</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 text-center">Node Authentication Required</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#6C63FF', brandAccent: '#5a52e0', inputBackground: '#030305', inputText: 'white', inputBorder: '#1e1e2e' } } } }}
          providers={['google']}
          redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
        />
      </div>
    </div>
  );
}