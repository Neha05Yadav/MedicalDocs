import { createFileRoute, Outlet, redirect, Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, Calendar, Pill, Users, Bell, Settings,
  Hospital, Stethoscope, ClipboardList, BarChart3, ChevronLeft, LogOut
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: AuthLayout,
});

const patientNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Health Records", url: "/records", icon: FileText },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Prescriptions", url: "/prescriptions", icon: Pill },
  { title: "Family Members", url: "/family", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: Settings },
];

const hospitalNav = [
  { title: "Dashboard", url: "/hospital/dashboard", icon: LayoutDashboard },
  { title: "Doctors", url: "/hospital/doctors", icon: Stethoscope },
  { title: "Patients", url: "/hospital/patients", icon: Users },
  { title: "Appointments", url: "/hospital/appointments", icon: Calendar },
  { title: "Reports", url: "/hospital/reports", icon: ClipboardList },
  { title: "Departments", url: "/hospital/departments", icon: Hospital },
  { title: "Analytics", url: "/hospital/analytics", icon: BarChart3 },
];

function AuthLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isHospital = currentPath.startsWith("/hospital");
  const nav = isHospital ? hospitalNav : patientNav;

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-background flex">
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
          {!collapsed && <span className="font-semibold tracking-tight">MediDoc</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = currentPath === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
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
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft className={`size-4 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
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
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
