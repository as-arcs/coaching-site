import Link from "next/link"

export const metadata = {
  title: "Privacy Policy — The Standard",
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#0E0C0A] text-[#f0ece4] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="text-[10px] tracking-[0.25em] uppercase text-[#D4A017] hover:text-[#D4A017]/70 transition-colors mb-12 inline-block"
        >
          ← The Standard
        </Link>

        <h1 className="font-display text-3xl font-black text-[#f0ece4] mb-2">Privacy Policy</h1>
        <p className="text-[#f0ece4]/40 text-sm mb-16">Last updated: June 2026</p>

        <div className="space-y-12 text-[#f0ece4]/75 leading-relaxed">

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">1. Overview</h2>
            <p>
              This Privacy Policy explains how The Standard, operated by Amir Cohen-Simayof
              (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects, uses, and protects the personal
              information you provide when using our coaching services and website.
            </p>
            <p className="mt-4">
              By submitting an application or enrolling in our coaching program, you agree to
              the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[#f0ece4]/90 font-medium mb-1">Application data</p>
                <p>
                  When you submit a coaching application, we collect your name, email address,
                  fitness goals, self-reported training history, and responses to application questions.
                </p>
              </div>
              <div>
                <p className="text-[#f0ece4]/90 font-medium mb-1">Intake form data</p>
                <p>
                  If you complete the intake form, we collect additional information including
                  dietary preferences, lifestyle details, sleep patterns, stress levels, and any
                  self-reported health or injury history you choose to share.
                </p>
              </div>
              <div>
                <p className="text-[#f0ece4]/90 font-medium mb-1">Payment data</p>
                <p>
                  Payment is processed by Stripe, Inc. We do not store your credit card number
                  or full payment details. We retain records of your plan selection, billing amount,
                  and transaction history.
                </p>
              </div>
              <div>
                <p className="text-[#f0ece4]/90 font-medium mb-1">Communications</p>
                <p>
                  We retain records of coaching-related communications conducted via WhatsApp,
                  email, or video calls to the extent necessary to deliver services.
                </p>
              </div>
              <div>
                <p className="text-[#f0ece4]/90 font-medium mb-1">Usage data</p>
                <p>
                  Standard website analytics (page visits, device type) may be collected through
                  hosting infrastructure. We do not use third-party advertising trackers.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information solely to:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Deliver and personalize your coaching program",
                "Process payments and manage your subscription",
                "Communicate with you about your progress and program",
                "Schedule discovery calls and ongoing sessions via Cal.com",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do not sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">4. Third-Party Services</h2>
            <p className="mb-4">
              To operate our coaching business, we use the following services, each governed by
              their own privacy policies:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "Google Workspace (Sheets, Docs, Drive) — program storage and client records",
                "Stripe — payment processing",
                "Cal.com — appointment scheduling",
                "WhatsApp (Meta) — ongoing client communication",
                "Hevy — training tracking",
                "Slack — internal operations only, not client-facing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">5. Data Retention</h2>
            <p>
              We retain your personal data for the duration of your coaching engagement and for
              one year following its conclusion. After that period, your data will be deleted
              unless you request earlier deletion or we are required by law to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2 pl-4">
              {[
                "Request a copy of the personal data we hold about you",
                "Request correction of inaccurate data",
                "Request deletion of your data, subject to any legal retention obligations",
                "Withdraw consent to future marketing communications",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                amirsimayof@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">7. California Residents (CCPA)</h2>
            <p className="mb-4">
              If you are a California resident, you have additional rights under the California
              Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "The right to know what personal information is collected, used, shared, or sold",
                "The right to delete personal information we hold about you",
                "The right to opt out of the sale of personal information (we do not sell personal information)",
                "The right to non-discrimination for exercising your CCPA rights",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To submit a CCPA request, contact{" "}
              <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                amirsimayof@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">8. Age Restriction</h2>
            <p>
              Our services are available to individuals 18 years of age or older. We do not
              knowingly collect personal information from anyone under 18. If we become aware
              that a minor has submitted personal information, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">9. Data Security</h2>
            <p>
              We take reasonable precautions to protect your personal information. However, no
              method of transmission over the internet is completely secure. We cannot guarantee
              the absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated to active clients via email with at least 14 days&apos; notice before
              taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-[#f0ece4] font-semibold text-lg mb-4">11. Contact</h2>
            <p>
              Questions about this Privacy Policy? Reach out at{" "}
              <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                amirsimayof@gmail.com
              </a>.
            </p>
          </section>

        </div>

        <div className="border-t border-white/[0.07] mt-16 pt-8">
          <Link
            href="/terms"
            className="text-[10px] tracking-[0.25em] uppercase text-[#f0ece4]/30 hover:text-[#f0ece4]/60 transition-colors"
          >
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  )
}
