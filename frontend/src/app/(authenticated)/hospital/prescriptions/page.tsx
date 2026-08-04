import DoctorPrescriptionsPage from "../../clinic/prescriptions/page";

export default function HospitalPrescriptionsPage() {
  return <DoctorPrescriptionsPage apiBase="/api/hospital" showLabTest={false} requireDoctor />;
}
