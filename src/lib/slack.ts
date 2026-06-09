interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  goal: string
  trainingDays?: string
  biggestObstacle?: string
  priorCoaching?: string
}

export async function notifyNewApplication(data: ApplicationData): Promise<void> {
  const lines = [
    `🟢 New application: *${data.firstName} ${data.lastName}*`,
    `Email: ${data.email}`,
    `Goal: ${data.goal}`,
    `Training days: ${data.trainingDays || "—"} | Obstacle: ${data.biggestObstacle || "—"} | Prior coaching: ${data.priorCoaching || "—"}`,
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
