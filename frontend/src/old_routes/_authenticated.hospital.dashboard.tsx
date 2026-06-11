import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, Users, CalendarDays, FileUp, Activity, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/hospital/dashboard")({
  head: () => ({
    meta: [
      { title: "Hospital Dashboard — MediDoc" },
      { name: "description", content: "Hospital management dashboard." },
    ],
  }),
  component: HospitalDashboard,
});

const mockStats = [
  { name: "Mon", patients: 42, appointments: 28 },
  { name: "Tue", patients: 55, appointments: 35 },
  { name: "Wed", patients: 38, appointments: 22 },
  { name: "Thu", patients: 62, appointments: 40 },
  { name: "Fri", patients: 48, appointments: 30 },
  { name: "Sat", patients: 25, appointments: 15 },
  { name: "Sun", patients: 18, appointments: 10 },
];

const mockPatients = [
  { name: "Marcus Chen", department: "Cardiology", doctor: "Dr. Sarah Jenkins", status: "Stable" },
  { name: "Elena Rodriguez", department: "Neurology", doctor: "Dr. Alan Watts", status: "Pending Labs" },
  { name: "James Okafor", department: "Orthopedics", doctor: "Dr. Priya Patel", status: "Stable" },
  { name: "Aisha Khan", department: "Pediatrics", doctor: "Dr. Michael Brown", status: "Follow-up" },
];

function HospitalDashboard() {
  const { data: totalRecords } = useQuery({
    queryKey: ["hospital-records-count"],
    queryFn: async () => {
      const { count } = await supabase.from("health_records").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const kpiCards = [
    { label: "Total Doctors", value: "24", icon: Stethoscope, color: "border-t-2 border-brand" },
    { label: "Total Patients", value: "1,842", icon: Users, color: "border-t-2 border-emerald" },
    { label: "Today's Appts", value: "38", icon: CalendarDays, color: "border-t-2 border-amber" },
    { label: "Reports Uploaded", value: String(totalRecords ?? 0), icon: FileUp, color: "border-t-2 border-purple" },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Hospital Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of hospital operations and patient flow.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className={`p-5 bg-card ring-1 ring-black/5 rounded-xl ${card.color}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{card.label}</p>
              <card.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold mt-2 tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Patient Stats Chart */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Weekly Patient Statistics</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand" /> Patients</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald" /> Appointments</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="patients" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="appointments" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Patient Queue */}
        <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Active Patient Queue</h2>
          </div>
          <div className="divide-y divide-border">
            {mockPatients.map((patient, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-muted rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-[10px] text-muted-foreground">{patient.department} • {patient.doctor}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${
                  patient.status === "Stable" ? "status-stable" :
                  patient.status === "Pending Labs" ? "status-pending" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {patient.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Stats */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-6">Department Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { dept: "Cardiology", count: 142, trend: "+5%", icon: Activity },
            { dept: "Neurology", count: 98, trend: "+2%", icon: TrendingUp },
            { dept: "Orthopedics", count: 76, trend: "-1%", icon: Activity },
            { dept: "Pediatrics", count: 124, trend: "+8%", icon: Clock },
          ].map((d) => (
            <div key={d.dept} className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d.dept}</p>
                <d.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{d.count}</p>
              <p className={`text-xs font-medium mt-1 ${d.trend.startsWith("+") ? "text-emerald" : "text-red"}`}>
                {d.trend} this week
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
