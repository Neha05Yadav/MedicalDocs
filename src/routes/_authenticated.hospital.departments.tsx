import { createFileRoute } from "@tanstack/react-router";
import { Hospital, Users, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hospital/departments")({
  head: () => ({ meta: [{ title: "Departments — MediDoc" }] }),
  component: DepartmentsPage,
});

const departments = [
  { name: "Cardiology", doctors: 6, patients: 142, icon: Stethoscope, color: "bg-red-50 text-red-700 ring-1 ring-red-200/50" },
  { name: "Neurology", doctors: 4, patients: 98, icon: Stethoscope, color: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/50" },
  { name: "Orthopedics", doctors: 5, patients: 76, icon: Stethoscope, color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50" },
  { name: "Pediatrics", doctors: 7, patients: 124, icon: Stethoscope, color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50" },
  { name: "General Medicine", doctors: 8, patients: 210, icon: Stethoscope, color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50" },
  { name: "Emergency", doctors: 12, patients: 340, icon: Hospital, color: "bg-red-50 text-red-700 ring-1 ring-red-200/50" },
];

function DepartmentsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-sm text-muted-foreground mt-1">Hospital departments and their statistics.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.name} className="bg-card ring-1 ring-black/5 rounded-xl p-5 hover:shadow-lg hover:shadow-brand/5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-10 rounded-lg flex items-center justify-center ${d.color}`}>
                <d.icon className="size-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{d.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{d.doctors}</p>
                <p className="text-xs text-muted-foreground">Doctors</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{d.patients}</p>
                <p className="text-xs text-muted-foreground">Patients</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
