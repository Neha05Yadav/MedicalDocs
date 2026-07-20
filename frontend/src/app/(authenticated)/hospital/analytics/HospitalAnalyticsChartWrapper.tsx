"use client";

import dynamic from "next/dynamic";

function ChartLoader() {
  return <div className="h-[18rem] w-full animate-pulse rounded-2xl bg-slate-100" aria-label="Loading chart" />;
}

export const MonthlyTrendChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then((m) => m.MonthlyTrendChart), { ssr: false, loading: ChartLoader });
export const DepartmentDistributionChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then((m) => m.DepartmentDistributionChart), { ssr: false, loading: ChartLoader });
export const ReportStatisticsChart = dynamic(() => import("./HospitalAnalyticsChartsClient").then((m) => m.ReportStatisticsChart), { ssr: false, loading: ChartLoader });
