"use client";

import React, { useState, useMemo } from 'react';
import { DelayedRender } from '@/components/DelayedRender';

type TimePeriod = "This Week" | "Last Week" | "This Month";

export default function SystemActivityClient({ activityDataByPeriod }: { activityDataByPeriod: any }) {
  const [activityPeriod, setActivityPeriod] = useState<TimePeriod>("This Month");
  const currentActivityData = useMemo(() => Array.isArray(activityDataByPeriod?.[activityPeriod]) ? activityDataByPeriod[activityPeriod] : [], [activityDataByPeriod, activityPeriod]);
  const totals = useMemo(() => currentActivityData.reduce((summary: { reports: number; tests: number }, item: any) => ({
    reports: summary.reports + Number(item.reports || 0),
    tests: summary.tests + Number(item.tests || 0),
  }), { reports: 0, tests: 0 }), [currentActivityData]);
  const hasActivity = totals.reports + totals.tests > 0;
  const [Chart, setChart] = useState<any>(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">System Activity</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Live reports and laboratory requests from the database</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
          {(["This Week", "Last Week", "This Month"] as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setActivityPeriod(period)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activityPeriod === period ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2"><span className="text-xs font-bold text-blue-600">Reports uploaded</span><strong className="ml-3 text-lg text-slate-900">{totals.reports.toLocaleString()}</strong></div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2"><span className="text-xs font-bold text-violet-600">Tests requested</span><strong className="ml-3 text-lg text-slate-900">{totals.tests.toLocaleString()}</strong></div>
      </div>
      <div className="h-72 w-full">
        {!hasActivity ? (
          <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center">
            <div><span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-xl shadow-sm">↗</span><p className="mt-3 text-sm font-bold text-slate-700">No activity recorded for {activityPeriod.toLowerCase()}</p><p className="mt-1 text-xs text-slate-500">Select another period to review existing database activity.</p></div>
          </div>
        ) : (
        <DelayedRender onShow={() => {
          if (!Chart) {
            import('./DashboardCharts').then(mod => setChart(() => mod.SystemActivityBar));
          }
        }}>
          {Chart ? <Chart data={currentActivityData} /> : null}
        </DelayedRender>
        )}
      </div>
    </div>
  );
}
