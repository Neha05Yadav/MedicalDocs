export const tabs = ["All Tickets", "Open", "In Progress", "Pending", "Resolved", "Closed"];

export const mockTickets = [
  {
    id: "TK-4021",
    title: "Unable to login to Patient Portal",
    userType: "Patient",
    raisedBy: "Rohan Verma",
    issue: "Login",
    status: "Open",
    statusColor: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    time: "1 hour ago"
  },
  {
    id: "TK-4022",
    title: "Double deduction during subscription renewal",
    userType: "Hospital",
    raisedBy: "City Hospital",
    issue: "Payment",
    status: "In Progress",
    statusColor: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    time: "2 hours ago"
  },
  {
    id: "TK-4023",
    title: "Medical License verification taking too long",
    userType: "Doctor",
    raisedBy: "Dr. Ramesh Kumar",
    issue: "Verification",
    status: "Pending",
    statusColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    time: "3 hours ago"
  },
  {
    id: "TK-4024",
    title: "Error while uploading PDF lab report",
    userType: "Laboratory",
    raisedBy: "Apex Labs",
    issue: "Technical",
    status: "Resolved",
    statusColor: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    time: "4 hours ago"
  },
  {
    id: "TK-4025",
    title: "Need to update registered email address",
    userType: "Clinic",
    raisedBy: "Apollo Care",
    issue: "Account",
    status: "Closed",
    statusColor: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    time: "5 hours ago"
  }
];
