"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FlaskConical,
  HeartPulse,
  LockKeyhole,
  Mail,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { MediDocBrand } from "@/components/MediDocBrand";
import styles from "../auth/auth.module.css";

const ROLE_DASHBOARD: Record<string, string> = {
  PATIENT: "/patient/overview",
  HOSPITAL: "/hospital/overview",
  LAB: "/laboratory/overview",
  LABORATORY: "/laboratory/overview",
  LAB_MANAGER: "/laboratory/overview",
  TECHNICIAN: "/laboratory/overview",
  CLINIC: "/clinic/overview",
  DOCTOR: "/clinic/overview",
  PHARMACY: "/pharmacy/overview",
  PHARMACIST: "/pharmacy/overview",
  PHARMACY_MANAGER: "/pharmacy/overview",
  ADMIN: "/management/admin/overview",
  SUPER_ADMIN: "/management/super-admin/overview",
  "SUPER ADMIN": "/management/super-admin/overview",
  MANAGEMENT: "/management/admin/overview",
  SALES: "/management/sales/overview",
  "SALES MANAGER": "/management/sales/overview",
  SUPPORT: "/management/support/overview",
  "SUPPORT TEAM": "/management/support/overview",
  ACCOUNTS: "/management/accounts/overview",
  "ACCOUNTS MANAGER": "/management/accounts/overview",
};

const ROLE_OPTIONS = [
  { value: "PATIENT", label: "Patient", icon: UserRound },
  { value: "HOSPITAL", label: "Hospital", icon: Building2 },
  { value: "LAB", label: "Laboratory", icon: FlaskConical },
  { value: "CLINIC", label: "Clinic", icon: Stethoscope },
  { value: "PHARMACY", label: "Pharmacy", icon: Pill },
] as const;

const ROLE_NAME_FIELD: Record<string, { label: string; placeholder: string; autoComplete: string }> = {
  PATIENT: { label: "Full Name", placeholder: "Enter your full name", autoComplete: "name" },
  HOSPITAL: { label: "Hospital Name", placeholder: "Enter hospital name", autoComplete: "organization" },
  LAB: { label: "Laboratory Name", placeholder: "Enter laboratory name", autoComplete: "organization" },
  CLINIC: { label: "Clinic Name", placeholder: "Enter clinic name", autoComplete: "organization" },
  PHARMACY: { label: "Pharmacy Name", placeholder: "Enter pharmacy name", autoComplete: "organization" },
};

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameField = ROLE_NAME_FIELD[role] ?? ROLE_NAME_FIELD.PATIENT;

  useEffect(() => {
    const queryRole = searchParams.get("role")?.toUpperCase();
    if (queryRole && ROLE_OPTIONS.some((option) => option.value === queryRole)) {
      setRole(queryRole);
    }
  }, [searchParams]);

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok || !data?.access_token) {
        const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
        throw new Error(message || (response.status >= 500 ? "Signup service is unavailable." : "Unable to create account."));
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
      toast.success(`Welcome to MedicalDocs, ${data.user.name}.`);
      router.push(ROLE_DASHBOARD[String(data.user?.role || role).toUpperCase()] ?? "/patient/overview");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05070b] text-white">
      <video className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/medidoc-campaign/hero-video-poster.jpg" aria-label="MedicalDocs connected care journey">
        <source src="/medidoc-connected-care.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,.96)_0%,rgba(5,7,11,.82)_48%,rgba(5,7,11,.64)_100%),linear-gradient(0deg,rgba(5,7,11,.88),transparent_65%)]" />
      <div className={styles.panelGrid} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <Link href="/" className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:text-white sm:left-8 sm:top-7">
        <ArrowLeft className="size-4" /> Back to home
      </Link>

      <div className="relative z-10 grid min-h-[100svh] items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[.85fr_1.15fr] lg:px-[5vw]">
        <section className="hidden max-w-[42rem] lg:block">
          <MediDocBrand />
          <div className="mt-16 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-cyan-200">
            <HeartPulse className="size-4" /> One identity. Every care moment.
          </div>
          <h1 className="mt-7 text-6xl font-semibold leading-[.92] tracking-[-.06em] xl:text-7xl">
            Begin a health story that <span className={styles.displayItalic}>stays connected.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            Patients, hospitals, clinics and laboratories join the same secure care network—so verified information moves with the person who needs it.
          </p>
          <div className="mt-9 grid gap-4 text-sm font-semibold text-slate-200 sm:grid-cols-2">
            {["Records follow the patient", "Reports reach the right team", "Access stays role-protected", "Every action remains traceable"].map((item) => (
              <span key={item} className="flex items-center gap-3"><CheckCircle2 className="size-5 text-cyan-300" />{item}</span>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[720px] rounded-[2rem] border border-white/10 bg-[#081018]/85 p-6 shadow-[0_35px_100px_-40px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:p-9 lg:p-10">
          <div className="mb-8 lg:hidden"><MediDocBrand compact /></div>
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-300"><ShieldCheck className="size-4" /> Secure onboarding</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Create your account.</h2>
            <p className="mt-3 text-base leading-7 text-slate-400">Choose your care role and enter verified account details.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold text-slate-300">I am joining as</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = role === option.value;
                  return <button key={option.value} type="button" aria-pressed={selected} onClick={() => setRole(option.value)} className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-2 text-sm font-semibold transition ${selected ? "border-cyan-300/70 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/[.035] text-slate-300 hover:border-white/25 hover:bg-white/[.065]"}`}><Icon className="size-5" />{option.label}</button>;
                })}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={nameField.label} icon={UserRound}><input type="text" value={name} onChange={(event) => setName(event.target.value)} className={styles.input} placeholder={nameField.placeholder} autoComplete={nameField.autoComplete} required /></Field>
              <Field label="Email address" icon={Mail}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={styles.input} placeholder="you@example.com" autoComplete="email" required /></Field>
            </div>
            <Field label="Password" icon={LockKeyhole}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className={`${styles.input} pr-14`} placeholder="Minimum 6 characters" autoComplete="new-password" minLength={6} required />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>
            </Field>

            <button type="submit" disabled={isLoading} className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-5 text-base font-bold text-slate-950 shadow-[0_12px_35px_-15px_rgba(34,211,238,.75)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? "Creating secure account…" : <>Enter the care network <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></>}
            </button>
          </form>
          <p className="mt-7 text-center text-base text-slate-400">Already registered? <Link href="/auth" className="font-semibold text-white transition hover:text-cyan-300">Sign in securely</Link></p>
          <p className="mt-3 text-center text-xs text-slate-500">Administrative teams sign in only through the <Link href="/management" className="text-slate-300 hover:text-cyan-300">management portal</Link>.</p>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof Mail; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2.5 block text-sm font-semibold text-slate-300">{label}</span><span className="relative block"><Icon className="pointer-events-none absolute left-5 top-1/2 z-10 size-5 -translate-y-1/2 text-slate-500" />{children}</span></label>;
}

export default function SignupPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#05070b] text-cyan-300">Preparing secure onboarding…</main>}><SignupForm /></Suspense>;
}
