import AssignedEscalationsClient from "../../components/AssignedEscalationsClient";

const mockAdminEscalations = [
  {
    id: "ESC-801",
    ticketId: "TK-4089",
    user: "Global Diagnostic Lab",
    userRole: "Laboratory",
    issue: "Unable to verify hospital doctor credentials during report dispatch",
    status: "Pending",
    priority: "High",
    assignedBy: "Support L2",
    assignedDate: "2026-07-10T10:00:00Z",
  },
  {
    id: "ESC-802",
    ticketId: "TK-4105",
    user: "Dr. Sarah Jenkins",
    userRole: "Doctor",
    issue: "Account locked after multiple failed login attempts despite correct password",
    status: "In Progress",
    priority: "Medium",
    assignedBy: "Support L1",
    assignedDate: "2026-07-09T14:30:00Z",
  },
  {
    id: "ESC-803",
    ticketId: "TK-4011",
    user: "Sunrise Clinic",
    userRole: "Clinic",
    issue: "Clinic license verification rejected automatically by the system",
    status: "Resolved",
    priority: "Critical",
    assignedBy: "Support Manager",
    assignedDate: "2026-07-08T09:15:00Z",
  }
];

export default function AdminAssignedEscalations() {
  return <AssignedEscalationsClient role="admin" initialData={mockAdminEscalations} />;
}
