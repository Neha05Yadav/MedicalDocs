"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { allNavs } from "./navConfig";
import styles from "./dashboard-theme.module.css";

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
  const isPatient = path.startsWith("/patient");

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

    // The database profile is authoritative. Refresh the cached login name so
    // an existing browser session cannot keep showing an older/mismatched name.
    const refreshPatientIdentity = async () => {
      if (!isPatient) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("/api/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const profile = await response.json();
        if (!profile?.name) return;

        setUserName(profile.name);
        const parts = String(profile.name).trim().split(/\s+/);
        setUserInitials(
          (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]).toUpperCase(),
        );

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, name: profile.name, email: profile.email, id: storedUser.id || profile.id }),
        );
      } catch {
        // Keep the last known identity while the backend is temporarily unavailable.
      }
    };

    refreshPatientIdentity();

    const recordActivity = () => {
      const token = localStorage.getItem("token");
      if (!token || document.visibilityState === "hidden") return;
      fetch("/api/auth/activity/heartbeat", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      }).catch(() => undefined);
    };
    recordActivity();
    const activityInterval = setInterval(recordActivity, 60000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") recordActivity();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Fetch unread notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        let endpoint = "";
        if (isHospital) endpoint = "/api/hospital/notifications";
        else if (isClinic) endpoint = "/api/clinic/notifications";
        else if (isLaboratory) endpoint = "/api/laboratory/notifications";
        else if (isSupport) endpoint = "/api/support-tickets/notifications";
        else if (isSuperAdmin) endpoint = "/api/management/super-admin/notifications";
        else if (isSales) endpoint = "/api/management/sales/notifications";
        else if (isAccounts) endpoint = "/api/management/accounts/notifications";
        else if (isAdmin) endpoint = "/api/management/admin/notifications";
        else {
          endpoint = "/api/patient/notifications";
        }

        if (endpoint) {
          const res = await fetch(endpoint, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const notifications = Array.isArray(data) ? data : data.notifications || [];
            const unread = notifications.filter((notification: any) => {
              const isRead =
                notification.isRead === true ||
                notification.isRead === 1 ||
                notification.read === true ||
                notification.read === 1 ||
                notification.is_read === true ||
                notification.is_read === 1;

              return !isRead;
            }).length;
            setUnreadCount(unread);
          }
        }
      } catch (err) {
        // Silently ignore fetch errors during background polling
        // This prevents terminal spam (TypeError: Failed to fetch) when the backend restarts
      }
    };

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for custom event when notifications are marked as read
    window.addEventListener('notificationsRead', fetchNotifications);
    
    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener('notificationsRead', fetchNotifications);
    };
  }, [isHospital, isSuperAdmin, isSales, isAccounts, isAdmin, isSupport, isClinic, isLaboratory, isPatient]);
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
    if (isLaboratory) return { title: "Laboratory Dashboard", subtitle: "Monitor your live testing queue and reports." };
    if (isClinic) return { title: "Clinic Dashboard", subtitle: "Welcome to the clinic dashboard." };
    return { title: "Patient Dashboard", subtitle: "Your comprehensive health overview at a glance." };
  };
  const headerInfo = getHeaderInfo();

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>
          {headerInfo.title}
        </h1>
        <p className={styles.subtitle}>
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
          <div className={styles.iconButton}>
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
              const token = localStorage.getItem("token");
              if (token) {
                fetch("/api/auth/logout", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  keepalive: true,
                }).catch(() => undefined);
              }
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            }
          }}
          className={styles.profile}
          title="Click to log out"
        >
          <div className={styles.avatar}>
             {userInitials || (isSuperAdmin ? "SA" : isAccounts ? "AM" : isSales ? "SM" : isSupport ? "SR" : isAdmin ? "AD" : isHospital ? "HA" : isLaboratory ? "LA" : isClinic ? "CA" : "PA")}
          </div>
          <div className="hidden md:block text-left">
            <div className={styles.profileName}>
              {userName || (isSuperAdmin ? "Super Admin" : isAccounts ? "Accounts Manager" : isSales ? "Sales Manager" : isSupport ? "Support Agent" : isAdmin ? "System Admin" : isHospital ? "Hospital Admin" : isLaboratory ? "Laboratory Admin" : isClinic ? "Clinic Admin" : "Patient")}
            </div>
            {!isHospital && (
              <div className={styles.profilePortal}>
                {isSuperAdmin ? "Management" : isAccounts ? "Management" : isSales ? "Management" : isSupport ? "Management" : isAdmin ? "Management" : isLaboratory ? "Laboratory" : isClinic ? "Clinic" : "Patient Portal"}
              </div>
            )}
            {isHospital && (
              <div className={styles.profilePortal}>
                Hospital Portal
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
