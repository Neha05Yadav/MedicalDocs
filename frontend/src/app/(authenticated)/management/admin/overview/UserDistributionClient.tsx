"use client";

import React, { useState, useEffect } from 'react';
import { DelayedRender } from '@/components/DelayedRender';

export default function UserDistributionClient({ data }: { data: any[] }) {
  const [Chart, setChart] = useState<any>(null);

  return (
    <div className="h-64 relative">
      <DelayedRender onShow={() => {
        if (!Chart) {
          import('./DashboardCharts').then(mod => setChart(() => mod.UserDistributionPie));
        }
      }}>
        {Chart ? <Chart data={data} /> : null}
      </DelayedRender>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-extrabold text-slate-900">100%</span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
      </div>
    </div>
  );
}
