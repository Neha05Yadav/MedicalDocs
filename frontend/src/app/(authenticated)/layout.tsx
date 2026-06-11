"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard, FileText, Calendar, Pill, Users, Bell, Settings,
  Hospital, Stethoscope, ClipboardList, BarChart3, ChevronLeft, LogOut, CreditCard, User, ShieldCheck, FlaskConical
} from "lucide-react";

const patientNav = [
  { title: "Dashboard", url: "/patient", icon: LayoutDashboard },
  { title: "Health Records", url: "/records", icon: FileText },
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Access Requests", url: "/access-requests", icon: ShieldCheck },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
];

const doctorNav = [
  { title: "Dashboard", url: "/doctor", icon: LayoutDashboard },
  { title: "Patients", url: "/doctor/patients", icon: Users },
  { title: "Prescriptions", url: "/doctor/prescriptions", icon: Pill },
  { title: "Reports", url: "/doctor/reports", icon: ClipboardList },
  { title: "Notifications", url: "/doctor/notifications", icon: Bell },
  { title: "Profile", url: "/doctor/profile", icon: User },
];

const hospitalNav = [
  { title: "Dashboard", url: "/hospital", icon: LayoutDashboard },
  { title: "Doctors", url: "/hospital/doctors", icon: Stethoscope },
  { title: "Patient Search & Verification", url: "/hospital/patients", icon: Users },
  { title: "Reports", url: "/hospital/reports", icon: ClipboardList },
  { title: "Billing & Payments", url: "/hospital/billing", icon: CreditCard },
  { title: "Departments", url: "/hospital/departments", icon: Hospital },
  { title: "Notifications", url: "/hospital/notifications", icon: Bell },
  { title: "Analytics", url: "/hospital/analytics", icon: BarChart3 },
];

const laboratoryNav = [
  { title: "Dashboard", url: "/laboratory", icon: LayoutDashboard },
  { title: "Test Requests", url: "/laboratory/test-requests", icon: FileText },
  { title: "Reports", url: "/laboratory/reports", icon: ClipboardList },
  { title: "Sample Management", url: "/laboratory/sample-management", icon: FlaskConical },
  { title: "Patients", url: "/laboratory/patients", icon: Users },
  { title: "Notifications", url: "/laboratory/notifications", icon: Bell },
  { title: "Profile", url: "/laboratory/profile", icon: User },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false); // Set to false for testing
  const pathname = usePathname() || "";
  const router = useRouter();

  useEffect(() => {
    // Authentication bypassed for testing
    /*
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    });
    */
  }, [router]);

  if (loading) return null;

  const path = pathname.toLowerCase();
  const isHospital = path.startsWith("/hospital");
  const isDoctor = path.startsWith("/doctor");
  const isLaboratory = path.startsWith("/laboratory");
  const nav = isHospital ? hospitalNav : isLaboratory ? laboratoryNav : isDoctor ? doctorNav : patientNav;

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex w-full">
      {/* Sidebar */}
      <aside
        className={`shrink-0 border-r border-border bg-card flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="h-16 border-b border-border flex items-center px-4 gap-3">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
            <div className="size-4 bg-background rounded-sm" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight leading-none mt-1">MediDoc</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                {isHospital ? "Hospital" : isLaboratory ? "Laboratory" : isDoctor ? "Doctor" : "Patient"} Dashboard
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            title={collapsed ? "Sign out" : undefined}
          >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#fafafa]">
        {/* Global Header */}
        <header className="h-[72px] border-b border-slate-200 bg-white flex items-center justify-end px-8 shrink-0 z-10">
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden relative text-sm">
                 {isLaboratory ? "AL" : "RV"}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-bold text-slate-900 leading-tight">{isLaboratory ? "Apex Labs" : "Rohan Verma"}</div>
                <div className="text-[12px] text-slate-500">{isHospital ? "Hospital Admin" : isLaboratory ? "Lab Admin" : isDoctor ? "Doctor" : "Patient"}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
