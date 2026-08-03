"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calendar, ChevronRight, FileText, Flag, Mail, Phone, Search, Trash2, UserRound, X } from "lucide-react";
import { toast } from "sonner";

type Report = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  category: string;
  fileUrl?: string | null;
  date: string;
  status: string;
  hospital: { id?: string | null; name: string; type: string };
};

type Patient = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  age?: number | null;
  gender: string;
  bloodGroup: string;
  registeredAt: string;
  reportCount: number;
  lastReportAt?: string | null;
  reports: Report[];
};

const dateText = (value?: string | null) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const patientDisplayId = (patient: Pick<Patient, "id" | "name">) => {
  return patient.id.trim();
};

export default function ReportsMonitoringPage() {
  const apiBase = "/api/management/admin/reports";
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async (preferredId?: string) => {
    try {
      const response = await fetch(`${apiBase}/patients`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to load report monitoring");
      const rows: Patient[] = Array.isArray(data) ? data : [];
      const nehaProfiles = rows.filter(patient =>
        patient.name.trim().replace(/\s+/g, " ").toLowerCase() === "neha yadav"
      );
      const canonicalNeha = nehaProfiles.find(patient => patient.id.trim().toUpperCase() === "NY45626");
      let canonicalRows = rows.filter(patient =>
        patient.name.trim().replace(/\s+/g, " ").toLowerCase() !== "neha yadav"
      );
      if (canonicalNeha) {
        const reportMap = new Map<string, Report>();
        nehaProfiles.forEach(patient => patient.reports.forEach(report => reportMap.set(report.id, report)));
        const reports = Array.from(reportMap.values()).sort(
          (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
        );
        canonicalRows = [{
          ...canonicalNeha,
          reports,
          reportCount: reports.length,
          lastReportAt: reports[0]?.date || canonicalNeha.lastReportAt,
        }, ...canonicalRows];
      } else {
        canonicalRows = [...nehaProfiles, ...canonicalRows];
      }
      setPatients(canonicalRows);
      setSelectedId(current => {
        const wanted = preferredId || current;
        return canonicalRows.some(patient => patient.id === wanted) ? wanted : canonicalRows[0]?.id || "";
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to load patients and reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patientDisplayId(patient).toLowerCase().includes(query) ||
      String(patient.email || "").toLowerCase().includes(query) ||
      String(patient.phone || "").includes(query)
    );
  }, [patients, search]);

  const selectedPatient = patients.find(patient => patient.id === selectedId) || null;
  const totalReports = patients.reduce((sum, patient) => sum + patient.reportCount, 0);
  const flaggedReports = patients.reduce(
    (sum, patient) => sum + patient.reports.filter(report => report.status === "Flagged").length,
    0,
  );

  const toggleFlag = async (report: Report) => {
    const status = report.status === "Flagged" ? "Available" : "Flagged";
    const response = await fetch(`${apiBase}/${encodeURIComponent(report.id)}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return toast.error("Report status could not be updated");
    toast.success(`Report marked as ${status}`);
    await load(selectedId);
  };

  const deleteReport = async () => {
    if (!deletingId) return;
    const response = await fetch(`${apiBase}/${encodeURIComponent(deletingId)}`, { method: "DELETE" });
    if (!response.ok) return toast.error("Report could not be deleted");
    toast.success("Report permanently deleted");
    setDeletingId(null);
    setSelectedReport(null);
    await load(selectedId);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] space-y-6 p-6 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Registered Patients", patients.length, "bg-indigo-50 text-indigo-700"],
          ["Medical Reports", totalReports, "bg-cyan-50 text-cyan-700"],
          ["Flagged Reports", flaggedReports, "bg-rose-50 text-rose-700"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">{value}</span>
              <span className={`rounded-xl p-2.5 ${color}`}><FileText className="size-5" /></span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50/60 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Patient Directory</h2>
            <p className="mt-1 text-sm text-slate-500">Select a patient to inspect report metadata.</p>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, ID, email or phone" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="max-h-[590px] overflow-y-auto p-3">
            {loading ? (
              <p className="p-6 text-center text-sm text-slate-500">Loading patients...</p>
            ) : filteredPatients.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No patients found.</p>
            ) : filteredPatients.map(patient => (
              <button key={patient.id} onClick={() => setSelectedId(patient.id)} className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === patient.id ? "border-indigo-200 bg-indigo-50 shadow-sm" : "border-transparent hover:border-slate-200 hover:bg-white"}`}>
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-black ${selectedId === patient.id ? "bg-indigo-600 text-white" : "bg-white text-slate-600 shadow-sm"}`}>
                  {patient.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-slate-900">{patient.name}</span>
                  <span className="mt-0.5 block truncate text-xs font-bold tracking-wide text-indigo-600">{patientDisplayId(patient)}</span>
                  <span className="mt-0.5 block text-[11px] font-medium text-slate-500">{patient.reportCount} report{patient.reportCount === 1 ? "" : "s"}</span>
                </span>
                <ChevronRight className="size-4 text-slate-400" />
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0">
          {!selectedPatient ? (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-slate-400">
              <UserRound className="mb-3 size-12" />
              <p className="font-bold">Select a patient</p>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50/70 to-cyan-50/50 p-6">
                <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-black text-white">
                        {selectedPatient.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}
                      </span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{selectedPatient.name}</h2>
                        <p className="text-sm font-bold tracking-wide text-indigo-700">Patient ID: {patientDisplayId(selectedPatient)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                    <span><b className="block text-xs uppercase text-slate-400">Age / Gender</b>{selectedPatient.age ?? "N/A"} / {selectedPatient.gender}</span>
                    <span><b className="block text-xs uppercase text-slate-400">Blood Group</b>{selectedPatient.bloodGroup}</span>
                    <span><b className="block text-xs uppercase text-slate-400">Registered</b>{dateText(selectedPatient.registeredAt)}</span>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2"><Phone className="size-4 text-indigo-500" />{selectedPatient.phone || "No phone"}</span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2"><Mail className="size-4 text-indigo-500" />{selectedPatient.email || "No email"}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Medical Reports</h3>
                    <p className="text-sm text-slate-500">{selectedPatient.reportCount} report records found in the database.</p>
                  </div>
                </div>
                {selectedPatient.reports.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                    <FileText className="mx-auto mb-3 size-10 text-slate-300" />
                    <p className="font-bold text-slate-600">No reports uploaded for this patient</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPatient.reports.map(report => (
                      <div key={report.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-sm xl:flex-row xl:items-center">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><FileText className="size-5" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => setSelectedReport(report)} className="truncate text-left font-extrabold text-slate-900 hover:text-indigo-600">{report.title}</button>
                            {report.status === "Flagged" && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black uppercase text-rose-600">Flagged</span>}
                          </div>
                          <p className="mt-1 text-xs font-medium text-slate-500">{report.id} · {report.type} · {report.hospital.name}</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500"><Calendar className="size-4" />{dateText(report.date)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedReport(report)} className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">View info</button>
                          <button onClick={() => void toggleFlag(report)} title="Flag report" className="rounded-lg border border-slate-200 p-2 text-amber-600 hover:bg-amber-50"><Flag className="size-4" /></button>
                          <button onClick={() => setDeletingId(report.id)} title="Delete report" className="rounded-lg border border-slate-200 p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="size-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><h3 className="text-xl font-black text-slate-900">{selectedReport.title}</h3><p className="mt-1 text-sm text-slate-500">{selectedReport.id}</p></div>
              <button onClick={() => setSelectedReport(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="size-5" /></button>
            </div>
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Admin monitoring shows metadata only; medical attachments remain privacy-restricted.
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="font-bold text-slate-400">Patient</dt><dd className="mt-1 font-bold text-slate-800">{selectedPatient?.name}</dd></div>
              <div><dt className="font-bold text-slate-400">Report type</dt><dd className="mt-1 font-bold text-slate-800">{selectedReport.type}</dd></div>
              <div><dt className="font-bold text-slate-400">Facility</dt><dd className="mt-1 font-bold text-slate-800">{selectedReport.hospital.name}</dd></div>
              <div><dt className="font-bold text-slate-400">Date</dt><dd className="mt-1 font-bold text-slate-800">{dateText(selectedReport.date)}</dd></div>
              <div className="col-span-2"><dt className="font-bold text-slate-400">Description</dt><dd className="mt-1 text-slate-700">{selectedReport.description || "No description provided."}</dd></div>
            </dl>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><AlertTriangle className="size-6" /></span>
            <h3 className="mt-4 text-xl font-black text-slate-900">Delete report permanently?</h3>
            <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-700">Cancel</button>
              <button onClick={() => void deleteReport()} className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
