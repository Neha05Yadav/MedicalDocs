import Shield from "lucide-react/dist/esm/icons/shield.mjs";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left.mjs";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify OTP — MediDoc" },
      { name: "description", content: "Verify your MediDoc account with OTP." },
    ],
  }),
  component: VerifyOtpPage,
});
function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  function handleChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }
  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  }
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setIsLoading(true);
    // Simulate OTP verification delay
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success("OTP verified!");
    window.location.href = "/complete-profile";
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
              <Shield className="size-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MediDoc</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verify your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                maxLength={1}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-brand text-background rounded-xl text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Didn't receive a code?{" "}
          <button className="text-brand font-medium hover:underline" onClick={() => toast.info("Code resent!")}>
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
