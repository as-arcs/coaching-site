import { NextRequest } from "next/server"
import Stripe from "stripe"
import { notifyNewClient } from "@/lib/slack"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[webhook] signature verification failed", err)
    return new Response("Webhook signature verification failed.", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const plan = session.metadata?.plan ?? "unknown"
    const email = session.customer_email ?? session.customer_details?.email ?? "unknown"

    notifyNewClient({ email, plan })
      .catch((err) => console.error("[webhook] slack notify failed", err))
  }

  return new Response("ok", { status: 200 })
}
