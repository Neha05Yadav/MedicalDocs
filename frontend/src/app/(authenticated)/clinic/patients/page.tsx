"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Search, UserPlus, MoreVertical, CheckCircle2, Clock, 
  XCircle, FileText, ChevronDown, User, X, Edit
} from "lucide-react";
import { authHeaders } from "@/lib/auth-fetch";
import { useSearchParams, useRouter } from "next/navigation";

export default function DoctorPatientsPage() {
  const [activeTab, setActiveTab] = useState("my_patients"); // "my_patients" | "search_patient"
  const [activeFilter, setActiveFilter] = useState("All Patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Doctor's custom patients data from backend
  const [doctorPatientsData, setDoctorPatientsData] = useState<any[]>([]);

  
  // Lab Test Request State
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [labForm, setLabForm] = useState({ patientId: "", labId: "", labTestName: "", priority: "Normal" });
  const [labsList, setLabsList] = useState<any[]>([]);
  const [isSubmittingLab, setIsSubmittingLab] = useState(false);

  const fetchLabsList = async () => {
    try {
      const res = await fetch('/api/clinic/labs', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLabsList(data);
      }
    } catch(e) { console.error(e); }
  };

  const submitLabRequest = async () => {
    if (!labForm.patientId || !labForm.labId || !labForm.labTestName) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmittingLab(true);
    try {
      const res = await fetch('/api/clinic/test-requests', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(labForm)
      });
      if (res.ok) {
        toast.success("Lab test request sent successfully!");
        setIsLabModalOpen(false);
        setLabForm({ patientId: "", labId: "", labTestName: "", priority: "Normal" });
      } else {
        toast.error("Failed to send lab request");
      }
    } catch(e) {
      toast.error("Error submitting lab request");
    } finally {
      setIsSubmittingLab(false);
    }
  };

  // New Patient Modal state
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [newPatientForm, setNewPatientForm] = useState({
    name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'A+', diagnosis: '', followUp: '', status: 'Treatment Ongoing'
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"request" | "records">("request");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Request Access state
  const [accessReportTypes, setAccessReportTypes] = useState<string[]>(["All Reports"]);
  const [customReportType, setCustomReportType] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [duration, setDuration] = useState("7 Days");
  const [isRequesting, setIsRequesting] = useState(false);

  // View Records state
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // Fetch initial data
  const fetchPatients = async (query = "") => {
    setLoading(true);
    try {
      const url = query ? `/api/clinic/patients/search?query=${query}` : `/api/clinic/patients`;
      const res = await fetch(url, { headers: authHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error("API returned non-array:", data);
        setPatients([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPatients = async () => {
    try {
      const res = await fetch('/api/clinic/my-patients', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDoctorPatientsData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPatients();
    fetchMyPatients();
    fetchLabsList();
  }, []);

  // Handle Search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchParams = useSearchParams();
  const viewPatientId = searchParams?.get('viewPatientId');

  useEffect(() => {
    if (viewPatientId && patients.length > 0 && !isModalOpen) {
      const p = patients.find(p => p.id === viewPatientId);
      if (p && p.status === "Access Approved") {
        setActiveTab("search_patient");
        handleOpenRecordsModal(p);
      }
    }
  }, [viewPatientId, patients]);

  // Request Access logic
  const handleOpenRequestModal = (patient: any = null) => {
    if(!patient) {
      toast.error("Please search and select a patient first.");
      return;
    }
    setSelectedPatient(patient);
    setModalType("request");
    setIsModalOpen(true);
  };

  const submitAccessRequest = async () => {
    if (!selectedPatient) return;
    
    if (accessReportTypes.length === 0) {
      toast.error("Please select at least one report type");
      return;
    }
    
    if (accessReportTypes.includes("Other") && !customReportType.trim()) {
      toast.error("Please enter the report name for Other.");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for access");
      return;
    }

    setIsRequesting(true);
    try {
      const finalReportTypes = accessReportTypes
        .map(type => type === "Other" ? customReportType.trim() : type)
        .join(", ");
        
      const payload = {
        patientId: selectedPatient.id,
        reportTypes: finalReportTypes,
        reason,
        priority,
        duration
      };

      const res = await fetch('/api/clinic/patients/request-access', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(payload)
      });
      toast.success(`Access request sent to ${selectedPatient.name}`);
      setIsModalOpen(false);
      fetchPatients(searchTerm); // Refresh list
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setIsRequesting(false);
    }
  };

  // View Records logic
  const handleOpenRecordsModal = async (patient: any) => {
    setSelectedPatient(patient);
    setModalType("records");
    setIsModalOpen(true);
    setIsLoadingRecords(true);
    setRecords([]);
    setSelectedRecord(null);
    
    try {
      const res = await fetch(`/api/clinic/patients/${patient.id}/records`, { headers: authHeaders() });
      if(!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRecords(data);
      if(data.length > 0) {
        setSelectedRecord(data[0]);
      }
    } catch (error) {
      toast.error("Failed to load patient records");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(p => {
    if (activeFilter === "All Patients") return true;
    if (activeFilter === "Access Approved") return p.status === "Access Approved";
    if (activeFilter === "Pending Requests") return p.status === "Pending";
    if (activeFilter === "Rejected") return p.status === "Rejected";
    return true;
  });

  const filters = [
    { name: "All Patients", count: patients.length, badgeBg: "bg-cyan-100", badgeText: "text-cyan-700" },
    { name: "Access Approved", count: patients.filter(p => p.status === "Access Approved").length, badgeBg: "bg-green-100", badgeText: "text-green-700" },
    { name: "Pending Requests", count: patients.filter(p => p.status === "Pending").length, badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
    { name: "Rejected", count: patients.filter(p => p.status === "Rejected").length, badgeBg: "bg-red-100", badgeText: "text-red-700" },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full min-h-screen">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab("my_patients")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "my_patients" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
          >
            My Patients
          </button>
          <button 
            onClick={() => setActiveTab("search_patient")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "search_patient" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"}`}
          >
            Patient Directory
          </button>
        </div>
      </div>

      {/* Doctor's Active Patients Table */}
      {activeTab === "my_patients" && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Patients</h2>
            <p className="text-sm text-slate-500 mt-1">Patients currently under your care.</p>
          </div>
          <button 
            onClick={() => {
              setEditingPatientId(null);
              setNewPatientForm({ name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'A+', diagnosis: '', followUp: '', status: 'Treatment Ongoing' });
              setIsNewPatientModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0052cc] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0043a8] transition-colors"
          >
            <UserPlus className="size-4" />
            New Patient
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Diagnosis</th>
                <th className="px-6 py-4">Follow-up</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorPatientsData.map((dp, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{dp.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{dp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dp.age}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dp.gender}</td>
                  <td className="px-6 py-4 text-sm font-medium text-red-500">{dp.bloodGroup}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dp.lastVisit}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dp.diagnosis}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dp.followUp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${dp.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {dp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button 
                      onClick={() => {
                        setEditingPatientId(dp.id);
                        setNewPatientForm({ 
                          name: dp.name, 
                          phone: dp.phone || '',
                          age: dp.age.toString(), 
                          gender: dp.gender, 
                          bloodGroup: dp.bloodGroup, 
                          diagnosis: dp.diagnosis, 
                          followUp: '',
                          status: dp.status 
                        });
                        setIsNewPatientModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Patient"
                    >
                      <Edit className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Search and Action Bar */}
      {activeTab === "search_patient" && (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Patient Name, ID or Mobile" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                activeFilter === filter.name 
                  ? "bg-cyan-50 border-cyan-100 text-[#0052cc]" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter.name}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeFilter === filter.name ? filter.badgeBg + " " + filter.badgeText : "bg-slate-100 text-slate-600"}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Grid */}
      {loading ? (
        <div className="text-center p-12 text-slate-500 animate-pulse">Loading patients...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center p-12 text-slate-500 bg-white rounded-2xl border border-slate-200">No patients found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:border-cyan-200 transition-colors">
              
              <div className="flex items-start gap-4 mb-6">
                <div className={`size-14 rounded-full flex items-center justify-center shrink-0 ${patient.avatarBg || 'bg-slate-100'} ${patient.avatarColor || 'text-slate-500'}`}>
                  <User className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between relative">
                    <h3 className="font-bold text-slate-900 text-base truncate pr-2">{patient.name}</h3>
                    <div className="relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === patient.id ? null : patient.id)} className="text-slate-400 hover:text-slate-600 shrink-0 relative z-20">
                        <MoreVertical className="size-5" />
                      </button>
                      {activeDropdown === patient.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                          <div className="absolute right-0 top-6 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-20 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={() => { 
                                setEditingPatientId(patient.id);
                                setNewPatientForm({
                                  name: patient.name || '', phone: patient.mobile || '', age: patient.age?.toString() || '', gender: patient.gender || 'Male', bloodGroup: patient.bloodGroup || 'A+', diagnosis: patient.diagnosis || '', followUp: patient.followUp || '', status: patient.status || 'Treatment Ongoing'
                                });
                                setIsNewPatientModalOpen(true);
                                setActiveDropdown(null); 
                              }} 
                              className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0052cc] transition-colors"
                            >
                              Edit Details
                            </button>
                            <button 
                              onClick={async () => {
                                if (!confirm(`Delete ${patient.name} from your clinic list?`)) return;
                                const response = await fetch(`/api/clinic/my-patients/${patient.id}`, { method: 'DELETE', headers: authHeaders() });
                                if (response.ok) { toast.success("Patient removed from clinic list."); fetchMyPatients(); }
                                else toast.error("Patient could not be removed.");
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete Patient
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p className="truncate">ID: {patient.id}</p>
                    <p>Mobile: {patient.mobile}</p>
                    <p>Age: {patient.age} • {patient.gender}</p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6 flex-1">
                {patient.status === "Access Approved" && (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-600 border border-emerald-100 text-xs font-semibold mb-2">
                      <CheckCircle2 className="size-3.5" /> Access Approved
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-1">Valid till: {patient.validTill}</p>
                  </>
                )}
                {patient.status === "Not Requested" && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 text-xs font-semibold mb-2">
                    <UserPlus className="size-3.5" /> Not Requested
                  </div>
                )}
                {patient.status === "Pending" && (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-100 text-xs font-semibold mb-2">
                      <Clock className="size-3.5" /> Pending
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-1">Request sent: {patient.requestSent}</p>
                  </>
                )}
                {patient.status === "Rejected" && (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-500 border border-red-100 text-xs font-semibold mb-2">
                      <XCircle className="size-3.5" /> Rejected
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-1">Request rejected on: {patient.rejectedOn}</p>
                  </>
                )}
                {patient.status === "Expired" && (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold mb-2">
                      <Clock className="size-3.5" /> Access Expired/Revoked
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto">
                {patient.status === "Access Approved" && (
                  <button 
                    onClick={() => handleOpenRecordsModal(patient)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0052cc] text-white font-semibold text-sm hover:bg-cyan-800 transition-colors flex justify-center items-center gap-2"
                  >
                    <FileText className="size-4" /> View Records
                  </button>
                )}
                {(patient.status === "Not Requested" || patient.status === "Expired") && (
                  <button 
                    onClick={() => handleOpenRequestModal(patient)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white font-semibold text-sm transition-colors"
                  >
                    Request Access
                  </button>
                )}
                {patient.status === "Pending" && (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed">
                    Request Pending...
                  </button>
                )}
                {patient.status === "Rejected" && (
                  <button 
                    onClick={() => handleOpenRequestModal(patient)}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-[#0052cc] text-[#0052cc] font-semibold text-sm hover:bg-cyan-50 transition-colors"
                  >
                    Request Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      )}

      {/* View Records Modal */}
      {isModalOpen && modalType === "records" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        </div>
      )}

      {/* New Patient Modal */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{editingPatientId ? "Edit Patient" : "Add New Patient"}</h3>
                <p className="text-sm text-slate-500">{editingPatientId ? "Update patient records and treatment details" : "Register a new patient for treatment"}</p>
              </div>
              <button 
                onClick={() => setIsNewPatientModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient Name</label>
                  <input 
                    type="text" 
                    value={newPatientForm.name}
                    onChange={e => setNewPatientForm({...newPatientForm, name: e.target.value})}
                    disabled={!!editingPatientId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={newPatientForm.phone}
                    onChange={e => setNewPatientForm({...newPatientForm, phone: e.target.value})}
                    disabled={!!editingPatientId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Age</label>
                  <input 
                    type="number" 
                    value={newPatientForm.age}
                    onChange={e => setNewPatientForm({...newPatientForm, age: e.target.value})}
                    disabled={!!editingPatientId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="E.g. 45"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
                  <select 
                    value={newPatientForm.gender}
                    onChange={e => setNewPatientForm({...newPatientForm, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Blood Group</label>
                  <select 
                    value={newPatientForm.bloodGroup}
                    onChange={e => setNewPatientForm({...newPatientForm, bloodGroup: e.target.value})}
                    disabled={!!editingPatientId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={newPatientForm.status}
                    onChange={e => setNewPatientForm({...newPatientForm, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all"
                  >
                    <option value="Treatment Ongoing">Treatment Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Diagnosis</label>
                  <input 
                    type="text" 
                    value={newPatientForm.diagnosis}
                    onChange={e => setNewPatientForm({...newPatientForm, diagnosis: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all"
                    placeholder="Enter diagnosis details"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Follow-up Date</label>
                  <input 
                    type="date" 
                    value={newPatientForm.followUp}
                    onChange={e => setNewPatientForm({...newPatientForm, followUp: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsNewPatientModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if(!newPatientForm.name || !newPatientForm.age) {
                    toast.error("Please fill required fields");
                    return;
                  }
                  
                  try {
                    if (editingPatientId) {
                      // Update existing
                      const res = await fetch(`/api/clinic/my-patients/${editingPatientId}`, {
                        method: 'PUT',
                        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPatientForm)
                      });
                      if (res.ok) {
                        toast.success("Patient updated successfully!");
                      } else {
                        toast.error("Failed to update patient");
                      }
                    } else {
                      // Add new
                      const res = await fetch('/api/clinic/my-patients', {
                        method: 'POST',
                        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPatientForm)
                      });
                      if (res.ok) {
                        toast.success("New patient added successfully!");
                      } else {
                        toast.error("Failed to add patient");
                      }
                    }
                    fetchMyPatients();
                    setIsNewPatientModalOpen(false);
                    setEditingPatientId(null);
                    setNewPatientForm({ name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'A+', diagnosis: '', followUp: '', status: 'Treatment Ongoing' });
                  } catch (e) {
                    toast.error("An error occurred");
                  }
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0052cc] hover:bg-[#0043a8] shadow-sm shadow-[#0052cc]/20 transition-all"
              >
                {editingPatientId ? "Update Patient" : "Save Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          
          {modalType === "request" ? (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col h-[85vh]">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
                <h2 className="text-lg font-bold text-slate-900">Request Report Access</h2>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Patient Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedPatient ? selectedPatient.name : ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Patient ID</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedPatient ? selectedPatient.id : ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Report Type *</label>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 mb-3 cursor-pointer hover:border-[#0052cc] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={accessReportTypes.includes("All Reports")}
                        onChange={(e) => {
                          if (e.target.checked) setAccessReportTypes(["All Reports"]);
                          else setAccessReportTypes([]);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc]" 
                      />
                      <span className="font-semibold text-sm text-slate-800">All Reports</span>
                    </label>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-2">
                      {["Blood Test", "CBC", "Lipid Profile", "Thyroid Test", "Urine Test", "Liver Function Test", "Kidney Function Test", "X-Ray", "MRI", "CT Scan", "ECG", "Prescription", "Discharge Summary", "Other"].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={accessReportTypes.includes(type) && !accessReportTypes.includes("All Reports")}
                            disabled={accessReportTypes.includes("All Reports")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAccessReportTypes(prev => prev.filter(t => t !== "All Reports").concat(type));
                              } else {
                                setAccessReportTypes(prev => prev.filter(t => t !== type));
                                if (type === "Other") setCustomReportType("");
                              }
                            }}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc] disabled:opacity-50" 
                          />
                          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors disabled:opacity-50">{type}</span>
                        </label>
                      ))}
                    </div>
                    {accessReportTypes.includes("Other") && (
                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <label htmlFor="custom-report-type" className="mb-1.5 block text-xs font-semibold text-slate-700">Specify report name *</label>
                        <input
                          id="custom-report-type"
                          type="text"
                          value={customReportType}
                          onChange={(event) => setCustomReportType(event.target.value)}
                          placeholder="e.g. Allergy Test Report"
                          maxLength={80}
                          autoFocus
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0052cc] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">Enter the exact report name the patient should authorize.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason for Access *</label>
                  <textarea 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={3}
                    placeholder="Required for diagnosis and follow-up treatment."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
                    <div className="relative">
                      <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]">
                        <option>Normal</option>
                        <option>Urgent</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Access Duration</label>
                    <div className="relative">
                      <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]">
                        <option>24 Hours</option>
                        <option>7 Days</option>
                        <option>Until Patient Revokes</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
                <button onClick={handleCloseModal} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 bg-white rounded-xl transition-colors">Cancel</button>
                <button onClick={submitAccessRequest} disabled={isRequesting} className="px-6 py-2.5 text-sm font-bold text-white bg-[#0052cc] hover:bg-[#0042a3] rounded-xl transition-all shadow-sm shadow-[#0052cc]/20 disabled:opacity-50 flex items-center gap-2">
                  {isRequesting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          ) : (
            // SPLIT VIEW RECORDS MODAL
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col h-[85vh]">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${selectedPatient?.avatarBg || 'bg-slate-100'} ${selectedPatient?.avatarColor || 'text-slate-500'}`}>
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Patient Records: {selectedPatient?.name}</h2>
                    <p className="text-xs text-slate-500">ID: {selectedPatient?.id}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
                  <X className="size-5" />
                </button>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - List of Records */}
                <div className="w-1/3 border-r border-slate-100 bg-white overflow-y-auto p-4 space-y-3">
                  {isLoadingRecords ? (
                     <div className="text-center p-8 text-slate-400 animate-pulse text-sm">Loading records...</div>
                  ) : records.length === 0 ? (
                     <div className="text-center p-8 text-slate-400 text-sm border border-dashed rounded-xl border-slate-200 bg-slate-50">No records uploaded yet.</div>
                  ) : (
                    records.map((record) => (
                      <div 
                        key={record.id} 
                        onClick={() => setSelectedRecord(record)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                          selectedRecord?.id === record.id 
                            ? "bg-cyan-50 border-[#0052cc]/30 shadow-sm" 
                            : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${selectedRecord?.id === record.id ? "bg-[#0052cc] text-white" : "bg-cyan-50 text-[#0052cc]"}`}>
                          <FileText className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${selectedRecord?.id === record.id ? "text-[#0052cc]" : "text-slate-900"}`}>{record.title}</p>
                          <p className="text-xs text-slate-500 truncate">{record.category} • {record.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Main Area - Document Viewer */}
                <div className="w-2/3 bg-slate-100 flex flex-col relative overflow-y-auto">
                  {!selectedRecord ? (
                    <div className="m-auto flex flex-col items-center justify-center text-slate-400">
                      <FileText className="size-16 mb-4 opacity-20" />
                      <p className="text-sm font-medium">Select a record from the list to view it here.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl mx-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                            <FileText className="size-6 text-[#0052cc]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{selectedRecord.title}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{selectedRecord.type}</div>
                          </div>
                        </div>
                        <a href={selectedRecord.fileUrl?.startsWith('http') ? selectedRecord.fileUrl : `/uploads/${selectedRecord.fileUrl}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#0052cc] hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg">
                          View Full Report
                        </a>
                      </div>
                      <div className="mt-4 px-6 mb-6">
                        {!selectedRecord.fileUrl ? (
                          <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 text-center text-slate-500">No file is attached to this medical record.</div>
                        ) : selectedRecord.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i) || selectedRecord.fileUrl?.startsWith('http') ? (
                          <img src={selectedRecord.fileUrl?.startsWith('http') ? selectedRecord.fileUrl : `/uploads/${selectedRecord.fileUrl}`} alt={selectedRecord.title} className="max-w-full h-auto object-contain rounded-lg shadow-sm bg-white mx-auto" />
                        ) : (
                          <iframe 
                            src={selectedRecord.fileUrl?.startsWith('http') ? selectedRecord.fileUrl : `/uploads/${selectedRecord.fileUrl}`} 
                            className="w-full h-[60vh] border border-slate-200 rounded-lg bg-white" 
                            title={selectedRecord.title} 
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lab Test Request Modal */}
      {isLabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="size-5 text-indigo-600" />
                Send Lab Test Request
              </h3>
              <button onClick={() => setIsLabModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  value={labForm.patientId}
                  onChange={e => setLabForm({...labForm, patientId: e.target.value})}
                >
                  <option value="">-- Choose Patient --</option>
                  {doctorPatientsData.map(dp => (
                    <option key={dp.id} value={dp.id}>{dp.name} ({dp.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Laboratory</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  value={labForm.labId}
                  onChange={e => setLabForm({...labForm, labId: e.target.value})}
                >
                  <option value="">-- Choose Lab --</option>
                  {labsList.map(lab => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="e.g. Complete Blood Count (CBC)"
                  value={labForm.labTestName}
                  onChange={e => setLabForm({...labForm, labTestName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                <div className="flex gap-3">
                  {["Normal", "High", "Urgent"].map(p => (
                    <label key={p} className={`flex-1 cursor-pointer border ${labForm.priority === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'} rounded-xl px-4 py-3 flex items-center justify-center font-medium transition-colors`}>
                      <input type="radio" name="priority" className="hidden" checked={labForm.priority === p} onChange={() => setLabForm({...labForm, priority: p})} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsLabModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitLabRequest}
                disabled={isSubmittingLab}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmittingLab ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
