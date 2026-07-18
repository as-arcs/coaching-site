import { track } from "@vercel/analytics"

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, props)
  }
  track(name, props)
}
