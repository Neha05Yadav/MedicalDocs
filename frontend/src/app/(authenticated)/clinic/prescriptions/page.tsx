"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authHeaders } from "@/lib/auth-fetch";

// SVG Icons
const Pill = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Pencil = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>;
const ImageIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"></path></svg>;

export default function DoctorPrescriptionsPage({ apiBase = "/api/clinic", showLabTest = true, requireDoctor = false }: { apiBase?: string; showLabTest?: boolean; requireDoctor?: boolean } = {}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("view"); // "view" | "upload"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload/Create state
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", duration: "", days: "", instruction: "" }
  ]);
  const [status, setStatus] = useState("Active");
  const [submitting, setSubmitting] = useState(false);
  
  // Lab Test Request State
  const [labs, setLabs] = useState<{id: string, name: string}[]>([]);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [labTestName, setLabTestName] = useState("");
  const [labTestPriority, setLabTestPriority] = useState("Normal");

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);

  useEffect(() => {
    fetchPrescriptions();
    if (showLabTest) fetchLabs();
    if (requireDoctor) fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${apiBase}/doctors`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const available = data.filter((doctor: any) => String(doctor.status || "Active").toLowerCase() === "active");
        setDoctors(available);
        setDoctorId(available[0]?.id || "");
      }
    } catch (error) {
      console.error("Failed to load doctors", error);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await fetch(`${apiBase}/labs`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLabs(data);
        if (data.length > 0) {
          setSelectedLabId(data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load labs", e);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${apiBase}/prescriptions`, { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPrescriptions(data);
      }
    } catch (e) {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireDoctor && !doctorId) {
      toast.error("Please select a hospital doctor.");
      return;
    }
    if (labTestName && !selectedLabId) {
      toast.error("Please select a Destination Laboratory for the lab test.");
      return;
    }
    setSubmitting(true);
    try {
      const isSingle = medicines.length === 1;
      const finalMedicine = medicines.map((m, i) => isSingle ? m.name : `${i+1}. ${m.name}`).join("\n");
      const finalDosage = medicines.map((m, i) => {
        const str = `${m.duration}${m.instruction ? ` (${m.instruction})` : ""}`;
        return isSingle ? str : `${i+1}. ${str}`;
      }).join("\n");
      const finalDuration = medicines.map((m, i) => isSingle ? `${m.days} Days` : `${i+1}. ${m.days} Days`).join("\n");

      const prescriptionPayload = { patientId, doctorId, medicine: finalMedicine, dosage: finalDosage, duration: finalDuration, status };
      const formData = new FormData();
      Object.entries(prescriptionPayload).forEach(([key, value]) => value && formData.append(key, value));
      const res = await fetch(`${apiBase}/prescriptions`, {
        method: "POST",
        headers: requireDoctor ? authHeaders(true) : authHeaders(),
        body: requireDoctor ? JSON.stringify(prescriptionPayload) : formData,
      });
      if (res.ok) {
        toast.success("Prescription Created!");
        setActiveTab("view");
        fetchPrescriptions();
        // Reset form
        setPatientId(""); 
        setMedicines([{ name: "", duration: "", days: "", instruction: "" }]);
        setStatus("Active");
      } else {
        const payload = await res.json().catch(() => null);
        toast.error(payload?.message || "Failed to create prescription");
      }
    } catch (err) {
      toast.error("Error creating prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestLabTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabId) {
      toast.error("Please select a Destination Laboratory.");
      return;
    }
    if (!patientId) {
      toast.error("Please enter Patient ID.");
      return;
    }
    if (!labTestName) {
      toast.error("Please enter a Lab Test Name.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/clinic/test-requests", {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId,
          labTestName,
          priority: labTestPriority,
          labId: selectedLabId
        }),
      });

      if (res.ok) {
        toast.success("Lab Test Requested successfully.");
        setPatientId("");
        setLabTestName("");
        setLabTestPriority("Normal");
      } else {
        const payload = await res.json().catch(() => null);
        toast.error(payload?.message || "Failed to request lab test");
      }
    } catch (err) {
      toast.error("Error requesting lab test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewImage = async (rx: any) => {
    try {
      const response = await fetch(rx.imageUrl, { headers: authHeaders() });
      if (!response.ok) throw new Error("Prescription image could not be loaded.");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to open prescription image.");
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      const res = await fetch(`${apiBase}/prescriptions/${encodeURIComponent(recordId)}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        toast.success("Prescription Deleted");
        fetchPrescriptions();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting prescription");
    }
  };

  const openEditModal = (rx: any) => {
    setSelectedPrescription(rx);
    setIsEditModalOpen(true);
  };

  const handleEditPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription) return;
    try {
      const recordId = selectedPrescription.recordId || selectedPrescription.id;
      const res = await fetch(`${apiBase}/prescriptions/${encodeURIComponent(recordId)}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify({
          medicine: selectedPrescription.medicine,
          dosage: selectedPrescription.dosage,
          duration: selectedPrescription.duration,
          status: selectedPrescription.status,
        }),
      });
      if (res.ok) {
        toast.success("Prescription Updated!");
        setIsEditModalOpen(false);
        fetchPrescriptions();
      } else {
        toast.error("Failed to update prescription");
      }
    } catch (err) {
      toast.error("Error updating prescription");
    }
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = rx.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rx.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rx.medicine?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "Active", "Completed"];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      
      {/* Header Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setActiveTab("view")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === "view" ? "bg-[#0891b2] text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
        >
          View Prescriptions
        </button>
        <button 
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === "upload" ? "bg-[#0891b2] text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
        >
          Create Prescription
        </button>
        {showLabTest && <button 
          onClick={() => setActiveTab("lab_test")}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === "lab_test" ? "bg-[#0891b2] text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
        >
          Suggest Lab Test
        </button>}
      </div>

      {/* VIEW PRESCRIPTIONS SECTION */}
      {activeTab === "view" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or medicine..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="size-4 text-slate-400" />
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        statusFilter === s 
                          ? "bg-[#0891b2] text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading prescriptions...</div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Medicine Details</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Dosage / Duration</th>
                    <th className="px-6 py-4">Status & Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((rx) => (
                      <tr key={rx.recordId || rx.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                              <Pill className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{rx.medicine}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5" title={rx.id}>Prescription ID: {rx.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-800">{rx.patientName}</p>
                              <p className="text-[10px] text-slate-500" title={rx.patientId}>{rx.patientId.substring(0,8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-800 font-medium">{rx.dosage}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{rx.duration}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-1 ${
                            rx.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {rx.status}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Calendar className="size-3.5" />
                            {rx.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {rx.hasImage && (
                              <button
                                onClick={() => handleViewImage(rx)}
                                className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors"
                                title="View Prescription Image"
                              >
                                <ImageIcon className="size-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => openEditModal(rx)}
                              className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" 
                              title="Edit Prescription"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(rx.recordId || rx.id)}
                              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                              title="Delete Prescription"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        <Pill className="size-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">No prescriptions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE PRESCRIPTIONS SECTION */}
      {activeTab === "upload" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Create Prescription</h2>
            <form className="space-y-6" onSubmit={handleCreatePrescription}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient ID (UUID)</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. 22365a7a-5715-4984-b2f1-c4bfee8a37e7" 
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Make sure to enter the exact Patient ID from the Patients module.</p>
              </div>
              {requireDoctor && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prescribing Doctor</label>
                  <select required value={doctorId} onChange={(event) => setDoctorId(event.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]">
                    <option value="">Select hospital doctor</option>
                    {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}{doctor.department ? ` - ${doctor.department}` : ""}</option>)}
                  </select>
                </div>
              )}
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="p-1.5 bg-cyan-100 text-[#0891b2] rounded-md"><Pill className="size-4" /></span>
                    Prescription Details
                  </h3>
                  <button type="button" onClick={() => setMedicines([...medicines, { name: "", duration: "", days: "", instruction: "" }])} className="text-xs font-bold text-[#0891b2] bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100 hover:bg-cyan-100 transition-colors">
                    + Add Medicine
                  </button>
                </div>
                
                <div className="space-y-4">
                  {medicines.map((med, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 relative">
                      {medicines.length > 1 && (
                        <div className="absolute -top-2 -right-2">
                          <button type="button" onClick={() => {
                            const m = [...medicines];
                            m.splice(index, 1);
                            setMedicines(m);
                          }} className="bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors shadow-sm">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Medicine Name</label>
                        <input 
                          required
                          type="text" 
                          value={med.name}
                          onChange={(e) => {
                            const m = [...medicines];
                            m[index].name = e.target.value;
                            setMedicines(m);
                          }}
                          placeholder="e.g. Paracetamol 500mg" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Duration</label>
                        <input 
                          required
                          type="text" 
                          value={med.duration}
                          onChange={(e) => {
                            const m = [...medicines];
                            m[index].duration = e.target.value;
                            setMedicines(m);
                          }}
                          placeholder="e.g. 1-0-1" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Days</label>
                        <input 
                          required
                          type="text" 
                          value={med.days}
                          onChange={(e) => {
                            const m = [...medicines];
                            m[index].days = e.target.value;
                            setMedicines(m);
                          }}
                          placeholder="e.g. 5" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Instruction</label>
                        <input 
                          type="text" 
                          value={med.instruction}
                          onChange={(e) => {
                            const m = [...medicines];
                            m[index].instruction = e.target.value;
                            setMedicines(m);
                          }}
                          placeholder="e.g. After Meals" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UploadCloud className="size-4" /> {submitting ? "Uploading..." : "Create Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUGGEST LAB TEST SECTION */}
      {showLabTest && activeTab === "lab_test" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Suggest Lab Test</h2>
            <form className="space-y-6" onSubmit={handleSuggestLabTest}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient ID (UUID)</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. 22365a7a-5715-4984-b2f1-c4bfee8a37e7" 
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-cyan-100 text-[#0891b2] rounded-md"><Pill className="size-4" /></span>
                  Lab Test Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Destination Laboratory</label>
                    {labs.length > 0 ? (
                      <select 
                        value={selectedLabId}
                        onChange={(e) => setSelectedLabId(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      >
                        <option value="">-- Select Laboratory --</option>
                        {labs.map(lab => (
                          <option key={lab.id} value={lab.id}>
                            {lab.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        No laboratories found in the network.
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lab ID (UUID)</label>
                    <input 
                      type="text" 
                      value={selectedLabId}
                      onChange={(e) => setSelectedLabId(e.target.value)}
                      placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lab Test Name</label>
                    <input 
                      type="text" 
                      value={labTestName}
                      onChange={(e) => setLabTestName(e.target.value)}
                      placeholder="e.g. Complete Blood Count (CBC)" 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority</label>
                    <select 
                      value={labTestPriority}
                      onChange={(e) => setLabTestPriority(e.target.value)}
                      disabled={!labTestName}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High / Urgent</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UploadCloud className="size-4" /> {submitting ? "Sending..." : "Request Lab Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* EDIT MODAL */}
      {isEditModalOpen && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Pencil className="size-5 text-[#0891b2]" />
                Edit Prescription
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditPrescription}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Medicine Details</label>
                  <input 
                    required
                    type="text" 
                    value={selectedPrescription.medicine}
                    onChange={(e) => setSelectedPrescription({...selectedPrescription, medicine: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-[#0891b2]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Dosage</label>
                    <input 
                      required
                      type="text" 
                      value={selectedPrescription.dosage}
                      onChange={(e) => setSelectedPrescription({...selectedPrescription, dosage: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-[#0891b2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Duration</label>
                    <input 
                      required
                      type="text" 
                      value={selectedPrescription.duration}
                      onChange={(e) => setSelectedPrescription({...selectedPrescription, duration: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-[#0891b2]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={selectedPrescription.status}
                    onChange={(e) => setSelectedPrescription({...selectedPrescription, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-[#0891b2]"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#0891b2] hover:bg-cyan-700 rounded-lg transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
