"use client";

import { useState } from "react";
import { 
  FlaskConical, Search, Filter, Droplets, Calendar, User, CheckCircle2, ChevronRight
} from "lucide-react";

// Mock data
const mockSamples = [
  { id: "SMP-771", patientName: "Rahul Sharma", patientId: "PAT001", sampleType: "Blood", test: "Complete Blood Count", date: "11 Jun 2026", status: "Collected" },
  { id: "SMP-772", patientName: "Priya Singh", patientId: "PAT002", sampleType: "Urine", test: "Urinalysis", date: "11 Jun 2026", status: "In Transit" },
  { id: "SMP-773", patientName: "Amit Kumar", patientId: "PAT003", sampleType: "Blood", test: "HbA1c", date: "10 Jun 2026", status: "Processing" },
  { id: "SMP-774", patientName: "Neha Gupta", patientId: "PAT004", sampleType: "Swab", test: "Throat Culture", date: "10 Jun 2026", status: "Analyzed" },
];

export default function SampleManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredSamples = mockSamples.filter(smp => {
    const matchesSearch = smp.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          smp.sampleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || smp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "Collected", "In Transit", "Processing", "Analyzed"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Analyzed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Processing": return "bg-purple-50 text-purple-600 border-purple-200";
      case "In Transit": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Collected": return "bg-blue-50 text-blue-600 border-blue-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getSampleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "blood": return <Droplets className="size-5 text-red-500" />;
      default: return <FlaskConical className="size-5 text-indigo-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Sample Management</h1>
        <p className="text-sm text-slate-500 mt-1">Track physical samples from collection to analysis.</p>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or sample type..." 
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
                <th className="px-6 py-4">Sample ID & Type</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Linked Test</th>
                <th className="px-6 py-4">Date Collected</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSamples.length > 0 ? (
                filteredSamples.map((smp) => (
                  <tr key={smp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                          {getSampleIcon(smp.sampleType)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {smp.sampleType}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">{smp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">{smp.patientName}</p>
                          <p className="text-[10px] text-slate-500">{smp.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{smp.test}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="size-4" />
                        {smp.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(smp.status)}`}>
                        {smp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors inline-flex items-center gap-1">
                        Update <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FlaskConical className="size-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">No samples found.</p>
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
