"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/RechartsWrapper";

export default function HospitalChartClient({ data }: { data: any[] }) {
  const chartData = (Array.isArray(data) ? data : []).map((item) => ({
    name: item.name,
    reports: Math.max(0, Number(item.reports) || 0),
  }));
  const hasReports = chartData.some((item) => item.reports > 0);
  const peak = Math.max(0, ...chartData.map((item) => item.reports));

  return (
    <div className="relative h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 14, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="reportsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0891b2" stopOpacity=".24" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity=".015" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e8eef3" strokeDasharray="3 5" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            domain={[0, Math.max(1, peak + 1)]}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
            width={38}
          />
          <Tooltip
            formatter={(value: any) => [`${Number(value)} report${Number(value) === 1 ? "" : "s"}`, "Generated"]}
            labelStyle={{ color: "#0f172a", fontWeight: 800, marginBottom: 4 }}
            contentStyle={{
              background: "rgba(255,255,255,.96)",
              border: "1px solid #cffafe",
              borderRadius: 14,
              boxShadow: "0 16px 36px -18px rgba(8,145,178,.45)",
              fontSize: 12,
              padding: "10px 14px",
            }}
            cursor={{ stroke: "#a5f3fc", strokeWidth: 1.5, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="reports"
            stroke="#0891b2"
            strokeWidth={3}
            fill="url(#reportsArea)"
            fillOpacity={1}
            dot={hasReports ? { r: 4, fill: "#fff", stroke: "#0891b2", strokeWidth: 2.5 } : false}
            activeDot={{ r: 6, fill: "#0891b2", stroke: "#fff", strokeWidth: 3 }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
      {!hasReports && (
        <div className="pointer-events-none absolute inset-x-12 top-[43%] flex -translate-y-1/2 flex-col items-center">
          <p className="text-sm font-semibold text-slate-500">No report activity this week</p>
          <p className="mt-1 text-xs text-slate-400">The chart will update when a report is uploaded.</p>
        </div>
      )}
    </div>
  );
}
