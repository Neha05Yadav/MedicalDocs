"use client";







const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Award = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>;
const Stethoscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
import { useState } from "react";
import { toast } from "sonner";
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
    toast.success("Profile updated successfully!");
  };
  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Cover & Header */}
        <div className="h-32 bg-gradient-to-r from-[#0891b2] to-cyan-400 relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8 text-center sm:text-left">
            <div className="size-24 sm:size-32 rounded-full border-4 border-white bg-cyan-100 text-[#0891b2] flex items-center justify-center shadow-md shrink-0">
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
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-[#0891b2]">
                <div className="flex items-center gap-1.5 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                  <Stethoscope className="size-4" />
                  {isEditing ? (
                    <input name="specialization" value={profile.specialization} onChange={handleChange} className="bg-transparent border-b border-cyan-200 focus:outline-none w-28" />
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
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
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
