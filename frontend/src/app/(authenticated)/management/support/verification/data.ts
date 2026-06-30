export const verificationRequests = [
  {
    id: "VR-8901",
    userName: "Dr. Ramesh Kumar",
    userType: "Doctor",
    issueType: "Medical License Verification",
    status: "Under Review",
    statusColor: "bg-blue-100 text-blue-700",
    date: "2023-10-24",
    documents: ["MBBS_Degree.pdf", "State_Medical_Council_ID.pdf"],
    rejectionReason: null,
    internalNotes: "Waiting for secondary confirmation from state council.",
    conversation: [
      { sender: "System", time: "10:00 AM", text: "Request received." }
    ]
  },
  {
    id: "VR-8902",
    userName: "Apex Labs",
    userType: "Laboratory",
    issueType: "NABL Accreditation",
    status: "Pending Verification",
    statusColor: "bg-amber-100 text-amber-700",
    date: "2023-10-23",
    documents: ["NABL_Certificate_2023.pdf"],
    rejectionReason: null,
    internalNotes: "Certificate looks valid, needs manager approval.",
    conversation: [
      { sender: "User", time: "Yesterday", text: "Uploaded renewed certificate." }
    ]
  },
  {
    id: "VR-8903",
    userName: "City Hospital",
    userType: "Hospital",
    issueType: "Facility Registration",
    status: "Missing Documents",
    statusColor: "bg-orange-100 text-orange-700",
    date: "2023-10-22",
    documents: ["Hospital_Reg.pdf"],
    rejectionReason: null,
    internalNotes: "Fire safety NOC is missing.",
    conversation: [
      { sender: "Support", time: "Oct 22", text: "Please upload your Fire Safety NOC." }
    ]
  },
  {
    id: "VR-8904",
    userName: "Dr. Sarah Johnson",
    userType: "Doctor",
    issueType: "Specialist Certification",
    status: "Rejected",
    statusColor: "bg-red-100 text-red-700",
    date: "2023-10-20",
    documents: ["Cert_Upload_1.pdf"],
    rejectionReason: "Document uploaded is blurred and unreadable.",
    internalNotes: "Asked user to re-upload clear scanned copy.",
    conversation: [
      { sender: "Support", time: "Oct 21", text: "Your document is blurred. Please re-upload a clear scanned copy." }
    ]
  },
  {
    id: "VR-8905",
    userName: "Apollo Care",
    userType: "Clinic",
    issueType: "Address Proof Verification",
    status: "Approved",
    statusColor: "bg-emerald-100 text-emerald-700",
    date: "2023-10-18",
    documents: ["Utility_Bill.pdf", "Rental_Agreement.pdf"],
    rejectionReason: null,
    internalNotes: "All documents verified successfully.",
    conversation: [
      { sender: "System", time: "Oct 19", text: "Verification Approved." }
    ]
  }
];
