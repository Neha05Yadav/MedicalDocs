"use client";

import { useParams } from "next/navigation";
import { PrescriptionDetails } from "../../_components/PharmacyUI";

export default function PrescriptionDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(String(params?.id || ""));
  return <PrescriptionDetails id={id} />;
}
