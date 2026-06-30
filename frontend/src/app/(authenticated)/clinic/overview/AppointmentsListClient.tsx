"use client";
import { useState } from "react";

const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

export default function AppointmentsListClient({ appointments }: { appointments: any[] }) {
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  
  return (
    <>
      <div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Today's Schedule</h2>
          <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-1 rounded-full">{appointments.length} Left</span>
        </div>
        <div className="p-4 space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="p-4 border border-slate-100 rounded-xl hover:border-cyan-200 transition-colors cursor-pointer bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900">{appt.patient_name}</span>
                <span className="text-xs font-bold text-slate-500">{appt.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{appt.type}</span>
                <button 
                  onClick={() => setSelectedAppt(appt)}
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
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
                <p className="text-base font-semibold text-slate-900">{selectedAppt.patient_name}</p>
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
                    {selectedAppt.type}
                  </span>
                </div>
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
