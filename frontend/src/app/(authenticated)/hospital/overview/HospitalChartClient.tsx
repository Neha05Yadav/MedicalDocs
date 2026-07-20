"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "@/components/RechartsWrapper";

export default function HospitalChartClient({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.6} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }} 
          dx={-10}
        />
        <Tooltip
          contentStyle={{ 
            background: "rgba(255, 255, 255, 0.9)", 
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(8, 145, 178, 0.2)", 
            borderRadius: "16px", 
            fontSize: "13px",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
            padding: "16px 20px",
            fontWeight: 600,
            color: "#0f172a"
          }}
          itemStyle={{ color: "#0891b2", fontWeight: 700 }}
          cursor={{ stroke: 'rgba(8, 145, 178, 0.3)', strokeWidth: 2, strokeDasharray: '4 4' }}
        />
        <Area 
          type="natural" 
          dataKey="reports" 
          stroke="#0891b2" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorReports)" 
          activeDot={{ r: 7, fill: "#0891b2", stroke: "#ffffff", strokeWidth: 3, style: { filter: "drop-shadow(0px 8px 12px rgba(8, 145, 178, 0.5))" } }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
