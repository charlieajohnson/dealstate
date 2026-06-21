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
