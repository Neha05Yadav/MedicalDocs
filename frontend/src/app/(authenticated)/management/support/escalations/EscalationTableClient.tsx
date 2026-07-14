"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


const BriefcaseMedical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 11v4"></path><path d="M14 13h-4"></path><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><path d="M18 6v14"></path><path d="M6 6v14"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>;
const Wallet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>;
const Code = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const UploadCloud = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const FileImage = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><circle cx="10" cy="12" r="2"></circle><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"></path></svg>;
const Send = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>;

export default function EscalationTableClient({ escalations, teams }: { escalations: any[], teams: any[] }) {
  const [localEscalations, setLocalEscalations] = useState<any[]>(escalations);
  const [selectedEscalation, setSelectedEscalation] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  
  // Form State
  const [selectedTeam, setSelectedTeam] = useState("dev");
  const [reason, setReason] = useState("Double deduction / Refund issue");
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("Customer has been charged twice for the same subscription renewal. Payment ID: pay_123456789. Requesting refund and root cause check.");
  const [attachment, setAttachment] = useState<string | null>("Payment_Screenshot.jpg");

  const handleRowClick = (esc: any) => {
    setSelectedEscalation(esc);
    setIsDialogOpen(true);
  };

  return (
    <>
      {/* Top Action Button */}
      <div className="flex justify-end items-center mb-8 -mt-16 relative z-10">
        <button 
          onClick={() => setIsEscalateModalOpen(true)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Escalate Issue
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 grid grid-cols-6 font-semibold text-[13px] text-slate-500 uppercase tracking-wider">
          <div>Escalation ID</div>
          <div className="col-span-2">Issue Description</div>
          <div>Assigned Team</div>
          <div>Status</div>
          <div>Escalated</div>
        </div>
        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {localEscalations.map((esc) => (
            <div 
              key={esc.id} 
              className="px-6 py-5 grid grid-cols-6 items-center text-sm gap-4 hover:bg-slate-50/50 cursor-pointer transition-colors group"
              onClick={() => handleRowClick(esc)}
            >
              <div>
                <div className="font-bold text-slate-900 mb-1">{esc.id}</div>
                <div className="text-xs font-medium text-slate-400">Ref: {esc.ticketId}</div>
              </div>
              <div className="col-span-2 pr-4">
                <div className="font-bold text-slate-900 truncate mb-1" title={esc.issue}>{esc.issue}</div>
                <div className="text-xs font-medium text-slate-400">{esc.issueCategory}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${esc.teamBg}`}>
                  {esc.assignedTeam === "Accounts Team" && <Wallet className="w-4 h-4" />}
                  {esc.assignedTeam === "Development Team" && <Code className="w-4 h-4" />}
                  {esc.assignedTeam === "Admin Team" && <BriefcaseMedical className="w-4 h-4" />}
                </div>
                <span className="font-semibold text-slate-700">{esc.assignedTeam}</span>
              </div>
              <div>
                <Badge className={`${esc.statusColor} hover:${esc.statusColor} border-none shadow-none rounded-full px-3 py-1 font-semibold text-xs`}>
                  {esc.status}
                </Badge>
              </div>
              <div className="text-slate-500 font-medium flex justify-between items-center">
                <span className="text-[13px]">{esc.time}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Details Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-6 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold">Escalation Details</h3>
                <p className="mt-1.5 text-slate-500 font-mono text-xs">
                  ID: {selectedEscalation?.id} • Ref Ticket: {selectedEscalation?.ticketId}
                </p>
              </div>
              <div className="flex gap-4 items-start">
                {selectedEscalation && (
                  <Badge className={`${selectedEscalation.statusColor} border-none shadow-none text-sm px-3 py-1 rounded-full`}>
                    {selectedEscalation.status}
                  </Badge>
                )}
                <button onClick={() => setIsDialogOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              {selectedEscalation && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">{selectedEscalation.issue}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        <span>Reported by: <span className="font-medium text-slate-700">{selectedEscalation.user}</span></span>
                      </div>
                    </div>
                    <Badge variant={selectedEscalation.priority === 'Critical' ? 'destructive' : 'secondary'} className="uppercase rounded-full">
                      {selectedEscalation.priority} Priority
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Internal Investigation Notes
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed p-3 bg-blue-50/50 border border-blue-100 rounded-md">
                        {selectedEscalation.internalNotes}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Assigned To</h4>
                      <div className="flex items-center gap-3 p-3 border rounded-md">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${selectedEscalation.teamBg}`}>
                          {selectedEscalation.assignedTeam === "Accounts Team" && <Wallet className="w-4 h-4" />}
                          {selectedEscalation.assignedTeam === "Development Team" && <Code className="w-4 h-4" />}
                          {selectedEscalation.assignedTeam === "Admin Team" && <BriefcaseMedical className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{selectedEscalation.assignedTeam}</div>
                          <div className="text-xs text-slate-500">{selectedEscalation.issueCategory}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Escalation Updates</h4>
                    <div className="space-y-3">
                      {selectedEscalation.updates.map((update: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-24 shrink-0 text-xs text-slate-400 font-medium pt-0.5">{update.time}</div>
                          <div className="flex-1 text-sm text-slate-700 pb-3 border-b last:border-0">{update.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Escalate Issue Form Modal */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-6 pb-4 border-b">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Escalate Issue</h3>
                <p className="text-slate-500 mt-1">Escalate this issue to the appropriate team for further investigation.</p>
              </div>
              <button onClick={() => setIsEscalateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-8">
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
                            {team.id === "accounts" && <Wallet className={`w-6 h-6 ${isSelected ? "text-purple-600" : "text-purple-400"}`} />}
                            {team.id === "admin" && <BriefcaseMedical className={`w-6 h-6 ${isSelected ? "text-emerald-600" : "text-emerald-400"}`} />}
                            {team.id === "dev" && <Code className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-blue-400"}`} />}
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
                    <select 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option>Double deduction / Refund issue</option>
                      <option>Payment Gateway Timeout</option>
                      <option>Invoice discrepancy</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900 block mb-2">Priority <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
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
                    id="escalation-attachment" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachment(e.target.files[0].name);
                      }
                    }} 
                  />
                  <div className="border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <label htmlFor="escalation-attachment" className="flex items-center gap-3 cursor-pointer group">
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
                <div className="flex justify-end items-center gap-3 pt-4">
                  <button 
                    onClick={() => setIsEscalateModalOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const selTeamObj = teams.find(t => t.id === selectedTeam);
                      const newEsc = {
                        id: "ESC-" + Math.floor(Math.random() * 1000 + 500),
                        ticketId: "TK-" + Math.floor(Math.random() * 1000 + 4000),
                        issue: reason,
                        issueCategory: "New Escalation",
                        assignedTeam: selTeamObj?.name || "Support Team",
                        teamBg: selTeamObj?.bgColor + " text-purple-600 border border-purple-100",
                        status: "Just Escalated",
                        statusColor: "bg-blue-100 text-blue-700",
                        time: "Just now",
                        user: "City Hospital",
                        priority: priority,
                        internalNotes: notes,
                        updates: [
                          { time: "Just now", text: `Ticket escalated to ${selTeamObj?.name} by Support L1.` }
                        ]
                      };
                      setLocalEscalations([newEsc, ...localEscalations]);
                      toast.success(`Issue escalated successfully to ${selTeamObj?.name}!`);
                      setIsEscalateModalOpen(false);
                      setAttachment(null);
                      setNotes("");
                    }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Escalate Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
