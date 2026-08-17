"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Search, Stethoscope, UserRound, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth-fetch";

type ClinicDoctor = {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  status: string;
  assignedPatients: number;
};

export default function ClinicDoctorsPage() {
  const [doctors, setDoctors] = useState<ClinicDoctor[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadDoctors = async () => {
      try {
        const response = await fetch("/api/clinic/doctors", {
          headers: authHeaders(),
          cache: "no-store",
        });
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.message || "Clinic doctors could not be loaded.");
        if (active) setDoctors(Array.isArray(body) ? body : []);
      } catch (error: any) {
        if (active) toast.error(error?.message || "Clinic doctors could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadDoctors();
    return () => { active = false; };
  }, []);

  const visibleDoctors = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) =>
      [doctor.name, doctor.specialization, doctor.status, doctor.availability]
        .some((value) => String(value || "").toLowerCase().includes(term)),
    );
  }, [doctors, query]);

  const activeDoctors = doctors.filter((doctor) => doctor.status.toLowerCase() === "active").length;
  const assignedPatients = doctors.reduce((total, doctor) => total + doctor.assignedPatients, 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Clinic doctors" value={doctors.length} icon={Stethoscope} tone="cyan" />
        <SummaryCard label="Active doctors" value={activeDoctors} icon={UserRound} tone="emerald" />
        <SummaryCard label="Assigned patients" value={assignedPatients} icon={UsersRound} tone="blue" />
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-black text-slate-950">Clinic doctor directory</h2>
            <p className="mt-1 text-sm text-slate-500">Doctors linked to this clinic workspace.</p>
          </div>
          <label className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search doctor or specialization..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr><th className="px-6 py-4">Doctor</th><th className="px-6 py-4">Specialization</th><th className="px-6 py-4">Availability</th><th className="px-6 py-4">Assigned patients</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-sm font-semibold text-slate-400">Loading clinic doctors...</td></tr>
              ) : visibleDoctors.length ? visibleDoctors.map((doctor) => (
                <tr key={doctor.id} className="transition hover:bg-cyan-50/30">
                  <td className="px-6 py-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-sm font-black text-cyan-700">{initials(doctor.name)}</span><div><p className="font-extrabold text-slate-900">{doctor.name}</p><p className="mt-0.5 text-xs text-slate-400">Clinic practitioner</p></div></div></td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">{doctor.specialization}</td>
                  <td className="px-6 py-5"><span className="inline-flex items-center gap-2 text-sm text-slate-600"><Clock3 className="size-4 text-cyan-600" />{doctor.availability}</span></td>
                  <td className="px-6 py-5"><span className="inline-flex items-center gap-2 font-bold text-slate-800"><UsersRound className="size-4 text-blue-600" />{doctor.assignedPatients}</span></td>
                  <td className="px-6 py-5"><StatusBadge value={doctor.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-16 text-center"><Stethoscope className="mx-auto size-9 text-slate-300" /><p className="mt-3 font-bold text-slate-600">No doctors found</p><p className="mt-1 text-sm text-slate-400">No doctor matches this clinic or search.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Stethoscope; tone: "cyan" | "emerald" | "blue" }) {
  const colors = { cyan: "bg-cyan-50 text-cyan-700", emerald: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700" };
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-slate-950">{value}</p></div><span className={`rounded-xl p-3 ${colors[tone]}`}><Icon className="size-5" /></span></div></article>;
}

function StatusBadge({ value }: { value: string }) {
  const active = value.toLowerCase() === "active";
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><span className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`} />{value}</span>;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR";
}
