"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Hardcoded SVGs instead of lucide-react to avoid TS/import errors
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const Info = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;

export default function SuperAdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/management/super-admin/notifications');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        console.error("API returned non-array:", data);
        setNotifications([]);
        // Optional: toast.error("Please run the SQL script to create the table.");
      }
    } catch (error) {
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/management/super-admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'mark_read' })
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        toast.success("Marked as read");
      }
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/management/super-admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="size-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="size-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="size-5 text-emerald-500" />;
      default: return <Info className="size-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-8" />
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-8 max-w-4xl mx-auto w-full font-sans space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="size-6 text-slate-400" />
            Global Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">Platform alerts, system errors, and onboarding requests.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Check className="size-4" />
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Bell className="size-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No notifications</h3>
            <p className="text-sm text-slate-500">You're all caught up! There are no new alerts.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-5 rounded-xl border transition-all ${
                notification.is_read 
                  ? 'bg-white border-slate-200 shadow-sm opacity-75' 
                  : 'bg-indigo-50/30 border-indigo-100 shadow-sm ring-1 ring-indigo-500/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full mt-1 ${
                  notification.is_read ? 'bg-slate-50' : 'bg-white shadow-sm'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${notification.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${notification.is_read ? 'text-slate-500' : 'text-slate-600'}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {notification.action_url && (
                      <Link 
                        href={notification.action_url}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View Details
                      </Link>
                    )}
                    
                    {!notification.is_read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Check className="size-3" /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
