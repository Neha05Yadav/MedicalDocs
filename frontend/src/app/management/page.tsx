"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShieldPlus, 
  Crown, 
  Settings, 
  CircleDollarSign, 
  BarChart3, 
  Headphones, 
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

const roles = [
  { id: "superadmin", name: "Super Admin", desc: "Full system access and control", icon: Crown, color: "bg-indigo-600" },
  { id: "admin", name: "Admin", desc: "Manage system users and settings", icon: Settings, color: "bg-blue-600" },
  { id: "accounts", name: "Accounts", desc: "Manage financial transactions", icon: CircleDollarSign, color: "bg-emerald-600" },
  { id: "sales", name: "Sales", desc: "Manage leads and sales activities", icon: BarChart3, color: "bg-amber-500" },
  { id: "support", name: "Support", desc: "Handle support tickets and queries", icon: Headphones, color: "bg-rose-500" },
];

export default function ManagementLoginPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

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

          {/* Roles List */}
          <div className="space-y-4 mb-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Authorized Roles</h3>
            
            {roles.map((role) => (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`flex items-center gap-4 p-3 rounded-xl backdrop-blur-sm transition-all cursor-pointer ${
                  selectedRole.id === role.id 
                    ? "bg-slate-900/80 border border-indigo-500/70 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                    : "bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700/60"
                }`}
              >
                <div className={`${role.color} p-3 rounded-lg flex-shrink-0 transition-transform ${selectedRole.id === role.id ? 'scale-110' : ''}`}>
                  <role.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold text-sm transition-colors ${selectedRole.id === role.id ? 'text-indigo-300' : 'text-white'}`}>
                    {role.name}
                  </div>
                  <div className="text-slate-400 text-xs">{role.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Warning */}
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-12">
            <ShieldAlert className="h-4 w-4" />
            <span>Authorized personnel only.</span>
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
          <div 
            key={selectedRole.id} 
            className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full border border-slate-100 animate-in fade-in zoom-in-[0.98] duration-500 slide-in-from-bottom-2"
          >
            
            {/* Form Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className={`p-4 rounded-2xl mb-6 bg-slate-50 text-slate-700 shadow-sm border border-slate-100`}>
                <selectedRole.icon className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedRole.name} Login</h2>
              <p className="text-slate-500 text-sm">Sign in to continue to your account</p>
            </div>

            {/* Form */}
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
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
                    type="password" 
                    placeholder="Enter your password" 
                    className="pl-10 pr-10 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 rounded-xl"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Eye className="h-5 w-5" />
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

              <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[15px] rounded-xl transition-all shadow-md shadow-indigo-200">
                <Lock className="mr-2 h-4 w-4" />
                Sign In as {selectedRole.name}
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
