"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, Plus, ReceiptText, Trash2 } from "lucide-react";
import { toast } from "sonner";

type CatalogItem = { id: string; code?: string; name: string; category: string; price: number; taxRate: number };
type Patient = { id: string; name: string; phone?: string; email?: string };
type Line = { key: string; catalogItemId?: string; name: string; category: string; quantity: number; unitPrice: number; discount: number; taxRate: number };
type Invoice = {
  id: string; invoiceNo: string; patientName?: string; facilityName: string; facilityType: string;
  status: string; subtotal: number; discountTotal: number; taxTotal: number; totalAmount: number;
  amountPaid: number; createdAt: string; dueDate?: string; notes?: string; items: Array<Line & { lineTotal: number; taxAmount: number }>;
};

const categories: Record<string, string[]> = {
  HOSPITAL: ["Consultation", "Procedure", "Room & Nursing", "Diagnostics", "Medicine", "Consumable", "Other"],
  CLINIC: ["Consultation", "Procedure", "Diagnostics", "Medicine", "Consumable", "Other"],
  LABORATORY: ["Pathology Test", "Radiology", "Health Package", "Sample Collection", "Home Visit", "Other"],
};

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);
const headers = (json = false) => ({ ...(json ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

export function BillingWorkspace({ patientView = false }: { patientView?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"bill" | "catalog" | "history">(patientView ? "history" : "bill");
  const [patientId, setPatientId] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [catalogForm, setCatalogForm] = useState({ code: "", name: "", category: "", price: "", taxRate: "0" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/workspace", { headers: headers() });
      if (!response.ok) throw new Error((await response.json())?.message || "Unable to load billing");
      setData(await response.json());
    } catch (error: any) {
      toast.error(error.message || "Unable to load billing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const viewer = patientView ? "PATIENT" : data?.viewer || "HOSPITAL";
  const availableCategories = categories[viewer] || categories.HOSPITAL;
  const totals = useMemo(() => lines.reduce((acc, line) => {
    const base = Number(line.quantity || 0) * Number(line.unitPrice || 0);
    const taxable = Math.max(0, base - Number(line.discount || 0));
    const tax = taxable * Number(line.taxRate || 0) / 100;
    return { subtotal: acc.subtotal + base, discount: acc.discount + Number(line.discount || 0), tax: acc.tax + tax, total: acc.total + taxable + tax };
  }, { subtotal: 0, discount: 0, tax: 0, total: 0 }), [lines]);

  const addCatalogLine = (item: CatalogItem) => setLines(current => [...current, {
    key: crypto.randomUUID(), catalogItemId: item.id, name: item.name, category: item.category,
    quantity: 1, unitPrice: item.price, discount: 0, taxRate: item.taxRate,
  }]);

  const addCustomLine = () => setLines(current => [...current, {
    key: crypto.randomUUID(), name: "", category: availableCategories[0], quantity: 1, unitPrice: 0, discount: 0, taxRate: 0,
  }]);

  const updateLine = (key: string, patch: Partial<Line>) => setLines(current => current.map(line => line.key === key ? { ...line, ...patch } : line));

  const createInvoice = async () => {
    if (!patientId) return toast.error("Select a patient");
    if (!lines.length || lines.some(line => !line.name.trim() || line.quantity <= 0 || line.unitPrice < 0)) return toast.error("Add valid itemized charges");
    setSaving(true);
    try {
      const response = await fetch("/api/billing/invoices", {
        method: "POST", headers: headers(true),
        body: JSON.stringify({ patientId, items: lines, dueDate: dueDate || null, notes, amountPaid }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Invoice creation failed");
      toast.success(`${result.invoiceNo} generated for ${money(result.totalAmount)}`);
      setPatientId(""); setLines([]); setDueDate(""); setNotes(""); setAmountPaid(0); setTab("history");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Invoice creation failed");
    } finally { setSaving(false); }
  };

  const saveCatalog = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/billing/catalog", { method: "POST", headers: headers(true), body: JSON.stringify(catalogForm) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to save rate");
      toast.success("Service rate added");
      setCatalogForm({ code: "", name: "", category: "", price: "", taxRate: "0" });
      await load();
    } catch (error: any) { toast.error(error.message || "Unable to save rate"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading billing workspace…</div>;
  if (!data) return <div className="p-8 text-red-600">Billing workspace could not be loaded.</div>;

  const invoices: Invoice[] = data.invoices || [];
  if (patientView) return (
    <div className="mx-auto w-full max-w-7xl p-5 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Patient finance centre</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">My bills & payments</h1>
        <p className="mt-1 text-sm text-slate-500">Itemized bills received from hospitals, clinics and laboratories.</p>
      </div>
      <InvoiceList invoices={invoices} patient />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">{viewer.toLowerCase()} revenue desk</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Billing & payments</h1>
          <p className="mt-1 text-sm text-slate-500">Maintain transparent rates, create itemized bills and track collections.</p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {([["bill", "Create bill"], ["catalog", "Service & rate master"], ["history", "Invoice history"]] as const).map(([value, label]) => (
            <button key={value} onClick={() => setTab(value)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{label}</button>
          ))}
        </div>
      </div>

      {tab === "bill" && (
        <div className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">New itemized invoice</h2><p className="text-sm text-slate-500">Choose saved services or add a one-time charge.</p></div>
            <div className="space-y-6 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Patient *</label>
                <select value={patientId} onChange={event => setPatientId(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500">
                  <option value="">Select patient</option>
                  {(data.patients || []).map((patient: Patient) => <option key={patient.id} value={patient.id}>{patient.name} {patient.phone ? `· ${patient.phone}` : ""}</option>)}
                </select>
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-slate-800">Add from your rate master</h3><button onClick={addCustomLine} className="flex items-center gap-1 text-sm font-semibold text-cyan-700"><Plus className="size-4" /> Custom item</button></div>
                <div className="flex flex-wrap gap-2">
                  {(data.catalog || []).map((item: CatalogItem) => <button key={item.id} onClick={() => addCatalogLine(item)} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-100">+ {item.name} · {money(item.price)}</button>)}
                  {!data.catalog?.length && <button onClick={() => setTab("catalog")} className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">No saved rates yet — create your first service</button>}
                </div>
              </div>
              <div className="space-y-3">
                {lines.map(line => (
                  <div key={line.key} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:grid-cols-[1.5fr_1fr_.55fr_.8fr_.7fr_.55fr_auto]">
                    <Field label="Item"><input value={line.name} onChange={e => updateLine(line.key, { name: e.target.value })} className="input" /></Field>
                    <Field label="Category"><select value={line.category} onChange={e => updateLine(line.key, { category: e.target.value })} className="input">{availableCategories.map(category => <option key={category}>{category}</option>)}</select></Field>
                    <Field label="Qty"><input type="number" min="0.01" step="0.01" value={line.quantity} onChange={e => updateLine(line.key, { quantity: Number(e.target.value) })} className="input" /></Field>
                    <Field label="Rate"><input type="number" min="0" value={line.unitPrice} onChange={e => updateLine(line.key, { unitPrice: Number(e.target.value) })} className="input" /></Field>
                    <Field label="Discount"><input type="number" min="0" value={line.discount} onChange={e => updateLine(line.key, { discount: Number(e.target.value) })} className="input" /></Field>
                    <Field label="Tax %"><input type="number" min="0" max="100" value={line.taxRate} onChange={e => updateLine(line.key, { taxRate: Number(e.target.value) })} className="input" /></Field>
                    <button onClick={() => setLines(current => current.filter(item => item.key !== line.key))} className="mt-6 rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></button>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Due date"><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input" /></Field>
                <Field label="Amount received"><input type="number" min="0" max={totals.total} value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} className="input" /></Field>
                <Field label="Clinical note / reference"><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" className="input" /></Field>
              </div>
            </div>
          </section>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <ReceiptText className="mb-5 size-8 text-cyan-400" />
            <h2 className="text-lg font-bold">Invoice summary</h2>
            <p className="mb-6 text-sm text-slate-400">{lines.length} item{lines.length === 1 ? "" : "s"} · Healthcare lines default to GST exempt.</p>
            <div className="space-y-3 border-y border-slate-800 py-5 text-sm">
              <Summary label="Gross charges" value={totals.subtotal} />
              <Summary label="Discount" value={-totals.discount} />
              <Summary label="Tax" value={totals.tax} />
            </div>
            <div className="my-5 flex items-center justify-between"><span className="font-semibold">Net payable</span><span className="text-2xl font-black text-cyan-300">{money(totals.total)}</span></div>
            <button disabled={saving || totals.total < 0} onClick={createInvoice} className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">{saving ? "Generating…" : "Generate & notify patient"}</button>
          </aside>
        </div>
      )}

      {tab === "catalog" && (
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Add service / test rate</h2>
            <p className="mb-5 text-sm text-slate-500">These rates become selectable while creating bills.</p>
            <div className="space-y-4">
              <Field label="Code"><input value={catalogForm.code} onChange={e => setCatalogForm({ ...catalogForm, code: e.target.value })} placeholder="e.g. CBC, OPD-01" className="input" /></Field>
              <Field label="Service or test name *"><input value={catalogForm.name} onChange={e => setCatalogForm({ ...catalogForm, name: e.target.value })} className="input" /></Field>
              <Field label="Category *"><select value={catalogForm.category} onChange={e => setCatalogForm({ ...catalogForm, category: e.target.value })} className="input"><option value="">Select category</option>{availableCategories.map(category => <option key={category}>{category}</option>)}</select></Field>
              <Field label="Standard price *"><input type="number" min="0" value={catalogForm.price} onChange={e => setCatalogForm({ ...catalogForm, price: e.target.value })} className="input" /></Field>
              <Field label="Tax rate"><select value={catalogForm.taxRate} onChange={e => setCatalogForm({ ...catalogForm, taxRate: e.target.value })} className="input"><option value="0">GST exempt / 0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option></select></Field>
              <button disabled={saving} onClick={saveCatalog} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-50">Save to rate master</button>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Current rate master</h2>
            <div className="divide-y divide-slate-100">
              {(data.catalog || []).map((item: CatalogItem) => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold text-slate-800">{item.name}</p><p className="text-xs text-slate-500">{item.category}{item.code ? ` · ${item.code}` : ""} · {item.taxRate ? `${item.taxRate}% tax` : "GST exempt"}</p></div><span className="font-bold text-slate-950">{money(item.price)}</span></div>)}
              {!data.catalog?.length && <p className="py-12 text-center text-sm text-slate-500">No service rates configured.</p>}
            </div>
          </section>
        </div>
      )}
      {tab === "history" && <InvoiceList invoices={invoices} onPaid={async id => { await fetch(`/api/billing/invoices/${id}/status`, { method: "PATCH", headers: headers(true), body: JSON.stringify({ status: "PAID" }) }); await load(); }} />}
      <style jsx global>{`.input{width:100%;border:1px solid #e2e8f0;border-radius:.65rem;background:white;padding:.62rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:#06b6d4;box-shadow:0 0 0 3px rgba(6,182,212,.12)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>;
}
function Summary({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between"><span className="text-slate-400">{label}</span><span>{money(value)}</span></div>;
}
function InvoiceList({ invoices, patient = false, onPaid }: { invoices: Invoice[]; patient?: boolean; onPaid?: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!invoices.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center"><FileText className="mx-auto mb-3 size-9 text-slate-300" /><p className="font-semibold text-slate-700">No invoices yet</p></div>;
  return <div className="space-y-4">{invoices.map(invoice => (
    <article key={invoice.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button onClick={() => setOpen(open === invoice.id ? null : invoice.id)} className="grid w-full gap-4 p-5 text-left md:grid-cols-[1.2fr_1fr_.7fr_.7fr_auto] md:items-center">
        <div><p className="font-bold text-slate-900">{invoice.invoiceNo}</p><p className="text-xs text-slate-500">{new Date(invoice.createdAt).toLocaleDateString("en-IN")}</p></div>
        <div><p className="text-xs text-slate-500">{patient ? invoice.facilityType : "Patient"}</p><p className="font-semibold text-slate-800">{patient ? invoice.facilityName : invoice.patientName}</p></div>
        <div><p className="text-xs text-slate-500">Amount</p><p className="font-bold text-slate-900">{money(invoice.totalAmount)}</p></div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${invoice.status === "PAID" ? "bg-emerald-50 text-emerald-700" : invoice.status === "PARTIALLY_PAID" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{invoice.status.replaceAll("_", " ")}</span>
        <span className="text-sm font-semibold text-cyan-700">{open === invoice.id ? "Hide" : "View bill"}</span>
      </button>
      {open === invoice.id && <div className="border-t border-slate-100 bg-slate-50/60 p-5">
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="pb-3">Item</th><th>Category</th><th>Qty</th><th>Rate</th><th>Discount</th><th>Tax</th><th className="text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-200">{invoice.items.map((item, index) => <tr key={index}><td className="py-3 font-semibold">{item.name}</td><td>{item.category}</td><td>{item.quantity}</td><td>{money(item.unitPrice)}</td><td>{money(item.discount)}</td><td>{item.taxRate ? `${item.taxRate}%` : "Exempt"}</td><td className="text-right font-bold">{money(item.lineTotal)}</td></tr>)}</tbody></table></div>
        <div className="ml-auto mt-5 max-w-sm space-y-2 rounded-xl bg-white p-4 text-sm"><Summary label="Subtotal" value={invoice.subtotal} /><Summary label="Discount" value={-invoice.discountTotal} /><Summary label="Tax" value={invoice.taxTotal} /><div className="flex justify-between border-t pt-2 text-base font-black"><span>Total</span><span>{money(invoice.totalAmount)}</span></div></div>
        {!patient && invoice.status !== "PAID" && onPaid && <button onClick={() => onPaid(invoice.id)} className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"><CheckCircle2 className="size-4" /> Mark fully paid</button>}
      </div>}
    </article>
  ))}</div>;
}
