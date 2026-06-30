"use client";




const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const MessageSquare = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path></svg>;
const AlertCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>;
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export default function VerificationList({ requests }: { requests: any[] }) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleRowClick = (req: any) => {
    setSelectedRequest(req);
    setIsDialogOpen(true);
  };
  return (
    <>
      <div className="rounded-md border bg-white mt-0">
        <div className="p-4 border-b bg-slate-50 grid grid-cols-6 font-medium text-sm text-slate-500">
          <div>Request ID</div>
          <div className="col-span-2">User Details</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Date</div>
        </div>
        {requests.length > 0 ? (
          requests.map((req) => (
            <div 
              key={req.id} 
              className="p-4 border-b last:border-0 grid grid-cols-6 items-center text-sm gap-2 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => handleRowClick(req)}
            >
              <div className="font-medium text-slate-900">{req.id}</div>
              <div className="col-span-2 pr-2">
                <div className="font-semibold text-slate-900">{req.userName}</div>
                <div className="text-slate-500 text-xs mt-0.5">{req.userType}</div>
              </div>
              <div className="truncate pr-2">{req.issueType}</div>
              <div>
                <Badge className={`${req.statusColor} hover:${req.statusColor} border-none shadow-none`}>{req.status}</Badge>
              </div>
              <div className="text-slate-500 flex justify-between items-center">
                {req.date}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">No requests found in this category.</div>
        )}
      </div>
      {/* Details Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4 border-b">
            <div className="flex justify-between items-start pr-6">
              <div>
                <DialogTitle className="text-xl">Request Details</DialogTitle>
                <DialogDescription className="mt-1.5 text-slate-500 font-mono text-xs">
                  ID: {selectedRequest?.id} • Created: {selectedRequest?.date}
                </DialogDescription>
              </div>
              {selectedRequest && (
                <Badge className={`${selectedRequest.statusColor} border-none shadow-none`}>
                  {selectedRequest.status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* User Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">User Details</h4>
                  <div className="text-sm text-slate-600">{selectedRequest.userName}</div>
                  <div className="text-xs text-slate-500">{selectedRequest.userType}</div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Issue Type</h4>
                  <div className="text-sm text-slate-600">{selectedRequest.issueType}</div>
                </div>
              </div>
              {/* Rejected Alert */}
              {selectedRequest.status === "Rejected" && selectedRequest.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">Rejection Reason</h4>
                    <p className="text-sm text-red-700 mt-1">{selectedRequest.rejectionReason}</p>
                    <p className="text-xs text-red-600 mt-2 font-medium">Action Required: User needs to correct and resubmit.</p>
                  </div>
                </div>
              )}
              {/* Documents */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Uploaded Documents
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.documents.map((doc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-md text-sm text-blue-600 hover:underline cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Internal Notes */}
                <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Internal Notes</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">{selectedRequest.internalNotes}</p>
                </div>
                {/* Support Conversation */}
                <div className="border p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Recent Communication
                  </h4>
                  <div className="space-y-3">
                    {selectedRequest.conversation.map((msg: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-slate-700">{msg.sender}:</span>{" "}
                        <span className="text-slate-600">{msg.text}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{msg.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
