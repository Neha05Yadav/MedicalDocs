"use client";

import React, { useState, useMemo } from 'react';
import { DelayedRender } from '@/components/DelayedRender';

type TimePeriod = "This Week" | "Last Week" | "This Month";

export default function SystemActivityClient({ activityDataByPeriod }: { activityDataByPeriod: any }) {
  const [activityPeriod, setActivityPeriod] = useState<TimePeriod>("This Week");
  const currentActivityData = useMemo(() => activityDataByPeriod[activityPeriod], [activityDataByPeriod, activityPeriod]);
  const [Chart, setChart] = useState<any>(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-slate-900 text-lg">System Activity</h3>
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
      <div className="h-80 w-full">
        <DelayedRender onShow={() => {
          if (!Chart) {
            import('./DashboardCharts').then(mod => setChart(() => mod.SystemActivityBar));
          }
        }}>
          {Chart ? <Chart data={currentActivityData} /> : null}
        </DelayedRender>
      </div>
    </div>
  );
}
