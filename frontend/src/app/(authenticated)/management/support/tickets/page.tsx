"use client";

import { Suspense, useEffect, useState } from "react";
import TicketList from "./TicketList";
import { toast } from "sonner";

export default function TicketManagementAll() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/support-tickets", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading tickets...</div>
      ) : (
        <TicketList tickets={tickets} onRefresh={fetchTickets} />
      )}
    </Suspense>
  );
}
