"use client";

import { useState } from "react";
import { 
  Bell, FileText, CheckCircle2, ShieldAlert, Activity, User, Trash2
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const initialNotifications = [
  { id: "NOTIF-01", type: "TestRequest", title: "New Test Request", message: "Dr. Rohan Verma requested a Complete Blood Count for patient Rahul Sharma.", time: "10 mins ago", isRead: false, actionRequired: true },
  { id: "NOTIF-02", type: "AccessGranted", title: "Access Granted", message: "Priya Singh granted you access to their medical history.", time: "2 hours ago", isRead: false, actionRequired: false },
  { id: "NOTIF-03", type: "TestRequest", title: "New Walk-in Test", message: "Patient Amit Kumar registered for HbA1c test.", time: "4 hours ago", isRead: true, actionRequired: true },
  { id: "NOTIF-04", type: "System", title: "System Maintenance", message: "Scheduled maintenance tonight at 2:00 AM.", time: "1 day ago", isRead: true, actionRequired: false },
];

export default function LabNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"All" | "Unread" | "Action Required">("All");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "Action Required") return n.actionRequired;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "TestRequest": return <Activity className="size-5 text-blue-600" />;
      case "AccessGranted": return <ShieldAlert className="size-5 text-emerald-600" />;
      default: return <Bell className="size-5 text-slate-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "TestRequest": return "bg-blue-50";
      case "AccessGranted": return "bg-emerald-50";
      default: return "bg-slate-100";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on new test requests and alerts.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="size-4" />
            Mark all as read
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-6">
        {(["All", "Unread", "Action Required"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === tab ? "bg-white text-[#1e5eff] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
            {tab === "Unread" && notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-[#1e5eff] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex gap-4 transition-colors relative group ${
                  !notif.isRead ? "bg-blue-50/30" : "hover:bg-slate-50"
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e5eff]"></div>
                )}
                
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className={`text-base font-bold truncate ${!notif.isRead ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className={`text-sm mb-3 ${!notif.isRead ? "text-slate-700" : "text-slate-500"}`}>
                    {notif.message}
                  </p>
                  
                  {notif.actionRequired && (
                    <div className="flex gap-3">
                      <button className="px-4 py-1.5 bg-[#1e5eff] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        Accept Request
                      </button>
                      <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        View Details
                      </button>
                    </div>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start">
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Bell className="size-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500">You don't have any notifications in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
