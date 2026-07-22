"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, GitBranch, LifeBuoy, Search, Send, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";

const ESCALATION_TEAMS = ["Admin Team", "Accounts Team", "Development Team", "Engineering Team", "Security Team"];
const isClosed = (ticket: any) => ["resolved", "closed"].includes(String(ticket.status).toLowerCase());
const isHandoff = (ticket: any) => ESCALATION_TEAMS.some(team => team.toLowerCase() === String(ticket.assignedTo || "").toLowerCase());

export default function EscalationManagement() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!response.ok) throw new Error("Escalation workflow could not be loaded.");
      const payload = await response.json();
      setTickets(Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Escalations could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unresolved = useMemo(() => tickets.filter(ticket => !isClosed(ticket) && !isHandoff(ticket)), [tickets]);
  const activeHandoffs = useMemo(() => tickets.filter(ticket => isHandoff(ticket) && !isClosed(ticket)), [tickets]);
  const completedHandoffs = useMemo(() => tickets.filter(ticket => isHandoff(ticket) && isClosed(ticket)), [tickets]);
  const filteredHandoffs = activeHandoffs.filter(ticket => `${ticket.ticketId} ${ticket.subject} ${ticket.assignedTo} ${ticket.userName}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen p-5 md:p-7">
      <section className="overflow-hidden rounded-[1.6rem] bg-[linear-gradient(120deg,#071827,#0c3340_62%,#0f766e)] p-6 text-white shadow-[0_24px_60px_-35px_rgba(15,118,110,.65)] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-200/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-teal-100"><GitBranch className="size-3.5" /> Specialist handoff desk</span><h1 className="mt-5 text-3xl font-black tracking-[-.04em] md:text-4xl">Escalate only what Support cannot resolve.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Capture the investigation, route the case to the accountable team, and retain ownership until the customer receives a verified resolution.</p></div>
          <Link href="/management/support/escalations/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-teal-50">Create handoff <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-4">
          {[{ n: "01", t: "Investigate", d: "Attempt support resolution" }, { n: "02", t: "Document", d: "Capture evidence and impact" }, { n: "03", t: "Route", d: "Assign accountable team" }, { n: "04", t: "Verify", d: "Track through closure" }].map(step => <div key={step.n} className="rounded-xl border border-white/10 bg-white/[.055] p-4"><span className="text-[10px] font-black tracking-[.18em] text-teal-300">STEP {step.n}</span><p className="mt-2 text-sm font-extrabold">{step.t}</p><p className="mt-1 text-xs text-slate-400">{step.d}</p></div>)}
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric icon={LifeBuoy} label="Needs assessment" value={unresolved.length} color="text-amber-700 bg-amber-50" />
        <Metric icon={Send} label="Active handoffs" value={activeHandoffs.length} color="text-blue-700 bg-blue-50" />
        <Metric icon={CheckCircle2} label="Completed handoffs" value={completedHandoffs.length} color="text-emerald-700 bg-emerald-50" />
      </section>

      {loading ? <div className="p-16 text-center font-semibold text-slate-500 animate-pulse">Loading support workflow from database...</div> : (
        <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.14em] text-amber-600">Assessment queue</p><h2 className="mt-1 text-xl font-black text-slate-900">Unresolved tickets</h2></div><span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">{unresolved.length}</span></div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Escalate after standard support steps have been exhausted.</p>
            <div className="mt-5 max-h-[36rem] space-y-3 overflow-y-auto pr-1">
              {unresolved.slice(0, 12).map(ticket => <article key={ticket.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/30"><div className="flex justify-between gap-3"><span className="font-mono text-[11px] font-bold text-slate-500">{ticket.ticketId}</span><Priority value={ticket.priority} /></div><h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-slate-900">{ticket.subject}</h3><p className="mt-1 text-xs text-slate-500">{ticket.category} · {ticket.status}</p><div className="mt-3 flex gap-2"><Link href={`/management/support/tickets/${encodeURIComponent(String(ticket.status || "open").toLowerCase())}?ticket=${ticket.id}`} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600">Review</Link><Link href={`/management/support/escalations/new?ticket=${ticket.id}`} className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white">Escalate</Link></div></article>)}
              {!unresolved.length && <Empty text="No unresolved tickets need assessment." />}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.14em] text-teal-700">Handoff tracker</p><h2 className="mt-1 text-xl font-black text-slate-900">Cases owned by specialist teams</h2></div><label className="relative block w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search handoffs" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" /></label></div>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[8rem_minmax(0,1fr)_10rem_8rem_3rem] gap-4 border-b bg-slate-50 px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-slate-500 md:grid"><span>Ticket</span><span>Issue</span><span>Owner</span><span>Status</span><span /></div>
              {filteredHandoffs.map(ticket => <div key={ticket.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[8rem_minmax(0,1fr)_10rem_8rem_3rem] md:items-center md:gap-4"><div><p className="font-mono text-xs font-bold text-teal-700">{ticket.ticketId}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(ticket.escalatedAt || ticket.updatedAt).toLocaleDateString("en-IN")}</p></div><div className="min-w-0"><h3 className="truncate text-sm font-extrabold text-slate-900">{ticket.subject}</h3><p className="mt-1 truncate text-xs text-slate-500">{ticket.internalNotes || "No handoff note recorded"}</p></div><div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Users className="size-4 text-slate-400" /> {ticket.assignedTo}</div><span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase text-blue-700">{ticket.status}</span><Link href={`/management/support/tickets/${encodeURIComponent(String(ticket.status || "open").toLowerCase())}?ticket=${ticket.id}`} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900"><ChevronRight className="size-4" /></Link></div>)}
              {!filteredHandoffs.length && <Empty text="No active specialist handoffs found." />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, color }: any) { return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`grid size-11 place-items-center rounded-xl ${color}`}><Icon className="size-5" /></span><div><p className="text-2xl font-black text-slate-900">{value}</p><p className="text-xs font-bold text-slate-500">{label}</p></div></div>; }
function Priority({ value }: { value: string }) { const critical = String(value).toLowerCase() === "critical"; return <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${critical ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{value}</span>; }
function Empty({ text }: { text: string }) { return <div className="p-10 text-center"><ShieldCheck className="mx-auto size-7 text-emerald-500" /><p className="mt-3 text-sm font-semibold text-slate-500">{text}</p></div>; }
