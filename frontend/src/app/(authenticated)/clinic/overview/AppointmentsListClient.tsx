"use client";
import { useState } from "react";

const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

export default function AppointmentsListClient({ appointments, mode = "upcoming" }: { appointments: any[]; mode?: "upcoming" | "recent" }) {
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  
  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_16px_38px_-30px_rgba(15,23,42,.4)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-6">
          <div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Consultation queue</p><h2 className="mt-1 text-2xl font-black text-slate-950">{mode === "recent" ? "Recent schedule" : "Upcoming schedule"}</h2></div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">{appointments.length}</span>
        </div>
        <div className="space-y-3 p-5">
          {appointments.map((appt, index) => (
            <div key={appt.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40">
              <span className="absolute bottom-0 left-0 top-0 w-1 bg-emerald-500" />
              <div className="mb-3 flex items-start justify-between pl-2">
                <div><span className="text-xs font-black uppercase tracking-wider text-slate-400">Queue {String(index + 1).padStart(2, "0")}</span><p className="mt-1 font-black text-slate-900">{appt.patientName || "Patient"}</p></div>
                <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 shadow-sm">{appt.date}</span>
              </div>
              <div className="flex items-center justify-between pl-2">
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{appt.time} · {appt.status}</span>
                <button 
                  onClick={() => setSelectedAppt(appt)}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
              <div><Calendar className="mx-auto size-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No appointments recorded</p><p className="mt-1 text-xs text-slate-400">New database bookings will appear here automatically.</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="size-5 text-[#0891b2]" />
                Appointment Details
              </h3>
              <button 
                onClick={() => setSelectedAppt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Patient Name</p>
                <p className="text-base font-semibold text-slate-900">{selectedAppt.patientName || "Patient"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Clock className="size-4 text-[#0891b2]" /> {selectedAppt.time}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</p>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                    {selectedAppt.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date & Notes</p>
                <p className="text-sm font-medium text-slate-800">{selectedAppt.date}</p>
                <p className="mt-1 text-sm text-slate-500">{selectedAppt.notes}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
