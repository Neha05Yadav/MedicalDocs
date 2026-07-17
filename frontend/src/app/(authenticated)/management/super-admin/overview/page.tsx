"use client";

import React, { useState, useEffect } from 'react';

// Inline SVGs to replace lucide-react (prevents import/runtime errors in Next.js)
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v4"/><path d="M14 8h-4"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.87 0 5 1 7 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const DollarSign = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const ArrowRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/management/super-admin/overview')
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        
        if (!json?.stats) throw new Error("Platform overview returned an invalid response.");
        setData({ stats: json.stats, revenueData: Array.isArray(json.revenueData) ? json.revenueData : [], userDistribution: Array.isArray(json.userDistribution) ? json.userDistribution : [] });
        setLoading(false);
      })
      .catch(err => {
        console.error("Platform overview fetch failed:", err);
        setError(err instanceof Error ? err.message : "Platform overview could not be loaded.");
        setLoading(false);
      });
  }, []);

  if (error) return <div className="grid min-h-[60vh] place-items-center p-8 text-center"><div><h2 className="text-xl font-bold">Live platform data is unavailable</h2><p className="mt-2 text-slate-500">{error}</p><button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Try again</button></div></div>;

  const stats = data ? [
    { title: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Total Hospitals", value: data.stats.totalHospitals, icon: Hospital, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { title: "Total Labs", value: data.stats.totalLabs, icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "Total Doctors", value: data.stats.totalDoctors, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Total Reports", value: data.stats.totalReports, icon: FileText, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "Active Admins", value: data.stats.activeAdmins, icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
    { title: "Monthly Growth", value: data.stats.monthlyGrowth, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Platform Revenue", value: data.stats.platformRevenue, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  ] : [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none -z-10" />
      
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Welcome to the Super Admin Dashboard. Monitor system health and key metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all shadow-sm shadow-brand/20">
            System Settings
          </button>
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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-default"
            >
              <div className={`absolute -right-8 -top-8 size-32 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`} />
              
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm border ${stat.border}`}>
                  <stat.icon className="size-5" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100">
                  <TrendingUp className="size-3" />
                  <span>+12%</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Revenue Chart */}
           <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col h-[320px] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Revenue Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Monthly revenue growth over the last 6 months</p>
                </div>
                <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none text-slate-700 font-bold bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              
              <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-auto px-2">
                {data?.revenueData?.map((height: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-10 pointer-events-none shadow-xl">
                      ${Math.floor(height * 1250)}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                    </div>
                    
                    <div className="w-full max-w-[60px] mx-auto bg-slate-100 rounded-t-lg relative flex-1 flex items-end overflow-hidden group-hover:bg-slate-200 transition-colors cursor-pointer">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors relative overflow-hidden shadow-sm" 
                        style={{ height: `${height}%` }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover:animate-[shimmer_1s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           {/* User Distribution */}
           <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm flex flex-col h-[320px] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">User Distribution</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Platform users by region</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center gap-7">
                {data?.userDistribution?.map((item: any, i: number) => (
                  <div key={i} className="w-full group">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-2.5">
                      <span className="group-hover:text-brand transition-colors">{item.region}</span>
                      <span className="text-slate-500 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.users} users</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${item.color.replace('bg-', 'bg-gradient-to-r from-').concat('/80 to-').concat(item.color.replace('bg-', ''))} rounded-full relative overflow-hidden`} 
                        style={{ width: `${item.percent}%` }} 
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="mt-auto w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-brand hover:border-brand/30 hover:bg-brand/5 transition-all flex items-center justify-center gap-2 group">
                  View Full Report <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </div>
      </div>
      )}
    </div>
  );
}
