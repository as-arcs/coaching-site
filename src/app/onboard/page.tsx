"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = {
  standard: "Standard — $297/month",
  premium: "Premium — $497/month",
}

const ACKNOWLEDGMENTS = [
  {
    id: "not-licensed",
    text: "I understand that Amir Cohen-Simayof is not a licensed physician, registered dietitian, or certified personal trainer. All coaching, training programs, and nutrition guidance provided through The Standard are for general fitness and wellness purposes only, and do not constitute medical or clinical advice.",
  },
  {
    id: "medical-clearance",
    text: "I confirm that I am medically cleared by a licensed physician to participate in a structured exercise and nutrition program, or I accept full responsibility for proceeding without such clearance.",
  },
  {
    id: "accurate-disclosure",
    text: "I confirm that all information I have provided — including any injuries, health conditions, or physical limitations — is accurate and complete to the best of my knowledge. I agree to notify my coach promptly if my health status changes.",
  },
  {
    id: "assumption-of-risk",
    text: "I acknowledge that participation in any exercise program carries inherent physical risk, including muscle soreness, injury, or other adverse events. I voluntarily assume all such risks.",
  },
  {
    id: "refund-policy",
    text: "I understand that no refunds will be issued once my training program or nutrition guidance has been delivered. I have read and accept the full refund policy set out in the Terms of Service.",
  },
  {
    id: "commitment",
    text: "I commit to the 12-week minimum engagement period and authorize recurring monthly charges to my payment method for the duration of my enrollment.",
  },
]

function OnboardContent() {
  const params = useSearchParams()
  const defaultFirstName = params.get("firstName") ?? ""
  const defaultLastName = params.get("lastName") ?? ""
  const defaultEmail = params.get("email") ?? ""
  const defaultPlan = (params.get("plan") ?? "standard") as keyof typeof PLANS

  const [firstName, setFirstName] = useState(defaultFirstName)
  const [lastName, setLastName] = useState(defaultLastName)
  const [email, setEmail] = useState(defaultEmail)
  const [plan, setPlan] = useState<keyof typeof PLANS>(
    defaultPlan in PLANS ? defaultPlan : "standard"
  )
  const [startDate, setStartDate] = useState("")
  const [knownConditions, setKnownConditions] = useState("")
  const [signature, setSignature] = useState("")
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const allChecked = ACKNOWLEDGMENTS.every((a) => checked[a.id])
  const canSubmit = allChecked && signature.trim().length > 0 && firstName && lastName && email && startDate

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          plan,
          startDate,
          knownConditions: knownConditions.trim() || undefined,
          signature: signature.trim(),
        }),
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

  const inputClass =
    "w-full bg-transparent border-b border-white/[0.22] py-3 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/40 focus:outline-none focus:border-[#D4A017]/80 transition-colors duration-200"
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-[#f0ece4]/50 mb-2"

  if (submitted) {
    return (
      <div className="text-center max-w-md mx-auto py-16">
        <div className="w-10 h-10 rounded-full border border-[#D4A017]/40 flex items-center justify-center mx-auto mb-8">
          <Check className="h-4 w-4 text-[#D4A017]" />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-4">Agreement Signed</p>
        <h2 className="font-display text-2xl font-black text-[#f0ece4] mb-4">
          You&apos;re locked in.
        </h2>
        <p className="text-[#f0ece4]/60 text-sm leading-relaxed mb-8">
          Your onboarding agreement has been received. Amir will be in touch within 24 hours to confirm your start date and deliver your program.
        </p>
        <p className="text-[#f0ece4]/30 text-xs">
          Questions? Reach out at{" "}
          <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017]/60 hover:text-[#D4A017] transition-colors">
            amirsimayof@gmail.com
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">

      {/* Client details */}
      <section>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-6">Your Details</p>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={inputClass}
                placeholder="First"
              />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={inputClass}
                placeholder="Last"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className={labelClass}>Plan</label>
            <div className="flex gap-3 pt-1">
              {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((key) => (
                <label key={key} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={plan === key}
                    onChange={() => setPlan(key)}
                    className="sr-only peer"
                  />
                  <span className="inline-block border border-white/[0.22] px-4 py-2 text-xs tracking-wide text-[#f0ece4]/70 transition-colors duration-200 peer-checked:border-[#D4A017] peer-checked:text-[#D4A017]">
                    {PLANS[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Agreed start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={cn(inputClass, "text-[#f0ece4]/70 [color-scheme:dark]")}
            />
          </div>

          <div>
            <label className={labelClass}>
              Known injuries, conditions, or physical limitations{" "}
              <span className="text-[#f0ece4]/30 normal-case tracking-normal">(optional — be specific)</span>
            </label>
            <textarea
              value={knownConditions}
              onChange={(e) => setKnownConditions(e.target.value)}
              className={cn(inputClass, "resize-none min-h-[80px]")}
              placeholder="e.g. right rotator cuff strain, lower back sensitivity, previous ACL reconstruction..."
            />
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-2">Acknowledgments</p>
        <p className="text-[#f0ece4]/40 text-xs mb-6 leading-relaxed">
          Read each statement carefully and check to confirm your understanding.
        </p>
        <div className="space-y-5">
          {ACKNOWLEDGMENTS.map((item, i) => (
            <label
              key={item.id}
              className={cn(
                "flex items-start gap-4 p-5 border cursor-pointer transition-colors duration-200 group",
                checked[item.id]
                  ? "border-[#D4A017]/30 bg-[#D4A017]/[0.04]"
                  : "border-white/[0.07] hover:border-white/[0.12]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors duration-200",
                  checked[item.id] ? "border-[#D4A017] bg-[#D4A017]/10" : "border-white/20"
                )}
              >
                {checked[item.id] && <Check className="h-2.5 w-2.5 text-[#D4A017]" />}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!checked[item.id]}
                onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                required
              />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#f0ece4]/30 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-[#f0ece4]/65 text-sm leading-relaxed">{item.text}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Digital signature */}
      <section>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-2">Digital Signature</p>
        <p className="text-[#f0ece4]/40 text-xs mb-6 leading-relaxed">
          By typing your full legal name below, you confirm that you have read, understood, and agree to all of the above, and to The Standard&apos;s{" "}
          <Link href="/terms" target="_blank" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>. This constitutes a legally binding electronic signature.
        </p>
        <div>
          <label className={labelClass}>Full legal name</label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
            className={cn(inputClass, "font-display italic text-base")}
            placeholder="Type your full name"
          />
        </div>
      </section>

      {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !canSubmit}
        className="w-full bg-[#D4A017] text-[#0E0C0A] text-xs tracking-[0.2em] uppercase font-semibold py-5 hover:bg-[#D4A017]/90 transition-colors duration-200 flex items-center justify-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Sign & Submit Agreement"}
        {!submitting && (
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        )}
      </button>

      <p className="text-[#f0ece4]/20 text-[10px] tracking-wide text-center leading-relaxed">
        Your submission is timestamped and recorded. A copy is available upon request at amirsimayof@gmail.com.
      </p>

    </form>
  )
}

export default function OnboardPage() {
  return (
    <div className="bg-[#0E0C0A] text-[#f0ece4] min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-24">

        <Link
          href="/"
          className="text-[10px] tracking-[0.25em] uppercase text-[#D4A017] hover:text-[#D4A017]/70 transition-colors mb-12 inline-block"
        >
          ← The Standard
        </Link>

        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-3">Client Agreement</p>
        <h1 className="font-display text-3xl font-black text-[#f0ece4] mb-2">Onboarding Agreement</h1>
        <p className="text-[#f0ece4]/40 text-sm mb-4">Complete before your program is delivered.</p>

        <div className="border border-white/[0.07] p-5 mb-12 text-[#f0ece4]/50 text-xs leading-relaxed">
          This agreement governs your coaching engagement with The Standard. It supplements the{" "}
          <Link href="/terms" target="_blank" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          you agreed to at application. Please read every section carefully before signing.
        </div>

        <Suspense>
          <OnboardContent />
        </Suspense>

      </div>
    </div>
  )
}
