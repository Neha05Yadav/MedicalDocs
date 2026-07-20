"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const teams = ["Accounts Team", "Admin Team", "Development Team"];

export default function NewEscalationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketId, setTicketId] = useState(params.get("ticket") || "");
  const [team, setTeam] = useState(teams[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { const token = localStorage.getItem("token") || ""; fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` } }).then(response => response.json()).then(rows => setTickets(Array.isArray(rows) ? rows : [])).catch(() => toast.error("Tickets could not be loaded.")); }, []);
  const selected = tickets.find(ticket => ticket.id === ticketId);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (!ticketId || !notes.trim()) return toast.error("Select a ticket and add investigation notes."); setSaving(true); try { const token = localStorage.getItem("token") || ""; const response = await fetch(`/api/support-tickets/${ticketId}/details`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ assignedTo: team, internalNotes: notes }) }); if (!response.ok) throw new Error("Escalation could not be saved."); toast.success("Ticket assigned successfully."); router.push("/management/support/escalations"); } catch (error) { toast.error(error instanceof Error ? error.message : "Escalation failed."); } finally { setSaving(false); } };
  return <div className="min-h-screen p-6 md:p-8"><div className="mx-auto max-w-3xl"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-rose-600">Live support workflow</p><h1 className="mt-1 text-3xl font-black text-slate-900">Assign escalation</h1><p className="mt-1 text-sm text-slate-500">Choose an existing support ticket and persist its assignment.</p></div><form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><label className="block text-sm font-bold text-slate-700">Support ticket<select value={ticketId} onChange={event => setTicketId(event.target.value)} required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4"><option value="">Select a real ticket</option>{tickets.map(ticket => <option key={ticket.id} value={ticket.id}>{ticket.ticketId} · {ticket.subject}</option>)}</select></label>{selected && <div className="rounded-xl bg-slate-50 p-4"><div className="flex justify-between gap-4"><b>{selected.userName}</b><span className="font-bold text-rose-600">{selected.priority}</span></div><p className="mt-2 text-sm text-slate-600">{selected.description}</p></div>}<label className="block text-sm font-bold text-slate-700">Assigned team<select value={team} onChange={event => setTeam(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4">{teams.map(value => <option key={value}>{value}</option>)}</select></label><label className="block text-sm font-bold text-slate-700">Internal investigation notes<textarea value={notes} onChange={event => setNotes(event.target.value)} required rows={5} className="mt-2 w-full rounded-xl border border-slate-200 p-4" placeholder="Add the reason and required follow-up action" /></label><button disabled={saving} className="w-full rounded-xl bg-slate-900 px-5 py-3.5 font-bold text-white disabled:opacity-50">{saving ? "Saving assignment…" : "Assign escalation"}</button></form></div></div>;
}
