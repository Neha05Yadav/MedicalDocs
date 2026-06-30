import DashboardSidebar from "./DashboardSidebar";
import DashboardHeaderClient from "./DashboardHeaderClient";

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-background flex w-full">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-gradient-to-r from-emerald-50 to-blue-50">
        <DashboardHeaderClient />

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
