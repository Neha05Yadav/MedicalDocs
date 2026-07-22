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
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
const ArrowLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>;

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
    <div className="min-h-screen w-full bg-slate-50/60 p-4 sm:p-6 lg:p-8 [&_label]:mb-2 [&_label]:text-[.72rem] [&_label]:font-extrabold [&_label]:tracking-[.1em] [&_input]:min-h-12 [&_input]:rounded-xl [&_input]:px-4 [&_input]:text-base [&_select]:min-h-12 [&_select]:rounded-xl [&_select]:px-4 [&_select]:text-base [&_textarea]:rounded-xl [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_input[type=checkbox]]:min-h-0 [&_input[type=checkbox]]:size-5 [&_input[type=checkbox]]:p-0">
      <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400" />
        <div className="p-6 sm:p-8 lg:p-9">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Hospital className="size-12 text-[#0891b2]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex flex-col items-center gap-1 text-xs font-bold text-white"><Upload className="size-6" /> Upload logo</span>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} />
            </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[.2em] text-cyan-700">Facility directory</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><ShieldCheck className="size-3.5" /> Registered profile</span>
                </div>
                {isEditing ? (
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl bg-white border-b-2 border-[#0891b2] focus:outline-none w-full min-w-[300px] py-1 placeholder:text-slate-300 transition-colors"
                    placeholder="Enter Hospital Name"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{profile.name || "Hospital Name"}</h1>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-slate-700">ID: {profile.hospitalId || "Pending"}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-cyan-600" /> {[profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "Location not provided"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-xl bg-[#12224d] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-900">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-[#0891b2] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700">
                    <Save className="size-4" /> Save changes
                  </button>
                </>
              )}
              <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 shadow-sm">
                <Lock className="size-4" /> Security Settings
              </button>
            </div>
          </div>

          {!isEditing && (
            <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 lg:grid-cols-4">
              <div className="border-b border-r border-slate-200 p-5 lg:border-b-0"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Facility type</p><p className="mt-2 text-lg font-black text-slate-900">{profile.type || "Not set"}</p></div>
              <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Established</p><p className="mt-2 text-lg font-black text-slate-900">{profile.establishedYear || "Not set"}</p></div>
              <div className="border-r border-slate-200 p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Working hours</p><p className="mt-2 flex items-center gap-2 text-lg font-black text-slate-900"><Clock className="size-5 text-cyan-600" /> {profile.openingTime && profile.closingTime ? `${profile.openingTime}–${profile.closingTime}` : "Not set"}</p></div>
              <div className="p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Emergency services</p><p className={`mt-2 text-lg font-black ${profile.emergencyServices ? "text-emerald-700" : "text-slate-500"}`}>{profile.emergencyServices ? "Available 24/7" : "Not available"}</p></div>
            </div>
          )}
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
         
         <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Hospital Information</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hospital Name *</label>
             <input name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hospital ID</label>
             <input name="hospitalId" value={profile.hospitalId} disabled className="w-full p-3 text-sm rounded-xl bg-slate-100 border-transparent text-slate-600 font-mono" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Registration Number</label>
             <input name="registrationNumber" value={profile.registrationNumber} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">License Number</label>
             <input name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Est. Year</label>
             <input name="establishedYear" value={profile.establishedYear} onChange={handleChange} disabled={!isEditing} placeholder="YYYY" className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hospital Type</label>
             {isEditing ? (
               <select name="type" value={profile.type} onChange={handleChange} className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none">
                 <option value="HOSPITAL">General Hospital</option>
                 <option value="Government">Government</option>
                 <option value="Private">Private</option>
                 <option value="Multispeciality">Multispeciality</option>
                 <option value="Clinic">Clinic</option>
               </select>
             ) : (
               <div className="p-3 text-sm rounded-xl bg-slate-50/70 text-slate-900 font-medium h-12 flex items-center">{profile.type}</div>
             )}
           </div>
         </div>

         <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Contact & Address</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Official Email *</label>
             <input name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contact Number *</label>
             <input name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Emergency Contact</label>
             <input name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Website</label>
             <input name="website" value={profile.website} onChange={handleChange} disabled={!isEditing} placeholder="https://" className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-blue-600 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">City</label>
             <input name="city" value={profile.city} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">State</label>
             <input name="state" value={profile.state} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Country</label>
             <input name="country" value={profile.country} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Postal Code</label>
             <input name="postalCode" value={profile.postalCode} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
         </div>

         <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Administrator Info</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Admin Name</label>
             <input name="adminName" value={profile.adminName} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Designation</label>
             <input name="adminDesignation" value={profile.adminDesignation} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Admin Email</label>
             <input name="adminEmail" value={profile.adminEmail} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Admin Contact</label>
             <input name="adminContact" value={profile.adminContact} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
         </div>

         <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Operations & Services</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           <div className="col-span-1 md:col-span-2 xl:col-span-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Departments</label>
             <input name="departments" value={profile.departments} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Cardiology, Neurology, Pediatrics" className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Working Days</label>
             <input name="workingDays" value={profile.workingDays} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Mon-Sat" className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Timings</label>
             <div className="flex items-center gap-2">
               <input name="openingTime" type={isEditing ? "time" : "text"} value={profile.openingTime} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
               <span className="text-slate-400">-</span>
               <input name="closingTime" type={isEditing ? "time" : "text"} value={profile.closingTime} onChange={handleChange} disabled={!isEditing} className={`w-full p-3 text-sm rounded-xl ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-900 font-medium'}`} />
             </div>
           </div>
           <div className="flex items-end">
             <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-100 h-[3.25rem] w-full">
               <input type="checkbox" name="emergencyServices" checked={profile.emergencyServices} onChange={handleChange} disabled={!isEditing} className="w-5 h-5 text-[#0891b2] rounded border-slate-300 focus:ring-[#0891b2]" />
               <span className="text-sm font-semibold text-slate-700">24/7 Emergency Services</span>
             </label>
           </div>
           <div className="col-span-1 md:col-span-2 xl:col-span-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Description / About</label>
             <textarea name="description" value={profile.description} onChange={handleChange} disabled={!isEditing} rows={4} className={`w-full p-4 text-sm rounded-xl resize-none ${isEditing ? 'border border-slate-300 focus:border-[#0891b2] focus:ring-2 focus:ring-[#0891b2]/20 outline-none' : 'bg-slate-50/70 border-transparent text-slate-700 leading-relaxed'}`}></textarea>
           </div>
         </div>
      </section>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
