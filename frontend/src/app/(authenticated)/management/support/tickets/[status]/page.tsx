"use client";

import { use, useCallback, useEffect, useState } from "react";
import TicketList from "../TicketList";
import { toast } from "sonner";

export default function TicketStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const resolvedParams = use(params);
  const statusSlug = resolvedParams.status; // e.g. "open", "in-progress"
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Convert slug to original status string
  // e.g., "in-progress" -> "In Progress", "open" -> "Open"
  const formattedStatus = statusSlug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch("/api/support-tickets", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Tickets could not be loaded.");
      const data = await response.json();
      setTickets((Array.isArray(data) ? data : []).filter(ticket => String(ticket.status).toLowerCase() === formattedStatus.toLowerCase()));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Tickets could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [formattedStatus]);

  useEffect(() => { void fetchTickets(); }, [fetchTickets]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading live tickets…</div>;
  return <TicketList tickets={tickets} onRefresh={fetchTickets} />;
}
