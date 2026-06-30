"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const HospitalChartClient = dynamic(() => import("./HospitalChartClient"), { ssr: false });

export default function HospitalOverviewChartWrapper({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  
  if (!load) {
    return (
      <div 
        className="w-full h-full min-h-[250px] relative group cursor-pointer"
        onMouseEnter={() => setLoad(true)}
        onTouchStart={() => setLoad(true)}
        onClick={() => setLoad(true)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 bg-muted/20 rounded-xl border border-dashed border-muted/50 group-hover:bg-muted/30 transition-colors">
          <svg className="size-8 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span className="text-xs font-medium">Hover or tap to load interactive chart</span>
        </div>
      </div>
    );
  }
  
  return <HospitalChartClient data={data} />;
}
