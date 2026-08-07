"use client";

const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Droplets = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;
const ChevronLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>;
const FileUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>;

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function SampleManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSamples = async () => {
    try {
      const res = await fetch("/api/laboratory/samples", { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
      if (res.ok) {
        const data = await res.json();
        setSamples(data);
      }
    } catch (e) {
      toast.error("Failed to fetch samples");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleUpdateClick = (smp: any) => {
    setSelectedSample(smp);
    setNewStatus(smp.status);
    setRejectionReason(smp.rejectionReason || "");
    setAssignee(smp.assignedTo || "");
    setSelectedFile(null);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedSample) return;
    setIsUpdating(true);
    try {
      // 1. If assignedTo changed, update assignment
      if (assignee !== (selectedSample.assignedTo || "")) {
        await fetch(`/api/laboratory/samples/${selectedSample.testRequestId}/assign`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
          body: JSON.stringify({ assignee }),
        });
      }

      // 2. If status is Completed and a file is selected, use the report upload endpoint
      if (newStatus === "Completed" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", selectedSample.test + " Report");

        const res = await fetch(`/api/laboratory/samples/${selectedSample.testRequestId}/report`, {
          method: "POST",
          body: formData,
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (res.ok) {
          toast.success("Report uploaded and status set to Completed!");
          setIsUpdateModalOpen(false);
          fetchSamples();
          return;
        } else {
          toast.error("Failed to upload report");
        }
      } else if (newStatus !== selectedSample.status) {
        // 3. Otherwise, just update status
        const payload: any = { status: newStatus };
        if (newStatus === "Rejected") payload.rejectionReason = rejectionReason;

        const res = await fetch(`/api/laboratory/samples/${selectedSample.testRequestId}/status`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          toast.success("Sample updated!");
          setIsUpdateModalOpen(false);
          fetchSamples();
        } else {
          toast.error("Failed to update status");
        }
      } else {
        toast.success("Sample updated!");
        setIsUpdateModalOpen(false);
        fetchSamples();
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredSamples = samples.filter(smp => {
    const matchesSearch = smp.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (smp.sampleType && smp.sampleType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || smp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSamples = filteredSamples.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);

  const statuses = ["All", "Pending Collection", "Sample Collected", "Received in Lab", "Under Testing", "Report Ready", "Completed", "Rejected"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Report Ready": return "bg-teal-50 text-teal-600 border-teal-200";
      case "Under Testing": return "bg-purple-50 text-purple-600 border-purple-200";
      case "Received in Lab": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Sample Collected": return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "Pending Collection": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Rejected": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getSampleIcon = (type: string) => {
    if (!type) return <FlaskConical className="size-5 text-indigo-500" />;
    switch (type.toLowerCase()) {
      case "blood": return <Droplets className="size-5 text-red-500" />;
      default: return <FlaskConical className="size-5 text-indigo-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or sample type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="size-4 text-slate-400 shrink-0" />
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? "bg-[#0891b2] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Sample ID & Type</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSamples.length > 0 ? (
                currentSamples.map((smp) => (
                  <tr key={smp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                          {getSampleIcon(smp.sampleType)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {smp.sampleType || 'Unknown Test'}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {smp.id === smp.testRequestId ? 'Pending' : smp.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">{smp.patientName}</p>
                          <p className="text-[10px] text-slate-500">{smp.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{smp.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="size-4" />
                        {smp.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(smp.status)}`}>
                        {smp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleUpdateClick(smp)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                      >
                        Update <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FlaskConical className="size-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">No samples found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-slate-900">{Math.min(indexOfLastItem, filteredSamples.length)}</span> of <span className="font-medium text-slate-900">{filteredSamples.length}</span> results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? "bg-[#0891b2] text-white border border-[#0891b2]" 
                        : "text-slate-600 border border-transparent hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Sample</DialogTitle>
            <DialogDescription>
              Manage assignment and status for sample <span className="font-bold">{selectedSample?.id === selectedSample?.testRequestId ? 'Pending' : selectedSample?.id}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigned Technician
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Enter technician name..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2] text-sm"
              />
              <div className="mt-1 flex justify-end">
                <button 
                  onClick={() => {
                    const userStr = localStorage.getItem("user");
                    if (userStr) {
                      const user = JSON.parse(userStr);
                      setAssignee(user.name || "Me");
                    } else {
                      setAssignee("Me");
                    }
                  }}
                  className="text-xs text-[#0891b2] font-semibold hover:underline"
                >
                  Assign to me
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2] text-sm"
              >
                <option value="Pending Collection">Pending Collection</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Received in Lab">Received in Lab</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Report Ready">Report Ready</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {newStatus === "Rejected" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the sample was rejected..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm h-20"
                />
              </div>
            )}

            {newStatus === "Completed" && (
              <div className="mt-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">Upload Final Report</p>
                <p className="text-xs text-slate-500 mb-4">Upload PDF or Image file</p>
                
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {selectedFile ? selectedFile.name : "Select File"}
                </button>
              </div>
            )}

          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubmit}
              disabled={isUpdating || (newStatus === "Completed" && !selectedFile)}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0891b2] rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
