"use client";









const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
import { useState } from "react";
// Mock data based on screenshot
const mockPatients = [
  { 
    id: "PAT001", 
    name: "Rahul Kumar", 
    mobile: "98xxxxxx12", 
    department: "Cardiology",
    regDate: "15 May 2025",
    status: "Verified",
    email: "rahul@gmail.com",
    dob: "12 Feb 1990",
    gender: "Male",
    address: "123, MG Road, Lucknow, UP",
    verifiedOn: "20 May 2025 11:20 AM",
    verifiedBy: "Admin User",
    availableRecords: 3
  },
  { 
    id: "PAT002", 
    name: "Priya Sharma", 
    mobile: "99xxxxxx45", 
    department: "Neurology",
    regDate: "16 May 2025",
    status: "Pending",
    email: "priya@gmail.com",
    dob: "05 Aug 1992",
    gender: "Female",
    address: "45, Phase 1, Gomti Nagar, UP",
    verifiedOn: "-",
    verifiedBy: "-",
    availableRecords: 0
  },
  { 
    id: "PAT003", 
    name: "Aman Singh", 
    mobile: "97xxxxxx32", 
    department: "Orthopedics",
    regDate: "17 May 2025",
    status: "Verified",
    email: "aman@gmail.com",
    dob: "22 Nov 1985",
    gender: "Male",
    address: "A-23, South City, Lucknow, UP",
    verifiedOn: "18 May 2025 09:15 AM",
    verifiedBy: "Admin User",
    availableRecords: 5
  },
  { 
    id: "PAT004", 
    name: "Neha Gupta", 
    mobile: "96xxxxxx78", 
    department: "Pediatrics",
    regDate: "18 May 2025",
    status: "Pending",
    email: "neha@gmail.com",
    dob: "10 Jan 1995",
    gender: "Female",
    address: "78, Indira Nagar, Lucknow, UP",
    verifiedOn: "-",
    verifiedBy: "-",
    availableRecords: 1
  },
];
export default function PatientSearchVerificationPage() {
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [recordType, setRecordType] = useState("Select Record Type");
  const [searchResults, setSearchResults] = useState(mockPatients);
  const handleSelectPatient = (patient: typeof mockPatients[0]) => {
    setSelectedPatient(patient);
    setTimeout(() => {
      document.getElementById("patient-details-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const handleSearch = () => {
    let result = mockPatients;
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => {
        if (searchBy === "Patient ID") return p.id.toLowerCase().includes(lowerSearch);
        if (searchBy === "Mobile Number") return p.mobile.includes(lowerSearch);
        if (searchBy === "Name") return p.name.toLowerCase().includes(lowerSearch);
        return false;
      });
    }
    if (recordType !== "Select Record Type") {
      // Note: In real app, filter by record type. For mock, we ignore or filter loosely.
    }
    setSearchResults(result);
  };
  const handleReset = () => {
    setSearchTerm("");
    setSearchBy("Patient ID");
    setRecordType("Select Record Type");
    setSearchResults(mockPatients);
  };
  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full min-h-screen font-sans text-slate-800">
      {/* Header */}
      {/* Search Patient Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-[#0891b2] font-semibold text-base mb-5">Search Patient</h2>
        <div className="flex flex-wrap items-end gap-6">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search By</label>
            <div className="relative">
              <select 
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
              >
                <option>Patient ID</option>
                <option>Mobile Number</option>
                <option>Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-2">Enter Value</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Patient ID / Name / Mobile"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
            />
          </div>
          <div className="w-full md:w-56">
            <label className="block text-sm font-medium text-slate-700 mb-2">Required Records (Optional)</label>
            <div className="relative">
              <select 
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
              >
                <option>Select Record Type</option>
                <option>Blood Test</option>
                <option>MRI</option>
                <option>Prescription</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleSearch}
              className="flex-1 md:flex-none px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="size-4" />
              Search
            </button>
            <button 
              onClick={handleReset}
              className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="size-4 text-[#0891b2]" />
              Reset
            </button>
          </div>
        </div>
      </div>
      {/* Search Results Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-[#0891b2] font-semibold text-base mb-5">Search Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="pb-3 px-4">Patient ID</th>
                <th className="pb-3 px-4">Patient Name</th>
                <th className="pb-3 px-4 text-center">Available Records</th>
                <th className="pb-3 px-4 text-center">Status</th>
                <th className="pb-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-600">{patient.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-800">{patient.name}</td>
                    <td className="py-4 px-4 text-center text-slate-600 font-semibold">{patient.availableRecords} Reports</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${
                        patient.status === "Verified" 
                          ? "bg-white text-emerald-600 border border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleSelectPatient(patient)}
                        className="px-3 py-1.5 text-[#0891b2] border border-[#0891b2]/20 rounded-md hover:bg-cyan-50 transition-colors inline-flex items-center justify-center text-xs font-semibold gap-1.5"
                      >
                        <Eye className="size-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Patient Details Box */}
      {selectedPatient && (
        <div id="patient-details-section" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-[#0891b2] font-semibold text-base">Patient Details</h2>
            <button className="px-4 py-2 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              Request Report Access
            </button>
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
                    {selectedPatient.status === "Verified" && (
                      <span className="px-2 py-0.5 bg-white text-emerald-600 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Mobile Number</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.mobile}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Department</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.department}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Email</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.email}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Address</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2 leading-relaxed pr-4">{selectedPatient.address}</span>
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
                  <span className="text-sm font-medium text-slate-500 col-span-1">Gender</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.gender}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-sm font-medium text-slate-500 col-span-1">Verified On</span>
                  <span className="text-sm text-slate-800 font-medium col-span-2">{selectedPatient.verifiedOn}</span>
                </div>
              </div>
            </div>
            {/* Verification Sidebar */}
            <div className="w-full lg:w-[320px] bg-[#f8f9fc] rounded-xl border border-slate-200 p-5 self-start">
              <h3 className="text-[#0891b2] font-semibold text-sm mb-5">Verification</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      selectedPatient.status === "Verified" 
                        ? "bg-white text-emerald-600 border border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {selectedPatient.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Verified By</span>
                  <span className="text-sm text-slate-800 font-medium">{selectedPatient.verifiedBy}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-2.5 bg-[#2ea043] hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle2 className="size-4" /> Verify Patient
                </button>
                <button className="w-full py-2.5 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <X className="size-4" /> Reject Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
