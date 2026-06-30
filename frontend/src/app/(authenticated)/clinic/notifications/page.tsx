"use client";
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;






// Mock data
const mockNotifications = [
  { id: 1, type: "access_granted", title: "Access Granted", message: "Aman Singh has granted you access to their medical records.", time: "10 mins ago", icon: ShieldCheck, color: "text-emerald-600 bg-white", read: false },
  { id: 2, type: "appointment", title: "New Appointment", message: "Neha Gupta has booked an appointment for tomorrow at 10:30 AM.", time: "2 hours ago", icon: Calendar, color: "text-[#0891b2] bg-cyan-50", read: false },
  { id: 3, type: "system", title: "System Update", message: "MediDoc platform maintenance scheduled for this weekend.", time: "1 day ago", icon: Bell, color: "text-amber-600 bg-amber-50", read: true },
  { id: 4, type: "access_granted", title: "Access Granted", message: "Rahul Sharma has granted you access to their medical records.", time: "2 days ago", icon: ShieldCheck, color: "text-emerald-600 bg-white", read: true },
];
export default function DoctorNotificationsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/50 ${notif.read ? "opacity-75" : "bg-cyan-50/10"}`}>
              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                <notif.icon className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm ${notif.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="size-3" /> {notif.time}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <div className="mt-3">
                    <button className="text-xs font-semibold text-[#0891b2] hover:underline flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Mark as read
                    </button>
                  </div>
                )}
              </div>
              {!notif.read && (
                <div className="size-2.5 bg-[#0891b2] rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          ))}
          {mockNotifications.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Bell className="size-8 text-slate-300 mx-auto mb-3" />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
