"use client";

import React, { useState } from 'react';
import { DelayedRender } from '@/components/DelayedRender';

export default function RevenueTrendChartClient({ data }: { data: any[] }) {
  const [Chart, setChart] = useState<any>(null);

  return (
    <div className="h-[300px] w-full">
      <DelayedRender onShow={() => {
        if (!Chart) {
          import('./SalesDashboardCharts').then(mod => setChart(() => mod.RevenueTrendAreaChart));
        }
      }}>
        {Chart ? <Chart data={data} /> : null}
      </DelayedRender>
    </div>
  );
}
