"use client";

import { Suspense } from "react";
import TicketList from "./TicketList";
import { mockTickets } from "./data";

export default function TicketManagementAll() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketList tickets={mockTickets} />
    </Suspense>
  );
}
