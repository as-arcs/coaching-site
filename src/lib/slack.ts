interface ClientData {
  email: string
  plan: string
}

export async function notifyNewClient(data: ClientData): Promise<void> {
  const planLabel = data.plan === "premium" ? "Premium ($200/mo)" : "Standard ($130/mo)"
  const lines = [
    `💳 New paying client: *${data.email}*`,
    `Plan: ${planLabel}`,
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  plan: string
  startDate: string
}

export async function notifyOnboardingComplete(data: OnboardingData): Promise<void> {
  const planLabel = data.plan === "premium" ? "Premium ($200/mo)" : "Standard ($130/mo)"
  const lines = [
    `✅ *Onboarding agreement signed: ${data.firstName} ${data.lastName}*`,
    `Email: ${data.email}`,
    `Plan: ${planLabel} · Start: ${data.startDate}`,
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

interface CheckinData {
  email: string
  bodyweight: number
  adherence: number
  energy: number
  notes?: string
}

export async function notifyWeeklyCheckin(data: CheckinData): Promise<void> {
  const lines = [
    `📋 Weekly check-in — *${data.email}*`,
    `Weight: ${data.bodyweight} lbs | Adherence: ${data.adherence}/5 | Energy: ${data.energy}/5`,
    `Notes: ${data.notes?.trim() || "none"}`,
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  goal?: string
  trainingDays?: string
  trainingExperience?: string
  equipment?: string
  injuries?: string
  stage?: "contact" | "complete"
}

export async function notifyNewApplication(data: ApplicationData): Promise<void> {
  const lines = data.stage === "contact"
    ? [
        `📅 New contact scheduling a call: *${data.firstName} ${data.lastName}*`,
        `Email: ${data.email}`,
      ]
    : [
        `🟢 New application: *${data.firstName} ${data.lastName}*`,
        `Email: ${data.email}`,
        `Goal: ${data.goal}`,
        `Experience: ${data.trainingExperience || "—"} | Days: ${data.trainingDays || "—"} | Equipment: ${data.equipment || "—"}`,
        `Injuries/medical: ${data.injuries || "—"}`,
      ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}
