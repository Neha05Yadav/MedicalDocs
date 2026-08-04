"use client";


const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>;
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getNotificationTarget } from "@/lib/notification-navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("/api/patient/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        
        // Auto-mark as read in background so the bell icon clears immediately
        const hasUnread = data.some((n: any) => !n.read);
        if (hasUnread) {
          fetch('/api/patient/notifications/read-all', {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
          }).then(() => {
            window.dispatchEvent(new Event('notificationsRead'));
          }).catch(console.error);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(`/api/patient/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        window.dispatchEvent(new Event('notificationsRead'));
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch('/api/patient/notifications/read-all', {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        window.dispatchEvent(new Event('notificationsRead'));
      }
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = (notification: any) => {
    if (!notification.read) void markAsRead(notification.id);
    router.push(getNotificationTarget(notification, "patient"));
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-[#0891b2] text-white px-3 py-1 rounded-full text-sm font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-semibold text-[#0891b2] hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-cyan-100"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden divide-y divide-border bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No notifications found.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} onClick={() => openNotification(n)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openNotification(n); }} className={`px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? "bg-cyan-50/30" : ""}`}>
              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-cyan-100 text-[#0891b2]" : "bg-slate-100 text-slate-400"}`}>
                <Bell className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-slate-800">{n.title}</p>
                  {!n.read && <span className="size-1.5 rounded-full bg-[#0891b2]" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5 whitespace-pre-wrap">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={(event) => { event.stopPropagation(); void markAsRead(n.id); }} className="text-xs text-[#0891b2] font-medium hover:underline flex items-center gap-1 shrink-0">
                  <Check className="size-3" /> Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
