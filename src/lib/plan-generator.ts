import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface ApplicationData {
  firstName: string
  lastName: string
  goal: string
  trainingDays?: string
  biggestObstacle?: string
  priorCoaching?: string
}

export async function generatePreCallBrief(data: ApplicationData): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are Amir's coaching assistant. Based on this coaching application, write a concise pre-call brief that Amir can scan before his 20-minute discovery call.

Application:
- Name: ${data.firstName} ${data.lastName}
- Goal: ${data.goal}
- Training days per week: ${data.trainingDays || "not specified"}
- Biggest obstacle: ${data.biggestObstacle || "not specified"}
- Prior coaching: ${data.priorCoaching || "not specified"}

Write the brief in plain text with four clearly labeled sections. No markdown formatting — just clean text.

CLIENT SNAPSHOT
Who this person is and what they want, based on what they wrote. One short paragraph.

LIKELY TRAINING DIRECTION
Given their goal and available training days, what split structure makes sense. Keep it directional, not prescriptive — this is pre-call.

WATCH-OUTS
Flags to probe: unrealistic expectations, experience gaps, anything in their obstacle that suggests a potential fit issue or retention risk.

DISCOVERY CALL FOCUS
3-4 specific questions to ask on the call. Things not answered in the application that would materially change the approach.

Be direct. This is a working brief for Amir, not client-facing copy.`,
      },
    ],
  })

  return message.content[0].type === "text" ? message.content[0].text : ""
}
