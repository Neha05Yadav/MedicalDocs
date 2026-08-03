"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Headphones,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Area = "support" | "accounts" | "sales";

const api = async (url: string) => {
  const token = localStorage.getItem("token") || "";
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Operational data could not be loaded");
  return body;
};

const areaMeta = {
  support: {
    eyebrow: "Service governance",
    title: "Support operations oversight",
    description: "Monitor every reported issue, ownership, priority, escalation and resolution state across the platform.",
    icon: Headphones,
    accent: "from-violet-500 via-purple-500 to-indigo-600",
  },
  accounts: {
    eyebrow: "Financial governance",
    title: "Accounts operations oversight",
    description: "Review billed income, collections, receivables, invoices and refunds managed by the Accounts team.",
    icon: CreditCard,
    accent: "from-emerald-600 to-teal-700",
  },
  sales: {
    eyebrow: "Commercial governance",
    title: "Sales operations oversight",
    description: "Track revenue, subscriptions, renewals and payment outcomes managed by the Sales team.",
    icon: TrendingUp,
    accent: "from-cyan-600 to-blue-700",
  },
} as const;

export default function OperationsOversight({ area }: { area: Area }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      if (area === "support") {
        const tickets = await api("/api/support-tickets");
        setData({ tickets: Array.isArray(tickets) ? tickets : [] });
      } else if (area === "accounts") {
        const [overview, invoices, refunds] = await Promise.all([
          api("/api/management/accounts/overview"),
          api("/api/management/accounts/invoices"),
          api("/api/management/accounts/refunds"),
        ]);
        setData({ overview, invoices: invoices.invoices || [], refunds: refunds.refunds || [] });
      } else {
        const [overview, subscriptions, payments] = await Promise.all([
          api("/api/management/sales/overview"),
          api("/api/management/sales/subscriptions"),
          api("/api/management/sales/payments"),
        ]);
        setData({ overview, subscriptions: subscriptions.subscriptions || [], payments: payments.payments || [] });
      }
    } catch (error: any) {
      if (!silent) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [area]);

  useEffect(() => {
    void load();
    if (area !== "support") return;
    const refreshTimer = window.setInterval(() => void load(true), 10000);
    return () => window.clearInterval(refreshTimer);
  }, [area, load]);

  const meta = areaMeta[area];
  const rows = useMemo(() => {
    const source = area === "support" ? data?.tickets || [] : area === "accounts" ? data?.invoices || [] : data?.subscriptions || [];
    return source.filter((row: any) => {
      const text = JSON.stringify(row).toLowerCase();
      const status = String(row.status || "").toUpperCase();
      return text.includes(query.toLowerCase()) && (filter === "ALL" || status === filter);
    });
  }, [area, data, query, filter]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Loading live {area} operations...</div>;
  if (!data) return <div className="grid min-h-[60vh] place-items-center text-slate-500">Operational data is unavailable.</div>;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.accent} p-7 text-white shadow-xl sm:p-9`}>
          <div className="absolute -right-20 -top-24 size-72 rounded-full border-[42px] border-white/10" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="text-xs font-black uppercase tracking-[.2em] text-white/65">{meta.eyebrow}</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{meta.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-white/75 sm:text-base">{meta.description}</p></div>
            <button onClick={() => void load()} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold backdrop-blur transition hover:bg-white/20"><RefreshCw className="size-4" /> Refresh live data</button>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics(area, data).map((item: any) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.label}</p><p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p></div><span className={`rounded-xl p-2.5 ${item.tone}`}><item.icon className="size-5" /></span></div>
              <p className="mt-3 text-xs text-slate-500">{item.note}</p>
            </article>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-xl font-black text-slate-900">{area === "support" ? "Platform issues" : area === "accounts" ? "Invoice register" : "Subscription register"}</h2><p className="mt-1 text-sm text-slate-500">{rows.length} matching live records</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-500 sm:w-64" /></label>
              <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700">
                <option value="ALL">All statuses</option>
                {statusOptions(area).map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            {area === "support" ? <SupportTable rows={rows} /> : area === "accounts" ? <AccountsTable rows={rows} /> : <SalesTable rows={rows} />}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <SecondaryPanel area={area} data={data} />
          <ResponsibilityPanel area={area} />
        </div>
      </div>
    </div>
  );
}

function metrics(area: Area, data: any) {
  if (area === "support") {
    const tickets = data.tickets || [];
    const count = (values: string[]) => tickets.filter((row: any) => values.includes(String(row.status).toUpperCase())).length;
    return [
      { label: "Total issues", value: tickets.length, note: "All support requests", icon: Headphones, tone: "bg-violet-50 text-violet-700" },
      { label: "Open", value: count(["OPEN"]), note: "Awaiting support action", icon: AlertTriangle, tone: "bg-amber-50 text-amber-700" },
      { label: "In progress", value: count(["IN PROGRESS", "ESCALATED"]), note: "Currently being handled", icon: Clock3, tone: "bg-cyan-50 text-cyan-700" },
      { label: "Resolved", value: count(["RESOLVED", "CLOSED"]), note: "Completed issues", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    ];
  }
  if (area === "accounts") {
    const kpi = data.overview?.kpi || {};
    return [
      { label: "Total billed", value: kpi.totalIncome || "₹0", note: "All generated invoices", icon: CircleDollarSign, tone: "bg-indigo-50 text-indigo-700" },
      { label: "Collected", value: kpi.totalCollected || "₹0", note: "Successful collections", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
      { label: "Receivable", value: kpi.pendingReceivable || "₹0", note: "Pending collection", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
      { label: "Refunded", value: kpi.refundIssued || "₹0", note: `${data.refunds.length} refund records`, icon: RefreshCw, tone: "bg-rose-50 text-rose-700" },
    ];
  }
  const kpis = data.overview?.kpiData || [];
  return kpis.slice(0, 4).map((item: any, index: number) => ({
    label: item.title, value: item.value, note: item.change || "Live", icon: [TrendingUp, Users, AlertTriangle, Users][index], tone: ["bg-cyan-50 text-cyan-700", "bg-emerald-50 text-emerald-700", "bg-rose-50 text-rose-700", "bg-indigo-50 text-indigo-700"][index],
  }));
}

const statusOptions = (area: Area) => area === "support" ? ["OPEN", "IN PROGRESS", "ESCALATED", "RESOLVED", "CLOSED"] : area === "accounts" ? ["PAID", "UNPAID", "PENDING", "REFUNDED"] : ["ACTIVE", "EXPIRED", "SUSPENDED", "RENEWAL DUE"];
const badge = (status: string) => {
  const value = String(status || "Unknown").toUpperCase();
  const tone = ["PAID", "SUCCESSFUL", "ACTIVE", "RESOLVED", "CLOSED"].includes(value) ? "bg-emerald-50 text-emerald-700" : ["OPEN", "PENDING", "UNPAID", "RENEWAL DUE"].includes(value) ? "bg-amber-50 text-amber-700" : ["EXPIRED", "REFUNDED", "CANCELLED"].includes(value) ? "bg-rose-50 text-rose-700" : "bg-cyan-50 text-cyan-700";
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${tone}`}>{status || "Unknown"}</span>;
};

function SupportTable({ rows }: { rows: any[] }) {
  return <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Ticket</th><th className="px-5 py-4">Issue</th><th className="px-5 py-4">Raised by</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Owner</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-4 font-mono text-xs font-bold text-cyan-700">{row.ticketId}</td><td className="px-5 py-4"><p className="font-bold text-slate-900">{row.subject}</p><p className="mt-1 text-xs text-slate-500">{row.category}</p></td><td className="px-5 py-4">{row.userName}<p className="text-xs text-slate-400">{row.userRole}</p></td><td className="px-5 py-4">{row.priority}</td><td className="px-5 py-4">{row.assignedTo || "Unassigned"}</td><td className="px-5 py-4">{badge(row.status)}</td></tr>)}</tbody></table>;
}
function AccountsTable({ rows }: { rows: any[] }) {
  return <table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Facility</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 font-mono text-xs text-indigo-700">{row.invoiceNo || row.id}</td><td className="px-5 py-4 font-semibold">{row.client || row.hospital}</td><td className="px-5 py-4 font-bold">{row.totalAmount || row.amount}</td><td className="px-5 py-4 text-slate-500">{new Date(row.date).toLocaleDateString("en-IN")}</td><td className="px-5 py-4">{badge(row.status)}</td></tr>)}</tbody></table>;
}
function SalesTable({ rows }: { rows: any[] }) {
  return <table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Facility</th><th className="px-5 py-4">Plan</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Validity</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 font-bold">{row.facility}</td><td className="px-5 py-4">{row.plan}</td><td className="px-5 py-4 font-semibold">{row.amount}</td><td className="px-5 py-4 text-xs text-slate-500">{row.startDate} → {row.endDate}</td><td className="px-5 py-4">{badge(row.status)}</td></tr>)}</tbody></table>;
}

function SecondaryPanel({ area, data }: { area: Area; data: any }) {
  const rows = area === "support" ? (data.tickets || []).filter((row: any) => String(row.priority).toUpperCase() === "HIGH").slice(0, 6) : area === "accounts" ? data.refunds.slice(0, 6) : data.payments.slice(0, 6);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-900">{area === "support" ? "High-priority attention" : area === "accounts" ? "Recent refunds" : "Recent payments"}</h3><div className="mt-4 space-y-3">{rows.map((row: any, index: number) => <div key={row.id || index} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div><p className="text-sm font-bold text-slate-800">{row.subject || row.invoiceNo || row.hospital}</p><p className="mt-1 text-xs text-slate-500">{row.ticketId || row.client || row.date}</p></div>{badge(row.status || row.priority)}</div>)}{!rows.length && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-400">No records in this category.</p>}</div></section>;
}
function ResponsibilityPanel({ area }: { area: Area }) {
  const items = area === "support" ? ["Issue intake and categorization", "Priority and ownership monitoring", "Escalation tracking", "Resolution performance"] : area === "accounts" ? ["Invoice and collection control", "Pending receivable monitoring", "Refund governance", "Billing reconciliation"] : ["Subscription lifecycle", "Renewal pipeline", "Payment outcomes", "Revenue performance"];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-black text-slate-900">What this team manages</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{items.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-semibold text-slate-700"><CheckCircle2 className="size-4 shrink-0 text-emerald-600" />{item}</div>)}</div></section>;
}
