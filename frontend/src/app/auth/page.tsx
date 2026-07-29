"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MediDocBrand } from "@/components/MediDocBrand";
import styles from "./auth.module.css";

const ROLE_DASHBOARD: Record<string, string> = {
  PATIENT: "/patient/overview",
  HOSPITAL: "/hospital/overview",
  LAB: "/laboratory/overview",
  LABORATORY: "/laboratory/overview",
  LAB_MANAGER: "/laboratory/overview",
  TECHNICIAN: "/laboratory/overview",
  CLINIC: "/clinic/overview",
  DOCTOR: "/clinic/overview",
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

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailLogin(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = Array.isArray(errorData.message) ? errorData.message[0] : (errorData.message || errorMessage);
        } catch {
          if (response.status === 500 || response.status === 502) {
            errorMessage = "Backend server is offline or unreachable.";
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const userRole = (data.user?.role || "").toUpperCase();

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;

      toast.success(`Welcome back, ${data.user.name}!`);
      
      const roleDashboard = ROLE_DASHBOARD[userRole] ?? "/patient/overview";
      const portalRoot = `/${roleDashboard.split("/")[1]}`;
      let redirectUrl = roleDashboard;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get("returnUrl");
        // Never let a stale returnUrl move a successfully authenticated user
        // outside the portal allowed for their role.
        if (returnUrl && (returnUrl === portalRoot || returnUrl.startsWith(`${portalRoot}/`))) {
          redirectUrl = returnUrl;
        }
      }

      // A full navigation guarantees the freshly written auth cookie is
      // available to the route proxy before the protected page is evaluated.
      window.location.replace(redirectUrl);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/patient` },
    });
    if (error) toast.error(error.message || "Google login failed");
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#05070b] text-white">
      <div className={styles.grain} aria-hidden="true" />
      <Link
        href="/"
        className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2.5 text-xs font-semibold text-white/75 backdrop-blur-xl transition hover:border-white/20 hover:text-white sm:left-8 sm:top-7"
      >
        <ArrowLeft className="size-3.5" />
        Back to home
      </Link>

      <div className="grid min-h-[100svh] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-[100svh] overflow-hidden border-r border-white/10 lg:block">
          <video
            className="absolute inset-0 size-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/medidoc-campaign/hero-video-poster.jpg"
            aria-label="Connected healthcare team in motion"
          >
            <source src="/medidoc-connected-care.mp4" type="video/mp4" />
          </video>
          <div className={styles.imageOverlay} />
          <div className={styles.panelGrid} />

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-between p-12 xl:p-16">
            <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" />
              Secure connection
            </div>

            <div className="max-w-2xl pb-12">
              <div className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.23em] text-cyan-200">
                <Sparkles className="size-4" />
                Your care network awaits
              </div>
              <h1 className="text-balance text-6xl font-semibold leading-[0.9] tracking-[-0.06em] xl:text-7xl">
                Your health story,
                <span className={styles.displayItalic}> always within reach.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                One secure identity for your records, appointments, prescriptions and every care team you trust.
              </p>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-slate-300">
                {["Encrypted records", "Verified providers", "Real-time access"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-cyan-300" /> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              <span>MedicalDocs identity gateway</span>
              <span>Protected / 24×7</span>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[100svh] items-center justify-center px-5 py-28 sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.09),transparent_40%)]" />
          <div className={styles.mobileGrid} aria-hidden="true" />

          <div className={`relative z-10 w-full max-w-[620px] ${styles.loginCard}`}>
            <div className="mb-10">
              <Link href="/" className="mb-10 inline-flex lg:hidden" aria-label="MedicalDocs home">
                <MediDocBrand compact />
              </Link>

              <div className="mb-6 hidden lg:block">
                <MediDocBrand compact />
              </div>

              <h2 className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Welcome back.</h2>
              <p className="mt-4 text-base leading-7 text-slate-400">Sign in securely to continue to your healthcare workspace.</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4.5 text-base font-semibold transition hover:border-white/20 hover:bg-white/[0.075]"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">or use email</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2.5 block text-sm font-semibold text-slate-300">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={styles.input}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</label>
                  <button type="button" onClick={() => toast.info("Please contact support to reset your password.")} className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">Forgot password?</button>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${styles.input} pr-12`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                  <input type="checkbox" className="size-5 rounded border-white/15 bg-white/5 accent-cyan-300" />
                  Keep me signed in
                </label>
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300/70">
                  <ShieldCheck className="size-4" /> Protected
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-5 text-base font-bold text-slate-950 shadow-[0_12px_35px_-15px_rgba(34,211,238,0.75)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <><span className={styles.spinner} /> Verifying identity...</> : <>Sign in securely <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-base text-slate-500">
              New to MedicalDocs? <Link href="/signup" className="font-semibold text-white transition hover:text-cyan-300">Create your account</Link>
            </p>

            <Link href="/management" className="mt-6 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.17em] text-slate-600 transition hover:text-slate-400">
              <FlaskConical className="size-4" /> Management team access
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
