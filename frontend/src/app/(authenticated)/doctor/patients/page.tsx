"use client";

import { useState } from "react";
import { 
  Search, UserPlus, MoreVertical, CheckCircle2, Clock, 
  XCircle, FileText, ChevronDown, User, X
} from "lucide-react";

// Mock data matching the UI provided
const mockPatients = [
  { 
    id: "MD1023", 
    name: "Rahul Sharma", 
    mobile: "9876543210", 
    age: 32, 
    gender: "Male",
    status: "Access Approved",
    validTill: "20 Jun 2026",
    avatarBg: "bg-blue-50",
    avatarColor: "text-blue-500"
  },
  { 
    id: "MD1056", 
    name: "Priya Singh", 
    mobile: "9123456780", 
    age: 28, 
    gender: "Female",
    status: "Not Requested",
    avatarBg: "bg-orange-50",
    avatarColor: "text-orange-400"
  },
  { 
    id: "MD1078", 
    name: "Aman Gupta", 
    mobile: "9988776655", 
    age: 45, 
    gender: "Male",
    status: "Pending",
    requestSent: "10 Jun 2026",
    avatarBg: "bg-purple-50",
    avatarColor: "text-purple-500"
  },
  { 
    id: "MD1090", 
    name: "Neha Verma", 
    mobile: "9012345678", 
    age: 36, 
    gender: "Female",
    status: "Access Approved",
    validTill: "15 Jun 2026",
    avatarBg: "bg-red-50",
    avatarColor: "text-red-400"
  },
  { 
    id: "MD1101", 
    name: "Vikram Patel", 
    mobile: "9899989898", 
    age: 50, 
    gender: "Male",
    status: "Rejected",
    rejectedOn: "05 Jun 2026",
    avatarBg: "bg-teal-50",
    avatarColor: "text-teal-500"
  },
];

export default function DoctorPatientsPage() {
  const [activeFilter, setActiveFilter] = useState("All Patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<typeof mockPatients[0] | null>(null);

  const filters = [
    { name: "All Patients", count: 24, badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
    { name: "Access Approved", count: 8, badgeBg: "bg-green-100", badgeText: "text-green-700" },
    { name: "Pending Requests", count: 6, badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
    { name: "Rejected", count: 2, badgeBg: "bg-red-100", badgeText: "text-red-700" },
  ];

  const handleOpenModal = (patient: typeof mockPatients[0] | null = null) => {
    setSelectedPatientForModal(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatientForModal(null);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-white min-h-screen">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Patient ID or Mobile Number" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#0052cc] hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <UserPlus className="size-4" /> Request Access
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                activeFilter === filter.name 
                  ? "bg-blue-50 border-blue-100 text-[#0052cc]" 
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
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 self-start md:self-auto">
          <span className="text-slate-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg></span>
          Sort by: Recent
          <ChevronDown className="size-4 text-slate-500 ml-1" />
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col hover:border-blue-200 transition-colors">
            
            {/* Header: Avatar, Info, Menu */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`size-14 rounded-full flex items-center justify-center shrink-0 ${patient.avatarBg} ${patient.avatarColor}`}>
                <User className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{patient.name}</h3>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="size-5" /></button>
                </div>
                <div className="text-sm text-slate-500 mt-1 space-y-1">
                  <p>Patient ID: {patient.id}</p>
                  <p>Mobile: {patient.mobile}</p>
                  <p>Age: {patient.age} • {patient.gender}</p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="mb-6 flex-1">
              {patient.status === "Access Approved" && (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold mb-2">
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
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {patient.status === "Access Approved" && (
                <>
                  <button className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#0052cc] text-[#0052cc] font-semibold text-sm hover:bg-blue-50 transition-colors">
                    View Records
                  </button>
                  <button className="p-2.5 rounded-xl border-2 border-[#0052cc] text-[#0052cc] hover:bg-blue-50 transition-colors">
                    <FileText className="size-5" />
                  </button>
                </>
              )}
              {patient.status === "Not Requested" && (
                <button 
                  onClick={() => handleOpenModal(patient)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-blue-800 text-white font-semibold text-sm transition-colors"
                >
                  Request Access
                </button>
              )}
              {patient.status === "Pending" && (
                <button className="w-full py-2.5 px-4 rounded-xl border-2 border-[#0052cc] text-[#0052cc] font-semibold text-sm hover:bg-blue-50 transition-colors">
                  View Request
                </button>
              )}
              {patient.status === "Rejected" && (
                <button className="w-full py-2.5 px-4 rounded-xl border-2 border-[#0052cc] text-[#0052cc] font-semibold text-sm hover:bg-blue-50 transition-colors">
                  View Details
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Request Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Request Access</h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Patient</label>
                <input 
                  type="text" 
                  readOnly 
                  value={selectedPatientForModal ? `${selectedPatientForModal.name} (${selectedPatientForModal.id})` : ""}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reason for Access</label>
                <div className="relative">
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]">
                    <option>Consultation / Treatment</option>
                    <option>Second Opinion</option>
                    <option>Emergency Care</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration</label>
                <div className="relative">
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]">
                    <option>7 Days</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>Permanent</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Additional Note (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Required to review previous reports for better diagnosis."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc]"
                ></textarea>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 border border-slate-200 bg-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0052cc] hover:bg-blue-800 rounded-xl transition-colors shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
