"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  Clock3,
  Download,
  FileCheck2,
  FlaskConical,
  PackagePlus,
  RefreshCw,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import { toast } from "sonner";

const authHeaders = (json = false) => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
const dateTime = (value: string) => new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, { ...options, headers: { ...authHeaders(Boolean(options.body)), ...(options.headers || {}) } });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || "Request failed");
  return payload;
}

function Shell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p>
      </div>
      {children}
      <style jsx global>{`.care-input{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;background:white;padding:.7rem .8rem;font-size:.875rem;outline:none}.care-input:focus{border-color:#06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.12)}.care-label{display:block;margin-bottom:.35rem;font-size:.72rem;font-weight:700;color:#475569}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="care-label">{label}</span>{children}</label>;
}

export function AppointmentWorkspace({ patientMode = false }: { patientMode?: boolean }) {
  const [providers, setProviders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ provider: "", date: "", startsAt: "", reason: "", notes: "", type: "OPD" });
  const [ruleForm, setRuleForm] = useState({ doctorId: "", weekday: "1", startTime: "09:00", endTime: "17:00", slotDurationMinutes: "30" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [providerRows, appointmentRows, ruleRows] = await Promise.all([api("/api/care/appointments/providers"), api("/api/care/appointments"), patientMode ? Promise.resolve([]) : api("/api/care/appointments/availability-rules")]);
      setProviders(providerRows); setAppointments(appointmentRows);
      setRules(ruleRows);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }, [patientMode]);
  useEffect(() => { void load(); }, [load]);

  const selected = providers.find((provider) => provider.doctorId === form.provider);
  useEffect(() => {
    if (!patientMode || !form.provider || !form.date) { setSlots([]); return; }
    void api(`/api/care/appointments/availability?doctorId=${encodeURIComponent(form.provider)}&date=${form.date}`)
      .then((result) => setSlots(result.slots || []))
      .catch((error) => toast.error(error.message));
  }, [patientMode, form.provider, form.date]);

  const book = async () => {
    if (!selected || !form.startsAt) return toast.error("Select provider, date and available slot");
    try {
      await api("/api/care/appointments", {
        method: "POST",
        body: JSON.stringify({ doctorId: selected.doctorId, hospitalId: selected.hospitalId, startsAt: form.startsAt, reason: form.reason, notes: form.notes, type: form.type }),
      });
      toast.success("Appointment booked and confirmed");
      setForm({ provider: "", date: "", startsAt: "", reason: "", notes: "", type: "OPD" }); setSlots([]); await load();
    } catch (error: any) { toast.error(error.message); }
  };

  const status = async (id: string, next: string) => {
    try {
      await api(`/api/care/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      toast.success(`Appointment ${next.toLowerCase().replaceAll("_", " ")}`); await load();
    } catch (error: any) { toast.error(error.message); }
  };

  const saveRule = async () => {
    try {
      await api("/api/care/appointments/availability-rules", { method: "POST", body: JSON.stringify(ruleForm) });
      toast.success("Doctor availability published");
      await load();
    } catch (error: any) { toast.error(error.message); }
  };

  const reschedule = async (appointment: any) => {
    const value = window.prompt("New date & time (YYYY-MM-DDTHH:mm)", new Date(appointment.dateTime).toISOString().slice(0, 16));
    if (!value) return;
    try {
      await api(`/api/care/appointments/${appointment.id}/reschedule`, { method: "PATCH", body: JSON.stringify({ startsAt: new Date(value).toISOString() }) });
      toast.success("Appointment rescheduled"); await load();
    } catch (error: any) { toast.error(error.message); }
  };

  return (
    <Shell eyebrow="Connected care calendar" title={patientMode ? "Book & manage appointments" : "Doctor calendar"} description={patientMode ? "Choose a facility and doctor, see genuine available slots, then reschedule or cancel when needed." : "Move every visit from confirmation and check-in through consultation and completion. Completion automatically creates the consultation bill."}>
      {patientMode && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-cyan-50 p-3 text-cyan-700"><CalendarDays className="size-5" /></div><div><h2 className="font-bold text-slate-900">Schedule a consultation</h2><p className="text-sm text-slate-500">Only available doctor slots are shown.</p></div></div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Hospital / clinic and doctor"><select className="care-input" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value, startsAt: "" })}><option value="">Select provider</option>{providers.map((provider) => <option key={provider.doctorId} value={provider.doctorId}>{provider.hospitalName} · {provider.doctorName} · {provider.specialization}</option>)}</select></Field>
            <Field label="Appointment date"><input className="care-input" type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, startsAt: "" })} /></Field>
            <Field label="Visit type"><select className="care-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>OPD</option><option>FOLLOW_UP</option><option>TELECONSULTATION</option></select></Field>
          </div>
          {selected && <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><span className="font-semibold">{selected.doctorName}</span><span className="text-slate-500"> · {selected.department} · Consultation {money(selected.consultationFee)}</span></div>}
          <div className="mt-4"><span className="care-label">Available slots</span><div className="flex flex-wrap gap-2">{slots.map((slot) => <button key={slot.startsAt} onClick={() => setForm({ ...form, startsAt: slot.startsAt })} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${form.startsAt === slot.startsAt ? "border-cyan-500 bg-cyan-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"}`}>{slot.label}</button>)}{form.date && form.provider && !slots.length && <span className="text-sm text-slate-500">No available slots for this date.</span>}</div></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Reason for visit"><input className="care-input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field><Field label="Notes"><input className="care-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          <button onClick={book} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Confirm appointment</button>
        </section>
      )}
      {!patientMode && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Publish doctor availability</h2><p className="text-sm text-slate-500">Patients only see open slots inside these working hours.</p></div><Clock3 className="size-6 text-cyan-600" /></div>
          <div className="grid gap-4 md:grid-cols-5"><Field label="Doctor"><select className="care-input" value={ruleForm.doctorId} onChange={(e) => setRuleForm({ ...ruleForm, doctorId: e.target.value })}><option value="">Select doctor</option>{providers.map((provider) => <option key={provider.doctorId} value={provider.doctorId}>{provider.doctorName}</option>)}</select></Field><Field label="Weekday"><select className="care-input" value={ruleForm.weekday} onChange={(e) => setRuleForm({ ...ruleForm, weekday: e.target.value })}>{["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day, index) => <option key={day} value={index}>{day}</option>)}</select></Field><Field label="Starts"><input type="time" className="care-input" value={ruleForm.startTime} onChange={(e) => setRuleForm({ ...ruleForm, startTime: e.target.value })} /></Field><Field label="Ends"><input type="time" className="care-input" value={ruleForm.endTime} onChange={(e) => setRuleForm({ ...ruleForm, endTime: e.target.value })} /></Field><Field label="Slot minutes"><select className="care-input" value={ruleForm.slotDurationMinutes} onChange={(e) => setRuleForm({ ...ruleForm, slotDurationMinutes: e.target.value })}><option>15</option><option>20</option><option>30</option><option>45</option><option>60</option></select></Field></div>
          <button onClick={saveRule} className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Save working hours</button>
          {!!rules.length && <div className="mt-4 flex flex-wrap gap-2">{rules.map((rule) => <span key={rule.id} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{rule.doctorName} · {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][rule.weekday]} · {String(rule.startTime).slice(0,5)}–{String(rule.endTime).slice(0,5)}</span>)}</div>}
        </section>
      )}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">{patientMode ? "My appointments" : "Consultation queue & calendar"}</h2></div>
        <div className="divide-y divide-slate-100">
          {loading ? <p className="p-8 text-center text-slate-500">Loading calendar…</p> : appointments.map((appointment) => (
            <div key={appointment.id} className="grid gap-4 p-5 md:grid-cols-[1.1fr_1fr_.8fr_auto] md:items-center">
              <div><p className="font-bold text-slate-900">{patientMode ? appointment.doctorName : appointment.patientName}</p><p className="text-xs text-slate-500">{patientMode ? appointment.facilityName : appointment.patientPhone}</p></div>
              <div className="text-sm"><p className="flex items-center gap-2 font-semibold text-slate-700"><Clock3 className="size-4 text-cyan-600" />{dateTime(appointment.dateTime)}</p><p className="mt-1 text-xs text-slate-500">{appointment.type} · {money(appointment.consultationFee)}</p></div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{appointment.status.replaceAll("_", " ")}</span>
              <div className="flex flex-wrap justify-end gap-2">
                {patientMode && ["SCHEDULED", "CONFIRMED"].includes(appointment.status) && <><button onClick={() => reschedule(appointment)} className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-700">Reschedule</button><button onClick={() => status(appointment.id, "CANCELLED")} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Cancel</button></>}
                {!patientMode && appointment.status === "SCHEDULED" && <button onClick={() => status(appointment.id, "CONFIRMED")} className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">Confirm</button>}
                {!patientMode && ["SCHEDULED", "CONFIRMED"].includes(appointment.status) && <button onClick={() => status(appointment.id, "CHECKED_IN")} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">Check in</button>}
                {!patientMode && appointment.status === "CHECKED_IN" && <button onClick={() => status(appointment.id, "IN_CONSULTATION")} className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700">Start consult</button>}
                {!patientMode && appointment.status === "IN_CONSULTATION" && <button onClick={() => status(appointment.id, "COMPLETED")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Complete & bill</button>}
              </div>
            </div>
          ))}
          {!loading && !appointments.length && <p className="p-12 text-center text-sm text-slate-500">No appointments found.</p>}
        </div>
      </section>
    </Shell>
  );
}

export function LaboratoryWorkflow() {
  const [workspace, setWorkspace] = useState<any>({ tests: [], packages: [] });
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<"orders" | "catalog" | "packages">("orders");
  const [testForm, setTestForm] = useState({ code: "", name: "", category: "Pathology Test", sampleType: "Blood", preparationInstructions: "", turnaroundHours: "24", price: "", homeCollectionCharge: "0" });
  const [packageForm, setPackageForm] = useState({ code: "", name: "", description: "", packagePrice: "", testIds: [] as string[] });

  const load = useCallback(async () => {
    try {
      const [catalog, orderRows] = await Promise.all([api("/api/care/lab/catalog"), api("/api/care/lab/orders")]);
      setWorkspace(catalog); setOrders(orderRows);
    } catch (error: any) { toast.error(error.message); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const saveTest = async () => {
    try { await api("/api/care/lab/catalog", { method: "POST", body: JSON.stringify(testForm) }); toast.success("Test and pricing added"); setTestForm({ ...testForm, code: "", name: "", price: "" }); await load(); }
    catch (error: any) { toast.error(error.message); }
  };
  const savePackage = async () => {
    try { await api("/api/care/lab/packages", { method: "POST", body: JSON.stringify(packageForm) }); toast.success("Health package created"); setPackageForm({ code: "", name: "", description: "", packagePrice: "", testIds: [] }); await load(); }
    catch (error: any) { toast.error(error.message); }
  };
  const sampleStatus = async (id: string, status: string) => {
    try { await api(`/api/care/lab/orders/${id}/sample`, { method: "PATCH", body: JSON.stringify({ status }) }); toast.success(`Sample marked ${status}`); await load(); }
    catch (error: any) { toast.error(error.message); }
  };
  const complete = async (order: any) => {
    const resultSummary = window.prompt("Result summary");
    if (!resultSummary) return;
    const abnormalFlag = window.prompt("Flag: NORMAL, HIGH, LOW or CRITICAL", "NORMAL") || "NORMAL";
    try { await api(`/api/care/lab/orders/${order.id}/complete`, { method: "POST", body: JSON.stringify({ resultSummary, abnormalFlag, signerName: "Authorized Lab Signatory" }) }); toast.success("Report completed, patient notified and bill generated"); await load(); }
    catch (error: any) { toast.error(error.message); }
  };

  return (
    <Shell eyebrow="Diagnostics operations" title="Laboratory catalogue & sample workflow" description="Own your complete test catalogue, packages and pricing; print QR sample labels; track collection-to-report; flag abnormal results and automatically bill the patient.">
      <div className="mb-6 flex flex-wrap gap-2">{([["orders", "Orders & samples"], ["catalog", "Test catalogue"], ["packages", "Health packages"]] as const).map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === value ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{label}</button>)}</div>
      {tab === "orders" && <div className="grid gap-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><div className="rounded-xl bg-cyan-50 p-3 text-cyan-700"><TestTube2 className="size-5" /></div><div><h3 className="font-bold text-slate-900">{order.testType}</h3><p className="text-sm text-slate-500">{order.patientName} · {order.patientPhone}</p><p className="mt-1 font-mono text-xs text-slate-500">{order.barcodeValue}</p></div></div><div className="text-right"><span className={`rounded-full px-3 py-1 text-xs font-bold ${order.abnormalFlag === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>{order.status}</span><p className="mt-2 font-bold">{money(Number(order.unitPrice) + Number(order.homeCollectionCharge))}</p></div></div>
        <div className="mt-4 flex flex-wrap gap-2">{order.barcodeValue && <a href={`/api/care/lab/orders/${order.id}/label`} target="_blank" className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold"><Download className="size-3.5" /> QR label</a>}{order.status === "Pending Collection" && <button onClick={() => sampleStatus(order.id, "Collected")} className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">Collected</button>}{order.status === "Collected" && <button onClick={() => sampleStatus(order.id, "Received")} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">Received at lab</button>}{order.status === "Received" && <button onClick={() => sampleStatus(order.id, "In Processing")} className="rounded-lg bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700">Start processing</button>}{["In Processing", "Quality Check"].includes(order.status) && <button onClick={() => complete(order)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Complete report & bill</button>}</div>
      </article>)}{!orders.length && <div className="rounded-2xl border border-dashed bg-white p-16 text-center text-sm text-slate-500">No laboratory orders.</div>}</div>}
      {tab === "catalog" && <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Add test with price</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Test code"><input className="care-input" value={testForm.code} onChange={(e) => setTestForm({ ...testForm, code: e.target.value })} /></Field><Field label="Test name"><input className="care-input" value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} /></Field><Field label="Category"><select className="care-input" value={testForm.category} onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}><option>Pathology Test</option><option>Radiology</option><option>Molecular Diagnostics</option></select></Field><Field label="Sample type"><input className="care-input" value={testForm.sampleType} onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })} /></Field><Field label="Standard price"><input type="number" className="care-input" value={testForm.price} onChange={(e) => setTestForm({ ...testForm, price: e.target.value })} /></Field><Field label="Home collection charge"><input type="number" className="care-input" value={testForm.homeCollectionCharge} onChange={(e) => setTestForm({ ...testForm, homeCollectionCharge: e.target.value })} /></Field><Field label="Turnaround hours"><input type="number" className="care-input" value={testForm.turnaroundHours} onChange={(e) => setTestForm({ ...testForm, turnaroundHours: e.target.value })} /></Field><Field label="Preparation"><input className="care-input" value={testForm.preparationInstructions} onChange={(e) => setTestForm({ ...testForm, preparationInstructions: e.target.value })} /></Field></div><button onClick={saveTest} className="mt-5 w-full rounded-xl bg-slate-950 py-3 font-bold text-white">Save test</button></section><section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Published test rates</h2><div className="divide-y">{workspace.tests.map((test: any) => <div key={test.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-bold">{test.name}</p><p className="text-xs text-slate-500">{test.code} · {test.sampleType} · {test.preparationInstructions || "No preparation"}</p></div><div className="text-right"><p className="font-black">{money(test.price)}</p><p className="text-xs text-slate-500">{test.turnaroundHours}h TAT</p></div></div>)}</div></section></div>}
      {tab === "packages" && <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Build discounted package</h2><div className="space-y-4"><Field label="Package code"><input className="care-input" value={packageForm.code} onChange={(e) => setPackageForm({ ...packageForm, code: e.target.value })} /></Field><Field label="Package name"><input className="care-input" value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} /></Field><Field label="Package price"><input type="number" className="care-input" value={packageForm.packagePrice} onChange={(e) => setPackageForm({ ...packageForm, packagePrice: e.target.value })} /></Field><div><span className="care-label">Included tests</span><div className="max-h-52 space-y-2 overflow-auto rounded-xl border p-3">{workspace.tests.map((test: any) => <label key={test.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={packageForm.testIds.includes(test.id)} onChange={(e) => setPackageForm({ ...packageForm, testIds: e.target.checked ? [...packageForm.testIds, test.id] : packageForm.testIds.filter((id) => id !== test.id) })} />{test.name} · {money(test.price)}</label>)}</div></div><button onClick={savePackage} className="w-full rounded-xl bg-slate-950 py-3 font-bold text-white">Publish package</button></div></section><section className="space-y-4">{workspace.packages.map((pkg: any) => <article key={pkg.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><div><PackagePlus className="mb-3 size-6 text-cyan-600" /><h3 className="font-black">{pkg.name}</h3><p className="text-sm text-slate-500">{pkg.tests.map((test: any) => test.name).join(", ")}</p></div><div className="text-right"><p className="text-xl font-black text-cyan-700">{money(pkg.packagePrice)}</p><p className="text-xs text-slate-400 line-through">{money(pkg.listPrice)}</p><p className="text-xs font-bold text-emerald-600">{Number(pkg.discountPercent).toFixed(0)}% off</p></div></div></article>)}</section></div>}
    </Shell>
  );
}

export function PatientLabBooking() {
  const [labs, setLabs] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any>({ tests: [], packages: [] });
  const [laboratoryId, setLaboratoryId] = useState("");
  const [testIds, setTestIds] = useState<string[]>([]);
  const [packageId, setPackageId] = useState("");
  const [homeCollection, setHomeCollection] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState("");
  const [priority, setPriority] = useState("Normal");
  useEffect(() => { void api("/api/care/lab/providers").then(setLabs).catch((error) => toast.error(error.message)); }, []);
  useEffect(() => {
    if (!laboratoryId) { setCatalog({ tests: [], packages: [] }); return; }
    void api(`/api/care/lab/catalog?laboratoryId=${encodeURIComponent(laboratoryId)}`).then(setCatalog).catch((error) => toast.error(error.message));
  }, [laboratoryId]);
  const selectedTests = catalog.tests.filter((test: any) => testIds.includes(test.id));
  const selectedPackage = catalog.packages.find((pkg: any) => pkg.id === packageId);
  const total = selectedPackage
    ? Number(selectedPackage.packagePrice) + (homeCollection ? Math.max(...selectedPackage.tests.map((test: any) => Number(catalog.tests.find((row: any) => row.id === test.testId)?.homeCollectionCharge || 0)), 0) : 0)
    : selectedTests.reduce((sum: number, test: any) => sum + Number(test.price), 0) + (homeCollection && selectedTests.length ? Math.max(...selectedTests.map((test: any) => Number(test.homeCollectionCharge || 0))) : 0);
  const book = async () => {
    try {
      await api("/api/care/lab/orders", { method: "POST", body: JSON.stringify({ laboratoryId, testIds: packageId ? [] : testIds, packageId: packageId || null, homeCollection, collectionAddress, priority }) });
      toast.success("Lab order placed. Preparation instructions are shown below and in your notifications.");
      setTestIds([]); setPackageId("");
    } catch (error: any) { toast.error(error.message); }
  };
  return (
    <Shell eyebrow="Diagnostics marketplace" title="Book laboratory tests" description="Compare your laboratory’s published tests and packages, see preparation instructions and pricing, and request home sample collection.">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <Field label="Choose laboratory"><select className="care-input" value={laboratoryId} onChange={(e) => { setLaboratoryId(e.target.value); setTestIds([]); setPackageId(""); }}><option value="">Select laboratory</option>{labs.map((lab) => <option key={lab.id} value={lab.id}>{lab.name} · {lab.address || "Location unavailable"}</option>)}</select></Field>
          {!!catalog.packages.length && <div className="mt-6"><h2 className="mb-3 font-black">Discounted health packages</h2><div className="grid gap-3 md:grid-cols-2">{catalog.packages.map((pkg: any) => <button key={pkg.id} onClick={() => { setPackageId(pkg.id); setTestIds([]); }} className={`rounded-2xl border p-4 text-left ${packageId === pkg.id ? "border-cyan-500 bg-cyan-50" : "border-slate-200"}`}><div className="flex justify-between gap-3"><div><p className="font-black">{pkg.name}</p><p className="mt-1 text-xs text-slate-500">{pkg.tests.map((test: any) => test.name).join(", ")}</p></div><div className="text-right"><p className="font-black text-cyan-700">{money(pkg.packagePrice)}</p><p className="text-xs text-slate-400 line-through">{money(pkg.listPrice)}</p></div></div></button>)}</div></div>}
          {!!catalog.tests.length && <div className="mt-6"><h2 className="mb-3 font-black">Individual tests</h2><div className="divide-y rounded-2xl border">{catalog.tests.map((test: any) => <label key={test.id} className="flex cursor-pointer items-start gap-3 p-4"><input type="checkbox" checked={testIds.includes(test.id)} disabled={Boolean(packageId)} onChange={(e) => setTestIds(e.target.checked ? [...testIds, test.id] : testIds.filter((id) => id !== test.id))} className="mt-1" /><div className="flex-1"><div className="flex justify-between gap-3"><p className="font-bold">{test.name}</p><p className="font-black">{money(test.price)}</p></div><p className="text-xs text-slate-500">{test.sampleType} · {test.turnaroundHours}h TAT</p><p className="mt-1 text-xs font-semibold text-amber-700">{test.preparationInstructions || "No special preparation"}</p></div></label>)}</div></div>}
        </section>
        <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white shadow-xl"><FlaskConical className="mb-4 size-7 text-cyan-400" /><h2 className="text-lg font-black">Order summary</h2><p className="mt-1 text-sm text-slate-400">{selectedPackage ? selectedPackage.name : `${selectedTests.length} individual test(s)`}</p><div className="my-5 space-y-4 border-y border-slate-800 py-5"><Field label="Priority"><select className="care-input text-slate-900" value={priority} onChange={(e) => setPriority(e.target.value)}><option>Normal</option><option>High</option><option>Urgent</option></select></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={homeCollection} onChange={(e) => setHomeCollection(e.target.checked)} /> Home sample collection</label>{homeCollection && <Field label="Collection address"><textarea className="care-input text-slate-900" value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)} /></Field>}</div><div className="mb-5 flex justify-between"><span>Estimated total</span><span className="text-2xl font-black text-cyan-300">{money(total)}</span></div><button onClick={book} disabled={!laboratoryId || (!packageId && !testIds.length)} className="w-full rounded-xl bg-cyan-400 py-3 font-black text-slate-950 disabled:opacity-40">Place lab order</button></aside>
      </div>
    </Shell>
  );
}

export function InpatientWorkspace() {
  const [data, setData] = useState<any>({ rooms: [], admissions: [], patients: [], doctors: [] });
  const [tab, setTab] = useState<"admissions" | "rooms">("admissions");
  const [room, setRoom] = useState({ ward: "", roomNumber: "", bedNumber: "", roomType: "General", dailyRate: "", nursingRatePerDay: "" });
  const [admit, setAdmit] = useState({ patientId: "", doctorId: "", roomId: "", diagnosis: "", expectedDischargeAt: "", depositAmount: "" });
  const load = useCallback(() => api("/api/care/inpatient/workspace").then(setData).catch((error) => toast.error(error.message)), []);
  useEffect(() => { void load(); }, [load]);
  const addRoom = async () => { try { await api("/api/care/inpatient/rooms", { method: "POST", body: JSON.stringify(room) }); toast.success("Bed added"); setRoom({ ...room, roomNumber: "", bedNumber: "" }); await load(); } catch (error: any) { toast.error(error.message); } };
  const admitPatient = async () => { try { const result = await api("/api/care/inpatient/admissions", { method: "POST", body: JSON.stringify(admit) }); toast.success(`${result.admissionNo} created`); setAdmit({ patientId: "", doctorId: "", roomId: "", diagnosis: "", expectedDischargeAt: "", depositAmount: "" }); await load(); } catch (error: any) { toast.error(error.message); } };
  const charge = async (admission: any) => { const description = window.prompt("Charge description (medicine, procedure, consumable, doctor visit)"); if (!description) return; const category = window.prompt("Category", "Medicine") || "Other"; const unitPrice = Number(window.prompt("Unit price", "0")); const quantity = Number(window.prompt("Quantity", "1")); try { await api(`/api/care/inpatient/admissions/${admission.id}/charges`, { method: "POST", body: JSON.stringify({ description, category, unitPrice, quantity }) }); toast.success("Charge added"); await load(); } catch (error: any) { toast.error(error.message); } };
  const discharge = async (admission: any) => { const finalDiagnosis = window.prompt("Final diagnosis", admission.diagnosis || ""); if (!finalDiagnosis) return; const clinicalCourse = window.prompt("Clinical course / treatment summary", "") || ""; const followUpInstructions = window.prompt("Follow-up instructions", "") || ""; try { const result = await api(`/api/care/inpatient/admissions/${admission.id}/discharge`, { method: "POST", body: JSON.stringify({ finalDiagnosis, clinicalCourse, followUpInstructions, signerName: admission.doctorName || "Authorized Doctor" }) }); toast.success("Patient discharged and final bill generated"); window.open(`/api/care/documents/DISCHARGE_SUMMARY/${result.summaryId}/pdf`, "_blank"); await load(); } catch (error: any) { toast.error(error.message); } };
  return (
    <Shell eyebrow="Hospital revenue cycle" title="IPD admissions, charges & discharge" description="Manage beds, deposits and daily room/nursing charges; capture medicines, consumables, procedures and doctor visits; then generate the final insurance-adjusted bill and discharge summary.">
      <div className="mb-6 flex gap-2"><button onClick={() => setTab("admissions")} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === "admissions" ? "bg-slate-950 text-white" : "border bg-white"}`}>Admissions</button><button onClick={() => setTab("rooms")} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === "rooms" ? "bg-slate-950 text-white" : "border bg-white"}`}>Room & bed master</button></div>
      {tab === "rooms" && <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Add room / bed</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Ward"><input className="care-input" value={room.ward} onChange={(e) => setRoom({ ...room, ward: e.target.value })} /></Field><Field label="Room"><input className="care-input" value={room.roomNumber} onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })} /></Field><Field label="Bed"><input className="care-input" value={room.bedNumber} onChange={(e) => setRoom({ ...room, bedNumber: e.target.value })} /></Field><Field label="Room type"><select className="care-input" value={room.roomType} onChange={(e) => setRoom({ ...room, roomType: e.target.value })}><option>General</option><option>Private</option><option>Deluxe</option><option>ICU</option></select></Field><Field label="Daily room rate"><input type="number" className="care-input" value={room.dailyRate} onChange={(e) => setRoom({ ...room, dailyRate: e.target.value })} /></Field><Field label="Daily nursing rate"><input type="number" className="care-input" value={room.nursingRatePerDay} onChange={(e) => setRoom({ ...room, nursingRatePerDay: e.target.value })} /></Field></div><button onClick={addRoom} className="mt-5 w-full rounded-xl bg-slate-950 py-3 font-bold text-white">Add bed</button></section><section className="grid gap-3 md:grid-cols-2">{data.rooms.map((item: any) => <article key={item.id} className="rounded-2xl border bg-white p-5"><div className="flex justify-between"><BedDouble className="size-6 text-cyan-600" /><span className={`rounded-full px-2 py-1 text-xs font-bold ${item.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.status}</span></div><h3 className="mt-3 font-black">{item.ward} · Room {item.roomNumber} / Bed {item.bedNumber}</h3><p className="text-sm text-slate-500">{item.roomType} · {money(item.dailyRate)}/day + {money(item.nursingRatePerDay)} nursing</p></article>)}</section></div>}
      {tab === "admissions" && <><section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">New IPD admission</h2><div className="grid gap-4 md:grid-cols-3"><Field label="Patient"><select className="care-input" value={admit.patientId} onChange={(e) => setAdmit({ ...admit, patientId: e.target.value })}><option value="">Select patient</option>{data.patients.map((p: any) => <option key={p.id} value={p.id}>{p.name} · {p.phone}</option>)}</select></Field><Field label="Attending doctor"><select className="care-input" value={admit.doctorId} onChange={(e) => setAdmit({ ...admit, doctorId: e.target.value })}><option value="">Select doctor</option>{data.doctors.map((d: any) => <option key={d.id} value={d.id}>{d.name} · {d.specialization}</option>)}</select></Field><Field label="Available bed"><select className="care-input" value={admit.roomId} onChange={(e) => setAdmit({ ...admit, roomId: e.target.value })}><option value="">Select bed</option>{data.rooms.filter((r: any) => r.status === "AVAILABLE").map((r: any) => <option key={r.id} value={r.id}>{r.ward} · {r.roomNumber}/{r.bedNumber} · {money(r.dailyRate)}/day</option>)}</select></Field><Field label="Provisional diagnosis"><input className="care-input" value={admit.diagnosis} onChange={(e) => setAdmit({ ...admit, diagnosis: e.target.value })} /></Field><Field label="Expected discharge"><input type="datetime-local" className="care-input" value={admit.expectedDischargeAt} onChange={(e) => setAdmit({ ...admit, expectedDischargeAt: e.target.value })} /></Field><Field label="Advance deposit"><input type="number" className="care-input" value={admit.depositAmount} onChange={(e) => setAdmit({ ...admit, depositAmount: e.target.value })} /></Field></div><button onClick={admitPatient} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">Admit patient</button></section><div className="space-y-4">{data.admissions.map((item: any) => <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-[1fr_1fr_.7fr_auto] md:items-center"><div><p className="font-mono text-xs text-cyan-700">{item.admissionNo}</p><h3 className="font-black">{item.patientName}</h3><p className="text-xs text-slate-500">{item.doctorName || "Doctor unassigned"}</p></div><div><p className="text-sm font-semibold">{item.ward} · {item.roomNumber}/{item.bedNumber}</p><p className="text-xs text-slate-500">Admitted {dateTime(item.admittedAt)}</p></div><div><p className="text-xs text-slate-500">Running charges</p><p className="font-black">{money(item.chargeTotal)}</p><p className="text-xs text-slate-500">Deposit {money(item.depositAmount)}</p></div><div className="flex gap-2">{item.status === "ADMITTED" && <><button onClick={() => charge(item)} className="rounded-lg border px-3 py-2 text-xs font-bold">Add charge</button><button onClick={() => discharge(item)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Discharge & final bill</button></>}</div></div></article>)}</div></>}
    </Shell>
  );
}

export function InsuranceWorkspace({ patientMode = false }: { patientMode?: boolean }) {
  const [data, setData] = useState<any>({ patients: [], policies: [], claims: [], admissions: [] });
  const [policy, setPolicy] = useState({ patientId: "", insurerName: "", tpaName: "", policyNumber: "", memberId: "", planName: "", coverageAmount: "", validFrom: "", validUntil: "", isPrimary: true });
  const [claim, setClaim] = useState({ patientId: "", policyId: "", admissionId: "", claimType: "CASHLESS", requestedAmount: "", notes: "" });
  const load = useCallback(() => api("/api/care/insurance/workspace").then(setData).catch((error) => toast.error(error.message)), []);
  useEffect(() => { void load(); }, [load]);
  const savePolicy = async () => { try { await api("/api/care/insurance/policies", { method: "POST", body: JSON.stringify(policy) }); toast.success("Insurance policy saved"); setPolicy({ ...policy, insurerName: "", policyNumber: "", memberId: "" }); await load(); } catch (error: any) { toast.error(error.message); } };
  const createClaim = async () => { try { const result = await api("/api/care/insurance/claims", { method: "POST", body: JSON.stringify(claim) }); toast.success(`${result.claimNumber} created`); await load(); } catch (error: any) { toast.error(error.message); } };
  const updateClaim = async (row: any) => { const status = window.prompt("Claim status", row.status); if (!status) return; const approvedAmount = Number(window.prompt("Approved amount", String(row.approvedAmount || 0))); const authorizationNumber = window.prompt("Authorization number", row.authorizationNumber || "") || ""; try { await api(`/api/care/insurance/claims/${row.id}`, { method: "PATCH", body: JSON.stringify({ status, approvedAmount, authorizationNumber }) }); toast.success("Claim updated"); await load(); } catch (error: any) { toast.error(error.message); } };
  const uploadClaimDocument = async (claimId: string, file?: File) => {
    if (!file) return;
    const documentType = window.prompt("Document type", "MEDICAL_RECORD") || "OTHER";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    try {
      const response = await fetch(`/api/care/insurance/claims/${claimId}/documents`, { method: "POST", headers: authHeaders(), body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Upload failed");
      toast.success("Claim document uploaded with integrity hash");
      await load();
    } catch (error: any) { toast.error(error.message); }
  };
  const patientPolicies = useMemo(() => data.policies.filter((item: any) => !claim.patientId || item.patientId === claim.patientId), [data.policies, claim.patientId]);
  return (
    <Shell eyebrow="Cashless & reimbursement" title="Insurance and TPA claims" description={patientMode ? "Keep policy details in one place and track requested, approved, rejected and patient-payable amounts." : "Handle cashless pre-authorization, claim decisions, TPA deductions and the final patient balance."}>
      <div className={`grid gap-6 ${patientMode ? "lg:grid-cols-[.75fr_1.25fr]" : "xl:grid-cols-3"}`}>
        <section className="rounded-2xl border bg-white p-5 shadow-sm"><ShieldCheck className="mb-3 size-6 text-cyan-600" /><h2 className="font-bold">Add insurance policy</h2><div className="mt-4 space-y-3">{!patientMode && <Field label="Patient"><select className="care-input" value={policy.patientId} onChange={(e) => setPolicy({ ...policy, patientId: e.target.value })}><option value="">Select patient</option>{data.patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>}<Field label="Insurer"><input className="care-input" value={policy.insurerName} onChange={(e) => setPolicy({ ...policy, insurerName: e.target.value })} /></Field><Field label="TPA"><input className="care-input" value={policy.tpaName} onChange={(e) => setPolicy({ ...policy, tpaName: e.target.value })} /></Field><Field label="Policy number"><input className="care-input" value={policy.policyNumber} onChange={(e) => setPolicy({ ...policy, policyNumber: e.target.value })} /></Field><Field label="Member ID"><input className="care-input" value={policy.memberId} onChange={(e) => setPolicy({ ...policy, memberId: e.target.value })} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Valid from"><input type="date" className="care-input" value={policy.validFrom} onChange={(e) => setPolicy({ ...policy, validFrom: e.target.value })} /></Field><Field label="Valid until"><input type="date" className="care-input" value={policy.validUntil} onChange={(e) => setPolicy({ ...policy, validUntil: e.target.value })} /></Field></div><Field label="Coverage"><input type="number" className="care-input" value={policy.coverageAmount} onChange={(e) => setPolicy({ ...policy, coverageAmount: e.target.value })} /></Field><button onClick={savePolicy} className="w-full rounded-xl bg-slate-950 py-3 font-bold text-white">Save policy</button></div></section>
        {!patientMode && <section className="rounded-2xl border bg-white p-5 shadow-sm"><FileCheck2 className="mb-3 size-6 text-violet-600" /><h2 className="font-bold">Start cashless claim</h2><div className="mt-4 space-y-3"><Field label="Patient"><select className="care-input" value={claim.patientId} onChange={(e) => setClaim({ ...claim, patientId: e.target.value, policyId: "" })}><option value="">Select patient</option>{data.patients.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Policy"><select className="care-input" value={claim.policyId} onChange={(e) => setClaim({ ...claim, policyId: e.target.value })}><option value="">Select policy</option>{patientPolicies.map((p: any) => <option key={p.id} value={p.id}>{p.insurerName} · {p.policyNumber}</option>)}</select></Field><Field label="Admission"><select className="care-input" value={claim.admissionId} onChange={(e) => setClaim({ ...claim, admissionId: e.target.value })}><option value="">Optional admission</option>{data.admissions.filter((a: any) => !claim.patientId || a.patientId === claim.patientId).map((a: any) => <option key={a.id} value={a.id}>{a.admissionNo}</option>)}</select></Field><Field label="Claim type"><select className="care-input" value={claim.claimType} onChange={(e) => setClaim({ ...claim, claimType: e.target.value })}><option>CASHLESS</option><option>REIMBURSEMENT</option></select></Field><Field label="Requested amount"><input type="number" className="care-input" value={claim.requestedAmount} onChange={(e) => setClaim({ ...claim, requestedAmount: e.target.value })} /></Field><button onClick={createClaim} className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white">Create pre-authorization</button></div></section>}
        <section className={`space-y-4 ${patientMode ? "" : ""}`}>{data.claims.map((row: any) => <article key={row.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-cyan-700">{row.claimNumber}</p><h3 className="mt-1 font-black">{row.insurerName}</h3><p className="text-xs text-slate-500">{row.patientName || row.hospitalName} · {row.policyNumber}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{row.status.replaceAll("_", " ")}</span></div><div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center"><div><p className="text-[10px] uppercase text-slate-500">Requested</p><p className="text-sm font-black">{money(row.requestedAmount)}</p></div><div><p className="text-[10px] uppercase text-slate-500">Approved</p><p className="text-sm font-black text-emerald-700">{money(row.approvedAmount)}</p></div><div><p className="text-[10px] uppercase text-slate-500">Patient pays</p><p className="text-sm font-black text-amber-700">{money(row.patientPayable)}</p></div></div>{!patientMode && <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => updateClaim(row)} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold"><RefreshCw className="size-3.5" /> Update decision</button><label className="cursor-pointer rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">Upload claim document<input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(event) => void uploadClaimDocument(row.id, event.target.files?.[0])} /></label></div>}<div className="mt-3 space-y-1">{(data.documents || []).filter((doc: any) => doc.claimId === row.id).map((doc: any) => <a key={doc.id} href={doc.storagePath} target="_blank" className="block text-xs font-semibold text-cyan-700">{doc.documentType} · {doc.fileName}</a>)}</div></article>)}{!data.claims.length && <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">No claims yet.</div>}</section>
      </div>
    </Shell>
  );
}

export function DocumentDownload({ type, id, label = "Download verified PDF" }: { type: string; id: string; label?: string }) {
  return <a href={`/api/care/documents/${encodeURIComponent(type)}/${encodeURIComponent(id)}/pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-cyan-300 hover:text-cyan-700"><Download className="size-3.5" />{label}</a>;
}
