import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Calendar, Clock, Share2, Upload, Plus,
  Pill, Activity, ArrowUpRight
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — MediDoc" },
      { name: "description", content: "Your MediDoc patient dashboard." },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { data: records } = useQuery({
    queryKey: ["health-records"],
    queryFn: async () => {
      const { data } = await supabase.from("health_records").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true });
      return data || [];
    },
  });

  const totalRecords = records?.length ?? 0;
  const recentRecords = records?.filter((r) => {
    const d = new Date(r.created_at);
    return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
  }).length ?? 0;
  const upcomingAppointments = appointments?.filter((a) => {
    const d = new Date(a.appointment_date || "");
    return d > new Date();
  }).length ?? 0;

  const kpiCards = [
    { label: "Total Records", value: totalRecords, icon: FileText, color: "border-t-2 border-brand" },
    { label: "Recent (30d)", value: recentRecords, icon: Activity, color: "border-t-2 border-emerald" },
    { label: "Upcoming Appts", value: upcomingAppointments, icon: Calendar, color: "border-t-2 border-amber" },
    { label: "Prescriptions", value: records?.filter((r) => r.category === "Prescription").length ?? 0, icon: Pill, color: "border-t-2 border-purple" },
  ];

  const categoryColor: Record<string, string> = {
    "Lab Report": "category-lab",
    "X-Ray": "category-radiology",
    "MRI": "category-mri",
    "Vaccination": "category-vaccination",
    "Prescription": "category-prescription",
    "Certificate": "category-certificate",
    Other: "category-other",
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here is your health at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/records"
            className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
          >
            <Upload className="size-4" />
            Upload Record
          </Link>
        </div>
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

      {/* Recent Records Table */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Health Records</h2>
          <Link to="/records" className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {totalRecords === 0 ? (
          <div className="p-12 text-center">
            <div className="size-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No records yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload your first medical record to get started.</p>
            <Link
              to="/records"
              className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
            >
              <Plus className="size-4" />
              Upload Record
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Document / Provider</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(records || []).slice(0, 5).map((record) => (
                <tr key={record.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{record.title}</div>
                    <div className="text-xs text-muted-foreground">{record.provider || "Unknown provider"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ring-1 ${categoryColor[record.category] || "category-other"}`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {record.record_date ? new Date(record.record_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-brand hover:underline text-xs font-medium">View</button>
                      <button className="text-brand hover:underline text-xs font-medium flex items-center gap-1">
                        <Share2 className="size-3" /> Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-8 bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Upcoming Appointments</h2>
        </div>
        {upcomingAppointments === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No upcoming appointments. <Link to="/appointments" className="text-brand hover:underline">Book one</Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(appointments || []).filter((a) => new Date(a.appointment_date || "") > new Date()).slice(0, 3).map((appt) => (
              <div key={appt.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{appt.doctor_name || "Doctor"}</p>
                    <p className="text-xs text-muted-foreground">{appt.hospital_name} • {appt.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</p>
                  <p className="text-xs text-muted-foreground">{appt.appointment_date ? new Date(appt.appointment_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
