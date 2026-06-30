# Decisions

Append-only record for the initial build.

## 2026-06-21

- **Repository:** use a standalone sibling repository at `GitHub/dealstate`; the planning workspace remains separate.
- **Layout:** retain the build-spec’s top-level App Router layout rather than introducing `src/`, reducing path depth in a small application.
- **Components:** use focused feature components and small native controls; reject shadcn/Radix because pass 1 needs no complex workspace primitive.
- **Seed shape:** use one YAML file per aggregate with a `TODO(init):` header marking centralised synthetic content.
- **State:** preserve every conflicting fact and select the most recent value for display while surfacing all conflicts as risks and diffs.
- **Coverage:** calculate source coverage as 60% required-document coverage plus 40% key-metric provenance; Project Nova’s seed intentionally computes to 46.
- **Versions:** keep every mandated core technology within the requested major even where newer majors exist; pin the latest registry release in that major on 2026-06-21.
- **Supabase:** author explicit read-only grants and RLS following the April 2026 Data API exposure change; seed mode remains the deploy default.
- **Visual concept:** use the supplied design spec as the accepted source of truth, supported by a generated dashboard concept and a generated estuary production asset.
- **Scoring:** all dimensions are favourability scores, including risk mitigation; Overall is a rounded weighted mean.

## 2026-06-22

- **Aesthetic:** shift from the prior dusk editorial page to the colder Dusk Institutional system in the supplied UI update spec: dusk estuary atmosphere, ivory product cards, mono provenance labels, visible conflicts and a product-led hero.
- **Messaging:** replace “one live view” with “one live state” across the primary page and metadata because the product wedge is derived investment state, not document viewing.
- **Hero:** implement the Project Nova product theatre as code-native UI over the existing estuary asset rather than shipping a screenshot or adding a video dependency.
- **Seed data:** add non-required synthetic source records to reach 14 visible sources while preserving the required artefact denominator and Project Nova source coverage score of 46.
- **Workspace:** favour a three-column deal-room layout with left navigation, central investment state and right-side changes/materials over a broad dashboard grid.

## 2026-06-30

- **Site URL:** resolve the canonical origin in one place (`lib/site.ts`) for `metadataBase` and the sitemap, with precedence override, then `VERCEL_PROJECT_PRODUCTION_URL`, then a local default. This fixes Open Graph and Twitter image URLs that previously resolved to `http://localhost:3000` in production, and removes the inconsistent `dealstate.vercel.app` sitemap fallback that did not match the live alias.
- **Decorative images:** keep the raw `<img>` elements in the hero and atelier sections. They are full-bleed, source-less (`alt=""`) tableau backgrounds tuned with bespoke CSS; the two `next/lint` warnings are accepted because `next/image` would change layout behaviour for no measurable gain against current Lighthouse scores.
- **First connector:** use Gmail with attachments behind `SourceAdapter`. Recommendation: start with email ingestion because diligence narrative and document artefacts both arrive there. Why: it preserves the real evidence flow while keeping Drive and CRM additive. Rejected: Drive first, which is cleaner but misses email-native intake; CRM first, which is structured but low document volume. Failure modes: Gmail quota, large attachments and OAuth approval. Next action: complete the OAuth path when credentials are available.
- **Retrieval:** use Supabase pgvector with hybrid vector, text and metadata ranking. Recommendation: keep retrieval in the Supabase tenant boundary. Why: it avoids state split and keeps RLS enforceable around chunks. Rejected: external vector store, which adds infra and another secret; structured-only retrieval, which loses prose recall. Failure modes: embedding-model drift and index bloat. Next action: version embeddings and re-embed only on content hash or model change.
- **Tenancy and auth:** use Supabase Auth with firm, fund, deal and membership RLS from pass 2. Recommendation: deny by default, then grant explicit tenant policies. Why: product foundations need enforced isolation before real data. Rejected: deferring auth, because it would force every query path to be rewritten later. Failure modes: missing policy or broad demo policy leaks data. Next action: apply the pass-2 migration to a branch database and run live negative RLS tests.
- **Model provider:** use a provider-agnostic client with `MODEL_ID` and `EMBEDDING_MODEL_ID` in env. Recommendation: route extraction and generation through structured, traced calls. Why: evals stay portable and every call records prompt, model, cost, latency and input hash. Rejected: direct provider calls at call sites. Failure modes: schema non-conformance and cache poisoning. Next action: wire the live provider transport and keep one schema-repair retry before failing closed.
