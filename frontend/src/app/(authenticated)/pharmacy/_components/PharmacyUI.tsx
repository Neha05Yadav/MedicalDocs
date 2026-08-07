"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Boxes, CheckCircle2, Clock3, CreditCard, Download, FileText, IndianRupee, MapPin, PackageCheck, Pill, Plus, Search, Send, ShoppingBag, Truck, Upload, UserRound, X } from "lucide-react";
import { alternativeCatalog, deliveries, inventory, medicines, notifications, orders, patients, quotations, requests } from "./pharmacy-data";

export type PharmacyView = "overview" | "requests" | "quotations" | "orders" | "inventory" | "alternatives" | "deliveries" | "billing" | "patients" | "notifications" | "analytics" | "profile";

const badgeTone = (status: string) => {
  const value = status.toLowerCase();
  if (["accepted", "paid", "delivered", "completed", "in stock", "available"].some((item) => value.includes(item))) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (["new", "viewed", "preparing", "out for delivery", "quotation sent"].some((item) => value.includes(item))) return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  if (["pending", "partial", "low stock", "near expiry", "ready"].some((item) => value.includes(item))) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
};

const Badge = ({ children }: { children: React.ReactNode }) => <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset ${badgeTone(String(children))}`}>{children}</span>;

const Page = ({ actions, children }: { title?: string; eyebrow?: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }) => (
  <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
    {actions && <div className="flex flex-wrap justify-end gap-2">{actions}</div>}
    {children}
  </div>
);

const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => <label className="relative block w-full sm:w-80"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/></label>;

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;

const EmptySafeTable = ({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) => <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">{columns.map((column, columnIndex) => <th key={`${column}-${columnIndex}`} className="px-5 py-4">{column}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index} className="transition hover:bg-emerald-50/25">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 text-slate-600">{cell}</td>)}</tr>)}</tbody></table></div>;

const ActionLink = ({ href, label = "Open" }: { href: string; label?: string }) => <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">{label}<ArrowRight className="size-3.5"/></Link>;

export default function PharmacyUI({ view }: { view: PharmacyView }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  if (view === "overview") return <Overview/>;
  if (view === "requests") return <Requests query={query} setQuery={setQuery} filter={filter} setFilter={setFilter}/>;
  if (view === "quotations") return <Quotations query={query} setQuery={setQuery}/>;
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
  const metrics = [
    ["New Requests", "12", FileText, "text-blue-600 bg-blue-50"], ["Pending Quotations", "7", Clock3, "text-amber-600 bg-amber-50"], ["Accepted Orders", "18", PackageCheck, "text-emerald-600 bg-emerald-50"], ["Preparing Orders", "6", Boxes, "text-violet-600 bg-violet-50"],
    ["Out for Delivery", "4", Truck, "text-cyan-600 bg-cyan-50"], ["Completed Orders", "31", CheckCircle2, "text-green-600 bg-green-50"], ["Today's Revenue", "₹28,640", IndianRupee, "text-teal-600 bg-teal-50"], ["Low Stock Medicines", "9", AlertTriangle, "text-rose-600 bg-rose-50"],
  ] as const;
  return <Page title="Pharmacy operations" eyebrow="MediDoc Pharmacy" description="Receive patient-shared prescriptions, quote medicines and manage fulfilment without accessing complete medical history.">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, Icon, tone]) => <Card key={label} className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-3 text-2xl font-black text-slate-950">{value}</p></div><span className={`rounded-xl p-3 ${tone}`}><Icon className="size-5"/></span></div></Card>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]"><Card><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-black text-slate-900">Recent prescription requests</h2><p className="mt-1 text-xs text-slate-500">Prescriptions explicitly shared for medicine ordering</p></div><ActionLink href="/pharmacy/prescription-requests" label="View all"/></div><EmptySafeTable columns={["Request","Patient","Doctor","Location","Delivery","Status","Action"]} rows={requests.slice(0,3).map((row) => [<b key="id" className="text-slate-900">{row.id}</b>, row.patient, <span key="doc">{row.doctor}<small className="block text-slate-400">{row.facility}</small></span>, <span key="loc">{row.location}<small className="block text-slate-400">{row.distance}</small></span>, row.delivery, <Badge key="s">{row.status}</Badge>, <ActionLink key="a" href={`/pharmacy/prescription-requests/${row.id}`}/>])}/></Card><MiniCharts/></div>
    <Card><div className="flex items-center justify-between border-b p-5"><h2 className="font-black text-slate-900">Recent orders</h2><ActionLink href="/pharmacy/orders" label="Manage orders"/></div><EmptySafeTable columns={["Order","Patient","Amount","Payment","Delivery","Status","Date","Action"]} rows={orders.map((row) => [<b key="id" className="text-slate-900">{row.id}</b>,row.patient,row.amount,<Badge key="p">{row.payment}</Badge>,row.delivery,<Badge key="s">{row.status}</Badge>,row.date,<ActionLink key="a" href="/pharmacy/orders"/>])}/></Card>
  </Page>;
}

function MiniCharts() { const bars=[52,68,43,76,89,64,94]; return <Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900">Weekly orders</h2><p className="mt-1 text-xs text-slate-500">Acceptance rate 78%</p></div><BarChart3 className="size-5 text-emerald-600"/></div><div className="mt-8 flex h-40 items-end gap-3">{bars.map((height,index)=><div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-cyan-400" style={{height:`${height}%`}}/><span className="text-[10px] font-bold text-slate-400">{["M","T","W","T","F","S","S"][index]}</span></div>)}</div><div className="mt-5 rounded-xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">Top medicine</p><p className="mt-1 font-black text-slate-900">Telmisartan 40 mg</p><p className="text-xs text-slate-500">146 strips sold this month</p></div></Card>; }function Requests({query,setQuery,filter,setFilter}:any) {
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
          patient:row.patient,
          prescription:row.prescription,
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
  const statuses=["All","New","Viewed","Quotation Sent","Accepted","Rejected","Expired"];
  const allRequests=[...liveRequests,...requests].filter((row,index,array)=>array.findIndex(item=>item.id===row.id)===index);
  const visible=allRequests.filter(row=>(filter==="All"||row.status===filter)&&JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Prescription Requests" eyebrow="Patient-shared access" description="Only prescriptions shared by patients for medicine fulfilment are visible. Complete medical history remains private." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search requests..."/>}><div className="flex flex-wrap gap-2">{statuses.map(status=><button key={status} onClick={()=>setFilter(status)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter===status?"bg-emerald-600 text-white":"border bg-white text-slate-600"}`}>{status}</button>)}</div><Card><EmptySafeTable columns={["Request ID","Patient","Prescription","Doctor / Facility","Location","Requested","Delivery","Status","Action"]} rows={visible.map((row, index)=>[<b key={`req-${row.id}-${index}`}>{row.id}</b>,row.patient,row.prescription,<span key={`doc-${index}`}>{row.doctor}<small className="block text-slate-400">{row.facility}</small></span>,row.location,row.date,row.delivery,<Badge key={`badge-${index}`}>{row.status}</Badge>,<ActionLink key={`act-${index}`} href={`/pharmacy/prescription-requests/${row.rawId||row.id}`}/>])}/></Card></Page>;
}function Quotations({query,setQuery}:any) {
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
    patient:q.patient,
    prescription:q.prescription,
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
      prescription:item.prescription||requests[0]?.prescription||"Prescription",
      amount:item.formattedAmount||`₹${Number(item.amount||0).toLocaleString("en-IN")}`,
      sent:item.sent||new Date(item.updatedAt||Date.now()).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
      valid:item.valid||"6 hours",
      response:isAccepted?"Accepted by Patient":item.response||"Awaiting response",
      status:isAccepted?"Accepted":item.status==="Quotation Sent"?"Pending":item.status||"Draft"
    };
  });

  const allRows=[...mappedLive,...mappedLocal,...quotations].filter((row,index,array)=>array.findIndex(item=>item.id===row.id)===index);
  const visible=allRows.filter(row=>JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Quotations" eyebrow="Pricing workspace" description="Prepare transparent medicine pricing and track patient responses." actions={<><SearchBar value={query} onChange={setQuery} placeholder="Search quotations..."/><ActionLink href="/pharmacy/quotations/create" label="Create quotation"/></>}><Card><EmptySafeTable columns={["Quotation","Patient","Prescription","Amount","Sent","Valid until","Patient response","Status","Action"]} rows={visible.map((row, index)=>[<b key={`quo-id-${index}`}>{row.id}</b>,row.patient,row.prescription,<b key={`quo-amt-${index}`}>{row.amount}</b>,row.sent,row.valid,row.response,<Badge key={`quo-badge-${index}`}>{row.status}</Badge>,<ActionLink key={`quo-act-${index}`} href="/pharmacy/quotations/create"/>])}/></Card></Page>;
}

function Orders({query,setQuery,filter,setFilter}:any) {
  const [liveOrders,setLiveOrders]=useState<any[]>([]);
  const [confirmedOrder,setConfirmedOrder]=useState<any>(null);

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
    patient:o.patient,
    prescription:o.prescription,
    amount:`₹${Number(o.totalAmount).toLocaleString("en-IN")}`,
    payment:"Paid",
    delivery:"Home delivery",
    status:o.status==="CONFIRMED"?"Confirmed":o.status,
    date:new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
  }));

  const localConfirmedArr=confirmedOrder?[{
    id:confirmedOrder.id||"ORD-CONFIRMED-01",
    patient:confirmedOrder.patient||requests[0]?.patient||"Neha Yadav",
    prescription:confirmedOrder.prescription||"RX-874521",
    amount:`₹${Number(confirmedOrder.amount||1248).toLocaleString("en-IN")}`,
    payment:"Paid",
    delivery:"Home delivery",
    status:"Confirmed",
    date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
  }]:[];

  const stages=["All","Confirmed","Payment Pending","Paid","Preparing","Ready for Pickup","Out for Delivery","Delivered","Cancelled"];
  const allOrders=[...mappedLive,...localConfirmedArr,...orders].filter((row,index,array)=>array.findIndex(item=>item.id===row.id)===index);
  const visible=allOrders.filter(row=>(filter==="All"||row.status===filter||row.payment===filter)&&JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <Page title="Orders" eyebrow="Medicine fulfilment" description="Manage confirmed orders through payment, preparation, pickup or delivery." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search orders..."/>}><div className="flex flex-wrap gap-2">{stages.map(stage=><button key={stage} onClick={()=>setFilter(stage)} className={`rounded-full px-3 py-2 text-xs font-bold ${filter===stage?"bg-emerald-600 text-white":"border bg-white text-slate-600"}`}>{stage}</button>)}</div><Card><EmptySafeTable columns={["Order","Patient","Prescription","Amount","Payment","Delivery","Status","Date","Action"]} rows={visible.map((row, index)=>[<b key={`ord-id-${index}`}>{row.id}</b>,row.patient,row.prescription,row.amount,<Badge key={`ord-pay-${index}`}>{row.payment}</Badge>,row.delivery,<Badge key={`ord-badge-${index}`}>{row.status}</Badge>,row.date,<ActionLink key={`ord-act-${index}`} href="/pharmacy/orders"/>])}/></Card></Page>;
}

function Inventory({ query, setQuery }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

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
  return (
    <Page title="Alternative Medicines" eyebrow="Patient approval required" description="Review available inventory substitutes for out-of-stock prescribed medicines. A suggested substitute requires patient approval before order confirmation.">
      <div className="grid gap-4 lg:grid-cols-2">
        {alternativeCatalog.map((item, index) => (
          <Card key={`${item.alternative}-${index}`} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medicine Out of Stock</p>
                <h3 className="mt-1 font-black text-slate-900">{item.prescribed}</h3>
              </div>
              <Badge>Out of Stock</Badge>
            </div>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200"/>
              <RefreshIcon/>
              <div className="h-px flex-1 bg-slate-200"/>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-800">Inventory Substitute Available</p>
              <p className="mt-1 font-black text-slate-900">{item.alternative} <small className="font-semibold text-slate-600">({item.brand})</small></p>
              <p className="mt-1 text-xs font-medium text-slate-600">{item.composition}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-extrabold">
                <span className="text-emerald-700">Stock: {item.stock} units available</span>
                <span className="text-slate-900">{item.price}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <ActionLink href="/pharmacy/quotations/create" label="Add Alternative to Quotation" />
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
const RefreshIcon=()=> <Activity className="size-4 text-emerald-600"/>;

function Deliveries() { return <Page title="Delivery Management" eyebrow="Last-mile fulfilment" description="Coordinate store pickup and home delivery without exposing clinical information."><Card><EmptySafeTable columns={["Delivery","Order","Patient","Address / Contact","Partner","ETA","Charge","Status","Action"]} rows={deliveries.map(row=>[<b key="id">{row.id}</b>,row.order,row.patient,<span key="a">{row.address}<small className="block text-slate-400">{row.contact}</small></span>,row.partner,row.eta,row.charge,<Badge key="s">{row.status}</Badge>,<button key="x" className="text-xs font-bold text-emerald-700">Track</button>])}/></Card></Page>; }

function Billing() { return <Page title="Payments & Billing" eyebrow="Transaction ledger" description="Review order invoices and payment settlement status."><Card><EmptySafeTable columns={["Invoice","Order","Patient","Amount","Mode","Transaction","Status","Payment date","Invoice"]} rows={orders.map((row,index)=>[`INV-PH-${2608040+index}`,row.id,row.patient,row.amount,row.payment,index===2?"COD":"TXN8A26"+(71+index),<Badge key="s">{row.payment}</Badge>,row.date,<button key="d" className="rounded-lg border p-2 text-emerald-700"><Download className="size-4"/></button>])}/></Card></Page>; }

function Patients({query,setQuery}:any) { const visible=patients.filter(row=>JSON.stringify(row).toLowerCase().includes(query.toLowerCase())); return <Page title="Patients" eyebrow="Order contacts only" description="Only patient identity, contact and prescription-order history shared with this pharmacy are visible." actions={<SearchBar value={query} onChange={setQuery} placeholder="Search patients..."/>}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(row=><Card key={row.id} className="p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><UserRound className="size-5"/></span><div><h3 className="font-black text-slate-900">{row.name}</h3><p className="text-xs text-slate-500">{row.id}</p></div></div><div className="mt-5 space-y-2 text-sm text-slate-600"><p>{row.contact}</p><p><MapPin className="mr-2 inline size-4"/>{row.location}</p><p>{row.requests} prescription requests · Last order {row.lastOrder}</p></div></Card>)}</div></Page>; }

function Notifications() {
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/pharmacy/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) setLiveNotifications(data);
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
                <a href={item.actionUrl} className="mt-2 inline-block text-xs font-extrabold text-emerald-700 hover:underline">
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

function Analytics() { const months=[48,63,58,77,72,91]; return <Page title="Reports & Analytics" eyebrow="Business intelligence" description="Sales, order, quotation, stock, expiry and delivery performance."><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total sales","₹4,82,650"],["Total orders","428"],["Average order value","₹1,128"],["Quotation acceptance","78%"]].map(([label,value])=><Card key={label} className="p-5"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-3 text-2xl font-black text-slate-950">{value}</p></Card>)}</div><div className="grid gap-6 lg:grid-cols-2"><Card className="p-6"><h2 className="font-black">Monthly revenue</h2><div className="mt-8 flex h-64 items-end gap-5">{months.map((height,index)=><div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600 to-cyan-400" style={{height:`${height}%`}}/><span className="text-xs text-slate-400">{["Mar","Apr","May","Jun","Jul","Aug"][index]}</span></div>)}</div></Card><Card className="p-6"><h2 className="font-black">Operational reports</h2><div className="mt-5 space-y-3">{[["Low stock report","9 medicines"],["Near-expiry report","4 batches"],["Delivery performance","94% on time"],["Most sold medicine","Telmisartan 40 mg"]].map(([label,value])=><div key={label} className="flex justify-between rounded-xl bg-slate-50 p-4"><span className="font-semibold text-slate-600">{label}</span><b>{value}</b></div>)}</div></Card></div></Page>; }

function Profile() { const [pharmacyId,setPharmacyId]=useState("PHM00001"); useEffect(()=>{ try { const user=JSON.parse(localStorage.getItem("user")||"{}"); if(user.hospitalId) setPharmacyId(String(user.hospitalId)); } catch {} },[]); const fields=[["Pharmacy ID",pharmacyId],["Pharmacy name","WellCare Pharmacy"],["Owner name","Anil Mehta"],["License number","DL-NOI-2026-84517"],["GST number","09ABCDE1234F1Z5"],["Contact","+91 98765 43021"],["Address","Sector 18, Noida, Uttar Pradesh"],["Service areas","Noida sectors 15–62"],["Delivery radius","8 km"],["Opening time","08:00 AM"],["Closing time","10:00 PM"],["Minimum order","₹199"]]; return <Page title="Pharmacy Profile" eyebrow="Registered pharmacy" description="Maintain pharmacy identity, license, service area and timings." actions={<button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white">Save profile</button>}><Card className="p-6"><div className="grid gap-5 md:grid-cols-2">{fields.map(([label,value])=><label key={label} className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}<input {...(label==="Pharmacy ID"?{value,readOnly:true}:{defaultValue:value})} className={`mt-2 h-11 w-full rounded-xl border px-4 text-sm font-medium normal-case tracking-normal outline-none ${label==="Pharmacy ID"?"border-emerald-200 bg-emerald-50 font-extrabold text-emerald-700":"border-slate-200 text-slate-800 focus:border-emerald-500"}`}/></label>)}</div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="rounded-xl border p-4 text-sm font-bold"><input type="checkbox" defaultChecked className="mr-3"/>Home delivery available</label><label className="rounded-xl border p-4 text-sm font-bold"><input type="checkbox" defaultChecked className="mr-3"/>Store pickup available</label></div><div className="mt-6 rounded-2xl border border-dashed p-8 text-center"><Upload className="mx-auto size-7 text-emerald-600"/><p className="mt-2 font-bold">Upload logo and pharmacy documents</p><p className="text-xs text-slate-500">Drug license, GST certificate and owner identity</p></div></Card></Page>; }

export function PrescriptionDetails({ id }: { id: string }) {
  const [liveDetails, setLiveDetails] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`/api/pharmacy/prescription-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && !data.statusCode) setLiveDetails(data);
      })
      .catch(() => {});
  }, [id]);

  const fallback = requests.find(item => item.id === id || (item as any).rawId === id) || requests[0];
  const request = liveDetails || fallback;
  const doctorName = liveDetails?.doctorName || fallback?.doctor || "Prescribing Doctor";
  const facilityName = liveDetails?.facilityName || fallback?.facility || "Healthcare Facility";
  const savedAddress = typeof window !== "undefined" ? localStorage.getItem("updatedPatientAddress") : null;
  const patientAddress = liveDetails?.patientAddress || savedAddress || liveDetails?.deliveryAddress || (fallback as any)?.patientAddress || "Address on record";
  const pharmacyLocation = liveDetails?.pharmacyAddress || fallback?.location || "Pharmacy Location";
  const prescriptionRef = liveDetails?.prescriptionReference || fallback?.prescription || "RX-874521";

  return (
    <Page title={`Prescription Request ${request.id || id}`} eyebrow="Authorized prescription view" description="This access is limited to the prescription shared by the patient for medicine ordering." actions={<ActionLink href="/pharmacy/quotations/create" label="Create quotation"/>}>
      <div className="grid gap-6 xl:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="font-black">Patient information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Info label="Patient Name" value={request.patient}/>
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
            {medicines.map(item => (
              <div key={item.name} className="p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.dosage} · {item.frequency} · {item.duration}</p>
                  </div>
                  <Badge>{item.availability}</Badge>
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
  const [delivery] = useState(49);
  const [action, setAction] = useState<"draft" | "send" | "reject" | null>(null);

  const [itemsState, setItemsState] = useState<any[]>(() =>
    medicines.map((m, idx) => {
      const isAlt = m.availability === "Partially Available" || m.availability === "Alternative Available";
      const matchedAlts = alternativeCatalog.filter(a => a.prescribed.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(a.prescribed.toLowerCase()));
      const initialAlt = matchedAlts[0]?.alternative || (idx === 1 ? "Glimet 500 SR (USV Pharma)" : idx === 2 ? "Pan-D Capsule (Alkem Labs)" : "");
      return {
        medicineName: m.name,
        dosage: m.dosage,
        quantity: m.quantity || 30,
        unitPrice: isAlt ? 7.5 : 12,
        availability: isAlt ? "Alternative Available" : m.availability || "Available",
        isAlternative: isAlt,
        alternativeName: initialAlt,
        alternativeBrand: matchedAlts[0]?.brand || "Verified Manufacturer",
        alternativeComposition: matchedAlts[0]?.composition || "Equivalent composition"
      };
    })
  );

  const subtotal = itemsState.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gst = Math.round(subtotal * 0.05);
  const finalPayable = Math.max(0, subtotal - 54 + gst + delivery);

  const updateItemAvailability = (index: number, newAvailability: string) => {
    setItemsState(prev => {
      const next = [...prev];
      const item = { ...next[index] };
      item.availability = newAvailability;
      if (newAvailability === "Alternative Available" || newAvailability === "Not Available") {
        item.isAlternative = true;
        const matched = alternativeCatalog.filter(a => a.prescribed.toLowerCase().includes(item.medicineName.toLowerCase()) || item.medicineName.toLowerCase().includes(a.prescribed.toLowerCase()));
        if (matched.length > 0) {
          item.alternativeName = matched[0].alternative;
          item.alternativeBrand = matched[0].brand;
          item.alternativeComposition = matched[0].composition;
          item.unitPrice = 7.5;
        } else {
          item.alternativeName = "Generic Equivalent Medicine";
          item.alternativeBrand = "Verified Substitute";
          item.unitPrice = 8;
        }
      } else {
        item.isAlternative = false;
        item.alternativeName = "";
        item.unitPrice = 12;
      }
      next[index] = item;
      return next;
    });
  };

  const updateSelectedAlternative = (index: number, altName: string) => {
    const found = alternativeCatalog.find(a => a.alternative === altName);
    setItemsState(prev => {
      const next = [...prev];
      const item = { ...next[index] };
      item.selectedAlternative = altName;
      item.alternativeName = altName;
      item.isAlternative = true;
      if (found) {
        item.alternativeBrand = found.brand;
        item.alternativeComposition = found.composition;
        item.unitPrice = parseFloat(found.price) || 7.5;
      }
      next[index] = item;
      return next;
    });
  };

  const finishAction = async (type: "draft" | "send" | "reject") => {
    if (type === "reject" && !window.confirm("Reject this prescription request?")) return;
    setAction(type);
    const now = new Date();
    const status = type === "draft" ? "Draft" : type === "send" ? "Quotation Sent" : "Rejected";
    const quotationId = `QUO-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-4)}`;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const requestId = (requests[0] as any)?.rawId || requests[0]?.id || "req-1";
        await fetch(`/api/pharmacy/prescription-requests/${requestId}/quotation`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            items: itemsState.map(m => ({
              inventoryItemId: null,
              medicineName: m.medicineName,
              quantity: m.quantity || 1,
              unitPrice: m.unitPrice,
              available: m.availability !== "Not Available",
              isAlternative: m.isAlternative,
              alternativeName: m.alternativeName,
              alternativeBrand: m.alternativeBrand,
              alternativeComposition: m.alternativeComposition
            })),
            discountAmount: 54,
            taxAmount: gst,
            deliveryCharge: delivery,
            estimatedDelivery: "45–60 minutes",
            status: type === "send" ? "SENT" : "DRAFT"
          })
        }).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const saved = JSON.parse(localStorage.getItem("pharmacyQuotationActions") || "[]");
      const hasAlternative = itemsState.some(i => i.isAlternative);
      localStorage.setItem(
        "pharmacyQuotationActions",
        JSON.stringify([
          {
            id: quotationId,
            requestId: requests[0]?.id,
            patient: requests[0]?.patient,
            prescription: requests[0]?.prescription,
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

  return (
    <Page title="Create Quotation" eyebrow="Prescription pricing & inventory substitution" description="Enter medicine availability from stock. Out-of-stock items allow selecting verified alternative substitutes from inventory." actions={<ActionLink href="/pharmacy/quotations" label="Back to quotations"/>}>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <Card>
          <div className="border-b p-5">
            <h2 className="font-black text-slate-900">Medicine Pricing & Inventory Stock Check</h2>
          </div>
          <div className="space-y-4 p-5">
            {itemsState.map((item, index) => {
              const matchedAlts = alternativeCatalog.filter(a => a.prescribed.toLowerCase().includes(item.medicineName.toLowerCase()) || item.medicineName.toLowerCase().includes(a.prescribed.toLowerCase()));
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
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                        ✓ In Stock (Inventory Available)
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="Prescribed Medicine" value={item.medicineName}/>
                    <Field label="Quantity" value={String(item.quantity)}/>
                    <Field label="Unit Price" value={`₹${item.unitPrice.toFixed(2)}`}/>
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
                        <option value="Alternative Available">Alternative Available (Suggest Substitute)</option>
                      </select>
                    </label>
                  </div>

                  {(item.availability === "Alternative Available" || item.availability === "Not Available" || item.isAlternative) && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
                      <p className="text-xs font-extrabold uppercase tracking-wide text-amber-900">Select Alternative Substitute from Inventory</p>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-bold text-slate-600">
                          Available Inventory Substitutes
                          <select
                            value={item.alternativeName || (matchedAlts[0]?.alternative || "")}
                            onChange={(e) => updateSelectedAlternative(index, e.target.value)}
                            className="mt-1.5 h-10 w-full rounded-lg border border-amber-300 bg-amber-50/50 px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500"
                          >
                            {matchedAlts.length > 0 ? (
                              matchedAlts.map(alt => (
                                <option key={alt.alternative} value={alt.alternative}>
                                  {alt.alternative} ({alt.brand}) — Stock: {alt.stock} units
                                </option>
                              ))
                            ) : (
                              alternativeCatalog.map(alt => (
                                <option key={alt.alternative} value={alt.alternative}>
                                  {alt.alternative} ({alt.brand}) — Stock: {alt.stock} units
                                </option>
                              ))
                            )}
                          </select>
                        </label>
                        <div className="rounded-lg bg-slate-50 p-2.5 text-xs">
                          <p className="font-bold text-slate-700">Substitute Info:</p>
                          <p className="text-slate-500">{item.alternativeBrand || "Verified Brand"} · {item.alternativeComposition || "Equivalent composition"}</p>
                          <p className="mt-1 text-emerald-700 font-extrabold">Price: ₹{item.unitPrice}/unit · Patient Approval Required</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="font-black text-slate-900">Quotation summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <Info label="Medicine subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`}/>
              <Info label="Total discount" value="− ₹54"/>
              <Info label="GST (5%)" value={`₹${gst.toLocaleString('en-IN')}`}/>
              <Info label="Delivery charge" value={`₹${delivery}`}/>
              <div className="border-t pt-4">
                <Info label="Final payable" value={`₹${finalPayable.toLocaleString('en-IN')}`}/>
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
