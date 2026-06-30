import PrescriptionsClient from "./PrescriptionsClient";

const initialMockPrescriptions = [
  {
    id: "PRE001",
    doctor: "Dr. Amit Sharma",
    date: "08 Jun 2026",
    status: "Active",
  },
  {
    id: "PRE002",
    doctor: "Dr. Priya Singh",
    date: "20 May 2026",
    status: "Completed",
  },
  {
    id: "PRE003",
    doctor: "Dr. Rajesh Kumar",
    date: "15 Apr 2026",
    status: "Completed",
  },
  {
    id: "PRE004",
    doctor: "Dr. Neha Gupta",
    date: "10 Mar 2026",
    status: "Completed",
  },
  {
    id: "PRE005",
    doctor: "Dr. Anil Verma",
    date: "25 Feb 2026",
    status: "Completed",
  },
];

export default function PrescriptionsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full min-h-screen">
      <PrescriptionsClient initialPrescriptions={initialMockPrescriptions} />
    </div>
  );
}
