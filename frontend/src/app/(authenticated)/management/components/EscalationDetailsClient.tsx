"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft,
  User,
  AlertTriangle,
  Clock,
  MessageSquare,
  UploadCloud,
  CheckCircle,
  FileText,
  DollarSign,
  RefreshCw,
  Send
} from "lucide-react";

export default function EscalationDetailsClient({ role, id }: { role: "admin" | "accounts", id: string }) {
  const [internalNote, setInternalNote] = useState("");
  const [status, setStatus] = useState("In Progress");

  const handleUpdateStatus = (newStatus: string) => {
    setStatus(newStatus);
    toast.success(`Case marked as ${newStatus}`);
  };

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    toast.success("Internal note added to case timeline");
    setInternalNote("");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <Link href={`/management/${role}/assigned-escalations`} className="text-blue-600 font-medium hover:underline">
          Assigned Escalations
        </Link>
        <span className="text-slate-400 mx-2">{">"}</span>
        <span className="text-slate-600">Case {id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{id}</h1>
            <Badge variant={status === 'Pending' ? 'destructive' : status === 'In Progress' ? 'default' : 'secondary'} className={status === 'In Progress' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none' : status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none' : ''}>
              {status}
            </Badge>
          </div>
          <p className="text-slate-500 font-medium">Ref Ticket: TK-4089 • Priority: <span className="text-red-600 font-semibold">High</span></p>
        </div>
        <div className="flex gap-3">
          {status !== "Resolved" && (
            <button 
              onClick={() => handleUpdateStatus("Resolved")}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Resolved
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Issue Details */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Escalation Issue
            </h2>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 text-slate-800 leading-relaxed mb-4">
              <p className="font-semibold mb-2">Reason: Double deduction / Refund issue</p>
              <p className="text-sm">Customer has been charged twice for the same subscription renewal. Payment ID: pay_123456789. Requesting refund and root cause check. Please process the refund immediately as the hospital administrator is frustrated.</p>
            </div>
            
            {role === "accounts" && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => toast.success("Payment verified in gateway records.")}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <DollarSign className="w-4 h-4" /> Verify Payment
                </button>
                <button 
                  onClick={() => toast.success("Refund processed successfully via Stripe.")}
                  className="flex items-center gap-2 px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 font-semibold text-sm rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Process Refund
                </button>
                <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <UploadCloud className="w-4 h-4" /> Upload Proof
                  <input type="file" className="hidden" onChange={() => toast.success("Proof uploaded!")} />
                </label>
              </div>
            )}
          </section>

          {/* Internal Comments & Activity Log */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Internal Notes & Activity
            </h2>
            
            <div className="space-y-6 mb-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Assigned by Support L1</div>
                  <div className="text-xs text-slate-500 mb-1">Today, 10:30 AM</div>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">Ticket escalated due to failed payment verification on our end. Sent to Accounts for deep check.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Add Internal Note</h3>
              <textarea 
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[100px] resize-none mb-3"
                placeholder="Type your findings or actions taken here. This is only visible internally..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-brand">
                  <UploadCloud className="w-4 h-4" /> Attach Document
                  <input type="file" className="hidden" onChange={() => toast.success("Document attached to note.")} />
                </label>
                <button 
                  onClick={handleAddNote}
                  className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Send className="w-4 h-4" /> Add Note
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> User Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-500 text-xs">Name</div>
                <div className="font-medium text-slate-900">City Care Hospital</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Role</div>
                <Badge variant="secondary" className="mt-1">Hospital</Badge>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Contact</div>
                <div className="font-medium text-slate-900">admin@citycare.com</div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Escalation Meta
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-500 text-xs">Assigned Team</div>
                <div className="font-medium text-slate-900">{role === "admin" ? "Admin Team" : "Accounts Team"}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Assigned Date</div>
                <div className="font-medium text-slate-900">10 Jul 2026, 10:30 AM</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Due Date</div>
                <div className="font-medium text-red-600">12 Jul 2026, 10:30 AM</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
