"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ArrowDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollQuiz, type QuizAnswers } from "@/components/scroll-quiz"

// ── Animation Variants ────────────────────────────────────────────────
type Ease4 = [number, number, number, number]
const EASE: Ease4 = [0.25, 0.1, 0.25, 1]

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

const revealLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
}

const revealRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

// ── Icons ─────────────────────────────────────────────────────────────
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.63z" />
  </svg>
)

// ── Nav ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  ["#about", "About"],
  ["#process", "Process"],
  ["#results", "Results"],
  ["#pricing", "Pricing"],
] as const

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#110e0a]/90 backdrop-blur-md border-b border-white/[0.07]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-sm tracking-[0.2em] uppercase font-bold text-[#f0ece4]">
          The Standard
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-widest uppercase text-[#f0ece4]/65 hover:text-[#f0ece4] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="#apply"
          className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c]/40 px-4 py-2 hover:bg-[#c9a84c]/10 transition-colors duration-200"
        >
          Apply
          <ArrowRight className="h-3 w-3" />
        </Link>

        <button
          className="md:hidden text-[#f0ece4] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-5 space-y-[5px]">
            <span
              className={cn(
                "block h-px bg-current transition-all duration-300 origin-center",
                mobileOpen && "rotate-45 translate-y-[7px]"
              )}
            />
            <span
              className={cn(
                "block h-px bg-current transition-all duration-300",
                mobileOpen && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={cn(
                "block h-px bg-current transition-all duration-300 origin-center",
                mobileOpen && "-rotate-45 -translate-y-[7px]"
              )}
            />
          </div>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="md:hidden overflow-hidden bg-[#110e0a] border-b border-white/[0.07]"
      >
        <div className="px-6 pb-6 pt-2 space-y-1">
          {([...NAV_LINKS, ["#apply", "Apply"]] as [string, string][]).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 text-sm tracking-widest uppercase text-[#f0ece4]/60 hover:text-[#f0ece4] border-b border-white/[0.05] last:border-0 transition-colors duration-200"
            >
              {label}
              <ArrowRight className="h-3 w-3 opacity-30" />
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#110e0a]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero/hero.jpg')", backgroundPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e0a]/60 via-[#110e0a]/40 to-[#110e0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#110e0a]/80 via-transparent to-[#110e0a]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-8"
        >
          Online Fitness Coaching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="font-display leading-[1.05] mb-6"
        >
          <span
            className="block font-light text-[#f0ece4]/90"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            You&apos;re not
          </span>
          <span
            className="block font-black italic text-[#f0ece4]"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            a generic plan.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="text-[#f0ece4]/70 text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-10"
        >
          1-on-1 coaching built around your schedule, your body, and your life.{" "}
          Not someone else&apos;s template.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#apply"
            className="cta-glow inline-flex items-center gap-3 bg-[#c9a84c] text-[#110e0a] text-xs tracking-[0.2em] uppercase font-semibold px-10 py-5 hover:bg-[#c9a84c]/90 transition-colors duration-200 group"
          >
            Apply for Coaching
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#about"
            className="text-xs tracking-[0.2em] uppercase text-[#f0ece4]/65 hover:text-[#f0ece4] transition-colors duration-200"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/40 mt-6"
        >
          Reviewing applications for July
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-[#f0ece4]/25" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Marquee ───────────────────────────────────────────────────────────
const MARQUEE_BASE = [
  "Custom Program",
  "Weekly Check-ins",
  "24hr Access",
  "Research-Backed",
  "No Templates",
  "Built For Your Life",
]

function Marquee() {
  const items = [...MARQUEE_BASE, ...MARQUEE_BASE]
  return (
    <div className="border-y border-white/[0.07] bg-[#130f0b] py-4 overflow-hidden">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 flex-shrink-0">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#f0ece4]/60">{item}</span>
            <span className="w-1 h-1 rounded-full bg-[#c9a84c]/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────
function SectionHeader({
  label,
  line1,
  line2,
  note,
}: {
  label: string
  line1: string
  line2: string
  note?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      variants={reveal}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mb-16 md:mb-24"
    >
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-4">{label}</p>
      <h2
        className="font-display text-[#f0ece4] leading-tight"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
      >
        <span className="font-light">{line1}</span>
        <span className="block font-black italic">{line2}</span>
      </h2>
      {note && (
        <p className="text-[#f0ece4]/60 text-lg mt-6 max-w-lg leading-relaxed">{note}</p>
      )}
    </motion.div>
  )
}

// ── Philosophy ────────────────────────────────────────────────────────
function Philosophy() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.2 })

  return (
    <section id="about" className="bg-[#110e0a] py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            ref={leftRef}
            variants={revealLeft}
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-8">
              The Philosophy
            </p>
            <h2
              className="font-display leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              <span className="font-light text-[#f0ece4]">The internet has overcomplicated things</span>
              <span className="block font-black italic text-[#f0ece4]"> But it doesn't have to be this way.</span>
            </h2>
            <div className="w-12 h-px bg-[#c9a84c] mb-8" />
            <p className="text-[#f0ece4]/70 text-lg leading-relaxed mb-4">
              Doesn't matter if you're pre-med cramming for the MCAT, a young professional pulling 50-hour weeks, or someone who's tried and stopped more times than they can count. Your goals are achievable.
            </p>
            <p className="text-[#f0ece4]/70 text-lg leading-relaxed mb-10">
              I only take clients I know I can genuinely help. If you apply and I don&apos;t think
              the timing is right, I&apos;ll tell you.
            </p>
            <Link
              href="#apply"
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c9a84c] border-b border-[#c9a84c]/40 pb-1 hover:border-[#c9a84c] transition-colors duration-200 group"
            >
              Apply Now
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            ref={rightRef}
            variants={revealRight}
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden border border-white/[0.07]">
              <div
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: "url('/images/philosophy.png')" }}
              />
              <div className="absolute inset-0 bg-[#1a1410]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#110e0a]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-display text-xs tracking-[0.2em] uppercase text-[#c9a84c] mb-1">
                  Amir Cohen-Simayof
                </p>
                <p className="text-[#f0ece4]/70 text-xs tracking-wide">
                  Online Fitness Coach · @amir_csim
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#c9a84c]/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── What You Get ──────────────────────────────────────────────────────
const FEATURES = [
  {
    num: "01",
    title: "Custom Training Program",
    body: "Splits designed around your schedule, equipment, and weak points. Built for your actual life, not an idealized one.",
  },
  {
    num: "02",
    title: "Nutrition Guidance",
    body: "General nutrition support tailored to your lifestyle and goals. Picky eater, travel, nights out: we'll work around it.",
  },
  {
    num: "03",
    title: "Weekly Check-ins",
    body: "Every Sunday you submit weight, adherence, and biofeedback. Your plan adjusts in real time.",
  },
  {
    num: "04",
    title: "Direct Access to Me",
    body: "WhatsApp, video feedback, email. You're never left guessing what to do or why.",
  },
  {
    num: "05",
    title: "Data-Driven Adjustments",
    body: "Calories, training load, and recovery move based on actual results, not a generic timeline.",
  },
]

function FeatureRow({ feature, index }: { feature: (typeof FEATURES)[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      variants={reveal}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.05 }}
      className="py-8 md:py-10 grid md:grid-cols-[80px_1fr_2fr] gap-4 md:gap-8 items-start group hover:bg-white/[0.02] transition-colors duration-300 cursor-default"
    >
      <span className="font-display text-3xl font-light text-[#f0ece4]/15 group-hover:text-[#c9a84c]/40 transition-colors duration-300">
        {feature.num}
      </span>
      <h3 className="text-[#f0ece4] font-medium text-lg leading-snug">{feature.title}</h3>
      <p className="text-[#f0ece4]/65 leading-relaxed">{feature.body}</p>
    </motion.div>
  )
}

function Included() {
  return (
    <section className="bg-[#110e0a] py-24 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="What You Get" line1="Everything you need." line2="Nothing you don't." />
        <div className="divide-y divide-white/[0.07]">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.num} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────
const STATS = [
  { value: "100%", label: "Custom-built programs" },
  { value: "24hr", label: "Check-in response time" },
  { value: "12wk", label: "Minimum commitment" },
  { value: "0", label: "Templates ever used" },
]

function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="bg-[#130f0b] py-24 border-y border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.07]"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={reveal} className="bg-[#130f0b] p-10 md:p-14 text-center">
              <p
                className="font-display font-black text-[#f0ece4] leading-none mb-3"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                {s.value}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#f0ece4]/65">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Process ───────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Apply", body: "Short form. Amir reviews every application personally before any money changes hands." },
  { num: "02", title: "Discovery Call", body: "Free 20-min call to talk goals, obstacles, and fit. No pitch." },
  { num: "03", title: "Your Program", body: "Custom training + nutrition delivered within 48 hours of signing." },
  { num: "04", title: "Weekly Check-ins", body: "Submit data every Sunday. Adjustments live within 24 hours." },
  { num: "05", title: "Results", body: "Progressive recomposition with habits that hold up long after the program ends." },
]

function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="process" className="bg-[#110e0a] py-32 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="The Process" line1="Application to results." line2="Five steps." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-5 gap-px bg-white/[0.07]"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              variants={reveal}
              className="bg-[#110e0a] p-8 group hover:bg-white/[0.02] transition-colors duration-300"
            >
              <p className="font-display text-4xl font-light text-[#f0ece4]/10 group-hover:text-[#c9a84c]/30 transition-colors duration-300 mb-6">
                {s.num}
              </p>
              <h3 className="text-[#f0ece4] font-semibold mb-3">{s.title}</h3>
              <p className="text-[#f0ece4]/60 text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "I was studying for the MCAT and working as an EMT 20 hours a week. I told Amir I had no time. He built me a 45-minute program and macros around my actual food. Three weeks in and I can already see the difference.",
    author: "Akiva P.",
    detail: "Pre-med student, USC",
  },
  {
    quote:
      "I have ADHD and a rotator cuff issue and I kept burning out every time I tried to get consistent. Amir didn't just give me a plan. He gave me one I could actually stick to. Four days a week for two months straight.",
    author: "Jacob R.",
    detail: "Student & RBT",
  },
  {
    quote:
      "I travel for work every other week. Every coach I tried gave me the same program regardless. Amir adjusts my training based on where I am and how I'm sleeping. First time fitness has actually fit my life.",
    author: "Daniel M.",
    detail: "Sales Manager, 28",
  },
  {
    quote:
      "Lost 18 pounds in 14 weeks without feeling like I was on a diet. He kept my calories surprisingly high, changed my training split entirely, and answered every question within hours.",
    author: "Sarah K.",
    detail: "Nurse, 25",
  },
]

function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="results" className="bg-[#110e0a] py-32 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="Results" line1="Real people." line2="Real schedules." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-px bg-white/[0.07]"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={reveal}
              className="bg-[#110e0a] p-10 md:p-12 hover:bg-white/[0.02] transition-colors duration-300"
            >
              <p className="font-display text-5xl text-[#c9a84c]/30 font-black leading-none mb-6">
                &ldquo;
              </p>
              <blockquote className="text-[#f0ece4]/80 text-lg leading-relaxed mb-8">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-[#c9a84c]/40 flex-shrink-0" />
                <div>
                  <p className="text-[#f0ece4] text-sm font-medium">{t.author}</p>
                  <p className="text-[#f0ece4]/65 text-xs tracking-wide mt-0.5">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-[#f0ece4]/20 text-xs tracking-wide text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          Testimonials are from real clients. Individual results vary based on effort, adherence, starting point, and other personal factors. Results shown are not a guarantee of specific outcomes.
        </p>
      </div>
    </section>
  )
}

// ── Mid-Page CTA ──────────────────────────────────────────────────────
function MidPageCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="mid-cta" className="bg-[#110e0a] border-t border-[#c9a84c]/20">
      <motion.div
        ref={ref}
        variants={reveal}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-4">
            Reviewing applications for July
          </p>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            <span className="font-light text-[#f0ece4]">Seen enough?</span>
            <span className="font-black italic text-[#f0ece4]"> Let&apos;s talk.</span>
          </h2>
        </div>
        <Link
          href="#apply"
          className="cta-glow flex-shrink-0 inline-flex items-center gap-3 bg-[#c9a84c] text-[#110e0a] text-xs tracking-[0.2em] uppercase font-semibold px-10 py-5 hover:bg-[#c9a84c]/90 transition-colors duration-200 group"
        >
          Apply for Coaching
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  )
}

// ── Sticky Apply CTA ──────────────────────────────────────────────────
function StickyApplyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const applyEl = document.getElementById("apply")

    const check = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8
      const applyInView = applyEl
        ? applyEl.getBoundingClientRect().top < window.innerHeight && applyEl.getBoundingClientRect().bottom > 0
        : false
      setVisible(pastHero && !applyInView)
    }

    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : 80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
    >
      <div className="bg-[#110e0a]/95 backdrop-blur-md border-t border-white/[0.07] px-6 py-4 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/50 hidden sm:block">
            Reviewing applications for July
          </p>
          <Link
            href="#apply"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#110e0a] text-xs tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#c9a84c]/90 transition-colors duration-200 group ml-auto"
          >
            Apply Now
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── Transformation ────────────────────────────────────────────────────
function Transformation() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="transformation" className="bg-[#110e0a] py-32 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="The Proof" line1="My Personal Transformation" line2="What that looks like." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-px bg-white/[0.07]"
        >
          {/* Before */}
          <motion.div variants={revealLeft} className="relative bg-[#130f0b]">
            <div className="aspect-[3/4] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: "url('/images/before.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130f0b]/90 via-[#130f0b]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#f0ece4]/70 mb-2">Before</p>
                <p className="font-display text-2xl font-light text-[#f0ece4]/60 leading-tight">
                  Not there yet.
                </p>
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div variants={revealRight} className="relative bg-[#130f0b]">
            <div className="aspect-[3/4] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: "url('/images/after.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130f0b]/90 via-[#130f0b]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-2">After</p>
                <p className="font-display text-2xl font-black italic text-[#f0ece4] leading-tight">
                  The Standard.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-[#f0ece4]/25 text-xs tracking-[0.2em] uppercase text-center mt-8">
          Amir&apos;s personal transformation. Individual results vary based on effort, consistency, and starting point.
        </p>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Standard",
    price: "$297",
    note: "per month · 12-week minimum",
    features: [
      "Custom training program",
      "Nutrition guidance",
      "Weekly check-ins & adjustments",
      "WhatsApp access to Amir",
      "Progress tracking system",
      "Fitness background review",
    ],
    cta: "Apply for Standard",
    featured: false,
  },
  {
    name: "Premium",
    price: "$497",
    note: "per month · 12-week minimum",
    features: [
      "Everything in Standard",
      "Bi-weekly video check-ins",
      "Priority 12hr response time",
      "Monthly strategy call",
      "General supplement education",
      "Lifestyle & recovery support",
    ],
    cta: "Apply for Premium",
    featured: true,
  },
]

function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="pricing" className="bg-[#110e0a] py-32 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Investment"
          line1="Simple pricing."
          line2="No surprises."
          note="12-week minimum on both plans. Real change takes time. Amir is serious about delivering it."
        />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-px bg-white/[0.07] max-w-3xl"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={reveal}
              className={cn("p-10 md:p-12 flex flex-col", plan.featured ? "bg-[#1a1410]" : "bg-[#110e0a]")}
            >
              {plan.featured && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-6">
                  Most Popular
                </p>
              )}
              <h3 className="text-[#f0ece4] text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-display font-black text-[#f0ece4]"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3rem)" }}
                >
                  {plan.price}
                </span>
              </div>
              <p className="text-[#f0ece4]/65 text-xs tracking-wide mb-8">{plan.note}</p>
              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#f0ece4]/65">
                    <Check className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#apply"
                className={cn(
                  "text-center text-xs tracking-[0.2em] uppercase py-4 transition-colors duration-200",
                  plan.featured
                    ? "bg-[#c9a84c] text-[#110e0a] hover:bg-[#c9a84c]/90"
                    : "border border-white/20 text-[#f0ece4]/70 hover:border-white/40 hover:text-[#f0ece4]"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Apply ─────────────────────────────────────────────────────────────
function RadioGroup({
  name, label, options, value, onChange,
}: {
  name: string; label: string; options: string[]; value?: string; onChange?: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-[#f0ece4]/85 mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer select-none">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange?.(opt)}
              className="sr-only peer"
            />
            <span className="inline-block border border-white/[0.22] px-4 py-2 text-xs tracking-wide text-[#f0ece4]/85 transition-colors duration-200 peer-checked:border-[#c9a84c] peer-checked:text-[#c9a84c] hover:border-white/35 hover:text-[#f0ece4]/85">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

const CAL_URL = "https://cal.com/amir-cohen-simayof-vxjysx/20min"

interface FormState {
  firstName: string
  lastName: string
  email: string
  goal: string
  biggestObstacle: string
  days: string
  prior: string
}

function Apply({ quizAnswers }: { quizAnswers: QuizAnswers }) {
  const splashRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const splashInView = useInView(splashRef, { once: true, amount: 0.3 })
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.1 })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState<FormState>({
    firstName: quizAnswers.firstName,
    lastName: quizAnswers.lastName,
    email: quizAnswers.email,
    goal: quizAnswers.goal,
    biggestObstacle: quizAnswers.biggestObstacle,
    days: quizAnswers.trainingDays,
    prior: quizAnswers.priorCoaching,
  })

  // Merge incoming quiz answers into form without overwriting manual edits
  useEffect(() => {
    setForm(prev => ({
      firstName: prev.firstName || quizAnswers.firstName,
      lastName: prev.lastName || quizAnswers.lastName,
      email: prev.email || quizAnswers.email,
      goal: prev.goal || quizAnswers.goal,
      biggestObstacle: prev.biggestObstacle || quizAnswers.biggestObstacle,
      days: prev.days || quizAnswers.trainingDays,
      prior: prev.prior || quizAnswers.priorCoaching,
    }))
  }, [quizAnswers])

  const openBooking = () => window.open(CAL_URL, "_blank")

  const inputClass =
    "w-full bg-transparent border-b border-white/[0.22] py-3 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/70 focus:outline-none focus:border-[#c9a84c]/80 transition-colors duration-200"
  const labelClass = "block text-xs tracking-[0.15em] uppercase text-[#f0ece4]/85 mb-3"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    const body = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      goal: form.goal,
      biggestObstacle: form.biggestObstacle,
      trainingDays: form.days,
      priorCoaching: form.prior,
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="apply" className="bg-[#110e0a] border-t-2 border-[#c9a84c]/50">
      {/* Chapter opener */}
      <motion.div
        ref={splashRef}
        variants={reveal}
        initial="hidden"
        animate={splashInView ? "visible" : "hidden"}
        className="text-center pt-24 pb-20 px-6 border-b border-white/[0.07] relative overflow-hidden"
      >
        <p
          aria-hidden="true"
          className="font-display font-black text-[#f0ece4] select-none pointer-events-none absolute inset-0 flex items-center justify-center leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 18rem)", opacity: 0.05 }}
        >
          APPLY
        </p>

        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-8">
            Apply Now
          </p>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <span className="font-light text-[#f0ece4]">Let&apos;s see if</span>
            <span className="block font-black italic text-[#f0ece4]">we&apos;re a fit.</span>
          </h2>
          <p className="text-[#f0ece4]/70 text-base max-w-xs mx-auto leading-relaxed mt-6">
            Takes about 3 minutes. Amir personally reviews every application.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {submitted ? (
          /* ── Success state ── */
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-12 h-px bg-[#c9a84c] mx-auto mb-10" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">
              Application Received
            </p>
            <h3
              className="font-display font-black text-[#f0ece4] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              You&apos;re in.
            </h3>
            <p className="text-[#f0ece4]/70 text-lg leading-relaxed mb-4">
              Pick a time for your free 20-minute discovery call. No pressure, no pitch. Just a real conversation about where you&apos;re at and where you want to go.
            </p>
            <p className="text-[#f0ece4]/65 text-sm leading-relaxed mb-10">
              Want to hit the ground running?{" "}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfgVzHgqmrUM9OfzvWBh5SloIcnlAaR4ah0iavs95BsWwxcoA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] underline underline-offset-2 hover:text-[#c9a84c]/80 transition-colors"
              >Fill out the intake form</a> before the call
              and Amir can skip the basics and get straight to your plan.
            </p>
            <button
              onClick={openBooking}
              className="inline-flex items-center gap-3 border border-[#c9a84c] px-8 py-4 text-[#c9a84c] text-sm tracking-[0.15em] uppercase hover:bg-[#c9a84c] hover:text-[#110e0a] transition-all duration-300 cursor-pointer"
            >
              Book Your Discovery Call <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          /* ── Application form ── */
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <motion.div
              ref={leftRef}
              variants={revealLeft}
              initial="hidden"
              animate={leftInView ? "visible" : "hidden"}
            >
              <div className="w-12 h-px bg-[#c9a84c] mb-8" />
              <p className="text-[#f0ece4]/70 text-lg leading-relaxed mb-4">
                Fill out the application. Once you submit, you&apos;ll book your free
                20-minute discovery call directly. No waiting, no pitch.
              </p>
              <p className="text-[#f0ece4]/70 text-lg leading-relaxed mb-12">
                Amir only takes clients he knows he can genuinely help.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[#c9a84c]/40 flex-shrink-0" />
                  <span className="text-[#f0ece4]/60 text-sm tracking-wide">amirsimayof@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[#c9a84c]/40 flex-shrink-0" />
                  <Link
                    href="https://www.tiktok.com/@amir_csim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f0ece4]/60 text-sm tracking-wide hover:text-[#f0ece4]/85 transition-colors"
                  >
                    @amir_csim on TikTok
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              ref={rightRef}
              variants={revealRight}
              initial="hidden"
              animate={rightInView ? "visible" : "hidden"}
            >
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#f0ece4]/75 mb-8">
                Takes about 3 minutes
              </p>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>First name</label>
                    <input
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className={inputClass}
                      placeholder="First"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last name</label>
                    <input
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className={inputClass}
                      placeholder="Last"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    What are you trying to achieve in 12 weeks?
                  </label>
                  <textarea
                    name="goal"
                    required
                    value={form.goal}
                    onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                    className={cn(inputClass, "resize-none min-h-[90px]")}
                    placeholder="Be specific: lose 15 lbs before August, get visible abs while keeping strength..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Biggest obstacle right now</label>
                  <input
                    name="biggestObstacle"
                    value={form.biggestObstacle}
                    onChange={e => setForm(f => ({ ...f, biggestObstacle: e.target.value }))}
                    className={inputClass}
                    placeholder="No time, injured shoulder, don't know where to start..."
                  />
                </div>

                <RadioGroup
                  name="days"
                  label="Training days per week"
                  options={["2–3 days", "3–4 days", "4–5 days", "5+ days"]}
                  value={form.days}
                  onChange={v => setForm(f => ({ ...f, days: v }))}
                />
                <RadioGroup
                  name="prior"
                  label="Worked with a coach before?"
                  options={["Yes", "No", "Sort of"]}
                  value={form.prior}
                  onChange={v => setForm(f => ({ ...f, prior: v }))}
                />

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 flex-shrink-0 accent-[#c9a84c]"
                    required
                  />
                  <span className="text-xs text-[#f0ece4]/50 leading-relaxed group-hover:text-[#f0ece4]/65 transition-colors">
                    I have read and agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-[#c9a84c] underline underline-offset-2 hover:text-[#c9a84c]/70">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="text-[#c9a84c] underline underline-offset-2 hover:text-[#c9a84c]/70">
                      Privacy Policy
                    </Link>. I confirm I am 18 or older and have medical clearance to begin an exercise program.
                  </span>
                </label>

                {error && (
                  <p className="text-red-400 text-xs tracking-wide">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !agreed}
                  className="w-full bg-[#c9a84c] text-[#110e0a] text-xs tracking-[0.2em] uppercase font-semibold py-5 hover:bg-[#c9a84c]/90 transition-colors duration-200 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Application"}
                  {!submitting && (
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#110e0a] border-t border-white/[0.07] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] uppercase font-bold text-[#f0ece4] mb-4">
              The Standard
            </p>
            <p className="text-[#f0ece4]/65 text-sm leading-relaxed max-w-xs mb-6">
              Evidence-based 1-on-1 online fitness coaching for busy people who are serious about
              results.
            </p>
            <Link
              href="https://www.tiktok.com/@amir_csim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#f0ece4]/65 hover:text-[#f0ece4]/70 transition-colors duration-200"
            >
              <TikTokIcon />
              <span className="text-xs tracking-widest">@amir_csim</span>
            </Link>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/25 mb-5">Navigate</p>
            <nav className="space-y-3">
              {[
                ["#about", "About"],
                ["#process", "Process"],
                ["#results", "Results"],
                ["#pricing", "Pricing"],
                ["#apply", "Apply"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-[#f0ece4]/70 hover:text-[#f0ece4]/70 transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/25 mb-5">Contact</p>
            <div className="space-y-3 text-sm text-[#f0ece4]/70">
              <p>amirsimayof@gmail.com</p>
              <p className="leading-relaxed">Built for athletes with real lives.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-8 space-y-6">
          <p className="text-[#f0ece4]/15 text-xs leading-relaxed max-w-3xl">
            The Standard is not a medical practice. Coaching and nutritional guidance provided is for general wellness and informational purposes only, and is not a substitute for advice from a licensed physician, registered dietitian, or other qualified healthcare professional. Consult your doctor before beginning any exercise or nutrition program.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#f0ece4]/20 text-xs tracking-wide">
              © {new Date().getFullYear()} The Standard. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-[#f0ece4]/20 text-xs tracking-wide hover:text-[#f0ece4]/40 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#f0ece4]/20 text-xs tracking-wide hover:text-[#f0ece4]/40 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main Export ───────────────────────────────────────────────────────
const EMPTY_QUIZ: QuizAnswers = {
  firstName: "",
  lastName: "",
  email: "",
  goal: "",
  biggestObstacle: "",
  trainingDays: "",
  priorCoaching: "",
}

export function LandingPage() {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(EMPTY_QUIZ)

  function handleQuizAnswer(updates: Partial<QuizAnswers>) {
    setQuizAnswers(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="bg-[#110e0a] text-[#f0ece4] min-h-screen">
      <Nav />
      <Hero />
      <Marquee />
      <Philosophy />
      <Included />
      <Stats />
      <Process />
      <Testimonials />
      <MidPageCTA />
      <Transformation />
      <Pricing />
      <Apply quizAnswers={quizAnswers} />
      <Footer />
      <StickyApplyCTA />
      <ScrollQuiz answers={quizAnswers} onAnswer={handleQuizAnswer} />
    </div>
  )
}
