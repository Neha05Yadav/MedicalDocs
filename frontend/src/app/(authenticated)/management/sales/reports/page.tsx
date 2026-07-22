"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/RechartsWrapper";

const formatCurrency = (value: unknown) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function SalesReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/management/sales/reports", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Sales report could not be loaded.");
        return response.json();
      })
      .then(setData)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const collectionData = useMemo(() => {
    const sixMonths = data?.revenueRanges?.lastSixMonths;
    const rows = Array.isArray(sixMonths)
      ? sixMonths
      : Array.isArray(data?.revenueData)
        ? data.revenueData.slice(-6)
        : [];
    return rows.map((row: any) => ({ ...row, revenue: Number(row.revenue || 0) }));
  }, [data]);

  const collectionTotal = collectionData.reduce((total: number, row: any) => total + row.revenue, 0);
  const collectionAverage = collectionData.length ? Math.round(collectionTotal / collectionData.length) : 0;
  const strongestMonth = collectionData.reduce((best: any, row: any) => !best || row.revenue > best.revenue ? row : best, null);

  const downloadCsv = () => {
    const rows = [["Month", "Collected revenue"], ...collectionData.map((row: any) => [row.month, row.revenue])];
    const csv = rows.map((row: any[]) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "medicaldocs-sales-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading live sales report…</div>;
  if (!data) return <div className="p-10 text-center text-slate-500">No sales report is available.</div>;

  const metrics = data.kpi || {};

  return (
    <div className="min-h-screen space-y-7 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">MySQL invoice ledger</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Sales report</h1>
          <p className="mt-1 text-sm text-slate-500">Collected revenue calculated from paid invoices.</p>
        </div>
        <button onClick={downloadCsv} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">
          Download CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(metrics).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label.replace(/([A-Z])/g, " $1")}</p>
            <p className="mt-3 text-2xl font-black text-slate-900">{String(value)}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900">Collection performance</h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">Last 6 months</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Paid invoice revenue recorded month by month.</p>
          </div>
          <div className="grid grid-cols-3 gap-6 rounded-2xl bg-slate-50 px-5 py-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Collected</p>
              <p className="mt-1 text-base font-black text-slate-900">{formatCurrency(collectionTotal)}</p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly avg.</p>
              <p className="mt-1 text-base font-black text-slate-900">{formatCurrency(collectionAverage)}</p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best month</p>
              <p className="mt-1 text-base font-black text-slate-900">{strongestMonth?.revenue ? strongestMonth.month : "—"}</p>
            </div>
          </div>
        </div>

        <div className="h-[330px] px-4 pb-5 pt-7 sm:px-6 lg:px-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collectionData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }} barCategoryGap="42%">
              <defs>
                <linearGradient id="collectionBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e8eef6" strokeDasharray="4 5" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 13, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 14, boxShadow: "0 12px 30px rgba(15,23,42,.10)" }}
                formatter={(value) => [formatCurrency(value), "Collected"]}
              />
              <Bar dataKey="revenue" fill="url(#collectionBar)" radius={[9, 9, 3, 3]} minPointSize={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-900">Revenue sources</h2>
        <div className="mt-5 space-y-3">
          {(data.sourceData || []).map((source: any) => (
            <div key={source.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className="font-semibold text-slate-700">{source.name}</span>
              <b className="text-slate-900">{source.amount || source.revenue || formatCurrency(0)}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
