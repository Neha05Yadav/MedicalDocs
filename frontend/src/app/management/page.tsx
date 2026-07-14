"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  ShieldPlus, 
  Settings, 
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Database,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function ManagementLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Check for inactive accounts
      if (data.user?.status === "Inactive" || data.user?.status === "Suspended") {
        throw new Error("Your account has been deactivated. Please contact Super Admin.");
      }

      const role = data.user.role?.toUpperCase() || "";
      
      let destination = "";
      if (role.includes("SUPER")) destination = "/management/super-admin/overview";
      else if (role.includes("ADMIN")) destination = "/management/admin/overview";
      else if (role.includes("ACCOUNT")) destination = "/management/accounts/overview";
      else if (role.includes("SALE")) destination = "/management/sales/overview";
      else if (role.includes("SUPPORT")) destination = "/management/support/overview";
      else {
        throw new Error("Access Denied: You do not have a management role.");
      }

      // Save token in localStorage (for client-side) and cookie (for middleware)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect based on role
      toast.success("Login successful!");
      router.push(destination);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Dark Theme */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0B1120] text-white p-12 xl:p-16 relative overflow-hidden">
        {/* Subtle background rings/glow */}
        <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border-[1px] border-slate-800/50 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 -right-[15%] w-[600px] h-[600px] rounded-full border-[1px] border-slate-800/40 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 -right-[5%] w-[400px] h-[400px] rounded-full border-[1px] border-slate-800/30 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight leading-none">MediDoc</div>
              <div className="text-indigo-400 text-sm font-medium">Management Portal</div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Welcome to <br />
              <span className="text-indigo-500">Management Portal</span>
            </h1>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed">
              Securely access and manage the MediDoc platform with your administrative credentials.
            </p>
          </div>

          {/* System Features */}
          <div className="space-y-6 mb-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Portal Capabilities</h3>
            
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg text-indigo-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-200">Role-Based Access Control</h4>
                <p className="text-sm text-slate-400">Dynamic routing tailored to your administrative role.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-200">Centralized Data Management</h4>
                <p className="text-sm text-slate-400">Oversee users, facilities, and platform analytics.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg text-rose-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-200">System Monitoring</h4>
                <p className="text-sm text-slate-400">Track system health, alerts, and performance metrics.</p>
              </div>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-12">
            <ShieldAlert className="h-4 w-4" />
            <span>Authorized personnel only. Secure connection active.</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Area */}
      <div className="w-full lg:w-[55%] relative flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
        
        {/* Background Split - Top Dashboard Image, Bottom Solid */}
        <div className="absolute inset-0 flex flex-col z-0">
          <div className="h-[55%] w-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-top opacity-90 brightness-50" />
          <div className="h-[45%] w-full bg-slate-100/50" />
        </div>

        {/* Floating Login Card */}
        <div className="relative z-10 w-full max-w-[460px] px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full border border-slate-100 animate-in fade-in zoom-in-[0.98] duration-500 slide-in-from-bottom-2">
            
            {/* Form Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="p-4 rounded-2xl mb-6 bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                <Settings className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Portal Login</h2>
              <p className="text-slate-500 text-sm">Sign in to your administrative account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="pl-10 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    className="pl-10 pr-10 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 rounded-xl"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-[4px]" 
                  />
                  <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button disabled={isLoading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[15px] rounded-xl transition-all shadow-md shadow-indigo-200">
                <Lock className="mr-2 h-4 w-4" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          {/* Bottom Security Badge */}
          <div className="flex items-center justify-center gap-2 text-slate-500 mt-8 font-medium text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Authorized Personnel Only</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
