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
