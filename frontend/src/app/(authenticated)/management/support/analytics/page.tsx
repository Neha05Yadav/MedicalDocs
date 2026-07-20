"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Ticket = { id: string; ticketId: string; category: string; subject: string; priority: string; status: string; userName: string; createdAt: string; updatedAt: string };

export default function SupportAnalyticsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => { if (!response.ok) throw new Error("Support analytics could not be loaded."); return response.json(); })
      .then((rows) => setTickets(Array.isArray(rows) ? rows : []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const analytics = useMemo(() => {
    const resolved = tickets.filter((ticket) => ["resolved", "closed"].includes(String(ticket.status).toLowerCase())).length;
    const escalated = tickets.filter((ticket) => ["high", "critical"].includes(String(ticket.priority).toLowerCase())).length;
    const categories = new Map<string, number>();
    tickets.forEach((ticket) => categories.set(ticket.category || "Other", (categories.get(ticket.category || "Other") || 0) + 1));
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate() - (6-index)); return date; });
    const trend = days.map((date) => { const key = date.toISOString().slice(0,10); const rows = tickets.filter((ticket) => new Date(ticket.updatedAt).toISOString().slice(0,10) === key); return { name: date.toLocaleDateString("en-US", { weekday: "short" }), resolved: rows.filter((ticket) => ["resolved","closed"].includes(String(ticket.status).toLowerCase())).length, escalated: rows.filter((ticket) => ["high","critical"].includes(String(ticket.priority).toLowerCase())).length }; });
    return { resolved, escalated, open: tickets.length - resolved, categories: Array.from(categories.entries()).sort((a,b) => b[1]-a[1]), trend };
  }, [tickets]);

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading live support analytics…</div>;
  const maxCategory = Math.max(...analytics.categories.map(([, count]) => count), 1);

  return (
    <div className="min-h-screen space-y-7 p-6 md:p-8">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-600">Live ticket database</p><h1 className="mt-1 text-3xl font-black text-slate-900">Support analytics</h1><p className="mt-1 text-sm text-slate-500">Calculated directly from support tickets—no estimated ratings or demo metrics.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Total tickets', tickets.length, 'text-slate-900'], ['Open workload', analytics.open, 'text-amber-600'], ['Resolved', analytics.resolved, 'text-emerald-600'], ['High priority', analytics.escalated, 'text-rose-600']].map(([label,value,color]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className={`mt-3 text-3xl font-black ${color}`}>{value}</p></div>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold text-slate-900">Seven-day activity</h2><p className="mt-1 text-sm text-slate-500">Tickets updated as resolved or high priority</p><div className="mt-8 flex h-56 items-end gap-3">{analytics.trend.map((day) => <div key={day.name} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-full w-full items-end justify-center gap-1"><div className="w-2/5 rounded-t-md bg-emerald-500" style={{height:`${Math.max(day.resolved * 18, day.resolved ? 12 : 2)}%`}} title={`${day.resolved} resolved`} /><div className="w-2/5 rounded-t-md bg-rose-500" style={{height:`${Math.max(day.escalated * 18, day.escalated ? 12 : 2)}%`}} title={`${day.escalated} high priority`} /></div><span className="text-xs font-semibold text-slate-500">{day.name}</span></div>)}</div><div className="mt-4 flex gap-5 text-xs font-semibold text-slate-600"><span><i className="mr-2 inline-block size-2 rounded-full bg-emerald-500"/>Resolved</span><span><i className="mr-2 inline-block size-2 rounded-full bg-rose-500"/>High priority</span></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold text-slate-900">Issue categories</h2><p className="mt-1 text-sm text-slate-500">Actual ticket volume by category</p><div className="mt-7 space-y-5">{analytics.categories.map(([name,count]) => <div key={name}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-700">{name}</span><b>{count}</b></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-indigo-500" style={{width:`${(count/maxCategory)*100}%`}} /></div></div>)}{!analytics.categories.length && <p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No support tickets recorded yet.</p>}</div></section>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-extrabold text-slate-900">Recently updated tickets</h2></div><div className="divide-y divide-slate-100">{tickets.slice().sort((a,b) => +new Date(b.updatedAt)-+new Date(a.updatedAt)).slice(0,6).map((ticket) => <div key={ticket.id} className="grid gap-2 p-5 text-sm sm:grid-cols-[8rem_1fr_8rem_9rem]"><b className="text-cyan-700">{ticket.ticketId}</b><span className="font-semibold text-slate-800">{ticket.subject}</span><span className="text-slate-500">{ticket.status}</span><time className="text-slate-500">{new Date(ticket.updatedAt).toLocaleString('en-IN')}</time></div>)}</div></section>
    </div>
  );
}
