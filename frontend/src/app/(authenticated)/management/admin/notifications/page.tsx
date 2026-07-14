"use client";
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const Send = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Info = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const MoreVertical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;








import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>;
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'Info', severity: 'Low' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/management/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/management/admin/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (e) {
      toast.error('Error updating notification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/management/admin/notifications/${id}`, { method: 'DELETE' });
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (e) {
      toast.error('Error deleting notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/management/admin/notifications/read-all', { method: 'PUT' });
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (e) {
      toast.error('Error updating notifications');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/management/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      });
      if (res.ok) {
        toast.success('Notification created');
        setIsCreateModalOpen(false);
        setNewNotif({ title: '', message: '', type: 'Info', severity: 'Low' });
        fetchNotifications();
      }
    } catch (e) {
      toast.error('Error creating notification');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create Notification
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">System Alerts & Logs</h3>
          <button onClick={handleMarkAllAsRead} className="text-xs font-bold text-indigo-600 hover:underline">Mark all as read</button>
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
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
                  <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap ml-4">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{notif.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    notif.severity === 'High' ? 'bg-rose-100 text-rose-700' : 
                    notif.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {notif.severity} Priority
                  </span>
                  {!notif.isRead && (
                    <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                      <span className="size-1.5 rounded-full bg-indigo-600" /> New
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {!notif.isRead && (
                  <button onClick={() => handleMarkAsRead(notif.id)} title="Mark as Read" className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Check className="size-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(notif.id)} title="Delete" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-medium">
              No notifications found.
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Broadcast Notification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
              <input required type="text" value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Scheduled Maintenance" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
              <textarea required value={newNotif.message} onChange={e => setNewNotif({...newNotif, message: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" placeholder="Notification details..." rows={3}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                <select value={newNotif.type} onChange={e => setNewNotif({...newNotif, type: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white">
                  <option value="Info">Info</option>
                  <option value="Alert">Alert</option>
                  <option value="Success">Success</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Severity</label>
                <select value={newNotif.severity} onChange={e => setNewNotif({...newNotif, severity: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors w-full">
                Broadcast Alert
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
