import EscalationDetailsClient from "../../../components/EscalationDetailsClient";

export default function AdminAssignedEscalationDetails({ params }: { params: { id: string } }) {
  return <EscalationDetailsClient role="admin" id={params.id} />;
}
