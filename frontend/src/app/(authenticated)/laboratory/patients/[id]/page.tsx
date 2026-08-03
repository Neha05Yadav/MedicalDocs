"use client";

import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  Mail,
  Phone,
  Printer,
  Upload,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const request = async (url: string, init?: RequestInit) => {
  const token = localStorage.getItem("token") || "";
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Request failed");
  return body;
};

const displayDate = (value?: string) => {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const stages = [
  "Pending Collection",
  "Sample Collected",
  "Received in Lab",
  "Under Testing",
  "Report Ready",
  "Completed",
];

export default function LaboratoryPatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const patientId = decodeURIComponent(String(params.id || ""));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [uploadRequest, setUploadRequest] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setData(await request(`/api/laboratory/patients/${encodeURIComponent(patientId)}/details`));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (testRequestId: string, status: string) => {
    setUpdating(testRequestId);
    try {
      await request(`/api/laboratory/samples/${testRequestId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success(`Sample marked ${status}`);
      await load();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating("");
    }
  };

  const uploadReport = async (file?: File) => {
    if (!file || !uploadRequest) return;
    const form = new FormData();
    form.append("file", file);
    form.append("title", `${uploadRequest.testType} Report`);
    try {
      await request(`/api/laboratory/samples/${uploadRequest.id}/report`, {
        method: "POST",
        body: form,
      });
      toast.success("Report uploaded and patient notified");
      await load();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadRequest(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openReport = (report: any, print = false) => {
    if (!report?.fileUrl) return toast.error("Report file is not available");
    const url = report.fileUrl.startsWith("http") || report.fileUrl.startsWith("/")
      ? report.fileUrl
      : `/uploads/${report.fileUrl}`;
    const opened = window.open(url, "_blank");
    if (print && opened) opened.addEventListener("load", () => opened.print());
  };

  if (loading) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Loading patient profile...</div>;
  if (!data) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Patient details are unavailable.</div>;

  const patient = data.patient;
  const latestRequest = data.testHistory?.[0];
  const currentStage = Math.max(
    0,
    stages.findIndex((stage) => stage.toUpperCase() === String(latestRequest?.status || "").toUpperCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(event) => void uploadReport(event.target.files?.[0])}
      />

      <div className="mx-auto max-w-7xl">
        <Link href="/laboratory/patients" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-700">
          <ArrowLeft className="size-4" /> Back to patients
        </Link>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-cyan-400 text-2xl font-black text-slate-950">
                {patient.name?.charAt(0) || "P"}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">Patient details</p>
                <h1 className="mt-1 text-3xl font-black">{patient.name}</h1>
                <p className="mt-1 font-mono text-sm text-slate-400">{patient.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Info label="Age" value={patient.age === null ? "—" : `${patient.age} yrs`} />
              <Info label="Gender" value={patient.gender} />
              <Info label="Mobile" value={patient.mobile} />
              <Info label="Email" value={patient.email} />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
          <div className="space-y-6">
            <Card title="Current test requests" icon={FlaskConical}>
              <div className="space-y-3">
                {data.currentRequests.map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><h3 className="font-bold text-slate-900">{item.testType}</h3><p className="mt-1 text-xs text-slate-500">Requested {displayDate(item.createdAt)}</p></div>
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">{item.status}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <select
                        disabled={updating === item.id}
                        value={stages.includes(item.status) ? item.status : ""}
                        onChange={(event) => void updateStatus(item.id, event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                      >
                        <option value="" disabled>Update sample status</option>
                        {stages.map((stage) => <option key={stage}>{stage}</option>)}
                      </select>
                      <button onClick={() => { setUploadRequest(item); fileRef.current?.click(); }} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-700">
                        <Upload className="size-4" /> Upload report
                      </button>
                    </div>
                  </div>
                ))}
                {!data.currentRequests.length && <Empty text="No active test requests." />}
              </div>
            </Card>

            <Card title="Sample status timeline" icon={Activity}>
              <div className="grid gap-2 md:grid-cols-6">
                {stages.map((stage, index) => {
                  const complete = latestRequest && index <= currentStage;
                  return (
                    <div key={stage} className="relative">
                      <div className={`rounded-xl border p-3 text-center text-[11px] font-bold ${complete ? "border-cyan-200 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                        <CheckCircle2 className={`mx-auto mb-2 size-5 ${complete ? "text-cyan-600" : "text-slate-300"}`} />
                        {stage}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Patient medical reports" icon={FileCheck2}>
              <div className="space-y-3">
                {data.reports.map((report: any) => (
                  <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                    <div><p className="font-bold text-slate-900">{report.title}</p><p className="mt-1 text-xs text-slate-500">{displayDate(report.date || report.createdAt)} · {report.facilityName}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => openReport(report)} className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-700">Open</button>
                      <a href={report.fileUrl?.startsWith("/") ? report.fileUrl : `/uploads/${report.fileUrl}`} download className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-cyan-700"><Download className="size-4" /> Download</a>
                      <button onClick={() => openReport(report, true)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-slate-700"><Printer className="size-4" /> Print</button>
                    </div>
                  </div>
                ))}
                {!data.reports.length && <Empty text="No patient reports are available for this laboratory yet." />}
              </div>
            </Card>

            <Card title="Test history" icon={FileText}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase text-slate-400"><tr><th className="pb-3">Test</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3">Report</th></tr></thead>
                  <tbody className="divide-y">
                    {data.testHistory.map((item: any) => (
                      <tr key={item.id}><td className="py-3 font-semibold">{item.testType}</td><td className="py-3 text-slate-500">{displayDate(item.createdAt)}</td><td className="py-3">{item.status}</td><td className="py-3">{item.reportRecordId ? "Uploaded" : "Pending"}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Lab assignment" icon={UserRound}>
              <Detail label="Assigned technician" value={latestRequest?.technician || "Not assigned"} />
              <Detail label="Sample ID" value={latestRequest?.barcodeValue || latestRequest?.sampleId || "Not generated"} />
              <Detail label="Report upload" value={latestRequest?.reportRecordId ? "Uploaded" : "Pending"} />
            </Card>

            <Card title="Activity timeline" icon={Clock3}>
              <div className="space-y-4">
                {data.activity.map((entry: any) => (
                  <div key={entry.id} className="relative border-l-2 border-cyan-100 pl-4">
                    <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-cyan-600" />
                    <p className="text-sm font-bold text-slate-800">{entry.status}</p>
                    <p className="mt-1 text-xs text-slate-500">{entry.testType} · {displayDate(entry.createdAt)}</p>
                    {entry.notes && <p className="mt-1 text-xs text-slate-400">{entry.notes}</p>}
                  </div>
                ))}
                {!data.activity.length && <Empty text="No activity recorded yet." />}
              </div>
            </Card>

            <Card title="Contact" icon={UserRound}>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Phone className="size-4 text-cyan-600" /> {patient.mobile}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Mail className="size-4 text-cyan-600" /> {patient.email}</p>
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

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-28 rounded-xl border border-white/10 bg-white/[.07] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 max-w-40 truncate text-sm font-bold text-white" title={value}>{value}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-slate-100 py-3 last:border-0"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">{text}</div>;
}
