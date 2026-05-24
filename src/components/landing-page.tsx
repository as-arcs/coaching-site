"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Mail,
  Dumbbell,
  Utensils,
  ClipboardList,
  MessageCircle,
  TrendingUp,
  Shield,
  GraduationCap,
  Briefcase,
  Zap,
  Check,
  Trophy,
  Phone,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.63z" />
  </svg>
)

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const navLinks = [
  ["#programs", "Programs"],
  ["#process", "Process"],
  ["#about", "About"],
  ["#results", "Results"],
  ["#apply", "Apply"],
] as const

function RadioGroup({
  name,
  options,
  label,
}: {
  name: string
  options: string[]
  label: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div className="flex flex-wrap gap-2 pt-1">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer select-none">
            <input type="radio" name={name} value={opt} className="sr-only peer" />
            <span className="inline-block rounded-3xl border px-3 py-1.5 text-sm transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:bg-muted">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-[#faf9f7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#faf9f7]/60 ${scrollY > 50 ? "shadow-md" : ""}`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between border-x border-muted">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center"
            >
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="font-semibold text-xl">Amir Coaching</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={href} className="text-sm font-medium transition-colors hover:text-primary">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="#apply" className={cn(buttonVariants({ size: "sm" }), "rounded-3xl")}>
              Apply Now
            </Link>
          </div>

          <button className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#faf9f7] md:hidden"
        >
          <div className="container mx-auto flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl">Amir Coaching</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container mx-auto grid gap-3 pb-8 pt-6"
          >
            {navLinks.map(([href, item]) => (
              <motion.div key={href} variants={itemFadeIn}>
                <Link
                  href={href}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="pt-4">
              <Link
                href="#apply"
                onClick={() => setIsMenuOpen(false)}
                className={cn(buttonVariants(), "w-full rounded-3xl")}
              >
                Apply Now
              </Link>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="w-full py-16 md:py-28 lg:py-36 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
            {/* decorative background blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl" />

            <div className="flex flex-col items-center text-center py-16 space-y-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-3xl bg-muted px-3 py-1 text-sm"
              >
                <Zap className="mr-1 h-3 w-3" />
                Evidence-Based Online Coaching
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none max-w-4xl"
              >
                Transform your body without{" "}
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  giving up your life
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="max-w-2xl text-muted-foreground md:text-xl leading-relaxed"
              >
                Personalized 1-on-1 coaching built around your schedule, goals, and lifestyle, not someone
                else&apos;s cookie-cutter plan.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col gap-3 sm:flex-row justify-center"
              >
                <Link href="#apply" className={cn(buttonVariants({ size: "lg" }), "rounded-3xl group")}>
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#process"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-3xl")}
                >
                  See How It Works
                </Link>
              </motion.div>

              {/* Social proof cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="w-full max-w-3xl space-y-3 pt-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "100%", label: "Personalized" },
                    { value: "24hr", label: "Response time" },
                    { value: "12wk", label: "Min. program" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-3xl border bg-background/80 p-4 text-center">
                      <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-3xl border bg-background/80 p-6 shadow-sm text-left">
                    <p className="text-base font-medium leading-relaxed text-foreground/90">
                      &quot;Down 12 lbs in 8 weeks and I actually enjoy training now. Amir completely worked around
                      my schedule.&quot;
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">&middot; Jacob R., student &amp; RBT</p>
                  </div>
                  <div className="rounded-3xl border bg-muted/40 p-5 space-y-2.5 text-left">
                    {[
                      "Custom program delivered within 48 hours",
                      "Weekly adjustments based on real data",
                      "Direct WhatsApp access to Amir",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Built For ── */}
        <section id="programs" className="w-full py-12 md:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  Who This Is For
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Built for people like you
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed leading-relaxed"
                >
                  This coaching is for people who are serious about results. You need a plan that holds up in real
                  life, not just in theory.
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-4xl gap-4 pb-10 md:grid-cols-3"
            >
              {[
                {
                  icon: <GraduationCap className="h-8 w-8 text-primary" />,
                  title: "Busy Students",
                  description:
                    "MCAT prep, nursing school, med school. You have zero margin but serious goals. You know something has to change.",
                },
                {
                  icon: <Briefcase className="h-8 w-8 text-primary" />,
                  title: "Young Professionals",
                  description:
                    "Long hours, late nights, travel. You want a body that reflects how hard you work, without your health becoming another thing that slips.",
                },
                {
                  icon: <Dumbbell className="h-8 w-8 text-primary" />,
                  title: "Dedicated Lifters",
                  description:
                    "You've been putting in the work but the results aren't matching. You need someone to dial in the details and make the data work for you.",
                },
              ].map((persona, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border p-6 bg-background/80 hover:shadow-md transition-all"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                  <div className="relative space-y-3">
                    <div className="mb-4">{persona.icon}</div>
                    <h3 className="text-xl font-semibold">{persona.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{persona.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── What's Included ── */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  What&apos;s Included
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Everything you need, thoughtfully designed
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed leading-relaxed"
                >
                  Every client gets a fully customized system. No templates, no PDFs, no group programs.
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-4 py-12 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: <Dumbbell className="h-10 w-10 text-primary" />,
                  title: "Custom Training Program",
                  description:
                    "Splits designed around your schedule, equipment, and weak points. Built for your life, not a hypothetical one.",
                },
                {
                  icon: <Utensils className="h-10 w-10 text-primary" />,
                  title: "Evidence-Based Nutrition",
                  description:
                    "Macro targets built for your body and lifestyle. Kosher, picky eater, eat out four times a week. We make it work.",
                },
                {
                  icon: <ClipboardList className="h-10 w-10 text-primary" />,
                  title: "Weekly Check-ins",
                  description:
                    "Every Sunday you submit weight, adherence, biofeedback, and progress photos. Your plan adjusts in real time.",
                },
                {
                  icon: <MessageCircle className="h-10 w-10 text-primary" />,
                  title: "Direct Access",
                  description:
                    "WhatsApp, Loom video feedback, and email. You are never left wondering what to do next or why.",
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "Data-Driven Adjustments",
                  description:
                    "Calories, training load, and recovery all move based on your actual results, not a generic timeline.",
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Safety First",
                  description:
                    "Full health screening before we start. Evidence-based protocols throughout. No fads, no shortcuts.",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                  <div className="relative space-y-3">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── The Process ── */}
        <section id="process" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  How It Works
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                >
                  From application to results
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed leading-relaxed"
                >
                  A clear, systematic process designed to get you results and keep them.
                </motion.p>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-6xl gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {[
                {
                  step: "01",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                  title: "Apply",
                  description:
                    "Fill out a short form so Amir can make sure this is the right fit before any money changes hands.",
                },
                {
                  step: "02",
                  icon: <Phone className="h-8 w-8 text-primary" />,
                  title: "Discovery Call",
                  description:
                    "A free 20-minute call to talk goals, obstacles, and whether coaching makes sense right now.",
                },
                {
                  step: "03",
                  icon: <Dumbbell className="h-8 w-8 text-primary" />,
                  title: "Your Program",
                  description:
                    "Custom training split and macro targets delivered within 48 hours of signing. Built specifically for you.",
                },
                {
                  step: "04",
                  icon: <ClipboardList className="h-8 w-8 text-primary" />,
                  title: "Weekly Check-ins",
                  description:
                    "Submit your data every Sunday. Amir reviews everything and adjusts your program within 24 hours.",
                },
                {
                  step: "05",
                  icon: <Trophy className="h-8 w-8 text-primary" />,
                  title: "Real Results",
                  description:
                    "Progressive body recomposition with sustainable habits that hold up long after the program ends.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  className="relative flex flex-col rounded-3xl border bg-background/80 p-6 shadow-sm"
                >
                  <span className="absolute top-4 right-4 text-6xl font-black text-muted/30 leading-none select-none">
                    {step.step}
                  </span>
                  <div className="mb-4 relative z-10">{step.icon}</div>
                  <h3 className="text-lg font-semibold relative z-10">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed relative z-10">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center pb-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#apply" className={cn(buttonVariants({ size: "lg" }), "rounded-3xl group")}>
                  Start Your Application
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── About Amir ── */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4 p-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left"
              >
                <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">About Amir</div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  Coaching that actually gets it
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed leading-relaxed">
                  I built this coaching system because I&apos;ve seen what happens when you try to follow a plan that
                  wasn&apos;t made for you: burnout, guilt, and zero results.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed leading-relaxed">
                  My clients are busy people with real lives. Pre-med students cramming for the MCAT. Young
                  professionals pulling 50-hour weeks. People dealing with ADHD, rotator cuff injuries, and brutal
                  schedules. I&apos;ve built a system that actually works for them. I only take clients I know I
                  can genuinely help.
                </p>
                <div className="pt-2">
                  <Link href="#apply" className={cn(buttonVariants({ size: "lg" }), "rounded-3xl")}>
                    Start Your Application
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center p-6"
              >
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted/30 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {[
                      "Evidence-based protocols",
                      "Full health screening",
                      "Selective client intake",
                      "Weekly plan adjustments",
                      "24hr WhatsApp support",
                      "No cookie-cutter plans",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-2xl bg-background/80 px-3 py-2 text-sm font-medium shadow-sm"
                      >
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  Investment
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
                >
                  Simple, transparent pricing
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed leading-relaxed"
                >
                  Both plans include a 12-week minimum commitment. Real change takes time. Amir is serious
                  about delivering it.
                </motion.p>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-4xl gap-6 pb-12 md:grid-cols-2"
            >
              <motion.div
                variants={itemFadeIn}
                whileHover={{ y: -8 }}
                className="flex flex-col rounded-3xl border bg-background p-8 shadow-sm"
              >
                <h3 className="text-2xl font-semibold">Standard</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$297</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">12-week minimum · billed monthly</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {[
                    "Custom training program",
                    "Macro-based nutrition plan",
                    "Weekly check-ins & adjustments",
                    "WhatsApp access to Amir",
                    "Progress tracking system",
                    "Full health & injury screening",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="#apply" className={cn(buttonVariants({ variant: "outline" }), "mt-8 rounded-3xl")}>
                  Apply for Standard
                </Link>
              </motion.div>

              <motion.div
                variants={itemFadeIn}
                whileHover={{ y: -8 }}
                className="flex flex-col rounded-3xl border-2 border-primary bg-background p-8 shadow-md relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold">Premium</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$497</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">12-week minimum · billed monthly</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {[
                    "Everything in Standard",
                    "Bi-weekly Loom video reviews",
                    "Priority 12hr response time",
                    "Monthly strategy call",
                    "Supplement guidance",
                    "Lifestyle & recovery coaching",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="#apply" className={cn(buttonVariants(), "mt-8 rounded-3xl")}>
                  Apply for Premium
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Testimonials (dark section) ── */}
        <section id="results" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto px-4 md:px-6 border border-zinc-800 rounded-3xl bg-zinc-900"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-white/10 px-3 py-1 text-sm text-white/80"
                >
                  Results
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-white"
                >
                  What clients say
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-white/60 md:text-xl/relaxed leading-relaxed"
                >
                  Real people, real schedules, real results.
                </motion.p>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-4 py-12 lg:grid-cols-2"
            >
              {[
                {
                  quote:
                    "I was studying for the MCAT and working as an EMT 20 hours a week. I told Amir I had no time. He built me a 45-minute program and macros around my actual food. Three weeks in and I can already see the difference.",
                  author: "Akiva P.",
                  detail: "Pre-med student, USC",
                },
                {
                  quote:
                    "I have ADHD and a rotator cuff issue and I kept burning out every time I tried to get consistent. Amir didn't just give me a plan. He gave me one I could actually stick to. I've been going 4 days a week for two months straight.",
                  author: "Jacob R.",
                  detail: "Student & RBT",
                },
                {
                  quote:
                    "I travel for work every other week. Every coach I tried before gave me the same program regardless. Amir adjusts my training based on where I am and how I'm sleeping. It's the first time fitness has actually fit my life.",
                  author: "Daniel M.",
                  detail: "Sales manager, 28",
                },
                {
                  quote:
                    "I lost 18 pounds in 14 weeks without feeling like I was on a diet. He kept my calories surprisingly high, changed my training split entirely, and answered every question I had within hours.",
                  author: "Sarah K.",
                  detail: "Nurse, 25",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8 }}
                  className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm"
                >
                  <div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="mt-4 text-base font-medium leading-relaxed text-white/90">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-white">
                      {testimonial.author[0]}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-white">{testimonial.author}</p>
                      <p className="text-sm text-white/60">{testimonial.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Apply / Contact ── */}
        <section id="apply" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto grid items-start gap-6 px-4 md:px-6 lg:grid-cols-2 border border-muted rounded-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 p-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left"
            >
              <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Apply Now</div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl/tight">
                Let&apos;s see if we&apos;re a good fit
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed leading-relaxed">
                Fill out a short application. If it looks like a match, you&apos;ll get a link to book a free
                20-minute discovery call with Amir. No pressure, no pitch.
              </p>

              <div className="mt-6 space-y-4 w-full max-w-sm">
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                  <div className="rounded-3xl bg-muted p-2 flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Amir</h3>
                    <p className="text-sm text-muted-foreground">amirsimayof@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                  <div className="rounded-3xl bg-muted p-2 flex-shrink-0">
                    <TikTokIcon />
                  </div>
                  <div>
                    <h3 className="font-medium">TikTok</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow along for daily training &amp; nutrition tips
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4">
                <motion.div whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="inline-block">
                  <Link
                    href="https://www.tiktok.com/@amir_csim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-3xl border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors inline-flex"
                  >
                    <TikTokIcon />
                    <span className="sr-only">TikTok</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border bg-background p-6 shadow-sm my-6"
            >
              <h3 className="text-xl font-semibold">Tell me about yourself</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Takes about 3 minutes. Amir personally reviews every application.
              </p>

              <form className="mt-6 space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium leading-none">
                      First name
                    </label>
                    <Input id="first-name" placeholder="First name" className="rounded-3xl" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium leading-none">
                      Last name
                    </label>
                    <Input id="last-name" placeholder="Last name" className="rounded-3xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="your@email.com" className="rounded-3xl" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="goal" className="text-sm font-medium leading-none">
                    What are you trying to achieve in the next 12 weeks?
                  </label>
                  <Textarea
                    id="goal"
                    placeholder="Be specific, e.g. lose 15 lbs before my wedding in August, get visible abs while keeping my strength..."
                    className="min-h-[90px] rounded-3xl"
                  />
                </div>

                <RadioGroup
                  name="training-days"
                  label="How many days per week can you realistically train?"
                  options={["2–3 days", "3–4 days", "4–5 days", "5+ days"]}
                />

                <div className="space-y-2">
                  <label htmlFor="obstacle" className="text-sm font-medium leading-none">
                    What&apos;s your biggest obstacle right now?
                  </label>
                  <Input
                    id="obstacle"
                    placeholder="e.g. no time, injured shoulder, don't know where to start..."
                    className="rounded-3xl"
                  />
                </div>

                <RadioGroup
                  name="budget"
                  label="Monthly investment you're comfortable with?"
                  options={["Under $200", "$200–$400", "$400+", "Depends on the value"]}
                />

                <RadioGroup
                  name="prior-coaching"
                  label="Have you worked with a coach before?"
                  options={["Yes", "No", "Sort of"]}
                />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full rounded-3xl">
                    Submit Application
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container mx-auto grid gap-6 px-4 py-10 md:px-6 lg:grid-cols-4 border-x border-muted"
        >
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-10 w-10 rounded-3xl bg-primary flex items-center justify-center"
              >
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-semibold text-xl">Amir Coaching</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Evidence-based 1-on-1 online fitness coaching for busy people who are serious about results.
            </p>
            <div className="flex space-x-3">
              <motion.div whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href="https://www.tiktok.com/@amir_csim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <TikTokIcon />
                  <span className="sr-only">TikTok</span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Navigation</h3>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <Link href="#programs" className="text-muted-foreground hover:text-foreground">Programs</Link>
              <Link href="#process" className="text-muted-foreground hover:text-foreground">Process</Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground">About Amir</Link>
              <Link href="#results" className="text-muted-foreground hover:text-foreground">Results</Link>
              <Link href="#apply" className="text-muted-foreground hover:text-foreground">Apply Now</Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Get weekly tips</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Training and nutrition insights delivered to your inbox every week.
            </p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="your@email.com" className="max-w-lg flex-1 rounded-3xl" />
              <Button type="submit" className="rounded-3xl">
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>

        <div className="border-t">
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 py-6 md:h-16 md:flex-row md:py-0">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Amir Coaching. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Built for athletes with real lives.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
