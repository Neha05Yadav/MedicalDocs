"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const LazyMonthlyTrendChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then(m => m.MonthlyTrendChart), { ssr: false });
const LazyDepartmentDistributionChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then(m => m.DepartmentDistributionChart), { ssr: false });
const LazyReportStatisticsChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then(m => m.ReportStatisticsChart), { ssr: false });

function ChartPlaceholder({ height }: { height: string }) {
  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center text-muted-foreground/60 bg-muted/20 rounded-xl border border-dashed border-muted/50 group-hover:bg-muted/30 transition-colors`}>
      <svg className="size-8 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
      <span className="text-xs font-medium">Hover or tap to load chart</span>
    </div>
  );
}

export function MonthlyTrendChart({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="w-full h-[280px] relative group cursor-pointer" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder height="h-[280px]" />
      </div>
    );
  }
  return <LazyMonthlyTrendChart data={data} />;
}

export function DepartmentDistributionChart({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="w-full h-[280px] relative group cursor-pointer" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder height="h-[280px]" />
      </div>
    );
  }
  return <LazyDepartmentDistributionChart data={data} />;
}

export function ReportStatisticsChart({ data }: { data: any[] }) {
  const [load, setLoad] = useState(false);
  if (!load) {
    return (
      <div className="w-full h-[240px] relative group cursor-pointer" onMouseEnter={() => setLoad(true)} onTouchStart={() => setLoad(true)} onClick={() => setLoad(true)}>
        <ChartPlaceholder height="h-[240px]" />
      </div>
    );
  }
  return <LazyReportStatisticsChart data={data} />;
}
