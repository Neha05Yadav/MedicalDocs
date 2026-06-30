"use client";


const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>;
import { useState } from "react";
const initialNotifications = [
  { id: "1", title: "Appointment reminder", message: "Your appointment with Dr. Mehta is tomorrow at 10:00 AM.", time: "2 hours ago", read: false },
  { id: "2", title: "Record shared", message: "City Hospital has viewed your shared Chest X-Ray report.", time: "1 day ago", read: false },
  { id: "3", title: "New prescription added", message: "A new prescription was uploaded to your records.", time: "3 days ago", read: true },
  { id: "4", title: "Profile updated", message: "Your emergency contact information was successfully updated.", time: "1 week ago", read: true },
];
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="p-8">
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.id} className={`px-6 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors ${!n.read ? "bg-brand-muted/30" : ""}`}>
            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}>
              <Bell className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{n.title}</p>
                {!n.read && <span className="size-1.5 rounded-full bg-brand" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {!n.read && (
              <button onClick={() => markAsRead(n.id)} className="text-xs text-brand font-medium hover:underline flex items-center gap-1 shrink-0">
                <Check className="size-3" /> Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
