"use client";

import VerificationList from "../VerificationList";
import { verificationRequests } from "../data";

export default function PendingVerificationPage() {
  const pendingRequests = verificationRequests.filter(req => 
    ["Under Review", "Pending Verification", "Missing Documents"].includes(req.status)
  );
  return <VerificationList requests={pendingRequests} />;
}
