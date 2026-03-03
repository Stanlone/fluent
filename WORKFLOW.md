# WORKFLOW.md — How We Build

Read this at the start of every working session.

---

## SESSION START — read this first, every time

Before touching any code, do this in order:

1. **Sync the repo**

```bash
git fetch origin && git checkout main && git pull origin main
```

Confirm you are on `main` and it is up to date before proceeding.

2. **Branch names**
   * `main` = production (live on Vercel)
   * Cut all feature branches from `main`, PR back to `main`
   * No `prod` branch. No `stage` branch.

3. **Read these files** using the GitHub MCP (repo: [owner/repo], branch: main)
   * `PROJECT.md` — what this product is, who the users are, what it must never do
   * `WORKFLOW.md` — this file. Branching, task brief format, process rules
   * `CLAUDE.md` — stack details, file structure, DB schema, visual constants

4. **Supabase**
   * Supabase MCP is connected — project URL + service role key in local mcp.json (gitignored, never committed)
   * During PR work: read-only — query and inspect tables only
   * Schema changes: Claude Code writes the SQL in the PR description; human applies post-merge

5. **Vercel**
   * Every PR gets a Vercel preview URL before merging to `main`
   * Never push directly to `main`

Do not write a single line of code until steps 1–3 are complete.

---

## The Four Tools and What Each Does

| Tool | Purpose | Never |
|---|---|---|
| **Claude.ai chat** | Strategy, product decisions, diagnosis, writing task briefs | Write or touch code |
| **Claude Code** | Execute task briefs, open PRs | Make product decisions, invent solutions |
| **GitHub** | Single source of truth, PR review, history | Direct pushes to main |
| **Vercel** | Preview every PR, production deployment | — |

**The rule:** Anything requiring judgement comes to Claude.ai chat first. Claude Code only executes what chat has already decided.

---

## Session Start Ritual

Every new Claude Code session begins with:

*"Read PROJECT.md, WORKFLOW.md, and CLAUDE.md from GitHub repo [owner/repo] branch main using the GitHub MCP."*

---

## Process Guardian Rules — Claude.ai Chat Must Always Do This

Claude.ai holds the process even when the user doesn't. These rules are non-negotiable:

**1. Flag process breaks immediately**
If the user asks for something that skips or breaks the process, say so explicitly before doing anything:
> "⚠️ This would skip [specific step]. The correct process is: [one sentence]. Do you want to proceed anyway or follow the process?"

Never silently go along with a process break.

**2. Always remind the process before writing a task brief**
Before handing any task brief to the user, always show the correct flow:
> "Here's the process for this task:
> 1. [HTML playground if needed / skip if not]
> 2. Give this brief to Claude Code in a new session
> 3. Claude Code opens a PR — bring the PR number back here
> 4. I check CI + Vercel preview, give you the link
> 5. You test, come back with: merge or fix"

**3. Require explicit permission to break process**
If the user insists on skipping a step, require a clear confirmation:
> "Understood. Just to confirm — you want to skip [step] this time. Type 'yes, skip it' to proceed."

Never assume permission. Always get it explicitly.

**4. Flag product rule violations immediately**
If a requested feature would violate the rules in PROJECT.md ("What This Must Never Do"), say:
> "⚠️ This would [specific violation]. The rule is: [rule]. Do you want to reconsider?"

---

## How to Write a Claude Code Task Brief

Every brief follows this exact structure:

```
Read PROJECT.md, WORKFLOW.md, and CLAUDE.md from the main branch on GitHub using the GitHub MCP before doing anything.

TASK: [one sentence — what this does]

CONTEXT: [FILL IN per project — who the users are, tone rules, what must never happen, the guiding question to ask before finishing]

[What to build or fix — specific, unambiguous]

[File names, exact variable names, exact error text if a bug fix]

[Visual specs — exact Tailwind classes, exact colours, exact sizes. Never describe intent.]

DB CHANGES REQUIRED: [exact SQL, or "none"]
Note: Claude Code does NOT apply DB changes. Write the SQL here. Human applies post-merge.

When done:
- Update PROJECT.md in this branch:
    - Add bullet to Completed ✓ describing what was built/fixed
    - Add entry under Key Changes — [today's date]
    - Update Database Schema section if any DB columns changed
- Update CLAUDE.md in this branch if this PR changes
  DB schema, stack constants, visual constants, or Key File Map entries
- Run npm run lint && npm run build — fix all errors before committing
- Commit everything with "[feat/fix/docs/chore]: [what changed]"
- Open a PR to main
- Do not modify WORKFLOW.md or BOOTSTRAP.md inside this branch

If anything is unclear or unspecified, stop and ask before proceeding. Do not make assumptions.

DO NOT TOUCH: [list every file or behaviour that must not change]
Do not modify WORKFLOW.md or BOOTSTRAP.md inside this branch.
```

---

## Brief Writing Rules — Claude.ai Chat

These rules govern how Chat writes every brief. Non-negotiable.

### Step 1 — Before writing anything, answer these questions:

**Split or single?** If the task touches more than one concern (UI + logic, UI + DB, logic + schema) — split into separate briefs. One brief = one concern. Never bundle unrelated changes.

**HTML prototype first?** Any new screen, new component, or visual change not already pixel-specified in PROJECT.md requires an HTML prototype built and approved in Chat first. Brief is written after approval, with exact specs extracted from the prototype.

Skip prototype only when: bug fix with known cause, logic-only change, or the visual spec is already exact and complete.

**DB migration involved?** If yes — include the exact SQL under "DB CHANGES REQUIRED". State explicitly that Claude Code does NOT apply it. Human applies post-merge.

### Step 2 — Writing the brief

**Visual specs — exact code only, never intent:**
* ✅ `bg-[#1B2A4A]` — ❌ "navy background"
* ✅ `max-w-2xl mx-auto px-6` — ❌ "narrow centred layout"
* ✅ `text-[#F5A623]` — ❌ "amber text"

If you cannot write the exact Tailwind class or pixel value, build the HTML prototype first. No exceptions.

**Name exact files:**
* ✅ `app/dashboard/player/page.tsx`
* ❌ "the dashboard component"

**Name exact elements:**
* ✅ "the `<main>` div wrapping the card list"
* ❌ "the container"

**Name exact variables:**
* ✅ `ease_factor`
* ❌ "the ease field"

**DO NOT TOUCH list must be exhaustive.** List every file not mentioned in the task. List every behaviour that must survive unchanged.

**Always include as the final line:**
```
Do not modify WORKFLOW.md or BOOTSTRAP.md inside this branch.
```

**Closing block is mandatory in every brief:**
```
When done:
- Update PROJECT.md in this branch:
    - Add bullet to Completed ✓ describing what was built/fixed
    - Add entry under Key Changes — [today's date]
    - Update Database Schema section if any DB columns changed
- Update CLAUDE.md in this branch if this PR changes
  DB schema, stack constants, visual constants, or Key File Map entries
- Run npm run lint && npm run build — fix all errors before committing
- Commit everything with "[feat/fix/docs/chore]: [what changed]"
- Open a PR to main
- Do not modify WORKFLOW.md or BOOTSTRAP.md inside this branch
```

### Step 3 — What Chat never does in a brief

* Describes visual intent instead of exact code
* Leaves any decision to Code
* Bundles two concerns into one brief
* Writes a brief for something that needed a prototype first
* Omits the CONTEXT block
* Omits the closing block
* Omits the DO NOT TOUCH list

---

## When to Use HTML Playground First

**Use HTML playground when:**
* Designing a new screen from scratch
* Testing an animation or transition
* Experimenting with layout before committing
* Anything where you're not sure what it should look like yet

**Skip HTML playground when:**
* Bug fix with a known cause
* Logic or database change only
* The visual spec in PROJECT.md is already precise enough

**How it works:**
1. Ask Claude.ai: "Build me an HTML prototype of [screen]"
2. Review in browser — Chat renders HTML directly
3. Iterate here until it looks right
4. Write the Claude Code brief with exact specs extracted from the approved prototype

---

## PR Review — What to Do When Claude Code Opens a PR

When Claude Code tells you a PR is ready:

1. **Come to this chat** and say: "PR #[number] is ready"
2. **Chat will immediately:**
   * Check CI status via GitHub MCP — green or red
   * Pull the Vercel preview URL via Vercel MCP
   * Flag anything that looks wrong
3. **You open the preview link** and test
4. **You come back here** and say: merge or fix
5. If fix — one sentence what's wrong, Chat writes the fix brief

---

## Error Handling Protocol

When something breaks:

1. **Stop immediately** — do not touch the code
2. **Screenshot or copy** the exact error message
3. **Bring it here** — paste error + screenshot
4. **Chat diagnoses** and writes a precise fix brief
5. **Claude Code fixes** — new commit on same PR or new PR

**Never:**
* Try to fix code yourself
* Ask Claude Code to "just fix it" without a precise brief
* Merge a PR with a known issue to fix later

---

## Scope Control Rule

Every brief ends with an explicit DO NOT TOUCH list. Be specific. "DO NOT TOUCH the card flip animation" beats "DO NOT TOUCH other screens."

---

## Ambiguity Rule

If Claude Code hits something unclear mid-task — stop and ask rather than invent.

Enforced by: "If anything is unclear or unspecified, stop and ask before proceeding. Do not make assumptions." — in every brief, every time.

---

## Document Ownership

| File | Owned by | Updated when |
|---|---|---|
| BOOTSTRAP.md | Claude.ai Chat | Only by explicit Chat decision, via PR |
| WORKFLOW.md | Claude.ai Chat | Only by explicit Chat decision, via PR |
| CLAUDE.md | Claude Code | Inside feature branch when technical constants change |
| PROJECT.md | Claude Code | Inside every feature branch before opening PR |

WORKFLOW.md and BOOTSTRAP.md are never modified inside a feature branch under any circumstances.

---

## Commit Convention

```
feat:  new user-facing feature
fix:   bug fix
docs:  changes to CLAUDE.md, PROJECT.md, or documentation only
chore: maintenance, dependency updates, no user-facing change
```

---

## End of Session

PROJECT.md and CLAUDE.md are updated by Code inside the feature branch before opening the PR. They merge to `main` together with the feature code — no separate step.

WORKFLOW.md and BOOTSTRAP.md are updated only by decision of Claude.ai Chat. Chat writes the exact text of changes and gives a brief to Code to execute via PR.

The repo is always the source of truth.
