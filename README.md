# DealState

DealState is a synthetic, source-backed opportunity centre for private-market deal teams. It maintains derived investment state rather than free-form summaries.

## Run locally

Prerequisites: Node.js 22 or later, npm and gitleaks.

Three steps to a running app:

```bash
npm ci
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open `http://localhost:3000/opportunities/project-nova`.

## Verification

```bash
npm run validate
```

```bash
npm run build
```

## Data source

`USE_SUPABASE=false` uses validated YAML in `data/` through `SeedRepository` and requires no external service. To swap to Postgres, apply `supabase/migrations/0001_init.sql`, seed equivalent rows, set the two public Supabase variables in a local or Vercel environment, and set `USE_SUPABASE=true`. The browser receives only a publishable key; never expose a secret or service-role key.

## Synthetic boundary

All Project Nova entities, metrics, sources and outputs are synthetic and centralised under `data/` and `content/demo/`. `TODO(init):` marks replaceable pass-1 material and configuration.
