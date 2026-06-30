import FileText from "lucide-react/dist/esm/icons/file-text.mjs";
import Upload from "lucide-react/dist/esm/icons/upload.mjs";
import Search from "lucide-react/dist/esm/icons/search.mjs";
import Filter from "lucide-react/dist/esm/icons/filter.mjs";
import Share2 from "lucide-react/dist/esm/icons/share-2.mjs";
import Download from "lucide-react/dist/esm/icons/download.mjs";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.mjs";
import X from "lucide-react/dist/esm/icons/x.mjs";
import Plus from "lucide-react/dist/esm/icons/plus.mjs";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/records")({
  head: () => ({
    meta: [
      { title: "Health Records — MediDoc" },
      { name: "description", content: "Manage your health records." },
    ],
  }),
  component: HealthRecordsPage,
});
const categories = ["All", "Lab Report", "X-Ray", "MRI", "Vaccination", "Prescription", "Certificate", "Other"];
const categoryColor: Record<string, string> = {
  "Lab Report": "category-lab",
  "X-Ray": "category-radiology",
  "MRI": "category-mri",
  "Vaccination": "category-vaccination",
  "Prescription": "category-prescription",
  "Certificate": "category-certificate",
  Other: "category-other",
};
function HealthRecordsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Lab Report");
  const [uploadProvider, setUploadProvider] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const { data: records, isLoading } = useQuery({
    queryKey: ["health-records"],
    queryFn: async () => {
      const { data } = await supabase.from("health_records").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });
  const addRecord = useMutation({
    mutationFn: async (record: { title: string; category: string; provider: string; record_date: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("health_records").insert({
        ...record,
        patient_id: userData.user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Record added!");
      setShowUpload(false);
      setUploadTitle("");
      setUploadProvider("");
      setUploadDate("");
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const deleteRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("health_records").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      toast.success("Record deleted");
    },
  });
  const filtered = (records || []).filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || (r.provider || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Records</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload, manage, and share your medical documents.</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
        >
          <Upload className="size-4" />
          Upload Record
        </button>
      </header>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="size-4 text-muted-foreground" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat ? "bg-brand text-background" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upload New Record</h3>
              <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addRecord.mutate({
                  title: uploadTitle,
                  category: uploadCategory,
                  provider: uploadProvider,
                  record_date: uploadDate,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="e.g. Lipid Panel"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand appearance-none"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Provider / Hospital</label>
                <input
                  type="text"
                  value={uploadProvider}
                  onChange={(e) => setUploadProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="e.g. Apollo Hospital"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Record Date</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              <button
                type="submit"
                disabled={addRecord.isPending}
                className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50"
              >
                {addRecord.isPending ? "Saving..." : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Records Table */}
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="size-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No records found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {records?.length ? "Try adjusting your filters." : "Upload your first medical record to get started."}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110"
            >
              <Plus className="size-4" />
              Upload Record
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Document / Provider</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record) => (
                <tr key={record.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{record.title}</div>
                        <div className="text-xs text-muted-foreground">{record.provider || "Unknown provider"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ring-1 ${categoryColor[record.category] || "category-other"}`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {record.record_date ? new Date(record.record_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-brand transition-colors" title="Download">
                        <Download className="size-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-brand transition-colors" title="Share">
                        <Share2 className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteRecord.mutate(record.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
