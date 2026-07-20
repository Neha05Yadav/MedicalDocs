"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LiveVerificationList({ mode = "all" }: { mode?: "all" | "pending" | "rejected" }) {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/management/super-admin/facilities").then(async response => { if (!response.ok) throw new Error("Verification queue could not be loaded."); return response.json(); }).then(rows => setFacilities(Array.isArray(rows) ? rows : [])).catch(error => toast.error(error.message)).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading verification queue…</div>;
  const visible = facilities.filter(facility => mode === "pending" ? !facility.isVerified && String(facility.status).toLowerCase() !== "rejected" : mode === "rejected" ? String(facility.status).toLowerCase() === "rejected" : true);
  return <div className="min-h-screen p-6 md:p-8"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-600">Facility database</p><h1 className="mt-1 text-3xl font-black capitalize text-slate-900">{mode} verification requests</h1><p className="mt-1 text-sm text-slate-500">Registration status from hospital and laboratory records.</p></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_8rem_10rem_8rem] gap-4 border-b bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Facility</span><span>Type</span><span>Registered</span><span>Status</span></div>{visible.map(facility => <div key={facility.id} className="grid grid-cols-[1fr_8rem_10rem_8rem] gap-4 border-b border-slate-100 px-5 py-5 text-sm"><span><b className="block text-slate-900">{facility.name}</b><small className="text-slate-500">{facility.email}</small></span><span className="text-slate-600">{facility.type}</span><span className="text-slate-600">{facility.registrationDate}</span><span className={`font-bold ${facility.isVerified ? 'text-emerald-600' : String(facility.status).toLowerCase()==='rejected' ? 'text-rose-600' : 'text-amber-600'}`}>{facility.isVerified ? 'Verified' : facility.status}</span></div>)}{!visible.length && <div className="p-12 text-center text-sm text-slate-500">No matching verification records.</div>}</div></div>;
}
