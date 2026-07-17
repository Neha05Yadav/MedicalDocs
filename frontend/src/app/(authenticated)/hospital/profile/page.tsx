"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

// Icons
const Hospital = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 6v4"></path><path d="M14 14h-4v4"></path><path d="M14 18h4v-4"></path><path d="M10 14H6v4"></path><path d="M10 10H6v-4"></path><path d="M14 10h4v-4"></path><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const Lock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>;

export default function HospitalProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Profile Data
  const [profile, setProfile] = useState({
    hospitalId: "",
    name: "",
    email: "",
    phone: "",
    logoUrl: "",
    registrationNumber: "",
    licenseNumber: "",
    type: "",
    establishedYear: "",
    emergencyContact: "",
    website: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    adminName: "",
    adminDesignation: "",
    adminEmail: "",
    adminContact: "",
    departments: "",
    description: "",
    workingDays: "",
    openingTime: "",
    closingTime: "",
    emergencyServices: false,
  });

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          hospitalId: data.hospitalId || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          logoUrl: data.logoUrl || "",
          registrationNumber: data.registrationNumber || "",
          licenseNumber: data.licenseNumber || "",
          type: data.type || "",
          establishedYear: data.establishedYear || "",
          emergencyContact: data.emergencyContact || "",
          website: data.website || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          adminName: data.adminName || "",
          adminDesignation: data.adminDesignation || "",
          adminEmail: data.adminEmail || "",
          adminContact: data.adminContact || "",
          departments: data.departments || "",
          description: data.description || "",
          workingDays: data.workingDays || "",
          openingTime: data.openingTime || "",
          closingTime: data.closingTime || "",
          emergencyServices: data.emergencyServices ? true : false,
        });
      }
    } catch (e) {
      toast.error("An error occurred while loading profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  const handleSave = async () => {
    // Basic validations
    if (!profile.name.trim()) return toast.error("Hospital Name is required");
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) return toast.error("Invalid email format");
    if (profile.phone && !/^\d+$/.test(profile.phone.replace(/\D/g, ''))) return toast.error("Phone number must contain valid digits");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(profile),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        fetchProfile(); // refresh
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (e) {
      toast.error("An error occurred while saving profile.");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch("/api/hospital/profile/logo", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Hospital logo could not be uploaded.");
      setProfile({ ...profile, logoUrl: data.logoUrl });
      toast.success("Hospital logo saved.");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Hospital logo could not be uploaded.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/hospital/profile/password", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 min-h-screen">Loading profile details...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Profile Cover & Header */}
        <div className="h-32 bg-gradient-to-r from-[#0891b2] to-cyan-400 relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-start mt-[-3rem]">
            <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Hospital className="w-10 h-10 text-[#0891b2]" />
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".jpg,.jpeg,.png"
                onChange={handleLogoUpload}
              />
            </div>

            <div className="flex gap-3 pt-14">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                    Edit Profile
                  </button>
                  <button onClick={() => setIsPasswordModalOpen(true)} className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Security
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="px-5 py-2 bg-[#0891b2] text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-sm flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="px-5 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{profile.name || "Hospital Name"}</h1>
            <p className="text-slate-500 font-mono text-sm mt-0.5">{profile.hospitalId}</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            
            {/* Hospital Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 text-[#0891b2] font-semibold">
                <Hospital className="w-5 h-5" /> Hospital Information
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Hospital Name *</label>
                  <input name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2] outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Hospital ID</label>
                  <input name="hospitalId" value={profile.hospitalId} disabled className="w-full p-2 text-sm rounded-lg bg-slate-100 border-transparent text-slate-600 font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Registration Number</label>
                  <input name="registrationNumber" value={profile.registrationNumber} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">License Number</label>
                    <input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Est. Year</label>
                    <input name="establishedYear" value={profile.establishedYear} onChange={handleChange} disabled={!isEditing} placeholder="YYYY" className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Hospital Type</label>
                  {isEditing ? (
                    <select name="type" value={profile.type} onChange={handleChange} className="w-full p-2 text-sm rounded-lg border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none">
                      <option value="HOSPITAL">General Hospital</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Multispeciality">Multispeciality</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  ) : (
                    <div className="p-2 text-sm rounded-lg bg-slate-50/50 text-slate-900 font-medium">{profile.type}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 text-[#0891b2] font-semibold">
                <Phone className="w-5 h-5" /> Contact Information
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Official Email *</label>
                  <input name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Contact Number *</label>
                    <input name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Emergency Contact</label>
                    <input name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Website</label>
                  <input name="website" value={profile.website} onChange={handleChange} disabled={!isEditing} placeholder="https://" className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-blue-600 font-medium'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 mt-8 text-[#0891b2] font-semibold">
                <MapPin className="w-5 h-5" /> Address
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">City</label>
                    <input name="city" value={profile.city} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">State</label>
                    <input name="state" value={profile.state} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Country</label>
                    <input name="country" value={profile.country} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Postal Code</label>
                    <input name="postalCode" value={profile.postalCode} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Administrator Info */}
            <div className="space-y-6 pt-4 border-t border-slate-100 md:border-0 md:pt-0">
              <div className="flex items-center gap-2 mb-4 text-[#0891b2] font-semibold">
                <Mail className="w-5 h-5" /> Administrator Information
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Admin Name</label>
                    <input name="adminName" value={profile.adminName} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Designation</label>
                    <input name="adminDesignation" value={profile.adminDesignation} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Admin Email</label>
                  <input name="adminEmail" value={profile.adminEmail} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Admin Contact</label>
                  <input name="adminContact" value={profile.adminContact} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
              </div>
            </div>

            {/* Hospital Details */}
            <div className="space-y-6 pt-4 border-t border-slate-100 md:border-0 md:pt-0">
              <div className="flex items-center gap-2 mb-4 text-[#0891b2] font-semibold">
                <Hospital className="w-5 h-5" /> Hospital Details
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Departments</label>
                  <input name="departments" value={profile.departments} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Cardiology, Neurology, Pediatrics" className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Working Days</label>
                    <input name="workingDays" value={profile.workingDays} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Mon-Sat" className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Timings</label>
                    <div className="flex items-center gap-2">
                      <input name="openingTime" type={isEditing ? "time" : "text"} value={profile.openingTime} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                      <span className="text-slate-400">-</span>
                      <input name="closingTime" type={isEditing ? "time" : "text"} value={profile.closingTime} onChange={handleChange} disabled={!isEditing} className={`w-full p-2 text-sm rounded-lg ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-900 font-medium'}`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                    <input type="checkbox" name="emergencyServices" checked={profile.emergencyServices} onChange={handleChange} disabled={!isEditing} className="w-4 h-4 text-[#0891b2] rounded border-slate-300 focus:ring-[#0891b2]" />
                    <span className="text-sm font-semibold text-slate-700">24/7 Emergency Services Available</span>
                  </label>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description / About</label>
                  <textarea name="description" value={profile.description} onChange={handleChange} disabled={!isEditing} rows={4} className={`w-full p-3 text-sm rounded-lg resize-none ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-1 outline-none' : 'bg-slate-50/50 border-transparent text-slate-700 leading-relaxed'}`}></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#0891b2]" /> Change Password
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Current Password</label>
                <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">New Password</label>
                <input type="password" required minLength={6} value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Confirm New Password</label>
                <input type="password" required minLength={6} value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
