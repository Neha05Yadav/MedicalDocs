"use client";

import { useState } from "react";
import { 
  Building2, Mail, Phone, MapPin, Save, FileCheck, ShieldCheck, Microscope
} from "lucide-react";
import { toast } from "sonner";

export default function LabProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    labName: "Apex Diagnostic Center",
    type: "Pathology & Microbiology",
    labId: "LAB-29384",
    licenseNo: "CDSCO-8821-2023",
    email: "contact@apexlabs.in",
    phone: "+91 1800-123-4567",
    address: "Unit 4, Health Tech Park, Sector 62, Noida, UP - 201309",
    description: "NABL accredited diagnostic center specializing in advanced pathology, genetics, and comprehensive microbiology testing."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Laboratory Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your facility's details, licenses, and contact information.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm ${
            isEditing ? "bg-[#2ea043] hover:bg-green-700 text-white" : "bg-[#1e5eff] hover:bg-blue-700 text-white"
          }`}
        >
          {isEditing ? <><Save className="size-4" /> Save Profile</> : "Edit Profile"}
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Cover & Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-[#1e5eff] to-cyan-400 relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8 text-center sm:text-left">
            <div className="size-24 sm:size-32 rounded-2xl border-4 border-white bg-blue-50 text-[#1e5eff] flex items-center justify-center shadow-md shrink-0">
              <Microscope className="size-12 sm:size-16" />
            </div>
            <div className="flex-1 pb-2 w-full">
              {isEditing ? (
                <input 
                  type="text" 
                  name="labName"
                  value={profile.labName} 
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1 mb-2 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]"
                />
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">{profile.labName}</h2>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-[#1e5eff]">
                <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Building2 className="size-4" />
                  {isEditing ? (
                    <input name="type" value={profile.type} onChange={handleChange} className="bg-transparent border-b border-blue-200 focus:outline-none w-48 text-center sm:text-left" />
                  ) : profile.type}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <ShieldCheck className="size-4" /> NABL Accredited
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Lab Identification */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 border-b border-slate-100 pb-2">Facility Registration</h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Laboratory ID</p>
                    {isEditing ? (
                      <input name="labId" value={profile.labId} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 font-mono bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-fit">{profile.labId}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">License Number</p>
                    {isEditing ? (
                      <input name="licenseNo" value={profile.licenseNo} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileCheck className="size-4 text-emerald-500" />
                        <p className="text-sm font-semibold text-slate-900 uppercase">{profile.licenseNo}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</p>
                    {isEditing ? (
                      <textarea name="description" value={profile.description} onChange={handleChange} rows={4} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                    ) : (
                      <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3">{profile.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 border-b border-slate-100 pb-2">Contact Details</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="size-5 text-[#1e5eff]" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                      {isEditing ? (
                        <input name="email" value={profile.email} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="size-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Helpline / Phone</p>
                      {isEditing ? (
                        <input name="phone" value={profile.phone} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900">{profile.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="size-5 text-amber-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Facility Address</p>
                      {isEditing ? (
                        <textarea name="address" value={profile.address} onChange={handleChange} rows={3} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 focus:border-[#1e5eff]" />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
