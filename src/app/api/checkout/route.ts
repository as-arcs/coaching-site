import { NextRequest } from "next/server"
import Stripe from "stripe"
import { rateLimit } from "@/lib/rate-limit"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  if (!rateLimit(ip, "checkout", 10, 60_000).allowed) {
    return Response.json({ error: "Too many requests." }, { status: 429 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const PRICE_IDS: Record<string, string> = {
    standard: process.env.STRIPE_PRICE_ID_STANDARD!,
    premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
  }

  try {
    const body = await request.json()
    const plan = typeof body?.plan === "string" ? body.plan : ""
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : ""
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : undefined

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return Response.json({ error: "Invalid plan." }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      success_url: `${SITE_URL}/join/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/join?plan=${plan}`,
      metadata: { plan },
      subscription_data: {
        metadata: { plan },
      },
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error("[/api/checkout]", err)
    return Response.json({ error: "Failed to create checkout session." }, { status: 500 })
  }
}
