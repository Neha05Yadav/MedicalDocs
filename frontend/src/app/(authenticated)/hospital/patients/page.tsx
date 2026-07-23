"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const Edit2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>;

interface Patient {
  id: string;
  name: string;
  mobile: string;
  department: string;
  regDate: string;
  status: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  verifiedOn: string;
  verifiedBy: string;
  availableRecords: number;
  accessExpiresAt?: string | null;
}

interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization?: string;
}

export default function PatientSearchVerificationPage() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Current Hospital Patients (Treatment queue)
  const [hospitalPatients, setHospitalPatients] = useState<any[]>([]);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState({ name: "", mobile: "", patientId: "", department: "", doctor: "" });

  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isUpdatingPatient, setIsUpdatingPatient] = useState(false);
  const [editingPatientData, setEditingPatientData] = useState<any>({});

  // Doctors list for access request
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // Labs list for test request
  const [labs, setLabs] = useState<{id: string, name: string}[]>([]);

  // Access request & Records modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"request" | "records">("request");
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [accessReportTypes, setAccessReportTypes] = useState<string[]>([]);
  const [customReportType, setCustomReportType] = useState("");
  const [accessReason, setAccessReason] = useState("");
  const [accessPriority, setAccessPriority] = useState("Normal");
  const [accessClock, setAccessClock] = useState(() => Date.now());
  const [isRequesting, setIsRequesting] = useState(false);

  // Lab Request Modal
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [labDoctorId, setLabDoctorId] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [labTestName, setLabTestName] = useState("");
  const [labPriority, setLabPriority] = useState("Normal");
  const [labPatientId, setLabPatientId] = useState("");
  const [isRequestingLab, setIsRequestingLab] = useState(false);

  useEffect(() => {
    // Fetch hospital doctors and labs when component loads
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Fetch active hospital patients for treatment table
        const overviewRes = await fetch("/api/hospital/overview", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          setHospitalPatients(overviewData.activePatients || []);
        }

        // Fetch Doctors
        const docRes = await fetch("/api/hospital/doctors", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (docRes.ok) {
          const data = await docRes.json();
          setDoctors(data);
          if (data.length > 0) {
            setSelectedDoctorId(data[0].id);
            setLabDoctorId(data[0].id);
          }
        }

        // Fetch Labs
        const labRes = await fetch("/api/hospital/labs", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (labRes.ok) {
          const labData = await labRes.json();
          setLabs(labData);
          if (labData.length > 0) {
            setSelectedLabId(labData[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setAccessClock(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const hasActiveAccess = (patient: Patient | null) => {
    if (!patient || patient.status !== "Access Approved") return false;
    if (!patient.accessExpiresAt) return false;
    return new Date(patient.accessExpiresAt).getTime() > accessClock;
  };

  const displayedAccessStatus = (patient: Patient) =>
    patient.status === "Access Approved" && !hasActiveAccess(patient) ? "Expired" : patient.status;

  const handleOpenRecordsModal = async (patient: any) => {
    setSelectedPatient(patient);
    setModalType("records");
    setIsModalOpen(true);
    setIsLoadingRecords(true);
    setSelectedRecord(null);
    setRecords([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/hospital/patients/${patient.id}/records`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formattedRecords = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          date: new Date(r.date).toLocaleDateString(),
          type: r.type,
          fileUrl: r.fileUrl
        }));
        setRecords(formattedRecords);
        if (formattedRecords.length > 0) {
          setSelectedRecord(formattedRecords[0]);
        }
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to load patient records");
        setSelectedPatient(current => current && current.id === patient.id ? { ...current, status: "Expired", accessExpiresAt: null } : current);
        setSearchResults(current => current.map(item => item.id === patient.id ? { ...item, status: "Expired", accessExpiresAt: null } : item));
        setIsModalOpen(false);
      }
    } catch (e) {
      toast.error("An error occurred while fetching records");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setTimeout(() => {
      document.getElementById("patient-details-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSelectedPatient(null);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setSelectedPatient(null);
    setHasSearched(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/hospital/search-patients?q=${encodeURIComponent(searchTerm)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResults(data);
      if (data.length === 0) {
        toast.info("No patients found");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to search patients");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPatient = async () => {
    if (!newPatientData.name || !newPatientData.mobile) {
      toast.error("Please enter patient name and mobile number");
      return;
    }
    
    setIsAddingPatient(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/add-treatment-patient", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newPatientData.name,
          mobile: newPatientData.mobile,
          patientId: newPatientData.patientId,
          department: newPatientData.department,
          doctorId: newPatientData.doctor // This is actually the doctorId from the select
        })
      });

      if (!res.ok) throw new Error("Failed to add patient");

      toast.success("Patient added successfully!");
      setIsAddPatientModalOpen(false);
      
      const doctorName = doctors.find(d => d.id === newPatientData.doctor)?.name || "Unknown Doctor";
      
      const initials = newPatientData.name.split(' ').map(n => n[0] || '').join('').toUpperCase().substring(0, 2);
      const safePhone = newPatientData.mobile || '000';
      const last3Phone = safePhone.length >= 3 ? safePhone.slice(-3) : safePhone.padStart(3, '0');
      const last2Year = new Date().getFullYear().toString().slice(-2);
      const patientId = (newPatientData.patientId && newPatientData.patientId.trim() !== '') ? newPatientData.patientId : `${initials}${last3Phone}${last2Year}`;
      
      setHospitalPatients([{ 
        name: newPatientData.name, 
        patientId,
        department: newPatientData.department, 
        doctor: doctorName, 
        status: "Stable" 
      }, ...hospitalPatients]);
      
      setNewPatientData({ name: "", mobile: "", patientId: "", department: "", doctor: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to add patient");
    } finally {
      setIsAddingPatient(false);
    }
  };

  const handleUpdatePatient = async () => {
    if (!editingPatientData.name || !editingPatientData.mobile) {
      toast.error("Please enter patient name and mobile number");
      return;
    }
    
    setIsUpdatingPatient(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/update-treatment-patient", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: editingPatientData.id,
          patientId: editingPatientData.patientId,
          name: editingPatientData.name,
          mobile: editingPatientData.mobile,
          admissionInfo: editingPatientData.admissionInfo,
          department: editingPatientData.department,
          doctorId: editingPatientData.doctorId 
        })
      });

      if (!res.ok) throw new Error("Failed to update patient");

      toast.success("Patient updated successfully!");
      setIsEditPatientModalOpen(false);
      
      const doctorName = doctors.find(d => d.id === editingPatientData.doctorId)?.name || editingPatientData.doctor;
      
      setHospitalPatients(hospitalPatients.map(p => 
        p.id === editingPatientData.id 
          ? { ...p, name: editingPatientData.name, department: editingPatientData.department, doctor: doctorName, doctorId: editingPatientData.doctorId, mobile: editingPatientData.mobile, admissionInfo: editingPatientData.admissionInfo }
          : p
      ));
    } catch (err: any) {
      toast.error(err.message || "Failed to update patient");
    } finally {
      setIsUpdatingPatient(false);
    }
  };

  useEffect(() => {
    // Check if there's a patientId in URL (e.g. redirected from notification)
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('patientId');
    if (patientId && !searchTerm) {
      setSearchTerm(patientId);
      // Auto trigger search for this patient ID
      setTimeout(() => {
        const fetchAutoSearch = async () => {
          setIsSearching(true);
          setHasSearched(true);
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/hospital/search-patients?q=${encodeURIComponent(patientId)}`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setSearchResults(data);
              if (data.length > 0) {
                // Auto select the first result since it should be an exact match
                handleSelectPatient(data[0]);
              }
            }
          } catch (e) {
            console.error(e);
          } finally {
            setIsSearching(false);
          }
        };
        fetchAutoSearch();
      }, 500);
    }
  }, []);

  const handleReset = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedPatient(null);
    setHasSearched(false);
  };

  const handleReportTypeChange = (type: string) => {
    if (type === "All Reports") {
      setAccessReportTypes(["All Reports"]);
    } else {
      let updated = [...accessReportTypes];
      if (updated.includes("All Reports")) updated = [];
      if (updated.includes(type)) {
        updated = updated.filter(t => t !== type);
      } else {
        updated.push(type);
      }
      setAccessReportTypes(updated);
    }
  };

  const handleRequestAccess = async () => {
    if (!selectedPatient || !selectedDoctorId) return;
    if (accessReportTypes.length === 0) {
      toast.error("Please select at least one report type");
      return;
    }
    if (accessReportTypes.includes("Other") && !customReportType.trim()) {
      toast.error("Please enter the report name for Other.");
      return;
    }
    if (customReportType.includes(",")) {
      toast.error("Enter one report name without commas.");
      return;
    }
    if (!accessReason.trim()) {
      toast.error("Please provide a reason for access");
      return;
    }
    setIsRequesting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/access-request", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          doctorId: selectedDoctorId,
          reportTypes: accessReportTypes
            .map(type => type === "Other" ? customReportType.trim() : type)
            .join(", "),
          reason: accessReason,
          priority: accessPriority,
          duration: "24 Hours"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request access");
      
      toast.success("Access request sent to patient");
      setIsModalOpen(false);
      setAccessReportTypes([]);
      setCustomReportType("");
      setAccessReason("");
      setAccessPriority("Normal");
      setSelectedPatient(current => current ? { ...current, status: "Pending", accessExpiresAt: null } : current);
      setSearchResults(current => current.map(patient => patient.id === selectedPatient.id ? { ...patient, status: "Pending", accessExpiresAt: null } : patient));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to request access");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRequestLabTest = async () => {
    const finalPatientId = selectedPatient?.id || labPatientId;
    if (!finalPatientId || !labDoctorId || !labTestName.trim() || !selectedLabId) {
      toast.error("Please fill all required fields including selecting a Lab and Patient");
      return;
    }
    setIsRequestingLab(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/test-requests", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId: finalPatientId,
          doctorId: labDoctorId,
          labId: selectedLabId,
          labTestName,
          priority: labPriority
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send lab request");
      
      toast.success("Lab request sent successfully!");
      setIsLabModalOpen(false);
      setLabTestName("");
      setLabPriority("Normal");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send lab request");
    } finally {
      setIsRequestingLab(false);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full min-h-screen font-sans text-slate-800">
      {/* Current Hospital Patients Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
          <h2 className="text-[#0891b2] font-semibold text-base whitespace-nowrap">Hospital Patient Search</h2>
          
          {/* Inline Compact Search */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1 flex-1 max-w-2xl mx-0 xl:mx-4">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 size-4 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search Global Registry by ID, Name or Mobile..."
                className="w-full pl-9 pr-4 py-1.5 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1">
              {searchTerm && (
                <button 
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-md"
                  title="Clear Search"
                >
                  <X className="size-4" />
                </button>
              )}
              <button 
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="px-4 py-1.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button 
              onClick={() => setIsLabModalOpen(true)}
              className="px-4 py-2 bg-white border border-[#0891b2] text-[#0891b2] hover:bg-cyan-50 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <FlaskConical className="size-4 text-[#0891b2]" /> Lab Request
            </button>
            <button 
              onClick={() => setIsAddPatientModalOpen(true)}
              className="px-4 py-2 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="size-4" /> Add Patient
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {hasSearched ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4 rounded-tl-lg">Patient ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4 text-center">Available Records</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {searchResults.length > 0 ? searchResults.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-600 font-mono text-xs">{patient.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-800">{patient.name}</td>
                    <td className="py-4 px-4 text-center text-slate-600 font-semibold">{patient.availableRecords} Reports</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold bg-white text-emerald-600 border border-emerald-100`}>
                        {displayedAccessStatus(patient)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleSelectPatient(patient)}
                        className={`px-3 py-1.5 border rounded-md transition-colors inline-flex items-center justify-center text-xs font-semibold gap-1.5 ${
                          selectedPatient?.id === patient.id 
                            ? "bg-cyan-50 text-[#0891b2] border-[#0891b2]" 
                            : "text-[#0891b2] border-[#0891b2]/20 hover:bg-cyan-50"
                        }`}
                      >
                        <Eye className="size-3.5" /> View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No patients found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Patient</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Doctor</th>
                <th className="py-3 px-4 text-center">Current Status</th>
                <th className="py-3 px-4 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitalPatients.length > 0 ? hospitalPatients.map((patient: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className="size-8 bg-cyan-50 rounded-lg flex items-center justify-center text-xs font-bold text-[#0891b2]">
                      {patient?.name ? patient.name.substring(0, 2).toUpperCase() : "NA"}
                    </div>
                    {patient.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-xs">{patient.patientId || "N/A"}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{patient.department}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{patient.doctor}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${patient.status === 'Stable' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => {
                        setEditingPatientData({
                          id: patient.id,
                          patientId: patient.patientId,
                          name: patient.name,
                          mobile: patient.mobile || "",
                          admissionInfo: patient.admissionInfo || "",
                          department: patient.department,
                          doctorId: patient.doctorId || "",
                          doctor: patient.doctor
                        });
                        setIsEditPatientModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Edit Patient"
                    >
                      <Edit2 className="size-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No patients currently undergoing treatment.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Patient Details Box */}
      {selectedPatient && (
        <div id="patient-details-section" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-[#0891b2] font-semibold text-base">Patient Details</h2>
            <div className="flex items-center gap-3">
              {hasActiveAccess(selectedPatient) ? (
                <button 
                  onClick={() => handleOpenRecordsModal(selectedPatient)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Eye className="size-4" /> View Records
                </button>
              ) : selectedPatient.status === "Pending" ? (
                <button 
                  disabled
                  className="px-5 py-2.5 bg-slate-100 text-slate-400 cursor-not-allowed rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Activity className="size-4" /> Request Pending...
                </button>
              ) : (
                <button 
                  onClick={() => { setModalType("request"); setIsModalOpen(true); }}
                  className="px-5 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Activity className="size-4" /> Access Request
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-full bg-cyan-100 text-[#0891b2] flex items-center justify-center">
                  <User className="size-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#1a2b4b]">{selectedPatient.name}</h3>
                    <span className="px-2 py-0.5 bg-white text-emerald-600 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-mono mt-1">ID: {selectedPatient.id}</p>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Mobile Number</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.mobile}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Email</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.email}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Gender</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.gender}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Date of Birth</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.dob}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Registration Date</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.regDate}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Total Records</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.availableRecords}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
{/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          
          {modalType === "request" ? (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col h-[85vh]">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Request Report Access</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors">
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

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Doctor Requesting Access *</label>
                  {doctors.length > 0 ? (
                    <select 
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`} ({d.specialization || d.department})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      No doctors found. Please add doctors to your hospital first before requesting access.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Report Type *</label>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <label className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 mb-3 cursor-pointer hover:border-[#0891b2] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={accessReportTypes.includes("All Reports")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAccessReportTypes(["All Reports"]);
                            setCustomReportType("");
                          }
                          else setAccessReportTypes([]);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#0891b2] focus:ring-[#0891b2]" 
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
                            className="w-3.5 h-3.5 rounded border-slate-300 text-[#0891b2] focus:ring-[#0891b2] disabled:opacity-50" 
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
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-[#0891b2] focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">Enter the exact report name the patient should authorize.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason for Access *</label>
                  <textarea 
                    value={accessReason}
                    onChange={e => setAccessReason(e.target.value)}
                    rows={3}
                    placeholder="Required for diagnosis and follow-up treatment."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
                    <div className="relative">
                      <select value={accessPriority} onChange={e => setAccessPriority(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]">
                        <option>Normal</option>
                        <option>Urgent</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Access Duration</label>
                    <div className="flex min-h-[42px] items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-800">
                      <Clock className="size-4" /> 24 hours maximum
                    </div>
                  </div>
                </div>

              </div>
              <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 border border-slate-200 bg-white rounded-xl transition-colors">Cancel</button>
                <button onClick={handleRequestAccess} disabled={isRequesting} className="px-6 py-2.5 text-sm font-bold text-white bg-[#0891b2] hover:bg-[#067a97] rounded-xl transition-all shadow-sm shadow-[#0891b2]/20 disabled:opacity-50 flex items-center gap-2">
                  {isRequesting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          ) : (
            // SPLIT VIEW RECORDS MODAL
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col h-[85vh]">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-[#0891b2]`}>
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Patient Records: {selectedPatient?.name}</h2>
                    <p className="text-xs text-slate-500">ID: {selectedPatient?.id}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
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
                            ? "bg-cyan-50 border-[#0891b2]/30 shadow-sm" 
                            : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${selectedRecord?.id === record.id ? "bg-[#0891b2] text-white" : "bg-cyan-50 text-[#0891b2]"}`}>
                          <FileText className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${selectedRecord?.id === record.id ? "text-[#0891b2]" : "text-slate-900"}`}>{record.title}</p>
                          <p className="text-xs text-slate-500 truncate">{record.category} • {record.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Main Area - Document Viewer */}
                <div className="w-2/3 bg-slate-100 flex flex-col relative">
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
                            <FileText className="size-6 text-[#0891b2]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{selectedRecord.title}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{selectedRecord.type}</div>
                          </div>
                        </div>
                        <a href={selectedRecord.fileUrl?.startsWith('http') ? selectedRecord.fileUrl : `/uploads/${selectedRecord.fileUrl}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#0891b2] hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg">
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

      {/* Lab Request Modal */}
      {isLabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FlaskConical className="size-5 text-[#0891b2]" />
                Request Lab Test
              </h2>
              <button 
                onClick={() => setIsLabModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              {!selectedPatient ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Patient</label>
                  <select 
                    value={labPatientId}
                    onChange={(e) => setLabPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  >
                    <option value="">-- Select Patient --</option>
                    {hospitalPatients.map((p, idx) => (
                      <option key={idx} value={p.patientId || p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-sm text-slate-600 mb-6">
                  You are requesting a lab test for <strong>{selectedPatient.name}</strong>.
                </p>
              )}
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Prescribing Doctor</label>
                  {doctors.length > 0 ? (
                    <select 
                      value={labDoctorId}
                      onChange={(e) => setLabDoctorId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`} ({d.department})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      No doctors found. Please add doctors to your hospital first.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Destination Lab</label>
                  {labs.length > 0 ? (
                    <select 
                      value={selectedLabId}
                      onChange={(e) => setSelectedLabId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                    >
                      <option value="">-- Select Laboratory --</option>
                      {labs.map(lab => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name} (ID: {lab.id})
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lab Test Name</label>
                  <input 
                    type="text" 
                    value={labTestName}
                    onChange={(e) => setLabTestName(e.target.value)}
                    placeholder="e.g. Complete Blood Count (CBC)" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <select 
                    value={labPriority}
                    onChange={(e) => setLabPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High / Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsLabModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleRequestLabTest}
                  disabled={isRequestingLab || doctors.length === 0 || !labTestName.trim()}
                  className="px-5 py-2 bg-[#0891b2] text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRequestingLab ? "Sending..." : "Send to Lab"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add New Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <User className="size-5 text-[#0891b2]" /> Add New Patient
              </h2>
              <button 
                onClick={() => setIsAddPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Name</label>
                  <input 
                    type="text" 
                    value={newPatientData.name}
                    onChange={e => setNewPatientData({...newPatientData, name: e.target.value})}
                    placeholder="Enter full name" 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                  <input 
                    type="text" 
                    value={newPatientData.mobile}
                    onChange={e => setNewPatientData({...newPatientData, mobile: e.target.value})}
                    placeholder="Enter mobile number" 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient ID (Optional)</label>
                  <input 
                    type="text" 
                    value={newPatientData.patientId}
                    onChange={e => setNewPatientData({...newPatientData, patientId: e.target.value})}
                    placeholder="Leave blank to auto-generate" 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                    <input 
                      type="text" 
                      value={newPatientData.department}
                      onChange={e => setNewPatientData({...newPatientData, department: e.target.value})}
                      placeholder="e.g. Cardiology" 
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Doctor</label>
                    <select 
                      value={newPatientData.doctor}
                      onChange={e => setNewPatientData({...newPatientData, doctor: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all bg-white"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button 
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPatient}
                  disabled={isAddingPatient}
                  className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAddingPatient ? "Saving..." : "Save Patient"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Patient Modal */}
      {isEditPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Edit2 className="size-5 text-[#0891b2]" /> Edit Patient
              </h2>
              <button 
                onClick={() => setIsEditPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Name</label>
                  <input 
                    type="text" 
                    value={editingPatientData.name}
                    onChange={e => setEditingPatientData({...editingPatientData, name: e.target.value})}
                    placeholder="Enter full name" 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                  <input 
                    type="text" 
                    value={editingPatientData.mobile}
                    onChange={e => setEditingPatientData({...editingPatientData, mobile: e.target.value})}
                    placeholder="Enter mobile number" 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                    <input 
                      type="text" 
                      value={editingPatientData.department}
                      onChange={e => setEditingPatientData({...editingPatientData, department: e.target.value})}
                      placeholder="e.g. Cardiology" 
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Doctor</label>
                    <select 
                      value={editingPatientData.doctorId}
                      onChange={e => setEditingPatientData({...editingPatientData, doctorId: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all bg-white"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Admission / Treatment Info (Local)</label>
                  <textarea 
                    value={editingPatientData.admissionInfo}
                    onChange={e => setEditingPatientData({...editingPatientData, admissionInfo: e.target.value})}
                    placeholder="Enter local hospital notes, room number, or treatment context..." 
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] transition-all min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button 
                  onClick={() => setIsEditPatientModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePatient}
                  disabled={isUpdatingPatient}
                  className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdatingPatient ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
