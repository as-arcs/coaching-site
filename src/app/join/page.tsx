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
      "Macro-based nutrition plan",
      "Weekly check-ins & adjustments",
      "WhatsApp access to Amir",
      "Progress tracking system",
      "Full health & injury screening",
    ],
  },
  premium: {
    name: "Premium",
    price: "$497",
    note: "per month · billed monthly · 12-week minimum",
    features: [
      "Everything in Standard",
      "Bi-weekly video check-ins",
      "Priority 12hr response time",
      "Monthly strategy call",
      "Supplement guidance",
      "Lifestyle & recovery coaching",
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
    <div className="min-h-screen bg-[#080808] text-[#f0ece4] flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-6 text-center">
          The Standard · Coaching
        </p>

        <div className="border border-white/[0.1] p-10">
          {planKey === "premium" && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-4">
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
                <Check className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />
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
              "w-full bg-[#c9a84c] text-[#080808] text-xs tracking-[0.2em] uppercase font-semibold py-5 transition-colors duration-200 flex items-center justify-center gap-3 group",
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#c9a84c]/90 cursor-pointer"
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
