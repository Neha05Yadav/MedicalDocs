"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Droplets, Calendar, Shield, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      return data;
    },
  });

  const [dob, setDob] = useState(profile?.dob ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [bloodGroup, setBloodGroup] = useState(profile?.blood_group ?? "");
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergency_contact ?? "");
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.id) return;
    setIsSaving(true);
    const { error } = await supabase.from("profiles").update({
      dob,
      gender,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    }).eq("id", profile.id);
    setIsSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal and medical information.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Information</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              Full Name
            </label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Date of Birth
              </label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand appearance-none">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Medical Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Droplets className="size-3.5 text-muted-foreground" />
                Blood Group
              </label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand appearance-none">
                <option value="">Select</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Emergency Contact
              </label>
              <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="+1 234 567 890" />
            </div>
          </div>
        </div>

        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Security</h2>
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-brand" />
            <div>
              <p className="text-sm font-medium">Account Security</p>
              <p className="text-xs text-muted-foreground">Your account is protected with encryption.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-brand text-background px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}


