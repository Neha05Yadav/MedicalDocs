"use client";

import { Eye, Download, FileText, Share2, Search, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const initialMockPrescriptions = [
  {
    id: "PRE001",
    doctor: "Dr. Amit Sharma",
    date: "08 Jun 2026",
    status: "Active",
  },
  {
    id: "PRE002",
    doctor: "Dr. Priya Singh",
    date: "20 May 2026",
    status: "Completed",
  },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialMockPrescriptions);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [uploadDoctor, setUploadDoctor] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    setTimeout(() => {
      const newRecord = {
        id: uploadId,
        doctor: uploadDoctor,
        date: new Date(uploadDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Active",
      };
      
      setPrescriptions([newRecord, ...prescriptions]);
      toast.success("Prescription added successfully!");
      
      setShowUpload(false);
      setUploadId("");
      setUploadDoctor("");
      setUploadDate("");
      setIsPending(false);
    }, 500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-slate-50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prescriptions</h1>
          <p className="text-sm text-slate-500 mt-1">View and download your digital prescriptions.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 bg-[#1e5eff] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          <Upload className="size-4" />
          Upload Prescription
        </button>
      </header>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-slate-900">Upload New Prescription</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleAddPrescription} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Prescription ID *</label>
                <input
                  type="text"
                  value={uploadId}
                  onChange={(e) => setUploadId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. PRE003"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor Name *</label>
                <input
                  type="text"
                  value={uploadDoctor}
                  onChange={(e) => setUploadDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date *</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  required
                />
              </div>
              
              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-[#1e5eff] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search prescriptions by ID or Doctor..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff] shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Prescription ID</th>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1e5eff] flex items-center gap-2">
                    <div className="size-8 bg-blue-50 text-[#1e5eff] rounded-lg flex items-center justify-center border border-blue-100/50">
                       <FileText className="size-4" />
                    </div>
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {prescription.doctor}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {prescription.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                        title="View Prescription"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button 
                        className="p-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-emerald-50 transition-colors inline-flex items-center justify-center"
                        title="Download Prescription"
                      >
                        <Download className="size-4" />
                      </button>
                      <button 
                        className="p-1.5 text-amber-600 border border-amber-600/20 rounded-md hover:bg-amber-50 transition-colors inline-flex items-center justify-center"
                        title="Share Prescription"
                      >
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
  );
}
