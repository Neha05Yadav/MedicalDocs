"use client";

import { useState, useRef } from "react";
import { 
  FileText, Search, Filter, Download, Eye, Calendar, User, UploadCloud, X, FileUp, CheckCircle2, ChevronDown
} from "lucide-react";

// Mock data
const mockReports = [
  { id: "REP001", patientName: "Rahul Sharma", patientId: "PAT001", title: "Complete Blood Count", category: "Lab Report", date: "15 May 2025", size: "1.2 MB", status: "Unread" },
  { id: "REP002", patientName: "Rahul Sharma", patientId: "PAT001", title: "Lipid Profile", category: "Lab Report", date: "10 May 2025", size: "0.8 MB", status: "Read" },
  { id: "REP003", patientName: "Priya Singh", patientId: "PAT002", title: "Brain MRI", category: "Imaging", date: "16 May 2025", size: "15.4 MB", status: "Unread" },
  { id: "REP004", patientName: "Aman Singh", patientId: "PAT003", title: "Chest X-Ray", category: "X-Ray", date: "12 May 2025", size: "5.1 MB", status: "Read" },
];

export default function DoctorReportsPage() {
  const [activeTab, setActiveTab] = useState("view"); // "view" | "upload"
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || report.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Lab Report", "Imaging", "X-Ray", "Other"];
  const uploadCategories = ["Lab Report", "Imaging", "X-Ray", "Prescription", "Medical Certificate", "Other"];

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
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Patient Reports</h1>
          <p className="text-sm text-slate-500 mt-1">View patient shared reports or upload new medical reports.</p>
        </div>
        
        {/* Custom Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab("view")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "view" ? "bg-white text-[#1e5eff] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="size-4" /> View Reports
          </button>
          <button 
            onClick={() => setActiveTab("upload")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "upload" ? "bg-[#1e5eff] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileUp className="size-4" /> Upload Report
          </button>
        </div>
      </header>

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
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
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
                          ? "bg-[#1e5eff] text-white" 
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
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-2">
                                {report.title}
                                {report.status === "Unread" && (
                                  <span className="size-2 rounded-full bg-blue-500" title="New Report"></span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">{report.size} • PDF</div>
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
                            <button className="p-2 text-slate-400 hover:text-[#1e5eff] hover:bg-blue-50 rounded-md transition-colors" title="View Report">
                              <Eye className="size-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-[#1e5eff] hover:bg-blue-50 rounded-md transition-colors" title="Download">
                              <Download className="size-4" />
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
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Upload New Patient Report</h2>
            
            <form className="space-y-6">
              {/* Patient Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient ID or Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. PAT001 or Rahul" 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff] transition-all"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Category</label>
                  <div className="relative">
                    <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff] transition-all text-slate-700">
                      {uploadCategories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Complete Blood Count (CBC)" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff] transition-all"
                />
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Upload File</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors relative ${
                    selectedFile ? "border-[#1e5eff] bg-blue-50/50" : "border-slate-300 hover:border-[#1e5eff] bg-slate-50 hover:bg-slate-50/50"
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
                        <UploadCloud className="size-8 text-[#1e5eff]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">SVG, PNG, JPG or PDF (max. 10MB)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center relative z-10">
                      <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 relative">
                        <FileText className="size-8 text-[#1e5eff]" />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
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
                  className="px-8 py-3 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <UploadCloud className="size-4" /> Upload & Share with Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
