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

  useEffect(() => {
    fetch("/api/hospital/analytics")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load analytics");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading analytics dashboard...</div>;
  }

  const defaultKpis = [
    { label: "Total Patients", value: "1,842", trend: "+12%" },
    { label: "Avg. Wait Time", value: "18 min", trend: "-5%" },
    { label: "Appts This Month", value: "340", trend: "+8%" },
    { label: "Reports Uploaded", value: "300", trend: "+15%" },
  ];

  const defaultMonthlyData = [
    { month: "Jan", patients: 320, appointments: 210, reports: 180 },
    { month: "Feb", patients: 350, appointments: 240, reports: 200 },
    { month: "Mar", patients: 410, appointments: 280, reports: 240 },
    { month: "Apr", patients: 380, appointments: 260, reports: 220 },
    { month: "May", patients: 450, appointments: 310, reports: 270 },
    { month: "Jun", patients: 490, appointments: 340, reports: 300 },
  ];

  const defaultDeptDist = [
    { name: "Cardiology", value: 142, color: "#dc2626" },
    { name: "Neurology", value: 98, color: "#7c3aed" },
    { name: "Orthopedics", value: 76, color: "#d97706" },
    { name: "Pediatrics", value: 124, color: "#0252d9" },
    { name: "General", value: 210, color: "#059669" },
  ];

  const kpis = data?.kpis?.length > 0 ? data.kpis : defaultKpis;
  const monthlyData = data?.monthlyData?.length > 0 ? data.monthlyData : defaultMonthlyData;
  const deptDistribution = data?.deptDistribution?.length > 0 ? data.deptDistribution : defaultDeptDist;
  return (
    <div className="p-8">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((k: any, i: number) => {
          // Map icons based on index since backend just sends labels
          const Icon = i === 0 ? Users : i === 1 ? Activity : i === 2 ? CalendarDays : FileText;
          return (
            <div key={k.label} className="bg-card ring-1 ring-black/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{k.value}</p>
                <span className={`text-xs font-medium mb-1 ${k.trend.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>{k.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-6">Monthly Trends</h2>
          <MonthlyTrendChart data={monthlyData} />
        </div>
        {/* Department Distribution */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-6">Department Distribution</h2>
          <DepartmentDistributionChart data={deptDistribution} />
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {deptDistribution.map((d: any) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Report Stats */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-6">Report Statistics</h2>
        <ReportStatisticsChart data={monthlyData} />
      </div>
    </div>
  );
}
