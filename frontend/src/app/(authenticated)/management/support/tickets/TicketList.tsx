import { Badge } from "@/components/ui/badge";

export default function TicketList({ tickets }: { tickets: any[] }) {
  return (
    <div className="rounded-md border">
      <div className="p-4 border-b bg-slate-50 grid grid-cols-7 font-medium text-sm text-slate-500">
        <div className="col-span-2">Ticket details</div>
        <div>User Type</div>
        <div>User Name</div>
        <div>Issue</div>
        <div>Status</div>
        <div>Created</div>
      </div>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div key={ticket.id} className="p-4 border-b last:border-0 grid grid-cols-7 items-center text-sm gap-2">
            <div className="col-span-2 pr-2 overflow-hidden">
              <div className="font-medium text-slate-900 truncate" title={ticket.title}>{ticket.title}</div>
              <div className="text-slate-500">#{ticket.id}</div>
            </div>
            <div>
              <Badge variant="outline" className="text-slate-500 font-normal bg-white">{ticket.userType}</Badge>
            </div>
            <div className="truncate pr-2 font-medium text-slate-700" title={ticket.raisedBy}>{ticket.raisedBy}</div>
            <div className="truncate pr-2">{ticket.issue}</div>
            <div>
              <Badge className={`${ticket.statusColor} border-none`}>{ticket.status}</Badge>
            </div>
            <div className="text-slate-500 whitespace-nowrap">{ticket.time}</div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-slate-500">
          No tickets found for this status.
        </div>
      )}
    </div>
  );
}
