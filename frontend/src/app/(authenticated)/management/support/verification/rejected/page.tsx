"use client";

import VerificationList from "../VerificationList";
import { verificationRequests } from "../data";

export default function RejectedVerificationPage() {
  const rejectedRequests = verificationRequests.filter(req => req.status === "Rejected");
  return <VerificationList requests={rejectedRequests} />;
}
