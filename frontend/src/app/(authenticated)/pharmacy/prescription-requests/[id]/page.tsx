import { PrescriptionDetails } from "../../_components/PharmacyUI";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PrescriptionDetails id={id} />; }
