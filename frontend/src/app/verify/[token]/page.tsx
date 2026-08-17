export default async function VerifyDocumentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let result: {
    valid: boolean;
    documentNo: string;
    documentType: string;
    patientName?: string;
    facilityName?: string;
    signerName?: string;
    issuedAt: string;
    contentHash: string;
  } | null = null;
  try {
    const response = await fetch(`https://localhost:4000/api/documents/verify/${encodeURIComponent(token)}`, { cache: "no-store" });
    if (response.ok) result = await response.json();
  } catch {}
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6"><section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">{result?.valid ? <><div className="mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2Icon /></div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Authentic MedicalDocs record</p><h1 className="mt-2 text-2xl font-black text-slate-950">{result.documentType.replaceAll("_", " ")}</h1><dl className="mt-6 grid gap-4 text-sm">{Object.entries({ "Document no.": result.documentNo, Patient: result.patientName, Facility: result.facilityName, Signer: result.signerName, Issued: new Date(result.issuedAt).toLocaleString("en-IN") }).map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b pb-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-slate-900">{String(value || "—")}</dd></div>)}</dl><p className="mt-6 break-all rounded-xl bg-slate-50 p-3 font-mono text-[10px] text-slate-500">SHA-256 {result.contentHash}</p></> : <><h1 className="text-2xl font-black text-red-700">Document could not be verified</h1><p className="mt-2 text-slate-500">The token is invalid or the document has been revoked.</p></>}</section></main>;
}
function CheckCircle2Icon() { return <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>; }
