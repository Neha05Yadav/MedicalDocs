"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, GitBranch, ShieldAlert, Users } from "lucide-react";
import { toast } from "sonner";

const teams = [
  { value: "Admin Team", label: "Admin Operations", help: "Access, facilities, policy and operational decisions" },
  { value: "Accounts Team", label: "Accounts & Billing", help: "Payments, invoices, refunds and subscriptions" },
  { value: "Development Team", label: "Product Engineering", help: "Application defects, integrations and data-flow failures" },
  { value: "Security Team", label: "Security Response", help: "Privacy, suspicious access and security incidents" },
];

export default function NewEscalationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketId, setTicketId] = useState(params.get("ticket") || "");
  const [team, setTeam] = useState(teams[0].value);
  const [reason, setReason] = useState("");
  const [attempted, setAttempted] = useState("");
  const [requestedAction, setRequestedAction] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(rows => setTickets((Array.isArray(rows) ? rows : []).filter(ticket => !["resolved", "closed"].includes(String(ticket.status).toLowerCase()))))
      .catch(() => toast.error("Unresolved tickets could not be loaded."));
  }, []);

  const selected = tickets.find(ticket => ticket.id === ticketId);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ticketId || !reason.trim() || !attempted.trim() || !requestedAction.trim()) return toast.error("Complete the handoff information before escalating.");
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      const notes = `ESCALATION REASON\n${reason.trim()}\n\nSUPPORT ACTIONS ATTEMPTED\n${attempted.trim()}\n\nSPECIALIST ACTION REQUIRED\n${requestedAction.trim()}`;
      const detailsResponse = await fetch(`/api/support-tickets/${encodeURIComponent(ticketId)}/details`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ assignedTo: team, internalNotes: notes }) });
      if (!detailsResponse.ok) throw new Error("Escalation handoff could not be saved.");
      const statusResponse = await fetch(`/api/support-tickets/${encodeURIComponent(ticketId)}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: "Escalated" }) });
      if (!statusResponse.ok) throw new Error("Escalation status could not be updated.");
      toast.success(`Case handed to ${team}.`);
      router.push("/management/support/escalations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Escalation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-5 md:p-7">
      <div className="mx-auto max-w-6xl">
        <Link href="/management/support/escalations" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700"><ArrowLeft className="size-4" /> Back to escalation desk</Link>
        <div className="mt-5 grid overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_25px_70px_-45px_rgba(15,23,42,.5)] lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="bg-[linear-gradient(155deg,#071827,#0d3942)] p-7 text-white">
            <span className="grid size-12 place-items-center rounded-xl bg-teal-300/10 text-teal-300"><GitBranch className="size-6" /></span><h1 className="mt-6 text-3xl font-black tracking-[-.04em]">Create a specialist handoff.</h1><p className="mt-3 text-sm leading-6 text-slate-300">Escalation transfers action—not accountability. Support continues tracking the case until closure.</p>
            <div className="mt-8 space-y-5">{[{ icon: ClipboardCheck, title: "Document investigation", text: "Record what Support already attempted." }, { icon: Users, title: "Choose accountable owner", text: "Route it to the team that can act." }, { icon: CheckCircle2, title: "Define the outcome", text: "State exactly what resolution is needed." }].map(item => <div key={item.title} className="flex gap-3"><item.icon className="mt-0.5 size-5 shrink-0 text-teal-300" /><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p></div></div>)}</div>
          </aside>
          <form onSubmit={submit} className="space-y-6 p-6 md:p-8">
            <div><p className="text-xs font-black uppercase tracking-[.15em] text-teal-700">Handoff record</p><h2 className="mt-1 text-2xl font-black text-slate-900">Escalation details</h2></div>
            <Field label="Unresolved support ticket"><select value={ticketId} onChange={event => setTicketId(event.target.value)} required className="control"><option value="">Select a ticket</option>{tickets.map(ticket => <option key={ticket.id} value={ticket.id}>{ticket.ticketId} · {ticket.subject}</option>)}</select></Field>
            {selected && <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-mono text-xs font-bold text-amber-800">{selected.ticketId}</p><p className="mt-1 font-extrabold text-slate-900">{selected.subject}</p></div><span className="h-fit rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-rose-700">{selected.priority}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{selected.description}</p></div>}
            <Field label="Accountable specialist team"><div className="grid gap-3 sm:grid-cols-2">{teams.map(option => <button type="button" key={option.value} onClick={() => setTeam(option.value)} className={`rounded-xl border p-4 text-left transition ${team === option.value ? "border-teal-500 bg-teal-50 ring-4 ring-teal-500/10" : "border-slate-200 hover:border-slate-300"}`}><p className="text-sm font-extrabold text-slate-900">{option.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{option.help}</p></button>)}</div></Field>
            <div className="grid gap-5 md:grid-cols-2"><Field label="Why Support cannot resolve this"><textarea value={reason} onChange={event => setReason(event.target.value)} required rows={5} className="control resize-none" placeholder="Describe the blocker, risk or authority required" /></Field><Field label="Actions already attempted"><textarea value={attempted} onChange={event => setAttempted(event.target.value)} required rows={5} className="control resize-none" placeholder="Troubleshooting, communication and evidence collected" /></Field></div>
            <Field label="Required specialist outcome"><textarea value={requestedAction} onChange={event => setRequestedAction(event.target.value)} required rows={3} className="control resize-none" placeholder="State the exact decision, fix or follow-up needed" /></Field>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5"><p className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldAlert className="size-4 text-amber-500" /> User-facing ticket remains traceable throughout the handoff.</p><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-teal-800 disabled:opacity-50">{saving ? "Creating handoff..." : "Escalate case"}<ArrowRight className="size-4" /></button></div>
          </form>
        </div>
      </div>
      <style jsx>{`.control{margin-top:.5rem;width:100%;border:1px solid #cbd5e1;border-radius:.75rem;background:white;padding:.8rem 1rem;font-size:.875rem;outline:none;transition:.2s}.control:focus{border-color:#0d9488;box-shadow:0 0 0 4px rgba(13,148,136,.1)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="block text-sm font-extrabold text-slate-700"><span>{label}</span>{children}</div>; }
