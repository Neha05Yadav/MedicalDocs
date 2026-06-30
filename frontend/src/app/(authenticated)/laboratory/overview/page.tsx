"use client";

import Link from "next/link";
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
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const TestTube2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"></path><path d="m16 2 6 6"></path><path d="M12 16H4"></path></svg>;
const Microscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
const Snowflake = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 20-1.25-2.5L6 18"></path><path d="M10 4 8.75 6.5 6 6"></path><path d="m14 20 1.25-2.5L18 18"></path><path d="m14 4 1.25 2.5L18 6"></path><path d="m17 21-3-6h-4"></path><path d="m17 3-3 6 1.5 3"></path><path d="M2 12h6.5L10 9"></path><path d="m20 10-1.5 2 1.5 2"></path><path d="M22 12h-6.5L14 15"></path><path d="m4 10 1.5 2L4 14"></path><path d="m7 21 3-6-1.5-3"></path><path d="m7 3 3 6h4"></path></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const patientChartData = [
  { name: 'Jan', patients: 25 },
  { name: 'Feb', patients: 45 },
  { name: 'Mar', patients: 38 },
  { name: 'Apr', patients: 65 },
  { name: 'May', patients: 60 },
  { name: 'Jun', patients: 90 },
];
const testRequestOverviewData = [
  { name: 'Received', value: 48, color: '#06b6d4' },
  { name: 'In Progress', value: 35, color: '#10b981' },
  { name: 'Sample Collected', value: 25, color: '#a855f7' },
  { name: 'Cancelled', value: 20, color: '#f59e0b' },
];
const reportsSummaryData = [
  { name: 'Completed', value: 64, color: '#10b981' },
  { name: 'Pending', value: 32, color: '#06b6d4' },
  { name: 'Verified', value: 24, color: '#a855f7' },
];
const recentTestRequests = [
  { id: "TRF-250516-001", patient: "Rahul Kumar", tests: "CBC, RBS, Lipid Profile", status: "Received" },
  { id: "TRF-250516-002", patient: "Priya Sharma", tests: "Thyroid Profile", status: "In Progress" },
  { id: "TRF-250516-003", patient: "Amit Verma", tests: "Liver Function Test", status: "Sample Collected" },
  { id: "TRF-250516-004", patient: "Neha Singh", tests: "Vitamin D, B12", status: "Received" },
  { id: "TRF-250516-005", patient: "Suresh Patel", tests: "Kidney Function Test", status: "In Progress" },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Received": return "bg-cyan-50 text-cyan-600";
    case "In Progress": return "bg-white text-emerald-600";
    case "Sample Collected": return "bg-purple-50 text-purple-600";
    default: return "bg-slate-50 text-muted-foreground";
  }
}

export default function LaboratoryDashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans">
      {/* ROW 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
        {/* Test Requests */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-50 text-cyan-500 rounded-lg"><ClipboardList className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">Test Requests</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">128</h3>
              <p className="text-xs font-bold text-cyan-500 mt-1">+18 today</p>
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
            <span className="font-bold text-card-foreground text-[13px]">Reports Generated</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">96</h3>
              <p className="text-xs font-bold text-emerald-500 mt-1">+14 today</p>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#10b981" />
            </div>
          </div>
        </div>
        {/* Samples Received */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TestTube2 className="size-5" /></div>
            <span className="font-bold text-card-foreground text-[13px]">Samples Received</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">112</h3>
              <p className="text-xs font-bold text-purple-600 mt-1">+16 today</p>
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
              <h3 className="text-3xl font-extrabold text-foreground">342</h3>
              <p className="text-xs font-bold text-orange-500 mt-1">+21 today</p>
            </div>
            <div className="w-16 h-10">
              <StaticSparkline color="#f97316" />
            </div>
          </div>
        </div>
        {/* Pending Reports */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 xl:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-cyan-50 text-cyan-500 rounded-full mb-3"><User className="size-6" /></div>
          <span className="font-bold text-card-foreground text-sm">Pending Reports</span>
          <h3 className="text-3xl font-extrabold text-foreground my-1">32</h3>
          <p className="text-[11px] font-bold text-cyan-500 uppercase tracking-wider cursor-pointer hover:underline">View all</p>
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
                <span className="text-2xl font-extrabold text-foreground">128</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {testRequestOverviewData.map(item => (
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
        {/* Recent Test Requests Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-card-foreground text-sm">Recent Test Requests</h3>
            <Link href="/laboratory/test-requests">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-slate-50">
                {recentTestRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-medium text-muted-foreground text-xs">{req.id}</td>
                    <td className="py-3 px-2 font-bold text-foreground text-[13px]">{req.patient}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{req.tests}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold tracking-wider ${getStatusStyles(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <Link href="/laboratory/reports">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 relative flex-shrink-0">
              <ReportsSummaryDonutChartWrapper data={reportsSummaryData} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-foreground">96</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {reportsSummaryData.map(item => (
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
            <Link href="/laboratory/sample-management">
              <span className="text-xs font-bold text-cyan-600 cursor-pointer hover:underline">View all</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Samples Received */}
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><TestTube2 className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Samples<br/>Received</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">112</p>
              </div>
            </div>
            {/* In Testing */}
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Microscope className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">In<br/>Testing</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">45</p>
              </div>
            </div>
            {/* Completed Tests */}
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-white text-emerald-600 rounded-lg shrink-0"><CheckCircle2 className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Completed<br/>Tests</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">64</p>
              </div>
            </div>
            {/* Reports Ready */}
            <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex items-center justify-center gap-3 text-center md:text-left md:justify-start">
              <div className="hidden sm:block p-2 bg-cyan-50 text-cyan-600 rounded-lg shrink-0"><FileText className="size-5" /></div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Reports<br/>Ready</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1.5">32</p>
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
          <div className="flex-1 flex items-start gap-4 px-2">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-full shrink-0"><ClipboardList className="size-5" /></div>
            <div>
              <p className="font-bold text-foreground text-[13px]">New test request received</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">TRF-250516-006</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">5 minutes ago</p>
            </div>
          </div>
          <div className="flex-1 flex items-start gap-4 px-2 md:pl-6">
            <div className="p-3 bg-white text-emerald-600 rounded-full shrink-0"><CheckCircle2 className="size-5" /></div>
            <div>
              <p className="font-bold text-foreground text-[13px]">Report generated</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">TRF-250516-001</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">25 minutes ago</p>
            </div>
          </div>
          <div className="flex-1 flex items-start gap-4 px-2 md:pl-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full shrink-0"><TestTube2 className="size-5" /></div>
            <div>
              <p className="font-bold text-foreground text-[13px]">Sample collected</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Rahul Kumar</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">1 hour ago</p>
            </div>
          </div>
          <div className="flex-1 flex items-start gap-4 px-2 md:pl-6">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-full shrink-0"><Bell className="size-5" /></div>
            <div>
              <p className="font-bold text-foreground text-[13px]">System maintenance</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Scheduled on 18 May</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
