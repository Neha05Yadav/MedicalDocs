"use client";

import { useState } from "react";
import { 
  Search, RefreshCw, Eye, User, Calendar, Clock, ChevronDown, CheckCircle2, X
} from "lucide-react";

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
    verifiedBy: "Admin User"
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
    verifiedBy: "-"
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
    verifiedBy: "Admin User"
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
    verifiedBy: "-"
  },
];

export default function PatientSearchVerificationPage() {
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(mockPatients[0]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("Patient ID");
  const [department, setDepartment] = useState("Select Department");
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

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

    if (department !== "Select Department") {
      result = result.filter(p => p.department === department);
    }

    setFilteredPatients(result);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchBy("Patient ID");
    setDepartment("Select Department");
    setFilteredPatients(mockPatients);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fc] min-h-screen font-sans text-slate-800">
      
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Patient Search & Verification</h1>
          <p className="text-sm text-slate-500 mt-1">Search and verify patients to access their medical records</p>
        </div>
      </header>

      {/* Search Patient Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-[#1e5eff] font-semibold text-base mb-5">Search Patient</h2>
        
        <div className="flex flex-wrap items-end gap-6">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search By</label>
            <div className="relative">
              <select 
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
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
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
            />
          </div>

          <div className="w-full md:w-56">
            <label className="block text-sm font-medium text-slate-700 mb-2">Department (Optional)</label>
            <div className="relative">
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
              >
                <option>Select Department</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleSearch}
              className="flex-1 md:flex-none px-6 py-2.5 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="size-4" />
              Search
            </button>
            <button 
              onClick={handleReset}
              className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="size-4 text-[#1e5eff]" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-[#1e5eff] font-semibold text-base mb-5">Search Results</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="pb-3 px-4">Patient ID</th>
                <th className="pb-3 px-4">Patient Name</th>
                <th className="pb-3 px-4">Mobile Number</th>
                <th className="pb-3 px-4">Department</th>
                <th className="pb-3 px-4">Registration Date</th>
                <th className="pb-3 px-4 text-center">Verification Status</th>
                <th className="pb-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-600">{patient.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-800">{patient.name}</td>
                    <td className="py-4 px-4 text-slate-600">{patient.mobile}</td>
                    <td className="py-4 px-4 text-slate-600">{patient.department}</td>
                    <td className="py-4 px-4 text-slate-600">{patient.regDate}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${
                        patient.status === "Verified" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleSelectPatient(patient)}
                        className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                      >
                        <Eye className="size-4" />
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
            <h2 className="text-[#1e5eff] font-semibold text-base">Patient Details</h2>
            <button className="px-4 py-2 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              Request Report Access
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-full bg-blue-100 text-[#1e5eff] flex items-center justify-center">
                  <User className="size-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#1a2b4b]">{selectedPatient.name}</h3>
                    {selectedPatient.status === "Verified" && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[10px] font-bold uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Patient ID: {selectedPatient.id}</p>
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
              <h3 className="text-[#1e5eff] font-semibold text-sm mb-5">Verification</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      selectedPatient.status === "Verified" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
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
