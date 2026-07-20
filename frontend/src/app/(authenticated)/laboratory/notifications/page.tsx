"use client";







const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ShieldAlert = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';

export default function LabNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Unread" | "Action Required">("All");

  useEffect(() => {
    fetchNotifications();
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = `/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      
      const res = await fetch("/api/laboratory/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);

        // Auto mark as read when page is opened
        const hasUnread = data.some((n: any) => !n.isRead);
        if (hasUnread) {
          fetch("/api/laboratory/notifications/read-all", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
          }).then(() => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            window.dispatchEvent(new Event('notificationsRead'));
          }).catch(e => console.error("Auto mark read failed", e));
        }

      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "Action Required") return n.actionRequired;
    return true;
  });

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/laboratory/notifications/read-all", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
        window.dispatchEvent(new Event('notificationsRead'));
      }
    } catch (e) {
      toast.error("Error marking all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/laboratory/notifications/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success("Notification deleted");
      }
    } catch (e) {
      toast.error("Error deleting notification");
    }
  };

  const markAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif?.isRead) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/laboratory/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Request": return <Activity className="size-5 text-cyan-600" />;
      case "Alert": return <ShieldAlert className="size-5 text-emerald-600" />;
      default: return <Bell className="size-5 text-slate-600" />;
    }
  };
  const getIconBg = (type: string) => {
    switch (type) {
      case "TestRequest": return "bg-cyan-50";
      case "AccessGranted": return "bg-white";
      default: return "bg-slate-100";
    }
  };
  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      {/* Filters */}
      <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-6">
        {(["All", "Unread", "Action Required"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === tab ? "bg-white text-[#0891b2] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
            {tab === "Unread" && notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-[#0891b2] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {notifications.filter(n => !n.isRead).length > 0 && (
        <div className="mb-4 flex justify-end">
          <button onClick={markAllAsRead} className="text-sm font-bold text-[#0891b2] hover:text-cyan-700 transition-colors">
            Mark all as read
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => !notif.isRead && markAsRead(notif.id)}
                className={`p-6 flex gap-4 transition-colors relative group cursor-pointer ${
                  !notif.isRead ? "bg-cyan-50/30" : "hover:bg-slate-50"
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0891b2]"></div>
                )}
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className={`text-base font-bold truncate ${!notif.isRead ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${!notif.isRead ? "text-slate-700" : "text-slate-500"}`}>
                    {notif.message}
                  </p>
                  {notif.actionRequired && (
                    <div className="flex gap-3">
                      <button className="px-4 py-1.5 bg-[#0891b2] text-white text-xs font-bold rounded-lg hover:bg-cyan-700 transition-colors shadow-sm">
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
          </div>
        )}
      </div>
    </div>
  );
}
