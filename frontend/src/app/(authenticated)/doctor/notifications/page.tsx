"use client";

import { Bell, CheckCircle2, Calendar, ShieldCheck, Clock } from "lucide-react";

// Mock data
const mockNotifications = [
  { id: 1, type: "access_granted", title: "Access Granted", message: "Aman Singh has granted you access to their medical records.", time: "10 mins ago", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50", read: false },
  { id: 2, type: "appointment", title: "New Appointment", message: "Neha Gupta has booked an appointment for tomorrow at 10:30 AM.", time: "2 hours ago", icon: Calendar, color: "text-[#1e5eff] bg-blue-50", read: false },
  { id: 3, type: "system", title: "System Update", message: "MediDoc platform maintenance scheduled for this weekend.", time: "1 day ago", icon: Bell, color: "text-amber-600 bg-amber-50", read: true },
  { id: 4, type: "access_granted", title: "Access Granted", message: "Rahul Sharma has granted you access to their medical records.", time: "2 days ago", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50", read: true },
];

export default function DoctorNotificationsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b] flex items-center gap-3">
            Notifications 
            <span className="bg-[#1e5eff] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {mockNotifications.filter(n => !n.read).length} New
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on patient access approvals and appointments.</p>
        </div>
        <button className="text-sm font-medium text-[#1e5eff] hover:underline">Mark all as read</button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/50 ${notif.read ? "opacity-75" : "bg-blue-50/10"}`}>
              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                <notif.icon className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm ${notif.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="size-3" /> {notif.time}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <div className="mt-3">
                    <button className="text-xs font-semibold text-[#1e5eff] hover:underline flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Mark as read
                    </button>
                  </div>
                )}
              </div>
              {!notif.read && (
                <div className="size-2.5 bg-[#1e5eff] rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          ))}
          {mockNotifications.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Bell className="size-8 text-slate-300 mx-auto mb-3" />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
