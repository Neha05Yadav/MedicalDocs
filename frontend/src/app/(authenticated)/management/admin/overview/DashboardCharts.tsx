"use client";

import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from '@/components/RechartsWrapper';

export const UserDistributionPie = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
    </PieChart>
  </ResponsiveContainer>
);

export const SystemActivityBar = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 4 }} barGap={5} barCategoryGap="32%">
      <defs>
        <linearGradient id="reportsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
        <linearGradient id="testsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="4 5" vertical={false} stroke="#e2e8f0" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} dy={9} />
      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} width={38} />
      <RechartsTooltip cursor={{ fill: '#f1f5f9', opacity: 0.7 }} labelFormatter={(label: any, payload: readonly any[]) => payload?.[0]?.payload?.date || label} formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]} contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 12px 30px -12px rgb(15 23 42 / 0.28)', fontSize: '12px' }} />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '18px', fontSize: '12px', fontWeight: 700 }} />
      <Bar dataKey="reports" name="Reports Uploaded" fill="url(#reportsGradient)" radius={[7, 7, 2, 2]} maxBarSize={30} />
      <Bar dataKey="tests" name="Tests Requested" fill="url(#testsGradient)" radius={[7, 7, 2, 2]} maxBarSize={30} />
    </BarChart>
  </ResponsiveContainer>
);
