"use client";

import Link from "next/link";
import {
  FileText, Calendar, Clock, Share2, Upload, Plus,
  Pill, Activity, ArrowUpRight, Stethoscope, MapPin, Eye, Users
} from "lucide-react";

const mockPatients = [
  { id: "1", name: "Rahul Sharma", age: 45, condition: "Hypertension", last_visit: "2026-06-05T10:00:00Z" },
  { id: "2", name: "Priya Singh", age: 32, condition: "Migraine", last_visit: "2026-06-08T10:00:00Z" },
  { id: "3", name: "Amit Kumar", age: 58, condition: "Type 2 Diabetes", last_visit: "2026-05-20T10:00:00Z" },
];

const mockAppointments = [
  { id: "1", patient_name: "Neha Gupta", time: "10:30 AM", type: "Follow up" },
  { id: "2", patient_name: "Vikas Verma", time: "11:15 AM", type: "First Visit" },
  { id: "3", patient_name: "Sunil Das", time: "02:00 PM", type: "Consultation" },
];

export default function DoctorDashboard() {
  const patients = mockPatients;
  const appointments = mockAppointments;

  const kpiCards = [
    { label: "Total Patients", value: "1,248", icon: Users, color: "border-[#1e5eff]", bgColor: "bg-blue-50 text-[#1e5eff]" },
    { label: "Pending Reports", value: "5", icon: FileText, color: "border-amber-500", bgColor: "bg-amber-50 text-amber-600" },
    { label: "Prescriptions Issued", value: "342", icon: Pill, color: "border-purple-500", bgColor: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Doctor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome Dr. Verma. Here is your schedule for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#1e5eff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="size-4" />
            New Appointment
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className={`p-6 bg-white border-t-4 border border-slate-200 shadow-sm rounded-xl ${card.color}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className="size-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Today's Schedule</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">3 Left</span>
          </div>
          <div className="p-4 space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{appt.patient_name}</span>
                  <span className="text-xs font-bold text-slate-500">{appt.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{appt.type}</span>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Recent Patients</h2>
            <Link href="/doctor/patients" className="text-sm font-semibold text-[#1e5eff] hover:underline flex items-center gap-1.5">
              View all <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Age/Condition</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/60 shrink-0 text-slate-500 font-bold">
                           {patient.name.charAt(0)}
                        </div>
                        <div className="font-semibold text-slate-900">{patient.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{patient.condition}</div>
                      <div className="text-xs text-slate-500">{patient.age} yrs</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(patient.last_visit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 transition-opacity">
                        <button className="p-1.5 text-[#1e5eff] border border-[#1e5eff]/20 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center justify-center" title="View Records">
                          <FileText className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
