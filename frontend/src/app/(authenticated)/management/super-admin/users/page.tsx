




import React from 'react';
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const MoreVertical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;

import ClientSearch from './ClientSearch';
import ClientTabs from './ClientTabs';
const mockUsers = [
  { id: "USR-101", name: "Rahul Sharma", email: "rahul@example.com", type: "Patient", status: "Active", joined: "12 May 2026", location: "Delhi" },
  { id: "USR-102", name: "Dr. Arvind Gupta", email: "dr.gupta@medidoc.com", type: "Doctor", status: "Pending Verification", joined: "14 May 2026", location: "Mumbai" },
  { id: "USR-103", name: "City Care Hospital", email: "contact@citycare.com", type: "Hospital", status: "Active", joined: "01 Jan 2026", location: "Bangalore" },
  { id: "USR-104", name: "Apex Laboratories", email: "info@apexlabs.com", type: "Lab", status: "Active", joined: "15 Feb 2026", location: "Kolkata" },
  { id: "USR-105", name: "Sneha Verma", email: "sneha@example.com", type: "Patient", status: "Suspended", joined: "20 May 2026", location: "Delhi" },
  { id: "USR-106", name: "Dr. Priya Patel", email: "dr.priya@clinic.com", type: "Doctor", status: "Active", joined: "22 May 2026", location: "Pune" },
];
export default async function UserManagementPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q : "";
  const tab = typeof params?.tab === 'string' ? params.tab : "All Users";
  const tabs = ["All Users", "Patients", "Doctors", "Hospitals", "Labs", "Pending Verification"];
  const filteredUsers = mockUsers.filter(user => {
    const matchesTab = 
      tab === "All Users" || 
      (tab === "Pending Verification" && user.status === "Pending Verification") ||
      (tab.startsWith(user.type));
    const matchesSearch = user.name.toLowerCase().includes(q.toLowerCase()) || 
                          user.email.toLowerCase().includes(q.toLowerCase());
    return matchesTab && matchesSearch;
  });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          <ClientTabs tabs={tabs} />
          <ClientSearch />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">User Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Location</th>
                <th className="px-6 py-4 whitespace-nowrap">Joined Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{user.email} • {user.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 whitespace-nowrap">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                        <CheckCircle2 className="size-3" /> Active
                      </span>
                    ) : user.status === "Suspended" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                        <XCircle className="size-3" /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                        <AlertCircle className="size-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical className="size-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <AlertCircle className="size-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No users found matching your criteria.</p>
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
