import { NextRequest } from "next/server"
import { google } from "googleapis"
import { notifyNewApplication } from "@/lib/slack"

const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const SHEET_RANGE = "Sheet1!A:I"

function getSheetsAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, goal, trainingDays, biggestObstacle, budget, priorCoaching } =
      await request.json()

    if (!firstName || !lastName || !email || !goal) {
      return Response.json({ error: "Missing required fields." }, { status: 400 })
    }

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

    // Fire-and-forget — Slack failure must not block the response
    notifyNewApplication({ firstName, lastName, email, goal, trainingDays, biggestObstacle, priorCoaching })
      .catch((err) => console.error("[slack]", err))

    return Response.json({ success: true })
  } catch (err) {
    console.error("[/api/apply]", err)
    return Response.json({ error: "Failed to submit application." }, { status: 500 })
  }
}
