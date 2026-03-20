# CLAUDE.md — Engineering Briefing

Read this before every task. This is your permanent technical context.

---

## Document Ownership

- `CLAUDE.md` — technical constants (stack, schema, visual system, key file map). Updated by Code inside the feature branch when constants change.
- `PROJECT.md` — build status, key changes log. Updated by Code inside every feature branch before opening the PR.
- `WORKFLOW.md` — process rules. Updated only by decision of Claude.ai Chat. Never touched independently by Code.
- `BOOTSTRAP.md` — project start rules. Updated only by decision of Claude.ai Chat. Never touched independently by Code.

When a feature changes a DB column, visual constant, or stack constant: update CLAUDE.md and PROJECT.md in the same branch and commit.

---

## Secrets Handling — Non-Negotiable

These files contain secrets and must be in `.gitignore`. They must never appear in any commit:
- `.env.local` — API keys, Supabase anon key, service role key
- `mcp.json`, `.cursor/mcp.json`, `.mcp.json` — Supabase service role key for MCP

**This file lists env var NAMES only, never values.** Example:
```
NEXT_PUBLIC_SUPABASE_URL         ← name only, no value here
NEXT_PUBLIC_SUPABASE_ANON_KEY    ← name only, no value here
SUPABASE_SERVICE_ROLE_KEY        ← name only, no value here
ANTHROPIC_API_KEY                ← name only, no value here
AUTH_USERNAME                    ← name only, no value here
AUTH_EMAIL                       ← name only, no value here
```

Values live in `.env.local` (local dev) and Vercel dashboard (production). Nowhere else.

If you ever see a secret value in any `.md` file, stop immediately and flag it before committing.

---

## What This Product Is

Fluent is a personal word intelligence system for a C1 English speaker with Russian as a native language. It captures words from any context, generates deep word cards (Russian nuance explanation, English usage rules, synonym map, etymology, real examples), and trains retention via spaced repetition. Built for one user who wants depth, not drills.

---

## Stack

- **Framework:** Next.js 14 (App Router) — server components by default, client components marked `'use client'`
- **Database + Auth:** Supabase
- **Deployment:** Vercel — auto-deploys main + PR previews
- **AI:** Claude claude-sonnet-4-20250514 — used to generate all word card content: Russian nuance definitions, English usage explanations, synonym maps with distinctions, etymology, and contextual example sentences.
- **Styling:** Tailwind CSS

### Auth Pattern
Single user. Supabase Auth with email/password. No roles — one account only.

### Environment Variables (names only — values in .env.local and Vercel dashboard)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
AUTH_USERNAME
AUTH_EMAIL
```

---

## Visual System — exact values only

| Element | Value |
|---|---|
| Background | `#FAF9F7` |
| Primary text | `#1A1A1A` |
| Primary accent | `#DA7756` |
| Secondary accent | `#E8E3DC` |
| Layout | `max-w-2xl mx-auto px-6` |
| Font | Inter |
| Dark / light mode | Light only |

Accent `#DA7756` for interactive elements and highlights only. `#E8E3DC` for subtle backgrounds and borders. Never use accent as background. No dark mode in MVP.

---

## Navigation Conventions

Always use plain `<a href>` tags or `window.location.href`. Never use `useRouter()`.

---

## Role Check Pattern

Single user — no roles. Authenticate via Supabase Auth `auth.uid()`. If no session, redirect to login. No role checks needed.

---

## Key Patterns & Conventions

All Claude API calls go through a single server-side route handler at `app/api/generate/route.ts`. Never call the Anthropic API from client components.

---

## Database Tables

**users** — `id` (uuid, PK, default `uuid_generate_v4()`), `email` (text, unique, not null), `created_at` (timestamptz, default `now()`)

**user_preferences** — `id` (uuid, PK, default `uuid_generate_v4()`), `user_id` (uuid, FK → users, not null), `topics` (text[], default `{}`), `sources` (text[], default `{}`), `notification_enabled` (bool, default false), `notification_time` (time, default `'09:00'`)

**words** — `id` (uuid, PK, default `uuid_generate_v4()`), `user_id` (uuid, FK → users, not null), `word` (text, not null), `context` (text), `russian_definition` (text), `english_definition` (text), `synonyms` (jsonb), `etymology` (text), `created_at` (timestamptz, default `now()`)

**reviews** — `id` (uuid, PK, default `uuid_generate_v4()`), `user_id` (uuid, FK → users, not null), `word_id` (uuid, FK → words, not null), `ease_factor` (float, default 2.5), `interval_days` (int, default 1), `repetitions` (int, default 0), `next_review_at` (timestamptz, default `now()`), `last_reviewed_at` (timestamptz)

All tables have RLS enabled. Policies restrict access to `auth.uid() = user_id` (or `auth.uid() = id` for users table).

---

## Supabase MCP Policy

- **During PR work:** read-only — query tables, inspect schema, check data. No writes.
- **Schema migrations:** Claude Code writes the SQL and includes it in the PR description under "DB CHANGES REQUIRED". The human applies it post-merge via Supabase MCP or CLI.
- **Bootstrap exception:** `supabase db push` is run once during BOOTSTRAP Step 7, before the PR workflow begins. This is the only time Claude Code may write to the live DB directly.

---

## Repo Hardening

Branch protection on `main` is enabled during BOOTSTRAP Step 11, immediately after the final bootstrap commit. It enforces:
- No direct pushes to `main` — PRs required for all changes
- No force pushes
- No branch deletion
- Stale PR approvals dismissed on new commits

If branch protection is not active on `main`, raise it with the user immediately before doing any work.

---

## Git Rules

- `main` = production (live on Vercel)
- No `stage` branch. No `prod` branch.
- Cut feature branches from `main`, PR back to `main`
- **Never push directly to `main`** — direct pushes were only permitted during the bootstrap phase (BOOTSTRAP Steps 3–10). Branch protection is active from Step 11 onward.
- Every PR must have a Vercel preview URL

---

## Commit Convention

```
feat: new user-facing feature
fix: bug fix
docs: changes to CLAUDE.md, PROJECT.md, or documentation only
chore: maintenance, dependency updates, no user-facing change
```

---

## Tools Available

- **GitHub MCP:** Use to read doc files at session start. Use `gh pr create --base main` for PRs.
- **Supabase MCP:** Read-only during PRs. See Supabase MCP Policy above.
- **Vercel MCP:** Read deployments and pull preview URLs during PR review.

---

## Pre-commit Rules — non-negotiable

1. Run `npm run lint && npm run build` before every commit. Never commit code that fails either.
2. Before submitting: open every screen the PR touches and verify all documented UI elements still render correctly.
3. After adding or renaming a DB table, grep the entire codebase for the old name and update every reference.
4. For any file modified, check: "what else imports or uses this file?" Verify those files still work.
5. If files were added, renamed, or deleted in this PR, update the Key File Map in this file before committing.

---

## Key File Map

```
middleware.ts           — session gate (redirects unauthenticated to /login)
app/
  layout.tsx            — root layout
  page.tsx              — home / word input + card display
  globals.css           — global styles, visual system colors
  login/
    page.tsx            — login page (username + password)
  components/
    WordCard.tsx        — word card display component
  api/
    auth/
      login/
        route.ts        — server-side login handler
    generate/
      route.ts          — server-side Claude API handler
lib/
  supabase/
    server.ts           — Supabase server client helper (@supabase/ssr)
```

---

## Before You Finish Any Task

Ask yourself: **"Would a C1 speaker find this useful or would they find it condescending?"**

If the answer is no, or if you're unsure — stop and flag it.
