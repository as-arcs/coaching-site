import { NextRequest } from "next/server"
import { z } from "zod"
import { google } from "googleapis"
import { rateLimit } from "@/lib/rate-limit"
import { notifyOnboardingComplete } from "@/lib/slack"
import { setupClientFolder } from "@/lib/drive"

// Requires a tab named "Onboarding" in the Google Sheet
const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const SHEET_RANGE = "Onboarding!A:J"

const OnboardSchema = z.object({
  firstName:          z.string().min(1).max(100),
  lastName:           z.string().min(1).max(100),
  email:              z.string().email().max(254),
  plan:               z.enum(["standard", "premium"]),
  startDate:          z.string().min(1).max(50),
  knownConditions:    z.string().max(1000).optional(),
  signature:          z.string().min(1).max(200),
})

function getSheetsAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  if (!rateLimit(ip, "onboard", 5, 60_000).allowed) {
    return Response.json({ error: "Too many requests." }, { status: 429 })
  }

  try {
    const parsed = OnboardSchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ error: "Invalid input." }, { status: 400 })
    }

    const { firstName, lastName, email, plan, startDate, knownConditions, signature } = parsed.data

    const auth = getSheetsAuth()
    const sheets = google.sheets({ version: "v4", auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          firstName,
          lastName,
          email,
          plan === "standard" ? "Standard ($130/mo)" : "Premium ($200/mo)",
          startDate,
          knownConditions ?? "None disclosed",
          signature,
          "All acknowledgments confirmed",
        ]],
      },
    })

    notifyOnboardingComplete({ firstName, lastName, email, plan, startDate })
      .catch((err) => console.error("[slack]", err))

    setupClientFolder(`${firstName} ${lastName}`)
      .catch((err) => console.error("[drive]", err))

    return Response.json({ success: true })
  } catch (err) {
    console.error("[/api/onboard]", err)
    return Response.json({ error: "Failed to submit agreement." }, { status: 500 })
  }
}
