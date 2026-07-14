"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FileText = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>;
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>;
const X = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>;

export default function PrescriptionsClient() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [uploadDoctor, setUploadDoctor] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [selectedPrescriptionDetails, setSelectedPrescriptionDetails] = useState<any | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      const res = await fetch("/api/patient/prescriptions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      const data = await res.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/patient/prescriptions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: uploadId,
          doctor: uploadDoctor,
          date: uploadDate
        })
      });

      if (!res.ok) throw new Error("Failed to add prescription");
      
      toast.success("Prescription added successfully!");
      setShowUpload(false);
      setUploadId("");
      setUploadDoctor("");
      setUploadDate("");
      fetchPrescriptions();
    } catch (e) {
      toast.error("Failed to save prescription");
    } finally {
      setIsPending(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12.9 4.2C12.5 3.4 11.5 3.4 11.1 4.2L2.3 19.8c-.4.8.1 1.8 1 1.8h17.4c.9 0 1.4-1 1-1.8L12.9 4.2z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Could not load prescriptions</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-xs">Please make sure the server is running and try again.</p>
        <button
          onClick={fetchPrescriptions}
          className="px-5 py-2 bg-[#0891b2] text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl ring-1 ring-black/5 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-slate-900">Upload New Prescription</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleAddPrescription} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Prescription ID *</label>
                <input
                  type="text"
                  value={uploadId}
                  onChange={(e) => setUploadId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  placeholder="e.g. PRE003"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor Name *</label>
                <input
                  type="text"
                  value={uploadDoctor}
                  onChange={(e) => setUploadDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  placeholder="e.g. Dr. Rajesh Kumar"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date *</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-700"
                  required
                />
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-[#0891b2] text-white rounded-xl text-sm font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prescriptions by ID or Doctor..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0891b2]/20 focus:border-[#0891b2] shadow-sm"
          />
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-[#0891b2] text-white rounded-lg font-semibold text-sm hover:bg-cyan-700 transition-colors"
        >
          Add Prescription
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Prescription ID</th>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="size-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="size-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 mb-1">No prescriptions yet</p>
                      <p className="text-xs text-slate-400 mb-4">Click "Add Prescription" to add your first one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0891b2] flex items-center gap-2">
                    <div className="size-8 bg-cyan-50 text-[#0891b2] rounded-lg flex items-center justify-center border border-cyan-100/50">
                       <FileText className="size-4" />
                    </div>
                    {prescription.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {prescription.doctor}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {prescription.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setSelectedPrescriptionDetails(prescription)}
                        className="p-1.5 text-[#0891b2] border border-[#0891b2]/20 rounded-md hover:bg-cyan-50 transition-colors inline-flex items-center justify-center"
                        title="View Prescription"
                      >
                        <Eye className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Hospital Prescriptions</h2>
        {prescriptions.filter(p => p.hospitalType === 'HOSPITAL').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.filter(p => p.hospitalType === 'HOSPITAL').map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPrescriptionDetails(p)}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{p.id}</h3>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{p.hospitalName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 uppercase">{p.date}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{p.doctor}</span>
                  <span className="text-[#0891b2] text-xs font-bold uppercase hover:underline">View Details</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <FileText className="size-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No hospital prescriptions found.</p>
            <p className="text-xs text-slate-400 mt-1">Prescriptions saved by hospitals will appear here.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Clinic Prescriptions</h2>
        {prescriptions.filter(p => p.hospitalType === 'CLINIC').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.filter(p => p.hospitalType === 'CLINIC').map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedPrescriptionDetails(p)}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{p.id}</h3>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{p.hospitalName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 uppercase">{p.date}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{p.doctor}</span>
                  <span className="text-[#0891b2] text-xs font-bold uppercase hover:underline">View Details</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <FileText className="size-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No clinic prescriptions found.</p>
            <p className="text-xs text-slate-400 mt-1">Prescriptions saved by clinics will appear here.</p>
          </div>
        )}
      </div>
      {/* PRESCRIPTION DETAILS MODAL */}
      {selectedPrescriptionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="size-5 text-[#0891b2]" />
                Prescription Details
              </h3>
              <button 
                onClick={() => setSelectedPrescriptionDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prescription ID</p>
                  <p className="text-sm font-semibold text-[#0891b2]">{selectedPrescriptionDetails.id}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedPrescriptionDetails.date}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor Name</p>
                <p className="text-base font-semibold text-slate-900">{selectedPrescriptionDetails.doctor}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  selectedPrescriptionDetails.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {selectedPrescriptionDetails.status}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={() => setSelectedPrescriptionDetails(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
