import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { returnUrl?: string } }) {
  const returnUrl = searchParams?.returnUrl;
  if (returnUrl) {
    redirect(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
  redirect("/auth");
}
