"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle,
  Play
} from "lucide-react";
import EscalationDetailsClient from "./EscalationDetailsClient";

export default function AssignedEscalationsClient({ role, initialData }: { role: "admin" | "accounts", initialData: any[] }) {
  const [escalations, setEscalations] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEscalationId, setSelectedEscalationId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then(response => { if (!response.ok) throw new Error("Escalations could not be loaded."); return response.json(); })
      .then(data => {
        const tickets = (Array.isArray(data) ? data : []).filter((ticket: any) => {
          const assignment = String(ticket.assignedTo || "").toLowerCase();
          const isEscalated = ["HIGH", "CRITICAL"].includes(String(ticket.priority).toUpperCase()) && Boolean(assignment);
          const isAccounts = assignment.includes("account");
          const isAdminHandoff = assignment.includes("admin") || assignment.includes("development") || assignment.includes("engineering") || assignment.includes("security");
          return isEscalated && (role === "accounts" ? isAccounts : isAdminHandoff);
        }).map((ticket: any) => ({ id: ticket.id, ticketId: ticket.ticketId, user: ticket.userName || "Unknown user", userRole: ticket.userRole || "User", issue: ticket.subject, status: ticket.status, priority: ticket.priority, assignedBy: "Support workflow", assignedDate: ticket.updatedAt || ticket.createdAt }));
        setEscalations(tickets);
      })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Escalations could not be loaded."));
  }, [role]);

  const filteredEscalations = escalations.filter(esc => 
    esc.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    esc.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    esc.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = escalations.filter(e => e.status === "Pending").length;
  const inProgressCount = escalations.filter(e => e.status === "In Progress").length;
  const resolvedCount = escalations.filter(e => e.status === "Resolved").length;

  const handleAction = async (id: string, newStatus: string, message: string) => {
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/api/support-tickets/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: newStatus }) });
    if (!response.ok) return toast.error("Escalation status could not be updated.");
    setEscalations(prev => prev.map(esc => esc.id === id ? { ...esc, status: newStatus } : esc));
    toast.success(message);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Assigned Escalated Cases</h1>
        <p className="text-slate-500">Review and resolve support tickets escalated to the {role === "admin" ? "Admin" : "Accounts"} team.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 mb-2">Total Assigned Cases</div>
          <div className="text-3xl font-bold text-slate-900">{escalations.length}</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-6 shadow-sm">
          <div className="text-sm font-semibold text-orange-600 mb-2">Pending</div>
          <div className="text-3xl font-bold text-orange-700">{pendingCount}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 shadow-sm">
          <div className="text-sm font-semibold text-blue-600 mb-2">In Progress</div>
          <div className="text-3xl font-bold text-blue-700">{inProgressCount}</div>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 shadow-sm">
          <div className="text-sm font-semibold text-emerald-600 mb-2">Resolved</div>
          <div className="text-3xl font-bold text-emerald-700">{resolvedCount}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by ID, Ticket, or User..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 grid grid-cols-6 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
          <div>Case ID</div>
          <div className="col-span-2">User & Issue</div>
          <div>Status</div>
          <div>Priority</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredEscalations.map((esc) => (
            <div key={esc.id} className="px-6 py-5 grid grid-cols-6 items-center text-sm gap-4 hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="font-bold text-slate-900 mb-1">{esc.id}</div>
                <div className="text-xs font-medium text-slate-400">Ref: {esc.ticketId}</div>
              </div>
              <div className="col-span-2 pr-4">
                <div className="font-bold text-slate-900 truncate mb-1">{esc.user} ({esc.userRole})</div>
                <div className="text-xs font-medium text-slate-500 truncate" title={esc.issue}>{esc.issue}</div>
              </div>
              <div>
                <Badge variant={esc.status === 'Pending' ? 'destructive' : esc.status === 'In Progress' ? 'default' : 'secondary'} className={esc.status === 'In Progress' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none' : esc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' : ''}>
                  {esc.status}
                </Badge>
              </div>
              <div>
                <span className={`font-semibold text-xs px-2 py-1 rounded-full ${esc.priority === 'High' || esc.priority === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {esc.priority}
                </span>
              </div>
              <div className="flex justify-end items-center gap-2">
                {esc.status === "Pending" && (
                  <button 
                    onClick={() => handleAction(esc.id, "In Progress", "Case Accepted and Marked In Progress")}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Accept Case"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {esc.status === "In Progress" && (
                  <button 
                    onClick={() => handleAction(esc.id, "Resolved", "Case Marked as Resolved")}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Mark Resolved"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setSelectedEscalationId(esc.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="View Details">
                    <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredEscalations.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No assigned escalations found matching your criteria.
            </div>
          )}
        </div>
      </div>
      {selectedEscalationId && <EscalationDetailsClient role={role} id={selectedEscalationId} onClose={() => setSelectedEscalationId(null)} />}
    </div>
  );
}
