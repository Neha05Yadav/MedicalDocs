"use client";

import { useState } from "react";
import { 
  Users, User, Search, Filter, Mail, Phone, Calendar, 
  MapPin, Activity, CheckCircle2, ShieldCheck, X, FileText, Download, Eye
} from "lucide-react";
import { toast } from "sonner";

// Mock Data
const labPatients = [
  { id: "PAT001", name: "Rahul Sharma", age: 45, gender: "Male", phone: "+91 9876543210", email: "rahul@example.com", lastTest: "11 Jun 2026", status: "Authorized" },
  { id: "PAT002", name: "Priya Singh", age: 32, gender: "Female", phone: "+91 9876543211", email: "priya@example.com", lastTest: "10 Jun 2026", status: "Authorized" },
  { id: "PAT003", name: "Amit Kumar", age: 58, gender: "Male", phone: "+91 9876543212", email: "amit@example.com", lastTest: "09 Jun 2026", status: "Unauthorized" },
  { id: "PAT004", name: "Neha Gupta", age: 29, gender: "Female", phone: "+91 9876543213", email: "neha@example.com", lastTest: "08 Jun 2026", status: "Unauthorized" },
  { id: "PAT005", name: "Sanjay Verma", age: 50, gender: "Male", phone: "+91 9876543214", email: "sanjay@example.com", lastTest: "07 Jun 2026", status: "Authorized" },
];

export default function LabPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Authorized" | "Unauthorized">("All");
  
  // Modal state
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedPatientForAccess, setSelectedPatientForAccess] = useState<any>(null);
  
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedPatientForReports, setSelectedPatientForReports] = useState<any>(null);

  const filteredPatients = labPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.phone.includes(searchTerm);
    const matchesTab = filterTab === "All" || patient.status === filterTab;
    return matchesSearch && matchesTab;
  });

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAccessModalOpen(false);
    toast.success(`Access request sent to ${selectedPatientForAccess?.name}`);
  };

  const openAccessModal = (patient: any) => {
    setSelectedPatientForAccess(patient);
    setIsAccessModalOpen(true);
  };

  const openReportsModal = (patient: any) => {
    setSelectedPatientForReports(patient);
    setIsReportsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Lab Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient records and request access to medical history.</p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {(["All", "Authorized", "Unauthorized"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`flex-1 md:px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                filterTab === tab ? "bg-white text-[#1e5eff] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name, ID, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group flex flex-col">
            <div className="p-6 pb-4 border-b border-slate-50 relative flex-1">
              <div className="absolute top-4 right-4">
                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  patient.status === "Authorized" 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  {patient.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`size-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border ${
                  patient.status === "Authorized" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1e5eff] transition-colors leading-tight">{patient.name}</h3>
                  <div className="text-xs text-slate-500 font-medium font-mono mt-0.5">{patient.id}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="size-4 text-slate-400" />
                  <span>{patient.age} years, {patient.gender}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="size-4 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="size-4 text-slate-400" />
                  <span>Last test: <span className="font-medium text-slate-900">{patient.lastTest}</span></span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 mt-auto border-t border-slate-100 flex gap-3">
              {patient.status === "Authorized" ? (
                <button 
                  onClick={() => openReportsModal(patient)}
                  className="flex-1 py-2 bg-white border border-slate-200 hover:border-[#1e5eff] text-slate-700 hover:text-[#1e5eff] rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  View Past Reports
                </button>
              ) : (
                <button 
                  onClick={() => openAccessModal(patient)}
                  className="flex-1 py-2 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="size-4" /> Request Access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <Users className="size-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No patients found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Request Access Modal */}
      {isAccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Request Data Access</h3>
              </div>
              <button 
                onClick={() => setIsAccessModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleRequestAccess} className="p-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-600 mb-1">Patient</p>
                <p className="font-bold text-slate-900">{selectedPatientForAccess?.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedPatientForAccess?.id}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Request *</label>
                  <select required className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]">
                    <option value="">Select a reason</option>
                    <option value="baseline">Comparing Baseline Results</option>
                    <option value="history">Reviewing Past Medical History</option>
                    <option value="verification">Test Verification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message to Patient (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Briefly explain why you need access to their past reports..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff] resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAccessModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#1e5eff] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {isReportsModalOpen && selectedPatientForReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Past Reports</h3>
                  <p className="text-xs text-slate-500">{selectedPatientForReports.name} • {selectedPatientForReports.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsReportsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {[
                  { id: "R1", name: "Complete Blood Count", date: "11 Jun 2026", facility: "Apex Labs", type: "Blood Test" },
                  { id: "R2", name: "Lipid Profile", date: "05 May 2026", facility: "City Hospital", type: "Blood Test" },
                  { id: "R3", name: "Chest X-Ray", date: "20 Jan 2026", facility: "Care Hospital", type: "Imaging" },
                ].map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{report.name}.pdf</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase tracking-wider">{report.type}</span>
                          <span className="text-xs font-medium text-slate-500">{report.date} • {report.facility}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-[#1e5eff] hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye className="size-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-[#1e5eff] hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                        <Download className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
