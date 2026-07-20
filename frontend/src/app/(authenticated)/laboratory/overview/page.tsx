"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  TestRequestDonutChartWrapper, 
  ReportsSummaryDonutChartWrapper, 
  PatientsOverviewLineChartWrapper, 
  StaticSparkline 
} from "./LaboratoryChartsWrappers";

const ClipboardList = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const TestTube2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"></path><path d="m16 2 6 6"></path><path d="M12 16H4"></path></svg>;
const Microscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;



const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border border-amber-200";
    case "Accepted": return "bg-cyan-50 text-cyan-600 border border-cyan-200";
    case "Tested": return "bg-purple-50 text-purple-600 border border-purple-200";
    case "Completed": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    case "Cancelled": return "bg-red-50 text-red-600 border border-red-200";
    default: return "bg-slate-50 text-muted-foreground border border-slate-200";
  }
}

export default function LaboratoryDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setError("");
      const res = await fetch("/api/laboratory/overview", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.message || `Lab dashboard request failed (${res.status})`);
      }
      setData(payload);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch lab overview data.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center min-h-screen text-slate-500">Loading Dashboard...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] grid place-items-center p-8">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Lab data could not be loaded</h2>
          <p className="mt-2 text-sm text-slate-600">{error || "No laboratory workspace was returned by the server."}</p>
          <button type="button" onClick={() => { setLoading(true); fetchOverview(); }} className="mt-5 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700">
            Retry live data
          </button>
        </div>
      </div>
    );
  }

  const { kpis, testRequestOverviewData, reportsSummaryData, patientChartData, recentTestRequests, recentNotifications = [] } = data;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'Alert': return <div className="p-3 bg-orange-50 text-orange-500 rounded-full shrink-0"><Bell className="size-5" /></div>;
      case 'Request': return <div className="p-3 bg-cyan-50 text-cyan-600 rounded-full shrink-0"><ClipboardList className="size-5" /></div>;
      case 'Report': return <div className="p-3 bg-white text-emerald-600 rounded-full shrink-0"><CheckCircle2 className="size-5" /></div>;
      case 'Sample': return <div className="p-3 bg-purple-50 text-purple-600 rounded-full shrink-0"><TestTube2 className="size-5" /></div>;
      default: return <div className="p-3 bg-cyan-50 text-cyan-600 rounded-full shrink-0"><Bell className="size-5" /></div>;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans">
      {/* ROW 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
        {/* Test Requests */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-50 text-cyan-500 rounded-lg"><ClipboardList className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">Total Requests</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">{kpis.totalRequests}</h3>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#06b6d4" />
            </div>
          </div>
        </div>
        {/* Reports Generated */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white text-emerald-500 rounded-lg"><FileText className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">Completed Reports</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">{kpis.completedReports}</h3>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#10b981" />
            </div>
          </div>
        </div>
        {/* In Progress */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TestTube2 className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">In Progress</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">{kpis.inProgress}</h3>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#a855f7" />
            </div>
          </div>
        </div>
        {/* Total Patients */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Users className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">Total Patients</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">{kpis.totalPatients}</h3>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#f97316" />
            </div>
          </div>
        </div>
        {/* Pending Reports */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-full mb-3"><User className="size-6" /></div>
          <span className="font-bold text-card-foreground text-sm">Pending Reports</span>
          <h3 className="text-3xl font-extrabold text-foreground my-1">{kpis.pendingReports}</h3>
          <Link href="/laboratory/test-requests">
            <p className="text-[11px] font-bold text-cyan-500 uppercase tracking-wider cursor-pointer hover:underline">View all</p>
          </Link>
        </div>
      </div>
      
      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Test Request Overview Donut */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-card-foreground text-sm">Test Request Overview</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 relative flex-shrink-0">
              <TestRequestDonutChartWrapper data={testRequestOverviewData} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-foreground">{kpis.totalRequests}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {testRequestOverviewData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-card-foreground text-sm">Recent Test Requests</h3>
            <Link href="/laboratory/test-requests">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-2 py-3">ID</th>
                  <th className="px-2 py-3">Patient</th>
                  <th className="px-2 py-3">Origin</th>
                  <th className="px-2 py-3">Test</th>
                  <th className="px-2 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTestRequests.length > 0 ? recentTestRequests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-medium text-muted-foreground text-xs">{req.id.split('-')[0]}...</td>
                    <td className="py-3 px-2 font-bold text-foreground text-[13px]">{req.patient}</td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-slate-800 text-xs">{req.clinicName}</p>
                      <p className="text-[10px] text-muted-foreground">{req.doctorName}</p>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{req.tests}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold tracking-wider ${getStatusStyles(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500">No test requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* ROW 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Reports Summary Donut */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-card-foreground text-sm">Reports Summary</h3>
            <Link href="/laboratory/test-requests">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 relative flex-shrink-0">
              <ReportsSummaryDonutChartWrapper data={reportsSummaryData} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-foreground">{kpis.totalRequests}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {reportsSummaryData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sample Management Grid */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-card-foreground text-sm">Sample Management</h3>
            <Link href="/laboratory/test-requests">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><TestTube2 className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Samples<br/>Received</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">{kpis.inProgress}</p>
              </div>
            </div>
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Microscope className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">In<br/>Testing</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">{kpis.inProgress}</p>
              </div>
            </div>
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-white text-emerald-600 rounded-lg shrink-0"><CheckCircle2 className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Completed<br/>Tests</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">{kpis.completedReports}</p>
              </div>
            </div>
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-cyan-50 text-cyan-600 rounded-lg shrink-0"><FileText className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Reports<br/>Ready</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">{kpis.completedReports}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Patients Overview Line Chart */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-card-foreground text-sm">Patients Overview</h3>
            <Link href="/laboratory/patients">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="h-44 w-full relative">
            <PatientsOverviewLineChartWrapper data={patientChartData} />
          </div>
        </div>
      </div>
      
      {/* ROW 4 */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-card-foreground text-sm">Recent Notifications</h3>
          <Link href="/laboratory/notifications">
            <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:divide-x divide-slate-100">
          {recentNotifications.length > 0 ? recentNotifications.map((notif: any, i: number) => (
            <div key={notif.id} className={`flex-1 flex items-start gap-4 px-2 ${i !== 0 ? 'md:pl-6' : ''}`}>
              {getNotificationIcon(notif.type)}
              <div>
                <p className="font-bold text-foreground text-[13px]">{notif.title}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1">{notif.message}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 text-sm px-2">No new notifications.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}
