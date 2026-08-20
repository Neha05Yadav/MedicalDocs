"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>;
const Droplet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
const Heart = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const Pill = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const Syringe = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 2 4 4"></path><path d="m17 7 3-3"></path><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"></path><path d="m9 11 4 4"></path><path d="m5 19-3 3"></path><path d="m14 4 6 6"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FileBarChart = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M8 18v-2"></path><path d="M12 18v-4"></path><path d="M16 18v-6"></path></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;
const ActivitySquare = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M17 12h-2l-2 5-2-10-2 5H7"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;

import Link from "next/link";
import UploadReportClient from "./UploadReportClient";

export default function PatientDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const res = await fetch("/api/patient/overview", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        router.push("/auth");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12.9 4.2C12.5 3.4 11.5 3.4 11.1 4.2L2.3 19.8c-.4.8.1 1.8 1 1.8h17.4c.9 0 1.4-1 1-1.8L12.9 4.2z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Could not load dashboard</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-xs">Please make sure the backend server is running and try again.</p>
          <button
            onClick={fetchOverview}
            className="px-5 py-2 bg-[#0891b2] text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { patientInfo, timeline, testResultsStats, recentReports, providerStats } = data;

  const getIcon = (type: string) => {
    if (type === 'APPOINTMENT') return Stethoscope;
    return FileText;
  };

  const getColor = (type: string) => {
    if (type === 'APPOINTMENT') return { color: "text-cyan-500", bg: "bg-cyan-100", border: "border-cyan-200" };
    return { color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-200" };
  };

  return (
    <div className="min-h-screen p-4 font-sans md:p-8 xl:p-10">
      <div className="w-full space-y-7">
        {/* Header */}
        <div className="grid grid-cols-1 items-stretch gap-7 xl:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="grid gap-7 xl:contents">
            {/* 1. Patient Summary Card */}
            <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_16px_45px_-30px_rgba(15,23,42,.28)] xl:col-span-4 xl:row-start-1 2xl:p-8">
              <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-cyan-100/50 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></div>
              <div className="relative z-10 mb-5 flex items-center gap-5">
                <div className="flex size-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-2xl font-bold uppercase text-white shadow-lg shadow-cyan-500/20">
                  {patientInfo.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[clamp(1.4rem,1.35vw,1.8rem)] font-extrabold tracking-tight text-slate-900">{patientInfo.name}</h2>
                  <p className="mt-1 text-[clamp(.95rem,.82vw,1.1rem)] font-medium text-slate-500">{patientInfo.age !== 'N/A' ? `${patientInfo.age} yrs • ` : ''}{patientInfo.gender}</p>
                </div>
              </div>
              {/* Patient ID Badge */}
              {patientInfo.id && (
                <div className="mb-5 relative z-10">
                  <div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-indigo-50 px-3.5 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0"></div>
                    <span className="shrink-0 text-[clamp(.9rem,.76vw,1rem)] font-medium text-slate-500">Patient ID:</span>
                    <span className="flex-1 truncate font-mono text-[clamp(.9rem,.76vw,1rem)] font-bold tracking-wider text-cyan-700" title={patientInfo.id}>{patientInfo.id}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(patientInfo.id); }}
                      title="Copy Patient ID"
                      className="shrink-0 text-slate-400 hover:text-cyan-600 transition-colors p-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>
              )}
              <div className="relative z-10 mb-7 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[clamp(.9rem,.76vw,1rem)] text-slate-500"><Droplet className="size-4 text-red-500"/> Blood Group</p>
                  <p className="text-[clamp(1rem,.9vw,1.2rem)] font-bold text-slate-800">{patientInfo.bloodGroup}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[clamp(.9rem,.76vw,1rem)] text-slate-500"><Calendar className="size-4 text-cyan-500"/> Last Record Updated</p>
                  <p className="text-[clamp(1rem,.9vw,1.2rem)] font-bold text-slate-800">{patientInfo.lastVisit}</p>
                </div>
              </div>
              <div className="relative z-10">
                <p className="mb-3 text-[clamp(.85rem,.72vw,.95rem)] font-bold uppercase tracking-wider text-slate-500">Health Records</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-[clamp(.95rem,.82vw,1.1rem)] font-semibold text-indigo-700">
                    <FileText className="size-4" />
                    {testResultsStats.completed + testResultsStats.pending} Reports Stored
                  </span>
                </div>
              </div>
            </div>
            {/* 5. Medical Timeline */}
            <div className="min-h-[32rem] rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_16px_45px_-30px_rgba(15,23,42,.28)] xl:col-span-4 xl:row-start-2 2xl:p-8">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="text-[clamp(1rem,.95vw,1.25rem)] font-extrabold uppercase tracking-wider text-slate-900">Medical Timeline</h3>
                <Link href="/patient/records" className="text-[clamp(.9rem,.76vw,1rem)] font-semibold text-cyan-600 hover:text-cyan-700">View All</Link>
              </div>
              
              {timeline.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No recent activity</div>
              ) : (
                <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                  {timeline.map((item: any) => {
                    const Icon = getIcon(item.type);
                    const colors = getColor(item.type);
                    return (
                      <div key={item.id} className="relative flex items-start gap-4">
                        <div className={`absolute left-0 w-4 h-4 rounded-full border-2 bg-white ${colors.border} -ml-2 mt-1.5 z-10`}></div>
                        <div className="pl-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                            <h4 className="text-[clamp(1rem,.88vw,1.15rem)] font-bold text-slate-900">{item.title}</h4>
                            <time className="text-[clamp(.8rem,.68vw,.9rem)] font-medium text-slate-500">{item.dateStr}</time>
                          </div>
                          <p className="mb-2 text-[clamp(.9rem,.78vw,1.05rem)] leading-6 text-slate-600">{item.desc}</p>
                          <div className={`inline-flex items-center justify-center p-1.5 rounded-lg ${colors.bg} ${colors.color}`}>
                            <Icon className="size-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* RIGHT COLUMN */}
          <div className="grid gap-7 xl:contents">
            {/* 2. Health Stats Section (Charts) */}
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:contents">
              {/* Healthcare Providers */}
              <div className="relative col-span-1 flex h-full min-h-52 flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_16px_45px_-30px_rgba(15,23,42,.28)] md:col-span-2 xl:col-span-8 xl:row-start-1 2xl:p-8">
                <div className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-cyan-100/60 blur-3xl" />
                <div className="relative flex items-center justify-between">
                  <h3 className="flex items-center gap-2.5 text-[clamp(1.15rem,1.05vw,1.4rem)] font-extrabold text-slate-900">
                    <Building2 className="size-6 text-cyan-600" />
                    Healthcare Providers
                  </h3>
                </div>
                <div className="relative mt-6 grid flex-1 grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm"><Building2 className="size-5" /></span>
                    <div><p className="text-[clamp(.78rem,.68vw,.9rem)] font-semibold text-slate-500">Connected Hospitals</p><p className="mt-0.5 text-[clamp(1.35rem,1.25vw,1.7rem)] font-extrabold text-slate-900">{providerStats?.connectedHospitals ?? 0}</p></div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><Stethoscope className="size-5" /></span>
                    <div><p className="text-[clamp(.78rem,.68vw,.9rem)] font-semibold text-slate-500">Connected Clinics</p><p className="mt-0.5 text-[clamp(1.35rem,1.25vw,1.7rem)] font-extrabold text-slate-900">{providerStats?.connectedClinics ?? 0}</p></div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-violet-700 shadow-sm"><FlaskConical className="size-5" /></span>
                    <div><p className="text-[clamp(.78rem,.68vw,.9rem)] font-semibold text-slate-500">Connected Labs</p><p className="mt-0.5 text-[clamp(1.35rem,1.25vw,1.7rem)] font-extrabold text-slate-900">{providerStats?.connectedLabs ?? 0}</p></div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><ShieldCheck className="size-5" /></span>
                    <div><p className="text-[clamp(.78rem,.68vw,.9rem)] font-semibold text-slate-500">Access Granted</p><p className="mt-0.5 text-[clamp(1.35rem,1.25vw,1.7rem)] font-extrabold text-slate-900">{providerStats?.accessGranted ?? 0}</p></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Middle Row: Test Results & Recent Reports */}
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:contents">
              {/* 4. Test Results Overview */}
              <div className="flex min-h-[29rem] flex-col rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_16px_45px_-30px_rgba(15,23,42,.28)] xl:col-span-4 xl:row-start-2 2xl:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <h3 className="text-[clamp(1.15rem,1.05vw,1.4rem)] font-extrabold text-slate-900">Test Results</h3>
                  <Link href="/patient/records" className="flex items-center text-[clamp(.9rem,.76vw,1rem)] font-semibold text-cyan-600 hover:text-cyan-700">
                    View All <ChevronRight className="size-3 ml-0.5" />
                  </Link>
                </div>
                <div className="mb-7 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-amber-100/50 bg-amber-50 p-5 text-center">
                    <p className="text-[clamp(1.8rem,1.7vw,2.3rem)] font-extrabold text-amber-600">{testResultsStats.pending}</p>
                    <p className="mt-1 text-[clamp(.72rem,.62vw,.82rem)] font-bold uppercase tracking-wider text-amber-700">Pending</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100/50 bg-white p-5 text-center">
                    <p className="text-[clamp(1.8rem,1.7vw,2.3rem)] font-extrabold text-emerald-600">{testResultsStats.completed}</p>
                    <p className="mt-1 text-[clamp(.72rem,.62vw,.82rem)] font-bold uppercase tracking-wider text-emerald-700">Completed</p>
                  </div>
                  <div className="rounded-2xl border border-rose-100/50 bg-rose-50 p-5 text-center">
                    <p className="text-[clamp(1.8rem,1.7vw,2.3rem)] font-extrabold text-rose-600">{testResultsStats.abnormal}</p>
                    <p className="mt-1 text-[clamp(.72rem,.62vw,.82rem)] font-bold uppercase tracking-wider text-rose-700">Abnormal</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-4 text-[clamp(.85rem,.72vw,.95rem)] font-bold uppercase tracking-wider text-slate-500">Recent Highlights</h4>
                  {(!data?.recentHighlights || data.recentHighlights.length === 0) ? (
                    <div className="text-sm text-slate-500 text-center py-4">No recent test results</div>
                  ) : (
                    <ul className="space-y-3">
                      {data.recentHighlights.map((highlight: any, idx: number) => (
                        <li key={idx} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-500/5">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                              <CheckCircle2 className="size-4" />
                            </div>
                            <div>
                              <p className="text-[clamp(1rem,.88vw,1.15rem)] font-semibold text-slate-800 transition-colors group-hover:text-cyan-700">{highlight.name}</p>
                              <p className="text-[clamp(.85rem,.72vw,.95rem)] font-medium text-slate-500">{highlight.status}</p>
                            </div>
                          </div>
                          <span className="text-[clamp(1rem,.88vw,1.15rem)] font-bold text-slate-900">{highlight.value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* 3. Recent Reports */}
              <div className="flex min-h-[29rem] flex-col rounded-3xl border border-slate-200/70 bg-white p-7 shadow-[0_16px_45px_-30px_rgba(15,23,42,.28)] xl:col-span-4 xl:row-start-2 2xl:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <h3 className="text-[clamp(1.15rem,1.05vw,1.4rem)] font-extrabold text-slate-900">Recent Reports</h3>
                  <Link href="/patient/records" className="flex items-center text-[clamp(.9rem,.76vw,1rem)] font-semibold text-cyan-600 hover:text-cyan-700">
                    View All <ChevronRight className="size-3 ml-0.5" />
                  </Link>
                </div>
                <div className="flex-1 space-y-3">
                  {recentReports.length === 0 ? (
                    <div className="text-sm text-slate-500 text-center py-4">No records uploaded yet</div>
                  ) : (
                    recentReports.map((report: any) => (
                      <div key={report.id} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-cyan-200 hover:shadow-md hover:shadow-cyan-500/5">
                        <div className="flex items-center gap-3.5">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                            {report.type === 'LAB_REPORT' ? <FileText className="size-6" /> : <FileBarChart className="size-6" />}
                          </div>
                          <div>
                            <p className="line-clamp-1 text-[clamp(1rem,.88vw,1.15rem)] font-bold text-slate-800 transition-colors group-hover:text-cyan-700">{report.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[clamp(.78rem,.66vw,.88rem)] font-medium text-slate-500">{report.date}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[clamp(.78rem,.66vw,.88rem)] font-medium text-slate-500">{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-colors" title="View">
                            <Eye className="size-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-md transition-colors" title="Download">
                            <Download className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <UploadReportClient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
