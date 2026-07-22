"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
const Paperclip = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Droplet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;

export default function ReportsManagementPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [labReports, setLabReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLabReports, setIsLoadingLabReports] = useState(true);
  const [activeTab, setActiveTab] = useState<"hospital" | "lab">("hospital");
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);
  
  // Modals
  const [isNewUploadModalOpen, setIsNewUploadModalOpen] = useState(false);
  const [isExistingUploadModalOpen, setIsExistingUploadModalOpen] = useState(false);
  const [uploadingPatientId, setUploadingPatientId] = useState<string | null>(null);

  // Form states
  const [reportUploadType, setReportUploadType] = useState("Blood Test");
  const [docName, setDocName] = useState("");
  const [newPatientData, setNewPatientData] = useState({ name: "", phone: "", gender: "Male" });
  const [patientExistingId, setPatientExistingId] = useState(""); // If hospital enters patient ID
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/reports/patients", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPatients(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLabReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/reports/lab-reports", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setLabReports(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLabReports(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchLabReports();
  }, []);

  const handleSelectPatient = async (patientId: string) => {
    setSelectedPatientId(patientId);
    setPatientDetails(null);
    setIsLoadingPatientDetails(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/hospital/reports/patient/${patientId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load patient details and reports.");
      setPatientDetails(data);
      setTimeout(() => {
        document.getElementById("patient-details-reports")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to load patient details and reports.");
    } finally {
      setIsLoadingPatientDetails(false);
    }
  };

  const handleUploadNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    // Agar patient ID diya hai to sirf docName chahiye, warna naam aur phone bhi
    if (!docName) { toast.error("Document title required"); return; }
    if (!patientExistingId && (!newPatientData.name || !newPatientData.phone)) {
      toast.error("Patient ID ya Name + Mobile dono mein se ek required hai");
      return;
    }
    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("reportType", reportUploadType);
      formData.append("docName", docName);
      if (selectedFile) formData.append("file", selectedFile);

      if (patientExistingId.trim()) {
        // Existing patient — seedha upload karo us patient ID pe
        formData.append("patientId", patientExistingId.trim());
        const res = await fetch(`/api/hospital/reports/upload/${patientExistingId.trim()}`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Patient ID not found or upload failed");
        }
        toast.success("Report saved to existing patient's health records!");
      } else {
        // New patient — naam, phone se create karo
        formData.append("patientName", newPatientData.name);
        formData.append("patientMobile", newPatientData.phone);
        formData.append("patientGender", newPatientData.gender);
        const res = await fetch("/api/hospital/reports/upload-new", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        toast.success("New Patient registered & Report uploaded!");
      }

      setIsNewUploadModalOpen(false);
      setDocName("");
      setSelectedFile(null);
      setPatientExistingId("");
      setNewPatientData({ name: "", phone: "", gender: "Male" });
      fetchPatients();
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadExistingReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const pid = uploadingPatientId || selectedPatientId;
    if (!docName || !pid) {
      toast.error("Please enter a document name");
      return;
    }
    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      // FormData use karo taaki file bhi send ho sake
      const formData = new FormData();
      formData.append("reportType", reportUploadType);
      formData.append("docName", docName);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch(`/api/hospital/reports/upload/${pid}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }, // Content-Type set mat karo — browser khud set karega
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload");
      toast.success("Report Uploaded Successfully!");
      setIsExistingUploadModalOpen(false);
      setDocName("");
      setSelectedFile(null);
      fetchPatients();
      
      // Refresh current open patient if it's the same
      if (selectedPatientId === pid) {
        handleSelectPatient(pid);
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "Blood Test": return <Droplet className="size-5 text-red-500" />;
      case "Prescription": return <FileText className="size-5 text-emerald-500" />;
      case "X-Ray / MRI": return <FileImage className="size-5 text-[#0891b2]" />;
      default: return <FileText className="size-5 text-slate-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <button 
          onClick={() => setIsNewUploadModalOpen(true)}
          className="px-5 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <UploadCloud className="size-4" /> Upload New Report (New Patient)
        </button>
      </div>

      {/* Tabbed Reports Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 mb-5">
          <button 
            onClick={() => setActiveTab('hospital')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'hospital' ? 'border-[#0891b2] text-[#0891b2]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Hospital Patient Records
          </button>
          <button 
            onClick={() => setActiveTab('lab')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'lab' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FlaskConical className="size-4" /> Received Lab Reports
          </button>
        </div>

        {activeTab === 'hospital' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4 text-center">No of Reports</th>
                <th className="py-3 px-4">Last Upload Date</th>
                <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No patient records found. Upload a new report to get started.</td>
                </tr>
              ) : patients.map((summary) => (
                <tr key={summary.patientId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs text-slate-500">{summary.patientId}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{summary.patientName}</td>
                  <td className="py-4 px-4 text-center text-slate-600 font-semibold">{summary.totalReports}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{summary.lastUploadDate}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleSelectPatient(summary.patientId)}
                        className={`p-1.5 border rounded-md transition-colors inline-flex items-center justify-center shadow-sm ${
                          selectedPatientId === summary.patientId ? "bg-cyan-50 text-[#0891b2] border-[#0891b2]" : "text-[#0891b2] border-[#0891b2]/20 hover:bg-cyan-50"
                        }`}
                        title="View Patient Details & Reports"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setUploadingPatientId(summary.patientId);
                          setIsExistingUploadModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 justify-center shadow-sm text-xs font-semibold"
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
        )}

        {activeTab === 'lab' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Test Name</th>
                <th className="py-3 px-4">Laboratory</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingLabReports ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">Loading lab reports...</td>
                </tr>
              ) : labReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No lab reports received yet.</td>
                </tr>
              ) : labReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs text-slate-500">{report.patientId}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {report.patientName}
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">{report.patientPhone}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{report.testName}</td>
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      {report.labName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{report.date}</td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => window.open(report.fileUrl.startsWith('http') ? report.fileUrl : `/uploads/${report.fileUrl}`, '_blank')}
                      className="p-2 border border-[#0891b2]/20 text-[#0891b2] hover:bg-cyan-50 rounded-lg inline-flex items-center justify-center transition-colors shadow-sm"
                      title="View Report PDF"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Patient Details & Reports Section */}
      {selectedPatientId && isLoadingPatientDetails && (
        <div id="patient-details-reports" className="mb-8 flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <span className="size-5 animate-spin rounded-full border-2 border-cyan-100 border-t-[#0891b2]" />
            Loading patient details and reports...
          </div>
        </div>
      )}
      {selectedPatientId && patientDetails && (
        <div id="patient-details-reports" className="scroll-mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Patient Profile & Records</h2>
          
          {/* Patient Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-14 shrink-0 rounded-full bg-cyan-50 flex items-center justify-center text-[#0891b2] border border-cyan-100">
                <User className="size-7" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">{patientDetails.profile.name}</p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">ID: {patientDetails.profile.id}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 md:gap-12">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Mobile</p>
                <p className="font-semibold text-slate-900">{patientDetails.profile.mobile}</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Gender</p>
                <p className="font-semibold text-slate-900">{patientDetails.profile.ageGender}</p>
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Last Record</p>
                <p className="font-semibold text-slate-900">{patientDetails.profile.lastVisit}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column (Previous Reports) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[#0891b2] font-semibold">Patient's Reports ({patientDetails.reports.length})</h2>
                  <button 
                    onClick={() => {
                      setUploadingPatientId(selectedPatientId);
                      setIsExistingUploadModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-cyan-50 text-[#0891b2] rounded-md hover:bg-cyan-100 flex items-center gap-2"
                  >
                    <UploadCloud className="size-3.5" /> Upload Report
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="py-3 px-4 rounded-tl-lg">Document</th>
                        <th className="py-3 px-4">Upload Date</th>
                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patientDetails.reports.map((report: any) => (
                        <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                {getIconForType(report.type)}
                              </div>
                              <div>
                                <span className="font-medium text-slate-900 block">{report.docName}</span>
                                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md border border-slate-200 text-slate-500 bg-white">
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">{report.uploadDate}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1.5 text-emerald-600 border border-emerald-600/20 rounded-md hover:bg-white transition-colors inline-flex items-center justify-center shadow-sm" title="Download"><Download className="size-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {patientDetails.reports.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-slate-500">No reports found for this patient.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (Patient Stats) */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                <h2 className="text-[#0891b2] font-semibold mb-6">Patient Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-cyan-100/50 flex items-center justify-center text-[#0891b2]">
                       <Folder className="size-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium mb-0.5">Total Reports</p>
                       <p className="text-xl font-bold text-slate-800">{patientDetails.profile.totalReports}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="size-12 rounded-lg bg-white flex items-center justify-center text-emerald-600">
                       <Calendar className="size-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium mb-0.5">Last Record</p>
                       <p className="text-lg font-bold text-slate-800">{patientDetails.profile.lastVisit}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Upload Modal */}
      {isNewUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">Upload New Report & Register Patient</h2>
              <button onClick={() => setIsNewUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleUploadNewReport} className="p-6">
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-[#0891b2] border-b pb-2">Patient Details</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID <span className="text-slate-400 text-xs font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={patientExistingId}
                    onChange={e => setPatientExistingId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Patient ID daalo (agar pata ho)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={newPatientData.name} onChange={e => setNewPatientData({...newPatientData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                    <input type="text" value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select value={newPatientData.gender} onChange={e => setNewPatientData({...newPatientData, gender: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#0891b2] border-b pb-2 pt-4">Report Details</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Report Category</label>
                  <select value={reportUploadType} onChange={e => setReportUploadType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                    <option>Blood Test</option>
                    <option>Prescription</option>
                    <option>X-Ray / MRI</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Document Title *</label>
                  <input type="text" value={docName} onChange={e => setDocName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Complete Blood Count" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File Attachment <span className="text-slate-400 text-xs">(optional — PDF, Image, Doc)</span></label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-400 cursor-pointer transition-all group">
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <Paperclip className="size-5 text-slate-400 group-hover:text-cyan-500 mb-1 transition-colors" />
                    {selectedFile ? (
                      <p className="text-xs text-cyan-600 font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Click to attach file</p>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setIsNewUploadModalOpen(false); setSelectedFile(null); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-5 py-2 bg-[#0891b2] text-white rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-60">{isUploading ? "Uploading..." : "Upload & Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Patient Upload Modal */}
      {isExistingUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">Upload Report for Patient</h2>
              <button onClick={() => setIsExistingUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleUploadExistingReport} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Report Category</label>
                  <select value={reportUploadType} onChange={e => setReportUploadType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                    <option>Blood Test</option>
                    <option>Prescription</option>
                    <option>X-Ray / MRI</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Document Title *</label>
                  <input type="text" value={docName} onChange={e => setDocName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Chest X-Ray Results" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">File Attachment <span className="text-slate-400 text-xs">(optional — PDF, Image, Doc)</span></label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-400 cursor-pointer transition-all group">
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <Paperclip className="size-5 text-slate-400 group-hover:text-cyan-500 mb-1 transition-colors" />
                    {selectedFile ? (
                      <p className="text-xs text-cyan-600 font-medium">{selectedFile.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Click to attach file</p>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setIsExistingUploadModalOpen(false); setSelectedFile(null); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-60">{isUploading ? "Uploading..." : "Upload Report"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
