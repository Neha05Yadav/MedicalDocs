"use client";

const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ImageIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>;

const Building = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const Flask = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>;

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RecordsAndReportsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCard, setActiveCard] = useState<string>("All Providers");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReportDetails, setSelectedReportDetails] = useState<any | null>(null);

  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("Blood Test");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      const res = await fetch("/api/patient/records", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecords((data.myUploads || []).filter((record: any) => record.type?.toUpperCase() !== "PRESCRIPTION"));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("reportName", uploadName || selectedFile.name);
      formData.append("reportType", uploadType);

      const res = await fetch("/api/patient/records/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      toast.success("Report uploaded successfully!");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadName("");
      fetchRecords();
    } catch (e) {
      toast.error("Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
    </div>;
  }

  const patientUploads = records.filter((record) => record.hospitalName === "Uploaded by Patient");
  const providerReports = records.filter((record) => record.hospitalName !== "Uploaded by Patient");
  const visibleReports = activeCard === "My Uploads"
    ? patientUploads
    : providerReports.filter((record) => {
        if (activeCard === "All Providers") return true;
        const facilityType = record.hospitalType?.toUpperCase();
        if (activeCard === "Laboratory") return facilityType === "LAB" || facilityType === "LABORATORY";
        return facilityType === activeCard.toUpperCase();
      });

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
      {/* Provider reports and patient uploads */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-1 mb-8 shadow-sm">
        <div className="p-5 2xl:p-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.8fr)]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <button
                onClick={() => setActiveCard("All Providers")}
                className="mb-4 flex w-full items-center justify-between text-left"
              >
                <span>
                  <span className="block text-lg font-extrabold text-slate-900">Hospital, Clinic & Lab Reports</span>
                  <span className="mt-1 block text-sm font-medium text-slate-500">Reports shared by your connected healthcare providers</span>
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow-sm">{providerReports.length}</span>
              </button>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button 
              onClick={() => setActiveCard('Hospital')}
              className={`flex items-center p-5 rounded-2xl border text-left transition-all ${activeCard === 'Hospital' ? 'border-emerald-500 shadow-md bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-300 hover:shadow-sm bg-white'}`}
            >
              <div className={`p-3 rounded-xl mr-4 ${activeCard === 'Hospital' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                <Building className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hospitals</h3>
                <p className="text-sm text-slate-500 font-medium">{records.filter(r => r.hospitalType?.toUpperCase() === 'HOSPITAL').length} Reports</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveCard('Clinic')}
              className={`flex items-center p-5 rounded-2xl border text-left transition-all ${activeCard === 'Clinic' ? 'border-blue-500 shadow-md bg-blue-50/20' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white'}`}
            >
              <div className={`p-3 rounded-xl mr-4 ${activeCard === 'Clinic' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                <Stethoscope className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Clinics</h3>
                <p className="text-sm text-slate-500 font-medium">{records.filter(r => r.hospitalType?.toUpperCase() === 'CLINIC').length} Reports</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveCard('Laboratory')}
              className={`flex items-center p-5 rounded-2xl border text-left transition-all ${activeCard === 'Laboratory' ? 'border-purple-500 shadow-md bg-purple-50/20' : 'border-slate-200 hover:border-purple-300 hover:shadow-sm bg-white'}`}
            >
              <div className={`p-3 rounded-xl mr-4 ${activeCard === 'Laboratory' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600'}`}>
                <Flask className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Laboratories</h3>
                <p className="text-sm text-slate-500 font-medium">{records.filter(r => r.hospitalType?.toUpperCase() === 'LAB' || r.hospitalType?.toUpperCase() === 'LABORATORY').length} Reports</p>
              </div>
            </button>
              </div>
            </div>

            <button
              onClick={() => setActiveCard("My Uploads")}
              className={`group flex min-h-full flex-col justify-between rounded-2xl border p-6 text-left transition-all ${activeCard === "My Uploads" ? "border-cyan-500 bg-cyan-50/70 shadow-md" : "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-400 hover:shadow-md"}`}
            >
              <span>
                <span className="mb-5 flex items-center justify-between">
                  <span className={`rounded-2xl p-4 ${activeCard === "My Uploads" ? "bg-cyan-600 text-white" : "bg-white text-cyan-600 shadow-sm"}`}>
                    <User className="size-8" />
                  </span>
                  <span className="text-3xl font-black text-slate-900">{patientUploads.length}</span>
                </span>
                <span className="block text-xl font-extrabold text-slate-900">My Uploads</span>
                <span className="mt-1 block text-sm font-medium leading-6 text-slate-500">Reports uploaded personally from your device.</span>
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsUploadModalOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsUploadModalOpen(true);
                  }
                }}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#12224d] px-5 py-3.5 text-base font-bold text-white shadow-sm transition-colors group-hover:bg-cyan-900"
              >
                <Upload className="size-5" /> Upload Report
              </span>
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_38px_-30px_rgba(15,23,42,.45)] animate-in fade-in slide-in-from-top-4 duration-300">
              {visibleReports.length === 0 ? (
                 <div className="bg-slate-50 px-6 py-12 text-center text-slate-500">
                   {activeCard === "My Uploads" ? "No personal uploads found. Use 'Upload Report' to add one." : "No reports found for this category."}
                 </div>
              ) : (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-black uppercase tracking-[.09em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Document</th>
                      <th className="px-6 py-4">Report Type</th>
                      {activeCard !== "My Uploads" && <th className="px-6 py-4">Source Facility</th>}
                      <th className="px-6 py-4">Uploaded On</th>
                      <th className="px-6 py-4">File Size</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleReports.map((file) => (
                      <tr key={file.id} className="group bg-white transition-colors hover:bg-cyan-50/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            {file.fileType === 'pdf' ? (
                              <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600"><FileText className="size-5" /></div>
                            ) : (
                              <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600"><ImageIcon className="size-5" /></div>
                            )}
                            <div className="min-w-0"><p className="truncate font-bold text-slate-900">{file.fileName}</p><p className="mt-0.5 text-xs font-medium text-slate-400">Medical document</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-extrabold ${file.typeColor}`}>
                            {String(file.type || "Report").replaceAll("_", " ")}
                          </span>
                        </td>
                        {activeCard !== "My Uploads" && <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{file.hospitalName}</span>
                            <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <User className="size-3.5" /> Doctor assigned
                            </span>
                          </div>
                        </td>}
                        <td className="px-6 py-4 font-semibold text-slate-600">{file.uploadDate}</td>
                        <td className="px-6 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">{file.size}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => setSelectedReportDetails(file)}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-3.5 py-2 text-xs font-bold text-cyan-700 shadow-sm transition hover:border-cyan-600 hover:bg-cyan-600 hover:text-white"
                              aria-label={`View ${file.fileName}`}
                            >
                              <Eye className="size-4" /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <UploadCloud className="size-5 text-[#0891b2]" />
                Upload Health Report
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                disabled={uploading}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Name</label>
                <input 
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Blood Test Report"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Type</label>
                <select 
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all cursor-pointer">
                  <option>Blood Test</option>
                  <option>LAB_REPORT</option>
                  <option>X-Ray</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Upload File</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#0891b2] hover:bg-cyan-50/30 transition-colors relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  {!selectedFile ? (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3">
                        <UploadCloud className="size-5 text-[#0891b2]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Tap to upload file</p>
                      <p className="text-[11px] text-slate-500">PDF, JPG, PNG</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none z-10">
                      <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3 relative">
                        <FileText className="size-5 text-[#0891b2]" />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-white">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="px-6 py-2 bg-[#0891b2] hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                {uploading ? <div className="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full"></div> : <UploadCloud className="size-4" />} 
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT VIEWER MODAL */}
      {selectedReportDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {String(selectedReportDetails.type || "").toUpperCase() === "LAB_REPORT" && (
                <a
                  href={`/api/care/documents/LAB_REPORT/${encodeURIComponent(selectedReportDetails.id)}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-cyan-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Verified PDF
                </a>
              )}
              {selectedReportDetails.fileUrl && (
                <a 
                  href={selectedReportDetails.fileUrl.startsWith('http') ? selectedReportDetails.fileUrl : `/uploads/${selectedReportDetails.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                  title="Open Full Screen"
                >
                  <UploadCloud className="size-5" />
                </a>
              )}
              <button 
                onClick={() => setSelectedReportDetails(null)}
                className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                title="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto flex items-center justify-center min-h-[50vh] p-4">
              {selectedReportDetails.fileUrl ? (
                selectedReportDetails.fileType === 'pdf' ? (
                  <iframe 
                    src={selectedReportDetails.fileUrl.startsWith('http') ? selectedReportDetails.fileUrl : `/uploads/${selectedReportDetails.fileUrl}`} 
                    className="w-full h-[80vh] rounded-lg bg-white"
                    title={selectedReportDetails.fileName}
                  />
                ) : (
                  <img 
                    src={selectedReportDetails.fileUrl.startsWith('http') ? selectedReportDetails.fileUrl : `/uploads/${selectedReportDetails.fileUrl}`} 
                    alt={selectedReportDetails.fileName}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg bg-white"
                  />
                )
              ) : <div className="rounded-2xl border border-white/15 bg-white/5 px-8 py-10 text-center text-slate-300">No file is attached to this database record.</div>}
            </div>
            
            <div className="p-4 bg-black/50 backdrop-blur-md text-white text-center absolute bottom-0 left-0 right-0">
              <p className="font-semibold">{selectedReportDetails.fileName}</p>
              <p className="text-xs text-slate-300">{selectedReportDetails.uploadDate} • {selectedReportDetails.type} • Uploaded By: {selectedReportDetails.hospitalName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
