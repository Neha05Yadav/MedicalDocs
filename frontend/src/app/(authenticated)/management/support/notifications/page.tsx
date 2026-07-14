"use client";







const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const MessageSquare = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path></svg>;
const ShieldAlert = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const MoreHorizontal = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// Remove Mock Data
import { useEffect } from "react";
import { toast } from "sonner";
function SupportNotificationsContent() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/support-tickets/notifications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          type: n.type,
          priority: n.severity.toLowerCase() === 'high' ? 'high' : 'normal',
          read: n.isRead === 1,
          icon: n.type.includes('reply') ? MessageSquare : AlertTriangle,
          color: n.severity.toLowerCase() === 'high' ? 'text-red-600' : 'text-blue-600',
          bg: n.severity.toLowerCase() === 'high' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
        })));
      }
    } catch (e) {
      toast.error("Failed to load notifications");
    }
  };

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", val);
    router.push(`?${params.toString()}`);
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/support-tickets/notifications/mark-read", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (e) {
      toast.error("Failed to mark all as read");
    }
  };

  const markAsRead = async (id: string) => {
    // For individual read, we would need an API. Since we don't have one, we just mark all as read for now or update local state.
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const unreadCount = notifications.filter(n => !n.read).length;
  const renderNotifications = (items: typeof notifications) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">You have no notifications in this view. Excellent job keeping the queue clean.</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {items.map((notif) => (
          <div 
            key={notif.id} 
            className={`group relative flex items-start p-5 rounded-xl border transition-all duration-200 ${notif.read ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-blue-50/30 border-blue-100 shadow-sm'}`}
          >
            {/* Unread dot */}
            {!notif.read && (
              <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
            )}
            <div className={`p-3 rounded-xl border shrink-0 mt-0.5 ${notif.bg}`}>
              <notif.icon className={`h-5 w-5 ${notif.color}`} strokeWidth={2.5} />
            </div>
            <div className="ml-5 flex-1 pr-8">
              <div className="flex items-center gap-3 mb-1.5">
                <h4 className={`text-base font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h4>
                {notif.priority === 'high' && (
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5 h-5 uppercase tracking-wider font-bold">Critical</Badge>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>{notif.description}</p>
              <div className="flex items-center gap-6 mt-3">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {notif.time}
                </span>
                {!notif.read && (
                  <button onClick={() => markAsRead(notif.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-slate-500 mt-2">Stay updated with support alerts and system messages.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 bg-white border shadow-sm p-1.5 rounded-lg">
          <TabsTrigger value="all" className="px-5 py-2 rounded-md">
            All 
            {unreadCount > 0 && <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-xs font-bold">{unreadCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="unread" className="px-5 py-2 rounded-md">Unread</TabsTrigger>
          <TabsTrigger value="high-priority" className="px-5 py-2 rounded-md">Critical Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0 outline-none">
          {renderNotifications(notifications)}
        </TabsContent>
        <TabsContent value="unread" className="mt-0 outline-none">
          {renderNotifications(notifications.filter(n => !n.read))}
        </TabsContent>
        <TabsContent value="high-priority" className="mt-0 outline-none">
          {renderNotifications(notifications.filter(n => n.priority === 'high'))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default function SupportNotifications() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupportNotificationsContent />
    </Suspense>
  );
}
