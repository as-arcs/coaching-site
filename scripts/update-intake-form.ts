import { google } from "googleapis"

const FORM_ID = "1FfUKdK_Py_NfnOc7lVSyILEoNMHHWWMjMztW-Pn6M0M"

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/forms.body"],
  })
}

function shortAnswer(title: string, required = false) {
  return { title, questionItem: { question: { required, textQuestion: { paragraph: false } } } }
}

function longAnswer(title: string, required = false) {
  return { title, questionItem: { question: { required, textQuestion: { paragraph: true } } } }
}

function radio(title: string, options: string[], required = false) {
  return {
    title,
    questionItem: {
      question: {
        required,
        choiceQuestion: { type: "RADIO", options: options.map((v) => ({ value: v })) },
      },
    },
  }
}

function checkbox(title: string, options: string[], required = false) {
  return {
    title,
    questionItem: {
      question: {
        required,
        choiceQuestion: { type: "CHECKBOX", options: options.map((v) => ({ value: v })) },
      },
    },
  }
}

function scale(title: string, low: number, high: number, lowLabel: string, highLabel: string, required = false) {
  return {
    title,
    questionItem: { question: { required, scaleQuestion: { low, high, lowLabel, highLabel } } },
  }
}

function section(title: string, description = "") {
  return { title, description, pageBreakItem: {} }
}

const NEW_ITEMS = [
  // ── Basics ──────────────────────────────────────────────────────────────
  section("Basics"),
  shortAnswer("Full name", true),
  shortAnswer("Email address", true),
  shortAnswer("Age", true),
  radio("How long have you been training consistently?", [
    "Under 1 year",
    "1–2 years",
    "2–4 years",
    "4+ years",
  ], true),
  longAnswer("What does your current program look like? (If none, say so.)"),
  shortAnswer("Approximate lifts — squat / bench / deadlift / overhead press (write 'not sure' if you don't track)"),

  // ── Goals & Activity ────────────────────────────────────────────────────
  section("Goals & Activity"),
  checkbox("What are your primary fitness goals? (Select all that apply)", [
    "Lose body fat",
    "Build muscle / gain size",
    "Increase strength",
    "Improve body composition (recomp)",
    "Other",
  ], true),
  radio("How would you rate your current physical activity level?", [
    "Sedentary (little to no exercise)",
    "Lightly active (1–2x per week)",
    "Moderately active (3–4x per week)",
    "Very active (5+ times per week)",
  ], true),
  scale("How many days per week can you realistically dedicate to training (30+ min)?", 0, 7, "0 days", "7 days", true),

  // ── Training Setup ──────────────────────────────────────────────────────
  section("Training Setup"),
  radio("What equipment do you have access to?", [
    "Full access to a commercial gym",
    "Home gym with some equipment (describe in next question)",
    "Bodyweight only",
  ], true),
  longAnswer("Describe your schedule constraints — which days and times can you actually train? Any weeks you travel or have irregular schedules?", true),

  // ── Nutrition & Lifestyle ───────────────────────────────────────────────
  section("Nutrition & Lifestyle"),
  longAnswer("Describe your current eating habits — diet approach, how many meals, any restrictions or allergies.", true),
  radio("How many hours of sleep do you typically get per night?", [
    "Under 6 hours",
    "6–7 hours",
    "7–8 hours",
    "8+ hours",
  ], true),
  scale("How would you rate your current stress level?", 1, 5, "Very low", "Very high"),
  shortAnswer("Height"),
  shortAnswer("Current weight"),
  shortAnswer("Goal weight (or describe the physique you're going for if weight isn't the metric)"),

  // ── History & Preferences ───────────────────────────────────────────────
  section("History & Preferences"),
  longAnswer("Do you have any existing medical conditions, injuries, or chronic pain I should know about?"),
  longAnswer("What programs, diets, or approaches have you tried before? List them.", true),
  longAnswer("What worked, even partially? What definitely didn't — and why?", true),
  longAnswer("Have you worked with a coach before? If yes, what did that look like and why did it end?"),
  longAnswer("What do you NOT want? Foods you won't eat, movements you hate, approaches that have burned you before.", true),

  // ── Wrap-up ─────────────────────────────────────────────────────────────
  section("Wrap-up"),
  checkbox("What time of day do you prefer to train?", [
    "Early morning (5–9 AM)",
    "Midday (10 AM–2 PM)",
    "Afternoon (3–6 PM)",
    "Evening (7–10 PM)",
  ]),
  checkbox("What time of day works best for weekly check-ins?", [
    "Morning",
    "Afternoon",
    "Evening",
    "Flexible",
  ]),
  longAnswer("Anything else you want me to know before our call?"),
]

async function main() {
  const auth = getAuth()
  const forms = google.forms({ version: "v1", auth })

  // Get current form to find all existing item IDs
  console.log("Fetching current form...")
  const current = await forms.forms.get({ formId: FORM_ID })
  const items = current.data.items ?? []
  console.log(`Found ${items.length} existing items`)

  // Delete all existing items in reverse order
  const deleteRequests = items
    .map((_, i) => i)
    .reverse()
    .map((index) => ({ deleteItem: { location: { index } } }))

  if (deleteRequests.length > 0) {
    console.log(`Deleting ${deleteRequests.length} existing items...`)
    await forms.forms.batchUpdate({
      formId: FORM_ID,
      requestBody: { requests: deleteRequests },
    })
  }

  // Create all new items
  console.log(`Creating ${NEW_ITEMS.length} new items...`)
  const createRequests = NEW_ITEMS.map((item, index) => ({
    createItem: { item, location: { index } },
  }))

  await forms.forms.batchUpdate({
    formId: FORM_ID,
    requestBody: { requests: createRequests },
  })

  console.log("Done. Form updated successfully.")
}

main().catch((err) => {
  console.error("Error:", err.message ?? err)
  process.exit(1)
})
