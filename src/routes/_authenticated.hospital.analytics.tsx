import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, FileText, CalendarDays, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/hospital/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MediDoc" }] }),
  component: AnalyticsPage,
});

const monthlyData = [
  { month: "Jan", patients: 320, appointments: 210, reports: 180 },
  { month: "Feb", patients: 350, appointments: 240, reports: 200 },
  { month: "Mar", patients: 410, appointments: 280, reports: 240 },
  { month: "Apr", patients: 380, appointments: 260, reports: 220 },
  { month: "May", patients: 450, appointments: 310, reports: 270 },
  { month: "Jun", patients: 490, appointments: 340, reports: 300 },
];

const deptDistribution = [
  { name: "Cardiology", value: 142, color: "#dc2626" },
  { name: "Neurology", value: 98, color: "#7c3aed" },
  { name: "Orthopedics", value: 76, color: "#d97706" },
  { name: "Pediatrics", value: 124, color: "#0252d9" },
  { name: "General", value: 210, color: "#059669" },
];

function AnalyticsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Hospital performance and patient statistics.</p>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Patients", value: "1,842", icon: Users, trend: "+12%" },
          { label: "Avg. Wait Time", value: "18 min", icon: Activity, trend: "-5%" },
          { label: "Appts This Month", value: "340", icon: CalendarDays, trend: "+8%" },
          { label: "Reports Uploaded", value: "300", icon: FileText, trend: "+15%" },
        ].map((k) => (
          <div key={k.label} className="bg-card ring-1 ring-black/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <k.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{k.value}</p>
              <span className={`text-xs font-medium mb-1 ${k.trend.startsWith("+") ? "text-emerald" : "text-red"}`}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-6">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="patients" stroke="var(--color-brand)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="appointments" stroke="var(--color-emerald)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-6">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={deptDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {deptDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {deptDistribution.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Report Stats */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-6">Report Statistics</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="reports" fill="var(--color-purple)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
