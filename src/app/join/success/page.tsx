import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f0ece4] flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-md text-center">
        <div className="w-12 h-px bg-[#c9a84c] mx-auto mb-10" />

        <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">
          Payment Confirmed
        </p>

        <h1
          className="font-display font-black text-[#f0ece4] mb-6 leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          You&apos;re in.
        </h1>

        <p className="text-[#f0ece4]/55 text-lg leading-relaxed mb-4">
          Amir will reach out within 24 hours to kick things off. Your custom program will be ready within 48 hours of your first message.
        </p>

        <p className="text-[#f0ece4]/35 text-sm leading-relaxed mb-10">
          Check your email for a receipt from Stripe. Questions? Text or email Amir directly.
        </p>

        <div className="space-y-3">
          <a
            href="mailto:amirsimayof@gmail.com"
            className="inline-flex items-center gap-3 border border-[#c9a84c] px-8 py-4 text-[#c9a84c] text-xs tracking-[0.15em] uppercase hover:bg-[#c9a84c] hover:text-[#080808] transition-all duration-300"
          >
            Email Amir <ArrowRight size={14} />
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.07]">
          <p className="font-display text-xs tracking-[0.2em] uppercase text-[#f0ece4]/20">
            The Standard
          </p>
        </div>
      </div>
    </div>
  )
}
