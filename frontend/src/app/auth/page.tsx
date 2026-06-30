"use client";
import Eye from "lucide-react/dist/esm/icons/eye.mjs";
import EyeOff from "lucide-react/dist/esm/icons/eye-off.mjs";
import Mail from "lucide-react/dist/esm/icons/mail.mjs";
import Lock from "lucide-react/dist/esm/icons/lock.mjs";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.mjs";
import Shield from "lucide-react/dist/esm/icons/shield.mjs";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication for testing - allow any credentials
    setTimeout(() => {
      setIsLoading(false);
      const emailLower = email.toLowerCase();
      if (emailLower.includes("hospital")) {
        toast.success("Welcome to Hospital Dashboard!");
        router.push("/hospital");
      } else if (emailLower.includes("clinic") || emailLower.includes("dr") || emailLower.includes("doctor")) {
        toast.success("Welcome to Clinic Dashboard!");
        router.push("/clinic");
      } else {
        toast.success("Welcome back!");
        router.push("/patient");
      }
    }, 800);
  }
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/patient`
      }
    });
    if (error) {
      toast.error(error.message || "Google login failed");
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
              <Shield className="size-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MediDoc</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your health records.</p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors mb-6"
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
          </div>
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo Logins</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { setEmail("user@demo.com"); setPassword("123456"); }} className="py-2 px-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors text-center">Patient</button>
            <button onClick={() => { setEmail("clinic@demo.com"); setPassword("123456"); }} className="py-2 px-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors text-center">Clinic</button>
            <button onClick={() => { setEmail("hospital@demo.com"); setPassword("123456"); }} className="py-2 px-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors text-center">Hospital</button>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
