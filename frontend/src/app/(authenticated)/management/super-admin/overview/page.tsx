"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Inline SVGs to replace lucide-react (prevents import/runtime errors in Next.js)
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v4"/><path d="M14 8h-4"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.87 0 5 1 7 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const DollarSign = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [revenueRange, setRevenueRange] = useState<"six-months" | "year">("six-months");

  useEffect(() => {
    let cancelled = false;
    const loadOverview = async () => {
      setLoading(true);
      setError("");
      let lastError: Error = new Error("Platform service is temporarily unavailable.");

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch('/api/management/super-admin/overview', { cache: 'no-store' });
          const contentType = response.headers.get('content-type') || '';
          const json = contentType.includes('application/json') ? await response.json() : null;
          if (!response.ok) throw new Error(json?.message || "Platform service is temporarily unavailable.");
          if (!json?.stats) throw new Error("Platform overview returned an invalid response.");
          if (cancelled) return;
          setData({ stats: json.stats, revenueData: Array.isArray(json.revenueData) ? json.revenueData : [], yearlyRevenueData: Array.isArray(json.yearlyRevenueData) ? json.yearlyRevenueData : [], userDistribution: Array.isArray(json.userDistribution) ? json.userDistribution : [] });
          setLoading(false);
          return;
        } catch (requestError) {
          lastError = requestError instanceof Error ? requestError : lastError;
          if (attempt < 2) await new Promise(resolve => window.setTimeout(resolve, 700 * (attempt + 1)));
        }
      }

      if (!cancelled) {
        console.error("Platform overview fetch failed:", lastError);
        setError(lastError.message);
        setLoading(false);
      }
    };

    loadOverview();
    return () => { cancelled = true; };
  }, []);

  if (error) return <div className="grid min-h-[60vh] place-items-center p-8 text-center"><div><h2 className="text-xl font-bold">Live platform data is unavailable</h2><p className="mt-2 text-slate-500">{error}</p><button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Try again</button></div></div>;

  const stats = data ? [
    { title: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", accent: "bg-blue-500" },
    { title: "Total Hospitals", value: data.stats.totalHospitals, icon: Hospital, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", accent: "bg-indigo-500" },
    { title: "Total Labs", value: data.stats.totalLabs, icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", accent: "bg-amber-500" },
    { title: "Total Doctors", value: data.stats.totalDoctors, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", accent: "bg-emerald-500" },
    { title: "Total Reports", value: data.stats.totalReports, icon: FileText, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", accent: "bg-rose-500" },
    { title: "Active Admins", value: data.stats.activeAdmins, icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", accent: "bg-slate-500" },
    { title: "Monthly Growth", value: data.stats.monthlyGrowth, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", accent: "bg-teal-500" },
    { title: "Platform Revenue", value: data.stats.platformRevenue, icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", accent: "bg-violet-500" },
  ] : [];
  const revenueSeries = revenueRange === "year" ? (data?.yearlyRevenueData || []) : (data?.revenueData || []);
  const revenueTotal = revenueSeries.reduce((total: number, entry: any) => total + Number(entry.amount || 0), 0);
  const compositionGradients = [
    'linear-gradient(90deg, #2563eb, #60a5fa)',
    'linear-gradient(90deg, #059669, #34d399)',
    'linear-gradient(90deg, #4f46e5, #8b5cf6)',
    'linear-gradient(90deg, #d97706, #fbbf24)',
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none -z-10" />
      
      <header className="mb-7 flex flex-col md:flex-row md:items-end justify-end gap-4">
        <div className="flex gap-3">
          <Link href="/management/super-admin/settings" className="px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all shadow-sm shadow-brand/20">
            System Settings
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        </div>
      ) : (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {stats.map((stat, index) => (
            <article key={index} className="group relative flex min-h-[8.25rem] cursor-default flex-col overflow-hidden rounded-[1.15rem] border border-slate-200/90 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,.65)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_38px_-24px_rgba(15,23,42,.5)]">
              <div className={`absolute inset-x-0 top-0 h-[3px] ${stat.accent}`} />
              <div className="flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-[.7rem] border ${stat.border} ${stat.bg} ${stat.color}`}><stat.icon className="size-[1.05rem]" /></span>
              </div>
              <div className="mt-auto pt-3">
                <h3 className="truncate text-[1.55rem] font-black leading-none tracking-[-.035em] text-slate-950" title={String(stat.value)}>{stat.value}</h3>
                <p className="mt-1.5 truncate text-[11px] font-extrabold uppercase tracking-[.055em] text-slate-500" title={stat.title}>{stat.title}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Revenue Chart */}
           <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col min-h-[430px] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Revenue Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{revenueRange === "year" ? `Monthly paid revenue for ${new Date().getFullYear()}` : "Paid revenue over the last 6 months"} · Total ₹{revenueTotal.toLocaleString('en-IN')}</p>
                </div>
                <select value={revenueRange} onChange={(event) => setRevenueRange(event.target.value as "six-months" | "year")} className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700 font-bold bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-brand/20 focus:border-brand" aria-label="Revenue chart period">
                  <option value="six-months">Last 6 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-auto px-2">
                {revenueSeries.map((entry: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-10 pointer-events-none shadow-xl">
                      ₹{Number(entry.amount || 0).toLocaleString('en-IN')}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                    </div>
                    
                    <span className={`text-xs font-extrabold ${Number(entry.amount || 0) > 0 ? 'text-indigo-700' : 'text-slate-400'}`}>
                      ₹{Number(entry.amount || 0).toLocaleString('en-IN')}
                    </span>
                    <div className="w-full max-w-[60px] mx-auto bg-slate-50 border border-slate-100 rounded-t-lg relative flex-1 flex items-end overflow-hidden group-hover:bg-slate-100 transition-colors cursor-pointer" title={`${entry.month}: ₹${Number(entry.amount || 0).toLocaleString('en-IN')}`}>
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 relative overflow-hidden shadow-sm ${Number(entry.amount || 0) > 0 ? 'bg-gradient-to-t from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700' : 'bg-slate-300'}`}
                        style={{ height: Number(entry.amount || 0) > 0 ? `${Math.max(entry.percent, 5)}%` : "3px" }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover:animate-[shimmer_1s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {entry.month}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           {/* User Distribution */}
           <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col min-h-[430px] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Platform Composition</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Live registered entities by type</p>
                </div>
              </div>
              
              <div className="flex flex-1 flex-col gap-5">
                {data?.userDistribution?.map((item: any, i: number) => (
                  <div key={i} className="w-full group">
                    <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
                      <span className="group-hover:text-brand transition-colors">{item.region}</span>
                      <span className="min-w-12 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-center text-xs font-extrabold text-slate-600">{item.users}</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner ring-1 ring-slate-200/60">
                      <div 
                        className="relative h-full overflow-hidden rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${item.percent > 0 ? Math.max(item.percent, 4) : 0}%`, background: compositionGradients[i % compositionGradients.length] }} 
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>
                  </div>
                ))}
                
              </div>
           </div>
        </div>
      </div>
      )}
    </div>
  );
}
