"use client";








const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
import { useState } from "react";
import { toast } from "sonner";
const initialMockAppointments = [
  { id: "1", doctor_name: "Dr. Sarah Jenkins", hospital_name: "Apollo Hospital", department: "Cardiology", appointment_date: "2026-06-15T10:30:00Z", status: "scheduled", notes: "Routine checkup" },
  { id: "2", doctor_name: "Dr. Alan Watts", hospital_name: "Max Healthcare", department: "Neurology", appointment_date: "2026-06-10T14:00:00Z", status: "completed", notes: "Migraine follow-up" },
  { id: "3", doctor_name: "Dr. Priya Patel", hospital_name: "City Hospital", department: "Orthopedics", appointment_date: "2026-05-20T09:15:00Z", status: "completed", notes: "Knee pain" },
  { id: "4", doctor_name: "Dr. Michael Brown", hospital_name: "Apollo Hospital", department: "Pediatrics", appointment_date: "2026-06-25T11:00:00Z", status: "scheduled", notes: "Vaccination" },
];
export default function AppointmentsPage() {
  const [showBook, setShowBook] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [department, setDepartment] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  // Local state for mock data
  const [appointments, setAppointments] = useState(initialMockAppointments);
  const [isPending, setIsPending] = useState(false);
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      const newAppt = {
        id: Math.random().toString(36).substr(2, 9),
        doctor_name: doctorName,
        hospital_name: hospitalName,
        department,
        appointment_date: apptDate,
        status: "scheduled",
        notes,
      };
      setAppointments([...appointments, newAppt].sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()));
      toast.success("Appointment booked successfully!");
      // Reset form
      setShowBook(false);
      setDoctorName("");
      setHospitalName("");
      setDepartment("");
      setApptDate("");
      setNotes("");
      setIsPending(false);
    }, 500);
  };
  const handleUpdateStatus = (id: string, status: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Appointment marked as ${status}`);
  };
  const filtered = appointments.filter((a) => {
    const isPast = new Date(a.appointment_date) <= new Date();
    if (filter === "upcoming") return !isPast;
    if (filter === "past") return isPast;
    return true;
  });
  const statusBadge: Record<string, string> = {
    scheduled: "bg-cyan-50 text-[#0891b2] border border-[#0891b2]/20",
    completed: "bg-white text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex gap-3 mb-6 bg-slate-100/50 p-1.5 rounded-xl w-fit border border-slate-200/60">
        {(["all", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize shadow-sm ${
              filter === f 
                ? "bg-white text-[#0891b2] border border-slate-200" 
                : "bg-transparent text-slate-600 border border-transparent hover:bg-slate-200/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {/* Book Modal */}
      {showBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-slate-900">Book Appointment</h3>
              <button onClick={() => setShowBook(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor Name *</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="e.g. Dr. Mehta" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Hospital / Clinic *</label>
                <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="e.g. Apollo Hospital" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date & Time *</label>
                <input type="datetime-local" value={apptDate} onChange={(e) => setApptDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none" rows={3} placeholder="Any symptoms or concerns..." />
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-[#0891b2] text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50">
                  {isPending ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Appointments List */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="size-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="size-8 text-[#0891b2]" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">No appointments</h3>
            <button onClick={() => setShowBook(true)} className="inline-flex items-center gap-2 bg-[#0891b2] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm">
              <Plus className="size-4" />
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((appt) => (
              <div key={appt.id} className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-cyan-50 text-[#0891b2] rounded-xl flex items-center justify-center border border-cyan-100/50">
                    <Stethoscope className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-base">{appt.doctor_name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {appt.hospital_name}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {appt.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 ml-16 md:ml-0">
                  <div className="text-left md:text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {appt.appointment_date ? new Date(appt.appointment_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide mt-2 ${statusBadge[appt.status] || ""}`}>
                      {appt.status}
                    </span>
                  </div>
                  {appt.status === "scheduled" && (
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, "completed")} 
                        className="p-2 text-emerald-600 hover:bg-white hover:border-emerald-200 border border-transparent rounded-lg transition-colors" 
                        title="Mark completed"
                      >
                        <CheckCircle2 className="size-5" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, "cancelled")} 
                        className="p-2 text-red-500 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-lg transition-colors" 
                        title="Cancel appointment"
                      >
                        <XCircle className="size-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
