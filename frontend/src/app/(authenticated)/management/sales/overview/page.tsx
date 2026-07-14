"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import RevenueTrendChartClient from "./RevenueTrendChartClient";
import SubscriptionOverviewChartClient from "./SubscriptionOverviewChartClient";

const IndianRupee = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>;
const Bookmark = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"></path></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const Hourglass = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const UserRound = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const ArrowUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>;
const ArrowDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>;

export default function SalesOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/management/sales/overview')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sales overview", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Map icons to the dynamic KPI data
  const icons = [IndianRupee, Bookmark, RefreshCw, Hourglass, Users];
  const bgColors = ["bg-indigo-600", "bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-amber-500"];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-screen bg-slate-50/50 font-sans">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        {data.kpiData.map((stat: any, idx: number) => {
          const IconComponent = icons[idx % icons.length];
          const bgColor = bgColors[idx % bgColors.length];
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 ${bgColor}`}>
                <IconComponent className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-xs font-bold flex items-center ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.isPositive ? <ArrowUp className="size-3 mr-0.5" /> : <ArrowDown className="size-3 mr-0.5" />}
                    {stat.change.replace(/[+-]/, '')}
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Trend</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              Monthly
              <ChevronDown className="size-4 text-slate-500" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <RevenueTrendChartClient data={data.revenueData} />
          </div>
        </div>
        {/* Subscription Overview Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Subscription Overview</h3>
          <SubscriptionOverviewChartClient data={data.subscriptionData} />
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Payments</h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-semibold">Invoice ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 rounded-r-lg font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((payment: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-medium text-slate-700">{payment.id}</td>
                    <td className="px-4 py-4 text-slate-600">{payment.customer}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{payment.amount}</td>
                    <td className="px-4 py-4 text-slate-500">{payment.date}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md
                        ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : ''}
                        ${payment.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' : ''}
                        ${payment.status === 'Failed' ? 'bg-rose-50 text-rose-600 border border-rose-200' : ''}
                      `}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/management/sales/payments" className="mt-4 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors block text-center">
            View All Payments
          </Link>
        </div>
        
        {/* Recent Subscription Activity List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Subscription Activity</h3>
          <div className="space-y-6 flex-1">
            {data.recentActivity.map((activity: any, idx: number) => {
              const IconComp = activity.type === 'hospital' ? Building2 : activity.type === 'lab' ? FlaskConical : UserRound;
              const colorClass = activity.type === 'hospital' ? 'text-emerald-600' : activity.type === 'lab' ? 'text-orange-600' : 'text-blue-600';
              const bgClass = activity.type === 'hospital' ? 'bg-emerald-50' : activity.type === 'lab' ? 'bg-orange-50' : 'bg-blue-50';
              
              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
                    <IconComp className={`size-5 ${colorClass}`} />
                  </div>
                  <div className="flex-1 mt-0.5">
                    <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                  </div>
                  <div className="shrink-0 text-right mt-0.5">
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/management/sales/subscriptions" className="mt-6 pt-4 border-t border-slate-100 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors block text-center">
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
}
