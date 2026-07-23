"use client";









const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AccessRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const XIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      const res = await fetch("/api/patient/access-requests", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load access requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/patient/access-requests/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      setRequests((prev) => 
        prev.map((req) => req.id === id ? { ...req, status: newStatus } : req)
      );
      if (newStatus === "APPROVED") toast.success("Access request approved!");
      if (newStatus === "REJECTED") toast.error("Access request rejected!");
    } catch (e) {
      toast.error("Failed to process action");
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Hospital/Doctor/Lab</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => {
                const getIconAndColor = (type: string) => {
                  switch (type) {
                    case 'doctor':
                      return { icon: Stethoscope, bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100/50' };
                    case 'lab':
                      return { icon: FlaskConical, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100/50' };
                    default:
                      return { icon: Building2, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100/50' };
                  }
                };
                // Defaulting type to doctor for now since backend doesn't return type explicitly yet
                const style = getIconAndColor('doctor');
                const Icon = style.icon;
                return (
                <tr key={request.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className={`size-10 ${style.bg} ${style.text} rounded-xl flex items-center justify-center border ${style.border}`}>
                       <Icon className="size-5" />
                    </div>
                    {request.doctor} ({request.hospital})
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {request.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-tight border ${
                      request.status === "APPROVED" 
                        ? "bg-white text-emerald-700 border-emerald-200" 
                        : (request.status === "REJECTED" || request.status === "REVOKED" || request.status === "EXPIRED") 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {request.status === "APPROVED" ? <ShieldCheck className="size-3" /> : (request.status === "REJECTED" || request.status === "REVOKED" || request.status === "EXPIRED") ? <XCircle className="size-3" /> : <Clock className="size-3" />}
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {request.status === "PENDING" ? (
                        <>
                          <button 
                            onClick={() => handleStatusChange(request.id, "APPROVED")}
                            className="px-3 py-1.5 bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="size-3.5" /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(request.id, "REJECTED")}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <XCircle className="size-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsViewModalOpen(true);
                            }}
                            className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye className="size-3.5" /> View
                          </button>
                          {request.status === "APPROVED" && (
                            <button
                              onClick={() => handleStatusChange(request.id, "REVOKED")}
                              className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm ml-2"
                            >
                              <XCircle className="size-3.5" /> Revoke
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Details Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Request Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested By</span>
                <p className="text-sm font-medium text-slate-900">{selectedRequest.doctor}</p>
                <p className="text-xs text-slate-600">{selectedRequest.hospital}</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Request Date</span>
                <p className="text-sm font-medium text-slate-900">{selectedRequest.date}</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-tight border ${
                    selectedRequest.status === "APPROVED" 
                      ? "bg-white text-emerald-700 border-emerald-200" 
                      : (selectedRequest.status === "REJECTED" || selectedRequest.status === "REVOKED" || selectedRequest.status === "EXPIRED") 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {selectedRequest.status === "APPROVED" ? <ShieldCheck className="size-3" /> : (selectedRequest.status === "REJECTED" || selectedRequest.status === "REVOKED" || selectedRequest.status === "EXPIRED") ? <XCircle className="size-3" /> : <Clock className="size-3" />}
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested Report Types</span>
                <p className="text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                  {selectedRequest.reportTypes || "All Reports"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</span>
                  <p className="text-sm font-medium text-slate-900">{selectedRequest.priority || "Normal"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Duration</span>
                  <p className="text-sm font-medium text-slate-900">{selectedRequest.duration || "24 Hours"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason for Access</span>
                <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedRequest.purpose || selectedRequest.admissionInfo || "Routine health checkup and consultation access request."}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
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
