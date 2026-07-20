"use client";
import React from "react";
import dynamic from "next/dynamic";

const HospitalChartClient = dynamic(() => import("./HospitalChartClient"), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full animate-pulse rounded-xl bg-slate-100" aria-label="Loading chart" />,
});

export default function HospitalOverviewChartWrapper({ data }: { data: any[] }) {
  return <HospitalChartClient data={data} />;
}
