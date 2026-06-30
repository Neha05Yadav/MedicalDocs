"use client";
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const BellRing = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;









import React, { useState } from 'react';
const mockPending = [
  { invoice: "INV-2026-089", client: "City Care Hospital", type: "Hospital", amount: "₹45,000", dueDate: "15 Jun 2026", lateFee: "₹500", reminderSent: true, daysOverdue: 8 },
  { invoice: "INV-2026-092", client: "Dr. Ramesh Kumar", type: "Doctor", amount: "₹5,000", dueDate: "20 Jun 2026", lateFee: "₹0", reminderSent: false, daysOverdue: 3 },
  { invoice: "INV-2026-095", client: "Apex Laboratories", type: "Lab", amount: "₹12,500", dueDate: "25 Jun 2026", lateFee: "₹0", reminderSent: false, daysOverdue: -2 }, // Due in 2 days
  { invoice: "INV-2026-081", client: "Metro Health", type: "Hospital", amount: "₹85,000", dueDate: "05 Jun 2026", lateFee: "₹2,500", reminderSent: true, daysOverdue: 18 },
  { invoice: "INV-2026-098", client: "Dr. Priya Patel", type: "Doctor", amount: "₹5,000", dueDate: "23 Jun 2026", lateFee: "₹0", reminderSent: false, daysOverdue: 0 }, // Due today
];
export default function PendingPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminderClient, setReminderClient] = useState("City Care Hospital");
  const filteredPending = mockPending.filter(pay => {
    const matchesSearch = pay.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pay.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === "Sent") matchesStatus = pay.reminderSent === true;
    if (statusFilter === "Not Sent") matchesStatus = pay.reminderSent === false;
    return matchesSearch && matchesStatus;
  });
  const handleOpenModal = (clientName: string = "City Care Hospital") => {
    setReminderClient(clientName);
    setIsModalOpen(true);
  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoice or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full flex items-center justify-center gap-2 pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Sent">Reminder Sent</option>
                <option value="Not Sent">Reminder Not Sent</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
            </div>
            <button 
              onClick={() => handleOpenModal("All Pending Clients")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors"
            >
              <BellRing className="size-4" />
              <span className="hidden sm:inline">Send All Reminders</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Invoice & Client</th>
                <th className="px-6 py-4">Due Amount</th>
                <th className="px-6 py-4">Late Fee</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Reminder Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPending.map((pay, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{pay.invoice}</div>
                    <div className="text-xs font-bold text-indigo-600 mt-0.5">{pay.client} <span className="text-slate-400 font-medium">({pay.type})</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900 text-base">{pay.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${pay.lateFee !== "₹0" ? "text-rose-600" : "text-slate-400"}`}>{pay.lateFee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{pay.dueDate}</span>
                      {pay.daysOverdue > 0 ? (
                        <span className="text-[11px] font-bold text-rose-600 mt-0.5 flex items-center gap-1"><AlertCircle className="size-3" /> {pay.daysOverdue} days overdue</span>
                      ) : pay.daysOverdue === 0 ? (
                        <span className="text-[11px] font-bold text-amber-600 mt-0.5 flex items-center gap-1"><Clock className="size-3" /> Due Today</span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 mt-0.5">Due in {Math.abs(pay.daysOverdue)} days</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {pay.reminderSent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="size-3" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                        Not Sent
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(pay.client)}
                      className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-amber-700 hover:border-amber-200 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <Mail className="size-3.5" /> Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPending.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">No pending payments found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Send Payment Reminder</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">To:</label>
                <input 
                  type="text" 
                  value={reminderClient}
                  readOnly
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 text-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject:</label>
                <input 
                  type="text" 
                  defaultValue="Payment Reminder: Overdue Invoice"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message:</label>
                <textarea 
                  rows={5}
                  defaultValue={`Dear ${reminderClient},\n\nThis is a gentle reminder that your payment is currently overdue. Kindly process the payment at your earliest convenience to avoid any service interruptions.\n\nPlease find the invoice attached to this email.\n\nThank you,\nMediDoc Accounts Team`}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 rounded-xl shadow-sm transition-colors"
              >
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
