"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, Database, Eye, EyeOff, LockKeyhole, Mail, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { MediDocBrand } from "@/components/MediDocBrand";
import styles from "../auth/auth.module.css";

const CAPABILITIES = [
  { icon: UserCheck, title: "Govern access", copy: "Role-specific workspaces keep administrative authority precise." },
  { icon: Database, title: "Operate one network", copy: "Facilities, teams and platform records remain centrally visible." },
  { icon: Activity, title: "See platform health", copy: "Operational signals and escalations reach the right team." },
];

export default function ManagementLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/management/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok || !data?.access_token) {
        const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
        throw new Error(message || (response.status >= 500 ? "Management service is unavailable." : "Invalid email or password."));
      }
      if (["INACTIVE", "SUSPENDED"].includes(String(data.user?.status).toUpperCase())) {
        throw new Error("This account is inactive. Contact the super administrator.");
      }

      const role = String(data.user?.role || "").toUpperCase();
      const destination = role.includes("SUPER") ? "/management/super-admin/overview"
        : role.includes("ADMIN") ? "/management/admin/overview"
        : role.includes("ACCOUNT") ? "/management/accounts/overview"
        : role.includes("SALE") ? "/management/sales/overview"
        : role.includes("SUPPORT") ? "/management/support/overview"
        : null;
      if (!destination) throw new Error("This account does not have management portal access.");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
      toast.success("Management identity verified.");
      router.push(destination);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05070b] text-white">
      <video className="absolute inset-0 size-full object-cover object-center" autoPlay muted loop playsInline preload="metadata" poster="/medidoc-campaign/hero-video-poster.jpg" aria-label="MedicalDocs healthcare operations">
        <source src="/medidoc-lab-verification.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,12,.96)_0%,rgba(3,7,12,.86)_48%,rgba(3,7,12,.72)_100%),linear-gradient(0deg,rgba(3,7,12,.9),transparent_65%)]" />
      <div className={styles.panelGrid} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <Link href="/" className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:text-white sm:left-8 sm:top-7"><ArrowLeft className="size-4" /> Back to home</Link>

      <div className="relative z-10 grid min-h-[100svh] items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:px-[6vw]">
        <section className="hidden max-w-[48rem] lg:block">
          <MediDocBrand />
          <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[.07] px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-200 backdrop-blur-xl"><span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" /> Protected operations gateway</div>
          <h1 className="mt-7 text-6xl font-semibold leading-[.92] tracking-[-.06em] xl:text-7xl">The care network, <span className={styles.displayItalic}>under clear control.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">A dedicated operating layer for authorized MedicalDocs teams. Govern access, facilities, service health and support without exposing administrative identities through public sign-in.</p>
          <div className="mt-10 grid gap-4 xl:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-xl"><Icon className="size-6 text-cyan-300" /><h2 className="mt-4 text-base font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></article>)}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[620px] rounded-[2rem] border border-white/10 bg-[#081018]/88 p-7 shadow-[0_35px_100px_-40px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:p-10">
          <div className="mb-8 lg:hidden"><MediDocBrand compact /></div>
          <div className="mb-9">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300"><ShieldCheck className="size-4" /> Authorized personnel only</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Management access.</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">Verify your assigned work identity to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block"><span className="mb-2.5 block text-sm font-semibold text-slate-300">Work email</span><span className="relative block"><Mail className="absolute left-5 top-1/2 z-10 size-5 -translate-y-1/2 text-slate-500" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={styles.input} placeholder="name@medidoc.in" autoComplete="email" required /></span></label>
            <label className="block"><span className="mb-2.5 block text-sm font-semibold text-slate-300">Password</span><span className="relative block"><LockKeyhole className="absolute left-5 top-1/2 z-10 size-5 -translate-y-1/2 text-slate-500" /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className={`${styles.input} pr-14`} placeholder="Enter your password" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></span></label>
            <div className="flex items-center justify-between gap-4 py-1 text-sm text-slate-400"><label className="flex items-center gap-3"><input type="checkbox" className="size-5 accent-cyan-300" /> Keep me signed in</label><span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-emerald-300/80"><ShieldCheck className="size-4" /> Encrypted</span></div>
            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-5 text-base font-bold text-slate-950 shadow-[0_12px_35px_-15px_rgba(34,211,238,.75)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Verifying authority…" : <>Enter management portal <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></>}</button>
          </form>
          <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-sm leading-6 text-slate-500"><ShieldAlert className="mt-0.5 size-5 shrink-0" /><p>Public patient and facility credentials cannot enter this portal. Management access is provisioned internally.</p></div>
        </section>
      </div>
    </main>
  );
}
