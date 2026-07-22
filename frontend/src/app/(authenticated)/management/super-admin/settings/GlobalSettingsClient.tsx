"use client";

import { useState, useEffect } from 'react';
import { toast } from "sonner";

const Shield = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

const AVAILABLE_PERMISSIONS = [
  { id: 'users', title: "User Management", desc: "Manage Patients, Doctors, Staff" },
  { id: 'facilities', title: "Facility Management", desc: "Verify Hospitals and Labs" },
  { id: 'billing', title: "Subscriptions & Billing", desc: "Manage Plans and Revenue" },
  { id: 'reports', title: "Platform Analytics", desc: "View Global Growth Metrics" },
  { id: 'audit', title: "System Audit Logs", desc: "View Security and Activity Logs" },
  { id: 'settings', title: "Global Settings", desc: "System Configuration" },
];

export default function GlobalSettingsClient() {
  const tabs = ["Platform Settings", "Roles & Permissions", "Security Settings"];
  const [activeTab, setActiveTab] = useState("Platform Settings");
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Settings State
  const [settings, setSettings] = useState({
    website_name: "",
    logo_url: "",
    support_email: "",
    maintenance_mode: false,
    require_complex_password: true,
    password_expiry_days: 90,
    require_2fa: true,
    session_timeout_minutes: 30,
  });

  // Correct Data for Roles & Permissions
  const [roles, setRoles] = useState<Record<string, string[]>>({
    'Super Admin': ['users', 'facilities', 'billing', 'reports', 'audit', 'settings'],
    'Support Admin': ['users', 'facilities'],
    'Billing Admin': ['billing', 'reports'],
    'Compliance Officer': ['facilities', 'audit']
  });
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/management/super-admin/settings');
      const data = await res.json();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    const loadingToast = toast.loading("Saving settings...");
    try {
      const res = await fetch('/api/management/super-admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success("Settings saved successfully!", { id: loadingToast });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to save settings", { id: loadingToast });
    }
  };

  const handleEditRole = (role: string) => {
    if (role === 'Super Admin') {
      toast.info("Super Admin permissions cannot be modified.");
      return;
    }
    setSelectedRole(role);
    setTempPermissions([...roles[role]]);
    setIsPermissionsModalOpen(true);
  };

  const togglePermission = (permId: string) => {
    setTempPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSavePermissions = () => {
    setRoles(prev => ({
      ...prev,
      [selectedRole]: tempPermissions
    }));
    setIsPermissionsModalOpen(false);
    toast.success(`${selectedRole} permissions updated!`);
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl md:col-span-2"></div>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case "Platform Settings":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Platform Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Website Name</label>
                  <input 
                    type="text" 
                    value={settings.website_name}
                    onChange={(e) => updateSetting('website_name', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Logo/Favicon URL</label>
                  <input 
                    type="text" 
                    value={settings.logo_url}
                    onChange={(e) => updateSetting('logo_url', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Contact Details (Support Email)</label>
                  <input 
                    type="email" 
                    value={settings.support_email}
                    onChange={(e) => updateSetting('support_email', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2 flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-rose-800">Maintenance Mode</h4>
                    <p className="text-xs text-rose-600 mt-0.5">Disable access to the platform for all non-admin users.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.maintenance_mode}
                      onChange={(e) => updateSetting('maintenance_mode', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rose-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>
              <div className="pt-4 text-right">
                <button 
                  onClick={handleSaveSettings}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Save Settings
                </button>
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
                  {Object.keys(roles).map(role => (
                    <div key={role} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">{role}</span>
                        <span className="text-xs text-slate-500 font-medium">{roles[role].length} permissions assigned</span>
                      </div>
                      <button 
                        onClick={() => handleEditRole(role)} 
                        className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        {role === 'Super Admin' ? 'View Only' : 'Edit'}
                      </button>
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
                  <input 
                    type="checkbox" 
                    id="complex-pwd" 
                    checked={settings.require_complex_password}
                    onChange={(e) => updateSetting('require_complex_password', e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                  <label htmlFor="complex-pwd" className="text-sm text-slate-600 font-medium cursor-pointer">Require uppercase, number, and special character</label>
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor="pwd-expiry" className="text-sm text-slate-600 font-medium flex items-center gap-2">
                    Force password change every
                    <input 
                      type="number" 
                      value={settings.password_expiry_days}
                      onChange={(e) => updateSetting('password_expiry_days', parseInt(e.target.value) || 90)}
                      className="w-16 px-2 py-1 border border-slate-200 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                    days
                  </label>
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-500">Require all admins to use 2FA for login.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.require_2fa}
                      onChange={(e) => updateSetting('require_2fa', e.target.checked)} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-slate-100 pt-6 max-w-xs">
                <label className="text-sm font-bold text-slate-700">Session Timeout (Minutes)</label>
                <input 
                  type="number" 
                  value={settings.session_timeout_minutes}
                  onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value) || 30)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                />
              </div>
              <div className="pt-4 text-right">
                <button 
                  onClick={handleSaveSettings}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Save Security Settings
                </button>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
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
                {AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = tempPermissions.includes(perm.id);
                  return (
                    <label 
                      key={perm.id} 
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isChecked ? 'text-indigo-900' : 'text-slate-700'}`}>{perm.title}</div>
                        <div className={`text-xs mt-0.5 ${isChecked ? 'text-indigo-700' : 'text-slate-500'}`}>{perm.desc}</div>
                      </div>
                    </label>
                  );
                })}
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
                onClick={handleSavePermissions}
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
