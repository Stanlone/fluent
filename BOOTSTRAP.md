# BOOTSTRAP.md — How to Start a New Project

Read this file when starting a project that does not yet exist. This is the only time you read BOOTSTRAP.md. Once the project is running, switch to WORKFLOW.md.

---

## Before Touching Anything

Read these in order:

1. **This file** — BOOTSTRAP.md
2. **WORKFLOW.md** — process rules you will follow for the entire project
3. **CLAUDE.md** — technical constants (mostly empty at this stage — you will fill it)
4. **The project brief** — provided by the user in the chat

If any of these are missing or unclear, stop and ask before proceeding.

---

## Step 1 — Understand the Brief

Read the brief fully. Then ask the user to confirm:

- What is the product called?
- Who are the users and what are their key differences (if multiple)?
- What is the core problem being solved?
- What is the tech stack? (default: Next.js 14 App Router + Supabase + Vercel + Tailwind)
- What is the visual direction? (dark / light / colours / fonts)
- What must the product never do? (tone rules, emotional rules, off-limits features)
- What is explicitly out of scope for the first build?

Do not proceed until you have clear answers to all of these. If the brief already answers them — confirm with the user and move on.

---

## Step 2 — Create the Repo From Template

Use the GitHub template to copy all three doc files automatically:

```bash
gh repo create [project-name] --template [owner]/project-template --private --clone
cd [project-name]
git checkout main 2>/dev/null || git checkout -b main
```

The third line is a safety net — it ensures `main` is the working branch even if the newly created repo's HEAD resolves differently. All subsequent steps require `main`.

Do not run `git init` — the clone already initialises git and sets the remote. Do not recreate BOOTSTRAP.md, WORKFLOW.md, or CLAUDE.md — they are copied from the template.

Confirm the three files exist before continuing.

---

## Step 3 — Secrets and Gitignore First

Before any `npm install` or file creation, write `.gitignore`:

```
# Dependencies
node_modules/

# Environment secrets — NEVER commit these
.env
.env.local
.env*.local

# MCP config contains service role keys — NEVER commit
.cursor/mcp.json
mcp.json
.mcp.json

# Supabase local
supabase/.temp/
.supabase/

# Next.js
.next/
out/

# Vercel
.vercel/

# Misc
.DS_Store
*.pem
```

Commit and push immediately, before anything else touches the repo. Then set GitHub's server-side default branch to `main`:

```bash
git add .gitignore
git commit -m "chore: gitignore"
git push origin main
gh repo edit --default-branch main
```

The `gh repo edit` call aligns GitHub's default branch with the local branch name. Run it once — it is a no-op if `main` is already the default.

**Rule:** `.env.local` and any `mcp.json` must never appear in `git status` as untracked after this point. If they do, stop and fix `.gitignore` before proceeding.

**Note:** direct pushes to `main` are permitted throughout the bootstrap phase. Branch protection is enabled in Step 11, after all bootstrap commits are complete.

---

## Step 4 — Set Up Supabase

```bash
supabase login        # skip if already authenticated
supabase projects create [project-name] --region [region] --db-password [strong-password]
supabase init
```

Get the project URL, anon key, and service role key from the Supabase dashboard.

**Secrets rule:** Add key values to `.env.local` only. Add key NAMES (not values) to CLAUDE.md under Environment Variables. Never paste a key value into any `.md` file or commit it anywhere.

Write the MCP config (if using Supabase MCP) to `.cursor/mcp.json` or `mcp.json` — these are gitignored. Never commit them.

---

## Step 5 — Set Up Vercel

```bash
vercel login          # skip if already authenticated
vercel link --yes --project [project-name]
```

The `--yes` flag suppresses interactive prompts. If Vercel asks for team scope, add `--scope [team-slug]`.

Connect to the GitHub repo in the Vercel dashboard. Enable auto-deploy on push to `main`. Add all environment variables in Vercel dashboard → Settings → Environment Variables.

---

## Step 6 — Scaffold the Project

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
npm install @supabase/supabase-js @supabase/ssr
```

Create `.env.local` with all required environment variable values. Verify `.env.local` does not appear in `git status` — it must be gitignored.

---

## Step 7 — Create the Database Schema

Write the full SQL migration based on the brief. Save to `supabase/migrations/[timestamp]_initial_schema.sql`.

Apply to Supabase — this is the one bootstrap exception where a direct DB write is permitted, because the PR workflow has not yet started:

```bash
supabase db push
```

Enable RLS on every table. Write policies immediately — never leave a table without RLS. Document every table in CLAUDE.md under Database Tables.

After bootstrap is complete, all future schema changes must go through PRs. The human applies them post-merge via Supabase MCP or CLI. Claude Code never runs `supabase db push` again.

---

## Step 8 — Fill CLAUDE.md

Fill all `[FILL IN]` placeholders:

* Stack section — confirmed versions, Supabase project URL (not the key), env var NAMES only
* Visual system — exact hex values, font, layout constants
* Database tables — all tables created in Step 7
* What this product is — one paragraph from the brief
* Guiding question — the question Code asks itself before finishing any task

---

## Step 9 — Create PROJECT.md

Generate `PROJECT.md` in the repo root using this structure:

```markdown
# [PROJECT NAME]
### Single Source of Truth

---

## Build Status — [TODAY'S DATE]

### Completed ✓
— nothing yet —

### Pending — first session
[First set of things to build, derived from the brief]

### Not Started
[Everything else from the brief]

### Known Issues / Tech Debt
— none yet —

---

## Stack
[From CLAUDE.md]

---

## Who This Is For
[From brief — users, differences between user types]

---

## What This Must Never Do
[From brief — tone rules, emotional rules, off-limits features]

---

## Database Schema
[All tables created in Step 7]

---

## Key Changes
— none yet —
```

---

## Step 10 — Final Bootstrap Commit to Main

Run the build check before committing:

```bash
npm run lint && npm run build
```

Fix any errors before continuing. Do not commit a broken scaffold.

Commit and push everything:

```bash
git add .
git commit -m "chore: project bootstrap"
git push origin main
```

This is the last direct push during bootstrap. Branch protection is enabled in the next step. All future changes go through feature branches and PRs — no exceptions.

Confirm Vercel deploys successfully. The deploy must be green before proceeding to Step 11.

---

## Step 11 — Repo Hardening

Enable branch protection on `main` immediately after the bootstrap push. Run from inside the project directory — `{owner}` and `{repo}` are expanded automatically by the `gh` CLI from the current git remote:

```bash
gh api "repos/{owner}/{repo}/branches/main/protection" \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  --input - << 'EOF'
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

`required_status_checks: null` means no CI gate is required right now — protection still blocks direct pushes and force pushes. When a CI workflow is added later, update to: `"required_status_checks": {"strict": true, "contexts": ["your-check-name"]}`

This enforces:

* No direct pushes to `main` — PRs required for all future changes
* No force pushes
* No branch deletion
* Stale PR approvals dismissed on new commits

Confirm protection is active:

```bash
gh api "repos/{owner}/{repo}/branches/main/protection" \
  -q '.enforce_admins.enabled'
```

Expected output: `true`

---

## Step 12 — Hand Off to WORKFLOW.md

Bootstrap is complete. All future work follows WORKFLOW.md exclusively.

The first real task brief is written by Claude.ai Chat using the process in WORKFLOW.md. Claude Code never makes product decisions — only executes briefs.

---

## What Claude Code Never Does During Bootstrap

* Makes product decisions not in the brief
* Chooses colours, fonts, or layouts not specified
* Creates DB tables not in the brief
* Commits `.env.local`, `mcp.json`, or any file containing secret values
* Runs `supabase db push` again after bootstrap is complete
* Pushes directly to `main` after Step 10
* Proceeds past any step with unresolved ambiguity
