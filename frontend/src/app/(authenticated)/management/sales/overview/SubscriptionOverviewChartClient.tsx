"use client";

import React, { useState } from 'react';
import { DelayedRender } from '@/components/DelayedRender';

export default function SubscriptionOverviewChartClient({ data }: { data: any[] }) {
  const [Chart, setChart] = useState<any>(null);

  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="h-[200px] relative">
        <DelayedRender onShow={() => {
          if (!Chart) {
            import('./SalesDashboardCharts').then(mod => setChart(() => mod.SubscriptionPieChart));
          }
        }}>
          {Chart ? <Chart data={data} /> : null}
        </DelayedRender>
        {/* Center text for donut */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-transparent">Center</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {data.map((item, idx) => {
          const total = data.reduce((acc, curr) => acc + curr.value, 0);
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{item.value}</span>
                <span className="text-slate-400 w-12 text-right">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="font-bold text-slate-900">Total</span>
        <span className="text-xl font-bold text-slate-900">
          {data.reduce((acc, curr) => acc + curr.value, 0)}
        </span>
      </div>
    </div>
  );
}
