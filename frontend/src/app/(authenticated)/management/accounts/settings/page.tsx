"use client";
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Bell = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>;
const Key = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path><path d="m21 2-9.6 9.6"></path><circle cx="7.5" cy="15.5" r="5.5"></circle></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const AlertTriangle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const Monitor = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>;
const Smartphone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>;
const Globe = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>;












import React, { useState } from 'react';
export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [loginSessions, setLoginSessions] = useState([
    { id: 1, device: "Windows • Chrome Browser", location: "Bengaluru, India • IP: 192.168.1.1", time: "Active Now", icon: Monitor, isActive: true },
    { id: 2, device: "iPhone 14 • Safari", location: "Mumbai, India • IP: 10.0.0.45", time: "Yesterday, 10:45 AM", icon: Smartphone, isActive: false },
    { id: 3, device: "Windows • Firefox", location: "Delhi, India • IP: 172.16.0.5", time: "12 Jun 2026, 04:30 PM", icon: Monitor, isActive: false }
  ]);
  const handleManage2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    alert(`Two-Factor Authentication is now ${!is2FAEnabled ? 'Enabled' : 'Disabled'}.`);
  };
  const handleSignOutOtherDevices = () => {
    setLoginSessions(loginSessions.filter(session => session.isActive));
    alert("Signed out of all other devices successfully.");
  };
  const handleSaveChanges = () => {
    alert("Changes saved successfully!");
  };
  return (
    <div className="p-8 max-w-5xl mx-auto w-full min-h-screen font-sans">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your profile, notifications, and security preferences.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                activeTab === "profile" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User className="size-4" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                activeTab === "notifications" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Bell className="size-4" />
              Notification Settings
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                activeTab === "security" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="size-4" />
              Security Settings
            </button>
          </nav>
        </div>
        {/* Settings Content */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Profile Settings</h3>
                <p className="text-sm text-slate-500 mt-1">Update your personal details and how others see you.</p>
              </div>
              <div className="space-y-8">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-5">
                    <div className="size-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                      AM
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                          <Upload className="size-4" />
                          Upload New
                        </button>
                        <button className="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Recommended: Square JPG, PNG. Max 2MB.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" defaultValue="Accounts Manager" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" defaultValue="accounts@medidoc.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Key className="size-4 text-indigo-500" /> Change Password
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* NOTIFICATION SETTINGS */}
          {activeTab === "notifications" && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Notification Settings</h3>
                <p className="text-sm text-slate-500 mt-1">Manage what alerts you receive and how you receive them.</p>
              </div>
              <div className="space-y-6">
                {/* Payment Alerts */}
                <div className="flex items-start justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Payment Alerts</h4>
                    <p className="text-xs text-slate-500 mt-1">Get notified whenever a payment is successfully received or fails.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 mt-1">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {/* Refund Alerts */}
                <div className="flex items-start justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Refund Alerts</h4>
                    <p className="text-xs text-slate-500 mt-1">Receive alerts when a refund request is initiated or processed.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 mt-1">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {/* Subscription Expiry Alerts */}
                <div className="flex items-start justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Subscription Expiry Alerts</h4>
                    <p className="text-xs text-slate-500 mt-1">Get alerts when hospital or lab subscriptions are about to expire or have expired.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 mt-1">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* SECURITY SETTINGS */}
          {activeTab === "security" && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
                <p className="text-sm text-slate-500 mt-1">Enhance your account security and review login activities.</p>
              </div>
              <div className="space-y-8">
                {/* 2FA */}
                <div className={`p-5 border ${is2FAEnabled ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'} rounded-2xl flex flex-col md:flex-row gap-5 justify-between md:items-center transition-colors`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        Two-Factor Authentication (2FA)
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${is2FAEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {is2FAEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">Your account is secured with an additional layer of security using an authenticator app.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleManage2FA}
                    className="shrink-0 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
                {/* Login History */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="size-4 text-indigo-500" /> Login History
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {loginSessions.map((session) => (
                        <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                              <session.icon className="size-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{session.device}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{session.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {session.isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="size-3" /> Active Now
                              </span>
                            ) : (
                              <p className="text-sm font-bold text-slate-700">{session.time}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {loginSessions.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">No login history available.</div>
                      )}
                    </div>
                  </div>
                  {loginSessions.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleSignOutOtherDevices}
                        className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        <AlertTriangle className="size-4" /> Sign out of all other devices
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              onClick={handleSaveChanges}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
