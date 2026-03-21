"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, MessageSquare, IndianRupee, TrendingUp, 
  ArrowUpRight, Calendar, ShieldCheck 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, chats: 0, revenue: "₹45,200" });

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Count Total Users
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      // 2. Count Total Chats
      const { count: chatCount } = await supabase.from('chats').select('*', { count: 'exact', head: true });
      
      setStats(prev => ({ ...prev, users: userCount || 0, chats: chatCount || 0 }));
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-[#030305] min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[#6C63FF] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Nexora Intelligence // Admin</p>
            <h1 className="text-4xl font-black italic tracking-tighter">PROJECT OVERVIEW</h1>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
            <Calendar size={14} className="text-slate-500" />
            <span className="text-xs font-bold">MARCH 2026</span>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Users />} label="Total Users" value={stats.users} change="+12%" />
          <StatCard icon={<MessageSquare />} label="Active Sessions" value={stats.chats} change="+24%" />
          <StatCard icon={<IndianRupee />} label="Monthly Revenue" value={stats.revenue} change="+8%" color="text-green-500" />
        </div>

        {/* DATA TABLE */}
        <div className="bg-[#0A0A0F] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black italic text-sm tracking-widest uppercase">Global User Registry</h3>
            <button className="text-[10px] font-black text-[#6C63FF] uppercase border border-[#6C63FF]/30 px-4 py-2 rounded-lg hover:bg-[#6C63FF] hover:text-white transition-all">Export CSV</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500">
              <tr>
                <th className="px-8 py-4">User Identity</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Recent Activity</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                  <span className="font-bold">Yashwanth (Admin)</span>
                </td>
                <td className="px-8 py-6"><span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-2 py-1 rounded-md border border-amber-500/20">ADMIN</span></td>
                <td className="px-8 py-6 text-slate-500">Modified SQL Schema</td>
                <td className="px-8 py-6 text-right text-green-500 font-black italic">ACTIVE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color = "text-[#6C63FF]" }: any) {
  return (
    <div className="bg-[#0A0A0F] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-[#6C63FF]/30 transition-all">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C63FF] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 bg-white/5 rounded-2xl ${color} border border-white/5 ring-1 ring-white/10`}>{icon}</div>
        <div className="flex items-center gap-1 text-green-500 text-xs font-black italic">
          <ArrowUpRight size={14} /> {change}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <h2 className="text-3xl font-black italic tracking-tighter">{value}</h2>
    </div>
  );
}