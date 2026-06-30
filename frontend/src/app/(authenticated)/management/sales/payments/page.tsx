"use client";
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const ArrowDownCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="m8 12 4 4 4-4"></path></svg>;








import React, { useState } from 'react';
const mockPayments = [
  { id: "PAY-901", hospital: "City Care Hospital", amount: "₹45,000", date: "22 Jun 2026", method: "Credit Card", status: "Successful" },
  { id: "PAY-902", hospital: "Apex Laboratories", amount: "₹12,500", date: "21 Jun 2026", method: "Bank Transfer", status: "Pending" },
  { id: "PAY-903", hospital: "Sunrise Clinic", amount: "₹5,000", date: "20 Jun 2026", method: "UPI", status: "Failed" },
  { id: "PAY-904", hospital: "Metro Health", amount: "₹45,000", date: "19 Jun 2026", method: "Credit Card", status: "Refunded" },
  { id: "PAY-905", hospital: "Carewell Hospital", amount: "₹12,500", date: "18 Jun 2026", method: "Credit Card", status: "Successful" },
];
export default function SalesPaymentsPage() {
  const tabs = ["Payment History", "Successful", "Pending", "Failed", "Refunds"];
  const [activeTab, setActiveTab] = useState("Payment History");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPayments = mockPayments.filter(pay => {
    const matchesTab = activeTab === "Payment History" 
      ? true 
      : activeTab === "Refunds" 
        ? pay.status === "Refunded" 
        : pay.status === activeTab;
    const matchesSearch = pay.hospital.toLowerCase().includes(searchTerm.toLowerCase()) || pay.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      {/* Header removed to avoid redundancy */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 xl:flex-none whitespace-nowrap px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text" 
                placeholder="Search hospital, lab or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPayments.map(pay => (
          <div key={pay.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-black text-slate-900 text-2xl">{pay.amount}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">{pay.date}</div>
              </div>
              <div>
                {pay.status === "Successful" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 className="size-3" /> Successful
                  </span>
                ) : pay.status === "Pending" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                    <Clock className="size-3" /> Pending
                  </span>
                ) : pay.status === "Failed" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                    <XCircle className="size-3" /> Failed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    <ArrowDownCircle className="size-3" /> Refunded
                  </span>
                )}
              </div>
            </div>
            <div className="mb-5">
              <h3 className="font-bold text-slate-700 text-base">{pay.hospital}</h3>
              <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
                <CreditCard className="size-4 text-slate-400" /> {pay.method}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{pay.id}</span>
              <button className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                Download Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
