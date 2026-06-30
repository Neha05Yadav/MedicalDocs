import DashboardWrapper from "./DashboardWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
