"use client";

import VerificationList from "./VerificationList";
import { verificationRequests } from "./data";

export default function VerificationAllPage() {
  return <VerificationList requests={verificationRequests} />;
}
