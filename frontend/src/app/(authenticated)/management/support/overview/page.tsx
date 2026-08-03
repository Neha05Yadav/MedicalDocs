"use client";

import React, { useEffect, useState } from "react";

const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const CheckCircle2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const Ticket = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DelayedRender } from "@/components/DelayedRender";
import { toast } from "sonner";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/support-tickets", {
          cache: "no-store",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (e) {
        toast.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };
    void fetchTickets();
    const refreshTimer = window.setInterval(() => void fetchTickets(), 10000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "Open").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const resolved = tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

  const highPriority = tickets.filter(t => t.priority === "High" && t.status !== "Closed").slice(0, 5);
  const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { title: "Total Tickets", value: totalTickets.toString(), icon: Ticket, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Open Tickets", value: openTickets.toString(), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "In Progress", value: inProgress.toString(), icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Resolved / Closed", value: resolved.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Open": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Open</Badge>;
      case "In Progress": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Progress</Badge>;
      case "Resolved": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Resolved</Badge>;
      case "Closed": return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <DelayedRender>
      {loading ? (
        <div className="text-center p-12 text-slate-500">Loading metrics...</div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highPriority.length > 0 ? highPriority.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="overflow-hidden pr-4">
                      <div className="font-medium text-slate-900 truncate" title={ticket.subject}>{ticket.subject}</div>
                      <div className="text-sm text-slate-500 mt-1">{ticket.ticketId} • {timeAgo(ticket.createdAt)}</div>
                    </div>
                    <Badge variant="destructive" className="shrink-0">High Priority</Badge>
                  </div>
                )) : <div className="text-sm text-slate-500">No high priority tickets found.</div>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.length > 0 ? recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="overflow-hidden pr-4">
                      <div className="font-medium text-slate-900 truncate" title={ticket.subject}>{ticket.subject}</div>
                      <div className="text-sm text-slate-500 mt-1">{ticket.ticketId} • {timeAgo(ticket.createdAt)}</div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(ticket.status)}</div>
                  </div>
                )) : <div className="text-sm text-slate-500">No recent tickets found.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
        </>
      )}
      </DelayedRender>
    </div>
  );
}
