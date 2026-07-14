"use client";

import React, { useState, useEffect } from 'react';

const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const MoreVertical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;
const XIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

export default function SalesSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Plan Change Modal State
  const [changePlanModal, setChangePlanModal] = useState<{ isOpen: boolean, subId: string | null, currentPlan: string | null }>({ isOpen: false, subId: null, currentPlan: null });

  const fetchSubscriptions = () => {
    fetch('/api/management/sales/subscriptions')
      .then(res => res.json())
      .then(data => {
        setSubscriptions(data.subscriptions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch subscriptions:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsProcessing(id);
    setActiveMenuId(null);
    try {
      const res = await fetch(`/api/management/sales/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus })
      });
      if (res.ok) {
        // Optimistic update
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChangePlan = async (newPlan: string) => {
    if (!changePlanModal.subId) return;
    
    setIsProcessing(changePlanModal.subId);
    setChangePlanModal({ isOpen: false, subId: null, currentPlan: null });
    
    try {
      const res = await fetch(`/api/management/sales/subscriptions/${changePlanModal.subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_plan', plan_name: newPlan })
      });
      if (res.ok) {
        // Refresh full data to get the new plan details and price accurately
        fetchSubscriptions();
      }
    } catch (e) {
      console.error("Failed to change plan", e);
      setIsProcessing(null);
    }
  };

  // Removed click outside listener because we are moving to inline buttons

  const filteredSubs = subscriptions.filter(sub => {
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    const matchesSearch = sub.facility.toLowerCase().includes(searchTerm.toLowerCase()) || sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans relative">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-end items-center">
          <div className="flex gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search facility or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="relative shrink-0">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-10 pr-10 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Renewal Due">Due Soon</option>
                <option value="Expired">Expired</option>
                <option value="Suspended">Suspended</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Facility & ID</th>
                  <th className="px-6 py-4">Plan Details</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.length > 0 ? filteredSubs.map(sub => (
                  <tr key={sub.id} className={`hover:bg-slate-50/50 transition-colors group ${isProcessing === sub.id ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{sub.facility}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{sub.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-indigo-600">{sub.plan}</div>
                      <div className="text-xs font-bold text-slate-500 mt-0.5">{sub.amount}/yr</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {sub.startDate}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {sub.endDate}
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="size-3" /> Active
                        </span>
                      ) : sub.status === "Renewal Due" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                          <Clock className="size-3" /> Due Soon
                        </span>
                      ) : sub.status === "Suspended" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle className="size-3" /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                          <XCircle className="size-3" /> Expired
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isProcessing === sub.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 inline-block"></div>
                      ) : (
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setChangePlanModal({ isOpen: true, subId: sub.id, currentPlan: sub.plan });
                            }}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-[11px] font-bold tracking-wide transition-colors"
                          >
                            Change Plan
                          </button>
                          
                          {sub.status !== 'Suspended' && sub.status !== 'Expired' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(sub.id, 'Suspended');
                              }}
                              className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold tracking-wide transition-colors"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(sub.id, 'Active');
                              }}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-[11px] font-bold tracking-wide transition-colors"
                            >
                              Re-activate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ShieldCheck className="size-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No subscriptions found for the current filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Change Plan Modal */}
      {changePlanModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Change Plan</h2>
              <button 
                onClick={() => setChangePlanModal({ isOpen: false, subId: null, currentPlan: null })}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Select a new plan for this subscription. The current plan is <span className="font-bold text-indigo-600">{changePlanModal.currentPlan}</span>.
              </p>
              <div className="space-y-3">
                {['Basic Plan', 'Pro Plan', 'Enterprise Plan', 'Premium Plan'].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => handleChangePlan(plan)}
                    disabled={plan === changePlanModal.currentPlan}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all flex justify-between items-center ${
                      plan === changePlanModal.currentPlan 
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700 cursor-default opacity-60' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <span>{plan}</span>
                    {plan === changePlanModal.currentPlan && (
                      <span className="text-[10px] uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setChangePlanModal({ isOpen: false, subId: null, currentPlan: null })}
                className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
