"use client";

import { useState } from "react";
import { 
  Stethoscope, Search, Edit2, Trash2, X, Plus, 
  CheckCircle2, AlertCircle, ShieldAlert
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  department: string;
  patients: number;
  status: "Active" | "On Leave";
}

const initialDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Jenkins", department: "Cardiology", patients: 142, status: "Active" },
  { id: "d2", name: "Dr. Alan Watts", department: "Neurology", patients: 98, status: "Active" },
  { id: "d3", name: "Dr. Priya Patel", department: "Orthopedics", patients: 76, status: "On Leave" },
  { id: "d4", name: "Dr. Michael Brown", department: "Pediatrics", patients: 124, status: "Active" },
  { id: "d5", name: "Dr. Emily Chen", department: "Cardiology", patients: 89, status: "Active" },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentDoctor, setCurrentDoctor] = useState<Partial<Doctor>>({});

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this doctor?")) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentDoctor({ name: "", department: "", patients: 0, status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setModalMode("edit");
    setCurrentDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoctor.name || !currentDoctor.department) return;

    if (modalMode === "add") {
      const newDoc: Doctor = {
        id: Math.random().toString(36).substr(2, 9),
        name: currentDoctor.name,
        department: currentDoctor.department,
        patients: Number(currentDoctor.patients) || 0,
        status: currentDoctor.status as "Active" | "On Leave" || "Active"
      };
      setDoctors([...doctors, newDoc]);
    } else {
      setDoctors(doctors.map(d => d.id === currentDoctor.id ? { ...d, ...currentDoctor } as Doctor : d));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-slate-50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage hospital doctors, their departments, and statuses.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#1e5eff] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="size-4" />
            Add Doctor
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Patients</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {d.name.split(" ").map(n => n[0]).join("").substring(0,2)}
                        </div>
                        <span className="font-medium text-slate-900">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{d.department}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{d.patients}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                        d.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {d.status === "Active" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(d)}
                          className="p-1.5 text-slate-400 hover:text-[#1e5eff] hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Doctor"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <ShieldAlert className="size-8 mx-auto mb-3 text-slate-300" />
                    <p>No doctors found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Stethoscope className="size-5 text-[#1e5eff]" />
                {modalMode === "add" ? "Add New Doctor" : "Edit Doctor Details"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                <input 
                  required
                  type="text" 
                  value={currentDoctor.name || ""}
                  onChange={(e) => setCurrentDoctor({...currentDoctor, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. Dr. Jane Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department *</label>
                <select 
                  required
                  value={currentDoctor.department || ""}
                  onChange={(e) => setCurrentDoctor({...currentDoctor, department: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Patients Handled</label>
                  <input 
                    type="number" 
                    min="0"
                    value={currentDoctor.patients || 0}
                    onChange={(e) => setCurrentDoctor({...currentDoctor, patients: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select 
                    value={currentDoctor.status || "Active"}
                    onChange={(e) => setCurrentDoctor({...currentDoctor, status: e.target.value as "Active" | "On Leave"})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-2 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#1e5eff] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {modalMode === "add" ? "Add Doctor" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
