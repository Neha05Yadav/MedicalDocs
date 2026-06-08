import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Upload, FileText, FileCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/hospital/reports")({
  head: () => ({ meta: [{ title: "Reports — MediDoc" }] }),
  component: ReportsPage,
});

const reportTypes = [
  { label: "Discharge Summary", icon: FileCheck, desc: "Patient discharge documentation" },
  { label: "Surgery Report", icon: FileText, desc: "Post-operative summaries" },
  { label: "Admission Record", icon: ClipboardList, desc: "Patient intake forms" },
  { label: "Test Results", icon: FileCheck, desc: "Lab and diagnostic results" },
];

function ReportsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports Upload</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload hospital reports and patient documents.</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {reportTypes.map((rt) => (
          <button
            key={rt.label}
            onClick={() => setSelected(selected === rt.label ? null : rt.label)}
            className={`p-6 bg-card ring-1 ring-black/5 rounded-xl text-left hover:shadow-lg hover:shadow-brand/5 transition-all ${selected === rt.label ? "ring-2 ring-brand" : ""}`}
          >
            <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
              <rt.icon className="size-5" />
            </div>
            <h3 className="font-semibold">{rt.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{rt.desc}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-card ring-1 ring-black/5 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Upload {selected}</h3>
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-brand/30 transition-colors cursor-pointer">
            <Upload className="size-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse (PDF, JPG, PNG)</p>
          </div>
        </div>
      )}
    </div>
  );
}
