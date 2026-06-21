# DealState Initial Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the synthetic Project Nova DealState demo from validated, source-backed seed data.

**Architecture:** Next.js 15 App Router renders seed data through an `OpportunityRepository`; pure functions derive state, diffs and scores. Supabase is an optional repository implementation backed by an authored read-only schema, while pass 1 runs with `USE_SUPABASE=false`.

**Tech Stack:** Next.js 15, React 19, strict TypeScript, Tailwind CSS 4, Zod 3, Recharts 2, react-markdown 9, Vitest 4, Supabase Postgres, Vercel.

---

### Task 1: Bootstrap and project contract

**Files:** `package.json`, configuration, `README.md`, `.env.example`, `.githooks/pre-commit`, `docs/decisions.md`

- [ ] Pin exact current versions within the specified majors.
- [ ] Add strict typecheck, lint, test, data validation, copy lint and build scripts.
- [ ] Configure the secret-scanning pre-commit hook.
- [ ] Verify install, typecheck and lint, then commit `Bootstrap DealState application`.

### Task 2: Dusk design system and shell

**Files:** `app/layout.tsx`, `app/globals.css`, `styles/tokens.css`, navigation and footer components

- [ ] Implement both authoritative dusk themes and a no-flash toggle.
- [ ] Add Fraunces, Geist Sans and Geist Mono with numerals forced to mono.
- [ ] Verify shell rendering and commit `Add dusk application shell`.

### Task 3: Validated seed and pure domain engine

**Files:** `data/*.yaml`, `lib/schemas.ts`, repository modules, state/scoring/chat tests and implementations

- [ ] Write failing state, diff, source coverage, scoring and chat tests.
- [ ] Add Zod schemas and complete synthetic seed files.
- [ ] Implement the seed repository and pure state, diff, scoring and mock-chat engines.
- [ ] Prove the tests, `validate-data`, Overall 61 and coverage 46, then commit `Build validated opportunity state engine`.

### Task 4: Opportunity workspace

**Files:** opportunity route and dashboard components

- [ ] Render Project Nova’s computed state, provenance, latest changes, issues, nine score dimensions and actions.
- [ ] Render thin opportunity empty states and the opportunities index.
- [ ] Smoke-check the routes and commit `Build opportunity workspace`.

### Task 5: Documents, chat and outputs

**Files:** document checklist, chat client, generated outputs and Markdown content

- [ ] Show received, missing, superseded and requested artefacts with reasons.
- [ ] Make all suggested prompts deterministic and source-cited with graceful fallback.
- [ ] Open onboarding, market-map and theme-paper outputs with source appendices.
- [ ] Verify interactions and commit `Add documents chat and generated outputs`.

### Task 6: Timeline and audit context

**Files:** timeline, audit trail, contacts and meeting components

- [ ] Render chronological actor, type and source-linked events.
- [ ] Add contacts and upcoming meetings.
- [ ] Verify the bottom band and commit `Add opportunity timeline and audit context`.

### Task 7: Landing and methodology

**Files:** landing, methodology, SEO routes and generated estuary asset

- [ ] Implement the blue-hour landing page and concise product wedge.
- [ ] Explain derived state, provenance, score direction and synthetic limitations.
- [ ] Verify copy and accessibility structure, then commit `Add landing and methodology pages`.

### Task 8: Supabase, deploy and handback

**Files:** Supabase migration, `vercel.json`, `BUILD-REPORT.md`

- [ ] Author explicit grants, read-only RLS and the repository adapter.
- [ ] Run the full fresh verification suite, route smoke tests and Lighthouse.
- [ ] Create GitHub and Vercel projects, deploy with seed mode, inspect production and record exact evidence.
- [ ] Commit `Document verified initial build`, push `main`, and report any genuinely unavailable external resource.
