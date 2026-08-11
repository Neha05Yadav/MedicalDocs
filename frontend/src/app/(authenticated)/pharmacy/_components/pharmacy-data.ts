export const requests = [
  { id: "RXR-260804-018", patient: "Neha Yadav", prescription: "RX-874521", doctor: "Dr. Santosh", facility: "City Hospital", date: "04 Aug 2026", patientAddress: "n heritage bisrakh Greater Noida", location: "Sector 18, Noida", distance: "2.4 km", delivery: "Home delivery", status: "New" },
  { id: "RXR-260804-017", patient: "Aarav Sharma", prescription: "RX-874498", doctor: "Dr. P. Sharma", facility: "Green Valley Clinic", date: "04 Aug 2026", patientAddress: "Flat 402, Sector 22, Noida", location: "Sector 22, Noida", distance: "4.1 km", delivery: "Store pickup", status: "Viewed" },
  { id: "RXR-260803-014", patient: "Sneha Verma", prescription: "RX-874203", doctor: "Dr. A. Gupta", facility: "City Hospital", date: "03 Aug 2026", patientAddress: "Sector 15, Noida", location: "Sector 15, Noida", distance: "1.8 km", delivery: "Home delivery", status: "Quotation Sent" },
  { id: "RXR-260803-011", patient: "Rohan Mehta", prescription: "RX-874102", doctor: "Dr. R.K. Verma", facility: "Metro Care Hospital", date: "03 Aug 2026", patientAddress: "Tower B, Sector 27, Noida", location: "Sector 27, Noida", distance: "5.6 km", delivery: "Home delivery", status: "Accepted" },
];

export const orders = [
  { id: "ORD-260804-009", patient: "Rohan Mehta", prescription: "RX-874102", amount: "₹1,248", payment: "Paid", delivery: "Home delivery", status: "Preparing", date: "04 Aug 2026" },
  { id: "ORD-260804-006", patient: "Ishita Singh", prescription: "RX-873988", amount: "₹786", payment: "Paid", delivery: "Store pickup", status: "Ready for Pickup", date: "04 Aug 2026" },
  { id: "ORD-260803-024", patient: "Kabir Joshi", prescription: "RX-873765", amount: "₹2,115", payment: "COD", delivery: "Home delivery", status: "Out for Delivery", date: "03 Aug 2026" },
  { id: "ORD-260803-019", patient: "Meera Nair", prescription: "RX-873654", amount: "₹945", payment: "Paid", delivery: "Home delivery", status: "Delivered", date: "03 Aug 2026" },
];

export const inventory = [
  { medicine: "Telmisartan 40", brand: "Telma", composition: "Telmisartan", strength: "40 mg", category: "Cardiac", batch: "TLM2607A", stock: 86, minimum: 25, expiry: "May 2028", mrp: "₹245", price: "₹221", status: "In Stock" },
  { medicine: "Metformin SR", brand: "Glycomet", composition: "Metformin", strength: "500 mg", category: "Diabetes", batch: "GLY2604C", stock: 14, minimum: 30, expiry: "Jan 2028", mrp: "₹82", price: "₹74", status: "Low Stock" },
  { medicine: "Amoxicillin CV", brand: "Augmentin", composition: "Amoxicillin + Clavulanate", strength: "625 mg", category: "Antibiotic", batch: "AUG2511B", stock: 0, minimum: 15, expiry: "Nov 2027", mrp: "₹223", price: "₹210", status: "Out of Stock" },
  { medicine: "Pantoprazole DSR", brand: "Pantocid DSR", composition: "Pantoprazole + Domperidone", strength: "40/30 mg", category: "Gastro", batch: "PAN2509F", stock: 38, minimum: 20, expiry: "Oct 2026", mrp: "₹198", price: "₹180", status: "Near Expiry" },
];

export const quotations = [
  { id: "QUO-260804-014", patient: "Sneha Verma", prescription: "RX-874203", amount: "₹1,562", sent: "04 Aug 2026", valid: "04 Aug, 8:30 PM", response: "Awaiting response", status: "Pending" },
  { id: "QUO-260803-028", patient: "Rohan Mehta", prescription: "RX-874102", amount: "₹1,248", sent: "03 Aug 2026", valid: "04 Aug, 2:00 PM", response: "Accepted", status: "Accepted" },
  { id: "QUO-260803-022", patient: "Kavya Rao", prescription: "RX-873954", amount: "₹620", sent: "03 Aug 2026", valid: "Expired", response: "No response", status: "Expired" },
];

export const medicines = [
  { name: "Telmisartan 40 mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days", quantity: 30, instruction: "After breakfast", availability: "Available" },
  { name: "Metformin SR 500 mg", dosage: "1 tablet", frequency: "Twice daily", duration: "30 days", quantity: 60, instruction: "After meals", availability: "Partially Available" },
  { name: "Pantoprazole DSR", dosage: "1 capsule", frequency: "Once daily", duration: "10 days", quantity: 10, instruction: "Before breakfast", availability: "Alternative Available" },
];

export const deliveries = orders.slice(0, 3).map((order, index) => ({ id: `DLV-260804-00${index + 4}`, order: order.id, patient: order.patient, address: ["Sector 27, Noida", "Sector 18, Noida", "Sector 62, Noida"][index], contact: `98XXXXXX${32 + index}`, partner: ["Rahul / MediDoc Fleet", "Store counter", "Amit / MediDoc Fleet"][index], eta: ["35 minutes", "Ready now", "18 minutes"][index], charge: index === 1 ? "₹0" : "₹49", status: order.status }));

export const patients = [
  { id: "NY45626", name: "Neha Yadav", contact: "98XXXXXX45", requests: 4, lastOrder: "28 Jul 2026", location: "Sector 18, Noida" },
  { id: "RM28941", name: "Rohan Mehta", contact: "99XXXXXX31", requests: 3, lastOrder: "04 Aug 2026", location: "Sector 27, Noida" },
  { id: "SV68204", name: "Sneha Verma", contact: "97XXXXXX68", requests: 2, lastOrder: "18 Jul 2026", location: "Sector 15, Noida" },
];

export const notifications = [
  { title: "New prescription request", message: "Neha Yadav shared prescription RX-874521 for quotation.", time: "5 minutes ago", tone: "blue" },
  { title: "Quotation accepted", message: "Rohan Mehta accepted quotation QUO-260803-028.", time: "42 minutes ago", tone: "green" },
  { title: "Low stock alert", message: "Metformin SR 500 mg is below minimum stock level.", time: "1 hour ago", tone: "amber" },
  { title: "Patient approval pending", message: "Alternative for Pantoprazole DSR requires patient approval.", time: "2 hours ago", tone: "purple" },
];

export const alternativeCatalog = [
  { prescribed: "Azithromycin 500 mg", alternative: "Azithral 500 Tablet", brand: "Alembic Pharma", composition: "Azithromycin 500 mg", stock: 72, price: "₹18.00/tab", status: "In Stock" },
  { prescribed: "Azithromycin 500 mg", alternative: "Azee 500 Tablet", brand: "Cipla", composition: "Azithromycin 500 mg", stock: 48, price: "₹20.50/tab", status: "In Stock" },
  { prescribed: "Azithromycin 500 mg", alternative: "Zithrocin 500 Tablet", brand: "Pfizer", composition: "Azithromycin 500 mg", stock: 34, price: "₹23.00/tab", status: "In Stock" },
  { prescribed: "Vitamin D3 60,000 IU", alternative: "Uprise-D3 60K Capsule", brand: "Alkem Labs", composition: "Cholecalciferol 60,000 IU", stock: 90, price: "₹32.00/cap", status: "In Stock" },
  { prescribed: "Vitamin D3 60,000 IU", alternative: "D-Rise 60K Capsule", brand: "USV Pharma", composition: "Cholecalciferol 60,000 IU", stock: 65, price: "₹30.00/cap", status: "In Stock" },
  { prescribed: "Metformin SR 500 mg", alternative: "Glimet 500 SR", brand: "USV Pharma", composition: "Metformin Hydrochloride 500 mg", stock: 140, price: "₹7.50/tab", status: "In Stock" },
  { prescribed: "Metformin SR 500 mg", alternative: "Obimet 500 SR", brand: "Abbott Healthcare", composition: "Metformin 500 mg", stock: 85, price: "₹6.80/tab", status: "In Stock" },
  { prescribed: "Amoxicillin CV 625 mg", alternative: "Moxikind-CV 625 mg", brand: "Mankind Pharma", composition: "Amoxicillin + Clavulanic Acid 625 mg", stock: 110, price: "₹19.50/tab", status: "In Stock" },
  { prescribed: "Amoxicillin CV 625 mg", alternative: "Clavam 625 mg", brand: "Alkem Labs", composition: "Amoxicillin + Clavulanic Acid 625 mg", stock: 65, price: "₹20.50/tab", status: "In Stock" },
  { prescribed: "Pantoprazole DSR", alternative: "Pan-D Capsule", brand: "Alkem Labs", composition: "Pantoprazole 40mg + Domperidone 30mg", stock: 120, price: "₹17.50/cap", status: "In Stock" },
  { prescribed: "Pantoprazole DSR", alternative: "Pantocid DSR Capsule", brand: "Sun Pharma", composition: "Pantoprazole 40mg + Domperidone 30mg", stock: 95, price: "₹18.50/cap", status: "In Stock" }
];
