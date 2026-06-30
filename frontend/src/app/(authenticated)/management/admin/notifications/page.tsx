"use client";
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const Send = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Info = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const MoreVertical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;








import React, { useState } from 'react';
import { toast } from "sonner";
const mockNotifications = [
  { id: "NOT-001", type: "Alert", title: "High Server CPU Usage", message: "Server cluster 2 is experiencing >90% CPU usage.", time: "10 mins ago", status: "Unread", severity: "High" },
  { id: "NOT-002", type: "Info", title: "New Facility Registered", message: "Carewell Clinic has submitted a registration request.", time: "1 hour ago", status: "Unread", severity: "Low" },
  { id: "NOT-003", type: "Success", title: "System Backup Completed", message: "Daily automated database backup completed successfully.", time: "3 hours ago", status: "Read", severity: "Low" },
  { id: "NOT-004", type: "Alert", title: "Payment Gateway Error", message: "Multiple failed transaction attempts from node 4.", time: "5 hours ago", status: "Read", severity: "High" },
  { id: "NOT-005", type: "Info", title: "Scheduled Maintenance", message: "System will undergo maintenance on Sunday 2:00 AM.", time: "1 day ago", status: "Read", severity: "Medium" },
];
export default function AdminNotificationsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <button 
          onClick={() => toast.success("Notification creation dialog triggered!")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create Notification
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Recent Alerts & Logs</h3>
          <button className="text-xs font-bold text-indigo-600 hover:underline">Mark all as read</button>
        </div>
        <div className="divide-y divide-slate-100">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${notif.status === 'Unread' ? 'bg-indigo-50/30' : ''}`}>
              <div className="shrink-0 mt-1">
                {notif.type === 'Alert' ? (
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                    <AlertTriangle className="size-5" />
                  </div>
                ) : notif.type === 'Success' ? (
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 className="size-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Info className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${notif.status === 'Unread' ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-600">{notif.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    notif.severity === 'High' ? 'bg-rose-100 text-rose-700' : 
                    notif.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {notif.severity} Priority
                  </span>
                  {notif.status === 'Unread' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                      <span className="size-1.5 rounded-full bg-indigo-600" /> New
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
