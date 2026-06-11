"use client";

import { FileText, Upload, Eye, Download, MoreVertical, Info, Building2, User, ArrowLeft, ChevronDown, Image as ImageIcon, Bell } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const myUploads = [
  { id: "1", fileName: "Blood_Test_Report.pdf", type: "Blood Test", uploadDate: "12 May 2024", size: "1.2 MB", fileType: "pdf", typeColor: "text-red-600 bg-red-50" },
  { id: "2", fileName: "Insurance_Document.pdf", type: "Insurance", uploadDate: "25 Apr 2024", size: "2.4 MB", fileType: "pdf", typeColor: "text-purple-600 bg-purple-50" },
  { id: "3", fileName: "Old_Prescription.jpg", type: "Prescription", uploadDate: "10 Apr 2024", size: "1.1 MB", fileType: "jpg", typeColor: "text-emerald-600 bg-emerald-50" },
  { id: "4", fileName: "XRay_Report.pdf", type: "X-Ray", uploadDate: "02 Apr 2024", size: "1.8 MB", fileType: "pdf", typeColor: "text-blue-600 bg-blue-50" },
];

const hospitalRecordsData = [
  {
    id: "h1", name: "Apollo Hospitals", reportCount: 4, logo: "A", 
    records: [
      { id: "r1", fileName: "Prescription.pdf", type: "Prescription", uploadDate: "15 May 2024", uploadedBy: "Dr. Rahul Sharma", fileType: "pdf", typeColor: "text-emerald-600 bg-emerald-50" },
      { id: "r2", fileName: "Blood_Test_Report.pdf", type: "Blood Test", uploadDate: "15 May 2024", uploadedBy: "Dr. Rahul Sharma", fileType: "pdf", typeColor: "text-red-600 bg-red-50" },
      { id: "r3", fileName: "ECG_Report.jpg", type: "ECG", uploadDate: "14 May 2024", uploadedBy: "Dr. Rahul Sharma", fileType: "jpg", typeColor: "text-purple-600 bg-purple-50" },
      { id: "r4", fileName: "Discharge_Summary.pdf", type: "Summary", uploadDate: "14 May 2024", uploadedBy: "Dr. Rahul Sharma", fileType: "pdf", typeColor: "text-orange-600 bg-orange-50" },
    ]
  },
  { id: "h2", name: "Max Healthcare", reportCount: 2, logo: "M", records: [
    { id: "m1", fileName: "MRI_Scan.pdf", type: "MRI", uploadDate: "20 Apr 2024", uploadedBy: "Dr. A. Gupta", fileType: "pdf", typeColor: "text-blue-600 bg-blue-50" },
    { id: "m2", fileName: "Consultation_Notes.pdf", type: "Notes", uploadDate: "18 Apr 2024", uploadedBy: "Dr. A. Gupta", fileType: "pdf", typeColor: "text-slate-600 bg-slate-50" }
  ] },
  { id: "h3", name: "Fortis Hospital", reportCount: 3, logo: "F", records: [
    { id: "f1", fileName: "Blood_Sugar.pdf", type: "Blood Test", uploadDate: "05 Mar 2024", uploadedBy: "Dr. S. Mehta", fileType: "pdf", typeColor: "text-red-600 bg-red-50" },
    { id: "f2", fileName: "Ultrasound.jpg", type: "Ultrasound", uploadDate: "05 Mar 2024", uploadedBy: "Dr. S. Mehta", fileType: "jpg", typeColor: "text-purple-600 bg-purple-50" },
    { id: "f3", fileName: "Prescription.pdf", type: "Prescription", uploadDate: "05 Mar 2024", uploadedBy: "Dr. S. Mehta", fileType: "pdf", typeColor: "text-emerald-600 bg-emerald-50" }
  ] },
  { id: "h4", name: "AIIMS Delhi", reportCount: 1, logo: "AI", records: [
    { id: "a1", fileName: "Surgery_Report.pdf", type: "Surgery", uploadDate: "10 Jan 2024", uploadedBy: "Dr. R. Kapoor", fileType: "pdf", typeColor: "text-orange-600 bg-orange-50" }
  ] },
  { id: "l1", name: "Apex Labs", reportCount: 2, logo: "AL", records: [
    { id: "lab1", fileName: "CBC_Report.pdf", type: "Blood Test", uploadDate: "05 Jun 2026", uploadedBy: "Apex Labs", fileType: "pdf", typeColor: "text-red-600 bg-red-50" },
    { id: "lab2", fileName: "Urine_Culture.pdf", type: "Culture", uploadDate: "06 Jun 2026", uploadedBy: "Apex Labs", fileType: "pdf", typeColor: "text-amber-600 bg-amber-50" }
  ] },
  { id: "d1", name: "Dr. Rohan Verma Clinic", reportCount: 1, logo: "RV", records: [
    { id: "doc1", fileName: "Consultation_Notes.pdf", type: "Notes", uploadDate: "08 Jun 2026", uploadedBy: "Dr. Rohan Verma", fileType: "pdf", typeColor: "text-slate-600 bg-slate-50" }
  ] },
];

export default function RecordsAndReportsPage() {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>("h1");

  const selectedHospital = hospitalRecordsData.find(h => h.id === selectedHospitalId);

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">Records & Reports</h1>
          <p className="text-[15px] text-slate-500 mt-1.5">Manage and view all your medical records in one place.</p>
        </div>
      </header>

      {/* My Uploads Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-1 mb-8 shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50/80 text-blue-600 p-3.5 rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Uploads</h2>
                <p className="text-[14px] text-slate-500 mt-0.5">Reports and documents uploaded by you.</p>
              </div>
            </div>
            <button className="bg-[#12224d] text-white px-5 py-2.5 rounded-lg flex items-center gap-2.5 text-[14px] font-semibold hover:bg-blue-900 transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Upload Report
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/70">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-slate-50/50 border-b border-slate-200/70 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 font-semibold">File Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Upload Date</th>
                  <th className="px-6 py-4 font-semibold">Size</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {myUploads.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3.5">
                        {file.fileType === 'pdf' ? (
                          <div className="text-red-500 bg-red-50 p-2 rounded-lg"><FileText className="w-4 h-4" /></div>
                        ) : (
                          <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg"><ImageIcon className="w-4 h-4" /></div>
                        )}
                        <span className="font-semibold text-slate-800">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${file.typeColor}`}>
                        {file.type}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-600 font-medium">{file.uploadDate}</td>
                    <td className="px-6 py-4.5 text-slate-600 font-medium">{file.size}</td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-4 text-slate-400">
                        <button className="hover:text-blue-600 transition-colors"><Eye className="w-5 h-5" /></button>
                        <button className="hover:text-blue-600 transition-colors"><Download className="w-5 h-5" /></button>
                        <button className="hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-5 flex items-center gap-2 text-[13px] text-slate-400 font-medium">
            <Info className="w-4 h-4 text-blue-400" /> These are files you have uploaded.
          </div>
        </div>
      </section>

      {/* Hospital Records Section */}
      <section className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-1 shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3.5 rounded-full">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hospital / Doctor / Lab Records</h2>
                <p className="text-[14px] text-slate-500 mt-0.5">Reports uploaded by medical facilities and available to you.</p>
              </div>
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                <option>All Facilities</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Hospital Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-2">
            {hospitalRecordsData.map(hospital => (
              <button 
                  key={hospital.id}
                  onClick={() => setSelectedHospitalId(hospital.id)}
                  className={`bg-white rounded-xl p-5 text-left transition-all duration-200 ${
                    selectedHospitalId === hospital.id 
                      ? 'border-blue-500 ring-1 ring-blue-500 shadow-md transform -translate-y-0.5' 
                      : 'border-slate-200/80 border hover:border-blue-300 hover:shadow-sm'
                  }`}
              >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-blue-600 text-lg shadow-sm">
                      {hospital.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{hospital.name}</h3>
                      <p className="text-[13px] text-slate-500 mt-1">{hospital.reportCount} Reports</p>
                    </div>
                  </div>
                  <div className="text-blue-600 text-[13px] font-bold flex items-center gap-1.5 group">
                    View Reports <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
              </button>
            ))}
          </div>

          {/* Expanded View */}
          {selectedHospital && selectedHospital.records.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
                <button onClick={() => setSelectedHospitalId(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-slate-900">{selectedHospital.name}</h3>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[12px] font-bold">
                  {selectedHospital.reportCount} Reports
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4 font-semibold">File Name</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Uploaded On</th>
                      <th className="px-6 py-4 font-semibold">Uploaded By</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {selectedHospital.records.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3.5">
                            {record.fileType === 'pdf' ? (
                              <div className="text-red-500 bg-red-50 p-2 rounded-lg"><FileText className="w-4 h-4" /></div>
                            ) : (
                              <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg"><ImageIcon className="w-4 h-4" /></div>
                            )}
                            <span className="font-semibold text-slate-800">{record.fileName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${record.typeColor}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-slate-600 font-medium">{record.uploadDate}</td>
                        <td className="px-6 py-4.5 text-slate-600 font-medium">{record.uploadedBy}</td>
                        <td className="px-6 py-4.5">
                          <div className="flex items-center justify-center gap-4 text-slate-400">
                            <button className="hover:text-blue-600 transition-colors"><Eye className="w-5 h-5" /></button>
                            <button className="hover:text-blue-600 transition-colors"><Download className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2.5 text-[13px] text-slate-400 font-medium">
                <Info className="w-4 h-4 text-blue-400" /> These records are uploaded by medical facilities. You can view and download them.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
