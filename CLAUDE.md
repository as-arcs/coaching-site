# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev       # or: npm run dev  — start dev server (localhost:3000)
bun run build # production build
bun run lint  # eslint
```

No test suite exists. `scripts/update-intake-form.ts` is a one-off script for programmatically building the Google Form used for client intake (run with `bun run scripts/update-intake-form.ts` if it needs re-syncing — it's not part of the build).

Env vars live in `.env.local` (see keys there): Google service account (Sheets/Drive/Docs/Forms), Slack webhook, Anthropic API key, Stripe keys/price IDs, site URL. All required at runtime by the API routes below — there are no fallbacks, so local dev needs a populated `.env.local`.

## Architecture

This is the marketing site + full client lifecycle backend for "The Standard," Amir's 1:1 fitness coaching business (thestandard.coach / jointhestandard.app). Next.js 16 App Router, no database — Google Sheets is the CRM, Google Drive holds client files, Slack is the notification layer.

**Client lifecycle, as a pipeline across API routes (`src/app/api/*/route.ts`):**

1. `apply` — landing page application form → appends row to `Application Form` sheet tab, Slack-notifies. Validated with Zod, rate-limited by IP.
2. `checkout` — Stripe Checkout session creation (subscription mode) for the `join` page's plan selection.
3. `webhook` — Stripe webhook (`checkout.session.completed`) → Slack-notifies of new paying client. Signature-verified against `STRIPE_WEBHOOK_SECRET`.
4. `onboard` — post-payment onboarding agreement (signature, start date, medical disclosures) → appends to `Onboarding` sheet tab, Slack-notifies, and calls `setupClientFolder` to provision the client's Drive folder (Workout Log sheet + Progress Photos / Form Check Videos subfolders).
5. `checkin` — recurring weekly client check-in (bodyweight, adherence, energy, notes) → appends to `Check-ins` sheet tab, Slack-notifies.

Every route follows the same shape: per-IP `rateLimit()` guard → Zod `safeParse` → Google Sheets `values.append` (auth via `google.auth.JWT` service account) → fire-and-forget Slack notify (`.catch` logged, doesn't block the response). Sheet tab names/ranges are hardcoded per route (`Application Form!A:I`, `Onboarding!A:J`, `Check-ins!A:F`) — if the sheet structure changes, these strings and the corresponding tab must move together.

**Supporting libs (`src/lib/`):**
- `slack.ts` — one `notifyX` function per lifecycle event, all posting to the same webhook with a 5s abort timeout.
- `drive.ts` — Google Drive/Docs helpers (`createClientFolder`, `setupClientFolder`, `createGoogleDoc`); shares the JWT auth pattern with the API routes but is not deduplicated into a shared helper.
- `plan-generator.ts` — calls Claude (`claude-sonnet-4-6`) to generate a pre-call brief from application data. Client-provided fields are wrapped in `<client_data>` tags with an explicit prompt-injection guard telling the model not to treat that content as instructions — preserve this pattern if adding other LLM calls that embed user input.
- `rate-limit.ts` — in-memory sliding-window limiter, explicitly per-instance/not distributed (documented tradeoff in the file — fine for current traffic, would need Redis/Upstash if abuse becomes coordinated across instances).
- `analytics.ts` — thin wrapper around `@vercel/analytics` `track()`.

**Frontend:** `src/app/page.tsx` renders `components/landing-page.tsx` (large single-file landing page) plus `components/scroll-quiz.tsx` and `components/hero/archetype-selector.tsx` for the interactive quiz-style hero. `join/`, `onboard/`, `checkin/` are the corresponding form pages for steps 2/4/5 above. `components/ui/*` are shadcn-style primitives (button/input/textarea).

**Pricing/plans:** two tiers, `standard` and `premium`, referenced by that literal string across `checkout`, `webhook`, `onboard`, and Slack messages — Stripe price IDs are looked up from env by that key. Keep the plan key consistent if adding a tier.

## Notes from AGENTS.md

The Next.js version pinned here (16.2.6) is newer than what's likely in training data — check `node_modules/next/dist/docs/` for current API/convention before assuming App Router behavior from memory.
