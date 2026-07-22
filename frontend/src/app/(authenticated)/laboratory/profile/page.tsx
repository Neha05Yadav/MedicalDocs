"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Icons
const Microscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const FileCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="m9 15 2 2 4-4"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const Lock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default function LabProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    labName: "",
    type: "",
    labId: "",
    licenseNo: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logoUrl: "",
    established: ""
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = `/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      
      const res = await fetch("/api/laboratory/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          labName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          labId: data.id || "",
          type: data.type || "",
          licenseNo: data.licenseNo || "",
          logoUrl: data.logoUrl || "",
          description: data.description || "",
          established: data.established || ""
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch("/api/laboratory/profile/logo", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Profile picture could not be uploaded.");
      setProfile({ ...profile, logoUrl: data.logoUrl });
      toast.success("Profile picture saved.");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Profile picture could not be uploaded.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/laboratory/profile", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.labName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          description: profile.description
        })
      });
      
      if (res.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (e) {
      toast.error("Error updating profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      // Fallback to hospital password change endpoint if laboratory one doesn't exist, as both are facilities.
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
    return <div className="grid min-h-[70vh] place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" /></div>;
  }

  const establishedDate = profile.established
    ? new Date(profile.established).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "Not available";

  return (
    <div className="min-h-screen w-full bg-slate-50/60 p-4 sm:p-6 lg:p-8 [&_label]:mb-2 [&_label]:text-[.72rem] [&_label]:font-extrabold [&_label]:tracking-[.1em] [&_input]:min-h-12 [&_input]:rounded-xl [&_input]:px-4 [&_input]:text-base [&_select]:min-h-12 [&_select]:rounded-xl [&_select]:px-4 [&_select]:text-base [&_textarea]:rounded-xl [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_input[type=checkbox]]:min-h-0 [&_input[type=checkbox]]:size-5 [&_input[type=checkbox]]:p-0">
      
      <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
        <div className="p-6 sm:p-8 lg:p-9">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Microscope className="size-12 text-violet-600" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex flex-col items-center gap-1 text-xs font-bold text-white"><Upload className="size-6" /> Upload logo</span>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[.2em] text-violet-700">Laboratory Profile</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><ShieldCheck className="size-3.5" /> Verified Facility</span>
                </div>
                {isEditing ? (
                  <input
                    name="labName"
                    value={profile.labName}
                    onChange={handleChange}
                    className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl bg-white border-b-2 border-violet-600 focus:outline-none w-full min-w-[300px] py-1 placeholder:text-slate-300 transition-colors"
                    placeholder="Enter Laboratory Name"
                    autoFocus
                  />
                ) : (
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{profile.labName || "Laboratory Name"}</h1>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-slate-700">ID: {profile.labId || "Pending"}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-violet-600" /> {profile.address || "Location not provided"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-700">
                    <Save className="size-4" /> Save changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-black text-slate-900">General Information</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-slate-500">Laboratory Name</label>
                  {isEditing ? (
                    <input name="labName" value={profile.labName} onChange={handleChange} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                  ) : (
                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">{profile.labName || "-"}</div>
                  )}
                </div>
                
                <div>
                  <label className="text-slate-500">Facility Type</label>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                    <Building2 className="size-4 text-violet-500" />
                    {profile.type || "Laboratory"}
                  </div>
                </div>

                <div>
                  <label className="text-slate-500">Established On</label>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">{establishedDate}</div>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="text-slate-500">Description</label>
                  {isEditing ? (
                    <textarea name="description" value={profile.description} onChange={handleChange} rows={3} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none resize-none" placeholder="Provide a brief description of your laboratory..." />
                  ) : (
                    <div className="min-h-[5rem] rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 whitespace-pre-wrap">{profile.description || "No description provided."}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-black text-slate-900">Contact & Address</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-slate-500">Official Email</label>
                  {isEditing ? (
                    <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 break-all"><Mail className="size-4 shrink-0 text-slate-400" />{profile.email || "-"}</div>
                  )}
                </div>
                
                <div>
                  <label className="text-slate-500">Phone Number</label>
                  {isEditing ? (
                    <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900"><Phone className="size-4 shrink-0 text-slate-400" />{profile.phone || "-"}</div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-500">Complete Address</label>
                  {isEditing ? (
                    <textarea name="address" value={profile.address} onChange={handleChange} rows={2} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none resize-none" />
                  ) : (
                    <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 leading-relaxed"><MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />{profile.address || "-"}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-black text-slate-900">Legal & Licensing</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="text-slate-500">Laboratory ID</label>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold font-mono text-slate-700">
                    {profile.labId || "-"}
                  </div>
                </div>
                
                <div>
                  <label className="text-slate-500">License Number</label>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                    <FileCheck className={`size-4 ${profile.licenseNo ? "text-emerald-500" : "text-amber-500"}`} />
                    {profile.licenseNo || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-black text-slate-900">Security</h2>
            </div>
            <div className="p-6">
              <p className="mb-4 text-sm font-medium text-slate-500">
                Keep your account secure by updating your password regularly.
              </p>
              <button onClick={() => setIsPasswordModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <Lock className="size-4" /> Change Password
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="text-lg font-black text-slate-900">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-slate-500">Current Password</label>
                  <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-slate-500">New Password</label>
                  <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-slate-500">Confirm New Password</label>
                  <input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full border border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all outline-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
