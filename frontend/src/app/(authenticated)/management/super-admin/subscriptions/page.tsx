"use client";
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>;
const Package = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><path d="m7.5 4.27 9 5.15"></path></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>;








import React, { useState } from 'react';
export default function SubscriptionsPage() {
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <button 
          onClick={() => setIsCreatePlanModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create New Plan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Package className="size-8 text-indigo-500 mb-4" />
          <h3 className="text-sm font-bold text-slate-500">Active Subscriptions</h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">214</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <TrendingUp className="size-8 text-emerald-500 mb-4" />
          <h3 className="text-sm font-bold text-slate-500">Monthly Recurring Revenue</h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">₹1.2M</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <AlertTriangle className="size-8 text-rose-500 mb-4" />
          <h3 className="text-sm font-bold text-slate-500">Expiring Soon</h3>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">12</p>
        </div>
      </div>
      <div className="mb-6 flex justify-between items-end">
        <h3 className="text-lg font-bold text-slate-900">Active Pricing Plans</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Basic Plan", price: "₹999/mo", target: "Small Clinics", features: ["Up to 2 Doctors", "Basic Reports", "Email Support", "1GB Storage"] },
          { name: "Professional Plan", price: "₹2,999/mo", target: "Medium Hospitals", features: ["Up to 10 Doctors", "Advanced Analytics", "Priority 24/7 Support", "10GB Storage", "Custom Branding"], popular: true },
          { name: "Enterprise Plan", price: "₹9,999/mo", target: "Large Healthcare Networks", features: ["Unlimited Doctors", "Custom Integrations", "Dedicated Account Manager", "Unlimited Storage", "API Access"] }
        ].map((plan, idx) => (
          <div key={idx} className={`bg-white rounded-2xl border p-6 flex flex-col relative ${plan.popular ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 shadow-sm'}`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">Most Popular</div>
            )}
            <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">{plan.target}</p>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-extrabold text-slate-900">{plan.price.split('/')[0]}</span>
              <span className="text-sm font-bold text-slate-500">/{plan.price.split('/')[1]}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2">
                  <div className="mt-0.5 bg-emerald-50 text-emerald-500 rounded-full p-0.5 shrink-0">
                    <Check className="size-3" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-slate-200">Edit Plan</button>
            </div>
          </div>
        ))}
      </div>
      {/* Create Plan Modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Package className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Create New Subscription Plan</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Define pricing and features for facilities.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreatePlanModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Plan Name</label>
                    <input type="text" placeholder="e.g. Premium Plus" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Monthly Price (₹)</label>
                    <input type="number" placeholder="e.g. 4999" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Target Audience</label>
                    <input type="text" placeholder="e.g. Large Hospitals" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Features List (Comma separated)</label>
                    <textarea placeholder="e.g. Unlimited users, 24/7 Support, API Access" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="popular" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                    <label htmlFor="popular" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as "Most Popular" plan</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsCreatePlanModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                type="button"
              >
                Publish Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
