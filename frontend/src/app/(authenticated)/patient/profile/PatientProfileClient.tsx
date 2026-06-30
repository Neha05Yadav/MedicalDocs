"use client";

import { useState } from "react";
import { toast } from "sonner";

const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Mail = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>;
const Phone = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Droplets = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg>;
const Calendar = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const Save = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>;
const HeartPulse = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path></svg>;

export default function PatientProfileClient({ initialProfile }: { initialProfile: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
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
                className="text-2xl font-bold text-slate-900 border-b border-cyan-300 focus:outline-none focus:border-cyan-500 bg-transparent px-1 py-0.5 w-full max-w-xs"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{profile.name}</h1>
            )}
            <p className="text-slate-500 font-medium mt-1">Patient</p>
          </div>
        </div>
        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                  {isEditing ? (
                    <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.dob}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gender</p>
                  {isEditing ? (
                    <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.gender}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Droplets className="size-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
                  {isEditing ? (
                    <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
                      <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.bloodGroup}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Phone className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                  {isEditing ? (
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <HeartPulse className="size-4 text-rose-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Emergency Contact</p>
                  {isEditing ? (
                    <input type="text" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.emergencyContact}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                  {isEditing ? (
                    <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">{profile.email}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                  {isEditing ? (
                    <input type="text" name="address" value={profile.address} onChange={handleChange} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{profile.address}</p>
                  )}
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
