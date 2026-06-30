import Shield from "lucide-react/dist/esm/icons/shield.mjs";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.mjs";
import Calendar from "lucide-react/dist/esm/icons/calendar.mjs";
import Droplets from "lucide-react/dist/esm/icons/droplets.mjs";
import Phone from "lucide-react/dist/esm/icons/phone.mjs";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
export const Route = createFileRoute("/complete-profile")({
  head: () => ({
    meta: [
      { title: "Complete Profile — MediDoc" },
      { name: "description", content: "Complete your MediDoc profile." },
    ],
  }),
  component: CompleteProfilePage,
});
function CompleteProfilePage() {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setIsLoading(false);
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      dob,
      gender,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
      role: "patient",
      updated_at: new Date().toISOString(),
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile saved!");
      window.location.href = "/dashboard";
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/verify-otp" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
              <Shield className="size-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MediDoc</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Complete your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add your medical details for a complete health identity.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground" />
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <Droplets className="size-3.5 text-muted-foreground" />
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none"
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" />
              Emergency Contact
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              placeholder="+1 234 567 890"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
