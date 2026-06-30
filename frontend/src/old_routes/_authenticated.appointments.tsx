import Calendar from "lucide-react/dist/esm/icons/calendar.mjs";
import Plus from "lucide-react/dist/esm/icons/plus.mjs";
import X from "lucide-react/dist/esm/icons/x.mjs";
import Clock from "lucide-react/dist/esm/icons/clock.mjs";
import MapPin from "lucide-react/dist/esm/icons/map-pin.mjs";
import Stethoscope from "lucide-react/dist/esm/icons/stethoscope.mjs";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.mjs";
import XCircle from "lucide-react/dist/esm/icons/x-circle.mjs";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments — MediDoc" },
      { name: "description", content: "Manage your appointments." },
    ],
  }),
  component: AppointmentsPage,
});
function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [showBook, setShowBook] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [department, setDepartment] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true });
      return data || [];
    },
  });
  const addAppointment = useMutation({
    mutationFn: async (appt: { doctor_name: string; hospital_name: string; department: string; appointment_date: string; notes: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("appointments").insert({
        ...appt,
        patient_id: userData.user!.id,
        status: "scheduled",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment booked!");
      setShowBook(false);
      setDoctorName("");
      setHospitalName("");
      setDepartment("");
      setApptDate("");
      setNotes("");
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
  const filtered = (appointments || []).filter((a) => {
    if (filter === "upcoming") return new Date(a.appointment_date || "") > new Date();
    if (filter === "past") return new Date(a.appointment_date || "") <= new Date();
    return true;
  });
  const statusBadge: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50",
    completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200/50",
  };
  return (
    <div className="p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Book and manage your medical appointments.</p>
        </div>
        <button
          onClick={() => setShowBook(true)}
          className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
        >
          <Plus className="size-4" />
          Book Appointment
        </button>
      </header>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f ? "bg-brand text-background" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {/* Book Modal */}
      {showBook && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Book Appointment</h3>
              <button onClick={() => setShowBook(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAppointment.mutate({
                  doctor_name: doctorName,
                  hospital_name: hospitalName,
                  department,
                  appointment_date: apptDate,
                  notes,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium mb-1 block">Doctor Name</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Dr. Mehta" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Hospital / Clinic</label>
                <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Apollo Hospital" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Cardiology" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date & Time</label>
                <input type="datetime-local" value={apptDate} onChange={(e) => setApptDate(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" rows={3} placeholder="Any symptoms or concerns..." />
              </div>
              <button type="submit" disabled={addAppointment.isPending} className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50">
                {addAppointment.isPending ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Appointments List */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No appointments</h3>
            <p className="text-sm text-muted-foreground mb-4">Book your first appointment to get started.</p>
            <button onClick={() => setShowBook(true)} className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110">
              <Plus className="size-4" />
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((appt) => (
              <div key={appt.id} className="px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                    <Stethoscope className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{appt.doctor_name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="size-3" /> {appt.hospital_name}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" /> {appt.department}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appt.appointment_date ? new Date(appt.appointment_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}
                  </p>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight mt-1 ${statusBadge[appt.status] || ""}`}>
                    {appt.status}
                  </span>
                </div>
                {appt.status === "scheduled" && (
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => updateStatus.mutate({ id: appt.id, status: "completed" })} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark completed">
                      <CheckCircle2 className="size-4" />
                    </button>
                    <button onClick={() => updateStatus.mutate({ id: appt.id, status: "cancelled" })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                      <XCircle className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
