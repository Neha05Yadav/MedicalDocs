"use client";
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHeaderClient() {
  const pathname = usePathname() || "";
  const path = pathname.toLowerCase();
  
  const isSuperAdmin = path.includes("/management/super-admin");
  const isSales = path.includes("/management/sales");
  const isAccounts = path.includes("/management/accounts");
  const isAdmin = path.includes("/management/admin");
  const isSupport = path.includes("/management/support");
  const isHospital = path.startsWith("/hospital");
  const isClinic = path.startsWith("/clinic");
  const isLaboratory = path.startsWith("/laboratory");

  const getHeaderInfo = () => {
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
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">3</span>
          </button>
        </Link>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden relative text-sm">
             {isSuperAdmin ? "SA" : isAccounts ? "AM" : isSales ? "SM" : isSupport ? "SR" : isAdmin ? "AD" : isHospital ? "CH" : isLaboratory ? "AL" : isClinic ? "CL" : "RV"}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {isSuperAdmin ? "System Super Admin" : isAccounts ? "Accounts Manager" : isSales ? "Sales Manager" : isSupport ? "Support Representative" : isAdmin ? "System Admin" : isHospital ? "City Hospital" : isLaboratory ? "Apex Labs" : isClinic ? "Clinic Admin" : "Rohan Verma"}
            </div>
            {!isHospital && (
              <div className="text-[12px] text-slate-500">
                {isSuperAdmin ? "Super Admin" : isAccounts ? "Accounts" : isSales ? "Sales Admin" : isSupport ? "Support Team" : isAdmin ? "Admin" : isLaboratory ? "Lab Admin" : isClinic ? "Clinic" : "Patient"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
