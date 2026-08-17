"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Technician = {
  id: string; technicianCode: string; fullName: string; phone: string; email: string;
  specialization: string; experienceYears: number | string;
  assignedSamples: number | string; availabilityStatus: "Available" | "Busy" | "Inactive";
  joiningDate: string;
};

const emptyForm = {
  fullName: "", phone: "", email: "", specialization: "",
  experienceYears: "0", availabilityStatus: "Available", joiningDate: "",
};

const laboratoryDepartments = [
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Pathology / Histopathology",
  "Immunology / Serology",
  "Molecular Diagnostic",
  "Clinical Pathology",
  "Phlebotomy / Sample Collection",
];

const apiHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export default function LaboratoryTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "view" | "edit" | null>(null);
  const [selected, setSelected] = useState<Technician | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadTechnicians = async () => {
    try {
      const response = await fetch("/api/laboratory/technicians", { headers: apiHeaders(), cache: "no-store" });
      if (!response.ok) throw new Error();
      setTechnicians(await response.json());
    } catch {
      toast.error("Could not load laboratory technicians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadTechnicians(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return technicians;
    return technicians.filter(item => [item.fullName, item.technicianCode, item.email, item.specialization]
      .some(value => String(value || "").toLowerCase().includes(query)));
  }, [technicians, search]);

  const openAdd = () => { setSelected(null); setForm(emptyForm); setModal("add"); };
  const openView = (item: Technician) => { setSelected(item); setModal("view"); };
  const openEdit = (item: Technician) => {
    setSelected(item);
    setForm({ ...item, joiningDate: item.joiningDate ? String(item.joiningDate).slice(0, 10) : "" });
    setModal("edit");
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const url = modal === "edit" && selected ? `/api/laboratory/technicians/${selected.id}` : "/api/laboratory/technicians";
      const response = await fetch(url, { method: modal === "edit" ? "PUT" : "POST", headers: apiHeaders(), body: JSON.stringify(form) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Unable to save technician");
      toast.success(modal === "edit" ? "Technician updated." : "Technician registered.");
      setModal(null);
      await loadTechnicians();
    } catch (error: any) {
      toast.error(error?.message || "Unable to save technician.");
    } finally { setSaving(false); }
  };

  const toggleStatus = async (item: Technician) => {
    const status = item.availabilityStatus === "Inactive" ? "Available" : "Inactive";
    try {
      const response = await fetch(`/api/laboratory/technicians/${item.id}/status`, {
        method: "PUT", headers: apiHeaders(), body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setTechnicians(current => current.map(row => row.id === item.id ? { ...row, availabilityStatus: status } : row));
      toast.success(status === "Inactive" ? "Technician deactivated." : "Technician activated.");
    } catch { toast.error("Could not update technician status."); }
  };

  const statusClass = (status: string) => status === "Available"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "Busy" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">Laboratory technicians</h1>
            <p className="mt-1 text-sm text-slate-500">Registered staff available for sample processing and testing.</p>
          </div>
          <button onClick={openAdd} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-violet-700">+ Add Technician</button>
        </div>
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, ID, email, or specialization..." className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>{["Technician", "Contact", "Department", "Experience", "Assigned Samples", "Joining Date", "Status", "Actions"].map(label => <th key={label} className="px-5 py-4">{label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={8} className="p-12 text-center text-slate-500">Loading technicians...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={8} className="p-12 text-center text-slate-500">No technicians registered.</td></tr>
                : filtered.map(item => (
                  <tr key={item.id} className="hover:bg-violet-50/30">
                    <td className="px-5 py-4"><p className="font-bold text-slate-900">{item.fullName}</p><p className="mt-1 font-mono text-xs text-violet-600">{item.technicianCode}</p></td>
                    <td className="px-5 py-4"><p className="text-slate-700">{item.phone}</p><p className="mt-1 text-xs text-slate-500">{item.email}</p></td>
                    <td className="px-5 py-4 text-slate-700">{item.specialization}</td>
                    <td className="px-5 py-4 text-slate-700">{Number(item.experienceYears || 0)} yrs</td>
                    <td className="px-5 py-4 font-bold text-slate-800">{Number(item.assignedSamples || 0)}</td>
                    <td className="px-5 py-4 text-slate-600">{item.joiningDate ? new Date(item.joiningDate).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(item.availabilityStatus)}`}>{item.availabilityStatus}</span></td>
                    <td className="px-5 py-4"><div className="flex gap-2">
                      <button onClick={() => openView(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50">View</button>
                      <button onClick={() => openEdit(item)} className="rounded-lg border border-violet-200 px-3 py-1.5 font-semibold text-violet-700 hover:bg-violet-50">Edit</button>
                      <button onClick={() => void toggleStatus(item)} className={`rounded-lg border px-3 py-1.5 font-semibold ${item.availabilityStatus === "Inactive" ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}>{item.availabilityStatus === "Inactive" ? "Activate" : "Deactivate"}</button>
                    </div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={event => { if (event.target === event.currentTarget) setModal(null); }}>
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
            <div><h2 className="text-xl font-black text-slate-950">{modal === "add" ? "Add technician" : modal === "edit" ? "Edit technician" : "Technician details"}</h2>{selected && <p className="mt-1 font-mono text-xs text-violet-600">{selected.technicianCode}</p>}</div>
            <button onClick={() => setModal(null)} className="grid size-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-500">×</button>
          </div>
          {modal === "view" && selected ? <div className="grid gap-4 p-7 sm:grid-cols-2">
            {[['Full Name', selected.fullName], ['Phone Number', selected.phone], ['Email', selected.email], ['Specialization / Department', selected.specialization], ['Experience', `${Number(selected.experienceYears || 0)} years`], ['Assigned Samples', String(Number(selected.assignedSamples || 0))], ['Availability', selected.availabilityStatus], ['Joining Date', new Date(selected.joiningDate).toLocaleDateString('en-IN')]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 font-semibold text-slate-900">{value}</p></div>)}
          </div> : <form onSubmit={save} className="p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {[['fullName','Full Name','text'],['phone','Phone Number','tel'],['email','Email','email'],['specialization','Specialization / Department','select'],['experienceYears','Experience (years)','number'],['joiningDate','Joining Date','date']].map(([name,label,type]) => <label key={name} className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">{label} *</span>{type === 'select' ? <select required value={form[name]} onChange={event => setForm((current: any) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"><option value="" disabled>Select department</option>{laboratoryDepartments.map(department => <option key={department} value={department}>{department}</option>)}</select> : <input required min={name === 'experienceYears' ? 0 : undefined} step={name === 'experienceYears' ? '0.5' : undefined} type={type} value={form[name]} onChange={event => setForm((current: any) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />}</label>)}
              <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Availability Status *</span><select value={form.availabilityStatus} onChange={event => setForm((current: any) => ({ ...current, availabilityStatus: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"><option>Available</option><option>Busy</option><option>Inactive</option></select></label>
            </div>
            <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 font-bold text-slate-600">Cancel</button><button disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 font-bold text-white disabled:opacity-60">{saving ? "Saving..." : modal === "edit" ? "Save Changes" : "Add Technician"}</button></div>
          </form>}
        </div>
      </div>}
    </div>
  );
}
