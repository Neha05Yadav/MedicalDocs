import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, Users, Calendar, ClipboardList, Hospital, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hospital/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediDoc" }] }),
  component: DoctorsPage,
});

const doctors = [
  { name: "Dr. Sarah Jenkins", department: "Cardiology", patients: 142, status: "Active" },
  { name: "Dr. Alan Watts", department: "Neurology", patients: 98, status: "Active" },
  { name: "Dr. Priya Patel", department: "Orthopedics", patients: 76, status: "On Leave" },
  { name: "Dr. Michael Brown", department: "Pediatrics", patients: 124, status: "Active" },
  { name: "Dr. Emily Chen", department: "Cardiology", patients: 89, status: "Active" },
];

function DoctorsPage() {
  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage hospital doctors and their assignments.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand text-background px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110">
          <Stethoscope className="size-4" />
          Add Doctor
        </button>
      </header>

      <div className="bg-card ring-1 ring-black/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Patients</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {doctors.map((d, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{d.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{d.department}</td>
                <td className="px-6 py-4">{d.patients}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${
                    d.status === "Active" ? "status-stable" : "status-pending"
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
