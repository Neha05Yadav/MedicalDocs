"use client";

import { 
  Search, UploadCloud, FileText, FileImage, User, 
  Calendar, FlaskConical, Folder, Eye, Download, Printer, Paperclip, Droplet
} from "lucide-react";
import { useState } from "react";

const mockAllReports = [
  { id: "REP001", patientId: "PAT001", patientName: "Rahul Kumar", type: "Blood Test", uploadDate: "12 Jun 2026", docName: "Blood Test Report.pdf", icon: Droplet, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
  { id: "REP002", patientId: "PAT001", patientName: "Rahul Kumar", type: "MRI", uploadDate: "15 Jun 2026", docName: "MRI Scan Brain.jpg", icon: FileImage, color: "text-[#1e5eff]", bg: "bg-blue-50", border: "border-blue-100" },
  { id: "REP003", patientId: "PAT002", patientName: "Priya Sharma", type: "Prescription", uploadDate: "16 Jun 2026", docName: "Prescription_Dr.Singh.pdf", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { id: "REP004", patientId: "PAT003", patientName: "Aman Singh", type: "X-Ray", uploadDate: "17 Jun 2026", docName: "Chest X-Ray.jpg", icon: FileImage, color: "text-[#1e5eff]", bg: "bg-blue-50", border: "border-blue-100" },
];

const mockPatientSummaries = [
  { patientId: "PAT001", patientName: "Rahul Kumar", totalReports: 2, lastUploadDate: "15 Jun 2026" },
  { patientId: "PAT002", patientName: "Priya Sharma", totalReports: 1, lastUploadDate: "16 Jun 2026" },
  { patientId: "PAT003", patientName: "Aman Singh", totalReports: 1, lastUploadDate: "17 Jun 2026" },
];

const mockPatientsDetails: Record<string, any> = {
  "PAT001": { name: "Rahul Kumar", mrNo: "10234", mobile: "98XXXXX12", ageGender: "28 Y / Male", lastVisit: "15 Jun 2026", totalReports: 2, pendingTests: 1 },
  "PAT002": { name: "Priya Sharma", mrNo: "10235", mobile: "99XXXXX45", ageGender: "32 Y / Female", lastVisit: "16 Jun 2026", totalReports: 1, pendingTests: 0 },
  "PAT003": { name: "Aman Singh", mrNo: "10236", mobile: "97XXXXX32", ageGender: "45 Y / Male", lastVisit: "17 Jun 2026", totalReports: 1, pendingTests: 2 },
};

export default function ReportsManagementPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [reportUploadType, setReportUploadType] = useState("Blood Test");

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setTimeout(() => {
      document.getElementById("patient-details-reports")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const selectedPatientData = selectedPatientId ? mockPatientsDetails[selectedPatientId] : null;
  const patientReports = selectedPatientId ? mockAllReports.filter(r => r.patientId === selectedPatientId) : [];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Patient Name or ID" 
              className="pl-10 pr-4 py-2 w-80 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
            />
          </div>
          <button className="px-5 py-2.5 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
            <UploadCloud className="size-4" />
            Upload New Report
          </button>
        </div>
      </header>

      {/* All Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-[#1e5eff] font-semibold text-base mb-5">All Patient Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">No of Reports</th>
                <th className="py-3 px-4">Last Upload Date</th>
                <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPatientSummaries.map((summary, idx) => (
                <tr key={`${summary.patientId}-${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-700">{summary.patientId}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{summary.patientName}</td>
                  <td className="py-4 px-4 text-slate-600 font-semibold">{summary.totalReports}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{summary.lastUploadDate}</td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => handleSelectPatient(summary.patientId)}
                      className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center shadow-sm"
                      title="View Patient Details & Reports"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details & Reports Section */}
      {selectedPatientId && selectedPatientData && (
        <div id="patient-details-reports" className="scroll-mt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Patient Profile & Records</h2>
          
          {/* Patient Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-full bg-blue-50 flex items-center justify-center text-[#1e5eff] border border-blue-100">
                <User className="size-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e5eff] uppercase tracking-wider mb-0.5">{selectedPatientId}</p>
                <p className="font-bold text-slate-900 text-lg">{selectedPatientData.name}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-12">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">MR No.</p>
                <p className="font-semibold text-slate-900">{selectedPatientData.mrNo}</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Mobile</p>
                <p className="font-semibold text-slate-900">{selectedPatientData.mobile}</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Age / Gender</p>
                <p className="font-semibold text-slate-900">{selectedPatientData.ageGender}</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Last Visit</p>
                <p className="font-semibold text-slate-900">{selectedPatientData.lastVisit}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column (Upload + Previous Reports) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Previous Reports Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-[#1e5eff] font-semibold mb-5">Patient's Reports ({patientReports.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="py-3 px-4 rounded-tl-lg">Report No</th>
                        <th className="py-3 px-4">Document</th>
                        <th className="py-3 px-4">Upload Date</th>
                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patientReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-semibold text-slate-700">{report.id}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`${report.color}`}><report.icon className="size-5" /></div>
                              <div>
                                <span className="font-medium text-slate-900 block">{report.docName}</span>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md border ${report.bg} ${report.color} ${report.border}`}>
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">{report.uploadDate}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center shadow-sm" title="View"><Eye className="size-4" /></button>
                              <button className="p-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-emerald-50 transition-colors inline-flex items-center justify-center shadow-sm" title="Download"><Download className="size-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upload Report Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-[#1e5eff] font-semibold mb-5">Upload New Report for {selectedPatientData.name}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-3">Choose File</p>
                    <div className="border border-dashed border-slate-300 bg-slate-50 rounded-xl p-5 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-3">
                         <Paperclip className="size-5 text-slate-400" />
                         <div>
                           <p className="text-sm text-slate-600 font-medium">Choose file or drag here</p>
                           <p className="text-xs text-slate-400 mt-0.5">PDF, Image, Scan (Max. 10MB)</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-3">Report Category</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Blood Test", "Prescription", "X-Ray / MRI", "Other"].map(type => (
                        <label key={type} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${reportUploadType === type ? 'border-[#1e5eff] bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="reportUploadType" 
                            checked={reportUploadType === type}
                            onChange={() => setReportUploadType(type)}
                            className="text-[#1e5eff] focus:ring-[#1e5eff]" 
                          />
                          <span className={`text-sm font-medium ${reportUploadType === type ? 'text-[#1e5eff]' : 'text-slate-700'}`}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <UploadCloud className="size-4" />
                    Upload Report
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column (Patient Summary Sidebar) */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                <h2 className="text-[#1e5eff] font-semibold mb-6">Patient Stats</h2>
                
                <div className="space-y-4">
                  {/* Total Reports */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-blue-100/50 flex items-center justify-center text-[#1e5eff]">
                       <Folder className="size-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium mb-0.5">Total Reports</p>
                       <p className="text-xl font-bold text-slate-800">{selectedPatientData.totalReports}</p>
                     </div>
                  </div>

                  {/* Pending Tests */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                       <FlaskConical className="size-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium mb-0.5">Pending Lab Tests</p>
                       <p className="text-xl font-bold text-slate-800">{selectedPatientData.pendingTests}</p>
                     </div>
                  </div>

                  {/* Last Visit */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                       <Calendar className="size-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium mb-0.5">Last Visit</p>
                       <p className="text-lg font-bold text-slate-800">{selectedPatientData.lastVisit}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
