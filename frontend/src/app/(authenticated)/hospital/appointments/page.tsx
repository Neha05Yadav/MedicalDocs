"use client";







const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
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
    scheduled: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200/50",
    completed: "bg-white text-emerald-700 ring-1 ring-emerald-200/50",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200/50",
  };
  return (
    <div className="p-8">
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
                  <button className="p-1.5 text-emerald-600 hover:bg-white rounded-lg"><CheckCircle2 className="size-4" /></button>
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
