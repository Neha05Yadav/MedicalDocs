"use client";

import { useState } from "react";
import { 
  CreditCard, Search, FileText, Download, 
  IndianRupee, Plus, CheckCircle2, AlertCircle, Calendar, Receipt, User
} from "lucide-react";

const mockPatients = [
  { id: "P-10234", name: "Rahul Sharma", mobile: "98XXXXX12" },
  { id: "P-8845", name: "Elena Rodriguez", mobile: "98XXXXX11" },
];

const mockHistory = [
  { id: "INV-2026-001", patient: "Rahul Sharma", date: "12 Jun 2026", amount: 1500, status: "Paid", items: "Consultation + Blood Test" },
  { id: "INV-2026-002", patient: "Marcus Chen", date: "11 Jun 2026", amount: 850, status: "Pending", items: "Consultation" },
  { id: "INV-2026-003", patient: "Elena Rodriguez", date: "10 Jun 2026", amount: 3200, status: "Paid", items: "Consultation + MRI Scan" },
  { id: "INV-2026-004", patient: "Aisha Khan", date: "09 Jun 2026", amount: 1200, status: "Paid", items: "Consultation + X-Ray" },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");
  
  // Bill Generation State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [consultationFee, setConsultationFee] = useState<number | "">("");
  const [testFee, setTestFee] = useState<number | "">("");
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">("Pending");

  const totalAmount = (Number(consultationFee) || 0) + (Number(testFee) || 0);

  const handleGenerateBill = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Bill generated for ₹${totalAmount} (${paymentStatus})`);
    // Reset form
    setSelectedPatientId("");
    setConsultationFee("");
    setTestFee("");
    setPaymentStatus("Pending");
    setActiveTab("history");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Billing & Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Manage patient invoices, payments, and billing history.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit mb-8 border border-slate-200/60">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "generate" ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Receipt className="size-4" />
          Generate Bill
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "history" ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <CreditCard className="size-4" />
          Payment History
        </button>
      </div>

      {activeTab === "generate" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generate Bill Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
               <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                 <Plus className="size-5" />
               </div>
               <div>
                 <h2 className="text-lg font-semibold text-slate-900">Create New Invoice</h2>
                 <p className="text-sm text-slate-500">Enter billing details below.</p>
               </div>
            </div>
            <form onSubmit={handleGenerateBill} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Patient *</label>
                <select 
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 bg-white"
                >
                  <option value="" disabled>Select a patient</option>
                  {mockPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Bill Items</h3>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Consultation Fee (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="number" 
                        min="0"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value ? Number(e.target.value) : "")}
                        placeholder="0.00"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Tests / Procedures Fee (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="number" 
                        min="0"
                        value={testFee}
                        onChange={(e) => setTestFee(e.target.value ? Number(e.target.value) : "")}
                        placeholder="0.00"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-3">Initial Payment Status</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentStatus === "Paid" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="Paid"
                      checked={paymentStatus === "Paid"}
                      onChange={() => setPaymentStatus("Paid")}
                      className="hidden" 
                    />
                    <CheckCircle2 className="size-4" />
                    <span className="font-medium text-sm">Paid</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                    paymentStatus === "Pending" ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="Pending"
                      checked={paymentStatus === "Pending"}
                      onChange={() => setPaymentStatus("Pending")}
                      className="hidden" 
                    />
                    <AlertCircle className="size-4" />
                    <span className="font-medium text-sm">Pending</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900 flex items-center"><IndianRupee className="size-5 mr-1"/>{totalAmount.toFixed(2)}</p>
                </div>
                <button 
                  type="submit" 
                  disabled={!selectedPatientId || totalAmount === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Receipt className="size-4" /> Generate Invoice
                </button>
              </div>

            </form>
          </div>

          {/* Invoice Preview */}
          <div className="bg-slate-100/50 rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
             <FileText className="size-16 text-slate-300 mb-4" />
             <h3 className="text-lg font-semibold text-slate-700 mb-2">Invoice Preview</h3>
             <p className="text-sm text-slate-500 max-w-sm mb-6">
               Fill out the bill details on the left. The total amount and payment status will be updated automatically.
             </p>
             {totalAmount > 0 && selectedPatientId && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-sm text-left">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                     <p className="font-bold text-slate-900">MediDoc Hospital</p>
                     <p className="text-xs text-slate-500">Invoice #INV-PREVIEW</p>
                   </div>
                   <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                     paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                   }`}>
                     {paymentStatus}
                   </span>
                 </div>
                 <div className="space-y-2 mb-6 border-y border-slate-100 py-4">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-600">Consultation</span>
                     <span className="font-medium">₹{Number(consultationFee) || 0}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-600">Tests/Procedures</span>
                     <span className="font-medium">₹{Number(testFee) || 0}</span>
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="font-semibold text-slate-900">Total</span>
                   <span className="text-lg font-bold text-blue-600">₹{totalAmount}</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoices or patients..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 font-medium border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-3 px-4 font-semibold rounded-tl-lg">Invoice ID</th>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockHistory.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-blue-600">{invoice.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="size-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                          {invoice.patient.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{invoice.patient}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600"><div className="flex items-center gap-1.5"><Calendar className="size-3.5" />{invoice.date}</div></td>
                    <td className="py-4 px-4 text-slate-600 truncate max-w-[150px]" title={invoice.items}>{invoice.items}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">₹{invoice.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        invoice.status === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download Invoice">
                        <Download className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
