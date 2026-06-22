# DealState Aesthetic and Messaging Overhaul Report

Date: 22 June 2026

## 1. Built

### Repository

- Updated the standalone DealState app in `/Users/charlie/Documents/GitHub/dealstate`.
- Added a review concept at `docs/design/aesthetic-overhaul-concept.png`.
- Recorded material decisions in `docs/decisions.md`.
- Kept the existing Next.js 15, strict TypeScript, Tailwind CSS v4, Zod, Vitest and Vercel stack.

### Frontend

- Reworked the landing page around the supplied Dusk Institutional Intelligence spec.
- Replaced “one live view” positioning with “one live state” in the hero, metadata and Open Graph image.
- Added a code-native Project Nova product vignette above the fold, showing investment state, provenance, changed-since-last-review, conflict state and open issues.
- Added the core distinction, state loop, workspace preview, state surfaces, trust model and final Project Nova CTA sections.
- Reworked `/opportunities/project-nova` into a three-column deal-room surface: left workspace rail, central investment state and right rail for changes, chat, materials, outputs and contacts.
- Added a claims ledger showing support, conflict and unsupported review state.
- Reworked `/opportunities` into a deal pipeline/state list with Project Nova, Project Atlas and Project Fen.
- Reworked `/methodology` as the audit rules behind state derivation.
- Improved mobile hero performance by replacing the estuary image with a dusk gradient at small breakpoints while preserving the product vignette and map-line treatment.

### Backend and synthetic data

- Preserved the pure state engine, scoring engine, deterministic mock chat and Zod validation.
- Added non-required synthetic source records so Project Nova presents as 14 sources, 5 open issues, 5 missing/requested items and 2 superseded materials without changing the required artefact coverage calculation.
- Preserved Project Nova Overall 61 and source coverage 46.
- Updated deterministic chat copy to include unsupported EBITDA add-backs.
- Supabase migration and repository boundary remain scaffolded but optional; runtime still defaults to `USE_SUPABASE=false`.

### Deploy

- Production target remains Vercel free tier with seed data.
- Production alias is verified Ready at <https://dealstate-zeta.vercel.app>.
- Final deploy was run with `npx vercel --prod --yes` from the latest pushed `main` at handback.

## 2. Verified

| Command or check | Result |
|---|---|
| `npm run build` | Passed. This ran `validate-data`, `lint:copy`, `typecheck`, `lint`, `test` and `next build`. |
| `npm run validate-data` | Passed inside build, 9 YAML files validated. |
| `npm run lint:copy` | Passed inside build, 35 files checked with no em dashes or italic markup. |
| `npm run typecheck` | Passed inside build with strict TypeScript. |
| `npm run lint` | Passed inside build with no ESLint warnings or errors. |
| `npm run test` | Passed inside build, 3 files and 5 tests. |
| Static generation | Passed, 12 app routes generated or configured. |
| HTTP smoke via Python `urllib` | Passed, 200 for `/`, `/opportunities`, `/opportunities/project-nova`, `/methodology`, and `/opportunities/project-nova/outputs/onboarding-brief`. |
| Browser QA, landing desktop | Passed. Headline, product vignette, open issues and no horizontal overflow verified. |
| Browser QA, Project Nova desktop | Passed. State summary, source coverage 46, score 61, claims ledger, materials statuses, cited chat answer and no horizontal overflow verified. |
| Browser QA, mobile 390 by 844 | Passed. Landing and Project Nova key content present with no horizontal overflow. |
| Suggested chat prompt | Passed. “What changed since I last looked?” returns the deterministic answer with `DOC_002`, `DOC_003` and `ISSUE_002`. |
| Visual concept inspection | Completed with `view_image` on `docs/design/aesthetic-overhaul-concept.png`. |
| Render inspection | Completed with `view_image` on `/tmp/dealstate-home-final.png` and `/tmp/dealstate-project-nova-top.png`. |
| Lighthouse landing, mobile preset | Performance 96, accessibility 100. |
| Lighthouse landing, desktop preset | Performance 100, accessibility 100. |
| Lighthouse Project Nova, mobile preset | Performance 96, accessibility 96. |
| Lighthouse Project Nova, desktop preset | Performance 100, accessibility 96. |
| `npx vercel --prod --yes` | Passed. Remote build ran `npm ci`, validation, tests and Next build, then aliased production. |
| Remote HTTP smoke | Passed, 200 for `/`, `/opportunities`, `/opportunities/project-nova`, `/methodology`, and `/opportunities/project-nova/outputs/onboarding-brief`. |
| Live browser QA | Passed on `dealstate-zeta.vercel.app`: landing headline, vignette, Project Nova score 61, coverage 46 and no horizontal overflow verified. |
| `npx vercel inspect` | Production deployment is Ready and aliased. |
| `npx vercel logs --since 1h` | 13 info logs, all observed requests 200, no error logs in the sampled window. |

Fidelity ledger:

- Copy: implemented “One live state for every deal” and removed the old “one live view” language from primary surfaces.
- Layout: hero now pairs editorial claim with live Project Nova product theatre; workspace now follows the left rail, main state and right rail structure.
- Palette: moved to colder Dusk Institutional tokens from the supplied spec.
- Provenance: key metric cards, claims ledger and chat answers retain citation, inference or unsupported treatment.
- Responsive behaviour: mobile uses a lighter dusk gradient for performance, retains the product proof and avoids horizontal overflow.

Intentional deviations:

- Runtime UI uses the existing synthetic Euro-denominated Project Nova seed rather than the spec’s illustrative Sterling examples.
- Hero animation is CSS state motion rather than a video loop because no real approved video asset exists and CSS avoids a new dependency.
- The mobile hero uses a generated gradient rather than the estuary image to meet Lighthouse performance while preserving the dusk mood.

## 3. Open items

- `needs-secret` - Supabase provisioning is still blocked because the CLI has no access token. Needed: authenticate with `npx supabase login` or set `SUPABASE_ACCESS_TOKEN`. Why: only required to create and migrate the optional hosted database; the deployed demo runs from seed data with `USE_SUPABASE=false`.

## 4. Next commands

The seed deployment remains the live path. To provision the optional database:

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
