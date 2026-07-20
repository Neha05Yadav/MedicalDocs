"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SalesReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/management/sales/reports").then(async response => { if (!response.ok) throw new Error("Sales report could not be loaded."); return response.json(); }).then(setData).catch(error => toast.error(error.message)).finally(() => setLoading(false)); }, []);

  const downloadCsv = () => {
    const rows = [["Month","Collected revenue"], ...(data?.revenueData || []).map((row: any) => [row.month, row.revenue])];
    const blob = new Blob([rows.map((row: any[]) => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "medidoc-sales-report.csv"; anchor.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading live sales report…</div>;
  if (!data) return <div className="p-10 text-center text-slate-500">No sales report is available.</div>;
  const metrics = data.kpi || {};
  return <div className="min-h-screen space-y-7 p-6 md:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">MySQL invoice ledger</p><h1 className="mt-1 text-3xl font-black text-slate-900">Sales report</h1><p className="mt-1 text-sm text-slate-500">Collected revenue calculated from paid invoices.</p></div><button onClick={downloadCsv} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Download CSV</button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(metrics).map(([label,value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label.replace(/([A-Z])/g,' $1')}</p><p className="mt-3 text-2xl font-black text-slate-900">{String(value)}</p></div>)}</div><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Six-month collection</h2><div className="mt-7 flex h-72 items-end gap-4">{(data.revenueData || []).map((row: any) => { const max = Math.max(...data.revenueData.map((item: any) => Number(item.revenue || 0)),1); return <div key={row.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><b className="text-xs text-slate-600">₹{Number(row.revenue || 0).toLocaleString('en-IN')}</b><div className="w-full max-w-20 rounded-t-xl bg-gradient-to-t from-indigo-700 to-cyan-400" style={{height:`${Math.max((Number(row.revenue||0)/max)*100,row.revenue?5:1)}%`}}/><span className="text-xs font-bold text-slate-500">{row.month}</span></div>})}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Revenue sources</h2><div className="mt-5 space-y-3">{(data.sourceData || []).map((source: any) => <div key={source.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="font-semibold text-slate-700">{source.name}</span><b className="text-slate-900">{source.revenue}</b></div>)}</div></section></div>;
}
