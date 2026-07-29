"use client";
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const RefreshCcw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>;









import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
function AccountsNotificationsContent() {
  const tabs = ["All Notifications", "Payment Alerts", "Invoices", "Refunds"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "All Notifications";
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", val);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetch('/api/management/accounts/notifications')
      .then(res => res.json())
      .then(async data => {
        const fetchedNotifications = data.notifications || [];
        setNotifications(fetchedNotifications);
        if (fetchedNotifications.some((notification: any) => !notification.isRead)) {
          const response = await fetch('/api/management/accounts/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'mark_all_read' }),
          });
          if (response.ok) {
            setNotifications(
              fetchedNotifications.map((notification: any) => ({ ...notification, isRead: true })),
            );
            window.dispatchEvent(new Event('notificationsRead'));
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load notifications", err);
        setLoading(false);
      });
  }, []);
  const filteredNotifications = activeTab === "All Notifications" 
    ? notifications 
    : notifications.filter(n => n.tab === activeTab);
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Accounts Notifications</h2>
          <p className="text-slate-500 mt-2">Stay updated with billing, payments, and invoices.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-indigo-50 text-indigo-700 border-indigo-100 border shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex gap-4 hover:border-indigo-200 transition-colors cursor-pointer group">
                <div className="shrink-0 mt-1">
                  {notif.type === 'payment' ? (
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100"><AlertTriangle className="size-5" /></div>
                  ) : notif.type === 'invoice' ? (
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100"><FileText className="size-5" /></div>
                  ) : notif.type === 'refund' ? (
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100"><RefreshCcw className="size-5" /></div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100"><CreditCard className="size-5" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{notif.title}</h4>
                    <span className="text-[11px] font-bold text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-xs font-bold text-indigo-600 mb-2">{notif.facility}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{notif.desc}</p>
                </div>
                <div className="shrink-0 flex items-center pl-4 border-l border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="size-5 text-indigo-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No notifications found for "{activeTab}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function AccountsNotificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountsNotificationsContent />
    </Suspense>
  );
}
