"use client";

import { use } from "react";
import TicketList from "../TicketList";
import { mockTickets } from "../data";

export default function TicketStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const resolvedParams = use(params);
  const statusSlug = resolvedParams.status; // e.g. "open", "in-progress"
  
  // Convert slug to original status string
  // e.g., "in-progress" -> "In Progress", "open" -> "Open"
  const formattedStatus = statusSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const filteredTickets = mockTickets.filter(t => t.status.toLowerCase() === formattedStatus.toLowerCase());

  return <TicketList tickets={filteredTickets} />;
}
