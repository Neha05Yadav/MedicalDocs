"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  role: "admin" | "accounts";
  id: string;
  onClose?: () => void;
};

export default function EscalationDetailsClient({ role, id, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const token = () => localStorage.getItem("token") || "";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/support-tickets/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.message || "Escalation was not found.");
      setData(payload);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Escalation could not be loaded.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/support-tickets/${encodeURIComponent(id)}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Status update failed.");
      await load();
      toast.success(`Ticket marked ${status}.`);
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/support-tickets/${encodeURIComponent(id)}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          assignedTo: data?.details?.assignedTo || `${role === "admin" ? "Admin" : "Accounts"} Team`,
          internalNotes: note.trim(),
        }),
      });
      if (!response.ok) throw new Error("Note could not be saved.");
      setNote("");
      await load();
      toast.success("Internal note saved.");
    } catch (noteError) {
      toast.error(noteError instanceof Error ? noteError.message : "Note failed.");
    } finally {
      setSaving(false);
    }
  };

  const body = (
    <div className={onClose ? "max-h-[90vh] overflow-y-auto bg-slate-50" : "min-h-screen"}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-xl">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-teal-700">Assigned escalation</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Case details</h1>
        </div>
        {onClose ? (
          <button onClick={onClose} className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Close escalation details"><X className="size-5" /></button>
        ) : (
          <Link href={`/management/${role}/assigned-escalations`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Back to escalations</Link>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center font-semibold text-slate-500 animate-pulse">Loading escalation from database...</div>
      ) : error || !data ? (
        <div className="p-16 text-center"><AlertTriangle className="mx-auto size-9 text-rose-500" /><p className="mt-4 font-bold text-rose-600">{error || "Escalation could not be loaded."}</p><button onClick={load} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Retry</button></div>
      ) : (
        <DetailsContent data={data} note={note} setNote={setNote} saving={saving} updateStatus={updateStatus} saveNote={saveNote} />
      )}
    </div>
  );

  if (!onClose) return <div className="w-full p-6 md:p-8">{body}</div>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-[0_35px_100px_-30px_rgba(15,23,42,.65)]">{body}</section>
    </div>
  );
}

function DetailsContent({ data, note, setNote, saving, updateStatus, saveNote }: any) {
  const { ticket, details, replies } = data;
  const isClosed = ["resolved", "closed"].includes(String(ticket.status).toLowerCase());

  return (
    <div className="p-6 md:p-8">
      <section className="flex flex-wrap items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div><div className="flex flex-wrap items-center gap-3"><h2 className="text-3xl font-black tracking-tight text-slate-900">{ticket.ticketId}</h2><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-600">{ticket.priority}</span></div><p className="mt-3 text-sm font-medium text-slate-500">{ticket.userName} · {ticket.userRole} · {ticket.category}</p></div>
        <button disabled={saving || isClosed} onClick={() => updateStatus("Resolved")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 className="size-4" /> {isClosed ? "Resolved" : "Mark resolved"}</button>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-xl font-black text-slate-900">{ticket.subject}</h3><p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-600">{ticket.description}</p></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-black text-slate-900">Ticket conversation</h3><div className="mt-4 space-y-3">{(replies || []).map((reply: any) => <article key={reply.id} className="rounded-xl bg-slate-50 p-4"><div className="flex justify-between gap-4 text-xs"><b>{reply.senderName} · {reply.senderRole}</b><time className="text-slate-400">{new Date(reply.createdAt).toLocaleString("en-IN")}</time></div><p className="mt-2 text-sm leading-6 text-slate-600">{reply.message}</p></article>)}{!replies?.length && <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No replies recorded.</p>}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-black text-slate-900">Internal note</h3>{details?.internalNotes && <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">{details.internalNotes}</p>}<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10" placeholder="Add an internal investigation note" /><button disabled={saving || !note.trim()} onClick={saveNote} className="mt-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">Save note</button></section>
        </main>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-900">Escalation details</h3><dl className="mt-5 space-y-5 text-sm"><Info icon={Clock3} label="Status" value={ticket.status} /><Info icon={CheckCircle2} label="Assigned team" value={details?.assignedTo || "Unassigned"} /><Info icon={CalendarDays} label="Created" value={new Date(ticket.createdAt).toLocaleString("en-IN")} /><Info icon={Clock3} label="Last updated" value={new Date(ticket.updatedAt).toLocaleString("en-IN")} /></dl></aside>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: any) {
  return <div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700"><Icon className="size-4" /></span><div><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-extrabold text-slate-900">{value}</dd></div></div>;
}
