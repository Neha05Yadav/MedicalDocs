"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Droplets = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
const HeartPulse = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path></svg>;

export default function PatientProfileClient() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({
    id: "", name: "", dob: "", gender: "", bloodGroup: "", email: "", phone: "", emergencyContact: "", address: "", logoUrl: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const res = await fetch("/api/patient/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile({
          id: data.id || "",
          name: data.name || "",
          dob: data.dateOfBirth || "",
          gender: data.gender || "",
          bloodGroup: data.bloodGroup || "",
          email: data.email || "",
          phone: data.phone || "",
          emergencyContact: "",
          address: "",
          logoUrl: data.logoUrl || ""
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch("/api/patient/profile/logo", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
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
      const res = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          bloodGroup: profile.bloodGroup,
          gender: profile.gender,
          dateOfBirth: profile.dob
        })
      });

      if (!res.ok) throw new Error("Update failed");
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Profile Cover & Header */}
      <div className="h-32 bg-gradient-to-r from-[#0891b2] to-cyan-400 relative"></div>
      <div className="px-8 pb-8 relative flex flex-col items-center sm:items-start">
        <div className="-mt-16 mb-4 relative z-10">
          <div 
            className="size-32 rounded-full border-4 border-white bg-cyan-100 text-[#0891b2] flex items-center justify-center shadow-md relative overflow-hidden group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="size-16" />
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-8 h-8 text-white" />
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
        <div className="w-full text-center sm:text-left mb-8">
          {isEditing ? (
            <input 
              type="text" 
              name="name"
              value={profile.name} 
              onChange={handleChange}
              className="text-2xl sm:text-3xl font-bold text-slate-900 bg-white/80 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl px-4 py-2 mb-3 w-full max-w-md shadow-sm transition-all"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{profile.name}</h1>
          )}
          <p className="text-slate-500 font-medium mb-3">Patient</p>
          {/* Patient ID Badge */}
          {profile.id && (
            <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200 rounded-xl w-fit mx-auto sm:mx-0 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0"></div>
              <span className="text-xs text-slate-500 font-medium shrink-0">Patient ID:</span>
              <span className="text-xs font-mono font-bold text-cyan-700 tracking-wider truncate" title={profile.id}>{profile.id}</span>
              <button
                onClick={() => { 
                  navigator.clipboard.writeText(profile.id); 
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                title="Copy Patient ID"
                className="shrink-0 text-slate-400 hover:text-cyan-600 transition-colors ml-1 p-0.5"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                )}
              </button>
            </div>
          )}
        </div>
        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <User className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Personal Information</h3>
              </div>
              <div className="space-y-5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Birth</p>
                  {isEditing ? (
                    <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900">{profile.dob || "Not provided"}</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender</p>
                  {isEditing ? (
                    <select name="gender" value={profile.gender} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900">{profile.gender || "Not provided"}</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Blood Group</p>
                  {isEditing ? (
                    <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all">
                      <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900">{profile.bloodGroup || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="p-2 bg-cyan-100 text-[#0891b2] rounded-lg">
                  <MapPin className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Contact Details</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                    <Phone className="size-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</p>
                    {isEditing ? (
                      <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-slate-700">{profile.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                    <HeartPulse className="size-5 text-rose-400" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Emergency Contact</p>
                    {isEditing ? (
                      <input type="text" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-slate-700">{profile.emergencyContact || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                    <Mail className="size-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</p>
                    {isEditing ? (
                      <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 transition-all" />
                    ) : (
                      <p className="text-sm font-bold text-slate-700">{profile.email || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                    <MapPin className="size-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address</p>
                    {isEditing ? (
                      <textarea name="address" value={profile.address} onChange={handleChange} rows={3} className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 resize-none transition-all" />
                    ) : (
                      <p className="text-sm font-medium text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 shadow-sm">{profile.address || "No address provided."}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0891b2] hover:bg-cyan-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="size-4" /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0891b2] bg-cyan-50 hover:bg-cyan-100 transition-colors border border-cyan-100"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
