"use client";

import { useState } from 'react';

const Settings = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Shield = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

export default function GlobalSettingsClient() {
  const tabs = ["Platform Settings", "Roles & Permissions", "Security Settings", "Backup Management"];
  const [activeTab, setActiveTab] = useState("Platform Settings");
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleEditRole = (role: string) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
  };

  const renderContent = () => {
    switch(activeTab) {
      case "Platform Settings":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Platform Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Website Name</label>
                  <input type="text" defaultValue="Medidoc Platform" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Logo/Favicon URL</label>
                  <input type="text" defaultValue="/assets/logo.png" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Contact Details (Support Email)</label>
                  <input type="email" defaultValue="support@medidoc.com" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-1.5 md:col-span-2 flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-rose-800">Maintenance Mode</h4>
                    <p className="text-xs text-rose-600 mt-0.5">Disable access to the platform for all non-admin users.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rose-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>
              <div className="pt-4 text-right">
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">Save Settings</button>
              </div>
            </div>
          </div>
        );
      case "Roles & Permissions":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Roles & Permissions</h3>
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-700">Admin Roles</h4>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Add New Role</button>
                </div>
                <div className="p-4 space-y-3">
                  {['Super Admin', 'Financial Admin', 'Support Admin'].map(role => (
                    <div key={role} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <span className="text-sm font-bold text-slate-800">{role}</span>
                      <button onClick={() => handleEditRole(role)} className="text-xs font-bold text-slate-500 hover:text-indigo-600">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-700">Permission Assignment & Access Control</h4>
                <p className="text-xs text-slate-500">Configure which roles have access to specific modules (e.g., Facility Management, Billing, Reports).</p>
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">Open Permission Matrix</button>
              </div>
            </div>
          </div>
        );
      case "Security Settings":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-700">Password Policy</h4>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="complex-pwd" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="complex-pwd" className="text-sm text-slate-600 font-medium">Require uppercase, number, and special character</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pwd-expiry" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="pwd-expiry" className="text-sm text-slate-600 font-medium">Force password change every 90 days</label>
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-500">Require all admins to use 2FA for login.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-slate-100 pt-6 max-w-xs">
                <label className="text-sm font-bold text-slate-700">Session Timeout (Minutes)</label>
                <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>
              <div className="pt-4 text-right">
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">Save Security Settings</button>
              </div>
            </div>
          </div>
        );
      case "Backup Management":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Backup Management</h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl gap-4">
                <div>
                  <h4 className="text-sm font-bold text-indigo-900">Manual Backup</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">Trigger an immediate database and file system backup.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">Run Backup Now</button>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">Backup History & Restore</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {[
                    { date: '22 Jun 2026, 02:00 AM', type: 'Automated', size: '2.4 GB' },
                    { date: '21 Jun 2026, 02:00 AM', type: 'Automated', size: '2.3 GB' },
                    { date: '20 Jun 2026, 11:45 AM', type: 'Manual', size: '2.3 GB' }
                  ].map((backup, idx) => (
                    <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{backup.date}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{backup.type} Backup • {backup.size}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg">Download</button>
                        <button className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors px-3 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg">Restore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-indigo-50 text-indigo-700 border-indigo-100 border" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 min-h-[400px]">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Edit Permissions Modal */}
      {isPermissionsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Permissions</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Modify access for {selectedRole}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPermissionsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {[
                  { title: "User Management", desc: "Manage Patients, Doctors, Staff", checked: true },
                  { title: "Facility Management", desc: "Manage Hospitals, Labs", checked: true },
                  { title: "Subscriptions & Billing", desc: "Manage Plans and Revenue", checked: selectedRole === 'Super Admin' || selectedRole === 'Financial Admin' },
                  { title: "Reports Monitoring", desc: "View Global Reports", checked: selectedRole === 'Super Admin' },
                  { title: "System Audit Logs", desc: "View Security and Activity Logs", checked: selectedRole === 'Super Admin' },
                  { title: "Global Settings", desc: "System Configuration", checked: selectedRole === 'Super Admin' },
                ].map((perm, idx) => (
                  <label key={idx} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${perm.checked ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        defaultChecked={perm.checked}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${perm.checked ? 'text-indigo-900' : 'text-slate-700'}`}>{perm.title}</div>
                      <div className={`text-xs mt-0.5 ${perm.checked ? 'text-indigo-700' : 'text-slate-500'}`}>{perm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsPermissionsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsPermissionsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
