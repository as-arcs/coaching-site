"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizAnswers {
  firstName: string
  lastName: string
  email: string
  goal: string
  biggestObstacle: string
  trainingDays: string
  priorCoaching: string
}

type FieldKey = keyof QuizAnswers
type QuestionType = "text" | "textarea" | "email" | "radio" | "name"

interface Question {
  id: string
  sectionId: string
  prompt: string
  type: QuestionType
  field: FieldKey | "name"
  options?: string[]
  placeholder?: string
  encouragement: string | Record<string, string>
}

const QUESTIONS: Question[] = [
  {
    id: "goal",
    sectionId: "about",
    prompt: "What are you trying to achieve in 12 weeks?",
    type: "textarea",
    field: "goal",
    placeholder: "Lose 15 lbs, visible abs, get stronger...",
    encouragement: "That's a clear target. Let's build toward it.",
  },
  {
    id: "biggestObstacle",
    sectionId: "process",
    prompt: "What's your biggest obstacle right now?",
    type: "text",
    field: "biggestObstacle",
    placeholder: "No time, injury, don't know where to start...",
    encouragement: "Good to know. We'll build around it.",
  },
  {
    id: "priorCoaching",
    sectionId: "results",
    prompt: "Worked with a coach before?",
    type: "radio",
    field: "priorCoaching",
    options: ["Yes", "No", "Sort of"],
    encouragement: { Yes: "Good — you know the drill.", No: "Clean slate.", "Sort of": "Fair enough." },
  },
  {
    id: "name",
    sectionId: "mid-cta",
    prompt: "What's your name?",
    type: "name",
    field: "name",
    encouragement: "",
  },
  {
    id: "email",
    sectionId: "transformation",
    prompt: "And your email?",
    type: "email",
    field: "email",
    placeholder: "your@email.com",
    encouragement: "You're set.",
  },
  {
    id: "trainingDays",
    sectionId: "pricing",
    prompt: "How many days a week can you train?",
    type: "radio",
    field: "trainingDays",
    options: ["2–3 days", "3–4 days", "4–5 days", "5+ days"],
    encouragement: "Got it. Your schedule shapes everything.",
  },
]

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

function isAnswered(q: Question, answers: QuizAnswers): boolean {
  if (q.field === "name") return !!(answers.firstName && answers.lastName)
  return !!(answers[q.field as FieldKey])
}

interface Props {
  answers: QuizAnswers
  onAnswer: (updates: Partial<QuizAnswers>) => void
}

export function ScrollQuiz({ answers, onAnswer }: Props) {
  const [sectionsSeen, setSectionsSeen] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [encouragementFor, setEncouragementFor] = useState<string | null>(null)
  const [completionDismissed, setCompletionDismissed] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const activeQuestion = useMemo(() => {
    for (const q of QUESTIONS) {
      if (sectionsSeen.has(q.sectionId) && !isAnswered(q, answers) && !dismissed.has(q.id)) {
        return q
      }
    }
    return null
  }, [sectionsSeen, dismissed, answers])

  const cardQuestion = encouragementFor
    ? (QUESTIONS.find(q => q.id === encouragementFor) ?? null)
    : activeQuestion

  // Sync local inputs when a new question becomes active or encouragement ends
  useEffect(() => {
    if (!activeQuestion || encouragementFor) return
    if (activeQuestion.type === "name") {
      setFirstName(answers.firstName || "")
      setLastName(answers.lastName || "")
    } else {
      setInputValue(answers[activeQuestion.field as FieldKey] || "")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion?.id, encouragementFor])

  // Observe section entries
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSectionsSeen(prev => {
              if (prev.has(entry.target.id)) return prev
              return new Set([...prev, entry.target.id])
            })
          }
        })
      },
      { threshold: 0.2 }
    )
    QUESTIONS.forEach(q => {
      const el = document.getElementById(q.sectionId)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function triggerEncouragement(id: string) {
    setEncouragementFor(id)
    setTimeout(() => setEncouragementFor(null), 1700)
  }

  function handleTextSubmit() {
    if (!activeQuestion || !inputValue.trim()) return
    onAnswer({ [activeQuestion.field as FieldKey]: inputValue.trim() })
    setInputValue("")
    triggerEncouragement(activeQuestion.id)
  }

  function handleRadioSelect(value: string) {
    if (!activeQuestion) return
    onAnswer({ [activeQuestion.field as FieldKey]: value })
    triggerEncouragement(activeQuestion.id)
  }

  function handleNameSubmit() {
    if (!firstName.trim() || !lastName.trim()) return
    onAnswer({ firstName: firstName.trim(), lastName: lastName.trim() })
    triggerEncouragement("name")
  }

  function handleDismiss() {
    if (activeQuestion && !encouragementFor) {
      setDismissed(prev => new Set([...prev, activeQuestion.id]))
    }
  }

  function getEncouragement(): string {
    if (!encouragementFor) return ""
    const q = QUESTIONS.find(q => q.id === encouragementFor)
    if (!q) return ""
    if (q.type === "name") return `Good to meet you, ${answers.firstName || firstName}.`
    if (typeof q.encouragement === "object") {
      const val = answers[q.field as FieldKey]
      return q.encouragement[val] ?? ""
    }
    return q.encouragement
  }

  const answeredCount = QUESTIONS.filter(q => isAnswered(q, answers)).length
  const allAnswered = answeredCount === QUESTIONS.length
  const showCompletion = allAnswered && !encouragementFor && !completionDismissed

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.06] pointer-events-none">
        <motion.div
          className="h-full bg-[#c9a84c]"
          animate={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      {/* Floating card */}
      <AnimatePresence>
        {showCompletion ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed z-50 bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] md:left-auto md:translate-x-0 md:right-6 md:w-72"
          >
            <div className="bg-[#1a1410] rounded-[2rem] border border-[#c9a84c]/20 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(201,168,76,0.08)] p-6 overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a84c]">All set</p>
                <button
                  onClick={() => setCompletionDismissed(true)}
                  className="text-[#f0ece4]/25 hover:text-[#f0ece4]/50 transition-colors -mt-0.5 -mr-0.5"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[#f0ece4] text-sm font-medium leading-snug mb-4">
                Your application is pre-filled. Ready to submit?
              </p>
              <button
                onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full bg-[#c9a84c] text-[#110e0a] text-[11px] tracking-[0.18em] uppercase font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#d4b060] transition-colors"
              >
                Apply Now <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="flex gap-1 mt-4 pt-3.5 border-t border-white/[0.06]">
                {QUESTIONS.map(q => (
                  <div key={q.id} className="h-[2px] flex-1 bg-[#c9a84c] rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>
        ) : cardQuestion ? (
          <motion.div
            key={cardQuestion.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed z-50 bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] md:left-auto md:translate-x-0 md:right-6 md:w-72"
          >
            <div className="bg-[#1a1410] rounded-[2rem] border border-[#c9a84c]/20 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(201,168,76,0.08)] p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a84c]">Quick question</p>
                {!encouragementFor && (
                  <button
                    onClick={handleDismiss}
                    className="text-[#f0ece4]/25 hover:text-[#f0ece4]/50 transition-colors -mt-0.5 -mr-0.5"
                    aria-label="Skip question"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {encouragementFor ? (
                  <motion.p
                    key="enc"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#f0ece4]/75 text-sm leading-relaxed min-h-[2.5rem] flex items-center"
                  >
                    {getEncouragement()}
                  </motion.p>
                ) : (
                  <motion.div
                    key="q"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#f0ece4] text-sm font-medium leading-snug mb-4">
                      {cardQuestion.prompt}
                    </p>

                    {cardQuestion.type === "textarea" && (
                      <div className="flex items-end gap-2">
                        <textarea
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleTextSubmit()
                            }
                          }}
                          placeholder={cardQuestion.placeholder}
                          rows={2}
                          autoFocus
                          className="flex-1 bg-transparent border-b border-white/[0.2] py-2 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                        />
                        <button
                          onClick={handleTextSubmit}
                          disabled={!inputValue.trim()}
                          className="pb-2 text-[#c9a84c] disabled:opacity-25 transition-opacity flex-shrink-0"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {(cardQuestion.type === "text" || cardQuestion.type === "email") && (
                      <div className="flex items-center gap-2">
                        <input
                          type={cardQuestion.type}
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") handleTextSubmit() }}
                          placeholder={cardQuestion.placeholder}
                          autoFocus
                          className="flex-1 bg-transparent border-b border-white/[0.2] py-2 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                        />
                        <button
                          onClick={handleTextSubmit}
                          disabled={!inputValue.trim()}
                          className="pb-2 text-[#c9a84c] disabled:opacity-25 transition-opacity flex-shrink-0"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {cardQuestion.type === "radio" && cardQuestion.options && (
                      <div className="flex flex-wrap gap-2">
                        {cardQuestion.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleRadioSelect(opt)}
                            className="border border-white/[0.2] rounded-full px-4 py-1.5 text-xs tracking-wide text-[#f0ece4]/75 hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors duration-200"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {cardQuestion.type === "name" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="First"
                            autoFocus
                            className="bg-transparent border-b border-white/[0.2] py-2 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                          />
                          <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleNameSubmit() }}
                            placeholder="Last"
                            className="bg-transparent border-b border-white/[0.2] py-2 text-[#f0ece4] text-sm placeholder:text-[#f0ece4]/35 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                          />
                        </div>
                        <button
                          onClick={handleNameSubmit}
                          disabled={!firstName.trim() || !lastName.trim()}
                          className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] disabled:opacity-25 transition-opacity"
                        >
                          Continue <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress segments */}
              <div className="flex gap-1 mt-4 pt-3.5 border-t border-white/[0.06]">
                {QUESTIONS.map(q => (
                  <div
                    key={q.id}
                    className={cn(
                      "h-[2px] flex-1 rounded-full transition-all duration-500",
                      isAnswered(q, answers) ? "bg-[#c9a84c]" : "bg-white/[0.1]"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
