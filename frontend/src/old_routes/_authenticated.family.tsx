import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({ meta: [{ title: "Family Members — MediDoc" }] }),
  component: FamilyPage,
});

function FamilyPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const { data: members } = useQuery({
    queryKey: ["family-members"],
    queryFn: async () => {
      const { data } = await supabase.from("family_members").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addMember = useMutation({
    mutationFn: async (m: { name: string; relationship: string; dob: string; blood_group: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("family_members").insert({ ...m, owner_id: userData.user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success("Family member added!");
      setShowAdd(false);
      setName("");
      setRelationship("");
      setDob("");
      setBloodGroup("");
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("family_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
      toast.success("Removed");
    },
  });

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Family Members</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage health records for your family.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110">
          <Plus className="size-4" />
          Add Member
        </button>
      </header>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add Family Member</h3>
              <button onClick={() => setShowAdd(false)}><X className="size-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addMember.mutate({ name, relationship, dob, blood_group: bloodGroup }); }} className="space-y-4">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" required />
              <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Relationship (e.g. Son, Daughter)" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" required />
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of birth" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm appearance-none">
                <option value="">Blood group</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <button type="submit" disabled={addMember.isPending} className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold disabled:opacity-50">{addMember.isPending ? "Saving..." : "Save Member"}</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(members || []).length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 p-12 text-center bg-card ring-1 ring-black/5 rounded-xl">
            <Users className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No family members</h3>
            <p className="text-sm text-muted-foreground">Add family members to manage their health records.</p>
          </div>
        )}
        {(members || []).map((m) => (
          <div key={m.id} className="bg-card ring-1 ring-black/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm">
                {m.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <button onClick={() => deleteMember.mutate(m.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="size-4" />
              </button>
            </div>
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-xs text-muted-foreground capitalize mt-1">{m.relationship}</p>
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              {m.dob && <span>DOB: {new Date(m.dob).toLocaleDateString()}</span>}
              {m.blood_group && <span>Blood: {m.blood_group}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
