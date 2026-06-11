"use client";

import { Calendar, Plus, Clock, MapPin, Stethoscope, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const appointments = [
  { patient: "Marcus Chen", doctor: "Dr. Sarah Jenkins", department: "Cardiology", date: "Oct 15, 2024", time: "10:00 AM", status: "scheduled" },
  { patient: "Elena Rodriguez", doctor: "Dr. Alan Watts", department: "Neurology", date: "Oct 15, 2024", time: "11:30 AM", status: "scheduled" },
  { patient: "James Okafor", doctor: "Dr. Priya Patel", department: "Orthopedics", date: "Oct 15, 2024", time: "02:00 PM", status: "completed" },
  { patient: "Aisha Khan", doctor: "Dr. Michael Brown", department: "Pediatrics", date: "Oct 16, 2024", time: "09:00 AM", status: "scheduled" },
  { patient: "Robert Kim", doctor: "Dr. Emily Chen", department: "Cardiology", date: "Oct 16, 2024", time: "03:30 PM", status: "cancelled" },
];

export default function HospitalAppointmentsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = appointments.filter((a) => filter === "all" || a.status === filter);

  const statusBadge: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
    completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200/50",
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage patient appointments.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110">
          <Plus className="size-4" />
          New Appointment
        </button>
      </header>

      <div className="flex gap-2 mb-6">
        {["all", "scheduled", "completed", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? "bg-brand text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((a, i) => (
            <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                  <Stethoscope className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{a.patient}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {a.doctor}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {a.department}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{a.date}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight mt-1 ${statusBadge[a.status]}`}>
                  {a.status}
                </span>
              </div>
              {a.status === "scheduled" && (
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckCircle2 className="size-4" /></button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><XCircle className="size-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

