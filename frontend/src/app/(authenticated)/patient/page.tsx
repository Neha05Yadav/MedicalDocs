"use client";

import Link from "next/link";
import {
  FileText, Calendar, Clock, Share2, Upload, Plus,
  Pill, Activity, ArrowUpRight, Stethoscope, MapPin, Eye
} from "lucide-react";

const mockRecords = [
  { id: "1", title: "Complete Blood Count", category: "Lab Report", provider: "Apollo Diagnostics", created_at: "2026-06-05T10:00:00Z", record_date: "2026-06-05T10:00:00Z" },
  { id: "2", title: "Neurologist Prescription", category: "Prescription", provider: "Max Healthcare", created_at: "2026-06-08T10:00:00Z", record_date: "2026-06-08T10:00:00Z" },
  { id: "3", title: "Chest X-Ray", category: "X-Ray", provider: "City Hospital", created_at: "2026-05-20T10:00:00Z", record_date: "2026-05-20T10:00:00Z" },
  { id: "4", title: "COVID-19 Vaccination", category: "Vaccination", provider: "Govt Hospital", created_at: "2026-01-15T10:00:00Z", record_date: "2026-01-15T10:00:00Z" },
];

const mockAppointments = [
  { id: "1", doctor_name: "Dr. Sarah Jenkins", hospital_name: "Apollo Hospital", department: "Cardiology", appointment_date: "2026-06-15T10:30:00Z" },
  { id: "2", doctor_name: "Dr. Priya Patel", hospital_name: "City Hospital", department: "Orthopedics", appointment_date: "2026-06-20T09:15:00Z" },
];

export default function PatientDashboard() {
  const records = mockRecords;
  const appointments = mockAppointments;

  const totalRecords = records.length;
  const recentRecords = records.filter((r) => {
    const d = new Date(r.created_at);
    return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
  }).length;
  
  const upcomingAppointments = appointments.filter((a) => {
    const d = new Date(a.appointment_date || "");
    return d > new Date(); // In mock data, these are future dates
  }).length;

  const kpiCards = [
    { label: "Total Records", value: totalRecords, icon: FileText, color: "border-[#1e5eff]", bgColor: "bg-blue-50 text-[#1e5eff]" },
    { label: "Recent (30d)", value: recentRecords, icon: Activity, color: "border-emerald-500", bgColor: "bg-emerald-50 text-emerald-600" },
    { label: "Upcoming Appts", value: upcomingAppointments, icon: Calendar, color: "border-amber-500", bgColor: "bg-amber-50 text-amber-600" },
    { label: "Prescriptions", value: records.filter((r) => r.category === "Prescription").length, icon: Pill, color: "border-purple-500", bgColor: "bg-purple-50 text-purple-600" },
  ];

  const categoryColor: Record<string, string> = {
    "Lab Report": "text-blue-700 bg-blue-50 border-blue-100",
    "X-Ray": "text-emerald-700 bg-emerald-50 border-emerald-100",
    "MRI": "text-purple-700 bg-purple-50 border-purple-100",
    "Vaccination": "text-amber-700 bg-amber-50 border-amber-100",
    "Prescription": "text-rose-700 bg-rose-50 border-rose-100",
    "Certificate": "text-indigo-700 bg-indigo-50 border-indigo-100",
    Other: "text-slate-700 bg-slate-50 border-slate-100",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back. Here is your health at a glance.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className={`p-6 bg-white border-t-4 border border-slate-200 shadow-sm rounded-xl ${card.color}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className="size-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* Recent Records Table */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Recent Health Records</h2>
            <Link href="/records" className="text-sm font-semibold text-[#1e5eff] hover:underline flex items-center gap-1.5">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Document & Provider</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.slice(0, 4).map((record) => (
                  <tr key={record.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/60 shrink-0">
                           <FileText className="size-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{record.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{record.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold tracking-tight border ${categoryColor[record.category] || categoryColor["Other"]}`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(record.record_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 transition-opacity">
                        <button className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center" title="View">
                          <Eye className="size-4" />
                        </button>
                        <button className="p-1.5 text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center justify-center" title="Share">
                          <Share2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
