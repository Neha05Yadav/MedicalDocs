"use client";

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "@/components/RechartsWrapper";

export const RevenueTrendAreaChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fontSize: 12, fill: '#64748b' }} 
        dy={10}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fontSize: 12, fill: '#64748b' }}
        tickFormatter={(value) => `₹${value.toLocaleString()}`}
      />
      <RechartsTooltip 
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
      />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#3b82f6" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorRevenue)" 
        activeDot={{ r: 6, fill: "#3b82f6", stroke: "#white", strokeWidth: 2 }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const SubscriptionPieChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={2}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <RechartsTooltip 
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
      />
    </PieChart>
  </ResponsiveContainer>
);
