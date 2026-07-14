import AssignedEscalationsClient from "../../components/AssignedEscalationsClient";

const mockAccountsEscalations = [
  {
    id: "ESC-901",
    ticketId: "TK-4022",
    user: "City Care Hospital",
    userRole: "Hospital",
    issue: "Double deduction during subscription renewal",
    status: "Pending",
    priority: "High",
    assignedBy: "Support L1",
    assignedDate: "2026-07-10T10:30:00Z",
  },
  {
    id: "ESC-902",
    ticketId: "TK-4100",
    user: "John Doe",
    userRole: "Patient",
    issue: "Refund requested for cancelled appointment",
    status: "In Progress",
    priority: "Medium",
    assignedBy: "Support L1",
    assignedDate: "2026-07-09T16:20:00Z",
  }
];

export default function AccountsAssignedEscalations() {
  return <AssignedEscalationsClient role="accounts" initialData={mockAccountsEscalations} />;
}
