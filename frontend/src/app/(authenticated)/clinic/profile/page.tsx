"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth-fetch";

const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const User = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const Mail = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
  </svg>
);
const Phone = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
  </svg>
);
const MapPin = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const Award = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
    <circle cx="12" cy="8" r="6"></circle>
  </svg>
);
const Stethoscope = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 2v2"></path>
    <path d="M5 2v2"></path>
    <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
    <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);
const Save = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
    <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
  </svg>
);

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    department: "",
    hospital: "",
    registrationNo: "",
    email: "",
    phone: "",
    experience: "",
    bio: "",
    address: "",
    logoUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/clinic/profile", { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...data,
          logoUrl: data.logoUrl || ""
        });
      } else {
        toast.error("Failed to load profile details.");
      }
    } catch (e) {
      toast.error("An error occurred while loading profile.");
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
    try {
      const res = await fetch("/api/clinic/profile/logo", { method: "POST", headers: authHeaders(), body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setProfile((current) => ({ ...current, logoUrl: data.logoUrl }));
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile picture upload failed.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/clinic/profile", {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (e) {
      toast.error("An error occurred while saving profile.");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 min-h-screen">Loading profile details...</div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fbfaf6] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-amber-700">Practice workspace</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Clinic profile</h1><p className="mt-2 text-base font-medium text-slate-500">Keep your practitioner identity and patient-facing contact details current.</p></div>
        {!isEditing && <button onClick={() => setIsEditing(true)} className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-800">Edit practice profile</button>}
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[19rem_1fr]">
          <div className="relative overflow-hidden bg-[#f2b84b] p-7 sm:p-9">
            <div className="absolute -right-20 -top-20 size-56 rounded-full border-[28px] border-white/15" /><div className="absolute -bottom-20 -left-16 size-48 rounded-full bg-emerald-900/10" />
            <div className="relative flex h-full min-h-[20rem] flex-col">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="group relative flex size-36 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white/50 bg-white/80 text-emerald-800 shadow-xl" title="Change practitioner photo">
                {profile.logoUrl ? <img src={profile.logoUrl} alt={profile.name || "Doctor profile"} className="size-full object-cover" /> : <User className="size-16" />}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-emerald-950/80 py-3 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"><Upload className="size-4" /> Change photo</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} />
              <div className="mt-auto pt-8"><p className="text-xs font-black uppercase tracking-[.18em] text-amber-950/60">Affiliated practice</p><h2 className="mt-2 text-2xl font-black leading-tight text-amber-950">{profile.hospital || "Clinic not assigned"}</h2><p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-bold text-amber-950"><MapPin className="size-4" /> Practice location on record</p></div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700"><Stethoscope className="size-4" /> Practitioner profile</span><h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{profile.name || "Doctor name"}</h2><p className="mt-2 text-lg font-bold text-emerald-700">{profile.specialization || "Specialization not provided"}</p></div><div className="rounded-2xl border border-stone-200 bg-[#fbfaf6] px-5 py-4"><p className="text-xs font-black uppercase tracking-wider text-stone-400">Registration</p><p className="mt-1 flex items-center gap-2 font-mono text-sm font-black text-slate-800"><Award className="size-5 text-amber-600" />{profile.registrationNo || "Not provided"}</p></div></div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[{label:"Specialization",value:profile.specialization || "Not set",icon:Stethoscope},{label:"Department",value:profile.department || "Not set",icon:Award},{label:"Experience",value:profile.experience || "Not set",icon:User}].map((item) => <div key={item.label} className="rounded-2xl border border-stone-200 bg-[#fbfaf6] p-5"><item.icon className="mb-3 size-5 text-emerald-700"/><p className="text-xs font-black uppercase tracking-wider text-stone-400">{item.label}</p><p className="mt-1 truncate text-base font-black text-slate-900">{item.value}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_.92fr]">
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-6 sm:px-8"><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Professional record</p><h2 className="mt-1 text-2xl font-black text-slate-950">Practitioner details</h2></div>
          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Doctor name</label>{isEditing ? <input name="name" value={profile.name} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 text-base font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-900">{profile.name || "Not provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Specialization</label>{isEditing ? <input name="specialization" value={profile.specialization} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-800">{profile.specialization || "Not provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Registration number</label>{isEditing ? <input name="registrationNo" value={profile.registrationNo} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-mono font-bold text-slate-800">{profile.registrationNo || "Not provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Department</label>{isEditing ? <input name="department" value={profile.department} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-800">{profile.department || "Not provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Experience</label>{isEditing ? <input name="experience" value={profile.experience} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-800">{profile.experience || "Not provided"}</div>}</div>
            <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Professional bio</label>{isEditing ? <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} className="w-full resize-none rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-medium leading-6 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="rounded-xl bg-[#fbfaf6] px-4 py-4 font-medium leading-7 text-slate-600">{profile.bio || "No bio available"}</div>}</div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-6 sm:px-8"><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Patient contact</p><h2 className="mt-1 text-2xl font-black text-slate-950">Contact & practice</h2></div>
          <div className="space-y-5 p-6 sm:p-8">
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Email address</label>{isEditing ? <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="flex items-center gap-3 rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-800"><Mail className="size-5 text-emerald-700"/><span className="break-all">{profile.email || "Not provided"}</span></div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Phone number</label>{isEditing ? <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-bold outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="flex items-center gap-3 rounded-xl bg-[#fbfaf6] px-4 py-3.5 font-bold text-slate-800"><Phone className="size-5 text-amber-600"/>{profile.phone || "Not provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Practice address</label>{isEditing ? <textarea name="address" value={profile.address} onChange={handleChange} rows={4} className="w-full resize-none rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3.5 font-semibold leading-6 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"/> : <div className="flex items-start gap-3 rounded-xl bg-[#fbfaf6] px-4 py-4 font-semibold leading-6 text-slate-700"><MapPin className="mt-0.5 size-5 shrink-0 text-amber-600"/>{profile.address || "No address provided"}</div>}</div>
            <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-500">Affiliated clinic</label><div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 font-bold text-slate-700">{profile.hospital || "Not assigned"}</div></div>
          </div>
          {isEditing && <div className="flex flex-col-reverse gap-3 border-t border-stone-100 bg-[#fbfaf6] px-6 py-5 sm:flex-row sm:justify-end sm:px-8"><button onClick={() => {setIsEditing(false);fetchProfile();}} className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:bg-stone-100">Cancel</button><button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-800"><Save className="size-4"/> Save changes</button></div>}
        </section>
      </div>
    </div>
  );
}
