"use client";








import { toast } from "sonner";
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
import { useState } from "react";
const initialMockRequests = [
  {
    id: "REQ001",
    name: "City Hospital",
    type: "hospital",
    date: "09 Jun 2026",
    status: "Pending",
  },
  {
    id: "REQ002",
    name: "Dr. Ramesh Kumar",
    type: "doctor",
    date: "08 Jun 2026",
    status: "Pending",
  },
  {
    id: "REQ003",
    name: "Apex Diagnostics",
    type: "lab",
    date: "07 Jun 2026",
    status: "Approved",
  },
  {
    id: "REQ004",
    name: "Care Hospital",
    type: "hospital",
    date: "05 Jun 2026",
    status: "Approved",
  },
];
export default function AccessRequestsPage() {
  const [mockRequests, setMockRequests] = useState(initialMockRequests);
  const handleStatusChange = (id: string, newStatus: string) => {
    setMockRequests((prev) => 
      prev.map((req) => req.id === id ? { ...req, status: newStatus } : req)
    );
    if (newStatus === "Approved") toast.success("Access request approved!");
    if (newStatus === "Rejected") toast.error("Access request rejected!");
  };
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
              {mockRequests.map((request) => {
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
                const style = getIconAndColor(request.type);
                const Icon = style.icon;
                return (
                <tr key={request.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className={`size-10 ${style.bg} ${style.text} rounded-xl flex items-center justify-center border ${style.border}`}>
                       <Icon className="size-5" />
                    </div>
                    {request.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {request.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-tight border ${
                      request.status === "Approved" 
                        ? "bg-white text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {request.status === "Approved" ? <ShieldCheck className="size-3" /> : <Clock className="size-3" />}
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {request.status === "Pending" ? (
                        <>
                          <button 
                            onClick={() => handleStatusChange(request.id, "Approved")}
                            className="px-3 py-1.5 bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="size-3.5" /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(request.id, "Rejected")}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <XCircle className="size-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => toast.info("Viewing details for " + request.name)}
                          className="px-4 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="size-3.5" /> View
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
