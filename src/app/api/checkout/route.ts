import { NextRequest } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const PRICE_IDS: Record<string, string> = {
    standard: process.env.STRIPE_PRICE_ID_STANDARD!,
    premium: process.env.STRIPE_PRICE_ID_PREMIUM!,
  }
  try {
    const { plan, email } = await request.json()

    const priceId = PRICE_IDS[plan as string]
    if (!priceId) {
      return Response.json({ error: "Invalid plan." }, { status: 400 })
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      success_url: `${origin}/join/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/join?plan=${plan}`,
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
