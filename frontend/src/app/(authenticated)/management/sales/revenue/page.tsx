"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/RechartsWrapper";

const IndianRupee = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const ArrowUpRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>;
const ArrowDownRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;

export default function SalesRevenuePage() {
  const [activeRange, setActiveRange] = useState("This Year");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/management/sales/revenue')
      .then(res => {
        if (!res.ok) throw new Error(`Revenue request failed (${res.status})`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load revenue data", err);
        setError(err instanceof Error ? err.message : "Revenue data could not be loaded");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="grid min-h-[60vh] place-items-center p-8 text-center"><div><h2 className="text-xl font-bold text-slate-900">Revenue data is unavailable</h2><p className="mt-2 text-sm text-slate-500">{error || "The server returned an empty response."}</p><button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Retry</button></div></div>;
  }

  const kpi = data?.kpi || {};
  const revenueData = Array.isArray(data?.revenueData) ? data.revenueData : [];
  const sourceData = Array.isArray(data?.sourceData) ? data.sourceData : [];
  const changeText = (value: unknown) => String(value ?? "0%");
  const isNegative = (value: unknown) => changeText(value).trim().startsWith("-");

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans bg-slate-50/50">
      {/* Top Stats - Redesigned with dynamic layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-500">Total Revenue 💰</h3>
            <div className="p-2 bg-indigo-50 rounded-lg"><IndianRupee className="size-5 text-indigo-600" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{kpi.totalRevenue || "₹ 0"}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className={`flex items-center font-bold ${isNegative(kpi.totalRevenueChange) ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isNegative(kpi.totalRevenueChange) ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
              {changeText(kpi.totalRevenueChange).replace(/[+-]/, '')}
            </span>
            vs last year
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-500">Monthly Revenue 📅</h3>
            <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="size-5 text-blue-600" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{kpi.monthlyRevenue || "₹ 0"}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className={`flex items-center font-bold ${isNegative(kpi.monthlyRevenueChange) ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isNegative(kpi.monthlyRevenueChange) ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
              {changeText(kpi.monthlyRevenueChange).replace(/[+-]/, '')}
            </span>
            vs last month
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-500">Annual Revenue 📈</h3>
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="size-5 text-emerald-600" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{kpi.annualRevenue || "₹ 0"}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className={`flex items-center font-bold ${isNegative(kpi.annualRevenueChange) ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isNegative(kpi.annualRevenueChange) ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
              {changeText(kpi.annualRevenueChange).replace(/[+-]/, '')}
            </span>
            vs last year
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-500">Renewal Revenue 🔄</h3>
            <div className="p-2 bg-orange-50 rounded-lg"><RefreshCw className="size-5 text-orange-600" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{kpi.renewalRevenue || "₹ 0"}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className={`flex items-center font-bold ${isNegative(kpi.renewalRevenueChange) ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isNegative(kpi.renewalRevenueChange) ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
              {changeText(kpi.renewalRevenueChange).replace(/[+-]/, '')}
            </span>
            vs last month
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Growth</h3>
              <p className="text-sm text-slate-500 mt-1">Comparison of actual revenue vs target milestones.</p>
            </div>
            <select 
              value={activeRange}
              onChange={(e) => setActiveRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>This Year</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `₹${val/100000}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}
                  formatter={(value, name) => [`₹${(Number(value ?? 0)/100000).toFixed(1)} Lacs`, name === 'revenue' ? 'Actual Revenue' : 'Target']}
                />
                <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2.5} strokeDasharray="6 6" fill="none" />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fill="url(#colorRev)" activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff', fill: '#4f46e5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Revenue Sources</h3>
            <p className="text-sm text-slate-500 mb-8">Breakdown of revenue generated by subscription plan type.</p>
            <div className="space-y-8">
              {sourceData.map((item: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                    <span className="font-black text-slate-900 text-lg">{item.value}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-10 flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 transition-all group shadow-sm">
            <Download className="size-4 group-hover:-translate-y-0.5 transition-transform" /> Export Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
}
