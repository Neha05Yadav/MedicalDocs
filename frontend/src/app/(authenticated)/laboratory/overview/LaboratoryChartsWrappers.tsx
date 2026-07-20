"use client";
import React from "react";
import dynamic from "next/dynamic";

const chartLoader = () => <div className="h-full min-h-[180px] w-full animate-pulse rounded-xl bg-slate-100" aria-label="Loading chart" />;

const LazyTestRequestDonut = dynamic(() => import("./LaboratoryChartsClient").then(m => m.TestRequestDonutChart), { ssr: false, loading: chartLoader });
const LazyReportsSummaryDonut = dynamic(() => import("./LaboratoryChartsClient").then(m => m.ReportsSummaryDonutChart), { ssr: false, loading: chartLoader });
const LazyPatientsOverviewLine = dynamic(() => import("./LaboratoryChartsClient").then(m => m.PatientsOverviewLineChart), { ssr: false, loading: chartLoader });

export function TestRequestDonutChartWrapper({ data }: { data: any[] }) {
  return <LazyTestRequestDonut data={data} />;
}

export function ReportsSummaryDonutChartWrapper({ data }: { data: any[] }) {
  return <LazyReportsSummaryDonut data={data} />;
}

export function PatientsOverviewLineChartWrapper({ data }: { data: any[] }) {
  return <LazyPatientsOverviewLine data={data} />;
}

export function StaticSparkline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <polyline points="0,35 20,15 40,25 60,10 80,20 100,5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}
