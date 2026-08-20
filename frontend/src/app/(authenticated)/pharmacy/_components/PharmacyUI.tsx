"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Bell, Boxes, CheckCircle2, Clock3, CreditCard, Download, FileText, IndianRupee, MapPin, PackageCheck, Pill, Plus, Search, Send, ShoppingBag, Truck, Upload, UserRound, X } from "lucide-react";
import { alternativeCatalog, inventory, medicines, notifications, orders, patients, quotations, requests } from "./pharmacy-data";

export type PharmacyView = "overview" | "requests" | "quotations" | "orders" | "inventory" | "alternatives" | "deliveries" | "billing" | "patients" | "notifications" | "analytics" | "profile";

const alternativeRequestStorageKey = () => {
  if (typeof window === "undefined") return "pharmacyAlternativeMedicineRequests:current";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const accountId = user.id || user.hospitalId || user.email || "current";
    return `pharmacyAlternativeMedicineRequests:${String(accountId)}`;
  } catch {
    return "pharmacyAlternativeMedicineRequests:current";
  }
};

const badgeTone = (status: string) => {
  const value = status.toLowerCase();
  if (["accepted", "paid", "delivered", "completed", "in stock", "available"].some((item) => value.includes(item))) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["new", "viewed", "preparing", "out for delivery", "quotation sent"].some((item) => value.includes(item))) return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  if (["pending", "partial", "low stock", "near expiry", "ready"].some((item) => value.includes(item))) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
};

const Badge = ({ children }: { children: React.ReactNode }) => <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset ${badgeTone(String(children))}`}>{children}</span>;

const Page = ({ actions, children }: { title?: string; eyebrow?: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }) => (
  <div className="min-h-0 space-y-6">
    {actions && <div className="flex flex-wrap justify-end gap-2">{actions}</div>}
    {children}
  </div>
);

const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => <label className="relative block w-full sm:w-80"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/></label>;

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;

const EmptySafeTable = ({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) => <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">{columns.map((column, columnIndex) => <th key={`${column}-${columnIndex}`} className="px-5 py-4">{column}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index} className="transition hover:bg-emerald-50/25">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 text-slate-600">{cell}</td>)}</tr>)}</tbody></table></div>;

const ActionLink = ({ href, label = "Open" }: { href: string; label?: string }) => <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">{label}<ArrowRight className="size-3.5"/></Link>;

// Keep the public prescription number identical across Patient and Pharmacy portals.
// The database UUID remains the internal reference and is never changed here.
const publicPrescriptionId = (value: unknown) => {
  const raw = String(value ?? "").trim().toUpperCase();
  if (!raw) return "Not available";
  const numericMatch = raw.match(/^RX-?(\d+)$/) || raw.match(/^(\d+)$/);
  if (numericMatch) {
    const numericValue = Number(numericMatch[1]);
    if (Number.isSafeInteger(numericValue) && numericValue >= 0 && numericValue <= 99999) {
      return `RX${String(numericValue).padStart(5, "0")}`;
    }
  }
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return `RX${String(10000 + (hash % 90000)).padStart(5, "0")}`;
};

export default function PharmacyUI({ view }: { view: PharmacyView }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  if (view === "overview") return <Overview/>;
  if (view === "requests") return <Requests query={query} setQuery={setQuery} filter={filter} setFilter={setFilter}/>;
  if (view === "quotations") return <Quotations query={query} setQuery={setQuery} filter={filter} setFilter={setFilter}/>;
  if (view === "orders") return <Orders query={query} setQuery={setQuery} filter={filter} setFilter={setFilter}/>;
  if (view === "inventory") return <Inventory query={query} setQuery={setQuery}/>;
  if (view === "alternatives") return <Alternatives/>;
  if (view === "deliveries") return <Deliveries/>;
  if (view === "billing") return <Billing/>;
  if (view === "patients") return <Patients query={query} setQuery={setQuery}/>;
  if (view === "notifications") return <Notifications/>;
  if (view === "analytics") return <Analytics/>;
  return <Profile/>;
}

function Overview() {
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/pharmacy/prescription-requests", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : [])
      .then((rows) => setRecentRequests((Array.isArray(rows) ? rows : []).slice(0, 3)))
      .catch(() => setRecentRequests([]));
  }, []);
  const metrics = [
    ["New Requests", "12", FileText, "text-blue-600 bg-blue-50"], ["Pending Quotations", "7", Clock3, "text-amber-600 bg-amber-50"], ["Accepted Orders", "18", PackageCheck, "text-emerald-600 bg-emerald-50"], ["Preparing Orders", "6", Boxes, "text-violet-600 bg-violet-50"],
    ["Out for Delivery", "4", Truck, "text-cyan-600 bg-cyan-50"], ["Completed Orders", "31", CheckCircle2, "text-green-600 bg-green-50"], ["Today's Revenue", "₹28,640", IndianRupee, "text-teal-600 bg-teal-50"], ["Low Stock Medicines", "9", AlertTriangle, "text-rose-600 bg-rose-50"],
  ] as const;
  return <Page title="Pharmacy operations" eyebrow="MediDoc Pharmacy" description="Receive patient-shared prescriptions, quote medicines and manage fulfilment without accessing complete medical history.">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, Icon, tone]) => <Card key={label} className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-3 text-2xl font-black text-slate-950">{value}</p></div><span className={`rounded-xl p-3 ${tone}`}><Icon className="size-5"/></span></div></Card>)}</div>
    <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_19rem] 2xl:grid-cols-[minmax(0,1fr)_21rem]">
      <Card className="min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"><div><h2 className="font-black text-slate-900">Recent prescription requests</h2><p className="mt-1 text-xs text-slate-500">Prescriptions explicitly shared for medicine ordering</p></div><ActionLink href="/pharmacy/prescription-requests" label="View all"/></div>
        <EmptySafeTable columns={["Request","Patient","Doctor","Location","Delivery","Status","Action"]} rows={recentRequests.map((row) => [<b key="id" className="text-slate-900">{row.requestGroupId || row.id}</b>, row.patient, <span key="doc">{row.doctorName || "Prescribing Doctor"}<small className="mt-1 block text-slate-400">{row.facilityName || "Healthcare Facility"}</small></span>, <span key="loc" className="block max-w-52 leading-6">{row.patientAddress || row.location || "Address on record"}</span>, <span key="delivery" className="block leading-6">Home delivery</span>, <Badge key="s">{row.status}</Badge>, <ActionLink key="a" href={`/pharmacy/prescription-requests/${row.id}`}/>])}/>
      </Card>
      <MiniCharts/>
    </div>
    <Card><div className="flex items-center justify-between border-b p-5"><h2 className="font-black text-slate-900">Recent orders</h2><ActionLink href="/pharmacy/orders" label="Manage orders"/></div><EmptySafeTable columns={["Order","Patient","Amount","Payment","Delivery","Status","Date","Action"]} rows={orders.map((row) => [<b key="id" className="text-slate-900">{row.id}</b>,row.patient,row.amount,<Badge key="p">{row.payment}</Badge>,row.delivery,<Badge key="s">{row.status}</Badge>,row.date,<ActionLink key="a" href="/pharmacy/orders"/>])}/></Card>
  </Page>;
}

function MiniCharts() {
  const bars=[52,68,43,76,89,64,94];
  const days=["M","T","W","T","F","S","S"];
  return <Card className="flex min-h-[28rem] flex-col overflow-hidden p-6">
    <div className="flex items-start justify-between gap-4">
      <div><h2 className="font-black text-slate-900">Weekly orders</h2><p className="mt-1 text-xs text-slate-500">Acceptance rate</p></div>
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700"><BarChart3 className="size-4"/><strong className="text-sm">78%</strong></div>
    </div>
    <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 pb-3 pt-5">
      <div className="flex h-40 items-end gap-2.5 border-b border-slate-200">
        {bars.map((height,index)=><div key={index} className="flex h-full flex-1 items-end justify-center"><div className="w-full max-w-6 rounded-t-md bg-gradient-to-t from-emerald-600 to-cyan-400 shadow-sm transition-all duration-300 hover:brightness-105" style={{height:`${height}%`}} title={`${height} orders score`}/></div>)}
      </div>
      <div className="mt-2.5 flex gap-2.5">{days.map((day,index)=><span key={`${day}-${index}`} className="flex-1 text-center text-[10px] font-extrabold text-slate-400">{day}</span>)}</div>
    </div>
    <div className="mt-auto rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4"><p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Top medicine</p><p className="mt-1.5 font-black text-slate-900">Telmisartan 40 mg</p><p className="mt-1 text-xs text-slate-500">146 strips sold this month</p></div>
  </Card>;
}function Requests({query,setQuery,filter,setFilter}:any) {
  const [liveRequests,setLiveRequests]=useState<any[]>([]);
  useEffect(()=>{
    const token=localStorage.getItem("token");
    fetch("/api/pharmacy/prescription-requests",{headers:{Authorization:`Bearer ${token}`}})
      .then(async response=>{
        const data=await response.json().catch(()=>[]);
        if(!response.ok)throw new Error(data?.message||"Could not load pharmacy requests.");
        return data;
      })
      .then(data=>setLiveRequests((Array.isArray(data)?data:[]).map((row:any,index:number)=>{
        const d=new Date(row.createdAt);
        const yy=String(d.getFullYear()).slice(-2);
        const mm=String(d.getMonth()+1).padStart(2,"0");
        const dd=String(d.getDate()).padStart(2,"0");
        const seq=String(index+1).padStart(3,"0");
        const isAccepted = row.status === "ACCEPTED";
        return{
          id:`RXR-${yy}${mm}${dd}-${seq}`,
          rawId:row.id,
          patientId:row.patientId,
          patient:row.patient,
          prescription:publicPrescriptionId(row.prescription),
          doctor:row.doctorName||`Dr. ${row.patient}`,
          facility:row.facilityName||(row.facilityType?`${row.facilityType}`:"Self-uploaded"),
          location:row.location,
          date:d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
          delivery:"Home delivery",
          status: isAccepted ? "Accepted" : String(row.status||"NEW").toLowerCase()==="new"?"New":row.status === "QUOTATION_SENT" ? "Quotation Sent" : row.status
        };
      })))
      .catch(error=>toast.error(error.message));
  },[]);
  const visible=liveRequests.filter(row=>JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Prescription Requests" eyebrow="Patient-shared access" description="Only prescriptions shared by patients for medicine fulfilment are visible. Complete medical history remains private." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search requests..."/>}><Card><EmptySafeTable columns={["Request ID","Patient","Prescription","Doctor / Facility","Location","Requested","Delivery","Status","Action"]} rows={visible.map((row, index)=>[<b key={`req-${row.id}-${index}`}>{row.id}</b>,<span key={`patient-${index}`}>{row.patient}<small className="block font-semibold text-slate-400">{row.patientId}</small></span>,row.prescription,<span key={`doc-${index}`}>{row.doctor}<small className="block text-slate-400">{row.facility}</small></span>,row.location,row.date,row.delivery,<Badge key={`badge-${index}`}>{row.status}</Badge>,<ActionLink key={`act-${index}`} href={`/pharmacy/prescription-requests/${row.rawId||row.id}`}/>])}/></Card></Page>;
}function Quotations({query,setQuery,filter,setFilter}:any) {
  const [liveQuotations,setLiveQuotations]=useState<any[]>([]);
  const [savedActions,setSavedActions]=useState<any[]>([]);
  const [confirmedOrderId,setConfirmedOrderId]=useState("");

  useEffect(()=>{
    try {
      const actions=JSON.parse(localStorage.getItem("pharmacyQuotationActions")||"[]");
      setSavedActions(actions.filter((item:any)=>item.status!=="Rejected"));
    } catch {}
    try {
      const confirmedObj=JSON.parse(localStorage.getItem("pharmacyConfirmedOrder")||"{}");
      if(confirmedObj?.id) setConfirmedOrderId(confirmedObj.id);
    } catch {}

    const token=localStorage.getItem("token");
    if(!token) return;
    fetch("/api/pharmacy/quotations",{headers:{Authorization:`Bearer ${token}`}})
      .then(async res=>{
        const data=await res.json().catch(()=>[]);
        if(Array.isArray(data)) setLiveQuotations(data);
      })
      .catch(()=>{});
  },[]);

  const mappedLive=liveQuotations.map((q:any)=>({
    id:q.id,
    requestId:q.requestId,
    patient:q.patient,
    prescription:publicPrescriptionId(q.prescription),
    amount:`₹${Number(q.totalAmount).toLocaleString("en-IN")}`,
    sent:new Date(q.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
    valid:"6 hours",
    response:q.status==="ACCEPTED"?"Accepted by Patient":q.status==="REJECTED"?"Rejected":"Awaiting response",
    status:q.status==="ACCEPTED"?"Accepted":q.status==="SENT"?"Pending":q.status
  }));

  const mappedLocal=savedActions.map((item:any,index:number)=>{
    const isAccepted=item.status==="Accepted" || Boolean(confirmedOrderId);
    return {
      id:item.id||`QUO-SAVED-${index+1}`,
      patient:item.patient||requests[0]?.patient||"Patient",
      prescription:publicPrescriptionId(item.prescription||requests[0]?.prescription),
      amount:item.formattedAmount||`₹${Number(item.amount||0).toLocaleString("en-IN")}`,
      sent:item.sent||new Date(item.updatedAt||Date.now()).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
      valid:item.valid||"6 hours",
      response:isAccepted?"Accepted by Patient":item.response||"Awaiting response",
      status:isAccepted?"Accepted":item.status==="Quotation Sent"?"Pending":item.status||"Draft"
    };
  });

  const allRows=mappedLive;
  const statuses=["All","Pending","Accepted","Rejected","Expired"];
  const visible=allRows.filter(row=>(filter==="All"||String(row.status).toLowerCase()===filter.toLowerCase())&&JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Quotations" eyebrow="Pricing workspace" description="Prepare transparent medicine pricing and track patient responses." actions={<><SearchBar value={query} onChange={setQuery} placeholder="Search quotations..."/><ActionLink href="/pharmacy/quotations/create" label="Create quotation"/></>}><div className="flex flex-wrap gap-2">{statuses.map(status=><button key={status} onClick={()=>setFilter(status)} className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${filter===status?"bg-emerald-600 text-white shadow-sm":"border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"}`}>{status}</button>)}</div><Card><EmptySafeTable columns={["Quotation","Patient","Prescription","Amount","Sent","Valid until","Patient response","Status","Action"]} rows={visible.map((row, index)=>[<b key={`quo-id-${index}`}>{row.id}</b>,row.patient,row.prescription,<b key={`quo-amt-${index}`}>{row.amount}</b>,row.sent,row.valid,row.response,<Badge key={`quo-badge-${index}`}>{row.status}</Badge>,<ActionLink key={`quo-act-${index}`} href={`/pharmacy/quotations/create?requestId=${encodeURIComponent(row.requestId)}&quotationId=${encodeURIComponent(row.id)}`}/>])}/></Card></Page>;
}

function Orders({query,setQuery,filter,setFilter}:any) {
  const [liveOrders,setLiveOrders]=useState<any[]>([]);
  const [confirmedOrder,setConfirmedOrder]=useState<any>(null);
  const [selectedOrder,setSelectedOrder]=useState<any>(null);
  const [paymentFilter,setPaymentFilter]=useState("All Payments");
  const [deliveryFilter,setDeliveryFilter]=useState("All Delivery");
  const [statusFilter,setStatusFilter]=useState("All Statuses");

  useEffect(()=>{
    try {
      const obj=JSON.parse(localStorage.getItem("pharmacyConfirmedOrder")||"null");
      setConfirmedOrder(obj);
    } catch {}

    const token=localStorage.getItem("token");
    if(!token) return;
    fetch("/api/pharmacy/orders",{headers:{Authorization:`Bearer ${token}`}})
      .then(async res=>{
        const data=await res.json().catch(()=>[]);
        if(Array.isArray(data)) setLiveOrders(data);
      })
      .catch(()=>{});
  },[]);

  const mappedLive=liveOrders.map((o:any)=>({
    id:o.id,
    quotationId:o.quotationId, requestGroupId:o.requestGroupId, patientId:o.patientId,
    patient:o.patient,
    patientPhone:o.patientPhone, patientAddress:o.patientAddress||o.deliveryAddress,
    prescription:o.prescription,
    totalAmount:Number(o.totalAmount||0), subtotal:Number(o.subtotal||0), discountAmount:Number(o.discountAmount||0), taxAmount:Number(o.taxAmount||0), deliveryCharge:Number(o.deliveryCharge||0),
    items:(()=>{if(Array.isArray(o.itemsJson))return o.itemsJson;try{return JSON.parse(o.itemsJson||"[]");}catch{return [];}})(),
    pharmacyNotes:o.pharmacyNotes, requestNote:o.requestNote,
    amount:`₹${Number(o.totalAmount).toLocaleString("en-IN")}`,
    payment:"Paid",
    delivery:"Home delivery",
    status:o.status==="CONFIRMED"?"Confirmed":o.status,
    date:new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
  }));

  const localConfirmedArr=confirmedOrder?[{
    id:confirmedOrder.id||"ORD-CONFIRMED-01",
    patient:confirmedOrder.patient||requests[0]?.patient||"Patient",
    prescription:confirmedOrder.prescription||"RX-874521",
    amount:`₹${Number(confirmedOrder.amount||1248).toLocaleString("en-IN")}`,
    payment:"Paid",
    delivery:"Home delivery",
    status:"Confirmed",
    date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
  }]:[];

  const paymentOptions=["All Payments","Payment Pending","Paid"];
  const deliveryOptions=["All Delivery","Home delivery","Store pickup"];
  const statusOptions=["All Statuses","Confirmed","Preparing","Ready for Pickup","Out for Delivery","Delivered","Cancelled"];
  const allOrders=mappedLive;
  const normalize=(value:any)=>String(value||"").replaceAll("_"," ").trim().toLowerCase();
  const visible=allOrders.filter(row=>
    (paymentFilter==="All Payments"||normalize(row.payment)===normalize(paymentFilter))&&
    (deliveryFilter==="All Delivery"||normalize(row.delivery)===normalize(deliveryFilter))&&
    (statusFilter==="All Statuses"||normalize(row.status)===normalize(statusFilter))&&
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
  );
  const FilterSelect=({label,options,value,onChange}:{label:string;options:string[];value:string;onChange:(option:string)=>void})=><label className="flex min-w-0 flex-col gap-2"><span className="text-[11px] font-black uppercase tracking-wider text-slate-500">{label}</span><select value={value} onChange={event=>onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">{options.map(option=><option key={option} value={option}>{option}</option>)}</select></label>;
  return <Page title="Orders" eyebrow="Medicine fulfilment" description="Manage confirmed orders through payment, preparation, pickup or delivery." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search orders..."/>}><div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3"><FilterSelect label="Payment" options={paymentOptions} value={paymentFilter} onChange={setPaymentFilter}/><FilterSelect label="Delivery" options={deliveryOptions} value={deliveryFilter} onChange={setDeliveryFilter}/><FilterSelect label="Order status" options={statusOptions} value={statusFilter} onChange={setStatusFilter}/></div><Card><EmptySafeTable columns={["Order","Patient","Prescription","Amount","Payment","Delivery","Status","Date","Action"]} rows={visible.map((row, index)=>[<b key={`ord-id-${index}`}>{row.id}</b>,row.patient,row.prescription,row.amount,<Badge key={`ord-pay-${index}`}>{row.payment}</Badge>,row.delivery,<Badge key={`ord-badge-${index}`}>{row.status}</Badge>,row.date,<button key={`ord-act-${index}`} type="button" onClick={()=>setSelectedOrder(row)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Open<ArrowRight className="size-3.5"/></button>])}/></Card>{selectedOrder&&<OrderDetailsModal order={selectedOrder} onClose={()=>setSelectedOrder(null)}/>}</Page>;
}

function OrderDetailsModal({order,onClose}:{order:any;onClose:()=>void}) {
  const money=(value:any)=>`₹${Number(value||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"><div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl"><header className="flex items-start justify-between border-b bg-gradient-to-r from-emerald-50 to-cyan-50 px-6 py-5"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Confirmed medicine order</p><h2 className="mt-1 text-2xl font-black text-slate-950">{order.id}</h2><p className="mt-1 text-sm text-slate-500">Quotation {order.quotationId} · Prescription {order.prescription}</p></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-700"><X className="size-5"/></button></header><div className="space-y-5 overflow-y-auto p-6"><div className="grid gap-4 md:grid-cols-2"><Card className="p-5"><h3 className="font-black text-slate-900">Patient & delivery</h3><dl className="mt-4 space-y-3 text-sm"><Info label="Patient" value={`${order.patient} (${order.patientId})`}/><Info label="Contact" value={order.patientPhone||"Not recorded"}/><Info label="Delivery address" value={order.patientAddress||"Not recorded"}/><Info label="Delivery mode" value={order.delivery}/></dl></Card><Card className="p-5"><h3 className="font-black text-slate-900">Order information</h3><dl className="mt-4 space-y-3 text-sm"><Info label="Status" value={String(order.status||"").replaceAll("_"," ")}/><Info label="Payment" value={order.payment}/><Info label="Created" value={order.date}/><Info label="Request group" value={order.requestGroupId||"—"}/></dl></Card></div><Card><div className="border-b p-5"><h3 className="font-black text-slate-900">Medicines</h3></div><div className="divide-y">{order.items.length?order.items.map((item:any,index:number)=><div key={`${item.medicineName}-${index}`} className="grid gap-3 p-5 text-sm sm:grid-cols-[1fr_auto_auto_auto]"><div><p className="font-black text-slate-900">{item.prescribedMedicineName||item.medicineName}</p>{item.isAlternative&&<p className="mt-1 text-xs font-bold text-amber-700">Substitute: {item.alternativeName} · {item.alternativeComposition}</p>}</div><Info label="Quantity" value={String(item.quantity||0)}/><Info label="Unit price" value={money(item.unitPrice)}/><Info label="Line total" value={money(Number(item.quantity||0)*Number(item.unitPrice||0))}/></div>):<p className="p-6 text-center text-sm text-slate-500">No medicine lines recorded.</p>}</div></Card><div className="grid gap-4 md:grid-cols-[1fr_360px]"><Card className="p-5"><h3 className="font-black text-slate-900">Notes</h3><p className="mt-3 text-sm text-slate-600">{order.pharmacyNotes||order.requestNote||"No additional notes."}</p></Card><Card className="p-5"><h3 className="font-black text-slate-900">Bill summary</h3><dl className="mt-4 space-y-3 text-sm"><Info label="Medicine subtotal" value={money(order.subtotal)}/><Info label="Discount" value={`− ${money(order.discountAmount)}`}/><Info label="GST" value={`+ ${money(order.taxAmount)}`}/><Info label="Delivery" value={`+ ${money(order.deliveryCharge)}`}/><div className="border-t pt-3"><Info label="Final payable" value={money(order.totalAmount)}/></div></dl></Card></div></div><footer className="flex justify-end border-t bg-slate-50 p-4"><button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white">Close</button></footer></div></div>;
}

function Inventory({ query, setQuery }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [quotationReturnPath, setQuotationReturnPath] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const medicineQuery = params.get("medicine")?.trim() || "";
    const returnTo = params.get("returnTo") || "";

    if (medicineQuery) setQuery(medicineQuery);
    if (returnTo === "/pharmacy/quotations/create" || returnTo.startsWith("/pharmacy/quotations/create?")) {
      setQuotationReturnPath(returnTo);
    }
  }, [setQuery]);

  const [form, setForm] = useState({
    medicine: "",
    brand: "",
    composition: "",
    strength: "",
    category: "General",
    batch: "",
    stock: "",
    minimum: "",
    expiry: "",
    mrp: "",
    price: "",
  });

  const [updateStockQty, setUpdateStockQty] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pharmacyCustomInventory") || "[]");
      setItems([...saved, ...inventory].filter((row, index, self) => 
        self.findIndex(t => t.medicine === row.medicine && t.batch === row.batch) === index
      ));
    } catch {
      setItems(inventory);
    }
  }, []);

  const saveInventoryToStorage = (newItems: any[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("pharmacyCustomInventory", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save inventory to localStorage", e);
    }
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicine || !form.stock || !form.price) {
      toast.error("Please fill in Medicine Name, Stock and Price.");
      return;
    }

    const stockNum = Number(form.stock || 0);
    const minNum = Number(form.minimum || 10);
    const status = stockNum === 0 ? "Out of Stock" : stockNum <= minNum ? "Low Stock" : "In Stock";

    const newItem = {
      medicine: form.medicine,
      brand: form.brand || form.medicine,
      composition: form.composition || form.medicine,
      strength: form.strength || "—",
      category: form.category || "General",
      batch: form.batch || `BCH-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: stockNum,
      minimum: minNum,
      expiry: form.expiry || "Dec 2027",
      mrp: form.mrp ? (form.mrp.startsWith("₹") ? form.mrp : `₹${form.mrp}`) : `₹${form.price}`,
      price: form.price ? (form.price.startsWith("₹") ? form.price : `₹${form.price}`) : `₹${form.mrp}`,
      status,
    };

    const updated = [newItem, ...items];
    saveInventoryToStorage(updated);
    toast.success(`"${newItem.medicine}" added to inventory!`);
    setIsAddModalOpen(false);
    setForm({
      medicine: "",
      brand: "",
      composition: "",
      strength: "",
      category: "General",
      batch: "",
      stock: "",
      minimum: "",
      expiry: "",
      mrp: "",
      price: "",
    });
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;
    const newQty = Number(updateStockQty);
    if (isNaN(newQty) || newQty < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    const updated = items.map((item) => {
      if (item.medicine === selectedMedicine.medicine && item.batch === selectedMedicine.batch) {
        const minNum = Number(item.minimum || 10);
        const status = newQty === 0 ? "Out of Stock" : newQty <= minNum ? "Low Stock" : "In Stock";
        return { ...item, stock: newQty, status };
      }
      return item;
    });

    saveInventoryToStorage(updated);
    toast.success(`Stock for ${selectedMedicine.medicine} updated to ${newQty}!`);
    setIsUpdateModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleExportCSV = () => {
    const headers = ["Medicine", "Brand", "Composition", "Strength", "Category", "Batch", "Stock", "Minimum", "Expiry", "MRP", "Price", "Status"];
    const rows = items.map(i => [i.medicine, i.brand, i.composition, i.strength, i.category, i.batch, i.stock, i.minimum, i.expiry, i.mrp, i.price, i.status]);
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pharmacy-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Inventory exported as CSV!");
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) {
          toast.error("CSV file is empty.");
          return;
        }
        const newImported: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map(c => c.replace(/^"|"$/g, "").trim());
          if (cols[0]) {
            const stockNum = Number(cols[6] || 0);
            const minNum = Number(cols[7] || 10);
            newImported.push({
              medicine: cols[0],
              brand: cols[1] || cols[0],
              composition: cols[2] || cols[0],
              strength: cols[3] || "—",
              category: cols[4] || "General",
              batch: cols[5] || `IMP-${i}`,
              stock: stockNum,
              minimum: minNum,
              expiry: cols[8] || "Dec 2027",
              mrp: cols[9] || "₹100",
              price: cols[10] || "₹90",
              status: stockNum === 0 ? "Out of Stock" : stockNum <= minNum ? "Low Stock" : "In Stock",
            });
          }
        }
        if (newImported.length > 0) {
          const merged = [...newImported, ...items];
          saveInventoryToStorage(merged);
          toast.success(`Imported ${newImported.length} medicines into inventory!`);
        }
      } catch {
        toast.error("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const visible = items.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Page
      actions={
        <>
          {quotationReturnPath && (
            <Link
              href={quotationReturnPath}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              <ArrowLeft className="size-4" />
              Back to Create Quotation
            </Link>
          )}
          <SearchBar value={query} onChange={setQuery} placeholder="Search inventory..." />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Medicine
          </button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-xl border bg-white px-4 py-2 text-xs font-bold transition hover:bg-slate-50 flex items-center gap-2">
          <Upload className="size-4 text-emerald-600" />
          Import Inventory
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
        </label>
        <button
          onClick={handleExportCSV}
          className="rounded-xl border bg-white px-4 py-2 text-xs font-bold transition hover:bg-slate-50 flex items-center gap-2"
        >
          <Download className="size-4 text-emerald-600" />
          Export Inventory
        </button>
      </div>

      <Card>
        <EmptySafeTable
          columns={["Medicine", "Brand / Composition", "Strength", "Category", "Batch", "Stock", "Expiry", "MRP / Selling", "Status", "Action"]}
          rows={visible.map((row) => [
            <b key="m" className="text-slate-900">{row.medicine}</b>,
            <span key="b">{row.brand}<small className="block text-slate-400">{row.composition}</small></span>,
            row.strength,
            row.category,
            row.batch,
            <span key="st"><b>{row.stock}</b><small className="block text-slate-400">Min {row.minimum}</small></span>,
            row.expiry,
            <span key="pr">{row.mrp}<small className="block font-bold text-emerald-600">{row.price}</small></span>,
            <Badge key="s">{row.status}</Badge>,
            <button
              key="a"
              onClick={() => {
                setSelectedMedicine(row);
                setUpdateStockQty(String(row.stock));
                setIsUpdateModalOpen(true);
              }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              Update stock
            </button>,
          ])}
        />
      </Card>

      {/* ADD MEDICINE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Pill className="size-5 text-emerald-600" />
                  Add New Medicine to Stock
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter details for pricing, batch, category, and minimum thresholds.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Medicine Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telmisartan 40 mg"
                    value={form.medicine}
                    onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Brand Name
                  <input
                    type="text"
                    placeholder="e.g. Telma 40"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Composition / Salt
                  <input
                    type="text"
                    placeholder="e.g. Telmisartan"
                    value={form.composition}
                    onChange={(e) => setForm({ ...form, composition: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Strength / Dosage
                  <input
                    type="text"
                    placeholder="e.g. 40 mg"
                    value={form.strength}
                    onChange={(e) => setForm({ ...form, strength: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  >
                    <option>General</option>
                    <option>Cardiac</option>
                    <option>Diabetes</option>
                    <option>Antibiotic</option>
                    <option>Gastro</option>
                    <option>Respiratory</option>
                    <option>Vitamins</option>
                    <option>Analgesic</option>
                  </select>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Batch Number
                  <input
                    type="text"
                    placeholder="e.g. TLM2608A"
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Expiry Date
                  <input
                    type="text"
                    placeholder="e.g. May 2028"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Current Stock *
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 100"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Min Threshold
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20"
                    value={form.minimum}
                    onChange={(e) => setForm({ ...form, minimum: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  MRP (₹)
                  <input
                    type="text"
                    placeholder="245"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Selling Price *
                  <input
                    type="text"
                    required
                    placeholder="221"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-medium outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STOCK MODAL */}
      {isUpdateModalOpen && selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50">
              <div>
                <h3 className="text-lg font-black text-slate-900">Update Stock Quantity</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedMedicine.medicine} ({selectedMedicine.batch})</p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                New Available Stock Quantity
                <input
                  type="number"
                  min="0"
                  required
                  value={updateStockQty}
                  onChange={(e) => setUpdateStockQty(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-lg font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>
              <p className="text-xs text-slate-400">Current threshold: Min {selectedMedicine.minimum} units</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
}

function Alternatives() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [selectedAlternatives, setSelectedAlternatives] = useState<Record<string, string>>({});
  const [addingFor, setAddingFor] = useState("");
  const [savingMedicine, setSavingMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ medicineName: "", brand: "", composition: "", batchNumber: "", stockQuantity: "", unitPrice: "" });
  const requestId = searchParams.get("requestId") || "";
  const prescribedMedicine = searchParams.get("medicine") || "";
  const itemIndex = searchParams.get("itemIndex") || "";
  const normalizeMedicine = (value: unknown) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const visiblePendingRequests = prescribedMedicine
    ? pendingRequests.filter((item) => (
        (!requestId || item.requestId === requestId)
        && normalizeMedicine(item.medicineName) === normalizeMedicine(prescribedMedicine)
      ))
    : pendingRequests;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(alternativeRequestStorageKey()) || "[]");
      setPendingRequests(Array.isArray(stored) ? stored : []);
    } catch {
      setPendingRequests([]);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setInventoryLoading(false);
      return;
    }
    fetch("/api/pharmacy/inventory", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async response => {
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data?.message || "Inventory could not be loaded.");
        return Array.isArray(data) ? data : [];
      })
      .then(rows => {
        let metadata: any[] = [];
        try {
          const saved = JSON.parse(localStorage.getItem("pharmacyAlternativeInventoryMetadata") || "[]");
          metadata = Array.isArray(saved) ? saved : [];
        } catch {}
        setInventoryItems(rows.map((row: any) => {
          const extra = metadata.find(item => item.id === row.id || normalizeMedicine(item.medicineName) === normalizeMedicine(row.medicineName));
          return { ...row, ...(extra || {}) };
        }));
      })
      .catch(error => toast.error(error instanceof Error ? error.message : "Inventory could not be loaded."))
      .finally(() => setInventoryLoading(false));
  }, []);

  const requestKeyFor = (item: any, index: number) => String(item.id || `${item.requestId}-${item.medicineName}-${index}`);
  const catalogueFor = (medicineName: string) => alternativeCatalog.filter(candidate => {
    const prescribed = normalizeMedicine(candidate.prescribed);
    const requested = normalizeMedicine(medicineName);
    return prescribed.includes(requested) || requested.includes(prescribed);
  });
  const alternativesForRequest = (item: any) => {
    const catalogue = catalogueFor(item.medicineName);
    return inventoryItems.flatMap((stock: any) => {
      if (Number(stock.stockQuantity || 0) <= 0 || stock.active === 0) return [];
      const stockName = normalizeMedicine(stock.medicineName);
      const matched = catalogue.find(candidate => {
        const alternative = normalizeMedicine(candidate.alternative);
        return stockName === alternative || stockName.includes(alternative) || alternative.includes(stockName);
      });
      const manuallyRelated = normalizeMedicine(stock.prescribedFor) === normalizeMedicine(item.medicineName);
      if (!matched && !manuallyRelated) return [];
      return [{
        id: stock.id,
        inventoryItemId: stock.id,
        alternative: stock.medicineName,
        brand: stock.brand || matched?.brand || "Registered inventory medicine",
        composition: stock.composition || matched?.composition || item.medicineName,
        stock: Number(stock.stockQuantity || 0),
        unitPrice: Number(stock.unitPrice || 0),
      }];
    });
  };

  const createQuotationWithAlternative = (request: any, selected: any) => {
    const activeRequestId = String(request.requestId || requestId || "");
    const activeMedicine = String(request.medicineName || prescribedMedicine || "");
    if (!activeRequestId || !activeMedicine || !selected) {
      toast.error("Select an alternative medicine first.");
      return;
    }
    try {
      const storageKey = alternativeRequestStorageKey();
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const current = Array.isArray(stored) ? stored : [];
      localStorage.setItem(storageKey, JSON.stringify(current.map((entry: any) => (
        entry.requestId === activeRequestId && normalizeMedicine(entry.medicineName) === normalizeMedicine(activeMedicine)
          ? { ...entry, status: "Added to quotation", selectedAlternative: selected.alternative, selectedInventoryItemId: selected.inventoryItemId }
          : entry
      ))));
    } catch {}
    const params = new URLSearchParams({
      requestId: activeRequestId,
      prescribedMedicine: activeMedicine,
      alternativeMedicine: selected.alternative,
      alternativeBrand: selected.brand || "",
      alternativeComposition: selected.composition || activeMedicine,
      alternativePrice: String(selected.unitPrice || 0),
      alternativeInventoryItemId: String(selected.inventoryItemId || ""),
    });
    const activeIndex = request.itemIndex ?? (prescribedMedicine ? itemIndex : "");
    if (activeIndex !== "" && activeIndex !== undefined) params.set("itemIndex", String(activeIndex));
    toast.success("Alternative selected and added to the quotation.");
    router.push(`/pharmacy/quotations/create?${params.toString()}`);
  };

  const addRelatedMedicine = async (event: React.FormEvent, request: any, key: string) => {
    event.preventDefault();
    if (!newMedicine.medicineName.trim() || Number(newMedicine.stockQuantity) <= 0 || Number(newMedicine.unitPrice) <= 0) {
      toast.error("Enter medicine name, available stock, and a valid unit price.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in again to update inventory.");
      return;
    }
    setSavingMedicine(true);
    try {
      const response = await fetch("/api/pharmacy/inventory", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineName: newMedicine.medicineName.trim(),
          batchNumber: newMedicine.batchNumber.trim(),
          stockQuantity: Number(newMedicine.stockQuantity),
          unitPrice: Number(newMedicine.unitPrice),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Related medicine could not be added.");
      const added = {
        id: data.id,
        medicineName: newMedicine.medicineName.trim(),
        brand: newMedicine.brand.trim() || "Registered inventory medicine",
        composition: newMedicine.composition.trim() || request.medicineName,
        prescribedFor: request.medicineName,
        batchNumber: newMedicine.batchNumber.trim(),
        stockQuantity: Number(newMedicine.stockQuantity),
        unitPrice: Number(newMedicine.unitPrice),
        active: 1,
      };
      setInventoryItems(previous => [added, ...previous]);
      try {
        const saved = JSON.parse(localStorage.getItem("pharmacyAlternativeInventoryMetadata") || "[]");
        const metadata = Array.isArray(saved) ? saved : [];
        localStorage.setItem("pharmacyAlternativeInventoryMetadata", JSON.stringify([added, ...metadata.filter(item => item.id !== added.id)].slice(0, 200)));
      } catch {}
      setSelectedAlternatives(previous => ({ ...previous, [key]: String(added.id) }));
      setAddingFor("");
      setNewMedicine({ medicineName: "", brand: "", composition: "", batchNumber: "", stockQuantity: "", unitPrice: "" });
      toast.success("Related medicine added to inventory and selected.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Related medicine could not be added.");
    } finally {
      setSavingMedicine(false);
    }
  };

  return (
    <Page title="Alternative Medicines" eyebrow="Inventory substitution" description="Select a matching inventory substitute for an out-of-stock prescribed medicine, then complete the quotation.">
      <div className="grid gap-4 lg:grid-cols-2">
        {visiblePendingRequests.map((item, index) => {
          const key = requestKeyFor(item, index);
          const candidates = alternativesForRequest(item);
          const selectedId = selectedAlternatives[key] || "";
          const selected = candidates.find(candidate => String(candidate.id) === selectedId);
          return (
          <Card key={key} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alternative Medicine Requested</p>
                <h3 className="mt-1 font-black text-slate-900">{item.medicineName}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">Prescription {item.prescriptionId || "Not recorded"} · Request {item.requestId}</p>
              </div>
              <Badge>Pending</Badge>
            </div>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200"/>
              <RefreshIcon/>
              <div className="h-px flex-1 bg-slate-200"/>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-amber-900">Alternative review requested</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">{inventoryLoading ? "Checking registered inventory…" : candidates.length > 0 ? "Select a matching salt/composition medicine available in inventory." : "No matching medicine is available. Add a verified related medicine to inventory to continue."}</p>
              <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                <span>Dosage: <b className="text-slate-800">{item.dosage || "As directed"}</b></span>
                <span>Quantity: <b className="text-slate-800">{item.quantity || 1}</b></span>
              </div>
            </div>
            {!inventoryLoading && candidates.length > 0 && (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-600">
                  Select Alternative Medicine
                  <select value={selectedId} onChange={event => setSelectedAlternatives(previous => ({ ...previous, [key]: event.target.value }))} className="mt-2 h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                    <option value="">Choose from matching inventory medicines</option>
                    {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.alternative} · Stock {candidate.stock}</option>)}
                  </select>
                </label>
                {selected && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-800">Selected medicine details</p>
                    <p className="mt-1 font-black text-slate-900">{selected.alternative}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">{selected.brand} · {selected.composition}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold"><span className="text-emerald-700">Stock: {selected.stock} units</span><span className="text-slate-900">₹{selected.unitPrice.toFixed(2)} / unit</span></div>
                  </div>
                )}
              </div>
            )}
            {!inventoryLoading && candidates.length === 0 && addingFor !== key && (
              <button type="button" onClick={() => { setAddingFor(key); setNewMedicine({ medicineName: "", brand: "", composition: item.medicineName || "", batchNumber: "", stockQuantity: "", unitPrice: "" }); }} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-extrabold text-amber-800 transition hover:bg-amber-100"><Plus className="size-4" /> Add Related Medicine</button>
            )}
            {addingFor === key && (
              <form onSubmit={event => addRelatedMedicine(event, item, key)} className="mt-4 space-y-3 rounded-xl border border-amber-200 bg-white p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-600">Medicine Name *<input required value={newMedicine.medicineName} onChange={event => setNewMedicine(previous => ({ ...previous, medicineName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                  <label className="text-xs font-bold text-slate-600">Brand<input value={newMedicine.brand} onChange={event => setNewMedicine(previous => ({ ...previous, brand: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                  <label className="text-xs font-bold text-slate-600">Salt / Composition *<input required value={newMedicine.composition} onChange={event => setNewMedicine(previous => ({ ...previous, composition: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                  <label className="text-xs font-bold text-slate-600">Batch Number<input value={newMedicine.batchNumber} onChange={event => setNewMedicine(previous => ({ ...previous, batchNumber: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                  <label className="text-xs font-bold text-slate-600">Available Stock *<input required type="number" min="1" value={newMedicine.stockQuantity} onChange={event => setNewMedicine(previous => ({ ...previous, stockQuantity: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                  <label className="text-xs font-bold text-slate-600">Unit Price (₹) *<input required type="number" min="0.01" step="0.01" value={newMedicine.unitPrice} onChange={event => setNewMedicine(previous => ({ ...previous, unitPrice: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-amber-500" /></label>
                </div>
                <div className="flex justify-end gap-2"><button type="button" onClick={() => setAddingFor("")} className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-600">Cancel</button><button type="submit" disabled={savingMedicine} className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60">{savingMedicine ? "Adding…" : "Add & Select Medicine"}</button></div>
              </form>
            )}
            {selected && <div className="mt-4 flex justify-end"><button type="button" onClick={() => createQuotationWithAlternative(item, selected)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700"><ArrowRight className="size-4" /> Create Quotation with Alternative</button></div>}
          </Card>
          );
        })}
        {!visiblePendingRequests.length && (
          <Card className="p-8 text-center lg:col-span-2"><Pill className="mx-auto size-8 text-slate-300" /><h3 className="mt-3 font-black text-slate-900">No alternative medicine requests</h3><p className="mt-1 text-sm text-slate-500">Out-of-stock medicines added from Create Quotation will appear here.</p></Card>
        )}
      </div>
    </Page>
  );
}
const RefreshIcon=()=> <Activity className="size-4 text-emerald-600"/>;

function Deliveries() {
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/pharmacy/orders", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data?.message || "Delivery orders could not be loaded.");
        setDeliveryOrders(Array.isArray(data) ? data : []);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Delivery orders could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = (status: unknown) => {
    const value = String(status || "").toUpperCase();
    const labels: Record<string, string> = {
      ACCEPTED: "Accepted",
      CONFIRMED: "Accepted",
      PREPARING: "Preparing",
      READY_FOR_DISPATCH: "Ready for Dispatch",
      OUT_FOR_DELIVERY: "Out for Delivery",
      DELIVERED: "Delivered",
      READY_FOR_PICKUP: "Ready for Pickup",
      PICKED_UP: "Picked Up",
      CANCELLED: "Cancelled",
    };
    return labels[value] || String(status || "Accepted").replaceAll("_", " ");
  };

  const nextStatus = (order: any) => {
    const homeDelivery = String(order.deliveryMode || "Home delivery").toLowerCase() !== "store pickup";
    const sequence = homeDelivery
      ? ["CONFIRMED", "PREPARING", "READY_FOR_DISPATCH", "OUT_FOR_DELIVERY", "DELIVERED"]
      : ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP"];
    const current = String(order.status || "CONFIRMED").toUpperCase() === "ACCEPTED"
      ? "CONFIRMED"
      : String(order.status || "CONFIRMED").toUpperCase();
    const currentIndex = sequence.indexOf(current);
    return currentIndex >= 0 ? sequence[currentIndex + 1] || "" : "";
  };

  const updateDeliveryStatus = async (order: any, status: string) => {
    if (!status) return;
    setUpdatingOrderId(order.id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/pharmacy/orders/${encodeURIComponent(order.id)}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Delivery status could not be updated.");
      setDeliveryOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: data.status || status } : item));
      toast.success(`Order status updated to ${statusLabel(data.status || status)}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delivery status could not be updated.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const rows = deliveryOrders.map((order, index) => {
    const mode = order.deliveryMode || (Number(order.deliveryCharge || 0) > 0 ? "Home delivery" : "Store pickup");
    const upcomingStatus = nextStatus({ ...order, deliveryMode: mode });
    const terminal = !upcomingStatus;
    return [
      <b key={`delivery-${order.id}`}>{`DLV-${String(order.id || index + 1).replace(/^ORD-/, "")}`}</b>,
      order.id,
      order.patient,
      <span key={`address-${order.id}`}>{order.deliveryAddress || order.patientAddress || "Address on record"}<small className="block text-slate-400">{order.patientPhone || "Contact not recorded"}</small></span>,
      mode === "Store pickup" ? "Store counter" : "Pharmacy delivery",
      terminal ? "Completed" : mode === "Store pickup" ? "Pickup workflow" : "45–60 minutes",
      `₹${Number(order.deliveryCharge || 0).toLocaleString("en-IN")}`,
      <Badge key={`status-${order.id}`}>{statusLabel(order.status)}</Badge>,
      <select
        key={`action-${order.id}`}
        value=""
        disabled={terminal || updatingOrderId === order.id}
        onChange={(event) => updateDeliveryStatus(order, event.target.value)}
        aria-label={`Update status for order ${order.id}`}
        className="min-w-40 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{updatingOrderId === order.id ? "Updating..." : terminal ? statusLabel(order.status) : "Update Status"}</option>
        {upcomingStatus && <option value={upcomingStatus}>{statusLabel(upcomingStatus)}</option>}
      </select>,
    ];
  });

  return (
    <Page title="Delivery Management" eyebrow="Last-mile fulfilment" description="Coordinate store pickup and home delivery without exposing clinical information.">
      <Card>
        <EmptySafeTable columns={["Delivery", "Order", "Patient", "Address / Contact", "Partner", "ETA", "Charge", "Status", "Action"]} rows={rows}/>
        {!loading && rows.length === 0 && <p className="border-t p-10 text-center text-sm font-medium text-slate-500">No accepted orders are awaiting fulfilment.</p>}
        {loading && <p className="border-t p-10 text-center text-sm font-medium text-slate-500">Loading accepted orders...</p>}
      </Card>
    </Page>
  );
}

function Billing() {
  const downloadInvoice = (row: (typeof orders)[number], index: number) => {
    const invoiceId = `INV-PH-${2608040 + index}`;
    const transactionId = index === 2 ? "COD" : `TXN8A26${71 + index}`;
    const safe = (value: unknown) => String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
    const invoiceHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safe(invoiceId)}</title><style>
body{margin:0;background:#f1f5f9;color:#172033;font-family:Arial,sans-serif}.invoice{max-width:760px;margin:40px auto;background:#fff;border:1px solid #dbe4ea;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,.1)}
header{padding:28px 32px;background:linear-gradient(135deg,#047857,#0891b2);color:#fff}h1{margin:0;font-size:27px}header p{margin:7px 0 0;opacity:.85}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:30px 32px}.item{padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc}.label{display:block;margin-bottom:7px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.value{font-size:16px;font-weight:700}.total{margin:0 32px 32px;padding:20px;border-radius:14px;background:#ecfdf5;color:#065f46;font-size:22px;font-weight:800;text-align:right}footer{padding:18px 32px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px}@media print{body{background:#fff}.invoice{margin:0;box-shadow:none}}
</style></head><body><main class="invoice"><header><h1>MedicalDocs Pharmacy Invoice</h1><p>${safe(invoiceId)}</p></header><section class="grid">
<div class="item"><span class="label">Order ID</span><span class="value">${safe(row.id)}</span></div>
<div class="item"><span class="label">Patient</span><span class="value">${safe(row.patient)}</span></div>
<div class="item"><span class="label">Prescription</span><span class="value">${safe(row.prescription)}</span></div>
<div class="item"><span class="label">Payment date</span><span class="value">${safe(row.date)}</span></div>
<div class="item"><span class="label">Payment mode</span><span class="value">${safe(row.payment)}</span></div>
<div class="item"><span class="label">Transaction</span><span class="value">${safe(transactionId)}</span></div>
</section><div class="total">Total paid: ${safe(row.amount)}</div><footer>Computer-generated invoice from MedicalDocs Pharmacy Portal.</footer></main></body></html>`;
    const url = URL.createObjectURL(new Blob([invoiceHtml], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoiceId}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded");
  };

  return <Page title="Payments & Billing" eyebrow="Transaction ledger" description="Review order invoices and payment settlement status."><Card><EmptySafeTable columns={["Invoice","Order","Patient","Amount","Mode","Transaction","Status","Payment date","Invoice"]} rows={orders.map((row,index)=>[`INV-PH-${2608040+index}`,row.id,row.patient,row.amount,row.payment,index===2?"COD":"TXN8A26"+(71+index),<Badge key="s">{row.payment}</Badge>,row.date,<button key="d" type="button" onClick={() => downloadInvoice(row, index)} title={`Download invoice INV-PH-${2608040+index}`} aria-label={`Download invoice INV-PH-${2608040+index}`} className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 active:scale-95"><Download className="size-4"/></button>])}/></Card></Page>;
}

function Patients({query,setQuery}:any) {
  const visible=patients.filter(row=>JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Patients" eyebrow="Order contacts only" description="Only patient identity, contact and prescription-order history shared with this pharmacy are visible." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search patients..."/>}>
    <Card><EmptySafeTable columns={["Patient","Patient ID","Contact","Location","Prescription Requests","Last Order"]} rows={visible.map((row,index)=>[
      <div key={`patient-${index}`} className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><UserRound className="size-5"/></span><span className="font-black text-slate-900">{row.name}</span></div>,
      <span key={`patient-id-${index}`} className="font-bold text-slate-600">{row.id}</span>,
      row.contact,
      <span key={`location-${index}`} className="inline-flex items-center gap-2"><MapPin className="size-4 shrink-0 text-emerald-600"/>{row.location}</span>,
      <span key={`requests-${index}`} className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-extrabold text-cyan-700">{row.requests} requests</span>,
      row.lastOrder
    ])}/></Card>
  </Page>;
}

function Notifications() {
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);

  const openNotification = async (event: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    event.preventDefault();
    if (item.id && !item.read) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/pharmacy/notifications/${encodeURIComponent(item.id)}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setLiveNotifications(current => current.map(notification => notification.id === item.id ? { ...notification, read: true, isRead: true } : notification));
          window.dispatchEvent(new Event("notificationsRead"));
        }
      } catch {}
    }
    window.location.href = item.actionUrl || "/pharmacy/notifications";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/pharmacy/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setLiveNotifications(data.map((item:any)=>({ ...item, read:true, isRead:true })));
          await fetch("/api/pharmacy/notifications/read-all", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(()=>null);
          window.dispatchEvent(new Event("notificationsRead"));
        }
      })
      .catch(() => {});
  }, []);

  const allNotifications = [...liveNotifications, ...notifications].filter(
    (item, index, array) => array.findIndex((t) => (t.id && t.id === item.id) || t.title === item.title) === index
  );

  return (
    <Page title="Notifications" eyebrow="Pharmacy alerts" description="Prescription, quotation, order, stock and delivery updates.">
      <div className="mx-auto max-w-4xl space-y-3">
        {allNotifications.map((item, index) => (
          <Card key={item.id || `notif-${index}`} className="flex items-start gap-4 p-5 transition hover:shadow-sm">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Bell className="size-5" />
            </span>
            <div className="flex-1">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <span className="text-xs font-semibold text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              {item.actionUrl && (
                <a href={item.actionUrl} onClick={(event)=>openNotification(event,item)} className="mt-2 inline-block text-xs font-extrabold text-emerald-700 hover:underline">
                  View Action →
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function Analytics() { const revenue=[{month:"Mar",value:2.18},{month:"Apr",value:2.86},{month:"May",value:2.64},{month:"Jun",value:3.51},{month:"Jul",value:3.28},{month:"Aug",value:4.12}]; const maxRevenue=Math.max(...revenue.map(item=>item.value)); return <Page title="Reports & Analytics" eyebrow="Business intelligence" description="Sales, order, quotation, stock, expiry and delivery performance."><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total sales","₹4,82,650"],["Total orders","428"],["Average order value","₹1,128"],["Quotation acceptance","78%"]].map(([label,value])=><Card key={label} className="p-5"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-3 text-2xl font-black text-slate-950">{value}</p></Card>)}</div><div className="grid gap-6 lg:grid-cols-2"><Card className="p-6"><div className="flex items-start justify-between"><div><h2 className="font-black text-slate-900">Monthly revenue</h2><p className="mt-1 text-xs font-semibold text-slate-400">Last six months revenue performance</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">₹ in lakhs</span></div><div className="relative mt-7 h-64"><div className="absolute inset-0 flex flex-col justify-between pb-8">{[4,3,2,1,0].map(value=><div key={value} className="flex items-center gap-3"><span className="w-5 text-right text-[10px] font-bold text-slate-400">{value}</span><span className="h-px flex-1 bg-slate-100"/></div>)}</div><div className="absolute inset-y-0 left-8 right-0 flex items-end gap-3 pb-8 sm:gap-5">{revenue.map(item=><div key={item.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-extrabold text-emerald-700 opacity-0 transition group-hover:opacity-100">₹{item.value}L</span><div className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-emerald-600 via-emerald-500 to-cyan-400 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md" style={{height:`${Math.max(12,(item.value/maxRevenue)*78)}%`}}/><span className="text-xs font-bold text-slate-500">{item.month}</span></div>)}</div></div></Card><Card className="p-6"><h2 className="font-black">Operational reports</h2><div className="mt-5 space-y-3">{[["Low stock report","9 medicines"],["Near-expiry report","4 batches"],["Delivery performance","94% on time"],["Most sold medicine","Telmisartan 40 mg"]].map(([label,value])=><div key={label} className="flex justify-between rounded-xl bg-slate-50 p-4"><span className="font-semibold text-slate-600">{label}</span><b>{value}</b></div>)}</div></Card></div></Page>; }

function Profile() {
  const emptyProfile = { pharmacyId: "", pharmacyName: "", ownerName: "", licenseNumber: "", gstNumber: "", contact: "", address: "", serviceAreas: "", deliveryRadius: "", openingTime: "", closingTime: "", minimumOrder: "", homeDelivery: false, storePickup: false };
  const [profile, setProfile] = useState<any>(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/pharmacy/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.message || "Could not load pharmacy profile.");
        return data;
      })
      .then((data) => setProfile({ ...emptyProfile, ...data, minimumOrder: data.minimumOrder ?? "", homeDelivery: Boolean(data.homeDelivery), storePickup: Boolean(data.storePickup) }))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoadingProfile(false));
  }, []);

  const updateField = (key: string, value: string | boolean) => setProfile((current: any) => ({ ...current, [key]: value }));
  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/pharmacy/profile", { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Could not save pharmacy profile.");
      setProfile({ ...emptyProfile, ...data, minimumOrder: data.minimumOrder ?? "", homeDelivery: Boolean(data.homeDelivery), storePickup: Boolean(data.storePickup) });
      try { const user = JSON.parse(localStorage.getItem("user") || "{}"); localStorage.setItem("user", JSON.stringify({ ...user, name: data.pharmacyName, hospitalId: data.pharmacyId })); } catch {}
      toast.success("Pharmacy profile saved successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save pharmacy profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const fields = [
    ["Pharmacy ID", "pharmacyId", "Assigned automatically"], ["Pharmacy name", "pharmacyName", "Enter registered pharmacy name"],
    ["Owner name", "ownerName", "Enter owner name"], ["License number", "licenseNumber", "Enter drug license number"],
    ["GST number", "gstNumber", "Enter GST number"], ["Contact", "contact", "Enter contact number"],
    ["Address", "address", "Enter complete pharmacy address"], ["Service areas", "serviceAreas", "Enter areas served"],
    ["Delivery radius", "deliveryRadius", "e.g. 8 km"], ["Opening time", "openingTime", "e.g. 08:00 AM"],
    ["Closing time", "closingTime", "e.g. 10:00 PM"], ["Minimum order", "minimumOrder", "Enter minimum order amount"],
  ];

  return <Page title="Pharmacy Profile" eyebrow="Registered pharmacy" description="Complete your pharmacy profile after signup. Only information saved by you is displayed." actions={<button type="button" onClick={saveProfile} disabled={loadingProfile || savingProfile || !String(profile.pharmacyName || "").trim()} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{savingProfile ? "Saving..." : "Save profile"}</button>}>
    <Card className="p-6">
      {loadingProfile ? <div className="grid min-h-60 place-items-center text-sm font-semibold text-slate-500">Loading your pharmacy profile...</div> : <>
        <div className="mb-6 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4"><p className="font-bold text-cyan-900">Complete your pharmacy profile</p><p className="mt-1 text-sm text-cyan-700">Your Pharmacy ID and signup name come from your account. Add the remaining verified business information yourself.</p></div>
        <div className="grid gap-5 md:grid-cols-2">{fields.map(([label, key, placeholder]) => <label key={key} className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}<input value={profile[key] ?? ""} readOnly={key === "pharmacyId"} required={key === "pharmacyName"} onChange={(event) => updateField(key, event.target.value)} placeholder={placeholder} className={`mt-2 h-11 w-full rounded-xl border px-4 text-sm font-medium normal-case tracking-normal outline-none ${key === "pharmacyId" ? "border-emerald-200 bg-emerald-50 font-extrabold text-emerald-700" : "border-slate-200 bg-white text-slate-800 focus:border-emerald-500"}`}/></label>)}</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="rounded-xl border p-4 text-sm font-bold"><input type="checkbox" checked={profile.homeDelivery} onChange={(event) => updateField("homeDelivery", event.target.checked)} className="mr-3"/>Home delivery available</label><label className="rounded-xl border p-4 text-sm font-bold"><input type="checkbox" checked={profile.storePickup} onChange={(event) => updateField("storePickup", event.target.checked)} className="mr-3"/>Store pickup available</label></div>
      </>}
    </Card>
  </Page>;
}

export function PrescriptionDetails({ id }: { id: string }) {
  const [liveDetails, setLiveDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const loadRequest = async () => {
      try {
        let response = await fetch(`/api/pharmacy/prescription-requests/${encodeURIComponent(id)}`, { headers, cache: "no-store" });
        let data = await response.json().catch(() => ({}));

        // Older UI cards used display-only RXR IDs. Resolve those links to the
        // pharmacy's latest real database request instead of showing demo data.
        if (!response.ok || data?.statusCode) {
          const listResponse = await fetch("/api/pharmacy/prescription-requests", { headers, cache: "no-store" });
          const rows = await listResponse.json().catch(() => []);
          const latestRequest = Array.isArray(rows) ? rows[0] : null;
          if (!listResponse.ok || !latestRequest?.id) return;
          response = await fetch(`/api/pharmacy/prescription-requests/${encodeURIComponent(latestRequest.id)}`, { headers, cache: "no-store" });
          data = await response.json().catch(() => ({}));
        }

        if (response.ok && data && !data.statusCode) setLiveDetails(data);
      } catch {}
      finally { setDetailsLoading(false); }
    };
    void loadRequest();
  }, [id]);

  const request = liveDetails || {};
  const doctorName = liveDetails?.doctorName || (detailsLoading ? "Loading..." : "Not available");
  const facilityName = liveDetails?.facilityName || (detailsLoading ? "Loading..." : "Not available");
  const patientAddress = liveDetails?.patientAddress || liveDetails?.deliveryAddress || (detailsLoading ? "Loading..." : "Address not available");
  const pharmacyLocation = liveDetails?.pharmacyAddress || (detailsLoading ? "Loading..." : "Pharmacy location unavailable");
  const prescriptionRef = liveDetails?.prescriptionDisplayId || liveDetails?.prescriptionId || (detailsLoading ? "Loading..." : "Not available");
  const splitNumberedItems = (value: unknown) => {
    const text = String(value || "").trim();
    if (!text) return [];
    const matches = [...text.matchAll(/(?:^|\s)(\d+)\.\s*([\s\S]*?)(?=\s+\d+\.\s|$)/g)];
    return matches.length > 1 ? matches.map((match) => match[2].trim()).filter(Boolean) : [text.replace(/^\d+\.\s*/, "").trim()];
  };
  const medicineNames = splitNumberedItems(liveDetails?.medicine);
  const medicineDosages = splitNumberedItems(liveDetails?.dosage);
  const medicineDurations = splitNumberedItems(liveDetails?.duration);
  const displayedMedicines = medicineNames.length
    ? medicineNames.map((name, index) => ({ name, dosage: medicineDosages[index] || "As directed", frequency: medicineDosages[index] || "As directed", duration: medicineDurations[index] || "As advised", quantity: 1, instruction: "Use as prescribed", availability: "Check stock" }))
    : medicines;
  const quotationPath = `/pharmacy/quotations/create?requestId=${encodeURIComponent(request.id || id)}`;
  const medicineSchedule = (item: any) => {
    const uniqueParts = new Map<string, string>();
    [item.dosage, item.frequency, item.duration].forEach((value) => {
      const text = String(value || "").trim();
      if (text) uniqueParts.set(text.toLowerCase(), text);
    });
    return Array.from(uniqueParts.values()).join(" · ");
  };

  return (
    <Page title={`Prescription Request ${request.id || id}`} eyebrow="Authorized prescription view" description="This access is limited to the prescription shared by the patient for medicine ordering." actions={<ActionLink href={quotationPath} label="Create quotation"/>}>
      <div className="grid gap-6 xl:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="font-black">Patient information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Info label="Patient Name" value={request.patient || (detailsLoading ? "Loading..." : "Patient not available")}/>
              <Info label="Patient Address" value={patientAddress}/>
              <Info label="Delivery mode" value={request.delivery || "Home delivery"}/>
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="font-black">Prescriber & Pharmacy Zone</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Info label="Doctor" value={doctorName}/>
              <Info label="Facility" value={facilityName}/>
              <Info label="Pharmacy Zone" value={pharmacyLocation}/>
              <Info label="Prescription ID" value={prescriptionRef}/>
            </dl>
          </Card>
          <Card className="grid min-h-64 place-items-center bg-slate-950 p-6 text-center text-white">
            <div>
              <FileText className="mx-auto size-10 text-emerald-400"/>
              <p className="mt-3 font-bold">Prescription preview</p>
              <p className="text-xs text-slate-400">Secure patient-shared document</p>
            </div>
          </Card>
        </div>
        <Card>
          <div className="border-b p-5">
            <h2 className="font-black">Prescribed medicines</h2>
            <p className="mt-1 text-xs text-slate-500">Availability can be updated; prescription details cannot be edited.</p>
          </div>
          <div className="divide-y">
            {displayedMedicines.map(item => (
              <div key={item.name} className="p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{medicineSchedule(item)}</p>
                  </div>
                  {String(item.availability).trim().toLowerCase() === "check stock" ? (
                    <Link
                      href={`/pharmacy/inventory?medicine=${encodeURIComponent(item.name)}&returnTo=${encodeURIComponent(quotationPath)}`}
                      className="inline-flex whitespace-nowrap rounded-full bg-rose-50 px-3 py-2 text-[11px] font-extrabold text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-100"
                    >
                      Check stock
                    </Link>
                  ) : (
                    <Badge>{item.availability}</Badge>
                  )}
                </div>
                <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-3">
                  <Info label="Required quantity" value={String(item.quantity)}/>
                  <Info label="Instruction" value={item.instruction}/>
                  <Info label="Doctor note" value="Use exactly as prescribed"/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

export function QuotationCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "";
  const quotationId = searchParams.get("quotationId") || "";
  const prescribedMedicineParam = searchParams.get("prescribedMedicine") || "";
  const alternativeMedicineParam = searchParams.get("alternativeMedicine") || "";
  const alternativeBrandParam = searchParams.get("alternativeBrand") || "";
  const alternativeCompositionParam = searchParams.get("alternativeComposition") || "";
  const alternativePriceParam = searchParams.get("alternativePrice") || "";
  const alternativeInventoryItemIdParam = searchParams.get("alternativeInventoryItemId") || "";
  const alternativeItemIndex = searchParams.get("itemIndex");
  const [delivery] = useState(49);
  const [action, setAction] = useState<"draft" | "send" | "reject" | null>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [itemsState, setItemsState] = useState<any[]>([]);
  const [inventoryState, setInventoryState] = useState<any[]>([]);
  const [loadingQuotation, setLoadingQuotation] = useState(true);
  const [resolvingRequest, setResolvingRequest] = useState(!requestId);

  useEffect(() => {
    if (requestId) { setResolvingRequest(false); return; }
    const token = localStorage.getItem("token");
    if (!token) { setResolvingRequest(false); return; }
    fetch("/api/pharmacy/prescription-requests", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then(async response => {
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data?.message || "Prescription requests could not be loaded.");
        return Array.isArray(data) ? data : [];
      })
      .then(rows => {
        if (!rows.length) { setResolvingRequest(false); return; }
        const completedStatuses = new Set(["QUOTATION_SENT", "ACCEPTED", "REJECTED", "CLOSED", "EXPIRED"]);
        const nextRequest = rows.find(request => !completedStatuses.has(String(request.status || "NEW").toUpperCase())) || rows[0];
        router.replace(`/pharmacy/quotations/create?requestId=${encodeURIComponent(nextRequest.id)}`);
      })
      .catch(error => {
        toast.error(error instanceof Error ? error.message : "Prescription requests could not be loaded.");
        setResolvingRequest(false);
      });
  }, [requestId, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !requestId) { setLoadingQuotation(false); return; }
    setLoadingQuotation(true);
    setRequestDetails(null);
    setItemsState([]);
    const headers = { Authorization: `Bearer ${token}` };
    const splitItems = (value: unknown) => {
      const text = String(value || "").trim();
      if (!text) return [];
      const matches = [...text.matchAll(/(?:^|\s)(\d+)\.\s*([\s\S]*?)(?=\s+\d+\.\s|$)/g)];
      return matches.length > 1 ? matches.map(match => match[2].trim()).filter(Boolean) : [text.replace(/^\d+\.\s*/, "").trim()];
    };
    Promise.all([
      fetch(`/api/pharmacy/prescription-requests/${encodeURIComponent(requestId)}`, { headers, cache: "no-store" }),
      fetch("/api/pharmacy/inventory", { headers, cache: "no-store" }),
      fetch("/api/pharmacy/quotations", { headers, cache: "no-store" }),
    ]).then(async ([requestResponse, inventoryResponse, quotationsResponse]) => {
      const details = await requestResponse.json().catch(() => ({}));
      const stockRows = await inventoryResponse.json().catch(() => []);
      const quotationRows = await quotationsResponse.json().catch(() => []);
      if (!requestResponse.ok) throw new Error(details?.message || "Prescription request could not be loaded.");
      setRequestDetails(details);
      const names = splitItems(details.medicine);
      const dosages = splitItems(details.dosage);
      const durations = splitItems(details.duration);
      const normalize = (value: unknown) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const inventoryRows = Array.isArray(stockRows) ? stockRows : [];
      setInventoryState(inventoryRows.filter((stock: any) => Number(stock.stockQuantity) > 0 && stock.active !== 0));
      const requestItems = names.map((medicineName, index) => {
        const wanted = normalize(medicineName);
        const exactStock = inventoryRows.find((stock: any) => {
          const stocked = normalize(stock.medicineName);
          return stocked === wanted || stocked.includes(wanted) || wanted.includes(stocked);
        });
        const inStock = Boolean(exactStock && Number(exactStock.stockQuantity) > 0 && exactStock.active !== 0);
        return {
          medicineName,
          dosage: dosages[index] || "As directed",
          duration: durations[index] || "As advised",
          quantity: 1,
          unitPrice: inStock ? Number(exactStock.unitPrice || 0) : 0,
          inventoryItemId: exactStock?.id || null,
          exactInventoryItemId: inStock ? exactStock.id : null,
          exactUnitPrice: inStock ? Number(exactStock.unitPrice || 0) : 0,
          availability: inStock ? "Available" : "Not Available",
          isAlternative: false,
          alternativeName: "",
          alternativeBrand: "",
          alternativeComposition: "",
        };
      });
      const savedQuotation = (Array.isArray(quotationRows) ? quotationRows : []).find((quotation:any)=>quotation.id===quotationId || quotation.requestId===details.id);
      let savedItems = savedQuotation?.itemsJson;
      if (typeof savedItems === "string") try { savedItems = JSON.parse(savedItems); } catch { savedItems = []; }
      const preparedItems = Array.isArray(savedItems) && savedItems.length ? savedItems.map((item:any)=>({
        ...item,
        medicineName:item.prescribedMedicineName||item.medicineName,
        quantity:Number(item.quantity||1), unitPrice:Number(item.unitPrice||0),
        availability:item.isAlternative?"Alternative Available":item.available===false?"Not Available":"Available",
        exactInventoryItemId:item.inventoryItemId||null, exactUnitPrice:Number(item.unitPrice||0),
      })) : requestItems;
      if (alternativeMedicineParam && prescribedMedicineParam) {
        const requestedMedicine = normalize(prescribedMedicineParam);
        const catalogAlternative = alternativeCatalog.find((candidate) => (
          normalize(candidate.alternative) === normalize(alternativeMedicineParam)
          && (normalize(candidate.prescribed).includes(requestedMedicine) || requestedMedicine.includes(normalize(candidate.prescribed)))
        ));
        const selectedAlternative = catalogAlternative || {
          prescribed: prescribedMedicineParam,
          alternative: alternativeMedicineParam,
          brand: alternativeBrandParam || "Registered inventory medicine",
          composition: alternativeCompositionParam || prescribedMedicineParam,
          price: alternativePriceParam,
        };
        if (selectedAlternative.alternative) {
          const stockedAlternative = inventoryRows.find((stock: any) => {
            const stockedName = normalize(stock.medicineName);
            const alternativeName = normalize(selectedAlternative.alternative);
            return stock.id === alternativeInventoryItemIdParam || stockedName === alternativeName || stockedName.includes(alternativeName) || alternativeName.includes(stockedName);
          });
          const catalogPrice = Number(alternativePriceParam || String(selectedAlternative.price || "").match(/[\d.]+/)?.[0] || 0);
          const requestedIndex = alternativeItemIndex === null ? -1 : Number(alternativeItemIndex);
          preparedItems.forEach((item: any, index: number) => {
            const isRequestedItem = Number.isInteger(requestedIndex) && requestedIndex >= 0
              ? index === requestedIndex
              : normalize(item.medicineName) === requestedMedicine;
            if (!isRequestedItem) return;
            item.availability = "Alternative Available";
            item.isAlternative = true;
            item.selectedAlternative = selectedAlternative.alternative;
            item.alternativeName = selectedAlternative.alternative;
            item.alternativeBrand = selectedAlternative.brand;
            item.alternativeComposition = selectedAlternative.composition;
            item.unitPrice = stockedAlternative ? Number(stockedAlternative.unitPrice || 0) : catalogPrice;
            item.inventoryItemId = stockedAlternative?.id || null;
          });
        }
      }
      setItemsState(preparedItems);
    }).catch(error => toast.error(error instanceof Error ? error.message : "Quotation could not be prepared."))
      .finally(() => setLoadingQuotation(false));
  }, [requestId, quotationId, prescribedMedicineParam, alternativeMedicineParam, alternativeBrandParam, alternativeCompositionParam, alternativePriceParam, alternativeInventoryItemIdParam, alternativeItemIndex]);

  const subtotal = itemsState.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
  const discount = Math.min(54, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = Number((taxableAmount * 0.05).toFixed(2));
  const finalPayable = Number((taxableAmount + gst + delivery).toFixed(2));
  const formatMoney = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const normalizeMedicine = (value: unknown) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const alternativesFor = (medicineName: string) => alternativeCatalog.flatMap(candidate => {
    const prescribed = normalizeMedicine(candidate.prescribed);
    const requested = normalizeMedicine(medicineName);
    if (!(prescribed.includes(requested) || requested.includes(prescribed))) return [];
    const stocked = inventoryState.find(stock => {
      const stockName = normalizeMedicine(stock.medicineName);
      const alternative = normalizeMedicine(candidate.alternative);
      return stockName === alternative || stockName.includes(alternative) || alternative.includes(stockName);
    });
    const catalogPrice = Number(String(candidate.price || "").match(/[\d.]+/)?.[0] || 0);
    return [{
      ...candidate,
      inventoryItemId: stocked?.id || null,
      stock: stocked ? Number(stocked.stockQuantity) : Number(candidate.stock || 0),
      unitPrice: stocked ? Number(stocked.unitPrice || 0) : catalogPrice,
    }];
  });

  const updateItemAvailability = (index: number, newAvailability: string) => {
    setItemsState(prev => {
      const next = [...prev];
      const item = { ...next[index] };
      item.availability = newAvailability;
      if (newAvailability === "Alternative Available") {
        const matched = alternativesFor(item.medicineName);
        if (matched.length > 0) {
          item.isAlternative = true;
          item.alternativeName = matched[0].alternative;
          item.alternativeBrand = matched[0].brand;
          item.alternativeComposition = matched[0].composition;
          item.unitPrice = matched[0].unitPrice;
          item.inventoryItemId = matched[0].inventoryItemId;
        } else {
          item.isAlternative = false;
          item.alternativeName = "";
          item.alternativeBrand = "";
          item.alternativeComposition = "";
          item.unitPrice = 0;
        }
      } else if (newAvailability === "Not Available") {
        item.isAlternative = false;
        item.alternativeName = "";
        item.alternativeBrand = "";
        item.alternativeComposition = "";
        item.unitPrice = 0;
      } else {
        item.isAlternative = false;
        item.alternativeName = "";
        item.inventoryItemId = item.exactInventoryItemId || item.inventoryItemId || null;
        if (Number(item.unitPrice || 0) <= 0 && Number(item.exactUnitPrice || 0) > 0) {
          item.unitPrice = item.exactUnitPrice;
        }
      }
      next[index] = item;
      return next;
    });
  };

  const updatePricingField = (index: number, field: "quantity" | "unitPrice", value: string) => {
    const parsed = Math.max(0, Number(value || 0));
    setItemsState(previous => previous.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: parsed } : item));
  };

  const updateSelectedAlternative = (index: number, altName: string) => {
    const current = itemsState[index];
    const found = alternativesFor(current?.medicineName || "").find(a => a.alternative === altName);
    setItemsState(prev => {
      const next = [...prev];
      const item = { ...next[index] };
      item.selectedAlternative = altName;
      item.alternativeName = altName;
      item.isAlternative = true;
      if (found) {
        item.alternativeBrand = found.brand;
        item.alternativeComposition = found.composition;
        item.unitPrice = found.unitPrice;
        item.inventoryItemId = found.inventoryItemId;
      }
      next[index] = item;
      return next;
    });
  };

  const addToAlternativeMedicines = (item: any, index: number) => {
    const requestKey = `${requestId}::${String(item.medicineName || "").toLowerCase()}`;
    try {
      const storageKey = alternativeRequestStorageKey();
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const current = Array.isArray(stored) ? stored : [];
      if (!current.some((request: any) => `${request.requestId}::${String(request.medicineName || "").toLowerCase()}` === requestKey)) {
        const quotationPath = `/pharmacy/quotations/create?requestId=${encodeURIComponent(requestId)}`;
        current.unshift({
          id: `ALT-${Date.now()}-${index}`,
          requestId,
          prescriptionId: requestDetails?.prescriptionDisplayId || requestDetails?.prescriptionId || "",
          patient: requestDetails?.patient || "",
          medicineName: item.medicineName,
          dosage: item.dosage,
          duration: item.duration,
          quantity: item.quantity || 1,
          itemIndex: index,
          status: "Pending",
          quotationPath,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem(storageKey, JSON.stringify(current.slice(0, 100)));
      }
      toast.success(`${item.medicineName} added to Alternative Medicines.`);
    } catch {
      toast.error("Medicine could not be added to Alternative Medicines.");
    }
  };

  const openAlternativeMedicines = (item: any, index: number) => {
    addToAlternativeMedicines(item, index);
    const params = new URLSearchParams({
      requestId,
      medicine: String(item.medicineName || ""),
      itemIndex: String(index),
    });
    router.push(`/pharmacy/alternatives?${params.toString()}`);
  };

  const finishAction = async (type: "draft" | "send" | "reject") => {
    if (type === "reject" && !window.confirm("Reject this prescription request?")) return;
    if (type !== "reject" && (!requestId || !itemsState.length)) {
      toast.error("Prescription request and its medicines must be loaded first.");
      return;
    }
    if (type === "send" && itemsState.some(item => Number(item.unitPrice || 0) <= 0 || (item.availability === "Not Available" && !item.isAlternative))) {
      toast.error("Enter a valid price and mark every medicine Available, Partially Available, or choose a matching substitute.");
      return;
    }
    setAction(type);
    const now = new Date();
    const status = type === "draft" ? "Draft" : type === "send" ? "Quotation Sent" : "Rejected";
    const quotationId = `QUO-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-4)}`;

    try {
      const token = localStorage.getItem("token");
      if (token && requestId) {
        const response = await fetch(`/api/pharmacy/prescription-requests/${encodeURIComponent(requestId)}/quotation`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsState.map(m => ({
              inventoryItemId: m.inventoryItemId || null,
              prescribedMedicineName: m.medicineName,
              medicineName: m.isAlternative && m.alternativeName ? m.alternativeName : m.medicineName,
              quantity: m.quantity || 1,
              unitPrice: m.unitPrice,
              available: m.availability !== "Not Available",
              isAlternative: m.isAlternative,
              alternativeName: m.alternativeName,
              alternativeBrand: m.alternativeBrand,
              alternativeComposition: m.alternativeComposition
            })),
            discountAmount: discount,
            taxAmount: gst,
            deliveryCharge: delivery,
            estimatedDelivery: "45–60 minutes",
            status: type === "send" ? "SENT" : "DRAFT"
          })
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(responseData?.message || "Quotation could not be saved.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Quotation could not be saved.");
      setAction(null);
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem("pharmacyQuotationActions") || "[]");
      const hasAlternative = itemsState.some(i => i.isAlternative);
      localStorage.setItem(
        "pharmacyQuotationActions",
        JSON.stringify([
          {
            id: quotationId,
            requestId,
            patient: requestDetails?.patient,
            prescription: requestDetails?.prescriptionDisplayId,
            status,
            amount: finalPayable,
            formattedAmount: `₹${finalPayable.toLocaleString("en-IN")}`,
            sent: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            valid: "6 hours",
            response: type === "draft" ? "Not sent" : "Awaiting response",
            hasAlternative,
            items: itemsState,
            updatedAt: now.toISOString()
          },
          ...saved
        ].slice(0, 50))
      );
    } catch {}

    toast[type === "reject" ? "error" : "success"](
      type === "draft" ? "Quotation saved as draft." : type === "send" ? "Quotation sent to the patient successfully." : "Prescription request rejected."
    );
    router.push(type === "reject" ? "/pharmacy/prescription-requests" : "/pharmacy/quotations");
  };

  if (resolvingRequest || (requestId && loadingQuotation)) {
    return <Page><Card className="grid min-h-64 place-items-center p-8 text-center"><div><Clock3 className="mx-auto size-7 animate-pulse text-emerald-600"/><p className="mt-3 font-bold text-slate-800">Preparing quotation form...</p><p className="mt-1 text-sm text-slate-500">Loading the prescription request and medicines.</p></div></Card></Page>;
  }

  if (!requestId) {
    return <Page><Card className="grid min-h-64 place-items-center p-8 text-center"><div><FileText className="mx-auto size-8 text-slate-300"/><p className="mt-3 font-bold text-slate-800">No prescription request is available.</p><p className="mt-1 text-sm text-slate-500">A patient prescription request is required before creating a quotation.</p><div className="mt-5"><ActionLink href="/pharmacy/prescription-requests" label="View prescription requests"/></div></div></Card></Page>;
  }

  return (
    <Page title="Create Quotation" eyebrow="Prescription pricing & inventory substitution" description="Enter medicine availability from stock. Out-of-stock items allow selecting verified alternative substitutes from inventory." actions={<ActionLink href="/pharmacy/quotations" label="Back to quotations"/>}>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <Card>
          <div className="border-b p-5">
            <h2 className="font-black text-slate-900">Medicine Pricing & Inventory Stock Check</h2>
          </div>
          <div className="space-y-4 p-5">
            {itemsState.map((item, index) => {
              const matchedAlts = alternativesFor(item.medicineName);
              return (
                <div key={item.medicineName} className={`rounded-2xl border p-4 transition ${item.isAlternative ? "border-amber-300 bg-amber-50/40" : "border-slate-200 bg-slate-50/50"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <h3 className="font-black text-slate-900">{item.medicineName}</h3>
                      <p className="text-xs text-slate-500">Prescribed Qty: <b>{item.quantity} units</b></p>
                    </div>
                    {item.isAlternative ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                        ⚡ Alternative Substitute Selected
                      </span>
                    ) : item.availability === "Available" ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                        ✓ In Stock (Inventory Available)
                      </span>
                    ) : item.availability === "Partially Available" ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                        Partially Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="Prescribed Medicine" value={item.medicineName}/>
                    <EditableNumberField label="Quantity" value={item.quantity} min={1} step={1} onChange={(value) => updatePricingField(index, "quantity", value)}/>
                    <EditableNumberField label="Unit Price (₹)" value={item.unitPrice} min={0} step={0.01} onChange={(value) => updatePricingField(index, "unitPrice", value)}/>
                    <label className="text-xs font-bold text-slate-500">
                      Stock Availability
                      <select
                        value={item.availability}
                        onChange={(e) => updateItemAvailability(index, e.target.value)}
                        className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"
                      >
                        <option value="Available">Available (In Stock)</option>
                        <option value="Partially Available">Partially Available</option>
                        <option value="Not Available">Not Available (Out of Stock)</option>
                        {matchedAlts.length > 0 && <option value="Alternative Available">Alternative Available (Suggest Substitute)</option>}
                      </select>
                    </label>
                  </div>

                  {item.availability === "Not Available" && !item.isAlternative ? (
                      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-extrabold uppercase tracking-wide text-amber-900">Prescribed medicine is out of stock</p>
                          <p className="mt-1 text-xs font-medium text-slate-600">Open Alternative Medicines to review matching salt/composition options.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAlternativeMedicines(item, index)}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-amber-700"
                        >
                          Go to Alternative Medicines
                          <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    ) : (item.availability === "Alternative Available" || item.isAlternative) ? (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-amber-900">Select Alternative Substitute from Inventory</p>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-bold text-slate-600">
                          Available Inventory Substitutes
                          <select
                            value={item.alternativeName || (matchedAlts[0]?.alternative || "")}
                            onChange={(e) => updateSelectedAlternative(index, e.target.value)}
                            disabled={matchedAlts.length === 0}
                            className="mt-1.5 h-10 w-full rounded-lg border border-amber-300 bg-amber-50/50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500"
                          >
                            {matchedAlts.length > 0 ? (
                              matchedAlts.map(alt => (
                                <option key={alt.alternative} value={alt.alternative}>
                                  {alt.alternative} ({alt.brand}) — Stock: {alt.stock} units
                                </option>
                              ))
                            ) : <option value="">No matching salt/composition substitute in inventory</option>}
                          </select>
                        </label>
                        <div className="rounded-lg bg-slate-50 p-2.5 text-xs">
                          <p className="font-bold text-slate-700">Substitute Info:</p>
                          <p className="text-slate-500">{item.alternativeBrand || "Verified Brand"} · {item.alternativeComposition || "Equivalent composition"}</p>
                          <p className="mt-1 text-emerald-700 font-extrabold">Price: ₹{item.unitPrice}/unit · Patient Approval Required</p>
                        </div>
                      </div>
                    </div>
                    ) : null}
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="font-black text-slate-900">Quotation summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <Info label="Medicine subtotal" value={formatMoney(subtotal)}/>
              <Info label="Total discount" value={`− ${formatMoney(discount)}`}/>
              <Info label="GST (5%)" value={formatMoney(gst)}/>
              <Info label="Delivery charge" value={formatMoney(delivery)}/>
              <div className="border-t pt-4">
                <Info label="Final payable" value={formatMoney(finalPayable)}/>
              </div>
            </div>
          </Card>
          <Card className="space-y-4 p-5">
            <Field label="Estimated delivery" value="45–60 minutes"/>
            <Field label="Quotation expiry" value="6 hours"/>
            <Field label="Pharmacy notes" value="Includes verified alternative substitutes from inventory requiring patient approval."/>
            <button type="button" disabled={action!==null} onClick={()=>finishAction("draft")} className="w-full rounded-xl border py-3 text-sm font-bold transition hover:bg-slate-50 disabled:opacity-50">{action==="draft"?"Saving...":"Save Draft"}</button>
            <button type="button" disabled={action!==null} onClick={()=>finishAction("send")} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"><Send className="mr-2 inline size-4"/>{action==="send"?"Sending...":"Send Quotation"}</button>
            <button type="button" disabled={action!==null} onClick={()=>finishAction("reject")} className="w-full rounded-xl bg-rose-50 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50">{action==="reject"?"Rejecting...":"Reject Request"}</button>
          </Card>
        </div>
      </div>
    </Page>
  );
}

const Info=({label,value}:{label:string;value:string})=><div className="flex justify-between gap-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-bold text-slate-800">{value}</dd></div>;
const Field=({label,value}:{label:string;value:string})=><label className="text-xs font-bold text-slate-500">{label}<input defaultValue={value} className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"/></label>;
const EditableNumberField=({label,value,min,step,onChange}:{label:string;value:number;min:number;step:number;onChange:(value:string)=>void})=><label className="text-xs font-bold text-slate-500">{label}<input type="number" value={value} min={min} step={step} onChange={(event)=>onChange(event.target.value)} className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500"/></label>;
