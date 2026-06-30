"use client";
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const File = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path></svg>;











import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Mock Data
const mockReports = [
  { id: "REP-2026-001", patient: "Rahul Sharma", type: "Blood Test", facility: "Apex Diagnostic Labs", date: "22 Jun 2026", status: "Verified" },
  { id: "REP-2026-002", patient: "Amit Kumar", type: "MRI Scan", facility: "City Care Hospital", date: "21 Jun 2026", status: "Verified" },
  { id: "REP-2026-003", patient: "Priya Singh", type: "X-Ray", facility: "Metro Heart Institute", date: "20 Jun 2026", status: "Pending Review" },
  { id: "REP-2026-004", patient: "Neha Gupta", type: "Urine Analysis", facility: "City PathLabs", date: "19 Jun 2026", status: "Verified" },
  { id: "REP-2026-005", patient: "Sanjay Verma", type: "CT Scan", facility: "Carewell Imaging", date: "18 Jun 2026", status: "Verified" },
];
export default function ReportsMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const openViewModal = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };
  const filteredReports = mockReports.filter(rep => 
    rep.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
      </div>
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex justify-end items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, Patient, or Facility..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
        </div>
      </div>
      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Report ID / Type</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Facility</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{report.id}</div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">{report.type}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {report.patient}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="size-3.5 text-slate-400" />
                      <span className="font-medium">{report.facility}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span className="font-medium">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {report.status === "Verified" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="size-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                        {report.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => openViewModal(report)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileText className="size-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No reports found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-5 py-4">
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Patient Name</span>
                <div className="font-semibold text-slate-900 text-base">{selectedReport.patient}</div>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Report PDF/Image</span>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer group">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg group-hover:scale-105 transition-transform">
                    <FileText className="size-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-1">{selectedReport.id}_{selectedReport.type.replace(/\s+/g, '_')}.pdf</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">1.2 MB • PDF Document</div>
                  </div>
                  <button className="ml-auto p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Uploaded By Lab/Hospital</span>
                  <div className="font-semibold text-slate-900">{selectedReport.facility}</div>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Upload Date</span>
                  <div className="font-semibold text-slate-900">{selectedReport.date}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors w-full sm:w-auto">
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
