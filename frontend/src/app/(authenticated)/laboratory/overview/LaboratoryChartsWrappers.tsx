"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const LazyTestRequestDonut = dynamic(() => import("./LaboratoryChartsClient").then(m => m.TestRequestDonutChart), { ssr: false });
const LazyReportsSummaryDonut = dynamic(() => import("./LaboratoryChartsClient").then(m => m.ReportsSummaryDonutChart), { ssr: false });
const LazyPatientsOverviewLine = dynamic(() => import("./LaboratoryChartsClient").then(m => m.PatientsOverviewLineChart), { ssr: false });

function ChartPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 bg-muted/20 rounded-xl border border-dashed border-muted/50 group-hover:bg-muted/30 transition-colors">
      <svg className="size-6 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
      <span className="text-xs font-medium text-center px-4">Hover or tap to load interactive chart</span>
    </div>
  );
}

export function TestRequestDonutChartWrapper({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="absolute inset-0 z-10 cursor-pointer group" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder />
      </div>
    );
  }
  return <LazyTestRequestDonut data={data} />;
}

export function ReportsSummaryDonutChartWrapper({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="absolute inset-0 z-10 cursor-pointer group" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder />
      </div>
    );
  }
  return <LazyReportsSummaryDonut data={data} />;
}

export function PatientsOverviewLineChartWrapper({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="absolute inset-0 z-10 cursor-pointer group" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder />
      </div>
    );
  }
  return <LazyPatientsOverviewLine data={data} />;
}

export function StaticSparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <polyline points="0,35 20,15 40,25 60,10 80,20 100,5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}
