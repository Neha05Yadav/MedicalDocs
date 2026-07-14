"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Send, User, StickyNote, Save } from "lucide-react";
import { toast } from "sonner";

export default function TicketList({ tickets, onRefresh }: { tickets: any[], onRefresh: () => void }) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Open": return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Closed": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const openModal = async (ticket: any) => {
    setSelectedTicket({ ticket, replies: [], details: {} });
    setStatus(ticket.status);
    setAssignedTo("");
    setInternalNotes("");
    setIsModalOpen(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/support-tickets/${ticket.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data);
        setStatus(data.ticket.status);
        setAssignedTo(data.details?.assignedTo || "");
        setInternalNotes(data.details?.internalNotes || "");
      }
    } catch (e) {
      toast.error("Failed to fetch ticket details");
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/support-tickets/${selectedTicket.ticket.id}/reply`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage })
      });
      if (res.ok) {
        toast.success("Reply sent!");
        setReplyMessage("");
        
        // Refresh replies quietly
        const refreshRes = await fetch(`/api/support-tickets/${selectedTicket.ticket.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setSelectedTicket(data);
        }
      }
    } catch (e) {
      toast.error("Failed to send reply");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedTicket) return;
    try {
      const token = localStorage.getItem("token");
      
      let statusUpdated = false;
      if (status !== selectedTicket.ticket.status) {
        const statusRes = await fetch(`/api/support-tickets/${selectedTicket.ticket.id}/status`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (statusRes.ok) statusUpdated = true;
      }
      
      const detailsRes = await fetch(`/api/support-tickets/${selectedTicket.ticket.id}/details`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo, internalNotes })
      });

      if (detailsRes.ok) {
        toast.success("Ticket updated successfully!");
        onRefresh();
        setIsModalOpen(false);
      } else {
        toast.error("Failed to save some details");
      }
    } catch (e) {
      toast.error("Error saving changes");
    }
  };

  const assignToSelf = () => {
    try {
      const userStr = localStorage.getItem("user");
      let name = "Support Agent";
      if (userStr) {
        const user = JSON.parse(userStr);
        name = user.name || "Support Agent";
      }
      setAssignedTo(name);
    } catch (e) {
      setAssignedTo("Support Agent");
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="p-4 border-b bg-slate-50 grid grid-cols-8 font-medium text-sm text-slate-500 items-center">
        <div className="col-span-2">Ticket details</div>
        <div>User Type</div>
        <div>User Name</div>
        <div>Issue</div>
        <div>Status</div>
        <div>Created</div>
        <div className="text-right">Action</div>
      </div>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="p-4 border-b last:border-0 grid grid-cols-8 items-center text-sm gap-2 hover:bg-slate-50 transition-colors"
          >
            <div className="col-span-2 pr-2 overflow-hidden">
              <div className="font-medium text-slate-900 truncate" title={ticket.subject}>{ticket.subject}</div>
              <div className="text-slate-500 font-mono text-xs mt-0.5">{ticket.ticketId}</div>
            </div>
            <div>
              <Badge variant="outline" className="text-slate-500 font-normal bg-white">{ticket.userRole}</Badge>
            </div>
            <div className="truncate pr-2 font-medium text-slate-700" title={ticket.userName}>{ticket.userName}</div>
            <div className="truncate pr-2">{ticket.category}</div>
            <div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
            </div>
            <div className="text-slate-500 whitespace-nowrap">{new Date(ticket.createdAt).toLocaleDateString()}</div>
            <div className="text-right">
              <button 
                onClick={() => openModal(ticket)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Manage
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-12 text-center text-slate-500">
          No tickets found.
        </div>
      )}

      {/* TICKET DETAILS MODAL FOR SUPPORT TEAM */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span className="font-mono text-sm bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedTicket.ticket.ticketId}</span>
                  {selectedTicket.ticket.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Raised by: <span className="font-bold">{selectedTicket.ticket.userName}</span> ({selectedTicket.ticket.userRole}) • <span className="font-bold text-slate-700">{selectedTicket.ticket.priority}</span> Priority</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right mr-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Update Status</span>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 shadow-sm"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <button 
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save className="size-4" /> Save
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors ml-2"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Left Column: Conversation */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 flex flex-col">
                
                {/* Original Complaint */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="size-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedTicket.ticket.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selectedTicket.ticket.userName}</p>
                      <p className="text-[10px] text-slate-500">{selectedTicket.ticket.category} • {new Date(selectedTicket.ticket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedTicket.ticket.description}</p>
                  {selectedTicket.ticket.attachment && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase">Attachment: </span>
                      <a href={selectedTicket.ticket.attachment} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">View File</a>
                    </div>
                  )}
                </div>

                {/* Replies */}
                <div className="space-y-4 flex-1">
                  {selectedTicket.replies?.map((reply: any) => {
                    const isSupport = reply.senderRole === "Support Team";
                    return (
                      <div key={reply.id} className={`flex gap-4 ${isSupport ? 'flex-row-reverse' : ''}`}>
                        <div className={`size-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm mt-1 shadow-sm ${
                          isSupport ? 'bg-[#0891b2] text-white' : 'bg-slate-800 text-white'
                        }`}>
                          {reply.senderName.charAt(0)}
                        </div>
                        <div className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'} max-w-[80%]`}>
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-bold text-slate-700">{reply.senderName}</span>
                            <span className="text-[10px] text-slate-400">{new Date(reply.createdAt).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                            isSupport 
                              ? 'bg-[#0891b2] text-white rounded-tr-sm' 
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                          }`}>
                            <p className="whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Reply Input */}
                <div className="pt-6 mt-6">
                  <div className="flex items-end gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <textarea 
                      rows={1}
                      placeholder="Type your reply to the user..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none resize-none min-h-[40px] max-h-[120px]"
                    ></textarea>
                    <button 
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                      className="px-4 py-2 bg-[#0891b2] hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Support Details */}
              <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="size-4" /> Assigned Agent
                  </h4>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Unassigned"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0891b2] shadow-sm w-full min-w-0"
                    />
                    <button 
                      onClick={assignToSelf}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 whitespace-nowrap shadow-sm shrink-0"
                    >
                      Assign Self
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <StickyNote className="size-4" /> Internal Notes
                  </h4>
                  <p className="text-[10px] text-slate-400 mb-2 leading-tight">These notes are visible only to the support team and not to the user.</p>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add internal notes here..."
                    className="flex-1 w-full p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none min-h-[200px] shadow-sm"
                  ></textarea>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
