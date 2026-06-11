"use client";

import { Building2, CheckCircle2, XCircle, Eye, ShieldCheck, Clock } from "lucide-react";

const mockRequests = [
  {
    id: "REQ001",
    hospital: "City Hospital",
    date: "09 Jun 2026",
    status: "Pending",
  },
  {
    id: "REQ002",
    hospital: "Care Hospital",
    date: "05 Jun 2026",
    status: "Approved",
  },
];

export default function AccessRequestsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Access Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Manage hospital requests to access your health records.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Hospital/Doctor/Lab</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100/50">
                       <Building2 className="size-5" />
                    </div>
                    {request.hospital}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {request.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-tight border ${
                      request.status === "Approved" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {request.status === "Approved" ? <ShieldCheck className="size-3" /> : <Clock className="size-3" />}
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {request.status === "Pending" ? (
                        <>
                          <button 
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="size-3.5" /> Approve
                          </button>
                          <button 
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <XCircle className="size-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="size-3.5" /> View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
