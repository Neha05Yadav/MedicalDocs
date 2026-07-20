"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Plus, RefreshCw, Stethoscope, X, XCircle } from "lucide-react";
import { toast } from "sonner";

type Appointment = {
  id: string;
  doctor_name: string;
  hospital_name: string;
  department: string;
  appointment_date: string;
  status: string;
  notes?: string | null;
};

type Provider = {
  doctorId: string;
  doctorName: string;
  department: string;
  hospitalId: string;
  hospitalName: string;
};

function authHeaders(json = false): HeadersInit {
  const token = typeof window === "undefined" ? "" : localStorage.getItem("token") || "";
  return { ...(json ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${token}` };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [showBook, setShowBook] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [appointmentsResponse, providersResponse] = await Promise.all([
        fetch("/api/patient/appointments", { headers: authHeaders() }),
        fetch("/api/patient/appointments/providers", { headers: authHeaders() }),
      ]);
      if (!appointmentsResponse.ok || !providersResponse.ok) throw new Error("Unable to load appointments from the care network.");
      const [appointmentData, providerData] = await Promise.all([appointmentsResponse.json(), providersResponse.json()]);
      setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      setProviders(Array.isArray(providerData) ? providerData : []);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Unable to load appointments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadAppointments(); }, [loadAppointments]);

  async function handleAddAppointment(event: React.FormEvent) {
    event.preventDefault();
    const provider = providers.find((item) => item.doctorId === selectedProvider);
    if (!provider) return toast.error("Select an available provider.");
    setIsPending(true);
    try {
      const response = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({ doctorId: provider.doctorId, hospitalId: provider.hospitalId, dateTime: apptDate, notes }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Unable to book appointment.");
      toast.success(data?.message || "Appointment booked successfully.");
      setShowBook(false);
      setSelectedProvider("");
      setApptDate("");
      setNotes("");
      await loadAppointments();
    } catch (caught: unknown) {
      toast.error(caught instanceof Error ? caught.message : "Unable to book appointment.");
    } finally {
      setIsPending(false);
    }
  }

  async function cancelAppointment(id: string) {
    setIsPending(true);
    try {
      const response = await fetch(`/api/patient/appointments/${id}/status`, { method: "PUT", headers: authHeaders(true), body: JSON.stringify({ status: "CANCELLED" }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to cancel appointment.");
      toast.success(data?.message || "Appointment cancelled.");
      await loadAppointments();
    } catch (caught: unknown) {
      toast.error(caught instanceof Error ? caught.message : "Unable to cancel appointment.");
    } finally {
      setIsPending(false);
    }
  }

  const filtered = useMemo(() => appointments.filter((appointment) => {
    const isPast = new Date(appointment.appointment_date).getTime() <= Date.now();
    if (filter === "upcoming") return !isPast;
    if (filter === "past") return isPast;
    return true;
  }), [appointments, filter]);

  const statusBadge: Record<string, string> = {
    scheduled: "border-cyan-200 bg-cyan-50 text-cyan-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className="w-full p-[1.5vw]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-xl border border-slate-200/70 bg-slate-100/70 p-1.5">
          {(["all", "upcoming", "past"] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-5 py-2.5 text-base font-semibold capitalize transition ${filter === value ? "bg-white text-cyan-700 shadow-sm" : "text-slate-600 hover:bg-white/60"}`}>{value}</button>)}
        </div>
        <button onClick={() => setShowBook(true)} disabled={providers.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-5" /> Book appointment</button>
      </div>

      {showBook && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-bold text-slate-900">Book an appointment</h2><p className="mt-1 text-sm text-slate-500">Choose from active providers in the MedicalDocs network.</p></div><button onClick={() => setShowBook(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200" aria-label="Close booking form"><X className="size-5" /></button></div><form onSubmit={handleAddAppointment} className="space-y-5"><label className="block text-sm font-semibold text-slate-700">Provider and facility<select value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base outline-none focus:border-cyan-600" required><option value="">Select an available provider</option>{providers.map((provider) => <option key={provider.doctorId} value={provider.doctorId}>{provider.doctorName} · {provider.department} · {provider.hospitalName}</option>)}</select></label><label className="block text-sm font-semibold text-slate-700">Date and time<input type="datetime-local" value={apptDate} min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)} onChange={(event) => setApptDate(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-cyan-600" required /></label><label className="block text-sm font-semibold text-slate-700">Reason or note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-base outline-none focus:border-cyan-600" rows={3} maxLength={191} placeholder="Share the reason for your visit" /></label><button type="submit" disabled={isPending} className="w-full rounded-xl bg-cyan-700 px-5 py-3.5 text-base font-semibold text-white hover:bg-cyan-800 disabled:opacity-50">{isPending ? "Booking with provider…" : "Confirm appointment"}</button></form></div></div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? <div className="flex min-h-80 items-center justify-center gap-3 text-base text-slate-500"><RefreshCw className="size-5 animate-spin" /> Loading live appointments…</div>
          : error ? <div className="grid min-h-80 place-items-center p-8 text-center"><div><XCircle className="mx-auto size-10 text-red-500" /><h2 className="mt-4 text-xl font-semibold text-slate-900">Appointments could not be loaded</h2><p className="mt-2 text-slate-500">{error}</p><button onClick={() => void loadAppointments()} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white">Try again</button></div></div>
          : filtered.length === 0 ? <div className="grid min-h-80 place-items-center p-8 text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-cyan-50"><Calendar className="size-8 text-cyan-700" /></div><h2 className="mt-4 text-xl font-semibold text-slate-900">No {filter === "all" ? "" : `${filter} `}appointments</h2><p className="mt-2 text-base text-slate-500">Your appointments will appear here after a provider is booked.</p></div></div>
          : <div className="divide-y divide-slate-100">{filtered.map((appointment) => { const status = appointment.status.toLowerCase(); return <article key={appointment.id} className="flex flex-col justify-between gap-5 px-6 py-5 transition hover:bg-slate-50/60 md:flex-row md:items-center"><div className="flex items-center gap-4"><div className="grid size-14 shrink-0 place-items-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-700"><Stethoscope className="size-7" /></div><div><h3 className="text-lg font-semibold text-slate-900">{appointment.doctor_name}</h3><div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500"><span className="flex items-center gap-1.5"><MapPin className="size-4" />{appointment.hospital_name}</span><span className="flex items-center gap-1.5"><Stethoscope className="size-4" />{appointment.department}</span></div>{appointment.notes && <p className="mt-2 text-sm text-slate-600">{appointment.notes}</p>}</div></div><div className="flex items-center justify-between gap-5 md:justify-end"><div className="md:text-right"><p className="font-semibold text-slate-800">{new Date(appointment.appointment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500 md:justify-end"><Clock className="size-4" />{new Date(appointment.appointment_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p><span className={`mt-2 inline-flex rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${statusBadge[status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>{status}</span></div>{status === "scheduled" && <button disabled={isPending} onClick={() => void cancelAppointment(appointment.id)} className="rounded-xl border border-red-200 p-3 text-red-600 transition hover:bg-red-50 disabled:opacity-50" title="Cancel appointment"><XCircle className="size-5" /></button>}</div></article>; })}</div>}
      </section>
    </div>
  );
}
