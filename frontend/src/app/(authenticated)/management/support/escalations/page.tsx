"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EscalationManagement() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Escalations could not be loaded.");
        return response.json();
      })
      .then((rows) => {
        const allTickets = Array.isArray(rows) ? rows : [];
        setTickets(allTickets.filter((ticket) => ["high", "critical"].includes(String(ticket.priority).toLowerCase())));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading live escalations…</div>;
  return <div className="min-h-screen p-6 md:p-8"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-rose-600">Priority queue</p><h1 className="mt-1 text-3xl font-black text-slate-900">Active escalations</h1><p className="mt-1 text-sm text-slate-500">High and critical support tickets from MySQL.</p></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[8rem_1fr_8rem_8rem] gap-4 border-b bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Ticket</span><span>Issue</span><span>Priority</span><span>Status</span></div>{tickets.map(ticket => <Link href={`/management/support/tickets/${encodeURIComponent(String(ticket.status).toLowerCase())}?ticket=${ticket.id}`} key={ticket.id} className="grid grid-cols-[8rem_1fr_8rem_8rem] gap-4 border-b border-slate-100 px-5 py-5 text-sm transition hover:bg-cyan-50/40"><b className="text-cyan-700">{ticket.ticketId}</b><span><b className="block text-slate-900">{ticket.subject}</b><small className="text-slate-500">{ticket.userName} · {ticket.category}</small></span><span className="font-bold text-rose-600">{ticket.priority}</span><span className="text-slate-600">{ticket.status}</span></Link>)}{!tickets.length && <div className="p-12 text-center text-sm text-slate-500">No high-priority escalations are currently recorded.</div>}</div></div>;
}
