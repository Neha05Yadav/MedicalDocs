"use client";













const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const FileImage = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><circle cx="10" cy="12" r="2"></circle><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const Folder = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const Printer = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>;
const Paperclip = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"></path></svg>;
const Droplet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
import { useState } from "react";
const mockAllReports = [
  { id: "REP001", patientId: "PAT001", patientName: "Rahul Kumar", type: "Blood Test", uploadDate: "12 Jun 2026", docName: "Blood Test Report.pdf", icon: Droplet, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
  { id: "REP002", patientId: "PAT001", patientName: "Rahul Kumar", type: "MRI", uploadDate: "15 Jun 2026", docName: "MRI Scan Brain.jpg", icon: FileImage, color: "text-[#0891b2]", bg: "bg-cyan-50", border: "border-cyan-100" },
  { id: "REP003", patientId: "PAT002", patientName: "Priya Sharma", type: "Prescription", uploadDate: "16 Jun 2026", docName: "Prescription_Dr.Singh.pdf", icon: FileText, color: "text-emerald-500", bg: "bg-white", border: "border-emerald-100" },
  { id: "REP004", patientId: "PAT003", patientName: "Aman Singh", type: "X-Ray", uploadDate: "17 Jun 2026", docName: "Chest X-Ray.jpg", icon: FileImage, color: "text-[#0891b2]", bg: "bg-cyan-50", border: "border-cyan-100" },
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
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSelectPatient("PAT001")}
            className="px-5 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <UploadCloud className="size-4" /> Upload New Report
          </button>
        </div>
      </div>
      {/* All Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-[#0891b2] font-semibold text-base mb-5">All Patient Reports</h2>
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
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleSelectPatient(summary.patientId)}
                        className="p-1.5 text-[#0891b2] border border-[#0891b2]/20 rounded-md hover:bg-cyan-50 transition-colors inline-flex items-center justify-center shadow-sm"
                        title="View Patient Details & Reports"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleSelectPatient(summary.patientId)}
                        className="px-3 py-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-white transition-colors inline-flex items-center gap-1.5 justify-center shadow-sm text-xs font-semibold"
                        title="Upload New Report"
                      >
                        <UploadCloud className="size-3.5" /> Upload
                      </button>
                    </div>
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
              <div className="size-14 rounded-full bg-cyan-50 flex items-center justify-center text-[#0891b2] border border-cyan-100">
                <User className="size-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0891b2] uppercase tracking-wider mb-0.5">{selectedPatientId}</p>
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
                <h2 className="text-[#0891b2] font-semibold mb-5">Patient's Reports ({patientReports.length})</h2>
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
                              <button className="p-1.5 text-[#0891b2] border border-[#0891b2]/20 rounded-md hover:bg-cyan-50 transition-colors inline-flex items-center justify-center shadow-sm" title="View"><Eye className="size-4" /></button>
                              <button className="p-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-white transition-colors inline-flex items-center justify-center shadow-sm" title="Download"><Download className="size-4" /></button>
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
                <h2 className="text-[#0891b2] font-semibold mb-5">Upload New Report for {selectedPatientData.name}</h2>
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
                        <label key={type} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${reportUploadType === type ? 'border-[#0891b2] bg-cyan-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="reportUploadType" 
                            checked={reportUploadType === type}
                            onChange={() => setReportUploadType(type)}
                            className="text-[#0891b2] focus:ring-[#0891b2]" 
                          />
                          <span className={`text-sm font-medium ${reportUploadType === type ? 'text-[#0891b2]' : 'text-slate-700'}`}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="px-6 py-2.5 bg-white0 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <UploadCloud className="size-4" />
                    Upload Report
                  </button>
                </div>
              </div>
            </div>
            {/* Right Column (Patient Summary Sidebar) */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                <h2 className="text-[#0891b2] font-semibold mb-6">Patient Stats</h2>
                <div className="space-y-4">
                  {/* Total Reports */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-cyan-100/50 flex items-center justify-center text-[#0891b2]">
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
                     <div className="size-12 rounded-lg bg-white flex items-center justify-center text-emerald-600">
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
