"use client";

import Link from "next/link";
import {
  FileText, Clock, CheckCircle2, UploadCloud, Plus,
  FlaskConical, ArrowUpRight, Activity, Calendar
} from "lucide-react";

const mockRequests = [
  { id: "TR-1029", patient_name: "Rahul Sharma", test_type: "Complete Blood Count", date: "2026-06-11", status: "Pending" },
  { id: "TR-1028", patient_name: "Priya Singh", test_type: "Lipid Profile", date: "2026-06-11", status: "In Progress" },
  { id: "TR-1027", patient_name: "Amit Kumar", test_type: "HbA1c", date: "2026-06-10", status: "Completed" },
  { id: "TR-1026", patient_name: "Neha Gupta", test_type: "Thyroid Panel", date: "2026-06-10", status: "Completed" },
];

export default function LaboratoryDashboard() {
  const kpiCards = [
    { label: "Total Tests", value: "4,291", icon: FlaskConical, color: "border-[#1e5eff]", bgColor: "bg-blue-50 text-[#1e5eff]" },
    { label: "Pending Tests", value: "38", icon: Clock, color: "border-amber-500", bgColor: "bg-amber-50 text-amber-600" },
    { label: "Completed Tests", value: "4,150", icon: CheckCircle2, color: "border-emerald-500", bgColor: "bg-emerald-50 text-emerald-600" },
    { label: "Reports Uploaded", value: "4,145", icon: UploadCloud, color: "border-purple-500", bgColor: "bg-purple-50 text-purple-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Laboratory Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome to Apex Labs. Monitor your testing queue and uploaded reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#1e5eff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="size-4" />
            New Walk-in Test
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className={`p-6 bg-white border-t-4 border border-slate-200 shadow-sm rounded-xl ${card.color} hover:shadow-md transition-shadow`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Test Requests */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Recent Test Requests</h2>
            <Link href="/laboratory/test-requests" className="text-sm font-semibold text-[#1e5eff] hover:underline flex items-center gap-1.5">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Test Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{req.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{req.patient_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity className="size-3.5 text-[#1e5eff]" />
                        <span className="font-medium text-slate-700">{req.test_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-xs font-semibold text-[#1e5eff] hover:text-blue-700 hover:underline">
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link href="/laboratory/reports" className="w-full p-4 border border-slate-200 rounded-xl hover:border-[#1e5eff] hover:bg-blue-50/50 transition-colors flex items-center gap-4 group">
              <div className="size-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Upload Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload a completed test result</p>
              </div>
            </Link>
            
            <Link href="/laboratory/sample-management" className="w-full p-4 border border-slate-200 rounded-xl hover:border-[#1e5eff] hover:bg-blue-50/50 transition-colors flex items-center gap-4 group">
              <div className="size-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
                <FlaskConical className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Manage Samples</h3>
                <p className="text-xs text-slate-500 mt-0.5">Update sample collection status</p>
              </div>
            </Link>

            <Link href="/laboratory/test-requests" className="w-full p-4 border border-slate-200 rounded-xl hover:border-[#1e5eff] hover:bg-blue-50/50 transition-colors flex items-center gap-4 group">
              <div className="size-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Pending Requests</h3>
                <p className="text-xs text-slate-500 mt-0.5">Process new doctor test orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
