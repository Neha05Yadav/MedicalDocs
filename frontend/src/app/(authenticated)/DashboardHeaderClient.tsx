"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { allNavs } from "./navConfig";

const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;

export default function DashboardHeaderClient() {
  const pathname = usePathname() || "";
  const path = pathname.toLowerCase();
  
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const isSuperAdmin = path.includes("/management/super-admin");
  const isSales = path.includes("/management/sales");
  const isAccounts = path.includes("/management/accounts");
  const isAdmin = path.includes("/management/admin");
  const isSupport = path.includes("/management/support");
  const isHospital = path.startsWith("/hospital");
  const isClinic = path.startsWith("/clinic");
  const isLaboratory = path.startsWith("/laboratory");

  useEffect(() => {
    // Get user from local storage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          setUserName(user.name);
          const parts = user.name.split(" ");
          const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
          setUserInitials(initials.toUpperCase());
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch unread notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        let endpoint = "";
        if (isHospital) endpoint = "/api/hospital/notifications";
        else if (isClinic) endpoint = "/api/clinic/notifications";
        else if (isLaboratory) endpoint = "/api/laboratory/notifications";
        else if (!isSuperAdmin && !isSales && !isAccounts && !isAdmin && !isSupport) {
          endpoint = "/api/patient/notifications";
        }

        if (endpoint) {
          const res = await fetch(endpoint, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const unread = data.filter((n: any) => !n.isRead && !n.read).length;
            setUnreadCount(unread);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for custom event when notifications are marked as read
    window.addEventListener('notificationsRead', fetchNotifications);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsRead', fetchNotifications);
    };
  }, [isHospital, isSuperAdmin, isSales, isAccounts, isAdmin, isSupport, isClinic, isLaboratory]);
  const getHeaderInfo = () => {
    // Collect all navigation items
    const allRoutes = [
      ...allNavs.superAdmin, ...allNavs.admin, ...allNavs.sales, ...allNavs.accounts, 
      ...allNavs.support, ...allNavs.hospital, ...allNavs.laboratory, ...allNavs.clinic, ...allNavs.patient
    ];

    // Find the exact active route
    const activeRoute = allRoutes.find(r => path === r.url || path.startsWith(r.url + '/'));
    
    if (activeRoute) {
      return { title: activeRoute.title, subtitle: activeRoute.subtitle };
    }

    // Fallbacks if not found
    if (isSuperAdmin) return { title: "Super Admin Dashboard", subtitle: "Platform overview and key performance metrics." };
    if (isAccounts) return { title: "Accounts Dashboard", subtitle: "Financial summary and key accounting metrics." };
    if (isSales) return { title: "Sales Dashboard", subtitle: "Sales dashboard and high-level revenue metrics." };
    if (isSupport) return { title: "Support Dashboard", subtitle: "Support operations and ticket metrics at a glance." };
    if (isAdmin) return { title: "Admin Dashboard", subtitle: "System overview, KPIs, and recent activities." };
    if (isHospital) return { title: "Hospital Dashboard", subtitle: "Overview of hospital operations and patient flow." };
    if (isLaboratory) return { title: "Laboratory Dashboard", subtitle: "Welcome to Apex Labs. Monitor your testing queue." };
    if (isClinic) return { title: "Clinic Dashboard", subtitle: "Welcome to the clinic dashboard." };
    return { title: "Patient Dashboard", subtitle: "Your comprehensive health overview at a glance." };
  };
  const headerInfo = getHeaderInfo();

  return (
    <header className="h-[72px] border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {headerInfo.title}
        </h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          {headerInfo.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-5">
        {isHospital && (
          <Link href="/hospital/subscription" prefetch={false}>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 border border-amber-400/50 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Upgrade to Pro
            </div>
          </Link>
        )}
        <Link href={
          isSuperAdmin ? "/management/super-admin/notifications" :
          isSales ? "/management/sales/notifications" :
          isAccounts ? "/management/accounts/notifications" :
          isAdmin ? "/management/admin/notifications" :
          isSupport ? "/management/support/notifications" :
          isHospital ? "/hospital/notifications" :
          isClinic ? "/clinic/notifications" :
          isLaboratory ? "/laboratory/notifications" :
          "/patient/notifications"
        } prefetch={false}>
          <div className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </Link>
        <div 
          onClick={() => {
            if (confirm("Are you sure you want to log out?")) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors"
          title="Click to log out"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden relative text-sm uppercase">
             {userInitials || (isSuperAdmin ? "SA" : isAccounts ? "AM" : isSales ? "SM" : isSupport ? "SR" : isAdmin ? "AD" : isHospital ? "HA" : isLaboratory ? "LA" : isClinic ? "CA" : "PA")}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {userName || (isSuperAdmin ? "Super Admin" : isAccounts ? "Accounts Manager" : isSales ? "Sales Manager" : isSupport ? "Support Agent" : isAdmin ? "System Admin" : isHospital ? "Hospital Admin" : isLaboratory ? "Laboratory Admin" : isClinic ? "Clinic Admin" : "Patient")}
            </div>
            {!isHospital && (
              <div className="text-[12px] text-slate-500">
                {isSuperAdmin ? "Management" : isAccounts ? "Management" : isSales ? "Management" : isSupport ? "Management" : isAdmin ? "Management" : isLaboratory ? "Laboratory" : isClinic ? "Clinic" : "Patient Portal"}
              </div>
            )}
            {isHospital && (
              <div className="text-[12px] text-slate-500">
                Hospital Portal
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
