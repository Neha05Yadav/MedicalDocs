export type Portal = "patient" | "hospital" | "clinic" | "laboratory";

type NotificationLike = {
  type?: string | null;
  title?: string | null;
  message?: string | null;
  actionUrl?: string | null;
  action_url?: string | null;
};

const fallbackRoutes: Record<Portal, string> = {
  patient: "/patient/overview",
  hospital: "/hospital/overview",
  clinic: "/clinic/overview",
  laboratory: "/laboratory/overview",
};

const routeRules: Record<Portal, Array<[RegExp, string]>> = {
  patient: [
    [/ACCESS|CONSENT/, "/patient/access-requests"],
    [/APPOINTMENT|CONSULTATION|RESCHEDULE/, "/patient/appointments"],
    [/REPORT|MEDICAL RECORD|RECORD READY/, "/patient/records"],
    [/LAB|SAMPLE|TEST REQUEST|TEST BOOK/, "/patient/lab-tests"],
    [/PRESCRIPTION|MEDICINE/, "/patient/prescriptions"],
    [/INSURANCE|CLAIM|TPA/, "/patient/insurance"],
    [/INVOICE|BILLING|PAYMENT/, "/patient/billing"],
    [/SUPPORT|TICKET|COMPLAINT|ISSUE/, "/patient/support"],
    [/PROFILE|ACCOUNT/, "/patient/profile"],
  ],
  hospital: [
    [/APPOINTMENT|CONSULTATION|RESCHEDULE/, "/hospital/appointments"],
    [/DOCTOR|STAFF/, "/hospital/doctors"],
    [/ADMISSION|IPD|BED|DISCHARGE/, "/hospital/inpatient"],
    [/INSURANCE|CLAIM|TPA/, "/hospital/insurance"],
    [/LAB|SAMPLE|REPORT|TEST/, "/hospital/reports"],
    [/ACCESS|CONSENT|PATIENT/, "/hospital/patients"],
    [/INVOICE|BILLING|PAYMENT/, "/hospital/billing"],
    [/SUPPORT|TICKET|COMPLAINT|ISSUE/, "/hospital/support"],
    [/SUBSCRIPTION|PLAN/, "/hospital/subscription"],
    [/ANALYTIC/, "/hospital/analytics"],
    [/PROFILE|ACCOUNT/, "/hospital/profile"],
  ],
  clinic: [
    [/APPOINTMENT|CONSULTATION|RESCHEDULE/, "/clinic/appointments"],
    [/PRESCRIPTION|MEDICINE/, "/clinic/prescriptions"],
    [/LAB|SAMPLE|REPORT|TEST/, "/clinic/reports"],
    [/ACCESS|CONSENT|PATIENT/, "/clinic/patients"],
    [/INVOICE|BILLING|PAYMENT/, "/clinic/billing"],
    [/SUPPORT|TICKET|COMPLAINT|ISSUE/, "/clinic/support"],
    [/PROFILE|ACCOUNT/, "/clinic/profile"],
  ],
  laboratory: [
    [/SAMPLE|COLLECTED|SPECIMEN/, "/laboratory/sample-management"],
    [/REPORT|RESULT/, "/laboratory/reports"],
    [/ACCESS|CONSENT|PATIENT/, "/laboratory/patients"],
    [/TEST REQUEST|LAB REQUEST|ORDER|BOOK/, "/laboratory/test-requests"],
    [/WORKFLOW|CATALOG|PACKAGE|TEST/, "/laboratory/workflow"],
    [/INVOICE|BILLING|PAYMENT/, "/laboratory/billing"],
    [/SUPPORT|TICKET|COMPLAINT|ISSUE/, "/laboratory/support"],
    [/PROFILE|ACCOUNT/, "/laboratory/profile"],
  ],
};

export function getNotificationTarget(notification: NotificationLike, portal: Portal) {
  const actionUrl = (notification.actionUrl ?? notification.action_url)?.trim();
  if (actionUrl?.startsWith(`/${portal}/`) && !actionUrl.startsWith("//")) {
    return actionUrl;
  }

  const searchable = [notification.type, notification.title, notification.message]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  const match = routeRules[portal].find(([pattern]) => pattern.test(searchable));
  return match?.[1] ?? fallbackRoutes[portal];
}
