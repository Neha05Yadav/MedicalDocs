"use client";






const BarChart3 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 7v4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M14 9h-4"></path><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"></path><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path></svg>;

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const UserGrowthChart = dynamic(() => import('./AnalyticsCharts').then(mod => mod.UserGrowthChart), { 
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading chart...</div> 
});
const FacilityGrowthChart = dynamic(() => import('./AnalyticsCharts').then(mod => mod.FacilityGrowthChart), { 
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading chart...</div> 
});
const RequestedTestsChart = dynamic(() => import('./AnalyticsCharts').then(mod => mod.RequestedTestsChart), { 
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading chart...</div> 
});
const ReportStatsChart = dynamic(() => import('./AnalyticsCharts').then(mod => mod.ReportStatsChart), { 
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Loading chart...</div> 
});
const initialGrowthData: Array<Record<string, string | number>> = [];
const initialRequestedTestsData: Array<Record<string, string | number>> = [];
const initialReportStatsData: Array<Record<string, string | number>> = [];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    growthData: initialGrowthData,
    requestedTestsData: initialRequestedTestsData,
    reportStatsData: initialReportStatsData
  });

  useEffect(() => {
    fetch('/api/management/admin/analytics')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
      <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Patient & Doctor Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="size-5 text-blue-600" />
              User Growth
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live database</span>
          </div>
          <div className="h-72 w-full">
            <UserGrowthChart data={data.growthData} />
          </div>
        </div>
        {/* Facility Growth */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Hospital className="size-5 text-purple-600" />
              Facility Registration Growth
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live database</span>
          </div>
          <div className="h-72 w-full">
            <FacilityGrowthChart data={data.growthData} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Requested Tests */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="size-5 text-amber-600" />
              Most Requested Tests
            </h3>
          </div>
          <div className="h-72 w-full">
            {data.requestedTestsData.length > 0 ? (
              <RequestedTestsChart data={data.requestedTestsData} />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-400">No test data available</div>
            )}
          </div>
        </div>
        {/* Reports Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="size-5 text-rose-600" />
              Reports Processing Stats
            </h3>
          </div>
          <div className="h-72 w-full">
            <ReportStatsChart data={data.reportStatsData} />
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
