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
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const Edit = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;

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

  const completedFields = [profile.name, profile.dob, profile.gender, profile.bloodGroup, profile.email, profile.phone, profile.logoUrl]
    .filter((value) => Boolean(String(value || "").trim())).length;
  const profileCompletion = Math.round((completedFields / 7) * 100);

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#071827] px-6 py-8 text-white shadow-xl sm:px-9 lg:px-11 lg:py-10">
        <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 size-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(103,232,249,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.12) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="group relative size-36 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white/15 bg-gradient-to-br from-cyan-300 to-cyan-600 text-white shadow-2xl" title="Change profile picture">
              {profile.logoUrl ? <img src={profile.logoUrl} alt={profile.name || "Patient profile"} className="size-full object-cover" /> : <User className="m-auto size-16" />}
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-slate-950/75 py-3 text-xs font-bold opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"><Upload className="size-4" /> Change photo</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} />

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-emerald-200"><ShieldCheck className="size-4" /> Patient identity</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{profile.name || "Your profile"}</h1>
              <p className="mt-2 text-base font-medium text-slate-300">Your personal and medical identity in one secure place.</p>
              {profile.id && (
                <button onClick={() => { navigator.clipboard.writeText(profile.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/15" title="Copy Patient ID">
                  <span className="size-2 rounded-full bg-cyan-300" /> Patient ID <span className="font-mono font-black tracking-wider text-cyan-200">{profile.id}</span>
                  <span className="text-xs text-slate-400">{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:w-auto lg:min-w-[28rem]">
            {[{ label: "Blood group", value: profile.bloodGroup || "—", icon: Droplets }, { label: "Gender", value: profile.gender || "—", icon: User }, { label: "Date of birth", value: profile.dob || "—", icon: Calendar }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[.07] p-4 backdrop-blur-md sm:p-5">
                <item.icon className="mb-3 size-5 text-cyan-300" />
                <p className="text-[.68rem] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="mt-1 truncate text-base font-extrabold text-white sm:text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.14em] text-cyan-700">Profile strength</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">{profileCompletion}% complete</h2>
              </div>
              <div className="relative grid size-16 place-items-center rounded-full" style={{ background: `conic-gradient(#06b6d4 ${profileCompletion * 3.6}deg, #e2e8f0 0deg)` }}>
                <div className="absolute size-12 rounded-full bg-white" />
                <span className="relative text-xs font-black text-slate-800">{profileCompletion}%</span>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all" style={{ width: `${profileCompletion}%` }} /></div>
            <p className="mt-4 text-sm font-medium leading-6 text-slate-500">Complete medical basics and contact information so connected care teams can identify you accurately.</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><ShieldCheck className="size-6" /></span><div><h2 className="text-lg font-black text-slate-900">Secure identity</h2><p className="text-sm font-medium text-slate-500">Protected patient information</p></div></div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account email</p><p className="mt-1 break-all font-bold text-slate-800">{profile.email || "Not provided"}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Record owner</p><p className="mt-1 font-bold text-slate-800">{profile.name || "Not provided"}</p></div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div><p className="text-sm font-bold uppercase tracking-[.14em] text-cyan-700">Patient details</p><h2 className="mt-1 text-2xl font-black text-slate-900">Personal information</h2></div>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12224d] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-900"><Edit className="size-4" /> Edit profile</button>}
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Full name</label>
              {isEditing ? <input name="name" value={profile.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-bold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" /> : <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><User className="size-5 text-cyan-600" /><span className="font-bold text-slate-800">{profile.name || "Not provided"}</span></div>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Date of birth</label>
              {isEditing ? <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" /> : <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><Calendar className="size-5 text-cyan-600" /><span className="font-bold text-slate-800">{profile.dob || "Not provided"}</span></div>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Gender</label>
              {isEditing ? <select name="gender" value={profile.gender} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select> : <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><User className="size-5 text-blue-600" /><span className="font-bold text-slate-800">{profile.gender || "Not provided"}</span></div>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Blood group</label>
              {isEditing ? <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"><option value="">Select blood group</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select> : <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><Droplets className="size-5 text-rose-500" /><span className="font-bold text-slate-800">{profile.bloodGroup || "Not provided"}</span></div>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Phone number</label>
              {isEditing ? <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" /> : <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><Phone className="size-5 text-emerald-600" /><span className="font-bold text-slate-800">{profile.phone || "Not provided"}</span></div>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Email address</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5"><Mail className="size-5 text-violet-600" /><span className="break-all font-bold text-slate-800">{profile.email || "Not provided"}</span><span className="ml-auto hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:inline">Account email</span></div>
            </div>
          </div>

          {isEditing && <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8"><button onClick={() => setIsEditing(false)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button><button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0891b2] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700"><Save className="size-4" /> Save changes</button></div>}
        </section>
      </div>
    </div>
  );
}
