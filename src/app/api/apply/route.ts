import { NextRequest } from "next/server"
import { z } from "zod"
import { google } from "googleapis"
import { notifyNewApplication } from "@/lib/slack"
import { rateLimit } from "@/lib/rate-limit"

const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const SHEET_RANGE = "Application Form!A:I"

const ApplySchema = z.object({
  firstName:       z.string().min(1).max(100),
  lastName:        z.string().min(1).max(100),
  email:           z.string().email().max(254),
  goal:            z.string().min(1).max(2000),
  trainingDays:    z.string().max(50).optional(),
  biggestObstacle: z.string().max(500).optional(),
  budget:          z.string().max(100).optional(),
  priorCoaching:   z.string().max(100).optional(),
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
  if (!rateLimit(ip, "apply", 5, 60_000).allowed) {
    return Response.json({ error: "Too many requests." }, { status: 429 })
  }

  try {
    const parsed = ApplySchema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json({ error: "Invalid input." }, { status: 400 })
    }

    const { firstName, lastName, email, goal, trainingDays, biggestObstacle, budget, priorCoaching } =
      parsed.data

    const auth = getSheetsAuth()
    const sheets = google.sheets({ version: "v4", auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            firstName,
            lastName,
            email,
            goal,
            trainingDays ?? "",
            biggestObstacle ?? "",
            budget ?? "",
            priorCoaching ?? "",
          ],
        ],
      },
    })

    notifyNewApplication({ firstName, lastName, email, goal, trainingDays, biggestObstacle, priorCoaching })
      .catch((err) => console.error("[slack]", err))

    return Response.json({ success: true })
  } catch (err) {
    console.error("[/api/apply]", err)
    return Response.json({ error: "Failed to submit application." }, { status: 500 })
  }
}
