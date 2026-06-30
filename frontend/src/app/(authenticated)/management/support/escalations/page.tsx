import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EscalationTableClient from "./EscalationTableClient";

export default function EscalationManagement() {
  const teams = [
    {
      id: "accounts",
      name: "Accounts Team",
      desc: "Refunds, double deductions, gateway failures",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500",
    },
    {
      id: "admin",
      name: "Admin Team",
      desc: "KYC failures, invalid licenses, background checks",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-500",
    },
    {
      id: "dev",
      name: "Development Team",
      desc: "App crashes, 500 errors, broken uploads",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
    }
  ];

  const escalations = [
    {
      id: "ESC-501",
      ticketId: "TK-4022",
      issue: "Double deduction during subscription renewal",
      issueCategory: "Payment Issue",
      assignedTeam: "Accounts Team",
      teamBg: "bg-purple-50 text-purple-600 border border-purple-100",
      status: "Investigating",
      statusColor: "bg-purple-100 text-purple-700",
      time: "2 hours ago",
      user: "City Hospital",
      priority: "High",
      internalNotes: "User claims their card was charged twice. We need to check Stripe logs and process a refund if true.",
      updates: [
        { time: "10:00 AM", text: "Ticket escalated to Accounts by Support L1." },
        { time: "10:15 AM", text: "Accounts team started investigation." }
      ]
    },
    {
      id: "ESC-502",
      ticketId: "TK-4024",
      issue: "App crashes when uploading PDF lab report",
      issueCategory: "Technical Bug",
      assignedTeam: "Development Team",
      teamBg: "bg-blue-50 text-blue-600 border border-blue-100",
      status: "Fix in Progress",
      statusColor: "bg-blue-100 text-blue-700",
      time: "4 hours ago",
      user: "Apex Labs",
      priority: "Critical",
      internalNotes: "Crash occurs only on iOS app version 2.4.1. The Dev team has reproduced the issue and is working on a hotfix.",
      updates: [
        { time: "08:30 AM", text: "Bug reported by Apex Labs." },
        { time: "09:00 AM", text: "Escalated to Dev Team. Issue reproduced." }
      ]
    },
    {
      id: "ESC-503",
      ticketId: "VR-8904",
      issue: "Medical council ID requires manual cross-check",
      issueCategory: "Verification Issue",
      assignedTeam: "Admin Team",
      teamBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      status: "Under Review",
      statusColor: "bg-amber-100 text-amber-700",
      time: "1 day ago",
      user: "Dr. Ramesh Kumar",
      priority: "Medium",
      internalNotes: "The state medical council website is down. Waiting for it to come back online to verify Dr. Ramesh's ID.",
      updates: [
        { time: "Yesterday, 2 PM", text: "Verification marked pending due to portal downtime." }
      ]
    },
    {
      id: "ESC-504",
      ticketId: "TK-4015",
      issue: "Payment gateway timeout but amount deducted",
      issueCategory: "Payment Issue",
      assignedTeam: "Accounts Team",
      teamBg: "bg-purple-50 text-purple-600 border border-purple-100",
      status: "Resolved",
      statusColor: "bg-slate-100 text-slate-700",
      time: "2 days ago",
      user: "Rohan Verma",
      priority: "High",
      internalNotes: "Confirmed with Razorpay that the transaction was successful but webhook failed. Manually credited subscription to the user account.",
      updates: [
        { time: "Monday, 10 AM", text: "Payment failure reported." },
        { time: "Monday, 4 PM", text: "Manually resolved and subscription activated." }
      ]
    }
  ];

  const escalationRules = [
    { title: "Payment Issues", target: "Accounts Team", desc: "Refunds, double deductions, gateway failures", borderColor: "border-purple-200" },
    { title: "Verification Issues", target: "Admin Team", desc: "KYC failures, invalid licenses, background checks", borderColor: "border-emerald-200" },
    { title: "Technical Bugs", target: "Development Team", desc: "App crashes, 500 errors, broken uploads", borderColor: "border-blue-200" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {escalationRules.map((rule, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 border ${rule.borderColor} shadow-sm flex flex-col justify-center`}>
            <p className="text-sm font-medium text-slate-600 mb-2">{rule.title}</p>
            <h2 className="text-xl font-bold text-slate-900 mb-1.5">{rule.target}</h2>
            <p className="text-xs text-slate-500">{rule.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Main Table Card */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-white px-6 py-5 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">Active Escalations</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EscalationTableClient escalations={escalations} teams={teams} />
        </CardContent>
      </Card>
    </div>
  );
}
