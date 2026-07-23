"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Building = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M8 15v1a6 6 0 0 0 12 0v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const Flask = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96"/></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m5-7-5-5-5 5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>;

export default function PrescriptionsClient() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDoctor, setUploadDoctor] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [selectedPrescriptionDetails, setSelectedPrescriptionDetails] = useState<any | null>(null);
  const [activeSource, setActiveSource] = useState("All Providers");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      const res = await fetch("/api/patient/prescriptions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      const data = await res.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a prescription image.");
      return;
    }
    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("doctor", uploadDoctor.trim());
      formData.append("date", uploadDate);
      formData.append("file", uploadFile);
      const res = await fetch("/api/patient/prescriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(Array.isArray(payload.message) ? payload.message[0] : payload.message || "Failed to add prescription");
      
      toast.success("Prescription added successfully!");
      setShowUpload(false);
      setUploadDoctor("");
      setUploadDate("");
      setUploadFile(null);
      setUploadPreview("");
      await fetchPrescriptions();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save prescription");
    } finally {
      setIsPending(false);
    }
  };

  const handlePrescriptionImage = (file?: File) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Prescription image must be smaller than 8 MB.");
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = () => setUploadPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12.9 4.2C12.5 3.4 11.5 3.4 11.1 4.2L2.3 19.8c-.4.8.1 1.8 1 1.8h17.4c.9 0 1.4-1 1-1.8L12.9 4.2z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Could not load prescriptions</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-xs">Please make sure the server is running and try again.</p>
        <button
          onClick={fetchPrescriptions}
          className="px-5 py-2 bg-[#0891b2] text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const facilityType = (prescription: any) => String(prescription.hospitalType || "").toUpperCase();
  const selfPrescriptions = prescriptions.filter((prescription) => !prescription.hospitalType);
  const providerPrescriptions = prescriptions.filter((prescription) => Boolean(prescription.hospitalType));
  const visiblePrescriptions = prescriptions.filter((prescription) => {
    const type = facilityType(prescription);
    const matchesSource = activeSource === "Self"
      ? !prescription.hospitalType
      : activeSource === "All Providers"
        ? Boolean(prescription.hospitalType)
        : activeSource === "Laboratory"
          ? type === "LAB" || type === "LABORATORY"
          : type === activeSource.toUpperCase();
    const searchableText = [prescription.id, prescription.doctor, prescription.hospitalName, prescription.medicine]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesSource && searchableText.includes(searchQuery.trim().toLowerCase());
  });

  return (
    <>
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
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
                <p className="text-sm font-semibold text-cyan-900">Prescription ID will be generated automatically</p>
                <p className="mt-1 text-xs font-medium text-cyan-700">Format: RX followed by a unique 5-digit number.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor Name *</label>
                <input
                  type="text"
                  value={uploadDoctor}
                  onChange={(e) => setUploadDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Prescription Image *</label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => handlePrescriptionImage(event.target.files?.[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                    {uploadFile ? "Change Prescription Image" : "Upload Prescription Image"}
                  </label>
                </div>
                {uploadFile && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
                    {uploadPreview && <img src={uploadPreview} alt="Selected prescription" className="size-14 rounded-lg border border-cyan-100 bg-white object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{uploadFile.name}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p>
                    </div>
                    <button type="button" onClick={() => { setUploadFile(null); setUploadPreview(""); }} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-500" aria-label="Remove selected image">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !uploadFile}
                  className="px-6 py-2.5 bg-[#0891b2] text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <section className="mb-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm 2xl:p-8">
        <div className="mb-7">
          <h2 className="text-[clamp(1.6rem,1.5vw,2rem)] font-extrabold tracking-tight text-slate-900">Prescriptions</h2>
          <p className="mt-1 text-[clamp(1rem,.9vw,1.2rem)] text-slate-500">Prescriptions from connected facilities and documents added by you.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <button onClick={() => setActiveSource("All Providers")} className="mb-4 flex w-full items-center justify-between text-left">
              <span>
                <span className="block text-lg font-extrabold text-slate-900">Hospital, Clinic & Lab Prescriptions</span>
                <span className="mt-1 block text-sm font-medium text-slate-500">Prescriptions issued by your healthcare providers</span>
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-extrabold text-slate-700 shadow-sm">{providerPrescriptions.length}</span>
            </button>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <button onClick={() => setActiveSource("Hospital")} className={`flex items-center rounded-2xl border p-5 text-left transition-all ${activeSource === "Hospital" ? "border-emerald-500 bg-emerald-50/40 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"}`}>
                <span className={`mr-4 rounded-xl p-3 ${activeSource === "Hospital" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}><Building className="size-8" /></span>
                <span><span className="block text-lg font-bold text-slate-900">Hospitals</span><span className="text-sm font-medium text-slate-500">{prescriptions.filter((p) => facilityType(p) === "HOSPITAL").length} Prescriptions</span></span>
              </button>

              <button onClick={() => setActiveSource("Clinic")} className={`flex items-center rounded-2xl border p-5 text-left transition-all ${activeSource === "Clinic" ? "border-blue-500 bg-blue-50/40 shadow-md" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}>
                <span className={`mr-4 rounded-xl p-3 ${activeSource === "Clinic" ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600"}`}><Stethoscope className="size-8" /></span>
                <span><span className="block text-lg font-bold text-slate-900">Clinics</span><span className="text-sm font-medium text-slate-500">{prescriptions.filter((p) => facilityType(p) === "CLINIC").length} Prescriptions</span></span>
              </button>

              <button onClick={() => setActiveSource("Laboratory")} className={`flex items-center rounded-2xl border p-5 text-left transition-all ${activeSource === "Laboratory" ? "border-purple-500 bg-purple-50/40 shadow-md" : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm"}`}>
                <span className={`mr-4 rounded-xl p-3 ${activeSource === "Laboratory" ? "bg-purple-500 text-white" : "bg-purple-50 text-purple-600"}`}><Flask className="size-8" /></span>
                <span><span className="block text-lg font-bold text-slate-900">Laboratories</span><span className="text-sm font-medium text-slate-500">{prescriptions.filter((p) => ["LAB", "LABORATORY"].includes(facilityType(p))).length} Prescriptions</span></span>
              </button>
            </div>
          </div>

          <div className={`flex min-h-full flex-col justify-between rounded-2xl border p-6 transition-all ${activeSource === "Self" ? "border-cyan-500 bg-cyan-50/70 shadow-md" : "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white"}`}>
            <button onClick={() => setActiveSource("Self")} className="w-full text-left">
              <span className="mb-5 flex items-center justify-between">
                <span className={`rounded-2xl p-4 ${activeSource === "Self" ? "bg-cyan-600 text-white" : "bg-white text-cyan-600 shadow-sm"}`}><User className="size-8" /></span>
                <span className="text-3xl font-black text-slate-900">{selfPrescriptions.length}</span>
              </span>
              <span className="block text-xl font-extrabold text-slate-900">My Prescriptions</span>
              <span className="mt-1 block text-sm font-medium leading-6 text-slate-500">Prescriptions uploaded personally by you.</span>
            </button>
            <button onClick={() => setShowUpload(true)} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#12224d] px-5 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-cyan-900">
              <Upload className="size-5" /> Add Prescription
            </button>
          </div>
        </div>
      </section>

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="relative w-full md:w-[32rem]">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} type="text" placeholder="Search prescriptions by ID, doctor or facility..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base shadow-sm focus:border-[#0891b2] focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20" />
        </div>
        <p className="hidden text-sm font-bold text-slate-500 md:block">Showing {visiblePrescriptions.length} prescription{visiblePrescriptions.length === 1 ? "" : "s"}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Prescription ID</th>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visiblePrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="size-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="size-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">No prescriptions found</p>
                      <p className="text-xs text-slate-400 mb-4">Select another source or add your prescription.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                visiblePrescriptions.map((prescription, index) => (
                <tr key={`${prescription.id}-${index}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0891b2] flex items-center gap-2">
                    <div className="size-8 bg-cyan-50 text-[#0891b2] rounded-lg flex items-center justify-center border border-cyan-100/50">
                       <FileText className="size-4" />
                    </div>
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {prescription.doctor}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{prescription.hospitalName || "Uploaded by You"}</span>
                    <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-slate-400">{prescription.hospitalType || "Self"}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {prescription.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setSelectedPrescriptionDetails(prescription)}
                        className="p-1.5 text-[#0891b2] border border-[#0891b2]/20 rounded-md hover:bg-cyan-50 transition-colors inline-flex items-center justify-center"
                        title="View Prescription"
                      >
                        <Eye className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
      {/* PRESCRIPTION DETAILS MODAL */}
      {selectedPrescriptionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="size-5 text-[#0891b2]" />
                Prescription Details
              </h3>
              <button 
                onClick={() => setSelectedPrescriptionDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prescription ID</p>
                  <p className="text-sm font-semibold text-[#0891b2]">{selectedPrescriptionDetails.id}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedPrescriptionDetails.date}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Name</p>
                <p className="text-base font-semibold text-slate-900">{selectedPrescriptionDetails.doctor}</p>
              </div>

              {(selectedPrescriptionDetails.medicine || selectedPrescriptionDetails.dosage || selectedPrescriptionDetails.duration) && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  {selectedPrescriptionDetails.medicine && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Medicine / Diagnosis</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedPrescriptionDetails.medicine}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPrescriptionDetails.dosage && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dosage</p>
                        <p className="text-sm font-medium text-slate-800">{selectedPrescriptionDetails.dosage}</p>
                      </div>
                    )}
                    {selectedPrescriptionDetails.duration && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-sm font-medium text-slate-800">{selectedPrescriptionDetails.duration}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedPrescriptionDetails.fileUrl && (
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Prescription Image</p>
                  <a href={String(selectedPrescriptionDetails.fileUrl).startsWith('/') ? selectedPrescriptionDetails.fileUrl : `/uploads/${selectedPrescriptionDetails.fileUrl}`} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img src={String(selectedPrescriptionDetails.fileUrl).startsWith('/') ? selectedPrescriptionDetails.fileUrl : `/uploads/${selectedPrescriptionDetails.fileUrl}`} alt={`Prescription ${selectedPrescriptionDetails.id}`} className="max-h-64 w-full object-contain" />
                  </a>
                  <p className="mt-2 text-xs font-medium text-cyan-700">Click the image to open full size.</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  selectedPrescriptionDetails.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {selectedPrescriptionDetails.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={() => setSelectedPrescriptionDetails(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
