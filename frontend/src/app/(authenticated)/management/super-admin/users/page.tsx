"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

// Inline SVGs to replace lucide-react (prevents import/runtime errors in Next.js)
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;
const XCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const Power = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const Check = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const FileCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ChevronLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Users");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const tabs = ["All Users", "Patients", "Doctors", "Pending Verification"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/management/super-admin/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        toast.error(data.error || "Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (userId: string, action: string) => {
    const previousUsers = [...users];
    
    // Optimistic Update
    if (action === 'Rejected') {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      setUsers(users.map(u => u.id === userId ? { ...u, status: action, isVerified: action === 'Active' } : u));
    }

    try {
      const res = await fetch('/api/management/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: action, isVerified: action === 'Active' })
      });
      if (res.ok) {
        toast.success(`User ${action === 'Active' ? 'approved' : 'rejected'} successfully.`);
      } else throw new Error();
    } catch (error) {
      setUsers(previousUsers);
      toast.error(`Failed to ${action === 'Active' ? 'approve' : 'reject'} user.`);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const previousUsers = [...users];
    
    // Optimistic Update
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));

    try {
      const res = await fetch('/api/management/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: newStatus })
      });
      if (res.ok) {
        toast.success(`User access ${newStatus === 'Active' ? 'restored' : 'suspended'}.`);
      } else throw new Error();
    } catch (error) {
      setUsers(previousUsers);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user completely?")) return;

    const previousUsers = [...users];
    setUsers(users.filter(u => u.id !== userId));

    try {
      const res = await fetch(`/api/management/super-admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("User deleted successfully.");
      } else throw new Error();
    } catch (error) {
      setUsers(previousUsers);
      toast.error("Failed to delete user.");
    }
  };

  const handleVerify = async (userId: string) => {
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, isVerified: true, status: 'Active' } : u));
    
    try {
      const res = await fetch('/api/management/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isVerified: true, status: 'Active' })
      });
      if (res.ok) {
        toast.success("User verified and activated successfully.");
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isVerified: true, status: 'Active' });
        }
      } else throw new Error();
    } catch (error) {
      setUsers(previousUsers);
      toast.error("Failed to verify user.");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = 
      activeTab === "All Users" || 
      (activeTab === "Pending Verification" && user.status === "Pending") ||
      (activeTab.startsWith(user.type));
      
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Manage individual platform users including patients and doctors.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col xl:flex-row gap-4 justify-between items-center">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search all users globally..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium animate-pulse">
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? currentUsers.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors group ${user.status === 'Inactive' || user.status === 'Suspended' ? 'opacity-70' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{user.email} • {user.id?.slice(0,8)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap text-xs">
                    {user.location}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap text-xs">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                        <CheckCircle2 className="size-3" /> Active
                      </span>
                    ) : user.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                        <AlertCircle className="size-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                        <XCircle className="size-3" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-1.5">
                    <button 
                      onClick={() => { setSelectedUser(user); setIsProfileModalOpen(true); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <Eye className="size-4" />
                    </button>
                    {user.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleApproveReject(user.id, 'Active')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve User"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveReject(user.id, 'Rejected')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject User"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`p-2 rounded-lg transition-colors ${user.status === 'Active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                        title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      >
                        <Power className="size-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                      title="Delete User"
                    >
                      <Trash2 className="size-4" />
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-900">{filteredUsers.length}</span> users
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <ChevronLeft className="size-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile & Verification Modal */}
      {isProfileModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <User className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedUser.name}
                    {selectedUser.isVerified && <ShieldCheck className="size-5 text-emerald-500" />}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedUser.id?.slice(0,8)}... • {selectedUser.type}</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="size-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Info</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedUser.phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Account Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedUser.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">Joined: {selectedUser.joined}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC & Documents (Only for Doctors/Hospitals/Labs) */}
              {selectedUser.type !== 'Patient' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">KYC & Documents</h4>
                  {selectedUser.documents && selectedUser.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedUser.documents.map((doc: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                          <div className="flex items-center gap-3">
                            <FileCheck className="size-5 text-indigo-500" />
                            <span className="text-sm font-bold text-slate-700">{doc}</span>
                          </div>
                          <button className="text-xs font-bold text-blue-600 hover:underline">View</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-sm font-medium text-slate-500">
                      No documents uploaded yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Close</button>
              
              {!selectedUser.isVerified && selectedUser.type !== 'Patient' && (
                <button 
                  onClick={() => handleVerify(selectedUser.id)} 
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="size-4" />
                  Verify Documents & Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
