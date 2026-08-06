"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollQuiz, type QuizAnswers } from "@/components/scroll-quiz"
import { trackEvent } from "@/lib/analytics"

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

// ── Apply CTA click handler ──────────────────────────────────────────
// Hash-only links don't re-trigger scroll when the URL hash is unchanged
// (e.g. clicking a second "#apply" CTA after the first already set the
// hash) — scroll to the target explicitly instead of relying on it.
function scrollToApply(location: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent("apply_click", { location })
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (window.location.hash !== "#apply") {
      window.history.pushState(null, "", "#apply")
    }
  }
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
  ["#first-session", "First Session"],
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
          ? "bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#1A1410]/[0.07]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-[0.2em] uppercase font-bold text-[#1A1410]">
          The Standard
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-sm tracking-widest uppercase text-[#1A1410]/85 hover:text-[#1A1410] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="#apply"
          onClick={scrollToApply("nav")}
          className="cta-glow hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold bg-[#D4A017] text-[#1A1410] px-6 py-3 hover:bg-[#D4A017]/90 transition-colors duration-200"
        >
          Apply for a Free Session
          <ArrowRight className="h-3 w-3" />
        </Link>

        <button
          className="md:hidden text-[#1A1410] p-1"
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
        className="md:hidden overflow-hidden bg-[#FAF7F2] border-b border-[#1A1410]/[0.07]"
      >
        <div className="px-6 pb-6 pt-2 space-y-1">
          {([...NAV_LINKS, ["#apply", "Apply for a Free Session"]] as [string, string][]).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                setMobileOpen(false)
                if (href === "#apply") scrollToApply("nav_mobile")(e)
              }}
              className="flex items-center justify-between py-3 text-sm tracking-widest uppercase text-[#1A1410]/60 hover:text-[#1A1410] border-b border-[#1A1410]/[0.05] last:border-0 transition-colors duration-200"
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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#FAF7F2]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero/hero.jpg')", backgroundPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/50 via-[#1A1410]/35 to-[#FAF7F2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1410]/50 via-transparent to-[#1A1410]/50" />
      </div>

      {/* Spacer matching fixed nav height */}
      <div className="h-20 flex-shrink-0" />

      {/* All hero content centered as a group, nudged slightly above true center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-8 pb-12 max-w-5xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4A017] mb-8"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.95), 0 0 8px rgba(212,160,23,1), 0 0 28px rgba(212,160,23,0.8), 0 0 60px rgba(212,160,23,0.45)' }}
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
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            You&apos;ve got what it takes.
          </span>
          <span
            className="block font-black italic text-[#f0ece4]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            Let&apos;s build your new life.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="text-[#f0ece4]/90 text-lg md:text-xl max-w-lg leading-relaxed mb-10"
        >
          1-on-1 coaching built around how you actually live, your schedule, your body, your habits.{" "}
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
            onClick={scrollToApply("hero")}
            className="cta-glow inline-flex items-center gap-3 bg-[#D4A017] text-[#1A1410] text-xs tracking-[0.2em] uppercase font-semibold px-10 py-5 hover:bg-[#D4A017]/90 transition-colors duration-200 group"
          >
            Apply for a Free Session
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#about"
            className="text-xs tracking-[0.2em] uppercase text-[#f0ece4] hover:text-[#f0ece4] transition-colors duration-200"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/85 mt-6"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Reviewing applications for August
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-[10px] tracking-[0.2em] uppercase text-[#f0ece4]/70 mt-2"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Free 20-min call · No card or payment info required to apply · You only set up billing if you decide to start coaching after we talk
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
          <ArrowDown className="h-4 w-4 text-[#f0ece4]/65" />
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
    <div className="border-y border-[#1A1410]/[0.07] bg-[#F0EAE0] py-4 overflow-hidden">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12 flex-shrink-0">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1A1410]/60">{item}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4A017]/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Section Seam ──────────────────────────────────────────────────────
function SectionSeam({ from, to }: { from: string; to: string }) {
  return (
    <div style={{ background: `linear-gradient(to bottom, ${from}, ${to})`, height: "140px" }} />
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
  light?: boolean
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
      <p className="text-sm font-semibold tracking-[0.25em] uppercase mb-4 text-[#D4A017]">{label}</p>
      <h2
        className="font-display leading-tight text-[#1A1410]"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
      >
        <span className="font-light">{line1}</span>
        <span className="block font-black italic">{line2}</span>
      </h2>
      {note && (
        <p className="text-lg mt-6 max-w-lg leading-relaxed text-[#1A1410]/75">{note}</p>
      )}
    </motion.div>
  )
}

// ── Intro Video ───────────────────────────────────────────────────────
function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    videoRef.current?.play()
    setPlaying(true)
  }

  return (
    <div className="relative border border-[#1A1410]/[0.07] overflow-hidden bg-[#1A1410] group cursor-pointer"
      onClick={!playing ? handlePlay : undefined}
    >
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        poster="/images/intro-poster.jpg"
        controls={playing}
        playsInline
        className="w-full block"
        aria-label="Introduction from Amir Cohen-Simayof"
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-[#D4A017] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#1A1410] ml-1" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Philosophy ────────────────────────────────────────────────────────
function Philosophy() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const leftInView = useInView(leftRef, { once: true, amount: 0.2 })
  const rightInView = useInView(rightRef, { once: true, amount: 0.2 })

  return (
    <section id="about" className="bg-[#FAF7F2] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            ref={leftRef}
            variants={revealLeft}
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
          >
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4A017] mb-8">
              My Story
            </p>
            <h2
              className="font-display leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              <span className="font-light text-[#1A1410]">I wore a swimming shirt</span>
              <span className="block font-black italic text-[#1A1410]">to every pool party.</span>
            </h2>
            <div className="w-12 h-px bg-[#D4A017] mb-8" />
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              Not because I wanted to. But because the alternative was people seeing my stomach, and I had spent enough years in my doctor&apos;s office hearing about my weight that I already knew what they would think too.
            </p>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              I was never in control. My doctor said I was approaching obesity at eleven.
            </p>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              At 12 came the restrictions. It was just sweets at first, but then everything else followed. I just wanted to stop hating my reflection, and the only option I had was eating less.
            </p>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              Calisthenics at 15. Weightlifting at 17. And somewhere in there, studying CS and math at Northeastern and learning how to break systems down until you understand what&apos;s actually driving them, I started applying the same mentality to my body. Not the stuff that "sounds right." The actual mechanisms. Why muscle grows. How a deficit compounds over weeks. What it means when progress stalls and your instinct is to eat less again.
            </p>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              I figured it out. And I&apos;m not carrying any of that weight anymore, not the physical kind or the mental.
            </p>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-10">
              My goal is to make sure no one has to figure this out the way I did. I want you to be someone who doesn&apos;t need a coach. The 12 weeks are for building the framework. Learning to read your own body well enough that you can make decisions without me. If you come back after this, it should be because you want to, not because you&apos;re lost without me.
            </p>
            <Link
              href="#apply"
              onClick={scrollToApply("philosophy")}
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#D4A017] border-b border-[#D4A017]/40 pb-1 hover:border-[#D4A017] transition-colors duration-200 group"
            >
              Apply for a Free Session
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            ref={rightRef}
            variants={revealRight}
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
            className="relative flex flex-col"
          >
            <IntroVideo />
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
      className="py-8 md:py-10 grid md:grid-cols-[80px_1fr_2fr] gap-4 md:gap-8 items-start group hover:bg-[#1A1410]/[0.03] transition-colors duration-300 cursor-default"
    >
      <span className="font-display text-3xl font-light text-[#1A1410]/18 group-hover:text-[#D4A017]/40 transition-colors duration-300">
        {feature.num}
      </span>
      <h3 className="text-[#1A1410] font-medium text-lg leading-snug">{feature.title}</h3>
      <p className="text-[#1A1410]/78 leading-relaxed">{feature.body}</p>
    </motion.div>
  )
}

function Included() {
  return (
    <section className="bg-[#EAE1D4] py-20 border-t border-[#1A1410]/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="What You Get" line1="Everything you need." line2="Nothing you don't." />
        <div className="divide-y divide-[#1A1410]/[0.08]">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.num} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}


// ── Process ───────────────────────────────────────────────────────────
const STEPS = [
  { num: "01", title: "Apply", body: "Short form. I review every application personally before any money changes hands." },
  { num: "02", title: "First Session", body: "Free 20-min call to talk goals, obstacles, and fit. No pitch." },
  { num: "03", title: "Your Program", body: "Custom training + nutrition delivered within 48 hours of signing." },
  { num: "04", title: "Weekly Check-ins", body: "Submit data every Sunday. Adjustments live within 24 hours." },
  { num: "05", title: "Results", body: "Progressive recomposition with habits that hold up long after the program ends." },
]

function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="process" className="bg-[#EAE1D4] py-24 border-t border-[#1A1410]/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="The Process" line1="Application to results." line2="Five steps." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-5 gap-px bg-[#1A1410]/[0.06]"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              variants={reveal}
              className="bg-[#EAE1D4] p-8 group hover:bg-[#1A1410]/[0.03] transition-colors duration-300"
            >
              <p className="font-display text-4xl font-light text-[#1A1410]/18 group-hover:text-[#D4A017]/50 transition-colors duration-300 mb-6">
                {s.num}
              </p>
              <h3 className="text-[#1A1410] font-semibold mb-3">{s.title}</h3>
              <p className="text-[#1A1410]/82 text-sm leading-relaxed">{s.body}</p>
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
    <section id="results" className="relative overflow-hidden bg-[#EAE1D4] py-24 border-t border-[#1A1410]/[0.08]">
      <p
        aria-hidden="true"
        className="font-display font-black text-[#1A1410] select-none pointer-events-none absolute inset-0 flex items-center justify-center leading-none"
        style={{ fontSize: "clamp(8rem, 22vw, 18rem)", opacity: 0.04 }}
      >
        RESULTS
      </p>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="Results" line1="Real people." line2="Real schedules." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-px bg-[#1A1410]/[0.06]"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={reveal}
              className="bg-[#DFD3C0] p-10 md:p-12 hover:bg-[#1A1410]/[0.03] transition-colors duration-300"
            >
              <p className="font-display text-5xl text-[#D4A017]/65 font-black leading-none mb-6">
                &ldquo;
              </p>
              <blockquote className="text-[#1A1410]/90 text-lg leading-relaxed mb-8">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-[#D4A017]/60 flex-shrink-0" />
                <div>
                  <p className="text-[#1A1410] text-sm font-medium">{t.author}</p>
                  <p className="text-[#1A1410]/70 text-xs tracking-wide mt-0.5">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-[#1A1410]/50 text-xs tracking-wide text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          Testimonials are from real clients. Individual results vary based on effort, adherence, starting point, and other personal factors. Results shown are not a guarantee of specific outcomes.
        </p>
      </div>
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
      <div className="bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#1A1410]/[0.07] px-6 py-4 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#1A1410]/70 hidden sm:block">
            Reviewing applications for August
          </p>
          <Link
            href="#apply"
            onClick={scrollToApply("sticky")}
            className="inline-flex items-center gap-2 bg-[#D4A017] text-[#1A1410] text-xs tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#D4A017]/90 transition-colors duration-200 group ml-auto"
          >
            Apply for a Free Session
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
    <section id="transformation" className="bg-[#EAE1D4] py-20 border-t border-[#1A1410]/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="The Proof" line1="My Personal Transformation" line2="What that looks like." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-px bg-[#1A1410]/[0.06]"
        >
          {/* Before */}
          <motion.div variants={revealLeft} className="relative bg-[#141210]">
            <div className="aspect-[3/4] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: "url('/images/before.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/55 via-[#141210]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#f0ece4]/85 mb-2">Before</p>
                <p className="font-display text-2xl font-light text-[#f0ece4]/75 leading-tight">
                  Not there yet.
                </p>
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div variants={revealRight} className="relative bg-[#141210]">
            <div className="aspect-[3/4] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: "url('/images/after.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/55 via-[#141210]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-2">After</p>
                <p className="font-display text-2xl font-black italic text-[#f0ece4] leading-tight">
                  The Standard.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-[#1A1410]/55 text-xs tracking-[0.2em] uppercase text-center mt-8">
          Amir&apos;s personal transformation. Individual results vary based on effort, consistency, and starting point.
        </p>
      </div>
    </section>
  )
}

// ── First Session ─────────────────────────────────────────────────────
function FirstSession() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const tracked = useRef(false)

  useEffect(() => {
    if (inView && !tracked.current) {
      tracked.current = true
      trackEvent("first_session_view")
    }
  }, [inView])

  return (
    <section id="first-session" className="relative overflow-hidden bg-[#FAF7F2] py-24 border-t border-[#1A1410]/[0.07]">
      <p
        aria-hidden="true"
        className="font-display font-black text-[#1A1410] select-none pointer-events-none absolute inset-0 flex items-center justify-center leading-none"
        style={{ fontSize: "clamp(8rem, 22vw, 18rem)", opacity: 0.04 }}
      >
        BEGIN
      </p>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-10 border border-[#D4A017]/30 bg-[#D4A017]/5 px-6 py-5">
          <p className="text-[#1A1410] text-base sm:text-lg font-semibold">
            Nothing is charged until after we talk.
          </p>
          <p className="text-[#1A1410]/70 text-sm mt-1">
            Your First Session is free — 20 minutes to map out what 6 months of good health actually looks like for you. You decide from there. No pitch.
          </p>
        </div>
        <SectionHeader
          label="Before You Commit"
          line1="What does 6 months"
          line2="of good health mean to you?"
          note="Real change takes time — 12 weeks, minimum. If you've already sunk money into gym memberships that went unused, supplements that sat in a cabinet, or apps you deleted after a week — this is different. Daily access, a real plan, and someone checking in on you every week."
        />
        <motion.div
          ref={ref}
          variants={reveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center text-center"
        >
          <Link
            href="#apply"
            onClick={scrollToApply("first_session")}
            className="cta-glow inline-flex items-center gap-3 bg-[#D4A017] text-[#1A1410] text-xs tracking-[0.2em] uppercase font-semibold px-10 py-5 hover:bg-[#D4A017]/90 transition-colors duration-200 group"
          >
            Book Your First Session
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="max-w-3xl mt-10 px-1">
          <p className="text-[#1A1410]/60 text-sm leading-relaxed">
            <span className="font-semibold text-[#1A1410]/80">Week 4 checkpoint.</span>{" "}
            Check in every Sunday, follow the plan. If you&apos;re not making measurable progress by week 4,
            I rebuild it from the ground up. And if we still can&apos;t get it working for you,
            you&apos;re free to walk. You won&apos;t be billed for months that aren&apos;t delivering.
          </p>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "You're 21. Why would I pay you instead of a certified trainer with years of experience?",
    a: "I won't pretend I've been doing this for 20 years. What I can tell you is that I've spent years building a genuine relationship with my own body, figuring out how physical and mental health drive each other, not just chasing a number on a scale. That obsession is what makes me good at this, and my clients can attest to my knowledge. I only take clients I know I can help.",
  },
  {
    q: "I've tried coaching before and it didn't stick.",
    a: "We're not fixing your workout. We're fixing your lifestyle. Bland food and rigid schedules don't stick because they were never built for your life. This is. Work with me. Get results.",
  },
  {
    q: "What if I apply and it's not the right fit?",
    a: "The First Session is free and there's no commitment before it. You apply, I review it, and you have a 20 minute conversation. You decide from there. No pitch.",
  },
  {
    q: "What does coaching actually cost?",
    a: "Standard is $130/month, Premium is $200/month, both with a 12-week minimum. Nothing is charged before your First Session — we'll go over pricing and which plan fits in plain terms on that call, so you're never guessing what you'd be paying for.",
  },
  {
    q: "I don't know if I have the time right now.",
    a: "That's the point. The program is built around the schedule you actually have. Clients train 3–5 days a week, 30–60 minutes. Train where you are. When you can.",
  },
  {
    q: "Do I need a gym membership?",
    a: "No. We figure out together what you're working with, full gym, home setup, bodyweight only, and build your program around it. You're not adapting to a plan; we're building the plan around you.",
  },
  {
    q: "What happens after the 12 weeks are up?",
    a: "You'll know how to eat, train, and adjust without me. That's the whole point. If you want to keep working together, we can. Most clients do. But the goal is that you don't need me after this. You leave with a framework that runs on its own.",
  },
]

function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="bg-[#EAE1D4] py-20 border-t border-[#1A1410]/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader label="Before You Apply" line1="Common questions." line2="Real answers." />
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-2xl divide-y divide-[#1A1410]/[0.08]"
        >
          {FAQ_ITEMS.map((item, i) => (
            <motion.div key={i} variants={reveal} className="py-8">
              <p className="text-[#1A1410] font-medium text-lg mb-3">{item.q}</p>
              <p className="text-[#1A1410]/75 leading-relaxed">{item.a}</p>
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
      <label className="block text-xs tracking-[0.15em] uppercase text-[#1A1410] mb-3">
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
            <span className="inline-block border border-[#1A1410]/[0.22] px-4 py-2 text-xs tracking-wide text-[#1A1410] transition-colors duration-200 peer-checked:border-[#D4A017] peer-checked:text-[#D4A017] hover:border-[#1A1410]/35 hover:text-[#1A1410]">
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
    "w-full bg-transparent border-b border-[#1A1410]/[0.22] py-3 text-[#1A1410] text-sm placeholder:text-[#1A1410]/50 focus:outline-none focus:border-[#D4A017]/80 transition-colors duration-200"
  const labelClass = "block text-xs tracking-[0.15em] uppercase text-[#1A1410] mb-3"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    trackEvent("apply_form_submit", { status: "attempt" })

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
      trackEvent("apply_form_submit", { status: "success" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      trackEvent("apply_form_submit", { status: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="apply" className="bg-[#FAF7F2] border-t-2 border-[#D4A017]/50">
      {/* Chapter opener */}
      <motion.div
        ref={splashRef}
        variants={reveal}
        initial="hidden"
        animate={splashInView ? "visible" : "hidden"}
        className="text-center pt-24 pb-20 px-6 border-b border-[#1A1410]/[0.07] relative overflow-hidden"
      >
        <p
          aria-hidden="true"
          className="font-display font-black text-[#1A1410] select-none pointer-events-none absolute inset-0 flex items-center justify-center leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 18rem)", opacity: 0.04 }}
        >
          APPLY
        </p>

        <div className="relative z-10">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#D4A017] mb-8">
            Apply Now
          </p>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <span className="font-light text-[#1A1410]">Let&apos;s see if</span>
            <span className="block font-black italic text-[#1A1410]">we&apos;re a fit.</span>
          </h2>
          <p className="text-[#1A1410]/70 text-base max-w-xs mx-auto leading-relaxed mt-6">
            Takes about 3 minutes. I personally review every application.
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
            <div className="w-12 h-px bg-[#D4A017] mx-auto mb-10" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4A017] mb-6">
              Application Received
            </p>
            <h3
              className="font-display font-black text-[#1A1410] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              You&apos;re in.
            </h3>
            <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
              Pick a time for your free 20-minute First Session. No pressure, no pitch. Just a real conversation about where you&apos;re at and where you want to go.
            </p>
            <p className="text-[#1A1410]/65 text-sm leading-relaxed mb-10">
              Want to hit the ground running?{" "}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfgVzHgqmrUM9OfzvWBh5SloIcnlAaR4ah0iavs95BsWwxcoA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A017] underline underline-offset-2 hover:text-[#D4A017]/80 transition-colors"
              >Fill out the intake form</a> before the call
              and I can skip the basics and get straight to your plan.
            </p>
            <button
              onClick={openBooking}
              className="inline-flex items-center gap-3 border border-[#D4A017] px-8 py-4 text-[#D4A017] text-sm tracking-[0.15em] uppercase hover:bg-[#D4A017] hover:text-[#1A1410] transition-all duration-300 cursor-pointer"
            >
              Book Your First Session <ArrowRight size={16} />
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
              <div className="w-12 h-px bg-[#D4A017] mb-8" />
              <p className="text-[#1A1410]/82 text-lg leading-relaxed mb-4">
                Fill out the application. Once you submit, you&apos;ll book your free
                20-minute First Session directly. No waiting, no pitch.
              </p>
              <p className="text-[#1A1410]/70 text-lg leading-relaxed mb-4">
                This step is free — no payment or card details are collected here.
                Billing only comes up if you choose to continue after your free session.
              </p>
              <p className="text-[#1A1410]/70 text-lg leading-relaxed mb-12">
                I only take clients I know I can genuinely help.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[#D4A017]/40 flex-shrink-0" />
                  <span className="text-[#1A1410]/60 text-sm tracking-wide">amirsimayof@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[#D4A017]/40 flex-shrink-0" />
                  <Link
                    href="https://www.tiktok.com/@amir_csim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A1410]/60 text-sm tracking-wide hover:text-[#1A1410]/85 transition-colors"
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
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#1A1410]/75 mb-8">
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
                    className="mt-1 flex-shrink-0 accent-[#D4A017]"
                    required
                  />
                  <span className="text-xs text-[#1A1410]/65 leading-relaxed group-hover:text-[#1A1410]/80 transition-colors">
                    I have read and agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-[#D4A017] underline underline-offset-2 hover:text-[#D4A017]/70">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="text-[#D4A017] underline underline-offset-2 hover:text-[#D4A017]/70">
                      Privacy Policy
                    </Link>. I confirm I am 18 or older and have medical clearance to begin an exercise program.
                  </span>
                </label>

                {error && (
                  <p className="text-red-600 text-xs tracking-wide">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !agreed}
                  className="w-full bg-[#D4A017] text-[#1A1410] text-xs tracking-[0.2em] uppercase font-semibold py-5 hover:bg-[#D4A017]/90 transition-colors duration-200 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
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
    <footer className="bg-[#FAF7F2] border-t border-[#1A1410]/[0.07] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] uppercase font-bold text-[#1A1410] mb-4">
              The Standard
            </p>
            <p className="text-[#1A1410]/65 text-sm leading-relaxed max-w-xs mb-6">
              Evidence-based 1-on-1 online fitness coaching for busy people who are serious about
              results.
            </p>
            <Link
              href="https://www.tiktok.com/@amir_csim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#1A1410]/65 hover:text-[#1A1410]/80 transition-colors duration-200"
            >
              <TikTokIcon />
              <span className="text-xs tracking-widest">@amir_csim</span>
            </Link>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1A1410]/45 mb-5">Navigate</p>
            <nav className="space-y-3">
              {[
                ["#about", "About"],
                ["#process", "Process"],
                ["#results", "Results"],
                ["#first-session", "First Session"],
                ["#apply", "Apply"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-[#1A1410]/70 hover:text-[#1A1410]/90 transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#1A1410]/45 mb-5">Contact</p>
            <div className="space-y-3 text-sm text-[#1A1410]/70">
              <p>amirsimayof@gmail.com</p>
              <p className="leading-relaxed">Built for athletes with real lives.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1410]/[0.07] pt-8 space-y-6">
          <p className="text-[#1A1410]/50 text-xs leading-relaxed max-w-3xl">
            The Standard is not a medical practice. Coaching and nutritional guidance provided is for general wellness and informational purposes only, and is not a substitute for advice from a licensed physician, registered dietitian, or other qualified healthcare professional. Consult your doctor before beginning any exercise or nutrition program.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#1A1410]/35 text-xs tracking-wide">
              © {new Date().getFullYear()} The Standard. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-[#1A1410]/35 text-xs tracking-wide hover:text-[#1A1410]/40 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#1A1410]/35 text-xs tracking-wide hover:text-[#1A1410]/40 transition-colors">
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
    <div className="bg-[#FAF7F2] text-[#1A1410] min-h-screen">
      <Nav />
      <Hero />
      <Apply quizAnswers={quizAnswers} />
      <Marquee />
      <Included />
      <Testimonials />
      <Process />
      <SectionSeam from="#EAE1D4" to="#FAF7F2" />
      <Philosophy />
      <SectionSeam from="#FAF7F2" to="#EAE1D4" />
      <Transformation />
      <SectionSeam from="#EAE1D4" to="#FAF7F2" />
      <FirstSession />
      <SectionSeam from="#FAF7F2" to="#EAE1D4" />
      <FAQ />
      <SectionSeam from="#EAE1D4" to="#FAF7F2" />
      <Footer />
      <StickyApplyCTA />
      <ScrollQuiz answers={quizAnswers} onAnswer={handleQuizAnswer} />
    </div>
  )
}
