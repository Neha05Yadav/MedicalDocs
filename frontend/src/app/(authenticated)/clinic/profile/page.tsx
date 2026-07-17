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
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
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
                name="hospital"
                value={profile.hospital}
                onChange={handleChange}
                className="text-2xl sm:text-3xl font-bold text-slate-900 bg-white/80 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl px-4 py-2 mb-3 w-full max-w-md shadow-sm transition-all"
                placeholder="Clinic Name"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{profile.hospital || "Clinic Name"}</h2>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-[#0891b2] px-4 py-1.5 rounded-full border border-cyan-100 shadow-sm">
                <Stethoscope className="size-4" />
                {isEditing ? (
                  <input
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleChange}
                    className="bg-transparent border-b border-cyan-300 focus:outline-none w-32 font-bold placeholder:text-cyan-300"
                    placeholder="Specialization"
                  />
                ) : (
                  <span className="font-bold">{profile.specialization}</span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Award className="size-4 text-slate-400" />{" "}
                <span className="text-slate-500">MCI Reg:</span>
                {isEditing ? (
                  <input
                    name="registrationNo"
                    value={profile.registrationNo}
                    onChange={handleChange}
                    className="bg-transparent border-b border-slate-300 focus:outline-none w-28 font-bold placeholder:text-slate-300"
                    placeholder="Registration No"
                  />
                ) : (
                  <span className="font-bold text-slate-700">{profile.registrationNo}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-cyan-100 text-[#0891b2] rounded-lg">
                    <MapPin className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 group">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                      <Mail className="size-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </p>
                      {isEditing ? (
                        <input
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 transition-all"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                      <Phone className="size-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Phone Number
                      </p>
                      {isEditing ? (
                        <input
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 transition-all"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700">{profile.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-400 group-hover:text-[#0891b2] group-hover:border-cyan-200 transition-colors">
                      <MapPin className="size-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Clinic / Home Address
                      </p>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full text-sm font-semibold text-slate-900 bg-white border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 resize-none transition-all"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          {profile.address || "No address provided."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Award className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                    Professional Details
                  </h3>
                </div>
                <div className="space-y-5">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Doctor Name
                    </p>
                    {isEditing ? (
                      <input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all"
                      />
                    ) : (
                      <p className="text-sm font-bold text-[#0891b2]">{profile.name || "N/A"}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Department
                      </p>
                      {isEditing ? (
                        <input
                          name="department"
                          value={profile.department}
                          onChange={handleChange}
                          className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700">{profile.department}</p>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Experience
                      </p>
                      {isEditing ? (
                        <input
                          name="experience"
                          value={profile.experience}
                          onChange={handleChange}
                          className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-lg px-2 py-1.5 transition-all"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700">{profile.experience}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Bio / About
                    </p>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full text-sm font-medium text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-xl px-3 py-2 resize-none transition-all"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {profile.bio || "No bio available."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save className="size-4" /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
