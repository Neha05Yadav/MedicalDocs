"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Award, Stethoscope, Save } from "lucide-react";

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Dr. Rohan Verma",
    specialization: "Cardiologist",
    department: "Cardiology",
    hospital: "Apollo Hospital, Delhi",
    registrationNo: "MCI-45892",
    email: "dr.rohan@example.com",
    phone: "+91 9876543210",
    experience: "12 Years",
    bio: "Senior Consultant Cardiologist with expertise in interventional cardiology and heart failure management.",
    address: "Block B, Sector 14, Noida, UP"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add toast or API call here
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full bg-[#f8f9fc] min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2b4b]">Doctor Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal details, credentials, and contact information.</p>
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
        <div className="h-32 bg-gradient-to-r from-[#1e5eff] to-blue-400 relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8 text-center sm:text-left">
            <div className="size-24 sm:size-32 rounded-full border-4 border-white bg-blue-100 text-[#1e5eff] flex items-center justify-center shadow-md shrink-0">
              <User className="size-12 sm:size-16" />
            </div>
            <div className="flex-1 pb-2">
              {isEditing ? (
                <input 
                  type="text" 
                  name="name"
                  value={profile.name} 
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1 mb-2 w-full max-w-sm"
                />
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{profile.name}</h2>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-[#1e5eff]">
                <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Stethoscope className="size-4" />
                  {isEditing ? (
                    <input name="specialization" value={profile.specialization} onChange={handleChange} className="bg-transparent border-b border-blue-200 focus:outline-none w-28" />
                  ) : profile.specialization}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Award className="size-4" /> MCI Reg: {profile.registrationNo}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="size-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Email Address</p>
                      {isEditing ? (
                        <input name="email" value={profile.email} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5" />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="size-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                      {isEditing ? (
                        <input name="phone" value={profile.phone} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5" />
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Clinic / Home Address</p>
                      {isEditing ? (
                        <textarea name="address" value={profile.address} onChange={handleChange} rows={2} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 resize-none" />
                      ) : (
                        <p className="text-sm font-medium text-slate-900 leading-relaxed">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Professional Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Primary Hospital / Clinic</p>
                    {isEditing ? (
                      <input name="hospital" value={profile.hospital} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5" />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{profile.hospital}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    {isEditing ? (
                      <input name="department" value={profile.department} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5" />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{profile.department}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Years of Experience</p>
                    {isEditing ? (
                      <input name="experience" value={profile.experience} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5" />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{profile.experience}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bio / About</p>
                    {isEditing ? (
                      <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 resize-none" />
                    ) : (
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{profile.bio}</p>
                    )}
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
