"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  CreditCard, Package, TrendingUp, AlertTriangle, 
  Plus, X, Check, Trash2
} from "lucide-react";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    target: "",
    features: "",
    popular: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/management/admin/subscriptions');
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.features) {
      toast.error("Please fill required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const featureArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
      const res = await fetch('/api/management/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          features: featureArray
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPlans([...plans, data.plan]);
        toast.success("New plan created successfully!");
        setIsCreatePlanModalOpen(false);
        setFormData({ name: "", price: "", target: "", features: "", popular: false });
      } else throw new Error();
    } catch (error) {
      toast.error("Failed to create plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan? Hospitals will no longer be able to subscribe to it.")) return;

    try {
      const res = await fetch(`/api/management/admin/subscriptions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlans(plans.filter(p => p.id !== id));
        toast.success("Plan deleted successfully");
      } else throw new Error();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans space-y-8">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage pricing plans and view subscriber analytics.</p>
        </div>
        <button 
          onClick={() => setIsCreatePlanModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="size-4" />
          Create New Plan
        </button>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <Package className="size-8 text-indigo-500 mb-4" />
          <div>
            <h3 className="text-sm font-bold text-slate-500">Active Subscriptions</h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">214</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <TrendingUp className="size-8 text-emerald-500 mb-4" />
          <div>
            <h3 className="text-sm font-bold text-slate-500">Monthly Recurring Revenue</h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">₹1.2M</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <AlertTriangle className="size-8 text-rose-500 mb-4" />
          <div>
            <h3 className="text-sm font-bold text-slate-500">Expiring Soon</h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">12</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-900">Active Pricing Plans</h3>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500 font-medium animate-pulse">Loading plans...</div>
        ) : plans.length > 0 ? plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-2xl border p-6 flex flex-col relative transition-all hover:-translate-y-1 hover:shadow-lg ${plan.popular ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 shadow-sm'}`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">Most Popular</div>
            )}
            
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-xl font-bold text-slate-900">{plan.name}</h4>
              <button onClick={() => handleDeletePlan(plan.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1" title="Delete Plan">
                <Trash2 className="size-4" />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 font-medium">{plan.target}</p>
            
            <div className="mt-6 mb-6">
              <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
              <span className="text-sm font-bold text-slate-500">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature: string, fIdx: number) => (
                <li key={fIdx} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-emerald-50 text-emerald-500 rounded-full p-1 shrink-0">
                    <Check className="size-3" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto">
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-3 rounded-xl text-sm font-bold transition-colors border border-slate-200">
                Edit Plan
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-3 text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No pricing plans available. Create one to get started.
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
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
              <form id="createPlanForm" onSubmit={handleCreatePlan} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Plan Name *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Premium Plus" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Monthly Price (₹) *</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g. 4999" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Target Audience</label>
                    <input 
                      type="text" 
                      value={formData.target}
                      onChange={e => setFormData({...formData, target: e.target.value})}
                      placeholder="e.g. Large Hospitals" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Features List * (Comma separated)</label>
                    <textarea 
                      required
                      value={formData.features}
                      onChange={e => setFormData({...formData, features: e.target.value})}
                      placeholder="e.g. Unlimited users, 24/7 Support, API Access" 
                      rows={3} 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="popular" 
                      checked={formData.popular}
                      onChange={e => setFormData({...formData, popular: e.target.checked})}
                      className="size-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                    />
                    <label htmlFor="popular" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                      Highlight as "Most Popular" plan
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsCreatePlanModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="createPlanForm"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
