"use client";

import React, { useState, useEffect } from 'react';

const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const ArrowDownCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="m8 12 4 4 4-4"></path></svg>;

export default function SalesPaymentsPage() {
  const tabs = ["Payment History", "Successful", "Pending", "Failed", "Refunds"];
  const [activeTab, setActiveTab] = useState("Payment History");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchPayments = () => {
    fetch('/api/management/sales/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load payments", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePaymentAction = async (id: string, action: string) => {
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/management/sales/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.updatedStatus) {
          setPayments(prev => prev.map(p => p.id === id ? { ...p, status: result.updatedStatus } : p));
        }
      }
    } catch (e) {
      console.error("Failed to process payment action", e);
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredPayments = payments.filter(pay => {
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
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPayments.map(pay => (
            <div key={pay.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow group ${isProcessing === pay.id ? 'opacity-50 pointer-events-none' : ''}`}>
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
                
                <div className="flex gap-2">
                  {pay.status === "Pending" && (
                    <button 
                      onClick={() => handlePaymentAction(pay.id, 'mark_paid')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-[11px] font-bold tracking-wide transition-colors"
                    >
                      Mark Paid
                    </button>
                  )}
                  {pay.status === "Successful" && (
                    <button 
                      onClick={() => handlePaymentAction(pay.id, 'refund')}
                      className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold tracking-wide transition-colors"
                    >
                      Refund
                    </button>
                  )}
                  <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-[11px] font-bold tracking-wide transition-colors">
                    Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPayments.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium">
              No payments found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
