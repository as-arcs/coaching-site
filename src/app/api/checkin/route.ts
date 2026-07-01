import { NextRequest } from "next/server"
import { z } from "zod"
import { google } from "googleapis"
import { rateLimit } from "@/lib/rate-limit"
import { notifyWeeklyCheckin } from "@/lib/slack"

const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const SHEET_RANGE = "Check-ins!A:F"

const CheckinSchema = z.object({
  email:      z.string().email().max(254),
  bodyweight: z.number().positive().max(1000),
  adherence:  z.number().int().min(1).max(5),
  energy:     z.number().int().min(1).max(5),
  notes:      z.string().max(2000).optional(),
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
  if (!rateLimit(ip, "checkin", 5, 60_000).allowed) {
    return Response.json({ error: "Too many requests." }, { status: 429 })
  }

  try {
    const parsed = CheckinSchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ error: "Invalid input." }, { status: 400 })
    }

    const { email, bodyweight, adherence, energy, notes } = parsed.data

    const auth = getSheetsAuth()
    const sheets = google.sheets({ version: "v4", auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          email,
          bodyweight,
          adherence,
          energy,
          notes ?? "",
        ]],
      },
    })

    notifyWeeklyCheckin({ email, bodyweight, adherence, energy, notes })
      .catch((err) => console.error("[slack]", err))

    return Response.json({ success: true })
  } catch (err) {
    console.error("[/api/checkin]", err)
    return Response.json({ error: "Failed to submit check-in." }, { status: 500 })
  }
}
