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
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m5-7-5-5-5 5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Pill = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10.5 20.5 10-10a4.95 4.95 0 0 0-7-7l-10 10a4.95 4.95 0 0 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>;

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
  const [requestNote, setRequestNote] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [selectedPharmacyIds, setSelectedPharmacyIds] = useState<string[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([]);
  const [pharmacyRequestId, setPharmacyRequestId] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [activeSource, setActiveSource] = useState("All Providers");
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmacyQuotations, setPharmacyQuotations] = useState<any[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<any[]>([]);
  const [confirmingQuotation, setConfirmingQuotation] = useState("");

  useEffect(() => {
    fetchPrescriptions();
    fetchPharmacyCommerce();
  }, []);

  const fetchPharmacyCommerce = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const [quotationResponse, orderResponse] = await Promise.all([
      fetch("/api/patient/pharmacy-quotations", { headers }),
      fetch("/api/patient/pharmacy-orders", { headers }),
    ]);
    if (quotationResponse.ok) setPharmacyQuotations(await quotationResponse.json());
    if (orderResponse.ok) setPharmacyOrders(await orderResponse.json());
  };

  const confirmQuotation = async (id: string) => {
    setConfirmingQuotation(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/patient/pharmacy-quotations/${encodeURIComponent(id)}/confirm`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Quotation could not be confirmed.");
      toast.success(`Order ${data.orderId} confirmed successfully.`);
      await fetchPharmacyCommerce();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Quotation could not be confirmed.");
    } finally {
      setConfirmingQuotation("");
    }
  };

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

  const searchNearbyPharmacies = async (location = deliveryLocation) => {
    if (!location.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/patient/pharmacies?location=${encodeURIComponent(location)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data?.message || "Could not find pharmacies.");
      const pharmacies = Array.isArray(data) ? data : [];
      setNearbyPharmacies(pharmacies);
      setSelectedPharmacyIds(pharmacies.filter((pharmacy) => pharmacy.openStatus === "Open").map((pharmacy) => pharmacy.id));
      setLocationConfirmed(true);
      if (!pharmacies.length) toast.info("No registered pharmacy serves this location yet.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not find pharmacies.");
    }
  };

  const sendPrescriptionRequest = async () => {
    setSendingRequest(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/patient/prescription-pharmacy-requests", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptionReference: selectedPrescriptionDetails.rawId || selectedPrescriptionDetails.id, pharmacyIds: selectedPharmacyIds, deliveryAddress: deliveryLocation, requestNote }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Request could not be sent.");
      setPharmacyRequestId(data.requestGroupId);
      setRequestSent(true);
      toast.success(`Prescription request sent to ${data.recipients} pharmacies.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request could not be sent.");
    } finally {
      setSendingRequest(false);
    }
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
  const visiblePrescriptions = prescriptions.filter((prescription) => {
    const type = facilityType(prescription);
    const matchesSource = activeSource === "Self"
      ? !prescription.hospitalType
      : activeSource === "All Providers"
        ? ["HOSPITAL", "CLINIC"].includes(type)
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
            <button onClick={() => setActiveSource("All Providers")} className="mb-4 flex w-full items-center text-left">
              <span>
                <span className="block text-lg font-extrabold text-slate-900">Hospital & Clinic Prescriptions</span>
                <span className="mt-1 block text-sm font-medium text-slate-500">Prescriptions issued by your healthcare providers</span>
              </span>
            </button>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button onClick={() => setActiveSource("Hospital")} className={`flex items-center rounded-2xl border p-5 text-left transition-all ${activeSource === "Hospital" ? "border-emerald-500 bg-emerald-50/40 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"}`}>
                <span className={`mr-4 rounded-xl p-3 ${activeSource === "Hospital" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}><Building className="size-8" /></span>
                <span><span className="block text-lg font-bold text-slate-900">Hospitals</span><span className="text-sm font-medium text-slate-500">{prescriptions.filter((p) => facilityType(p) === "HOSPITAL").length} Prescriptions</span></span>
              </button>

              <button onClick={() => setActiveSource("Clinic")} className={`flex items-center rounded-2xl border p-5 text-left transition-all ${activeSource === "Clinic" ? "border-blue-500 bg-blue-50/40 shadow-md" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"}`}>
                <span className={`mr-4 rounded-xl p-3 ${activeSource === "Clinic" ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600"}`}><Stethoscope className="size-8" /></span>
                <span><span className="block text-lg font-bold text-slate-900">Clinics</span><span className="text-sm font-medium text-slate-500">{prescriptions.filter((p) => facilityType(p) === "CLINIC").length} Prescriptions</span></span>
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
                        onClick={() => { setSelectedPrescriptionDetails(prescription); setRequestNote(""); setRequestSent(false); setPharmacyRequestId(""); setDeliveryLocation(""); setLocationConfirmed(false); setNearbyPharmacies([]); setSelectedPharmacyIds([]); }}
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
      {(pharmacyQuotations.length > 0 || pharmacyOrders.length > 0) && <section className="mt-7 space-y-5">
        {pharmacyQuotations.length > 0 && <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5"><h2 className="text-xl font-extrabold text-slate-900">Pharmacy Quotations</h2><p className="mt-1 text-sm text-slate-500">Compare prices and confirm one pharmacy. Other quotations will close automatically.</p></div>
          <div className="grid gap-4 lg:grid-cols-2">{pharmacyQuotations.map((quotation) => <article key={quotation.id} className="rounded-2xl border border-slate-200 p-5 transition hover:border-cyan-300 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="font-extrabold text-slate-900">{quotation.pharmacyName}</p><p className="mt-1 text-xs font-bold text-cyan-700">{quotation.pharmacyId} · {quotation.id}</p></div><p className="text-xl font-black text-slate-900">₹{Number(quotation.totalAmount).toLocaleString("en-IN")}</p></div><p className="mt-4 text-sm text-slate-500">Prescription: <b className="text-slate-700">{quotation.prescriptionReference}</b></p><div className="mt-4 flex items-center justify-between"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{quotation.status === "SENT" ? "Awaiting confirmation" : quotation.status}</span>{quotation.status === "SENT" && <button disabled={confirmingQuotation === quotation.id} onClick={() => confirmQuotation(quotation.id)} className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{confirmingQuotation === quotation.id ? "Confirming..." : "Select & Confirm"}</button>}</div></article>)}</div>
        </div>}
        {pharmacyOrders.length > 0 && <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-extrabold text-slate-900">Medicine Orders</h2><div className="mt-4 space-y-3">{pharmacyOrders.map((order) => <div key={order.id} className="flex flex-col justify-between gap-3 rounded-xl bg-emerald-50/60 p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-slate-900">{order.pharmacyName}</p><p className="text-xs text-slate-500">{order.id}</p></div><div className="text-sm"><b className="text-emerald-700">{String(order.status).replaceAll("_", " ")}</b><span className="ml-4 font-black text-slate-900">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span></div></div>)}</div></div>}
      </section>}
      {/* SEND PRESCRIPTION TO PHARMACY MODAL */}
      {selectedPrescriptionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-white px-6 py-5 sm:px-8">
              <h3 className="flex items-center gap-3 text-lg font-extrabold text-slate-900 sm:text-xl">
                <span className="grid size-10 place-items-center rounded-xl bg-cyan-600 text-white shadow-sm"><Pill className="size-5" /></span>
                Send Prescription to Pharmacy
              </h3>
              <button 
                onClick={() => setSelectedPrescriptionDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              {requestSent ? (
                <div className="mx-auto flex max-w-lg flex-col items-center py-8 text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50"><Check className="size-10" /></span>
                  <h4 className="mt-7 text-2xl font-extrabold text-slate-900">Prescription request sent successfully.</h4>
                  <p className="mt-2 text-sm text-slate-500">The pharmacy will review availability and respond shortly.</p>
                  <div className="mt-7 w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-left">
                    <InfoRow label="Request ID" value={pharmacyRequestId} />
                    <InfoRow label="Pharmacies" value={nearbyPharmacies.filter((pharmacy) => selectedPharmacyIds.includes(pharmacy.id)).map((pharmacy) => pharmacy.name).join(", ") || "Selected Pharmacies"} />
                    <InfoRow label="Status" value="Pending Acceptance" accent />
                    <InfoRow label="Estimated Response Time" value="10–15 minutes" />
                  </div>
                  <button onClick={() => setSelectedPrescriptionDetails(null)} className="mt-7 rounded-xl bg-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800">Done</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <section>
                    <SectionTitle>Delivery Location</SectionTitle>
                    <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="relative flex-1">
                          <MapPin className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyan-600" />
                          <input value={deliveryLocation} onChange={(event) => { setDeliveryLocation(event.target.value); setLocationConfirmed(false); setSelectedPharmacyIds([]); }} placeholder="Enter area, landmark or delivery address" className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
                        </label>
                        <button type="button" onClick={() => searchNearbyPharmacies()} disabled={!deliveryLocation.trim()} className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40">Search</button>
                      </div>
                      <button type="button" onClick={() => { const location="Current location · Sector 62, Noida"; setDeliveryLocation(location); searchNearbyPharmacies(location); }} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-900"><MapPin className="size-4" /> Use my current location</button>
                    </div>
                  </section>
                  {locationConfirmed && <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-3 flex items-end justify-between gap-4"><div><SectionTitle>Nearby Pharmacies</SectionTitle><p className="-mt-2 text-xs font-semibold text-cyan-700">Request will be sent automatically to every available pharmacy.</p></div><span className="mb-3 text-xs font-semibold text-slate-400">{selectedPharmacyIds.length} available · {nearbyPharmacies.length} found</span></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {nearbyPharmacies.map((pharmacy) => {
                        const closed = pharmacy.openStatus === "Closed";
                        return <article key={pharmacy.id} className={`relative rounded-2xl border p-4 text-left ${closed ? "border-slate-200 bg-slate-50 opacity-60" : "border-cyan-200 bg-cyan-50/50 shadow-sm"}`}>
                          {!closed && <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">Included</span>}
                          <div className="pr-20"><p className="font-extrabold text-slate-900">{pharmacy.name}</p><p className="mt-1 text-xs font-bold text-cyan-700">{pharmacy.id}</p></div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{pharmacy.distance}</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">★ {pharmacy.rating}</span><span className={`rounded-full px-2.5 py-1 ${closed ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"}`}>{pharmacy.openStatus}</span></div>
                          <p className="mt-3 flex gap-2 text-xs font-medium leading-5 text-slate-500"><MapPin className="mt-0.5 size-3.5 shrink-0" />{pharmacy.address}</p>
                        </article>;
                      })}
                    </div>
                  </section>}
                  {selectedPharmacyIds.length > 0 && <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <SectionTitle>Prescription Summary</SectionTitle>
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-4">
                      <SummaryItem label="Prescription ID" value={selectedPrescriptionDetails.id} />
                      <SummaryItem label="Doctor Name" value={selectedPrescriptionDetails.doctor || "Not recorded"} />
                      <SummaryItem label="Total Medicines" value={selectedPrescriptionDetails.medicine ? "1" : "0"} />
                      <SummaryItem label="Prescription Date" value={selectedPrescriptionDetails.date || "Not recorded"} />
                      <SummaryItem label="Pharmacy ID" value={selectedPharmacyIds.join(", ")} />
                    </div>
                  </section>}
                  {selectedPharmacyIds.length > 0 && <section>
                    <SectionTitle>Medicine List</SectionTitle>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="grid grid-cols-[1.5fr_1fr_.7fr_1fr] gap-3 bg-slate-50 px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"><span>Medicine Name</span><span>Dosage</span><span>Quantity</span><span>Duration</span></div>
                      <div className="grid grid-cols-[1.5fr_1fr_.7fr_1fr] gap-3 px-4 py-4 text-sm font-semibold text-slate-800"><span>{selectedPrescriptionDetails.medicine || "Prescription medicine"}</span><span>{selectedPrescriptionDetails.dosage || "As directed"}</span><span>1</span><span>{selectedPrescriptionDetails.duration || "As advised"}</span></div>
                    </div>
                  </section>}
                  {selectedPharmacyIds.length > 0 && <section>
                    <SectionTitle>Request Note <span className="font-medium normal-case tracking-normal text-slate-400">(Optional)</span></SectionTitle>
                    <textarea value={requestNote} onChange={(event) => setRequestNote(event.target.value)} rows={3} placeholder="Add delivery preferences or instructions for the pharmacy..." className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
                  </section>}
                </div>
              )}
            </div>
            {!requestSent && <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <button onClick={() => setSelectedPrescriptionDetails(null)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button>
              <button disabled={!locationConfirmed || selectedPharmacyIds.length === 0 || sendingRequest} onClick={sendPrescriptionRequest} className="rounded-xl bg-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-12px_rgba(8,145,178,.8)] transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40">{sendingRequest ? "Sending Request..." : `Send Request to All ${selectedPharmacyIds.length || 0} Pharmacies`}</button>
            </div>
            }
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-slate-500">{children}</h4>;
}

function SummaryItem({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 break-words text-sm font-bold text-slate-800">{value}</p></div>;
}

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex items-start justify-between gap-5 border-b border-emerald-100 py-3 last:border-0"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`text-right text-sm font-bold ${accent ? "text-amber-600" : "text-slate-900"}`}>{value}</span></div>;
}
