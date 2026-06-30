export const patientNav = [
  { title: "Dashboard", subtitle: "Your comprehensive health overview at a glance.", url: "/patient/overview", iconName: "LayoutDashboard" },
  { title: "Health Records", subtitle: "Manage and view all your medical records in one place.", url: "/patient/records", iconName: "ClipboardList" },
  { title: "Prescriptions", subtitle: "View and download your digital prescriptions.", url: "/patient/prescriptions", iconName: "Pill" },
  { title: "Access Requests", subtitle: "Manage hospital requests to access your health records.", url: "/patient/access-requests", iconName: "ShieldCheck" },
  { title: "Notifications", subtitle: "View your latest notifications and alerts.", url: "/patient/notifications", iconName: "Bell" },
  { title: "Profile", subtitle: "Manage your personal and medical information.", url: "/patient/profile", iconName: "User" },
];

export const clinicNav = [
  { title: "Dashboard", subtitle: "Welcome to the clinic dashboard.", url: "/clinic/overview", iconName: "LayoutDashboard" },
  { title: "Patients", subtitle: "Manage your assigned patients and view their histories.", url: "/clinic/patients", iconName: "Users" },
  { title: "Prescriptions", subtitle: "View active prescriptions or issue new ones to your patients.", url: "/clinic/prescriptions", iconName: "Pill" },
  { title: "Reports", subtitle: "View patient shared reports or upload new medical reports.", url: "/clinic/reports", iconName: "ClipboardList" },
  { title: "Notifications", subtitle: "Stay updated on patient access approvals and appointments.", url: "/clinic/notifications", iconName: "Bell" },
  { title: "Profile", subtitle: "Manage your personal details, credentials, and contact information.", url: "/clinic/profile", iconName: "Settings" },
];

export const hospitalNav = [
  { title: "Dashboard", subtitle: "Overview of hospital operations and patient flow.", url: "/hospital/overview", iconName: "LayoutDashboard" },
  { title: "Doctors", subtitle: "Manage hospital doctors, their departments, and statuses.", url: "/hospital/doctors", iconName: "Stethoscope" },
  { title: "Patient Search", subtitle: "Search and verify patients to access their medical records.", url: "/hospital/patients", iconName: "Search" },
  { title: "Reports", subtitle: "Manage and upload hospital medical reports.", url: "/hospital/reports", iconName: "ClipboardList" },
  { title: "Billing & Payments", subtitle: "Manage patient invoices, payments, and billing history.", url: "/hospital/billing", iconName: "CreditCard" },
  { title: "Departments", subtitle: "Hospital departments and their statistics.", url: "/hospital/departments", iconName: "Hospital" },
  { title: "Notifications", subtitle: "Hospital alerts, staff updates, and system notifications.", url: "/hospital/notifications", iconName: "Bell" },
  { title: "Analytics", subtitle: "Hospital performance and patient statistics.", url: "/hospital/analytics", iconName: "BarChart3" },
];

export const laboratoryNav = [
  { title: "Dashboard", subtitle: "Welcome to Apex Labs. Monitor your testing queue and uploaded reports.", url: "/laboratory/overview", iconName: "LayoutDashboard" },
  { title: "Test Requests", subtitle: "Manage incoming test orders from doctors and walk-in patients.", url: "/laboratory/test-requests", iconName: "ClipboardList" },
  { title: "Reports", subtitle: "Manage uploaded reports and dispatch new results to patients.", url: "/laboratory/reports", iconName: "FileText" },
  { title: "Sample Management", subtitle: "Track physical samples from collection to analysis.", url: "/laboratory/sample-management", iconName: "Activity" },
  { title: "Patients", subtitle: "Manage patient records and request access to medical history.", url: "/laboratory/patients", iconName: "Users" },
  { title: "Notifications", subtitle: "Stay updated on new test requests and alerts.", url: "/laboratory/notifications", iconName: "Bell" },
  { title: "Profile", subtitle: "Manage your facility's details, licenses, and contact information.", url: "/laboratory/profile", iconName: "Settings" },
];

export const adminNav = [
  { title: "Dashboard", subtitle: "System overview, KPIs, and recent activities.", url: "/management/admin/overview", iconName: "LayoutDashboard" },
  { title: "Access Management", subtitle: "Manage patients, doctors, and staff accounts.", url: "/management/admin/access", iconName: "ShieldCheck" },
  { title: "Hospital Management", subtitle: "View and manage registered hospitals.", url: "/management/admin/hospitals", iconName: "Hospital" },
  { title: "Lab Management", subtitle: "View and manage laboratory facilities.", url: "/management/admin/labs", iconName: "FlaskConical" },
  { title: "Reports Monitoring", subtitle: "Global view of all uploaded medical reports.", url: "/management/admin/reports", iconName: "ClipboardList" },
  { title: "Notifications", subtitle: "System alerts and notifications.", url: "/management/admin/notifications", iconName: "Bell" },
  { title: "Analytics", subtitle: "System-wide growth and performance analytics.", url: "/management/admin/analytics", iconName: "BarChart3" },
  { title: "Settings", subtitle: "System configurations, roles, and security.", url: "/management/admin/settings", iconName: "Settings" },
];

export const superAdminNav = [
  { title: "Dashboard", subtitle: "Platform overview and key performance metrics.", url: "/management/super-admin/overview", iconName: "LayoutDashboard" },
  { title: "Team Management", subtitle: "Manage system administrators and their permissions.", url: "/management/super-admin/admins", iconName: "ShieldCheck" },
  { title: "User Management", subtitle: "Global oversight of all platform users.", url: "/management/super-admin/users", iconName: "Users" },
  { title: "Facility Management", subtitle: "Manage and verify all registered facilities.", url: "/management/super-admin/facilities", iconName: "Hospital" },
  { title: "Subscriptions", subtitle: "Manage plans, active subscriptions, and revenue.", url: "/management/super-admin/subscriptions", iconName: "CreditCard" },
  { title: "Reports & Tests", subtitle: "System-wide reporting and test tracking.", url: "/management/super-admin/reports", iconName: "ClipboardList" },
  { title: "Notifications", subtitle: "Global announcements and system alerts.", url: "/management/super-admin/notifications", iconName: "Bell" },
  { title: "Audit Logs", subtitle: "Security logs and system activity tracking.", url: "/management/super-admin/audit", iconName: "FileText" },
  { title: "Settings", subtitle: "Global platform configuration and API settings.", url: "/management/super-admin/settings", iconName: "Settings" },
];

export const salesNav = [
  { title: "Overview", subtitle: "Sales dashboard and high-level revenue metrics.", url: "/management/sales/overview", iconName: "LayoutDashboard" },
  { title: "Subscription Management", subtitle: "Manage active, expired, and upcoming renewals.", url: "/management/sales/subscriptions", iconName: "Clock" },
  { title: "Revenue Analytics", subtitle: "Analyze daily, monthly, and yearly revenue trends.", url: "/management/sales/revenue", iconName: "BarChart3" },
  { title: "Payment Management", subtitle: "Track successful, pending, and failed payments.", url: "/management/sales/payments", iconName: "CreditCard" },
  { title: "Reports", subtitle: "Generate detailed sales and subscription reports.", url: "/management/sales/reports", iconName: "ClipboardList" },
  { title: "Notifications", subtitle: "Alerts for payment dues and subscription expiries.", url: "/management/sales/notifications", iconName: "Bell" },
];

export const accountsNav = [
  { title: "Overview", subtitle: "Financial summary and key accounting metrics.", url: "/management/accounts/overview", iconName: "LayoutDashboard" },
  { title: "Payments Received", subtitle: "Track all successful payments and transactions.", url: "/management/accounts/payments-received", iconName: "CreditCard" },
  { title: "Pending Payments", subtitle: "Monitor unpaid invoices and pending dues.", url: "/management/accounts/pending-payments", iconName: "Clock" },
  { title: "Invoicing System", subtitle: "Generate, manage, and track invoices.", url: "/management/accounts/invoicing-system", iconName: "FileText" },
  { title: "Billing Records", subtitle: "View individual client billing histories and balances.", url: "/management/accounts/billing-records", iconName: "ClipboardList" },
  { title: "Refunds", subtitle: "Manage and process client refund requests.", url: "/management/accounts/refunds", iconName: "RefreshCw" },
  { title: "Notifications", subtitle: "Stay updated with billing, payments, and invoices.", url: "/management/accounts/notifications", iconName: "Bell" },
  { title: "Settings", subtitle: "Configure gateways, banks, and currency settings.", url: "/management/accounts/settings", iconName: "Settings" },
];

export const supportNav = [
  { title: "Overview", subtitle: "Support operations and ticket metrics at a glance.", url: "/management/support/overview", iconName: "LayoutDashboard" },
  { title: "Ticket Management", subtitle: "Manage and resolve active support tickets.", url: "/management/support/tickets", iconName: "MessageSquare" },
  { title: "Escalation Management", subtitle: "Route and track complex issues to specialized teams.", url: "/management/support/escalations", iconName: "AlertTriangle" },
  { title: "User Verification", subtitle: "Assist users with verification and KYC processes.", url: "/management/support/verification", iconName: "ShieldCheck" },
  { title: "Notifications", subtitle: "Alerts for new tickets, escalated issues, and reminders.", url: "/management/support/notifications", iconName: "Bell" },
  { title: "Reports & Analytics", subtitle: "Analyze resolution rates, response times, and ticket categories.", url: "/management/support/analytics", iconName: "BarChart3" },
];

export const allNavs = {
  patient: patientNav,
  clinic: clinicNav,
  hospital: hospitalNav,
  laboratory: laboratoryNav,
  admin: adminNav,
  superAdmin: superAdminNav,
  sales: salesNav,
  accounts: accountsNav,
  support: supportNav
};
