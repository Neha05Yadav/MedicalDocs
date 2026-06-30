"use client";












const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const FileUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M12 12v6"></path><path d="m15 15-3-3-3 3"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// Mock data
const mockReports = [
  { id: "REP-9901", patientName: "Rahul Sharma", patientId: "PAT001", title: "Complete Blood Count", category: "Lab Report", date: "11 Jun 2026", size: "1.2 MB", status: "Sent" },
  { id: "REP-9902", patientName: "Rahul Sharma", patientId: "PAT001", title: "Lipid Profile", category: "Lab Report", date: "10 Jun 2026", size: "0.8 MB", status: "Sent" },
  { id: "REP-9903", patientName: "Amit Kumar", patientId: "PAT003", title: "HbA1c", category: "Lab Report", date: "10 Jun 2026", size: "0.5 MB", status: "Sent" },
  { id: "REP-9904", patientName: "Neha Gupta", patientId: "PAT004", title: "Thyroid Panel", category: "Lab Report", date: "09 Jun 2026", size: "1.1 MB", status: "Sent" },
];
export default function LaboratoryReportsPage() {
  const [activeTab, setActiveTab] = useState("view"); // "view" | "upload"
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  // View Report Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const openViewModal = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || report.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const categories = ["All", "Lab Report", "Pathology", "Microbiology", "Genetics"];
  const uploadCategories = ["Lab Report", "Pathology", "Microbiology", "Genetics", "Other"];
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <div className="flex items-center gap-3">
          {activeTab === "view" ? (
            <button 
              onClick={() => setActiveTab("upload")}
              className="px-5 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <FileUp className="size-4" /> Upload New Report
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab("view")}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Back to Reports
            </button>
          )}
        </div>
      </div>
      {/* VIEW REPORTS SECTION */}
      {activeTab === "view" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or report title..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="size-4 text-slate-400" />
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        categoryFilter === cat 
                          ? "bg-[#0891b2] text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
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
                    <th className="px-6 py-4">Report Details</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date Uploaded</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-2">
                                {report.title}
                              </div>
                              <div className="text-xs text-slate-500">{report.size} • PDF • ID: {report.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-800">{report.patientName}</p>
                              <p className="text-[10px] text-slate-500">{report.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {report.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="size-4" />
                            {report.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openViewModal(report)} className="p-2 text-slate-400 hover:text-[#0891b2] hover:bg-cyan-50 rounded-md transition-colors" title="View Report">
                              <Eye className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        <FileText className="size-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">No reports found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* UPLOAD REPORTS SECTION */}
      {activeTab === "upload" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Upload Test Result</h2>
            <form className="space-y-6">
              {/* Patient Selection & Request ID */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient ID or Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. PAT001 or Rahul" 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Linked Request ID (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. TR-1029" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
              </div>
              {/* Title & Category */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Complete Blood Count (CBC)" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                  <div className="relative">
                    <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all text-slate-700">
                      {uploadCategories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Upload Final Report File</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors relative ${
                    selectedFile ? "border-[#0891b2] bg-cyan-50/50" : "border-slate-300 hover:border-[#0891b2] bg-slate-50 hover:bg-slate-50/50"
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {!selectedFile ? (
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                        <UploadCloud className="size-8 text-[#0891b2]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">PDF is recommended (max. 10MB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center relative z-10">
                      <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 relative">
                        <FileText className="size-8 text-[#0891b2]" />
                        <div className="absolute -bottom-1 -right-1 bg-white0 rounded-full p-0.5 border-2 border-white">
                          <CheckCircle2 className="size-4 text-white" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 mb-4">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeFile(); }}
                        className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors z-20 relative flex items-center gap-1.5"
                      >
                        <X className="size-3" /> Remove file
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="button"
                  className="px-8 py-3 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <UploadCloud className="size-4" /> Upload & Send to Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="p-6 bg-gradient-to-r from-cyan-500 to-[#0891b2] text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="size-5" />
                Report Details
              </DialogTitle>
              <DialogDescription className="text-cyan-100 font-medium">
                View information about the uploaded report.
              </DialogDescription>
            </DialogHeader>
          </div>
          {selectedReport && (
            <div className="p-6 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm font-semibold text-slate-500">Patient Name</span>
                  <div className="col-span-2 text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="size-4 text-[#0891b2]" />
                    {selectedReport.patientName} <span className="text-xs text-slate-400 font-normal">({selectedReport.patientId})</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm font-semibold text-slate-500">Report Document</span>
                  <div className="col-span-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="p-2 bg-red-100 text-red-600 rounded">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{selectedReport.title}.pdf</p>
                        <p className="text-xs text-slate-500">{selectedReport.size}</p>
                      </div>
                      <button onClick={() => alert('Downloading ' + selectedReport.title + '...')} className="p-2 text-slate-400 hover:text-[#0891b2] hover:bg-cyan-50 rounded-md transition-colors">
                        <Download className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm font-semibold text-slate-500">Category</span>
                  <div className="col-span-2 text-sm font-medium text-slate-900">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedReport.category}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4 pb-2">
                  <span className="text-sm font-semibold text-slate-500">Upload Date</span>
                  <div className="col-span-2 text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" />
                    {selectedReport.date}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
