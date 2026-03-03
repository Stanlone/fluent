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
```

Values live in `.env.local` (local dev) and Vercel dashboard (production). Nowhere else.

If you ever see a secret value in any `.md` file, stop immediately and flag it before committing.

---

## What This Product Is

[FILL IN — one paragraph. What the product does, who it is for, what it must feel like. Include any key distinctions between user types if there are multiple.]

---

## Stack

- **Framework:** Next.js 14 (App Router) — server components by default, client components marked `'use client'`
- **Database + Auth:** Supabase
- **Deployment:** Vercel — auto-deploys main + PR previews
- **AI:** [FILL IN — model name, what it is used for]
- **Styling:** Tailwind CSS

### Auth Pattern
[FILL IN — how users are identified, role system, where roles are stored]

### Environment Variables (names only — values in .env.local and Vercel dashboard)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
[FILL IN — any additional env vars for this project]
```

---

## Visual System — exact values only

| Element | Value |
|---|---|
| Background | [FILL IN e.g. `#F9F7F4`] |
| Primary text | [FILL IN e.g. `#1A1A1A`] |
| Primary accent | [FILL IN e.g. `#6366F1`] |
| Secondary accent | [FILL IN — if any] |
| Layout | [FILL IN e.g. `max-w-2xl mx-auto px-6`] |
| Font | [FILL IN e.g. Inter] |
| Dark / light mode | [FILL IN] |

[FILL IN — rules about when colours appear, what they mean, what is off-limits]

---

## Navigation Conventions

[FILL IN — e.g. never use `useRouter()`, always use plain `<a href>` tags or `window.location.href`]

---

## Role Check Pattern

[FILL IN — how to check user role safely, with fallback]

---

## Key Patterns & Conventions

[FILL IN — recurring patterns specific to this project that Code must always follow]

---

## Database Tables

[FILL IN — one entry per table, listing all columns with types and notes]

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

[FILL IN as files are created — list important files and what each does. Update this section whenever a file is added, renamed, or deleted.]

```
app/
  layout.tsx          — root layout
  page.tsx            — [FILL IN]
lib/
  supabase/           — Supabase client helpers
```

---

## Before You Finish Any Task

Ask yourself: **"[FILL IN — the guiding question for this product's users]"**

If the answer is no, or if you're unsure — stop and flag it.
