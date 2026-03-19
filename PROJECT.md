# Fluent
### Single Source of Truth

---

## Build Status — 2026-03-15

### Completed ✓
- Filled CLAUDE.md and PROJECT.md with product brief, visual system, DB schema, and conventions
- Created initial DB schema migration (users, user_preferences, words, reviews with RLS)
- Built server-side Claude API route for word card generation (`app/api/generate/route.ts`)

### Pending — first session
- Chrome extension: highlight word → create card
- Card library in web app (list view)
- Basic spaced repetition review flow
- Mobile-friendly PWA layout

### Not Started
- Voice accent audio (US/UK/AU)
- Full interests and sources feed
- Push notifications
- User onboarding flow

### Known Issues / Tech Debt
— none yet —

---

## Stack

- **Framework:** Next.js 14 (App Router) — server components by default, client components marked `'use client'`
- **Database + Auth:** Supabase
- **Deployment:** Vercel — auto-deploys main + PR previews
- **AI:** claude-sonnet-4-20250514 — word card generation
- **Styling:** Tailwind CSS

---

## Who This Is For

Single user. C1 English speaker, native Russian. Advanced learner who wants depth, nuance, and etymology — not beginner explanations or gamification.

---

## What This Must Never Do

- Explain words as if the user is a beginner
- Use gamification: no streaks, badges, points, or progress bars
- Use patronising encouragement ("Great job!", "You're doing amazing!")
- Suggest words the user didn't ask about
- Show ads or upsells

---

## Database Schema

**users** — `id` (uuid, PK), `email` (text, unique), `created_at` (timestamptz)

**user_preferences** — `id` (uuid, PK), `user_id` (uuid, FK → users), `topics` (text[]), `sources` (text[]), `notification_enabled` (bool, default false), `notification_time` (time, default '09:00')

**words** — `id` (uuid, PK), `user_id` (uuid, FK → users), `word` (text), `context` (text), `russian_definition` (text), `english_definition` (text), `synonyms` (jsonb), `etymology` (text), `created_at` (timestamptz)

**reviews** — `id` (uuid, PK), `user_id` (uuid, FK → users), `word_id` (uuid, FK → words), `ease_factor` (float, default 2.5), `interval_days` (int, default 1), `repetitions` (int, default 0), `next_review_at` (timestamptz), `last_reviewed_at` (timestamptz)

All tables have RLS enabled with policies restricting access to `auth.uid()`.

---

## Key Changes

### 2026-03-15
- Filled all [FILL IN] placeholders in CLAUDE.md (product description, AI stack, auth pattern, env vars, visual system, navigation, role check, key patterns, DB tables, key file map, guiding question)
- Filled all [FILL IN] placeholders in PROJECT.md (who this is for, what this must never do, build status, DB schema)
- Created initial DB schema migration: `supabase/migrations/20260315000000_initial_schema.sql`

### 2026-03-19
- Added `app/api/generate/route.ts` — POST route that takes `{ word, context }`, calls Claude claude-sonnet-4-20250514, returns structured word card JSON (pronunciation, synonyms, etymology, examples, Russian/English definitions)
