"use client";








const ArrowLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>;
const Wallet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>;
const BriefcaseMedical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 11v4"></path><path d="M14 13h-4"></path><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><path d="M18 6v14"></path><path d="M6 6v14"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>;
const Code = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const FileImage = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><circle cx="10" cy="12" r="2"></circle><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"></path></svg>;
const Send = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>;
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
export default function NewEscalationPage() {
  const [selectedTeam, setSelectedTeam] = useState("accounts");
  const [notes, setNotes] = useState("Customer has been charged twice for the same subscription renewal. Payment ID: pay_123456789. Requesting refund and root cause check.");
  const [attachment, setAttachment] = useState<string | null>("Payment_Screenshot.jpg");
  const teams = [
    {
      id: "accounts",
      name: "Accounts Team",
      desc: "Refunds, double deductions, gateway failures",
      icon: <Wallet className={`w-6 h-6 ${selectedTeam === "accounts" ? "text-purple-600" : "text-purple-400"}`} />,
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500",
      ringColor: "ring-purple-500"
    },
    {
      id: "admin",
      name: "Admin Team",
      desc: "KYC failures, invalid licenses, background checks",
      icon: <BriefcaseMedical className={`w-6 h-6 ${selectedTeam === "admin" ? "text-emerald-600" : "text-emerald-400"}`} />,
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-500",
      ringColor: "ring-emerald-500"
    },
    {
      id: "dev",
      name: "Development Team",
      desc: "App crashes, 500 errors, broken uploads",
      icon: <Code className={`w-6 h-6 ${selectedTeam === "dev" ? "text-blue-600" : "text-blue-400"}`} />,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      ringColor: "ring-blue-500"
    }
  ];
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/management/support/escalations" className="text-blue-600 font-medium hover:underline">Escalations</Link>
        <span className="text-slate-400 mx-2">{">"}</span>
        <span className="text-slate-600">Escalate New Issue</span>
      </div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Escalate Issue</h1>
          <p className="text-slate-500 text-sm">Escalate this issue to the appropriate team for further investigation.</p>
        </div>
        <Link href="/management/support/tickets" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Ticket
        </Link>
      </div>
      {/* Issue Summary */}
      <Card className="mb-6 border border-slate-200 shadow-sm bg-slate-50/50">
        <CardContent className="p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Issue Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs text-slate-500 mb-1">Ticket ID</p>
              <p className="font-semibold text-slate-900">TK-4022</p>
            </div>
            <div className="col-span-1 md:col-span-1">
              <p className="text-xs text-slate-500 mb-1">Issue Title</p>
              <p className="font-semibold text-slate-900">Double deduction during subscription renewal</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Priority</p>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-2 py-0.5">High</Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Customer</p>
              <p className="font-semibold text-slate-900">City Care Hospital</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="font-semibold text-slate-900">Payment Issue</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Created</p>
              <p className="font-semibold text-slate-900">15 May 2026, 10:30 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Escalate Form */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardContent className="p-6 lg:p-8 space-y-8">
          <h2 className="text-lg font-bold text-slate-900">Escalate To</h2>
          {/* Team Selection */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-3">Select Team <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teams.map((team) => {
                const isSelected = selectedTeam === team.id;
                return (
                  <div 
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? `${team.borderColor} bg-slate-50/50` : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Radio indicator */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? team.borderColor : 'border-slate-300'
                      }`}>
                        {isSelected && <div className={`w-2.5 h-2.5 rounded-full bg-purple-600`} />}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${team.bgColor} flex items-center justify-center mb-4`}>
                      {team.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{team.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{team.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Reason for Escalation <span className="text-red-500">*</span></label>
              <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option>Double deduction / Refund issue</option>
                <option>Payment Gateway Timeout</option>
                <option>Invoice discrepancy</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-2">Priority <span className="text-red-500">*</span></label>
              <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Escalation Notes <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea 
                className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[120px] resize-none text-slate-700"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                {notes.length} / 500
              </div>
            </div>
          </div>
          {/* Attachments */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Attachments (Optional)</label>
            <input 
              type="file" 
              id="escalation-attachment-new" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAttachment(e.target.files[0].name);
                }
              }} 
            />
            <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              <label htmlFor="escalation-attachment-new" className="flex items-center gap-3 cursor-pointer group">
                <UploadCloud className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium"><span className="text-purple-600 group-hover:underline">Click to upload</span> <span className="text-slate-500">or drag and drop</span></p>
                  <p className="text-xs text-slate-400">PDF, PNG, JPG (Max 10MB)</p>
                </div>
              </label>
              {attachment && (
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 pr-4 shadow-sm w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                    <FileImage className="w-4 h-4" />
                  </div>
                  <div className="flex-1 mr-4">
                    <p className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">{attachment}</p>
                    <p className="text-[10px] text-slate-500">Uploaded</p>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <Link href="/management/support/escalations">
              <button className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </Link>
            <button 
              onClick={() => {
                const selTeamObj = teams.find(t => t.id === selectedTeam);
                toast.success(`Issue escalated successfully to ${selTeamObj?.name}!`);
                setAttachment(null);
                setNotes("");
                setTimeout(() => {
                  window.location.href = "/management/support/escalations";
                }, 1000);
              }}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> Escalate Issue
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
