"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import SystemActivityClient from './SystemActivityClient';
import UserDistributionClient from './UserDistributionClient';
import { toast } from "sonner";

const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M14 9h-4"></path><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"></path><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const ArrowUpRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>;
const ArrowDownRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 7 10 10"></path><path d="M17 7v10H7"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/management/admin/overview")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load admin overview");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading system metrics...</div>;
  }

  const kpis = data?.kpis || {};
  
  const kpiData = [
    { title: "Total Patients", value: kpis.patients?.toLocaleString() || "0", trend: "+12.5%", isPositive: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Doctors", value: kpis.doctors?.toLocaleString() || "0", trend: "+4.2%", isPositive: true, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Hospitals", value: kpis.hospitals?.toLocaleString() || "0", trend: "+2.1%", isPositive: true, icon: Hospital, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Reports", value: kpis.reports?.toLocaleString() || "0", trend: "+18.4%", isPositive: true, icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "Platform Revenue", value: `₹${kpis.revenue?.toLocaleString() || "0"}`, trend: "+5.4%", isPositive: true, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const userDistributionData = [
    { name: 'Patients', value: kpis.patients || 0, color: '#3b82f6' },
    { name: 'Doctors', value: kpis.doctors || 0, color: '#10b981' },
    { name: 'Hospitals', value: kpis.hospitals || 0, color: '#8b5cf6' },
  ];

  const activityDataByPeriod = {
    "This Week": [
      { name: 'Mon', reports: 400, tests: 240 },
      { name: 'Tue', reports: 300, tests: 139 },
      { name: 'Wed', reports: 200, tests: 980 },
      { name: 'Thu', reports: 278, tests: 390 },
      { name: 'Fri', reports: 189, tests: 480 },
      { name: 'Sat', reports: 239, tests: 380 },
      { name: 'Sun', reports: 349, tests: 430 },
    ],
    "Last Week": [
      { name: 'Mon', reports: 320, tests: 210 },
      { name: 'Tue', reports: 250, tests: 150 },
      { name: 'Wed', reports: 310, tests: 850 },
      { name: 'Thu', reports: 190, tests: 320 },
      { name: 'Fri', reports: 240, tests: 410 },
      { name: 'Sat', reports: 180, tests: 350 },
      { name: 'Sun', reports: 280, tests: 390 },
    ],
    "This Month": [
      { name: 'Wk 1', reports: 1200, tests: 1840 },
      { name: 'Wk 2', reports: 1400, tests: 1639 },
      { name: 'Wk 3', reports: 1100, tests: 2180 },
      { name: 'Wk 4', reports: 1578, tests: 1890 },
    ]
  };

  const recentActivities = [
    { id: 1, title: "New Hospital Registered", desc: "City Care Hospital joined the network", time: "10 mins ago", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: 2, title: "System Alert", desc: "High traffic detected in Lab module", time: "1 hour ago", icon: Activity, color: "text-amber-500", bg: "bg-amber-100" },
    { id: 3, title: "Doctor Verified", desc: "Dr. Sharma's credentials verified", time: "2 hours ago", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-100" },
    { id: 4, title: "Batch Reports Processed", desc: "1,200 reports processed successfully", time: "3 hours ago", icon: FileText, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="size-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {kpi.isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</p>
              <p className="text-sm font-semibold text-slate-500 mt-1">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* User Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Platform Demographics</h3>
          </div>
          <UserDistributionClient data={userDistributionData} />
          <div className="grid grid-cols-3 gap-4 mt-6">
            {userDistributionData.map(item => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-slate-500">{item.name}</span>
                </div>
                <span className="text-lg font-extrabold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Analytics Cards (Activity Chart) */}
        <SystemActivityClient activityDataByPeriod={activityDataByPeriod} />
      </div>
      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-lg">Recent Activities</h3>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, idx) => (
            <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-xl ${idx !== recentActivities.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className={`p-3 rounded-xl ${activity.bg} ${activity.color} shrink-0`}>
                <activity.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock className="size-3.5" />
                    {activity.time}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
