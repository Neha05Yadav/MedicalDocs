"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HospitalOverviewChartWrapper from "./HospitalOverviewChartWrapper";

const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const FileUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M12 12v6"></path><path d="m15 15-3-3-3 3"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;

function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 bg-card ring-1 ring-black/5 rounded-xl border-t-2 border-muted">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
            <div className="size-4 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-16 bg-muted animate-pulse rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function HospitalDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, [router]);

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("/api/hospital/overview", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch overview data");
      
      const overviewData = await res.json();
      setData(overviewData);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 w-full">
        <KPICardsSkeleton />
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card ring-1 ring-black/5 rounded-xl p-6 h-64 flex items-center justify-center text-muted-foreground animate-pulse">Loading Chart...</div>
            <div className="bg-card ring-1 ring-black/5 rounded-xl h-64 flex items-center justify-center text-muted-foreground animate-pulse">Loading Queue...</div>
        </div>
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6 h-32 flex items-center justify-center text-muted-foreground animate-pulse">Loading Departments...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard Data Unavailable</h2>
        <p className="text-slate-500 mb-4">We couldn't load the hospital overview data. Please try again.</p>
        <button onClick={fetchOverview} className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-cyan-700">Try Again</button>
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Doctors", value: data?.totalDoctors || 0, icon: Stethoscope, color: "border-t-2 border-brand" },
    { label: "Total Patients", value: data?.totalPatients || 0, icon: Users, color: "border-t-2 border-emerald" },
    { label: "Reports Uploaded", value: data?.reportsUploaded || 0, icon: FileUp, color: "border-t-2 border-purple" },
    { label: "Total Departments", value: data?.totalDepartments || 0, icon: Building2, color: "border-t-2 border-amber" },
  ];

  return (
    <div className="p-8 w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className={`p-5 bg-card ring-1 ring-black/5 rounded-xl ${card.color}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{card.label}</p>
              <card.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold mt-2 tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Reports Generated Chart */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Reports Generated This Week</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand" /> Reports</span>
            </div>
          </div>
          <HospitalOverviewChartWrapper data={data?.reportStats || []} />
        </div>
        {/* Active Patient Queue */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">Active Patient Queue</h2>
            <Link href="/hospital/patients" className="text-xs font-semibold text-brand hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(data?.activePatients || []).map((patient: any, i: number) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-muted rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {patient?.name ? patient.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) : "NA"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{patient?.name || "Unknown"}</p>
                    <p className="text-[10px] text-muted-foreground">{patient?.department || "General"} • {patient?.doctor || "Unassigned"}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${
                  patient?.status === "Stable" ? "status-stable" :
                  patient?.status === "Pending Labs" ? "status-pending" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {patient?.status || "Unknown"}
                </span>
              </div>
            ))}
            {(!data?.activePatients || data.activePatients.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">No active patients in queue</div>
            )}
          </div>
        </div>
      </div>
      {/* Department Stats */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-6">Department Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { dept: "Cardiology", count: 142, trend: "+5%", icon: Activity },
            { dept: "Neurology", count: 98, trend: "+2%", icon: TrendingUp },
            { dept: "Orthopedics", count: 76, trend: "-1%", icon: Activity },
            { dept: "Pediatrics", count: 124, trend: "+8%", icon: Clock },
          ].map((d) => (
            <div key={d.dept} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d.dept}</p>
                <d.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{d.count}</p>
              <p className={`text-xs font-medium mt-1 ${d.trend.startsWith("+") ? "text-emerald" : "text-red"}`}>
                {d.trend} this week
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
