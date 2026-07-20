"use client";








const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
const FileCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="m9 15 2 2 4-4"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Microscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Upload = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

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
        setProfile(prev => ({
          ...prev,
          labName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          labId: data.id || "",
          type: data.type || "",
          licenseNo: data.licenseNo || "",
          logoUrl: data.logoUrl || "",
          established: data.established || ""
        }));
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
          address: profile.address
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

  if (loading) {
    return <div className="grid min-h-[70vh] place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" /></div>;
  }

  const establishedDate = profile.established
    ? new Date(profile.established).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "Not available";

  return (
    <div className="min-h-screen w-full bg-[#f7f8fc] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-violet-600">Laboratory workspace</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Profile & quality identity</h1><p className="mt-2 text-base font-medium text-slate-500">Manage the verified information presented across your diagnostic network.</p></div>
        {!isEditing && <button onClick={() => setIsEditing(true)} className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">Edit laboratory profile</button>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[.7fr_1.3fr]">
        <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2e1065] via-violet-800 to-indigo-950 p-7 text-white shadow-xl sm:p-9">
          <div className="absolute -right-24 top-16 size-64 rounded-full border border-white/10" /><div className="absolute -right-12 top-28 size-40 rounded-full border border-cyan-300/20" /><div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black/30 to-transparent" />
          <div className="relative flex min-h-[34rem] flex-col">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="group relative flex size-32 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur" title="Upload laboratory logo">
              {profile.logoUrl ? <img src={profile.logoUrl} alt={profile.labName || "Laboratory logo"} className="size-full object-cover" /> : <Microscope className="size-16 text-cyan-200" />}
              <span className="absolute inset-0 flex items-center justify-center bg-slate-950/70 opacity-0 transition group-hover:opacity-100"><Upload className="size-7" /></span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png" onChange={handleLogoUpload} />

            <div className="mt-8"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.16em] text-cyan-200"><Microscope className="size-4" /> Diagnostic facility</span><h2 className="mt-4 text-3xl font-black leading-tight">{profile.labName || "Laboratory name"}</h2><p className="mt-2 text-base font-semibold text-violet-200">{profile.type || "Laboratory"}</p></div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[.08] p-4 backdrop-blur"><p className="text-[.68rem] font-black uppercase tracking-wider text-violet-300">Laboratory ID</p><p className="mt-1 break-all font-mono text-sm font-bold text-white">{profile.labId || "Not available"}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/[.08] p-4 backdrop-blur"><p className="text-[.68rem] font-black uppercase tracking-wider text-violet-300">License record</p><p className="mt-1 flex items-center gap-2 text-sm font-bold text-white"><FileCheck className={`size-5 ${profile.licenseNo ? "text-emerald-300" : "text-amber-300"}`} /> {profile.licenseNo || "License not provided"}</p></div>
            </div>

            <div className="mt-auto pt-8"><div className="flex items-center gap-3 border-t border-white/10 pt-6"><ShieldCheck className="size-6 text-cyan-200" /><div><p className="text-sm font-bold">Database-backed identity</p><p className="text-xs font-medium text-violet-300">Created {establishedDate}</p></div></div></div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Building2 className="size-5" /></div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Facility type</p><p className="mt-1 text-lg font-black text-slate-900">{profile.type || "Not set"}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><FileCheck className="size-5" /></div><p className="text-xs font-black uppercase tracking-wider text-slate-400">License status</p><p className="mt-1 text-lg font-black text-slate-900">{profile.licenseNo ? "On record" : "Incomplete"}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><MapPin className="size-5" /></div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Location</p><p className="mt-1 truncate text-lg font-black text-slate-900">{profile.address || "Not set"}</p></div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8"><p className="text-xs font-black uppercase tracking-[.16em] text-violet-600">Identity record</p><h2 className="mt-1 text-2xl font-black text-slate-950">Laboratory details</h2></div>
            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Laboratory name</label>{isEditing ? <input name="labName" value={profile.labName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-bold text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10" /> : <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-base font-bold text-slate-900">{profile.labName || "Not provided"}</div>}</div>
              <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Laboratory ID</label><div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 font-mono text-sm font-bold text-slate-700">{profile.labId || "Not available"}</div></div>
              <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">License number</label><div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700"><FileCheck className="size-5 text-emerald-600" />{profile.licenseNo || "Not provided"}</div></div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8"><p className="text-xs font-black uppercase tracking-[.16em] text-cyan-700">Network contact</p><h2 className="mt-1 text-2xl font-black text-slate-950">Communication & location</h2></div>
            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Official email</label>{isEditing ? <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10" /> : <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 font-bold text-slate-800"><Mail className="size-5 text-violet-600" /><span className="break-all">{profile.email || "Not provided"}</span></div>}</div>
              <div><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Helpline / phone</label>{isEditing ? <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10" /> : <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 font-bold text-slate-800"><Phone className="size-5 text-emerald-600" />{profile.phone || "Not provided"}</div>}</div>
              <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Facility address</label>{isEditing ? <textarea name="address" value={profile.address} onChange={handleChange} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-semibold text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10" /> : <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5 font-semibold leading-6 text-slate-700"><MapPin className="mt-0.5 size-5 shrink-0 text-cyan-600" />{profile.address || "No address provided"}</div>}</div>
            </div>
            {isEditing && <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8"><button onClick={() => { setIsEditing(false); fetchProfile(); }} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button><button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"><Save className="size-4" /> Save changes</button></div>}
          </section>
        </main>
      </div>
    </div>
  );
}
