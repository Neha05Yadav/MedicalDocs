import EscalationDetailsClient from "../../../components/EscalationDetailsClient";

export default function AccountsAssignedEscalationDetails({ params }: { params: { id: string } }) {
  return <EscalationDetailsClient role="accounts" id={params.id} />;
}
