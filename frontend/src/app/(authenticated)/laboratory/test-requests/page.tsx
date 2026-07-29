"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const PlayCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path><circle cx="12" cy="12" r="10"></circle></svg>;
const MoreVertical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>;
const ChevronLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;

export default function TestRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [testRequests, setTestRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTestRequests();
    const interval = window.setInterval(fetchTestRequests, 15000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") fetchTestRequests();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", fetchTestRequests);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", fetchTestRequests);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchTestRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/laboratory/test-requests", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTestRequests(data);
      }
    } catch (e) {
      toast.error("Failed to fetch test requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/laboratory/test-requests/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Request marked as ${newStatus}`);
        fetchTestRequests();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      toast.error("Error updating status");
    }
  };

  const handleUploadReport = async (e: React.ChangeEvent<HTMLInputElement>, req: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      e.target.value = '';
      return;
    }

    setUploadingId(req.id);
    toast.loading("Uploading report...", { id: "upload-toast" });
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientId", req.patientId);
      formData.append("title", `${req.testType} Report`);
      formData.append("category", req.testType);
      formData.append("linkedRequestId", req.id);

      const res = await fetch("/api/laboratory/reports", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Report uploaded and request completed!", { id: "upload-toast" });
        fetchTestRequests();
      } else {
        const payload = await res.json().catch(() => null);
        toast.error(payload?.message || "Failed to upload report", { id: "upload-toast" });
      }
    } catch (err) {
      toast.error("Error uploading report", { id: "upload-toast" });
    } finally {
      setUploadingId(null);
    }
  };

  const filteredRequests = testRequests.filter(req => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statuses = ["All", "Pending", "Accepted", "Tested", "Completed"];
  
  const pendingCount = testRequests.filter(r => r.status === "Pending").length;
  const acceptedCount = testRequests.filter(r => r.status === "Accepted").length;
  const testedCount = testRequests.filter(r => r.status === "Tested").length;
  const completedCount = testRequests.filter(r => r.status === "Completed").length;

  const summaryCards = [
    { label: "Pending", value: pendingCount, icon: Clock, color: "border-amber-500", bgColor: "bg-amber-50 text-amber-600" },
    { label: "Accepted", value: acceptedCount, icon: FileText, color: "border-cyan-500", bgColor: "bg-cyan-50 text-cyan-600" },
    { label: "Tested", value: testedCount, icon: PlayCircle, color: "border-purple-500", bgColor: "bg-purple-50 text-purple-600" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "border-emerald-500", bgColor: "bg-white text-emerald-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-white text-emerald-600 border-emerald-200";
      case "Tested": return "bg-purple-50 text-purple-600 border-purple-200";
      case "Accepted": return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 min-h-screen">Loading test requests...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className={`p-5 bg-white border-t-4 border border-slate-200 shadow-sm rounded-xl ${card.color} hover:shadow-md transition-shadow cursor-pointer`} onClick={() => setStatusFilter(card.label)}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or test type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="size-4 text-slate-400" />
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
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Patient Info</th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4">Test Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Upload</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{req.id.split('-')[0]}...</span>
                      <div className="text-xs text-slate-400 mt-1.5">{req.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-xs">
                          {req.patientName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{req.patientName}</p>
                          <p className="text-[10px] text-slate-500">{req.patientId.split('-')[0]}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 text-xs">{req.clinicName}</p>
                      <p className="text-[10px] text-slate-500">{req.doctorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{req.testType}</div>
                      {req.priority === "High" && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">HIGH PRIORITY</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[180px]">
                      {req.status !== "Completed" && req.status !== "Cancelled" ? (
                        <div className="relative">
                          {uploadingId === req.id ? (
                            <span className="text-[10px] font-bold text-[#0891b2] animate-pulse">UPLOADING...</span>
                          ) : (
                            <input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              onChange={(e) => handleUploadReport(e, req)}
                              className="block w-full text-xs text-slate-500
                                file:mr-2 file:py-1.5 file:px-3
                                file:rounded-full file:border-0
                                file:text-[10px] file:font-semibold
                                file:bg-cyan-50 file:text-[#0891b2]
                                hover:file:bg-cyan-100 cursor-pointer"
                            />
                          )}
                        </div>
                      ) : req.status === "Completed" ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">UPLOADED</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                            className="cursor-pointer gap-2"
                          >
                            <Eye className="size-4 text-slate-500" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          
                          {req.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => updateStatus(req.id, "Accepted")} className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-600">
                                <Check className="size-4" />
                                <span>Accept Request</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(req.id, "Cancelled")} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                                <X className="size-4" />
                                <span>Reject Request</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {req.status === "Accepted" && (
                            <DropdownMenuItem onClick={() => updateStatus(req.id, "Tested")} className="cursor-pointer gap-2 text-[#0891b2] focus:text-[#0891b2]">
                              <PlayCircle className="size-4" />
                              <span>Mark as Tested</span>
                            </DropdownMenuItem>
                          )}
                          
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Activity className="size-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-600">No test requests found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> of <span className="font-bold text-slate-900">{filteredRequests.length}</span> entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="size-4" /> Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`size-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors shadow-sm border ${
                          currentPage === page 
                            ? "bg-[#0891b2] text-white border-[#0891b2]" 
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 || 
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-1 text-slate-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="size-5 text-[#0891b2]" />
                Test Request — Full Details
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Test Info Card */}
              <div className="bg-gradient-to-br from-cyan-50 to-slate-50 p-5 rounded-xl border border-cyan-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-xl text-slate-900">{selectedRequest.testType}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono bg-white/60 inline-block px-2 py-0.5 rounded">Request ID: REQ-{selectedRequest.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-lg">
                    <Clock className="size-4 text-cyan-500"/>
                    <span className="font-medium">Date:</span> {selectedRequest.date}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-lg">
                    <Activity className="size-4 text-cyan-500"/> 
                    <span className="font-medium">Priority:</span> 
                    <span className={selectedRequest.priority === 'High' ? 'text-red-600 font-bold' : 'font-semibold'}>{selectedRequest.priority}</span>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Patient Details */}
                <div className="border border-slate-100 p-4 rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <h5 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="size-4"/> Patient Information
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                        {selectedRequest.patientName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{selectedRequest.patientName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {selectedRequest.patientId}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-slate-50 px-3 py-2 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Age</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedRequest.patientAge}</p>
                      </div>
                      <div className="bg-slate-50 px-3 py-2 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Gender</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedRequest.patientGender}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
                      <p className="text-sm font-semibold text-slate-800">{selectedRequest.patientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Source Details */}
                <div className="border border-slate-100 p-4 rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Building2 className="size-4"/> Request Origin
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Source Facility</p>
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Building2 className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{selectedRequest.clinicName}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {selectedRequest.clinicType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Referring Doctor</p>
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Stethoscope className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{selectedRequest.doctorName}</p>
                          <p className="text-[10px] text-slate-500">Dept: {selectedRequest.doctorDepartment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
