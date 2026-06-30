# DealState Pass 2 Build Report

Date: 30 June 2026
Branch: `codex/pass-2-foundations`
Repository: `https://github.com/charlieajohnson/dealstate`

## What Exists

| Stage | Built |
|---|---|
| Foundations | Extended zod schemas for tenancy, raw artefacts, segments, extraction, retrieval, grounded answers and eval cases. Added prompt registry, versioned prompts and traced structured LLM client with input-hash cache. |
| Tenancy and RLS | Added `20260630090000_pass2_foundations.sql` with firm, fund, membership and pipeline tables, RLS enabled and forced, broad synthetic policies dropped, and deterministic policy tests. |
| Ingestion | Added `SourceAdapter`, in-memory ingestion runner, content-hash dedupe, supersession marking and typed Gmail adapter stub that fails closed until OAuth credentials are present. |
| Parsing and extraction | Added deterministic segment parser, citation-span verification and candidate materialisation into existing `Fact` records while preserving same-key conflicts. |
| Retrieval and grounding | Added hybrid retrieval fusion helper with firm and deal filters, plus grounded-answer validation that abstains when cited segments are absent. |
| Evals | Added Project Nova fixtures, gold labels, `scripts/eval.ts`, `npm run eval` and persisted latest offline report. |
| UI contract | Preserved `OpportunityRepository`, seed data, state engine, scoring, deterministic mock chat and existing routes. No dashboard component changes were required. |

## Verification

| Command | Result |
|---|---|
| `npm ci` | Passed. Installed 516 packages from lockfile. npm reported existing deprecation and audit noise: 3 vulnerabilities, 1 low and 2 moderate. |
| `npm view @supabase/supabase-js version && npm view next version && npm view zod version && npm view vitest version && npm view openai version && npm view xlsx version && npm view mailparser version && npm view pdf-parse version` | Passed. Latest observed versions: Supabase JS 2.110.0, Next 16.2.9, zod 4.4.3, Vitest 4.1.9, openai 6.45.0, xlsx 0.18.5, mailparser 3.9.12, pdf-parse 2.4.5. Current repo pins remain unchanged except new scripts. |
| `npx vitest run lib/pass2-schemas.test.ts lib/citations.test.ts lib/prompts/registry.test.ts lib/llm/client.test.ts lib/security/tenant-policy.test.ts scripts/eval.test.ts` | Initial red run failed on missing pass-2 modules and migration. After implementation, the lib-targeted set passed; script test discovery was then added to Vitest config. |
| `npx vitest run lib/ingest/source-adapter.test.ts lib/ingest/gmail.test.ts lib/parse/segments.test.ts lib/extract/materialise.test.ts lib/retrieve/hybrid.test.ts lib/generate/grounding.test.ts` | Initial red run failed on missing modules. Final run passed: 6 files, 9 tests. |
| `npm run eval` | Passed. Overall score 61, source coverage 46, ARR conflict preserved, deterministic abstention true, cost USD 0, p50 latency 0 ms, p95 latency 0 ms. |
| `npm run validate` | Passed. `validate-data` validated 9 YAML files. `lint:copy` passed across 36 files. `typecheck` passed. `next lint` passed with the two pre-existing accepted `<img>` warnings. `test` passed: 21 files, 33 tests. |
| `npm run build` | Passed. Re-ran the full validation chain, compiled Next.js 15.5.19 successfully, generated 12 static or dynamic app routes and collected build traces. |
| `gitleaks protect --staged --redact --exit-code 1` | Passed. Scanned 78.39 KB of staged content with no leaks found. |
| `npx vercel --yes` | Passed. Created and deployed Vercel project `dealstate-pass2`, deployment `dpl_Hff5QyuWBL3N5sXQQaRYzVN9AuUR`, ready state `READY`. Remote build ran `npm ci`, `npm run build`, validation and 33 tests. |
| Remote HTTP smoke | Passed. HTTP 200 for `https://dealstate-pass2.vercel.app/`, `/opportunities/project-nova` and `/methodology`. |

## Eval Thresholds

| Gate | Threshold | Result |
|---|---:|---:|
| Citation verification | 100% | 100% in deterministic citation tests |
| Grounding faithfulness | 100% for offline supported claims | 100% in grounded-answer validation |
| Abstention correctness | 100% for offline unanswerable prompt | 100% |
| Cost ceiling | USD 0 for offline CI eval | USD 0 |
| p50 latency ceiling | 0 ms for offline CI eval | 0 ms |
| p95 latency ceiling | 0 ms for offline CI eval | 0 ms |

## Deploy State

The GitHub PR has a successful `Vercel - dealstate` deployment check and one still-pending generic `Vercel` status at the time this report was last updated. A manual non-interactive Vercel deploy also succeeded, but it created a separate Vercel project named `dealstate-pass2` rather than attaching to the existing `dealstate-zeta` production project.

- Manual deployment: `https://dealstate-pass2.vercel.app`
- Inspect URL: `https://vercel.com/charlieajohnson/dealstate-pass2/Hff5QyuWBL3N5sXQQaRYzVN9AuUR`

## Open Items

- `needs-secret` - Supabase branch database credentials and service role key. Needed to apply `supabase/migrations/20260630090000_pass2_foundations.sql`, run live RLS negative tests and persist ingestion state.
- `needs-secret` - Gmail OAuth client id, client secret, redirect URI and token encryption key. Needed to complete live mailbox sync. Current adapter fails closed with `TODO(pass2): Gmail OAuth credentials and encrypted token storage are required for live sync.`
- `needs-secret` - Model API key plus `MODEL_PROVIDER`, `MODEL_ID` and `EMBEDDING_MODEL_ID`. Needed to replace fixture-backed/offline model behaviour with live structured extraction, embeddings and grounded generation.
- `needs-account` - Gmail API project with approved scopes for mailbox history, message bodies and attachments. Needed before a real test mailbox can sync.
- `needs-decision` - Whether to keep or delete the separately created Vercel `dealstate-pass2` project. It deploys successfully, but it is not the existing public `dealstate-zeta` project.
- `needs-decision` - Whether to keep the current text-based `.xlsx` eval fixtures as deterministic placeholders for phase gates, or replace them with binary XLSX fixtures before parser hardening.
- `needs-decision` - Whether to split the current branch into separate phase PRs or keep this as one foundations PR. The current branch covers Phase 0 plus deterministic interfaces for Phases 1 to 3, but not live external provisioning.

## Next Commands

```bash
cd /Users/charlie/Documents/GitHub/dealstate-pass2
```

```bash
npm run validate
```

```bash
npm run eval
```

After secrets are available:

```bash
npx supabase link --project-ref <PROJECT_REF>
```

```bash
npx supabase db push
```

```bash
MODEL_PROVIDER=<provider> MODEL_ID=<model> EMBEDDING_MODEL_ID=<embedding-model> npm run eval -- --live
```

## URLs

- Repository: `https://github.com/charlieajohnson/dealstate`
- Current public demo: `https://dealstate-zeta.vercel.app`
- Pass-2 manual deployment: `https://dealstate-pass2.vercel.app`
- Pull request: `https://github.com/charlieajohnson/dealstate/pull/1`
- Local working clone: `/Users/charlie/Documents/GitHub/dealstate-pass2`

## Open Checklist

- [ ] Add Supabase branch database credentials and service role key.
- [ ] Add Gmail OAuth credentials and token encryption key.
- [ ] Add model and embedding provider credentials.
- [ ] Approve Gmail API scopes for the test mailbox.
- [ ] Decide whether to keep or delete the separate Vercel `dealstate-pass2` project.
- [ ] Decide whether to replace placeholder `.xlsx` fixtures with binary XLSX files before parser hardening.
- [ ] Decide whether to split this branch into phase PRs or keep one foundations PR.
