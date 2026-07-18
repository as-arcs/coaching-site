import Link from "next/link"

export const metadata = {
  title: "Terms of Service — The Standard",
}

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#1A1410] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="text-[10px] tracking-[0.25em] uppercase text-[#D4A017] hover:text-[#D4A017]/70 transition-colors mb-12 inline-block"
        >
          ← The Standard
        </Link>

        <h1 className="font-display text-3xl font-black text-[#1A1410] mb-2">Terms of Service</h1>
        <p className="text-[#1A1410]/40 text-sm mb-4">Last updated: June 2026</p>
        <p className="text-[#1A1410]/50 text-sm border border-[#1A1410]/[0.07] p-4 mb-16 leading-relaxed">
          Please read these Terms carefully. By submitting an application, completing enrollment,
          or making a payment, you agree to be bound by these Terms.
        </p>

        <div className="space-y-12 text-[#1A1410]/75 leading-relaxed">

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">1. About the Service</h2>
            <p className="mb-4">
              The Standard is an online fitness coaching service operated by Amir Cohen-Simayof
              (&ldquo;Coach&rdquo;). We provide personalized training programs, nutrition guidance,
              weekly check-ins, and ongoing support to enrolled clients.
            </p>
            <p className="bg-[#1A1410]/[0.03] border border-[#1A1410]/[0.07] p-4 text-[#1A1410]/60 text-sm">
              <strong className="text-[#1A1410]/80">Important:</strong> The Standard is not a
              medical practice. Amir Cohen-Simayof is not a licensed physician, registered
              dietitian, or licensed personal trainer. Nothing provided through this service
              constitutes medical advice, dietetic advice, or clinical treatment. All guidance
              is for general fitness and wellness purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years of age to enroll. By enrolling, you represent and
              warrant that:
            </p>
            <ul className="space-y-3 pl-4">
              {[
                "You are 18 years of age or older;",
                "You have consulted with or are medically cleared by a licensed physician to participate in a structured exercise and nutrition program;",
                "You will provide accurate and complete information in your application and intake forms; and",
                "You will promptly notify the Coach of any material changes to your health status during the engagement.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#D4A017]/60 text-xs mt-0.5 flex-shrink-0 font-mono">
                    ({String.fromCharCode(97 + i)})
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">3. Assumption of Risk</h2>
            <p>
              You acknowledge that participation in any exercise program carries inherent
              physical risk, including but not limited to muscle soreness, injury, or adverse
              health events. You voluntarily assume all such risks. The Coach is not liable for
              any injury or adverse outcome arising from your participation in the program,
              provided the Coach has not acted with gross negligence.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">4. Services</h2>
            <p className="mb-4">
              Upon enrollment and payment, you will receive:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "A custom training program built around your schedule, goals, and equipment",
                "General nutrition guidance tailored to your lifestyle and goals",
                "Weekly check-in review and program adjustments",
                "Access to the Coach via WhatsApp during business hours",
                "Additional services as specified in your selected plan",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Services will be delivered within 48 hours of enrollment confirmation and
              initial payment.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">5. Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">5.1 Fees</p>
                <p>
                  Coaching fees are charged on a monthly basis at the rate corresponding to
                  your selected plan ($130/month for Standard; $200/month for Premium), billed
                  on the same date each month.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">5.2 Minimum Commitment</p>
                <p>
                  All plans carry a 12-week (approximately 3-month) minimum commitment. You
                  agree to maintain your subscription for a minimum of 12 weeks from your
                  enrollment date.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">5.3 Billing</p>
                <p>
                  Payments are processed automatically each month via Stripe. You authorize
                  recurring charges to your payment method for the duration of your engagement.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">5.4 Failed Payments</p>
                <p>
                  If a payment fails, access to coaching services may be suspended until
                  payment is resolved. You remain responsible for all outstanding amounts.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">6. Cancellation</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">6.1 After the Minimum Commitment</p>
                <p>
                  Following completion of your 12-week minimum commitment, you may cancel at
                  any time by providing written notice to{" "}
                  <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                    amirsimayof@gmail.com
                  </a>. Cancellation takes effect at the end of the current billing cycle. No
                  partial-month refunds are issued.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">6.2 During the Minimum Commitment</p>
                <p>
                  Cancellation during the 12-week minimum commitment period is not permitted
                  except in cases of documented medical necessity (with physician documentation)
                  or termination by the Coach under Section 8.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">7. Refund Policy</h2>
            <p className="mb-4">
              No refunds will be issued once a training program or nutrition guidance has been
              delivered to a client. If you choose not to use the program after delivery, fees
              remain non-refundable.
            </p>
            <p>
              The only exception is termination by the Coach under Section 8, in which case a
              prorated refund for unused full weeks of service remaining in the current billing
              cycle will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">8. Termination by Coach</h2>
            <p className="mb-4">
              The Coach reserves the right to terminate a coaching engagement immediately for
              cause, including but not limited to:
            </p>
            <ul className="space-y-2 pl-4 mb-4">
              {[
                "Materially false or misleading information provided in the application or intake forms",
                "Abusive, threatening, or harassing conduct toward the Coach",
                "Non-payment of fees",
                "Conduct that the Coach reasonably determines makes continuation of services harmful or impractical",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#D4A017] mt-1.5 block w-1 h-1 rounded-full flex-shrink-0 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              In the event of termination for cause, you will receive a prorated refund for
              any prepaid but undelivered full weeks of service remaining in your current
              billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">9. Client Obligations</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="space-y-3 pl-4">
              {[
                "Complete intake forms accurately and update them when your circumstances materially change;",
                "Use training programs and nutrition guidance provided solely for your own personal use;",
                "Not share, resell, reproduce, or distribute any program materials provided to you; and",
                "Provide timely weekly check-in data to enable accurate program adjustments.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#D4A017]/60 text-xs mt-0.5 flex-shrink-0 font-mono">
                    ({String.fromCharCode(97 + i)})
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">10. Intellectual Property</h2>
            <p>
              All training programs, nutrition guidance documents, and related materials created
              by the Coach are the intellectual property of Amir Cohen-Simayof. Upon payment,
              you are granted a personal, non-transferable license to use these materials for
              your own fitness purposes only. No ownership is transferred.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, the Coach&apos;s total liability
              to you for any claim arising out of or related to these Terms or the services
              provided shall not exceed the total fees you paid in the 30 days preceding the
              event giving rise to the claim. In no event shall the Coach be liable for any
              indirect, incidental, special, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">12. Dispute Resolution</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">12.1 Informal Resolution</p>
                <p>
                  Before initiating any formal dispute, you agree to contact the Coach at{" "}
                  <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                    amirsimayof@gmail.com
                  </a>{" "}
                  and attempt to resolve the dispute informally for a period of 30 days.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">12.2 Arbitration</p>
                <p>
                  If the dispute is not resolved informally, it will be submitted to binding
                  arbitration administered by the American Arbitration Association (AAA) under
                  its Consumer Arbitration Rules. Arbitration will take place in Suffolk County,
                  Massachusetts. The arbitrator&apos;s decision will be final and binding.
                </p>
              </div>
              <div>
                <p className="text-[#1A1410]/90 font-medium mb-1">12.3 Class Action Waiver</p>
                <p>
                  You agree to resolve disputes individually and waive any right to participate
                  in a class action lawsuit or class-wide arbitration.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Commonwealth of Massachusetts,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">14. Modifications</h2>
            <p>
              The Coach reserves the right to update these Terms at any time. Material changes
              will be communicated to active clients via email with at least 14 days&apos; notice.
              Continued use of the service after notice constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">15. Entire Agreement</h2>
            <p>
              These Terms, together with the Privacy Policy, constitute the entire agreement
              between you and the Coach with respect to the coaching services and supersede
              all prior agreements or understandings.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A1410] font-semibold text-lg mb-4">Contact</h2>
            <p>
              Questions about these Terms? Reach out at{" "}
              <a href="mailto:amirsimayof@gmail.com" className="text-[#D4A017] hover:text-[#D4A017]/70 transition-colors">
                amirsimayof@gmail.com
              </a>.
            </p>
          </section>

        </div>

        <div className="border-t border-[#1A1410]/[0.07] mt-16 pt-8">
          <Link
            href="/privacy"
            className="text-[10px] tracking-[0.25em] uppercase text-[#1A1410]/30 hover:text-[#1A1410]/60 transition-colors"
          >
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}
