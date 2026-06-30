import PatientProfileClient from "./PatientProfileClient";

export default function PatientProfilePage() {
  const initialProfile = {
    name: "Rohan Verma",
    dob: "1994-06-15",
    gender: "Male",
    bloodGroup: "O+",
    email: "ramesh.sharma@example.com",
    phone: "+91 9876543210",
    emergencyContact: "+91 8765432109",
    address: "Block B, Sector 14, Noida, UP"
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full min-h-screen">
      <PatientProfileClient initialProfile={initialProfile} />
    </div>
  );
}
