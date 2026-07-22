import EscalationDetailsClient from "../../../components/EscalationDetailsClient";

export default async function AdminAssignedEscalationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EscalationDetailsClient role="admin" id={id} />;
}
