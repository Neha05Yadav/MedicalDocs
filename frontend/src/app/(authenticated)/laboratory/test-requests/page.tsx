"use client";

import { useState } from "react";
import { 
  FileText, Search, Filter, Activity, Clock, CheckCircle2, User, PlayCircle
} from "lucide-react";

// Mock data
const mockTestRequests = [
  { id: "TR-1029", patientName: "Rahul Sharma", patientId: "PAT001", testType: "Complete Blood Count", date: "11 Jun 2026", status: "Pending", priority: "High" },
  { id: "TR-1028", patientName: "Priya Singh", patientId: "PAT002", testType: "Lipid Profile", date: "11 Jun 2026", status: "Accepted", priority: "Normal" },
  { id: "TR-1027", patientName: "Amit Kumar", patientId: "PAT003", testType: "HbA1c", date: "10 Jun 2026", status: "Tested", priority: "Normal" },
  { id: "TR-1026", patientName: "Neha Gupta", patientId: "PAT004", testType: "Thyroid Panel", date: "10 Jun 2026", status: "Completed", priority: "Low" },
  { id: "TR-1025", patientName: "Sanjay Verma", patientId: "PAT005", testType: "Liver Function Test", date: "09 Jun 2026", status: "Pending", priority: "High" },
];

export default function TestRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = mockTestRequests.filter(req => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "Pending", "Accepted", "Tested", "Completed"];

  const summaryCards = [
    { label: "Pending", value: "12", icon: Clock, color: "border-amber-500", bgColor: "bg-amber-50 text-amber-600" },
    { label: "Accepted", value: "8", icon: FileText, color: "border-blue-500", bgColor: "bg-blue-50 text-blue-600" },
    { label: "Tested", value: "15", icon: PlayCircle, color: "border-purple-500", bgColor: "bg-purple-50 text-purple-600" },
    { label: "Completed", value: "142", icon: CheckCircle2, color: "border-emerald-500", bgColor: "bg-emerald-50 text-emerald-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Tested": return "bg-purple-50 text-purple-600 border-purple-200";
      case "Accepted": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Test Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Manage incoming test orders from doctors and walk-in patients.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className={`p-5 bg-white border-t-4 border border-slate-200 shadow-sm rounded-xl ${card.color} hover:shadow-md transition-shadow cursor-pointer`} onClick={() => setStatusFilter(card.label)}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or test type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="size-4 text-slate-400" />
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? "bg-[#1e5eff] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Patient Info</th>
                <th className="px-6 py-4">Test Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{req.id}</span>
                      <div className="text-xs text-slate-400 mt-1.5">{req.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {req.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{req.patientName}</p>
                          <p className="text-[10px] text-slate-500">{req.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{req.testType}</div>
                      {req.priority === "High" && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">HIGH PRIORITY</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#1e5eff] border border-[#1e5eff] rounded hover:bg-blue-50 transition-colors">
                        {req.status === "Pending" ? "Accept Request" : req.status === "Accepted" ? "Mark Tested" : req.status === "Tested" ? "Upload Report" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Activity className="size-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">No test requests found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
