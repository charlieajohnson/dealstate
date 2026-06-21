-- DealState pass-1 schema. TODO(init): seed only when USE_SUPABASE=true is implemented end to end.
create table public.opportunities (
  id text primary key,
  slug text not null unique,
  name text not null,
  company_name text not null,
  stage text not null,
  sector text not null default '',
  geography text[] not null default '{}',
  internal_owner text not null,
  contributors text[] not null default '{}',
  current_recommendation text not null,
  confidence text not null,
  last_updated_at timestamptz not null
);

create table public.documents (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  artefact_type text not null,
  status text not null,
  source text not null,
  received_at timestamptz,
  confidence text not null,
  original_filename text not null default '',
  standardised_filename text,
  required boolean not null default true,
  notes text[] not null default '{}'
);

create table public.facts (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  key text not null,
  label text not null,
  value text not null,
  kind text not null check (kind in ('fact','inference')),
  citations jsonb not null default '[]'::jsonb,
  conflicts_with text[] not null default '{}',
  as_of date not null,
  constraint fact_requires_citation check (kind = 'inference' or jsonb_array_length(citations) > 0)
);

create table public.issues (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  issue_type text not null,
  severity text not null,
  status text not null,
  title text not null,
  description text not null,
  evidence text[] not null default '{}',
  owner text,
  recommended_action text not null
);

create table public.events (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  type text not null,
  actor text not null,
  actor_type text not null,
  timestamp timestamptz not null,
  description text not null,
  source_ids text[] not null default '{}',
  previous_value text,
  new_value text
);

create table public.contacts (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  name text not null,
  role text not null,
  organisation text not null,
  last_interaction date not null
);

create table public.deal_scores (
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  dimension text not null,
  score integer not null check (score between 0 and 100),
  confidence text not null,
  rationale text not null,
  what_would_change_score text not null,
  primary key (opportunity_id, dimension)
);

create table public.generated_outputs (
  id text primary key,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  type text not null,
  title text not null,
  path text not null,
  confidence text not null,
  source_ids text[] not null default '{}'
);

do $$ declare table_name text; begin
  foreach table_name in array array['opportunities','documents','facts','issues','events','contacts','deal_scores','generated_outputs'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
    execute format('grant select on table public.%I to anon, authenticated', table_name);
    execute format('create policy "read synthetic demo" on public.%I for select to anon, authenticated using (true)', table_name);
  end loop;
end $$;

alter default privileges for role postgres in schema public revoke select, insert, update, delete on tables from anon, authenticated;
