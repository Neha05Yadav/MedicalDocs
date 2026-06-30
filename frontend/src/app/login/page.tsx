import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hospital, User, Stethoscope, Microscope, HeartPulse, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex w-full bg-slate-50/50">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-blue-600 text-white p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-700/50 blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <HeartPulse className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight">MediDoc</span>
          </div>

          <div className="mt-auto mb-auto">
            <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-100 mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-300 mr-2"></span>
              Welcome to the future of healthcare
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              Connecting care, <br />
              <span className="text-blue-200">transforming health.</span>
            </h1>
            <p className="text-blue-100/90 text-lg max-w-md leading-relaxed">
              Experience a unified ecosystem for patients, doctors, and facilities. Access your health journey in one secure place.
            </p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <span>© {new Date().getFullYear()} MediDoc Inc.</span>
              <span className="h-4 w-px bg-blue-400/30"></span>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="h-4 w-px bg-blue-400/30"></span>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Decorative Image/Pattern representation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[800px] h-[600px] bg-[url('https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-3xl opacity-20 mix-blend-overlay shadow-2xl rotate-[-6deg]" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">MediDoc</span>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-slate-500">
                Select your portal and enter your details to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="patient" className="w-full mb-8">
                <TabsList className="grid w-full grid-cols-4 h-14 bg-slate-100/50 p-1 border border-slate-200/50">
                  <TabsTrigger value="patient" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex flex-col gap-1 py-1.5 rounded-lg transition-all">
                    <User className="h-4 w-4" />
                    <span className="text-[10px] font-medium">Patient</span>
                  </TabsTrigger>
                  <TabsTrigger value="hospital" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex flex-col gap-1 py-1.5 rounded-lg transition-all">
                    <Hospital className="h-4 w-4" />
                    <span className="text-[10px] font-medium">Hospital</span>
                  </TabsTrigger>
                  <TabsTrigger value="clinic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex flex-col gap-1 py-1.5 rounded-lg transition-all">
                    <Stethoscope className="h-4 w-4" />
                    <span className="text-[10px] font-medium">Clinic</span>
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex flex-col gap-1 py-1.5 rounded-lg transition-all">
                    <Microscope className="h-4 w-4" />
                    <span className="text-[10px] font-medium">Lab</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-600 font-medium text-sm">Email address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-600 font-medium text-sm">Password</Label>
                    <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 transition-shadow"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="remember" className="border-slate-300 text-blue-600 focus-visible:ring-blue-600 rounded-sm" />
                  <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm mt-6 transition-all shadow-md hover:shadow-lg">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-100 pb-8 pt-6">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Sign up now
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
