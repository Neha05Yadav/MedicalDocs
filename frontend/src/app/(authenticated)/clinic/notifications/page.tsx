"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/clinic/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        // Opening the notification centre counts as viewing the notifications.
        // Persist that state so the dashboard bell badge also clears.
        if (data.some((notification: any) => !notification.isRead)) {
          const markReadResponse = await fetch("/api/clinic/notifications/read-all", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (markReadResponse.ok) {
            setNotifications(data.map((notification: any) => ({ ...notification, isRead: true })));
            window.dispatchEvent(new Event("notificationsRead"));
          }
        }
      } else {
        setNotifications([]);
      }
    } catch (e) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/clinic/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new Event("notificationsRead"));
      toast.success("Marked as read");
    } catch (e) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/clinic/notifications/read-all`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to mark notifications as read");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event("notificationsRead"));
      toast.success("All notifications marked as read");
    } catch (e) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/clinic/notifications/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        window.dispatchEvent(new Event("notificationsRead"));
      }
    } catch (e) {
      toast.error("Failed to delete notification.");
    }
  };

  const getIconForType = (type: string) => {
    if (type === "Request") return ShieldCheck;
    if (type === "Appointment") return Calendar;
    return Bell;
  };

  const getColorForType = (type: string, isRead: boolean) => {
    if (type === "Request") return "text-emerald-600 bg-emerald-50";
    if (type === "Appointment") return "text-[#0891b2] bg-cyan-50";
    return "text-amber-600 bg-amber-50";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 className="size-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading notifications...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => {
              const Icon = getIconForType(notif.type);
              const colorClass = getColorForType(notif.type, notif.isRead);

              return (
                <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/50 group ${notif.isRead ? "opacity-75" : "bg-cyan-50/10"}`}>
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="size-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-sm ${notif.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="size-3" /> {getTimeAgo(notif.time)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                    
                    <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {notif.type.startsWith('PATIENT_APPROVED|') && (
                        <button
                          onClick={() => {
                            const patientId = notif.type.split('|')[1];
                            if (!notif.isRead) markAsRead(notif.id);
                            router.push(`/clinic/patients?viewPatientId=${patientId}`);
                          }}
                          className="text-xs font-semibold text-[#0052cc] hover:underline flex items-center gap-1"
                        >
                          <FileText className="size-3.5" /> View Patient
                        </button>
                      )}
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs font-semibold text-[#0891b2] hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="size-3.5" /> Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <div className="size-2.5 bg-[#0891b2] rounded-full shrink-0 mt-2"></div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Bell className="size-12 text-slate-300 mx-auto mb-4" />
              <p className="font-medium text-slate-600">No new notifications</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
