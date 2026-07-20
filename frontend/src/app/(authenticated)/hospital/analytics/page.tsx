"use client";
const BarChart3 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const CalendarDays = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;

import { MonthlyTrendChart, DepartmentDistributionChart, ReportStatisticsChart } from "./HospitalAnalyticsChartWrapper";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/hospital/analytics", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Hospital analytics could not be loaded from the server.");
        return res.json();
      })
      .then(resData => {
        setData(resData);
      })
      .catch(err => {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        toast.error("Failed to load live analytics");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading analytics dashboard...</div>;
  }

  if (error) return <div className="grid min-h-[55vh] place-items-center p-8 text-center"><div><h2 className="text-xl font-bold">Live analytics are unavailable</h2><p className="mt-2 text-muted-foreground">{error}</p><button onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Try again</button></div></div>;

  const kpis = Array.isArray(data?.kpis) ? data.kpis : [];
  const monthlyData = Array.isArray(data?.monthlyData) ? data.monthlyData : [];
  const deptDistribution = Array.isArray(data?.deptDistribution) ? data.deptDistribution : [];
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.09),transparent_28rem)] p-5 md:p-8">
      {/* KPI Row */}
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-600">Live operational view</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Performance at a glance</h2>
          <p className="mt-1 text-sm text-slate-500">Updated from your hospital records and appointment activity.</p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:flex"><span className="size-2 animate-pulse rounded-full bg-emerald-500" />Live database</span>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k: any, i: number) => {
          // Map icons based on index since backend just sends labels
          const Icon = i === 0 ? Users : i === 1 ? Activity : i === 2 ? CalendarDays : FileText;
          return (
            <div key={k.label} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.045)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,.08)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">{k.label}</p>
                <span className="grid size-10 place-items-center rounded-xl bg-slate-50 text-cyan-600 transition group-hover:bg-cyan-50"><Icon className="size-5" /></span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black tracking-tight text-slate-900">{k.value}</p>
                {k.trend && <span className={`mb-1 rounded-full px-2 py-0.5 text-xs font-bold ${String(k.trend).startsWith("-") ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{k.trend}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mb-6">
        {/* Monthly Trend */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_50px_rgba(15,23,42,.06)]">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />
          <div className="p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-700">Clinical flow</span><h2 className="mt-3 text-xl font-black text-slate-900">Patient activity trend</h2><p className="mt-1 text-sm text-slate-500">Unique patients and appointments across the last six months</p></div>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-bold text-slate-600"><span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm"><i className="size-2.5 rounded-full bg-cyan-500" />Patients</span><span className="flex items-center gap-2 px-3 py-2"><i className="size-2.5 rounded-full bg-indigo-500" />Appointments</span></div>
          </div>
          <MonthlyTrendChart data={monthlyData} />
          </div>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Department Distribution */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.05)] md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-black text-slate-900">Department ranking</h2><p className="mt-1 text-sm text-slate-500">Appointments by clinical department</p></div><span className="grid size-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-600"><BarChart3 className="size-5" /></span></div>
          <DepartmentDistributionChart data={deptDistribution} />
        </section>
        {/* Report Stats */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.05)] md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-black text-slate-900">Report volume</h2><p className="mt-1 text-sm text-slate-500">Medical records uploaded each month</p></div><span className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700">Last 6 months</span></div>
          <ReportStatisticsChart data={monthlyData} />
        </section>
      </div>
    </div>
  );
}
