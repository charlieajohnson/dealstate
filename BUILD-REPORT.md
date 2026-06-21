# DealState Initial Build Report

Date: 21 June 2026

## 1. Built

### Repository

- Standalone public Git repository with nine logical commits on `main`.
- Exact dependency pins, strict TypeScript, committed lockfile and a gitleaks-enforced pre-commit hook.
- Three-step local run path and documented seed-to-Supabase switch.
- Decision log, implementation plan and current-source list.

### Backend and integrity

- Nine centralised YAML seed files parsed through Zod before every build.
- Fact validation enforces at least one citation for `kind: fact`.
- Pure state, diff and scoring functions with Vitest coverage.
- Project Nova derives Overall 61 and source coverage 46 from seed inputs.
- Deterministic opportunity-manager interface with six source-cited prompts and graceful out-of-scope handling.
- Optional Supabase repository boundary plus a generated migration covering the domain model, explicit read grants and read-only RLS.

### Frontend

- Landing, opportunities index, dynamic opportunity route, Project Nova demo, generated-output routes and methodology.
- Project Nova modules: current state, provenance, conflicts, latest changes, open issues, nine-dimension scorecard, actions, chat, document checklist, suggested requests, contacts, timeline, outputs and audit trail.
- Three generated Markdown outputs with source appendices.
- Light and dark dusk themes with a light default, Fraunces display, Geist Sans UI and Geist Mono numerals.
- Generated blue-hour estuary hero image, stored as an optimised 55 KB WebP. The original generated PNG and dashboard concept are retained for review.
- Responsive two-column workspace with internal table scrolling on narrow screens.

### Deploy

- GitHub integration connected to Vercel.
- Production runs from seed with `USE_SUPABASE=false` and no paid service dependency.
- Production alias: <https://dealstate-zeta.vercel.app>

## 2. Verified

| Command or check | Result |
|---|---|
| `npm ci` | Passed in Vercel clean build environment, 522 packages installed. |
| `npm run validate-data` | Passed, 9 YAML files validated. |
| `npm run lint:copy` | Passed, 33 files checked; no em dashes or italic markup. |
| `npm run typecheck` | Passed with strict TypeScript. |
| `npm run lint` | Passed with no warnings or errors. |
| `npm test` | Passed, 3 files and 5 tests. |
| `npm run build` | Passed, Next.js 15.5.19 compiled and generated 13 static pages. |
| HTTP smoke: `/`, `/opportunities`, `/opportunities/project-nova`, onboarding output, `/methodology` | All returned 200. |
| Browser interaction | Project Nova rendered with no console errors; suggested prompt returned cited `doc_002`, `doc_003` and `issue_002`. |
| Mobile browser check at 390 by 844 | One-column workspace verified; internal tables scroll without expanding the page. |
| Lighthouse landing | Performance 96, accessibility 100. |
| Lighthouse Project Nova | Performance 98, accessibility 100. |
| `vercel inspect` | Production deployment Ready and aliased to `dealstate-zeta.vercel.app`. |
| `gitleaks` pre-commit | Passed before every commit. |

Visual QA compared `docs/design/dashboard-concept.png` with the production render at 1280 by 720. Copy, two-column hierarchy, type system, dusk palette, provenance treatment, score 61, coverage 46 and responsive stacking match the accepted design. The implementation uses greater vertical spacing than the concept to preserve legibility. No material mismatch remains.

## 3. Open items

- `needs-secret` - Supabase provisioning was not possible because the CLI has no access token. Needed: authenticate with `npx supabase login` or set `SUPABASE_ACCESS_TOKEN`. Why: only required to create and migrate the optional hosted database; the deployed demo does not use it.

## 4. Next commands

The current seed deployment is already live. To provision the optional database:

```bash
npx supabase login
```

```bash
npx supabase projects create dealstate --org-id <ORG_ID> --region eu-west-2
```

```bash
npx supabase link --project-ref <PROJECT_REF>
```

```bash
npx supabase db push
```

Then add the project URL and publishable key to Vercel, complete the `TODO(init):` aggregate hydration in `SupabaseRepository`, seed the tables and set `USE_SUPABASE=true`.

## 5. URLs

- Repository: <https://github.com/charlieajohnson/dealstate>
- Live: <https://dealstate-zeta.vercel.app>
- Demo: <https://dealstate-zeta.vercel.app/opportunities/project-nova>
