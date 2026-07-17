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

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("view"); // "view" | "upload"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload/Create state
  const [patientId, setPatientId] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("Active");
  
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
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await fetch("/api/clinic/labs", { headers: authHeaders() });
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
      const res = await fetch("/api/clinic/prescriptions", { headers: authHeaders() });
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
    if (labTestName && !selectedLabId) {
      toast.error("Please select a Destination Laboratory for the lab test.");
      return;
    }
    try {
      const res = await fetch("/api/clinic/prescriptions", {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({ patientId, medicine, dosage, duration, status, labTestName, labTestPriority, labId: selectedLabId }),
      });
      if (res.ok) {
        toast.success("Prescription Created!");
        if (labTestName) toast.success("Lab Test Requested successfully.");
        setActiveTab("view");
        fetchPrescriptions();
        // Reset form
        setPatientId(""); setMedicine(""); setDosage(""); setDuration(""); setStatus("Active"); setLabTestName(""); setLabTestPriority("Normal");
      } else {
        toast.error("Failed to create prescription");
      }
    } catch (err) {
      toast.error("Error creating prescription");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      const res = await fetch(`/api/clinic/prescriptions/${id}`, { method: "DELETE", headers: authHeaders() });
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
      const res = await fetch(`/api/clinic/prescriptions/${selectedPrescription.id}`, {
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
          Issue Prescription
        </button>
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
                      <tr key={rx.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                              <Pill className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{rx.medicine}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5" title={rx.id}>ID: {rx.id.substring(0,8)}...</div>
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
                            <button 
                              onClick={() => openEditModal(rx)}
                              className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" 
                              title="Edit Prescription"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(rx.id)}
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
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Issue New Prescription</h2>
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
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Medicine Details</label>
                  <input 
                    required
                    type="text" 
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    placeholder="e.g. Paracetamol 500mg" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  >
                    <option value="Active">Active / Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dosage</label>
                  <input 
                    required
                    type="text" 
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1-0-1 (Morning & Night)" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Duration</label>
                  <input 
                    required
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 5 Days" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
              </div>

              {/* Lab Test Addition */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-cyan-100 text-[#0891b2] rounded-md"><Pill className="size-4" /></span>
                  Suggest Lab Test (Optional)
                </h3>
                
                <div className="mb-4">
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
                  className="px-8 py-3 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <UploadCloud className="size-4" /> Issue Prescription
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
