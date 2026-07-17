"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";

const tabs = ["All Tickets", "Open", "In Progress", "Resolved", "Closed"];

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="mb-4 flex flex-wrap gap-2 h-auto p-1 bg-slate-100/50 rounded-lg max-w-fit">
            {tabs.map(tab => {
              // Convert tab name to URL format
              const tabSlug = tab === "All Tickets" 
                ? "" 
                : "/" + tab.toLowerCase().replace(" ", "-");
              
              const href = `/management/support/tickets${tabSlug}`;
              const isActive = pathname === href || pathname === `${href}/`;

              return (
                <Link
                  key={tab}
                  href={href}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    isActive 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  {tab}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-0">
            {children}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
