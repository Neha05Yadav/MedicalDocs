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
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Heart = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>;
const Brain = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 18V5"></path><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"></path><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"></path><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"></path><path d="M18 18a4 4 0 0 0 2-7.464"></path><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"></path><path d="M6 18a4 4 0 0 1-2-7.464"></path><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"></path></svg>;
const Bone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"></path></svg>;
const Baby = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M15 12h.01"></path><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path><path d="M9 12h.01"></path></svg>;
const Sparkles = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>;
const Ear = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"></path><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const getIconForDepartment = (name: string) => {
  const normalized = name?.toLowerCase() || "";
  if (normalized.includes('cardio')) return { icon: Heart, iconColor: "text-red-500", iconBg: "bg-red-50" };
  if (normalized.includes('neuro')) return { icon: Brain, iconColor: "text-purple-500", iconBg: "bg-purple-50" };
  if (normalized.includes('ortho')) return { icon: Bone, iconColor: "text-amber-500", iconBg: "bg-amber-50" };
  if (normalized.includes('pedia')) return { icon: Baby, iconColor: "text-pink-500", iconBg: "bg-pink-50" };
  if (normalized.includes('derma')) return { icon: Sparkles, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" };
  if (normalized.includes('ent')) return { icon: Ear, iconColor: "text-pink-500", iconBg: "bg-pink-50" };
  if (normalized.includes('ophtha')) return { icon: Eye, iconColor: "text-purple-500", iconBg: "bg-purple-50" };
  
  return { icon: Stethoscope, iconColor: "text-cyan-500", iconBg: "bg-cyan-50" };
};

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
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, [router]);

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const [res, deptRes] = await Promise.all([
        fetch("/api/hospital/overview", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/hospital/departments", { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch overview data");
      
      const overviewData = await res.json();
      if (deptRes.ok) {
        const deptData = await deptRes.json();
        overviewData.departments = deptData.departmentsData || [];
      } else {
        overviewData.departments = [];
      }
      
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold">Department Overview</h2>
          <button 
            onClick={() => setIsDeptModalOpen(true)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            View All Departments
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(data?.departments || []).slice(0, 4).map((d: any) => {
            const Icon = d.icon || Building2;
            return (
            <div key={d.name || d.dept} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d.name || d.dept}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{d.patients || d.count || 0}</p>
              <p className={`text-xs font-medium mt-1 ${(d.trend || "+0%").startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                {d.trend || "+0%"} this week
              </p>
            </div>
          )})}
          {(!data?.departments || data.departments.length === 0) && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-muted-foreground">No department activity is recorded yet.</div>
          )}
        </div>
      </div>

      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Building2 className="size-5 text-[#0891b2]" />
                All Departments
              </h2>
              <button 
                onClick={() => setIsDeptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-8 max-h-[75vh] overflow-y-auto bg-slate-50/30">
              {(!data?.departments || data.departments.length === 0) ? (
                <div className="text-center text-slate-500 py-12">No departments found. Please add doctors with specializations.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.departments.map((d: any) => {
                    const ui = getIconForDepartment(d.name || d.dept);
                    const DeptIcon = ui.icon;
                    return (
                    <div key={d.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center">
                      <div className={`size-16 rounded-full ${ui.iconBg} ${ui.iconColor} flex items-center justify-center mb-4`}>
                        <DeptIcon className="size-8" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-6 text-center">{d.name || d.dept}</h3>
                      <div className="w-full flex justify-between px-2 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            <User className="size-4 text-cyan-500" strokeWidth={2.5} />
                            <span className="text-sm font-bold text-slate-900">{d.doctors || 0}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Doctors</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Users className="size-4 text-emerald-500" strokeWidth={2.5} />
                            <span className="text-sm font-bold text-slate-900">{d.patients || 0}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Patients</span>
                        </div>
                      </div>
                      <div className="w-full border-t border-dashed border-slate-200 pt-5 flex justify-center">
                        <span className="px-6 py-1 bg-white text-emerald-600 font-bold text-xs rounded-full border border-emerald-100">
                          Active
                        </span>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
