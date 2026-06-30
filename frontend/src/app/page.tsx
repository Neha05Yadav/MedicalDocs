import Shield from "lucide-react/dist/esm/icons/shield.mjs";
import Share2 from "lucide-react/dist/esm/icons/share-2.mjs";
import FileText from "lucide-react/dist/esm/icons/file-text.mjs";
import Stethoscope from "lucide-react/dist/esm/icons/stethoscope.mjs";
import Users from "lucide-react/dist/esm/icons/users.mjs";
import Activity from "lucide-react/dist/esm/icons/activity.mjs";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.mjs";

import Link from "next/link";
export const metadata = {
  title: "MediDoc — Your Health Records, Unified",
  description: "Securely store, manage, and share your medical records across any hospital or clinic with MediDoc.",
};
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
            <div className="size-4 bg-white rounded-sm" />
          </div>
          <span className="font-semibold text-lg tracking-tight">MediDoc</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
          <Link href="/auth" className="hover:text-foreground transition-colors">Log in</Link>
          <Link
            href="/signup"
            className="bg-brand text-background text-sm font-medium py-2 px-4 rounded-lg ring-1 ring-brand hover:brightness-110 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-muted border border-brand/10 text-brand text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="size-1.5 rounded-full bg-brand animate-pulse" />
          Securing 2M+ Records
        </div>
        <h1 className="text-balance text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
          Your health history, <span className="text-brand">unified.</span>
        </h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-[48ch] mb-10">
          Securely store, manage, and share your medical records across any hospital or clinic. Take control of your healthcare journey with MediDoc.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="bg-brand text-background text-base font-medium py-3 px-6 rounded-xl ring-1 ring-brand flex items-center gap-2 hover:brightness-110 transition-all"
          >
            <Shield className="size-5" />
            Create Free Account
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-xl border border-border">
            <Stethoscope className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Trusted by 500+ clinics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Unified Records",
      description: "Upload PDFs, scans, and physical documents. We categorize them automatically for quick retrieval during appointments.",
    },
    {
      icon: Share2,
      title: "Instant Sharing",
      description: "Grant temporary access to doctors via a secure link or QR code. They view your history without needing to register.",
    },
    {
      icon: Shield,
      title: "HIPAA Privacy",
      description: "Your data is encrypted end-to-end. We never sell your health information to third-party providers or advertisers.",
    },
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need for your health</h2>
        <p className="text-muted-foreground text-pretty max-w-[56ch] mx-auto">
          MediDoc gives patients and hospitals the tools to manage health data securely and efficiently.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="p-8 bg-card ring-1 ring-black/5 rounded-[20px] hover:shadow-lg hover:shadow-brand/5 transition-all">
            <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-6">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Create Your Account", desc: "Sign up in under a minute with your email or Google account. Verify with a quick OTP." },
    { num: "02", title: "Complete Your Profile", desc: "Add your date of birth, blood group, and emergency contact for a complete health identity." },
    { num: "03", title: "Upload Records", desc: "Drag and drop prescriptions, lab reports, X-rays, MRIs, and vaccination certificates." },
    { num: "04", title: "Share with Doctors", desc: "When visiting a new hospital, grant secure access to your records instantly. No paper needed." },
  ];
  return (
    <section id="how-it-works" className="bg-muted/50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-muted-foreground text-pretty max-w-[56ch] mx-auto">
            Getting started with MediDoc takes just a few minutes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="p-6 bg-card ring-1 ring-black/5 rounded-2xl">
              <span className="font-mono text-3xl font-bold text-brand/30">{s.num}</span>
              <h3 className="text-lg font-semibold mt-4 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function BenefitsSection() {
  const benefits = [
    { icon: Activity, title: "No more lost reports", desc: "Every prescription, lab result, and imaging report stays safely in your digital vault forever." },
    { icon: Users, title: "Family health management", desc: "Add family members and manage their records from one account — perfect for parents and caregivers." },
    { icon: Stethoscope, title: "Hospital partnerships", desc: "Leading hospitals use MediDoc to access patient history instantly, reducing redundant tests." },
    { icon: Shield, title: "Military-grade encryption", desc: "AES-256 encryption, SOC 2 compliance, and strict HIPAA adherence keep your data safe." },
  ];
  return (
    <section id="benefits" className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
            Built for <span className="text-brand">better healthcare.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 text-pretty">
            Whether you are a patient managing lifelong records or a hospital streamlining admissions, MediDoc removes friction from healthcare data.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-brand text-background text-base font-medium py-3 px-6 rounded-xl ring-1 ring-brand hover:brightness-110 transition-all"
          >
            Get Started Free
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-4 p-6 bg-card ring-1 ring-black/5 rounded-2xl">
              <div className="size-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center shrink-0">
                <b.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="bg-brand py-20 px-6 rounded-3xl text-center">
        <h2 className="text-4xl font-semibold text-background mb-6 text-balance tracking-tight">
          Start managing your health with precision.
        </h2>
        <p className="text-brand-muted max-w-[48ch] mx-auto mb-10 text-pretty leading-relaxed">
          Join over 150,000 patients who have consolidated their health records for a safer, more connected healthcare experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-background text-brand text-base font-medium py-3 px-8 rounded-xl ring-1 ring-background transition-transform hover:scale-105"
          >
            Register as Patient
          </Link>
          <Link
            href="/auth"
            className="bg-brand text-background border border-background/20 text-base font-medium py-3 px-8 rounded-xl transition-colors hover:bg-background/10"
          >
            Hospital Login
          </Link>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 bg-brand rounded flex items-center justify-center">
                <div className="size-3 bg-background rounded-sm" />
              </div>
              <span className="font-semibold tracking-tight">MediDoc</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The secure, patient-owned health data platform. HIPAA-compliant infrastructure designed for the modern medical world.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Product</p>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Company</p>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Legal</p>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs font-bold uppercase tracking-tighter text-muted-foreground">
            MediDoc &copy; {new Date().getFullYear()}
          </span>
          <span className="text-xs text-muted-foreground">Secure & Encrypted</span>
        </div>
      </div>
    </footer>
  );
}
