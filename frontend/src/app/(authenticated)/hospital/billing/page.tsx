import { BillingWorkspace } from "@/components/BillingWorkspace";

export default async function HospitalBillingPage({ searchParams }: { searchParams: Promise<{ patientId?: string }> }) {
  const params = await searchParams;
  return <BillingWorkspace selectedPatientId={params.patientId || ""} />;
}
