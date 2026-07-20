"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "@/components/RechartsWrapper";

const axisTick = { fontSize: 12, fill: "#64748b", fontWeight: 500 };
const tooltipStyle = {
  background: "rgba(255,255,255,.98)",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  boxShadow: "0 16px 40px rgba(15,23,42,.12)",
  color: "#0f172a",
  fontSize: "12px",
};

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="grid h-[18rem] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center">
      <div>
        <div className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-white text-cyan-600 shadow-sm">⌁</div>
        <p className="font-semibold text-slate-700">No activity recorded yet</p>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export function MonthlyTrendChart({ data }: { data: any[] }) {
  const hasData = data.some((item) => Number(item.patients) > 0 || Number(item.appointments) > 0);
  if (!hasData) return <EmptyChart message="Patient and appointment trends will appear here." />;

  return (
    <ResponsiveContainer width="100%" height={288}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="patientArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="appointmentArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 5" />
        <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} dy={9} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={42} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }} />
        <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#6366f1" fill="url(#appointmentArea)" strokeWidth={3} activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }} />
        <Area type="monotone" dataKey="patients" name="Unique patients" stroke="#06b6d4" fill="url(#patientArea)" strokeWidth={3} activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DepartmentDistributionChart({ data }: { data: any[] }) {
  const visibleData = data.filter((item) => Number(item.value) > 0).slice(0, 7);
  if (!visibleData.length) return <EmptyChart message="Department activity will appear after appointments are created." />;

  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart data={visibleData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barCategoryGap="30%">
        <defs>
          <linearGradient id="departmentBars" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="4 5" />
        <XAxis type="number" allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" width={108} tick={{ ...axisTick, fill: "#334155" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ecfeff", radius: 8 }} formatter={(value: any) => [`${value} appointments`, "Activity"]} />
        <Bar dataKey="value" name="Appointments" fill="url(#departmentBars)" radius={[0, 9, 9, 0]} maxBarSize={25} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ReportStatisticsChart({ data }: { data: any[] }) {
  const hasData = data.some((item) => Number(item.reports) > 0);
  if (!hasData) return <EmptyChart message="Uploaded medical reports will be summarized month by month." />;

  return (
    <ResponsiveContainer width="100%" height={288}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }} barCategoryGap="38%">
        <defs>
          <linearGradient id="reportBars" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 5" />
        <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} dy={9} />
        <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} width={42} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9", radius: 10 }} formatter={(value: any) => [`${value} reports`, "Uploaded"]} />
        <Bar dataKey="reports" name="Reports" fill="url(#reportBars)" radius={[9, 9, 3, 3]} maxBarSize={62} />
      </BarChart>
    </ResponsiveContainer>
  );
}
