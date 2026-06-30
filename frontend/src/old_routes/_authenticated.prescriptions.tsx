import Pill from "lucide-react/dist/esm/icons/pill.mjs";
import FileText from "lucide-react/dist/esm/icons/file-text.mjs";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/_authenticated/prescriptions")({
  head: () => ({ meta: [{ title: "Prescriptions — MediDoc" }] }),
  component: PrescriptionsPage,
});
function PrescriptionsPage() {
  const { data: records } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data } = await supabase.from("health_records").select("*").eq("category", "Prescription").order("created_at", { ascending: false });
      return data || [];
    },
  });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Prescriptions</h1>
      <p className="text-sm text-muted-foreground mb-8">Your medication prescriptions and refills.</p>
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        {(records || []).length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No prescriptions yet</h3>
            <p className="text-sm text-muted-foreground">Upload prescriptions in your Health Records.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(records || []).map((r) => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.provider || "Unknown provider"}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {r.record_date ? new Date(r.record_date).toLocaleDateString() : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
