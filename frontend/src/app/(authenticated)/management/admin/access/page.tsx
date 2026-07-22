"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from "sonner";

// Inline SVGs to replace lucide-react (prevents import/runtime errors in Next.js)
const Shield = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const Edit2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const Key = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path><path d="m21 2-9.6 9.6"></path><circle cx="7.5" cy="15.5" r="5.5"></circle></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>;
const Activity = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;

const CreateRoleModal = dynamic(() => import('./AccessModals').then(mod => mod.CreateRoleModal), { ssr: false });

export default function AccessManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/management/admin/access/users");
        if (res.ok) setUsers(await res.json());
      } catch (error) {
        toast.error("Failed to fetch access data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNo, setNewPhoneNo] = useState("");
  const [newRoleAssign, setNewRoleAssign] = useState("Admin");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEditRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/management/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error("Failed");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Role updated successfully");
      setIsEditRoleModalOpen(false);
    } catch (e) {
      toast.error("Failed to update role");
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await fetch(`/api/management/admin/users/${userId}/password`, {
        method: "PUT"
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Password reset to 'password123' successfully");
      setIsResetPasswordModalOpen(false);
    } catch (e) {
      toast.error("Failed to reset password");
    }
  };

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    // Search Term
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tabs
    if (activeFilter === "All") return true;
    if (activeFilter === "Hospitals") return user.role?.toUpperCase().includes("HOSPITAL") || user.role?.toUpperCase().includes("CLINIC");
    if (activeFilter === "Labs") return user.role?.toUpperCase().includes("LAB");
    if (activeFilter === "Doctors") return user.role?.toUpperCase() === "DOCTOR";
    if (activeFilter === "Staff") return ["ADMIN", "SUPER_ADMIN", "SALES", "SUPPORT", "ACCOUNTS", "TECHNICIAN"].some(r => user.role?.toUpperCase().includes(r));
    if (activeFilter === "Active") return user.status === "Active";
    if (activeFilter === "Inactive") return user.status !== "Active";
    
    return true;
  });

  const getRoleBadge = (role: string) => {
    const r = (role || "").toUpperCase();
    if (r.includes('HOSPITAL') || r.includes('CLINIC')) return "bg-blue-50 text-blue-700 border-blue-200";
    if (r.includes('LAB')) return "bg-purple-50 text-purple-700 border-purple-200";
    if (r === 'DOCTOR') return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (r.includes('ADMIN')) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (r.includes('TECHNICIAN')) return "bg-orange-50 text-orange-700 border-orange-200";
    if (r.includes('ACCOUNT')) return "bg-teal-50 text-teal-700 border-teal-200";
    if (r.includes('SALE')) return "bg-amber-50 text-amber-700 border-amber-200";
    if (r.includes('SUPPORT')) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/management/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed");
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success("Status updated successfully");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User removed from access list");
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading access config...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full min-h-screen font-sans space-y-8 bg-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage organization and staff accounts securely.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <Shield className="size-4.5" />
          Add Staff Account
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 lg:pb-0 hide-scrollbar w-full lg:w-auto">
          {["All", "Hospitals", "Labs", "Doctors", "Staff", "Active", "Inactive"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeFilter === tab 
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Name, Email, Role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Name & Email</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{user.organization || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider border ${
                      user.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 font-medium">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"
                      >
                        <Eye className="size-4.5" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setIsEditRoleModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Role"
                      >
                        <Edit2 className="size-4.5" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setIsResetPasswordModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Reset Password"
                      >
                        <Key className="size-4.5" />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                        className={`p-2 text-slate-400 rounded-lg transition-colors ${user.status === 'Active' ? 'hover:text-rose-600 hover:bg-rose-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`} title="Toggle Status"
                      >
                        {user.status === 'Active' ? <XCircle className="size-4.5" /> : <CheckCircle2 className="size-4.5" />}
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this user?")) {
                            try {
                              const res = await fetch(`/api/management/admin/users/${user.id}`, { method: "DELETE" });
                              if (!res.ok) throw new Error("Failed");
                              handleDeleteUser(user.id);
                            } catch (e) {
                              toast.error("Failed to delete user");
                            }
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"
                      >
                        <Trash2 className="size-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search className="size-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-1">No accounts found</p>
                    <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col relative max-h-[90vh] overflow-y-auto">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center relative">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              >
                <XCircle className="size-5" />
              </button>
              
              <div className="size-20 bg-white rounded-full flex items-center justify-center text-3xl font-black text-blue-600 mx-auto shadow-lg shadow-black/10 ring-4 ring-white/20 mb-3">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
              <p className="text-blue-100 font-medium mt-1 text-sm flex items-center justify-center gap-1.5">
                <Shield className="size-4 opacity-80" /> {selectedUser.role}
              </p>
            </div>

            {/* Content Details */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <User className="size-3.5" /> Full Name
                  </div>
                  <p className="text-slate-900 font-semibold">{selectedUser.name}</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Mail className="size-3.5" /> Email Address
                  </div>
                  <p className="text-slate-900 font-semibold truncate" title={selectedUser.email}>{selectedUser.email}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Phone className="size-3.5" /> Phone Number
                  </div>
                  <p className="text-slate-900 font-semibold">{selectedUser.phone || 'N/A'}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Building2 className="size-3.5" /> Organization
                  </div>
                  <p className="text-slate-900 font-semibold">{selectedUser.organization || 'Platform Level'}</p>
                </div>
              </div>

              <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    <Activity className="size-3.5" /> Account Status
                  </div>
                  <p className="text-slate-900 font-medium text-sm">
                    {selectedUser.lastLogin ? `Last login: ${new Date(selectedUser.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                  </p>
                </div>
                <div>
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold tracking-wide border shadow-sm ${
                      selectedUser.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {selectedUser.status === 'Active' ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                      {selectedUser.status}
                    </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-bold transition-all shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Edit Role</h2>
            <p className="text-sm text-slate-500 mb-4">Change the role for <strong>{selectedUser.name}</strong></p>
            
            <select 
              id="editRoleSelect"
              defaultValue={selectedUser.role}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-6"
            >
              <option value="DOCTOR">DOCTOR</option>
              <option value="HOSPITAL">HOSPITAL</option>
              <option value="LAB">LAB</option>
              <option value="SALES">SALES</option>
              <option value="SUPPORT">SUPPORT</option>
              <option value="ACCOUNTS">ACCOUNTS</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
            </select>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsEditRoleModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const newRole = (document.getElementById('editRoleSelect') as HTMLSelectElement).value;
                  handleEditRole(selectedUser.id, newRole);
                }}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Reset Password</h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to reset the password for <strong>{selectedUser.name}</strong>? 
              <br/><br/>
              Their password will be temporarily set to <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded font-bold">password123</code>.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleResetPassword(selectedUser.id)}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold transition-colors"
              >
                Reset Password
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Role (Provision Account) Modal */}
      {isAddModalOpen && (
        <CreateRoleModal 
          isOpen={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen}
          newFullName={newFullName}
          setNewFullName={setNewFullName}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newPhoneNo={newPhoneNo}
          setNewPhoneNo={setNewPhoneNo}
          newRoleAssign={newRoleAssign}
          setNewRoleAssign={setNewRoleAssign}
          handleProvision={async () => {
            if (newFullName && newEmail) {
              try {
                const res = await fetch("/api/management/admin/access/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: newFullName, email: newEmail, phone: newPhoneNo, role: newRoleAssign })
                });
                if (!res.ok) throw new Error("Failed");
                
                toast.success("Account provisioned successfully!");
                // Refresh data
                fetch("/api/management/admin/access/users").then(r => r.json()).then(setUsers);
              } catch (e) {
                toast.error("Failed to provision account");
              }
            }
            setIsAddModalOpen(false);
            setNewFullName("");
            setNewEmail("");
            setNewPhoneNo("");
            setNewRoleAssign("Admin");
          }}
        />
      )}
    </div>
  );
}
