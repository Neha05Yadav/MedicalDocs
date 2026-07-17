"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Check, ShieldCheck, Zap, Star } from "lucide-react";

export default function HospitalSubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetch('/api/hospital/subscription', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Subscription data could not be loaded.");
        return res.json();
      })
      .then(data => {
        setPlans(Array.isArray(data?.plans) ? data.plans : []);
        setCurrentPlan(data?.currentPlanId || null);
      })
      .catch((caught: unknown) => {
        const message = caught instanceof Error ? caught.message : "Failed to load pricing plans";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgradingPlan(planId);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch('/api/hospital/subscription', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ planId }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to change subscription plan.");
      setCurrentPlan(planId);
      toast.success(data?.message || "Subscription plan updated.");
    } catch (caught: unknown) {
      toast.error(caught instanceof Error ? caught.message : "Unable to change subscription plan.");
    } finally {
      setUpgradingPlan(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Upgrade Your Plan</h1>
        <p className="text-lg text-slate-600 font-medium">
          Choose the right plan for your hospital. Unlock advanced features, increase limits, and provide better care.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500 font-medium animate-pulse">Loading plans...</div>
        ) : error ? (
          <div className="col-span-3 text-center py-12 text-red-600 font-medium">{error}</div>
        ) : plans.length > 0 ? plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isUpgrading = upgradingPlan === plan.id;
          
          return (
            <div 
              key={plan.id} 
              className={`bg-white rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
                isCurrentPlan 
                  ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]' 
                  : plan.popular 
                    ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]' 
                    : 'border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Badges */}
              {isCurrentPlan && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="size-3" /> Current Plan
                </div>
              )}
              {!isCurrentPlan && plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1">
                  <Star className="size-3" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-2">{plan.target}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">₹{plan.price}</span>
                  <span className="text-lg font-bold text-slate-500 ml-1">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-1 shrink-0 ${isCurrentPlan ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Check className="size-4" />
                    </div>
                    <span className="text-base font-medium text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => void handleUpgrade(plan.id)}
                disabled={isCurrentPlan || upgradingPlan !== null}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrentPlan 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' 
                    : isUpgrading
                      ? 'bg-indigo-400 text-white cursor-not-allowed'
                      : plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                }`}
              >
                {isCurrentPlan ? (
                  <>Active Plan</>
                ) : isUpgrading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Zap className="size-4" /> Activate plan
                  </>
                )}
              </button>
            </div>
          );
        }) : (
          <div className="col-span-3 text-center py-12 text-slate-500 font-medium">No plans available at the moment.</div>
        )}
      </div>

    </div>
  );
}
