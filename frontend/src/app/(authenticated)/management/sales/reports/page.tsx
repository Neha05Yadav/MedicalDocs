"use client";
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const FileSpreadsheet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M8 13h2"></path><path d="M14 13h2"></path><path d="M8 17h2"></path><path d="M14 17h2"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;











import React, { useState } from 'react';
export default function ReportsPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);
  const [dateRanges, setDateRanges] = useState<Record<number, string>>({});
  
  const handleDownload = (reportTitle: string, format: 'pdf' | 'csv') => {
    // Open the download endpoint in a new tab/window
    window.open(`/api/management/sales/reports/download?format=${format}&report=${encodeURIComponent(reportTitle)}`, '_blank');
  };

  const reports = [
    { title: "Sales Report", desc: "Detailed breakdown of all sales, plans, and revenue generated.", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Subscription Report", desc: "Data on active, expired, and overall subscription metrics.", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Payment Report", desc: "Comprehensive statement of successful, pending, and failed payments.", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Renewal Report", desc: "Upcoming and past renewals, retention rates, and churn.", icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50" },
  ];
  const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"];
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      {/* Header removed to avoid redundancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col relative">
            <div className="flex gap-4 items-start mb-6">
              <div className={`p-3 ${report.bg} rounded-xl shrink-0`}>
                <report.icon className={`size-6 ${report.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{report.desc}</p>
              </div>
            </div>
            <div className="mt-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 relative">
                {/* Date Range Filter */}
                <button 
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                  className="flex-1 flex items-center justify-between px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-slate-400" />
                    <span>{dateRanges[idx] || "Select Date Range"}</span>
                  </div>
                  <ChevronDown className={`size-4 text-slate-400 transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                </button>
                {/* Dropdown Menu */}
                {openDropdown === idx && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDateRanges({ ...dateRanges, [idx]: option });
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-slate-50 last:border-0"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Export PDF */}
                <button 
                  onClick={() => handleDownload(report.title, 'pdf')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  <Download className="size-4 text-rose-500" />
                  Export PDF
                </button>
                {/* Export Excel */}
                <button 
                  onClick={() => handleDownload(report.title, 'csv')}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors"
                >
                  <FileSpreadsheet className="size-4 text-emerald-500" />
                  Export Excel
                </button>
                {/* View Report */}
                <button 
                  onClick={() => setViewingReport(report.title)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 transition-colors"
                >
                  <Eye className="size-4" />
                  View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for View Report */}
      {viewingReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{viewingReport} Preview</h2>
                <p className="text-sm text-slate-500 mt-1">This is a preview of the generated report.</p>
              </div>
              <button 
                onClick={() => setViewingReport(null)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto bg-slate-50/50 flex flex-col items-center justify-center min-h-[500px]">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center w-full max-w-lg text-center">
                <FileSpreadsheet className="size-16 text-indigo-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Report Ready to View</h3>
                <p className="text-sm text-slate-500 mt-2 mb-6">
                  In a fully functional setup, the {viewingReport} data tables, charts, and metrics will be rendered here.
                </p>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Loading Data...</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setViewingReport(null)}
                className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close Preview
              </button>
              <button 
                onClick={() => viewingReport && handleDownload(viewingReport, 'pdf')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <Download className="size-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
