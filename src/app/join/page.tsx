"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

const PLANS = {
  standard: {
    name: "Standard",
    price: "$297",
    note: "per month · billed monthly · 12-week minimum",
    features: [
      "Custom training program",
      "Nutrition guidance",
      "Weekly check-ins & adjustments",
      "Direct WhatsApp access to me",
      "Progress tracking system",
      "Fitness background review",
    ],
  },
  premium: {
    name: "Premium",
    price: "$397",
    note: "per month · billed monthly · 12-week minimum",
    features: [
      "Everything in Standard",
      "Bi-weekly video check-ins",
      "Priority 12hr response time",
      "Monthly strategy call",
      "General supplement education",
      "Lifestyle & recovery support",
    ],
  },
}

function JoinContent() {
  const params = useSearchParams()
  const planKey = (params.get("plan") ?? "standard") as keyof typeof PLANS
  const email = params.get("email") ?? ""
  const plan = PLANS[planKey] ?? PLANS.standard

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCheckout() {
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.")
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#f0ece4] flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-6 text-center">
          The Standard · Coaching
        </p>

        <div className="border border-white/[0.1] p-10">
          {planKey === "premium" && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4A017] mb-4">
              Most Popular
            </p>
          )}

          <h1 className="font-display text-3xl font-black text-[#f0ece4] mb-1">
            {plan.name}
          </h1>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display font-black text-[#f0ece4]" style={{ fontSize: "2.5rem" }}>
              {plan.price}
            </span>
          </div>
          <p className="text-[#f0ece4]/35 text-xs tracking-wide mb-8">{plan.note}</p>

          <ul className="space-y-3 mb-10">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-[#f0ece4]/65">
                <Check className="h-3.5 w-3.5 text-[#D4A017] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-red-400 text-xs tracking-wide mb-4">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={cn(
              "w-full bg-[#D4A017] text-[#0E0C0A] text-xs tracking-[0.2em] uppercase font-semibold py-5 transition-colors duration-200 flex items-center justify-center gap-3 group",
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#D4A017]/90 cursor-pointer"
            )}
          >
            {loading ? "Redirecting…" : "Pay Now"}
            {!loading && (
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            )}
          </button>

          <p className="text-[#f0ece4]/25 text-[10px] tracking-wide text-center mt-5 leading-relaxed">
            Secured by Stripe · Cancel anytime after 12 weeks
          </p>
        </div>

        <p className="text-[#f0ece4]/20 text-xs text-center mt-8 leading-relaxed">
          Questions? Reach out at{" "}
          <a href="mailto:amirsimayof@gmail.com" className="text-[#f0ece4]/40 hover:text-[#f0ece4]/60 transition-colors">
            amirsimayof@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  )
}
