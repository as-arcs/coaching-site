"use client"

import { useState } from "react"

function RatingSelector({
  value,
  onChange,
  label,
  lowLabel,
  highLabel,
}: {
  value: number | null
  onChange: (v: number) => void
  label: string
  lowLabel: string
  highLabel: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: "#1A1410" }}>
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: value === n ? "#D4A017" : "#EAE1D4",
              color: value === n ? "#1A1410" : "#7A6A58",
              border: `1px solid ${value === n ? "#D4A017" : "#C8BBAA"}`,
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs" style={{ color: "#7A6A58" }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

export default function CheckinPage() {
  const [email, setEmail] = useState("")
  const [bodyweight, setBodyweight] = useState("")
  const [adherence, setAdherence] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const canSubmit =
    email.trim() &&
    bodyweight.trim() &&
    adherence !== null &&
    energy !== null &&
    !submitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          bodyweight: parseFloat(bodyweight),
          adherence: adherence!,
          energy: energy!,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <div className="text-center max-w-sm">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#EAE1D4", border: "1px solid #D4A017" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#D4A017"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            className="text-2xl font-semibold mb-3"
            style={{ color: "#1A1410", fontFamily: "var(--font-playfair)" }}
          >
            Got it.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#7A6A58" }}>
            Amir will review before your next check-in.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div className="max-w-md mx-auto">
        <div className="mb-10">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#D4A017" }}
          >
            The Standard
          </p>
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: "#1A1410", fontFamily: "var(--font-playfair)" }}
          >
            Weekly Check-In
          </h1>
          <p className="text-sm" style={{ color: "#7A6A58" }}>
            Every Sunday. Takes 2 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "#1A1410" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "#EAE1D4",
                border: "1px solid #C8BBAA",
                color: "#1A1410",
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="bodyweight"
              className="text-sm font-medium"
              style={{ color: "#1A1410" }}
            >
              Fasted bodyweight (lbs)
            </label>
            <input
              id="bodyweight"
              type="number"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="e.g. 185"
              min={50}
              max={500}
              step={0.1}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "#EAE1D4",
                border: "1px solid #C8BBAA",
                color: "#1A1410",
              }}
            />
          </div>

          <RatingSelector
            value={adherence}
            onChange={setAdherence}
            label="How closely did you follow the plan this week?"
            lowLabel="Missed a lot"
            highLabel="Locked in"
          />

          <RatingSelector
            value={energy}
            onChange={setEnergy}
            label="Overall energy & recovery this week?"
            lowLabel="Drained"
            highLabel="Feeling great"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium"
              style={{ color: "#1A1410" }}
            >
              Notes{" "}
              <span style={{ color: "#7A6A58" }}>(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wins, struggles, anything Amir should know..."
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
              style={{
                backgroundColor: "#EAE1D4",
                border: "1px solid #C8BBAA",
                color: "#1A1410",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#C0392B" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-lg text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: "#D4A017",
              color: "#1A1410",
              opacity: canSubmit ? 1 : 0.4,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Submitting…" : "Submit Check-In"}
          </button>
        </form>
      </div>
    </main>
  )
}
