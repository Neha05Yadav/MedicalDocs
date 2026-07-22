import EscalationDetailsClient from "../../../components/EscalationDetailsClient";

export default async function AccountsAssignedEscalationDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EscalationDetailsClient role="accounts" id={id} />;
}
