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
const HospitalIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>;
const FlaskConical = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a2 2 0 0 0 1.8 2.95h10.96a2 2 0 0 0 1.8-2.95L14.21 10.42a2 2 0 0 1-.21-.896V2"/><path d="M8.5 2h7"/><path d="M14 16.5 9 11"/></svg>;
const Plus = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

export default function FacilityManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Facilities");
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [facilityDetailsLoading, setFacilityDetailsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({ name: '', email: '', phone: '', address: '', licenseNumber: '' });

  const tabs = ["All Facilities", "Hospitals", "Labs", "Pharmacies", "Pending Approvals", "Suspended"];

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/management/super-admin/facilities', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFacilities(data);
      } else {
        toast.error(data.error || "Failed to fetch facilities");
        setFacilities([]);
      }
    } catch (error) {
      toast.error("Failed to fetch facilities");
    } finally {
      setLoading(false);
    }
  };

  const openFacilityProfile = async (facility: any) => {
    setSelectedFacility(facility);
    setIsProfileModalOpen(true);
    setFacilityDetailsLoading(true);
    try {
      const response = await fetch(`/api/management/super-admin/facilities/${encodeURIComponent(facility.id)}`);
      const details = await response.json().catch(() => null);
      if (!response.ok) throw new Error(details?.message || 'Facility details could not be loaded');
      setSelectedFacility({
        ...facility,
        ...details,
        type: facility.type,
        location: details.address || facility.location,
        joined: facility.joined,
      });
    } catch (error: any) {
      toast.error(error?.message || 'Facility details could not be loaded');
    } finally {
      setFacilityDetailsLoading(false);
    }
  };

  const createHospital = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/management/super-admin/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospitalForm),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Failed to add hospital');
      toast.success('Hospital added successfully.');
      setHospitalForm({ name: '', email: '', phone: '', address: '', licenseNumber: '' });
      setIsAddModalOpen(false);
      setActiveTab('Hospitals');
      await fetchFacilities();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add hospital');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveReject = async (facilityId: string, action: string) => {
    const previous = [...facilities];
    
    // Optimistic Update
    if (action === 'Rejected') {
      setFacilities(facilities.filter(f => f.id !== facilityId));
    } else {
      setFacilities(facilities.map(f => f.id === facilityId ? { ...f, status: action, isVerified: true } : f));
    }

    try {
      const res = await fetch('/api/management/super-admin/facilities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: facilityId, status: action, isVerified: action === 'Active' })
      });
      if (res.ok) {
        toast.success(`Facility ${action === 'Active' ? 'approved' : 'rejected'} successfully.`);
      } else throw new Error();
    } catch (error) {
      setFacilities(previous);
      toast.error(`Failed to ${action === 'Active' ? 'approve' : 'reject'} facility.`);
    }
  };

  const handleVerify = async (facilityId: string) => {
    const previous = [...facilities];
    setFacilities(facilities.map(f => f.id === facilityId ? { ...f, isVerified: true, status: 'Active' } : f));
    
    try {
      const res = await fetch('/api/management/super-admin/facilities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: facilityId, isVerified: true, status: 'Active' })
      });
      if (res.ok) {
        toast.success("Facility verified and activated successfully.");
        if (selectedFacility?.id === facilityId) {
          setSelectedFacility({ ...selectedFacility, isVerified: true, status: 'Active' });
        }
      } else throw new Error();
    } catch (error) {
      setFacilities(previous);
      toast.error("Failed to verify facility.");
    }
  };

  const handleToggleStatus = async (facilityId: string, currentStatus: string) => {
    const normalizedStatus = String(currentStatus || '').trim().toUpperCase();
    const newStatus = normalizedStatus === "SUSPENDED" || normalizedStatus === "INACTIVE" ? "Active" : "Suspended";
    const previous = [...facilities];
    
    // Optimistic Update
    setFacilities(facilities.map(f => f.id === facilityId ? { ...f, status: newStatus } : f));

    try {
      const res = await fetch('/api/management/super-admin/facilities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: facilityId, status: newStatus })
      });
      if (res.ok) {
        toast.success(`Facility access ${newStatus === 'Active' ? 'restored' : 'suspended'}.`);
      } else throw new Error();
    } catch (error) {
      setFacilities(previous);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (facilityId: string) => {
    if (!window.confirm("Are you sure you want to delete this facility completely?")) return;

    const previous = [...facilities];
    setFacilities(facilities.filter(f => f.id !== facilityId));

    try {
      const res = await fetch(`/api/management/super-admin/facilities?id=${facilityId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Facility deleted successfully.");
      } else throw new Error();
    } catch (error) {
      setFacilities(previous);
      toast.error("Failed to delete facility.");
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const facilityType = String(facility.type || '').trim().toUpperCase();
    const facilityStatus = String(facility.status || '').trim().toUpperCase();
    let matchesTab: boolean;

    switch (activeTab) {
      case "Hospitals":
        matchesTab = facilityType === "HOSPITAL";
        break;
      case "Labs":
        matchesTab = facilityType === "LAB" || facilityType === "LABS" || facilityType === "LABORATORY";
        break;
      case "Pharmacies":
        matchesTab = facilityType === "PHARMACY";
        break;
      case "Pending Approvals":
        matchesTab = facilityStatus === "PENDING";
        break;
      case "Suspended":
        matchesTab = facilityStatus === "SUSPENDED" || facilityStatus === "INACTIVE";
        break;
      case "All Facilities":
      default:
        matchesTab = true;
        break;
    }
    
    const matchesSearch = (facility.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (facility.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen font-sans space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700">
          <Plus className="size-4" /> Add Hospital
        </button>
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
            placeholder="Search facilities..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="w-[23%] px-4 py-4">Facility</th>
                <th className="w-[10%] px-3 py-4">Type</th>
                <th className="w-[29%] px-3 py-4">Location</th>
                <th className="hidden w-[12%] px-3 py-4 xl:table-cell">Registered</th>
                <th className="w-[11%] px-3 py-4">Status</th>
                <th className="w-[17%] px-3 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium animate-pulse">
                    Loading facilities...
                  </td>
                </tr>
              ) : filteredFacilities.length > 0 ? filteredFacilities.map(facility => (
                <tr key={facility.id} className={`hover:bg-slate-50/50 transition-colors group ${facility.status === 'Suspended' || facility.status === 'Inactive' ? 'opacity-70' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`shrink-0 p-2 rounded-lg ${facility.type === 'Hospital' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                        {facility.type === 'Hospital' ? <HospitalIcon className="size-4" /> : <FlaskConical className="size-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{facility.name}</div>
                        <div className="truncate text-xs font-medium text-slate-500">{facility.email}</div>
                        <div className="mt-0.5 truncate text-[10px] font-medium text-slate-400 xl:hidden">{facility.joined} • {facility.id?.slice(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-slate-100 text-slate-600 whitespace-nowrap border border-slate-200">
                      {facility.type}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-xs font-medium leading-5 text-slate-600">
                    {facility.location}
                  </td>
                  <td className="hidden px-3 py-4 text-xs font-medium text-slate-600 xl:table-cell">
                    {facility.joined}
                  </td>
                  <td className="px-3 py-4">
                    {facility.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                        <CheckCircle2 className="size-3" /> Active
                      </span>
                    ) : facility.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                        <AlertCircle className="size-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                        <XCircle className="size-3" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap justify-end gap-1">
                    <button
                      onClick={() => void openFacilityProfile(facility)}
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-indigo-500 transition-colors hover:bg-indigo-50"
                      title="View Details"
                    >
                      <Eye className="size-4" />
                    </button>
                    {facility.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleApproveReject(facility.id, 'Active')}
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
                          title="Approve"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleApproveReject(facility.id, 'Rejected')}
                          className="grid size-8 shrink-0 place-items-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                          title="Reject"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    )}
                    {(facility.status !== 'Pending' || String(facility.type).trim().toUpperCase() === 'PHARMACY') && (
                      <button 
                        onClick={() => handleToggleStatus(facility.id, facility.status)}
                        className={`grid size-8 shrink-0 place-items-center rounded-lg transition-colors ${facility.status === 'Suspended' || facility.status === 'Inactive' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                        title={facility.status === 'Suspended' || facility.status === 'Inactive' ? 'Restore Facility Access' : 'Suspend Facility Access'}
                        aria-label={facility.status === 'Suspended' || facility.status === 'Inactive' ? 'Restore facility access' : 'Suspend facility access'}
                      >
                        <Power className="size-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(facility.id)}
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                      title="Delete Facility"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <HospitalIcon className="size-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No facilities found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Add Hospital</h2>
                <p className="mt-1 text-sm text-slate-500">Create the hospital workspace and its login account.</p>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="size-5" /></button>
            </div>
            <form onSubmit={createHospital} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ['name', 'Hospital name', 'text'],
                ['email', 'Admin email', 'email'],
                ['phone', 'Phone number', 'tel'],
                ['licenseNumber', 'License number', 'text'],
              ].map(([key, label, type]) => (
                <label key={key} className="space-y-1.5 text-sm font-bold text-slate-700">
                  <span>{label}</span>
                  <input required={key !== 'licenseNumber'} type={type} value={(hospitalForm as any)[key]} onChange={event => setHospitalForm(current => ({ ...current, [key]: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-indigo-500" />
                </label>
              ))}
              <label className="space-y-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Address</span>
                <textarea required rows={3} value={hospitalForm.address} onChange={event => setHospitalForm(current => ({ ...current, address: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-indigo-500" />
              </label>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button>
                <button disabled={saving} type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Adding...' : 'Add Hospital'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & Verification Modal */}
      {isProfileModalOpen && selectedFacility && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-7 py-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  {selectedFacility.type === 'Hospital' ? <HospitalIcon className="size-6" /> : <FlaskConical className="size-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedFacility.name}
                    {selectedFacility.isVerified && <ShieldCheck className="size-5 text-emerald-500" />}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedFacility.id?.slice(0,8)}... • {selectedFacility.type}</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="size-6" />
              </button>
            </div>
            
            <div className="grid gap-6 overflow-y-auto bg-slate-50/70 p-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
              {/* Contact & Legal */}
              <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 lg:col-start-1 lg:row-start-1 lg:grid-cols-1">
                <h4 className="flex items-center gap-2 font-extrabold text-slate-900 md:col-span-2 lg:col-span-1">
                  <HospitalIcon className="size-5 text-violet-600" /> Hospital Information
                </h4>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Info</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedFacility.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedFacility.phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Location & Joined</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedFacility.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="font-medium text-slate-700">Joined: {selectedFacility.joined}</span>
                    </div>
                  </div>
                </div>
              </div>

              {facilityDetailsLoading ? (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-8 text-center text-sm font-bold text-indigo-600 animate-pulse">
                  Loading live facility operations...
                </div>
              ) : selectedFacility.metrics && (
                <>
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 lg:col-start-1 lg:row-start-2 lg:grid-cols-2">
                    <h4 className="col-span-full flex items-center gap-2 font-extrabold text-slate-900">
                      <User className="size-5 text-emerald-600" /> Key Statistics
                    </h4>
                    {[
                      ['Doctors', selectedFacility.metrics.doctors],
                      ['Departments', selectedFacility.metrics.departments],
                      ['Patients', selectedFacility.metrics.patients],
                      ['Reports', selectedFacility.metrics.reports],
                      ['Appointments', selectedFacility.metrics.appointments],
                      ['Invoices', selectedFacility.metrics.invoices],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-2xl font-black text-slate-900">{String(value ?? 0)}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>

                  {String(selectedFacility.type).toUpperCase() === 'HOSPITAL' && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-start-2 lg:row-span-3 lg:row-start-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Hospital Doctors</h4>
                          <p className="mt-1 text-xs text-slate-500">Doctors registered under this hospital in the database.</p>
                        </div>
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                          {selectedFacility.doctors?.length || 0} total
                        </span>
                      </div>

                      {selectedFacility.doctors?.length ? (
                        <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
                          {selectedFacility.doctors.map((doctor: any) => (
                            <div key={doctor.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 font-black text-cyan-700">
                                  {String(doctor.name || 'D').replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-slate-900">{doctor.name}</p>
                                  <p className="truncate text-xs font-medium text-slate-500">
                                    {doctor.specialization || 'General'} • {doctor.shift || 'Shift not set'}
                                  </p>
                                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{doctor.email || doctor.phone || 'Contact not provided'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:justify-end">
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                  {doctor.patientsCount || 0} patients
                                </span>
                                <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${String(doctor.status).toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                  {doctor.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-medium text-slate-500">
                          No doctors are registered under this hospital.
                        </div>
                      )}

                      {selectedFacility.departments?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedFacility.departments.map((department: any) => (
                            <span key={department.name} className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                              {department.name} · {department.doctors} doctor{department.doctors === 1 ? '' : 's'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* KYC & Documents */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-start-1 lg:row-start-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">KYC & Documents</h4>
                {selectedFacility.documents && selectedFacility.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedFacility.documents.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                          <FileCheck className="size-5 text-indigo-500" />
                          <span className="text-sm font-bold text-slate-700">{doc}</span>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-sm font-medium text-slate-500">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Close</button>
              
              {!selectedFacility.isVerified && (
                <button 
                  onClick={() => handleVerify(selectedFacility.id)} 
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
