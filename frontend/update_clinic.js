const fs = require('fs');
let content = fs.readFileSync('src/app/(authenticated)/clinic/overview/page.tsx', 'utf8');

// 1. Remove 'use client'
content = content.replace(/"use client";\n?/g, '');
content = content.replace(/'use client';\n?/g, '');

// 2. Remove useState import
content = content.replace(/import { useState } from "react";\n?/g, '');

// 3. Add AppointmentsListClient import
content = content.replace(/import Link from "next\/link";/, 'import Link from "next/link";\nimport AppointmentsListClient from "./AppointmentsListClient";');

// 4. Remove state variables
content = content.replace(/const \[selectedAppt, setSelectedAppt\] = useState.*?;/g, '');

// 5. Replace Today's Schedule and Modal with <AppointmentsListClient appointments={appointments} />
const todayScheduleStart = '<div className="lg:col-span-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">';
const recentPatientsStart = '<div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">';

let parts = content.split(todayScheduleStart);
if (parts.length > 1) {
  let afterSchedule = parts[1].split(recentPatientsStart);
  if (afterSchedule.length > 1) {
    content = parts[0] + '<AppointmentsListClient appointments={appointments} />\n        ' + recentPatientsStart + afterSchedule[1];
  }
}

// Regex to replace the modal
content = content.replace(/\{\/\* Appointment Modal \*\/\}[\s\S]*\}\)}/, '');

fs.writeFileSync('src/app/(authenticated)/clinic/overview/page.tsx', content);
console.log('Modified clinic/overview/page.tsx successfully!');
