"use client";
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;





import { useState } from "react";
import { toast } from "sonner";
export default function UploadReportClient() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  return (
    <>
      <button 
        onClick={() => setIsUploadModalOpen(true)}
        className="mt-4 w-full py-3 border border-dashed border-slate-300 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="size-4" />
        Upload New Report
      </button>
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
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Type</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all cursor-pointer">
                  <option>Lab Report (Blood, Urine, etc.)</option>
                  <option>Imaging (X-Ray, MRI, CT)</option>
                  <option>Prescription</option>
                  <option>Medical Certificate</option>
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
                  />
                  {!selectedFile ? (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3">
                        <UploadCloud className="size-5 text-[#0891b2]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Tap to upload file</p>
                      <p className="text-[11px] text-slate-500">PDF, JPG, PNG (Max 5MB)</p>
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
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!selectedFile) {
                    toast.error("Please select a file to upload");
                    return;
                  }
                  try {
                    const formData = new FormData();
                    formData.append("file", selectedFile);
                    formData.append("reportName", selectedFile.name);
                    formData.append("reportType", "DOCUMENT");
                    const res = await fetch("/api/patient/records/upload", {
                      method: "POST",
                      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                      body: formData
                    });
                    if (!res.ok) throw new Error("Upload failed");
                    toast.success("Report uploaded successfully!");
                    setIsUploadModalOpen(false);
                    // Reload window to see the new upload in records
                    setTimeout(() => window.location.reload(), 1000);
                  } catch (e) {
                    toast.error("Error uploading report");
                  }
                }}
                className="px-6 py-2 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <UploadCloud className="size-4" /> Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
