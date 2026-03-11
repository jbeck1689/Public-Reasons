# Project Brief — Practical Reasoning & Language Learning App

**Last updated:** March 10, 2026
**Status:** Phase 4 complete. App is live. Phase 5 in progress.
**Next action:** Build Course 2 content ("Think Before You Decide"), then soft launch with real users.

---

## What This Is

A web-based learning platform that teaches practical reasoning,
rhetorical analysis, and eventually language skills through
interactive, scenario-based sequences. Core design: adversarial
framing — the learner catches tricks, not studies textbooks.

## Phase 1 — Complete

- Registration and login (bcrypt cost 12, JWT sessions, Zod validation)
- Route protection middleware
- Course catalog and course detail pages
- Sequence player (INSTRUCTION, MULTIPLE_CHOICE, FREE_RESPONSE)
- Response submission and progress tracking APIs
- Auto-enrollment on sequence start
- Progress dashboard
- Security checkpoint passed
- Two sequences seeded: The Pressure Play, Rhetorical Devices

## Phase 2 — Complete

- Content import pipeline: `scripts/import-content.ts`
- Zod validation schemas for all 10 step types (Zod 4 compatible)
- Full Course 1: "Don't Get Tricked" — all 8 sequences, 64 steps
- Content production workflow established (LLM generates, developer QAs)
- Security checkpoint passed

## Phase 3 — Complete

### What was built

- **Security headers:** All 7 headers from spec §5.3 added to
  `next.config.mjs` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  X-XSS-Protection, Referrer-Policy, Permissions-Policy).
- **Standalone output:** `output: "standalone"` in next.config for
  Docker/Cloud Run deployment readiness.
- **Rate limiting:** In-memory sliding window rate limiter with four
  tiers: global API (100/min per IP in middleware), login (5/min per
  email in auth.ts), registration (10/hr per IP), submissions (30/min
  per user). Swap for Redis-backed limiter before production.
- **Enrollment verification:** Submit and complete routes now verify
  the user is enrolled in the course that owns the step.
- **Input validation:** Zod validation on submit payload with 10KB
  size limit on responses.
- **Structured logging:** Logger module with pino-compatible interface.
  JSON output with level/message/timestamp. Stack traces stripped in
  production. Drop-in replacement for pino when needed.
- **Accessibility:** ARIA progressbar on sequence progress, radiogroup
  semantics on multiple choice options, aria-live regions for feedback
  announcements, focus management on step navigation, skip-to-content
  link in root layout.
- **LLM evaluator stub:** `src/lib/services/llmEvaluator.ts` with full
  interface contract (EvaluationRequest, EvaluationResult, LlmConfig).
  Throws if called. Submit route checks `step.metadata.llmEnabled` and
  falls back gracefully.
- **LlmConfig schema:** Validation schema added to content.ts for
  step metadata including llmConfig, hints, difficulty, tags.
- **Security checkpoint passed.** All headers verified, rate limiting
  active on all critical endpoints, XSS surface audited (React JSX
  auto-escapes, no dangerouslySetInnerHTML), secrets clean.

### Files changed or added

- `next.config.mjs` — security headers + standalone output
- `src/middleware.ts` — rewritten with global rate limiting + auth
- `src/lib/auth.ts` — login rate limiting added
- `src/app/api/register/route.ts` — registration rate limiting
- `src/app/api/progress/[stepId]/submit/route.ts` — enrollment check,
  Zod validation, size limit, LLM-enabled check, structured logging
- `src/app/api/progress/[stepId]/complete/route.ts` — enrollment check,
  structured logging
- `src/lib/utils/rate-limit.ts` — new: in-memory rate limiter module
- `src/lib/utils/logger.ts` — new: structured logging module
- `src/lib/services/llmEvaluator.ts` — new: LLM evaluator stub
- `src/lib/validations/content.ts` — LlmConfig + StepMetadata schemas
- `src/components/learning/SequencePlayer.tsx` — ARIA + focus management
- `src/components/learning/MultipleChoiceStep.tsx` — radiogroup + aria-live
- `src/components/learning/FreeResponseStep.tsx` — aria-label + aria-live
- `src/app/layout.tsx` — skip-to-content link
- `src/app/(dashboard)/layout.tsx` — main-content id

## Phase 4 — Complete

### What happened

GCP billing account setup was blocked by persistent Google console
bugs. Pivoted to Vercel for deployment. This eliminated Docker,
Cloud Build, Cloud Run, Secret Manager, and all GCP-specific config.

### What was built/changed

- **Deployment platform:** Vercel (free Hobby tier). Auto-deploys
  on push to main from GitHub.
- **Build script:** Updated to `prisma generate && next build`.
- **Removed `output: "standalone"`** from next.config.mjs (not
  needed for Vercel).
- **CSP fix:** Added `'unsafe-inline'` to `script-src` so Next.js
  hydration scripts run. Nonce-based CSP deferred to later hardening.
- **Environment variables:** DATABASE_URL, NEXTAUTH_SECRET,
  NEXTAUTH_URL set in Vercel dashboard.
- **Database seeded to Neon** from Codespaces.
- **Rhetorical Devices course:** Full course built and imported.
  8 sequences, 64 steps. Covers anaphora through real-world
  synthesis. Content file: `content/course-2-rhetorical-devices.json`.

### Live URLs

- Production: https://public-reasons.vercel.app
- GitHub: github.com/jbeck1689/Public-Reasons

### Files still in repo but unused

- `Dockerfile` — kept for future container deployment if needed
- `cloudbuild.yaml` — kept for future GCP migration if needed
- `DEPLOYMENT.md` — GCP-specific, no longer the active deploy path

### Key decisions

- **Vercel over GCP.** Dramatically simpler for soft launch. No
  Docker, no IAM, no billing issues. Free tier covers current needs.
- **GCP not abandoned.** Can revisit if Vercel limits become real.
  Docker and Cloud Build config preserved in repo.
- **CSP loosened for now.** `script-src 'unsafe-inline'` is a real
  tradeoff. Nonce-based CSP is the proper fix, deferred to hardening.

## Key Decisions

- **Vercel for deployment.** Replaced GCP. Free tier, auto-deploy,
  zero infrastructure management.
- **Neon as production database.** Free tier, SSL by default.
- **Skip Redis for production.** In-memory rate limiting for soft launch.
- **Skip admin UI.** Import pipeline replaces it.
- **LLM as primary content engine.** Developer is learner/QA, not author.
- **Practical reasoning first.** Other domains come after Course 1.
- **Zod 4 in use.** Project uses Zod 4.3.6.
- **tsx over ts-node.** Standalone scripts use `npx tsx`.
- **App name:** Still undecided.

## Infrastructure

- Code: github.com/jbeck1689/Public-Reasons
- Database: Neon PostgreSQL (free tier)
- Deployment: Vercel (free Hobby tier)
- Development: GitHub Codespaces

## Stack

Next.js 14+, TypeScript, PostgreSQL, Prisma, NextAuth v4, Tailwind,
Zustand, Zod 4. Vercel for deployment. Neon for database.

## Content Status

| Course | Sequences | Steps | Status |
|--------|-----------|-------|--------|
| Don't Get Tricked | 8 | 64 | Live |
| Rhetorical Devices | 8 | 64 | Live |
| Think Before You Decide | 0 | 0 | Next |

Known issue: Pressure Play sequence may have duplicate steps from
seed script. Re-run Course 1 import to fix if needed.

Orphaned sequence `intro-rhetorical-devices` from seed script may
still exist in database. Harmless, clean up when convenient.

## What's NOT Built Yet

- Course 2: "Think Before You Decide" content (Phase 5, next)
- User feedback mechanism (Phase 5)
- Soft launch with real users (Phase 5)
- Custom domain (optional)
- Nonce-based CSP to replace unsafe-inline (hardening)
- LLM-powered feedback on free responses (Phase 6)

## Documents in This Project

| Document | Purpose |
|----------|---------|
| PROJECT-BRIEF.md | This file. Master summary. |
| learning-app-spec.md | Technical architecture, data model, API, security. |
| content-framework.md | Content strategy, courses, step patterns, tiers. |
| deployment-pipeline.md | Phased build plan, costs, LLM integration plan. |
| reasoning-prototype.jsx | Working prototype: The Pressure Play. |
| sequence-player-prototype.jsx | Working prototype: Rhetorical Devices. |
| PROJECT-INSTRUCTIONS.md | How Claude should work with the developer. |
| DEPLOYMENT.md | GCP setup guide, Cloud Run deployment steps. |
