"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { title: "Verification Requests", path: "/support/verification", exact: true },
    { title: "Pending Issues", path: "/support/verification/pending", exact: false },
    { title: "Rejected Cases", path: "/support/verification/rejected", exact: false },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">User Verification</h1>
      
      <Card className="border-none shadow-sm bg-transparent">
        <div className="mb-6 flex flex-wrap gap-2 h-auto p-1 bg-white border shadow-sm rounded-lg w-fit">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.path
              : pathname.startsWith(tab.path);

            return (
              <Link 
                key={tab.path} 
                href={tab.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-slate-100 text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.title}
              </Link>
            );
          })}
        </div>
        
        {/* Render the specific tab content */}
        {children}
      </Card>
    </div>
  );
}
