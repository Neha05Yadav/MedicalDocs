"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Send,
  Plus
} from "lucide-react";

export default function SupportModule({ role }: { role: string }) {
  const [activeTab, setActiveTab] = useState<"raise" | "tickets" | "faqs">("raise");

  // Raise Complaint Form State
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // My Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const categories = [
    "Technical Issue",
    "Login Problem",
    "Report Access Issue",
    "Upload Issue",
    "Payment Issue",
    "Account Issue",
    "Bug Report",
    "Feature Request",
    "Other"
  ];

  const faqs = [
    { category: "Account & Login", q: "How do I reset my password?", a: "Click on 'Forgot Password' on the login screen and follow the instructions sent to your email." },
    { category: "Report Access", q: "Why can't I see my patient's report?", a: "The patient must approve your access request first. Check your 'Access Requests' tab." },
    { category: "Medical Records", q: "Are my records secure?", a: "Yes, all medical records are encrypted and securely stored following health data guidelines." },
    { category: "Upload Reports", q: "What formats are supported for report uploads?", a: "We currently support PDF, JPG, and PNG formats up to 10MB." },
    { category: "General Questions", q: "How do I contact support directly?", a: "You can raise a ticket using this module, and our team will get back to you shortly." }
  ];

  const [searchFaq, setSearchFaq] = useState("");

  useEffect(() => {
    if (activeTab === "tickets") {
      fetchMyTickets();
    }
  }, [activeTab]);

  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/support-tickets/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subject || !description) return toast.error("Please fill all required fields");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, description, priority })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success(`Complaint submitted successfully! Ticket ID: ${data.ticketId}`);
        setCategory("");
        setSubject("");
        setDescription("");
        setPriority("Low");
        setActiveTab("tickets");
      } else {
        toast.error("Failed to submit complaint");
      }
    } catch (e) {
      toast.error("Error submitting complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTicketDetails = async (ticket: any) => {
    setSelectedTicket({ ticket, replies: [] }); // Set initially to show modal instantly
    setIsTicketModalOpen(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/support-tickets/${ticket.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data);
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
        // Refresh details
        openTicketDetails(selectedTicket.ticket);
      }
    } catch (e) {
      toast.error("Failed to send reply");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Closed": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <HelpCircle className="size-8 text-[#0891b2]" />
          Help & Support
        </h1>
        <p className="text-slate-500 mt-2">Need assistance? Raise a complaint, track your tickets, or browse our Help Center.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar bg-slate-50">
          <button 
            onClick={() => setActiveTab("raise")}
            className={`px-6 py-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "raise" ? "border-[#0891b2] text-[#0891b2] bg-white" : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Plus className="size-4" /> Raise Complaint
          </button>
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "tickets" ? "border-[#0891b2] text-[#0891b2] bg-white" : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MessageSquare className="size-4" /> My Tickets
          </button>
          <button 
            onClick={() => setActiveTab("faqs")}
            className={`px-6 py-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "faqs" ? "border-[#0891b2] text-[#0891b2] bg-white" : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="size-4" /> Help Center / FAQs
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          
          {/* RAISE COMPLAINT TAB */}
          {activeTab === "raise" && (
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Submit a New Complaint</h2>
              <form onSubmit={handleRaiseComplaint} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category <span className="text-red-500">*</span></label>
                    <select 
                      required 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] focus:bg-white transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Priority</label>
                    <select 
                      value={priority} 
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] focus:bg-white transition-all"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your issue..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea 
                    required 
                    rows={6}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the issue..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        <Send className="size-4" /> Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MY TICKETS TAB */}
          {activeTab === "tickets" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {loadingTickets ? (
                <div className="text-center py-12 text-slate-500">Loading tickets...</div>
              ) : tickets.length > 0 ? (
                <div className="grid gap-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{ticket.ticketId}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{ticket.priority} Priority</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <AlertCircle className="size-4 text-slate-400" /> {ticket.category}
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end gap-3 border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <Clock className="size-3.5" /> {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => openTicketDetails(ticket)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          View Conversation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <MessageSquare className="size-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No tickets found</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">You haven't raised any complaints yet. Need help? Switch to the "Raise Complaint" tab.</p>
                </div>
              )}
            </div>
          )}

          {/* FAQs TAB */}
          {activeTab === "faqs" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-2xl mx-auto mb-8 relative">
                <input 
                  type="text" 
                  placeholder="Search FAQs..." 
                  value={searchFaq}
                  onChange={(e) => setSearchFaq(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {faqs.filter(f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.category.toLowerCase().includes(searchFaq.toLowerCase())).map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-[#0891b2] uppercase tracking-wider mb-2 block">{faq.category}</span>
                    <h4 className="font-bold text-slate-900 mb-3">{faq.q}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* TICKET DETAILS MODAL */}
      {isTicketModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span className="font-mono text-sm bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedTicket.ticket.ticketId}</span>
                  {selectedTicket.ticket.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex gap-3">
                  <span className={`uppercase font-bold tracking-wider ${getStatusColor(selectedTicket.ticket.status).replace('bg-', 'text-').replace('text-', '')}`}>
                    • {selectedTicket.ticket.status}
                  </span>
                  <span>{new Date(selectedTicket.ticket.createdAt).toLocaleString()}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsTicketModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              
              {/* Original Complaint */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="size-8 rounded-full bg-[#0891b2] text-white flex items-center justify-center font-bold text-sm">
                    {selectedTicket.ticket.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{selectedTicket.ticket.userName}</p>
                    <p className="text-[10px] text-slate-500">Original Complaint</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedTicket.ticket.description}</p>
              </div>

              {/* Replies */}
              <div className="space-y-4">
                {selectedTicket.replies?.map((reply: any) => {
                  const isUser = reply.senderId === selectedTicket.ticket.userId;
                  return (
                    <div key={reply.id} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`size-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm mt-1 shadow-sm ${
                        isUser ? 'bg-[#0891b2] text-white' : 'bg-slate-800 text-white'
                      }`}>
                        {reply.senderName.charAt(0)}
                      </div>
                      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-bold text-slate-700">{reply.senderName}</span>
                          <span className="text-[10px] text-slate-400">{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                          isUser 
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

            </div>

            {/* Footer / Reply Box */}
            {selectedTicket.ticket.status !== 'Closed' ? (
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-end gap-3">
                  <textarea 
                    rows={2}
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] resize-none"
                  ></textarea>
                  <button 
                    onClick={handleReply}
                    disabled={!replyMessage.trim()}
                    className="px-5 py-3 h-full bg-[#0891b2] hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Send className="size-4" /> Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-100 bg-slate-100 text-center">
                <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-4" /> This ticket is closed. No further replies can be added.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
