"use client";
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>;
const ChevronUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"></path></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;









import React, { useState, useEffect } from 'react';

export default function ClientAccountLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/management/accounts/billing')
      .then(res => res.json())
      .then(data => {
        setLedger(data.ledger || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load billing ledger", err);
        setLoading(false);
      });
  }, []);

  const filteredLedger = ledger.filter(client => 
    client.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleRow = (id: string) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search client name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Client Details</th>
                <th className="px-6 py-4">Total Billed</th>
                <th className="px-6 py-4">Total Paid</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4 text-right">Statement</th>
                <th className="px-6 py-4 text-center w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLedger.map((client) => (
                <React.Fragment key={client.id}>
                  <tr 
                    className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${expandedRow === client.id ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => toggleRow(client.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-indigo-600">{client.client}</div>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">{client.id} • {client.type}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {client.totalBilled}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {client.totalPaid}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-base ${client.outstanding === "₹0" ? "text-slate-400" : "text-rose-600"}`}>
                        {client.outstanding}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors ml-auto">
                        <Download className="size-3.5" /> Download
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                        {expandedRow === client.id ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === client.id && (
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <td colSpan={6} className="px-8 py-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="size-4 text-indigo-500" /> Payment History Ledger
                          </h4>
                          <div className="space-y-0">
                            {client.history.map((hist, i) => (
                              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{hist.desc}</p>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5">{hist.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-black ${hist.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{hist.amount}</p>
                                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">Bal: {hist.balance}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">No clients found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
