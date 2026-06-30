import Users from "lucide-react/dist/esm/icons/users.mjs";
import Search from "lucide-react/dist/esm/icons/search.mjs";
import FileText from "lucide-react/dist/esm/icons/file-text.mjs";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createFileRoute("/_authenticated/hospital/patients")({
  head: () => ({ meta: [{ title: "Patients — MediDoc" }] }),
  component: PatientsPage,
});
const patients = [
  { name: "Marcus Chen", id: "P-8821", age: 34, lastVisit: "Oct 12, 2023", condition: "Hypertension" },
  { name: "Elena Rodriguez", id: "P-8845", age: 28, lastVisit: "Sep 28, 2023", condition: "Migraine" },
  { name: "James Okafor", id: "P-8891", age: 45, lastVisit: "Sep 15, 2023", condition: "Fracture" },
  { name: "Aisha Khan", id: "P-8912", age: 6, lastVisit: "Aug 22, 2023", condition: "Asthma" },
  { name: "Robert Kim", id: "P-8934", age: 52, lastVisit: "Aug 10, 2023", condition: "Diabetes" },
];
function PatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-sm text-muted-foreground mt-1">Search and manage patient records.</p>
      </header>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
      </div>
      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Last Visit</th>
              <th className="px-6 py-3">Condition</th>
              <th className="px-6 py-3 text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4 font-mono text-muted-foreground">{p.id}</td>
                <td className="px-6 py-4">{p.age}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.lastVisit}</td>
                <td className="px-6 py-4">{p.condition}</td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-brand text-xs font-medium hover:underline">
                    <FileText className="size-3" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No patients found matching your search.</div>
        )}
      </div>
    </div>
  );
}
