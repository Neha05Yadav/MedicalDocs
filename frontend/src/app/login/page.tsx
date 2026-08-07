import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnUrl?: string }> }) {
  const params = await searchParams;
  const returnUrl = params?.returnUrl;
  if (returnUrl) {
    redirect(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
  redirect("/auth");
}
