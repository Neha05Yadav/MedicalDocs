"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  FileHeart,
  Fingerprint,
  FlaskConical,
  Globe2,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MediDocBrand } from "@/components/MediDocBrand";
import styles from "./home.module.css";

const reveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 110]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.35]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05070b] text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className={styles.grain} aria-hidden="true" />
      <Navbar />

      <main>
        <section className={`relative min-h-[100svh] overflow-hidden ${styles.heroStage}`}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/medidoc-campaign/hero-video-poster.jpg"
            className={styles.heroVideo}
            aria-label="A patient journey through a connected hospital, laboratory and care team"
          >
            <source src="/medidoc-connected-care.mp4?v=20260817" type="video/mp4" />
          </video>
          <div className={styles.heroVignette} aria-hidden="true" />
          <div className={styles.cinematicHaze} aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_50%_-10%,rgba(34,211,238,0.2),transparent_62%)]" />
          <div className="absolute -left-48 top-1/3 size-[32rem] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute -right-48 top-1/4 size-[34rem] rounded-full bg-blue-600/10 blur-[140px]" />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative mx-auto flex min-h-[100svh] w-[94vw] flex-col justify-center pb-12 pt-32 sm:pb-44"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative z-20 w-full lg:w-[56vw]"
            >
              <motion.div
                variants={reveal}
                className="mb-7 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
                </span>
                One health story · Every caregiver connected
              </motion.div>

              <motion.h1
                variants={reveal}
                className="w-full text-balance text-[clamp(3.8rem,8.5vw,8.4rem)] font-semibold leading-[0.84] tracking-[-0.07em] drop-shadow-[0_18px_50px_rgba(0,0,0,0.75)]"
              >
                Your care should
                <span className={`block bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent ${styles.displayItalic}`}>
                  remember you.
                </span>
              </motion.h1>

              <motion.p
                variants={reveal}
                className="mt-8 w-full text-pretty text-base leading-7 text-slate-200 drop-shadow-[0_3px_18px_rgba(0,0,0,0.9)] sm:w-[52vw] sm:text-lg sm:leading-8"
              >
                A prescription in one clinic. A report in another lab. A decision inside a hospital.
                MedicalDocs brings every moment together as one secure, living patient story.
              </motion.p>

              <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-7 py-4 text-sm font-bold text-slate-950 transition duration-300 hover:bg-white sm:w-auto"
                >
                  Begin your care journey
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#experience"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-white/[0.08] px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15 sm:w-auto"
                >
                  Discover the story
                  <ArrowDown className="size-4 text-cyan-300 transition-transform group-hover:translate-y-1" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className={`${styles.storyRibbon} absolute inset-x-0 bottom-10`}
            >
              <p>The MedicalDocs journey</p>
              <div><span>01 · PATIENT</span><strong>Arrives at the hospital</strong><small>their health identity comes too</small></div>
              <div><span>02 · LAB</span><strong>Verifies the result</strong><small>the report joins their record</small></div>
              <div><span>03 · HOSPITAL</span><strong>Makes an informed decision</strong><small>the full story is in view</small></div>
            </motion.div>
          </motion.div>
          <a href="#experience" className={styles.scrollCue} aria-label="Scroll to the MedicalDocs experience">
            <span>Scroll to explore</span>
            <ChevronDown className="size-4" />
          </a>
        </section>

        <NetworkStrip />
        <ExperienceSection />
        <CapabilitiesSection />
        <VisionSection />
        <SecuritySection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 transition-all duration-500">
      <nav className={`mx-auto flex h-[4.75rem] w-[94vw] items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-5 ${scrolled ? "border-white/12 bg-[#061019]/88 shadow-[0_18px_55px_rgba(0,0,0,.34)] backdrop-blur-2xl" : "border-white/[.08] bg-[#061019]/42 backdrop-blur-xl"}`} aria-label="Main navigation">
        <Link href="/" className="origin-left scale-[.86] rounded-xl transition-opacity hover:opacity-90 sm:scale-[.9]" aria-label="MedicalDocs home">
          <MediDocBrand />
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/[.045] p-1 text-[13px] font-semibold text-slate-400 lg:flex">
          <a href="#experience" className="rounded-full px-4 py-2.5 transition hover:bg-white/[.07] hover:text-white">Our story</a>
          <a href="#capabilities" className="rounded-full px-4 py-2.5 transition hover:bg-white/[.07] hover:text-white">Capabilities</a>
          <a href="#vision" className="rounded-full px-4 py-2.5 transition hover:bg-white/[.07] hover:text-white">Vision</a>
          <a href="#security" className="rounded-full px-4 py-2.5 transition hover:bg-white/[.07] hover:text-white">Security</a>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/auth" className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[.06] hover:text-white">Log in</Link>
          <Link href="/signup" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_10px_28px_rgba(34,211,238,.18)] transition hover:bg-white">Get started</Link>
        </div>

        <button onClick={() => setOpen(true)} className="rounded-full border border-white/10 p-2.5 text-white lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#05070b] p-6 lg:hidden">
            <div className="flex items-center justify-between">
              <MediDocBrand compact />
              <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-3" aria-label="Close menu"><X className="size-5" /></button>
            </div>
            <div className="mt-20 flex flex-col gap-7 text-4xl font-semibold tracking-tight">
              {[["Our story", "#experience"], ["Capabilities", "#capabilities"], ["Vision", "#vision"], ["Security", "#security"]].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
              ))}
            </div>
            <div className="absolute inset-x-6 bottom-8 grid gap-3">
              <Link href="/auth" className="rounded-full border border-white/15 px-6 py-4 text-center font-semibold">Log in</Link>
              <Link href="/signup" className="rounded-full bg-cyan-300 px-6 py-4 text-center font-bold text-slate-950">Get started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NetworkStrip() {
  const items = ["PATIENTS", "CLINICS", "HOSPITALS", "LABORATORIES", "CARE TEAMS", "HEALTH RECORDS"];
  return (
    <section className="overflow-hidden border-b border-white/10 bg-cyan-300 py-4 text-slate-950" aria-label="Connected MedicalDocs network">
      <div className={styles.marquee}>
        {[...items, ...items].map((item, index) => (
          <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-6 px-6 text-xs font-black tracking-[0.22em]">
            {item}<Sparkles className="size-3" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const careNetwork = [
    { icon: Fingerprint, label: "Patient", detail: "One identity" },
    { icon: Stethoscope, label: "Clinic", detail: "Consultation" },
    { icon: FlaskConical, label: "Laboratory", detail: "Verified result" },
    { icon: Building2, label: "Hospital", detail: "Informed care" },
  ];

  return (
    <section id="experience" className={`relative overflow-hidden px-5 py-28 sm:px-8 md:py-40 lg:px-12 ${styles.storySection}`}>
      <div className="mx-auto w-[90vw]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div variants={reveal}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">How the story unfolds</p>
            <h2 className="w-full text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:w-[54vw]">A patient enters the hospital.<br /><span className={styles.displayItalic}>MedicalDocs carries the story.</span></h2>
          </motion.div>
          <motion.p variants={reveal} className="w-full text-lg leading-8 text-slate-300 lg:w-[38vw] lg:justify-self-end">MedicalDocs is the thread between every healthcare moment. It lets the patient move forward without leaving prescriptions, reports or clinical context behind.</motion.p>
        </motion.div>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <motion.article initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`group relative min-h-[38rem] overflow-hidden rounded-[2.5rem] ${styles.storyMedia}`}>
            <div className={styles.careStoryCast} aria-label="Patient and care team journey">
              <video autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}><source src="/medidoc-connected-care.mp4?v=20260817" type="video/mp4" /></video>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#02060b] via-[#02060b]/25 to-cyan-950/10" />
            <div className="absolute left-6 top-6 z-10 flex items-center gap-3 rounded-full bg-cyan-300 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-slate-950"><Fingerprint className="size-4" /> Patient + Care Team</div>
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Chapter 01 · Patient + Hospital</span>
              <h3 className="mt-4 w-full text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl xl:w-[40vw]">The patient arrives. Their medical history arrives with them.</h3>
              <p className="mt-4 w-full leading-7 text-slate-300 xl:w-[34vw]">A verified MedicalDocs identity brings essential medical context into the room from the very first conversation.</p>
            </div>
          </motion.article>

          <div className="grid gap-5">
            <motion.article initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`group relative min-h-[18.5rem] overflow-hidden rounded-[2.5rem] ${styles.storyMedia}`}>
              <video autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105">
                <source src="/medidoc-lab-verification.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-violet-950 via-slate-950/35 to-transparent" />
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-violet-200 px-3.5 py-2 text-[10px] font-black uppercase tracking-[.18em] text-violet-950"><FlaskConical className="size-4" /> Laboratory</div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200">Chapter 02 · Verified lab result</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">The lab verifies the sample. The report reaches patient and doctor.</h3>
              </div>
            </motion.article>

            <motion.article initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .12 }} className={`relative min-h-[18.5rem] overflow-hidden rounded-[2.5rem] bg-cyan-300 p-7 text-slate-950 ${styles.storyPatternCard}`}>
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em]">Chapter 03 · Hospital care team</span>
                  <span className="grid size-11 place-items-center rounded-full bg-slate-950 text-cyan-200"><Building2 className="size-5" /></span>
                </div>
                <div className="mt-7 grid gap-2">
                  {["Lab report attached", "Medication history available", "Patient identity verified"].map(item => <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-950/[.08] px-3 py-2 text-xs font-bold"><Check className="size-4" />{item}</div>)}
                </div>
                <div className="mt-auto pt-6">
                  <h3 className="text-3xl font-semibold leading-tight tracking-[-0.04em]">The hospital sees the whole picture.</h3>
                </div>
              </div>
            </motion.article>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.careFlow}>
          <div className="mb-7 flex items-end justify-between gap-5">
            <div><span className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">One connected care path</span><h3 className="mt-2 text-2xl font-semibold">The record moves. The patient never starts over.</h3></div>
            <Network className="hidden size-7 text-cyan-300 sm:block" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {careNetwork.map((item, index) => (
              <div key={item.label} className="group relative rounded-2xl bg-white/[0.055] p-5 transition hover:bg-white/[0.09]">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><item.icon className="size-5" /></span>
                  <div><strong className="block text-sm">{item.label}</strong><small className="mt-1 block text-xs text-slate-500">{item.detail}</small></div>
                </div>
                {index < careNetwork.length - 1 && <ArrowRight className="absolute -right-2.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-cyan-300 p-1 text-slate-950 lg:block" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  const timeline = [
    { time: "09:10", label: "Consultation", detail: "Clinical notes added" },
    { time: "09:24", label: "Prescription", detail: "Medication recorded" },
    { time: "11:40", label: "Lab report", detail: "Result verified" },
    { time: "12:05", label: "Care plan", detail: "Doctor reviewed" },
  ];

  const labFlow = ["Requested", "Sampled", "Verified", "Shared"];

  return (
    <section id="capabilities" className={`relative overflow-hidden px-5 py-28 sm:px-8 md:py-40 lg:px-12 ${styles.capabilityStage}`}>
      <div className={styles.capabilityAura} aria-hidden="true" />
      <div className="mx-auto w-[90vw]">
        <div className="relative mb-16 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">See MedicalDocs working</p><h2 className="text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">The story stays alive.<br /><span className={styles.displayItalic}>Every step stays visible.</span></h2></div>
          <p className="w-full text-base leading-7 text-slate-300 md:w-[34vw]">Not another static record vault. MedicalDocs turns every care event into a clear, useful timeline for the people who need it.</p>
        </div>

        <div className="relative grid gap-5 lg:grid-cols-[1.45fr_.75fr]">
          <motion.article initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.recordCard}>
            <div className="flex items-center justify-between">
              <div><span className="text-[10px] font-black uppercase tracking-[.23em] text-cyan-300">Live patient record</span><p className="mt-2 text-sm text-slate-400">Aarav&apos;s care journey · Updated now</p></div>
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_36px_rgba(34,211,238,.28)]"><FileHeart className="size-5" /></span>
            </div>

            <div className={styles.recordCinema}>
              <div className={styles.recordHumanCast} aria-hidden="true">
                <video autoPlay muted loop playsInline preload="auto" tabIndex={-1}><source src="/medidoc-connected-care.mp4?v=20260817" type="video/mp4" /></video>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#07111a]/95 via-[#07111a]/55 to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-emerald-300 px-3.5 py-2 text-[10px] font-black uppercase tracking-[.16em] text-emerald-950"><span className="size-2 animate-pulse rounded-full bg-emerald-700" /> Identity verified</div>
              <div className="absolute bottom-6 left-6 w-[70%]"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-200">Human care, connected digitally</span><p className="mt-2 text-xl font-semibold leading-tight">The patient moves forward. Their context moves with them.</p></div>
            </div>

            <div className={styles.timelinePanel}>
              <div className={styles.timelineTrack}><motion.span initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.8, ease: "easeOut" }} /></div>
              <div className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {timeline.map((event, index) => (
                  <motion.div key={event.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 + index * .12 }} className="relative pt-7">
                    <span className={styles.timelineNode}><span /></span>
                    <small className="font-mono text-[10px] text-cyan-300">{event.time}</small>
                    <strong className="mt-2 block text-sm">{event.label}</strong>
                    <p className="mt-1 text-xs text-slate-500">{event.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8"><h3 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Every record becomes one living timeline.</h3><p className="mt-3 w-full leading-7 text-slate-400 lg:w-[48vw]">Visits, prescriptions, verified reports and decisions stay in sequence—so nobody has to reconstruct the story from scattered files.</p></div>
          </motion.article>

          <div className="grid gap-5">
            <motion.article initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.labCapabilityCard}>
              <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.22em] text-violet-200">Laboratory workflow</span><span className="grid size-11 place-items-center rounded-xl bg-violet-200 text-violet-950"><FlaskConical className="size-5" /></span></div>
              <div className="mt-8 rounded-[1.5rem] bg-slate-950/45 p-5 shadow-inner">
                <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"><span>Blood panel</span><span className="text-emerald-300">Verified</span></div>
                <div className="relative grid grid-cols-4 gap-2">
                  <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="absolute left-[10%] right-[10%] top-3 h-px origin-left bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-300" />
                  {labFlow.map((step, index) => <div key={step} className="relative z-10 text-center"><span className={`mx-auto block size-6 rounded-full border-4 border-[#141127] ${index === 3 ? "bg-emerald-300" : "bg-violet-300"}`} /><small className="mt-3 block text-[9px] font-bold text-slate-400">{step}</small></div>)}
                </div>
              </div>
              <h3 className="mt-8 text-3xl font-semibold leading-tight tracking-[-.04em]">Results move before paper does.</h3>
              <p className="mt-3 leading-7 text-violet-100/65">The report reaches the patient record and authorized care team as soon as the lab verifies it.</p>
            </motion.article>

            <motion.article initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .12 }} className={styles.securityCapabilityCard}>
              <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.22em] text-emerald-200">Protected by design</span><span className="grid size-11 place-items-center rounded-xl bg-emerald-200 text-emerald-950"><ShieldCheck className="size-5" /></span></div>
              <div className={styles.accessVisual}>
                <div className={styles.accessOrbit}><span /><span /></div>
                <div className="relative z-10 grid size-20 place-items-center rounded-full bg-emerald-300 text-emerald-950 shadow-[0_0_55px_rgba(110,231,183,.25)]"><Fingerprint className="size-8" /></div>
                <span className="absolute bottom-3 rounded-full bg-emerald-950/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.16em] text-emerald-200">Authorized access only</span>
              </div>
              <h3 className="mt-7 text-3xl font-semibold leading-tight tracking-[-.04em]">Private at every handoff.</h3>
              <p className="mt-3 leading-7 text-emerald-100/60">Roles decide who can view, update or share each part of the patient&apos;s story.</p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const vision = [
    { icon: FileHeart, audience: "For every person", title: "Your health story stays yours.", copy: "A clear, continuous record that can support care across every stage of life." },
    { icon: Stethoscope, audience: "For every care team", title: "Context arrives before decisions.", copy: "The right information is available without chasing files, calls or repeated histories." },
    { icon: Network, audience: "For the health network", title: "Care works as one system.", copy: "Clinics, laboratories and hospitals collaborate around the patient instead of isolated portals." },
  ];

  return (
    <section id="vision" className="relative overflow-hidden bg-[#dff9fb] px-5 py-28 text-slate-950 sm:px-8 md:py-40 lg:px-12">
      <div className={styles.visionPattern} aria-hidden="true" />
      <div className="relative mx-auto w-[90vw]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full lg:w-[76vw]">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.26em] text-cyan-700">Our vision for connected healthcare</p>
          <h2 className="text-balance text-5xl font-semibold leading-[.94] tracking-[-.06em] sm:text-7xl md:text-8xl">Information should arrive <span className={styles.displayItalic}>before a patient has to repeat it.</span></h2>
          <p className="mt-7 w-full text-lg leading-8 text-slate-700 md:w-[52vw]">MedicalDocs imagines healthcare as one trusted continuum—not a collection of disconnected visits, PDFs and counters.</p>
        </motion.div>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {vision.map((item, index) => (
            <motion.article key={item.audience} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} className="group rounded-[2rem] bg-white/75 p-7 shadow-[0_24px_70px_-42px_rgba(8,47,73,.35)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:bg-white sm:p-9">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-700">{item.audience}</span>
                <span className="grid size-12 place-items-center rounded-full bg-slate-950 text-cyan-200"><item.icon className="size-5" /></span>
              </div>
              <h3 className="mt-16 text-3xl font-semibold leading-tight tracking-[-.04em]">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const points = ["Role-based access", "Encrypted health data", "Verified care identities", "Traceable actions"];
  return (
    <section id="security" className="relative overflow-hidden px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="relative mx-auto grid w-[90vw] gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Trust is the infrastructure</p>
          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">Sensitive by nature.<br /><span className={styles.displayItalic}>Protected by design.</span></h2>
          <p className="mt-7 w-full text-lg leading-8 text-slate-400 lg:w-[38vw]">Patient information deserves more than a password. MedicalDocs builds security into every identity, permission and exchange.</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">{points.map(point => <div key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-300"><span className="grid size-6 place-items-center rounded-full bg-emerald-300/10 text-emerald-300"><Check className="size-3.5" /></span>{point}</div>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative mx-auto grid aspect-square w-[78vw] place-items-center sm:w-[55vw] lg:w-[34vw]">
          <div className={styles.orbit} aria-label="Connected healthcare network">
            <span><i />Patient</span>
            <span><i />Hospital</span>
            <span><i />Labs</span>
          </div>
          <div className="relative grid size-44 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/[0.07] shadow-[0_0_100px_rgba(34,211,238,0.16)] backdrop-blur-xl"><ShieldCheck className="size-16 text-cyan-200" /><div className="absolute -bottom-12 whitespace-nowrap text-center"><span className="block text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Security status</span><span className="mt-1 block text-sm text-slate-400">All systems protected</span></div></div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-5 pb-8 sm:px-8 lg:px-12">
      <div className="relative mx-auto w-[94vw] overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-cyan-300 px-6 py-20 text-center text-slate-950 sm:rounded-[3rem] sm:px-12 md:py-28">
        <div className={styles.ctaLines} />
        <div className="relative z-10 mx-auto w-full md:w-[70vw]">
          <Globe2 className="mx-auto mb-7 size-9" />
          <h2 className="text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.065em] sm:text-7xl md:text-8xl">The future of care is already connected.</h2>
          <p className="mx-auto mt-7 w-full text-base font-medium leading-7 text-slate-800/75 md:w-[44vw]">Bring your patients, teams and medical data into one clear, secure experience.</p>
          <Link href="/signup" className="group mx-auto mt-9 inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white transition hover:scale-[1.03]">Start with MedicalDocs <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-[92vw] flex-col justify-between gap-8 border-t border-white/10 pt-10 md:flex-row md:items-end">
        <div><Link href="/" aria-label="MedicalDocs home"><MediDocBrand compact /></Link><p className="mt-4 w-full text-sm leading-6 text-slate-500 md:w-[28vw]">Connected healthcare, designed around people.</p></div>
        <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-500"><Link href="/patient" className="hover:text-white">Patient</Link><Link href="/clinic" className="hover:text-white">Clinic</Link><Link href="/hospital" className="hover:text-white">Hospital</Link><Link href="/laboratory" className="hover:text-white">Laboratory</Link></div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} MedicalDocs</p>
      </div>
    </footer>
  );
}
