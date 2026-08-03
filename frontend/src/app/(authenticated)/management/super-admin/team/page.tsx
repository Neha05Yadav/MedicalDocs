"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner"; 

// Inline SVGs to replace lucide-react (prevents import/runtime errors in Next.js)
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const Power = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const UserPlus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const History = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;
const Download = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const Filter = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

export default function AdminManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  
  // Selected Admins state
  const [selectedAdminForLogs, setSelectedAdminForLogs] = useState<any>(null);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // New Team Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', role: '', password: '', confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formatDateTime = (value: unknown, fallback = 'Not recorded') => {
    if (!value) return fallback;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/management/super-admin/team', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Team request failed (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAdmins(data);
      } else {
        console.error("API returned error or non-array:", data);
        setAdmins([]);
        // Optional: show a toast only if we really want to warn them
        // toast.error(data.message || "Failed to fetch admins");
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to fetch admins from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/management/super-admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Team member added successfully!");
        setAdmins([data.admin, ...admins]); // Prepend new admin
        setIsAddModalOpen(false);
        setFormData({ fullName: '', email: '', phone: '', role: '', password: '', confirmPassword: '' });
      } else {
        toast.error(data.error || "Failed to add team member");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReject = async (adminId: string, action: string) => {
    const previousAdmins = [...admins];
    if (action === 'Rejected') {
       setAdmins(admins.filter(admin => admin.id !== adminId));
    } else {
       setAdmins(admins.map(admin => admin.id === adminId ? { ...admin, status: action } : admin));
    }
    
    try {
      const res = await fetch('/api/management/super-admin/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adminId, status: action })
      });
      
      if (res.ok) {
        toast.success(`Admin request ${action === 'Active' ? 'approved' : 'rejected'}.`);
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      setAdmins(previousAdmins);
      toast.error(`Failed to ${action === 'Active' ? 'approve' : 'reject'} request.`);
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    
    // Optimistic UI update
    setAdmins(admins.map(admin => admin.id === adminId ? { ...admin, status: newStatus } : admin));
    
    try {
      const res = await fetch('/api/management/super-admin/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adminId, status: newStatus })
      });
      
      if (res.ok) {
        toast.success(`Admin access ${newStatus === 'Active' ? 'restored' : 'suspended'}.`);
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      // Revert on failure
      setAdmins(admins.map(admin => admin.id === adminId ? { ...admin, status: currentStatus } : admin));
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this admin? This action cannot be undone.")) return;
    
    // Optimistic UI update
    const previousAdmins = [...admins];
    setAdmins(admins.filter(admin => admin.id !== adminId));
    
    try {
      const res = await fetch(`/api/management/super-admin/team?id=${adminId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Admin deleted successfully.");
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      // Revert on failure
      setAdmins(previousAdmins);
      toast.error("Failed to delete admin.");
    }
  };

  const openLogs = async (admin: any) => {
    setSelectedAdminForLogs(admin);
    setIsLogsModalOpen(true);
    setLogsLoading(true);
    
    try {
      const res = await fetch(`/api/management/super-admin/team/logs?id=${admin.id}`);
      if (!res.ok) throw new Error("API returned an error");
      const data = await res.json();
      setAdminLogs(data.logs || []);
    } catch (error) {
      toast.error("Failed to load activity logs.");
      setAdminLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredAdmins.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const headers = ["ID,Name,Email,Role,Status,Last Login"];
    const csvData = filteredAdmins.map(admin => 
      `${admin.id},"${admin.name}","${admin.email}","${admin.role}","${admin.status}","${admin.lastLogin}"`
    );
    
    const csvContent = headers.concat(csvData).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medidoc_team_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Data exported successfully!");
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = (admin.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (admin.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || admin.role === roleFilter;
    const matchesStatus = statusFilter === "" || admin.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Add New Team
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search admins by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto ml-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-40 pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Accounts Manager">Accounts Manager</option>
              <option value="Support Team">Support Team</option>
            </select>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-white cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
      
      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Admin Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium animate-pulse">Loading team members...</td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No members found matching your criteria.</td></tr>
              ) : filteredAdmins.map(admin => (
                <tr key={admin.id} className={`hover:bg-slate-50/50 transition-colors group ${admin.status === 'Inactive' ? 'opacity-70' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{admin.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="size-3" /> Active
                      </span>
                    ) : admin.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                        <History className="size-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                        <XCircle className="size-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500 text-xs">
                    {formatDateTime(admin.lastLogin, 'Never')}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-1.5">
                    {admin.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleApproveReject(admin.id, 'Active')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve Request"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveReject(admin.id, 'Rejected')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject Request"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(admin.id, admin.status)}
                        className={`p-2 rounded-lg transition-colors ${admin.status === 'Active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                        title={admin.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                      >
                        <Power className="size-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => openLogs(admin)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="View Activity Logs"
                    >
                      <History className="size-4" />
                    </button>

                    <button 
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                      title="Delete Admin"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Activity Logs Modal */}
      {isLogsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <History className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Activity Logs</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Audit trail for {selectedAdminForLogs?.name}</p>
                </div>
              </div>
              <button onClick={() => setIsLogsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/50">
              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <h4 className="text-sm font-extrabold text-slate-900">Team member information</h4>
                </div>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
                  {[
                    ['Full Name', selectedAdminForLogs?.name || 'Not recorded'],
                    ['Email', selectedAdminForLogs?.email || 'Not recorded'],
                    ['Role', selectedAdminForLogs?.role || 'Not recorded'],
                    ['Status', selectedAdminForLogs?.status || 'Not recorded'],
                    ['Last Login', formatDateTime(selectedAdminForLogs?.lastLogin, 'Never')],
                    ['Created By', selectedAdminForLogs?.createdBy || 'Not recorded'],
                    ['Created Date', formatDateTime(selectedAdminForLogs?.createdAt)],
                  ].map(([label, value]) => (
                    <div key={label} className={label === 'Email' ? 'sm:col-span-2' : ''}>
                      <dt className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</dt>
                      <dd className="mt-1 break-words text-sm font-bold text-slate-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {logsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <span className="text-sm font-medium text-slate-500">Loading audit trail...</span>
                </div>
              ) : adminLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm font-medium">No recent activity found.</div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {adminLogs.map((log, index) => (
                    <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-sm">{log.action}</span>
                        </div>
                        <div className="flex flex-col text-xs text-slate-500 font-medium">
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="text-[10px] mt-1 text-slate-400">IP: {log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end border-t border-slate-100 bg-white px-6 py-4">
              <button onClick={() => setIsLogsModalOpen(false)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal (Existing logic) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Team</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Create a new system administrator account</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddTeam}>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Password</label>
                    <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                    <input type="password" required minLength={6} value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Role</label>
                    <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium bg-white text-slate-700 cursor-pointer">
                      <option value="">Select a role...</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Accounts Manager">Accounts Manager</option>
                      <option value="Support Team">Support Team</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50">
                  {isSubmitting ? "Adding..." : "Add Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
