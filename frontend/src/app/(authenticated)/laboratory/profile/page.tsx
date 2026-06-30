"use client";








const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
const FileCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="m9 15 2 2 4-4"></path></svg>;
const ShieldCheck = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Microscope = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
import { useState } from "react";
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
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Cover & Header */}
        <div className="h-32 bg-gradient-to-r from-cyan-600 via-[#0891b2] to-cyan-400 relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8 text-center sm:text-left">
            <div className="size-24 sm:size-32 rounded-2xl border-4 border-white bg-cyan-50 text-[#0891b2] flex items-center justify-center shadow-md shrink-0">
              <Microscope className="size-12 sm:size-16" />
            </div>
            <div className="flex-1 pb-2 w-full">
              {isEditing ? (
                <input 
                  type="text" 
                  name="labName"
                  value={profile.labName} 
                  onChange={handleChange}
                  className="text-2xl sm:text-3xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-3 py-1 mb-2 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]"
                />
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">{profile.labName}</h2>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-[#0891b2]">
                <div className="flex items-center gap-1.5 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                  <Building2 className="size-4" />
                  {isEditing ? (
                    <input name="type" value={profile.type} onChange={handleChange} className="bg-transparent border-b border-cyan-200 focus:outline-none w-48 text-center sm:text-left" />
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
                      <input name="labId" value={profile.labId} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 font-mono bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-fit">{profile.labId}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">License Number</p>
                    {isEditing ? (
                      <input name="licenseNo" value={profile.licenseNo} onChange={handleChange} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
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
                      <textarea name="description" value={profile.description} onChange={handleChange} rows={4} className="w-full text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
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
                      <Mail className="size-5 text-[#0891b2]" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                      {isEditing ? (
                        <input name="email" value={profile.email} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
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
                        <input name="phone" value={profile.phone} onChange={handleChange} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
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
                        <textarea name="address" value={profile.address} onChange={handleChange} rows={3} className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2]" />
                      ) : (
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-6">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
                  <Save className="size-4" /> Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
