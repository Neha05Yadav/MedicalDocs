"use client";

import { ArrowLeft, CalendarDays, Download, FileText, Mail, Phone, Pill, Printer, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClinicPatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const patientId = decodeURIComponent(String(params.id || ""));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch(`/api/clinic/patients/${encodeURIComponent(patientId)}/details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.message || "Patient details could not be loaded");
        return body;
      })
      .then(setData)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [patientId]);

  const openRecord = (record: any, print = false) => {
    if (!record.fileUrl) return toast.error("File is not available");
    const url = record.fileUrl.startsWith("/") ? record.fileUrl : `/uploads/${record.fileUrl}`;
    const opened = window.open(url, "_blank");
    if (print && opened) opened.addEventListener("load", () => opened.print());
  };

  if (loading) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Loading patient details...</div>;
  if (!data) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Patient details are unavailable.</div>;

  const patient = data.patient;
  const labReports = (data.records || []).filter((record: any) => String(record.type).toUpperCase().includes("LAB"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-emerald-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/clinic/overview" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-700">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>

        <section className="rounded-3xl bg-gradient-to-br from-[#073b3a] to-[#086b66] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="grid size-16 place-items-center rounded-2xl bg-cyan-300 text-2xl font-black text-slate-950">{patient.name?.[0] || "P"}</div>
              <div><p className="text-xs font-black uppercase tracking-[.2em] text-cyan-200">Complete patient profile</p><h1 className="mt-1 text-3xl font-black">{patient.name}</h1><p className="mt-1 font-mono text-sm text-emerald-100/70">{patient.id}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Info label="Age" value={`${patient.age} yrs`} />
              <Info label="Gender" value={patient.gender} />
              <Info label="Blood group" value={patient.bloodGroup} />
              <Info label="Patient ID" value={patient.id} />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
          <main className="space-y-6">
            <Card title="Laboratory reports" icon={FileText}>
              <div className="space-y-3">
                {labReports.map((report: any) => (
                  <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                    <div><p className="font-bold text-slate-900">{report.title}</p><p className="mt-1 text-xs text-slate-500">{report.date} · {report.type}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => openRecord(report)} className="rounded-lg border px-3 py-2 text-xs font-bold text-cyan-700">Open</button>
                      <a href={report.fileUrl?.startsWith("/") ? report.fileUrl : `/uploads/${report.fileUrl}`} download className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-slate-700"><Download className="size-4" /> Download</a>
                      <button onClick={() => openRecord(report, true)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-slate-700"><Printer className="size-4" /> Print</button>
                    </div>
                  </div>
                ))}
                {!labReports.length && <Empty text="No laboratory reports are available." />}
              </div>
            </Card>

            <Card title="Consultation history" icon={CalendarDays}>
              <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-400"><tr><th className="pb-3">Date</th><th className="pb-3">Type</th><th className="pb-3">Status</th></tr></thead><tbody className="divide-y">{data.appointments.map((item: any) => <tr key={item.id}><td className="py-3 font-semibold">{item.date}</td><td className="py-3 text-slate-600">{item.type}</td><td className="py-3">{item.status}</td></tr>)}</tbody></table></div>
              {!data.appointments.length && <Empty text="No consultations recorded." />}
            </Card>

            <Card title="Prescriptions" icon={Pill}>
              <div className="grid gap-3 sm:grid-cols-2">{data.prescriptions.map((item: any) => <div key={item.recordId || item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-bold text-slate-900">{item.id}</p><p className="mt-1 text-sm text-slate-600">{item.medicine || "Prescription"}</p><p className="mt-2 text-xs text-slate-400">{item.date} · {item.status}</p></div>)}</div>
              {!data.prescriptions.length && <Empty text="No prescriptions recorded." />}
            </Card>
          </main>

          <aside className="space-y-6">
            <Card title="Patient information" icon={UserRound}>
              <Detail icon={Phone} label="Mobile" value={patient.phone || "Not available"} />
              <Detail icon={Mail} label="Email" value={patient.email || "Not available"} />
              <Detail icon={UserRound} label="Gender" value={patient.gender} />
            </Card>
            <Card title="All medical records" icon={FileText}>
              <div className="space-y-3">{data.records.map((record: any) => <button key={record.id} onClick={() => openRecord(record)} className="w-full rounded-xl border border-slate-200 p-3 text-left transition hover:border-cyan-200 hover:bg-cyan-50/40"><p className="text-sm font-bold text-slate-800">{record.title}</p><p className="mt-1 text-xs text-slate-400">{record.type} · {record.date}</p></button>)}</div>
              {!data.records.length && <Empty text="No medical records available." />}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }: any) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700"><Icon className="size-5" /></span><h2 className="font-black text-slate-900">{title}</h2></div>{children}</section>;
}
function Info({ label, value }: any) {
  return <div className="min-w-28 rounded-xl border border-white/10 bg-white/[.08] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100/60">{label}</p><p className="mt-1 max-w-36 truncate text-sm font-bold">{value}</p></div>;
}
function Detail({ icon: Icon, label, value }: any) {
  return <div className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"><Icon className="size-4 text-cyan-600" /><div><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div></div>;
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">{text}</div>;
}
