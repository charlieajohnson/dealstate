-- DealState pass 2 foundations: tenant anchors, pipeline tables and deny-by-default RLS.

create extension if not exists vector with schema extensions;

create table public.firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  synthetic_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.funds (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  name text not null,
  slug text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (firm_id, slug)
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  role text not null check (role in ('owner','contributor','viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, firm_id)
);

alter table public.opportunities add column if not exists firm_id uuid references public.firms(id);
alter table public.opportunities add column if not exists fund_id uuid references public.funds(id);
alter table public.opportunities add constraint opportunities_id_firm_id_unique unique (id, firm_id);

create table public.raw_artefacts (
  id text primary key,
  deal_id text not null references public.opportunities(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  source text not null check (source in ('gmail','drive','crm','manual_upload')),
  external_id text not null,
  content_hash text not null,
  mime text not null,
  storage_path text not null,
  received_at timestamptz not null,
  supersedes text references public.raw_artefacts(id),
  pii_flags text[] not null default '{}',
  constraint raw_artefacts_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade,
  unique (firm_id, source, external_id, content_hash)
);

create table public.artefact_segments (
  id text primary key,
  raw_artefact_id text not null references public.raw_artefacts(id) on delete cascade,
  locator jsonb not null,
  text text not null,
  ordinal integer not null check (ordinal >= 0)
);

create table public.ingestion_runs (
  id text primary key,
  firm_id uuid not null references public.firms(id) on delete cascade,
  deal_id text not null references public.opportunities(id) on delete cascade,
  source text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  status text not null check (status in ('running','succeeded','failed')),
  artefacts_seen integer not null default 0,
  artefacts_created integer not null default 0,
  error text,
  constraint ingestion_runs_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade
);

create table public.extraction_runs (
  id text primary key,
  firm_id uuid not null references public.firms(id) on delete cascade,
  deal_id text not null references public.opportunities(id) on delete cascade,
  prompt_id text not null,
  prompt_version text not null,
  model_id text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  status text not null check (status in ('running','succeeded','failed')),
  constraint extraction_runs_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade
);

create table public.extraction_candidates (
  id text primary key,
  extraction_run_id text not null references public.extraction_runs(id) on delete cascade,
  segment_ids text[] not null,
  candidate_type text not null check (candidate_type in ('fact','issue','contact','event')),
  payload jsonb not null,
  citations jsonb not null default '[]'::jsonb,
  confidence text not null check (confidence in ('high','medium','low')),
  verified boolean not null default false
);

create table public.llm_call_records (
  id text primary key,
  firm_id uuid not null references public.firms(id) on delete cascade,
  deal_id text not null references public.opportunities(id) on delete cascade,
  prompt_id text not null,
  prompt_version text not null,
  model_id text not null,
  tokens_in integer not null check (tokens_in >= 0),
  tokens_out integer not null check (tokens_out >= 0),
  cost numeric not null check (cost >= 0),
  latency_ms numeric not null check (latency_ms >= 0),
  cache_hit boolean not null,
  input_hash text not null,
  created_at timestamptz not null,
  constraint llm_call_records_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade
);

create table public.retrieval_chunks (
  id text primary key,
  segment_id text not null references public.artefact_segments(id) on delete cascade,
  deal_id text not null references public.opportunities(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  embedding vector(1536),
  tsv tsvector,
  token_count integer not null check (token_count >= 0),
  content_hash text not null,
  constraint retrieval_chunks_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade
);

create table public.grounded_answers (
  id text primary key,
  firm_id uuid not null references public.firms(id) on delete cascade,
  deal_id text not null references public.opportunities(id) on delete cascade,
  question text not null,
  answer jsonb not null,
  prompt_id text not null,
  model_id text not null,
  created_at timestamptz not null default now(),
  constraint grounded_answers_deal_firm_fk foreign key (deal_id, firm_id) references public.opportunities(id, firm_id) on delete cascade
);

create or replace function public.current_user_firm_ids()
returns uuid[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(firm_id), '{}') from public.memberships where user_id = auth.uid()
$$;

create or replace function public.can_access_firm(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_firm_id = any(public.current_user_firm_ids())
$$;

create or replace function public.is_firm_owner(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where user_id = auth.uid()
      and firm_id = target_firm_id
      and role = 'owner'
  )
$$;

create or replace function public.can_write_firm(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where user_id = auth.uid()
      and firm_id = target_firm_id
      and role in ('owner','contributor')
  )
$$;

create or replace function public.deal_belongs_to_firm(target_deal_id text, target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.opportunities
    where id = target_deal_id
      and firm_id = target_firm_id
  )
$$;

drop policy if exists "read synthetic demo" on public.opportunities;
drop policy if exists "read synthetic demo" on public.documents;
drop policy if exists "read synthetic demo" on public.facts;
drop policy if exists "read synthetic demo" on public.issues;
drop policy if exists "read synthetic demo" on public.events;
drop policy if exists "read synthetic demo" on public.contacts;
drop policy if exists "read synthetic demo" on public.deal_scores;
drop policy if exists "read synthetic demo" on public.generated_outputs;

alter table public.firms enable row level security;
alter table public.funds enable row level security;
alter table public.memberships enable row level security;
alter table public.opportunities enable row level security;
alter table public.documents enable row level security;
alter table public.facts enable row level security;
alter table public.issues enable row level security;
alter table public.events enable row level security;
alter table public.contacts enable row level security;
alter table public.deal_scores enable row level security;
alter table public.generated_outputs enable row level security;
alter table public.raw_artefacts enable row level security;
alter table public.artefact_segments enable row level security;
alter table public.ingestion_runs enable row level security;
alter table public.extraction_runs enable row level security;
alter table public.extraction_candidates enable row level security;
alter table public.llm_call_records enable row level security;
alter table public.retrieval_chunks enable row level security;
alter table public.grounded_answers enable row level security;

alter table public.firms force row level security;
alter table public.funds force row level security;
alter table public.memberships force row level security;
alter table public.opportunities force row level security;
alter table public.documents force row level security;
alter table public.facts force row level security;
alter table public.issues force row level security;
alter table public.events force row level security;
alter table public.contacts force row level security;
alter table public.deal_scores force row level security;
alter table public.generated_outputs force row level security;
alter table public.raw_artefacts force row level security;
alter table public.artefact_segments force row level security;
alter table public.ingestion_runs force row level security;
alter table public.extraction_runs force row level security;
alter table public.extraction_candidates force row level security;
alter table public.llm_call_records force row level security;
alter table public.retrieval_chunks force row level security;
alter table public.grounded_answers force row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

create policy "firm members read firms" on public.firms for select to authenticated using (public.can_access_firm(id));
create policy "owners write firms" on public.firms for all to authenticated using (public.is_firm_owner(id)) with check (public.is_firm_owner(id));

create policy "firm members read funds" on public.funds for select to authenticated using (public.can_access_firm(firm_id));
create policy "owners write funds" on public.funds for all to authenticated using (public.is_firm_owner(firm_id)) with check (public.is_firm_owner(firm_id));

create policy "users read own memberships" on public.memberships for select to authenticated using (user_id = auth.uid() or public.can_access_firm(firm_id));
create policy "owners write memberships" on public.memberships for all to authenticated using (public.is_firm_owner(firm_id)) with check (public.is_firm_owner(firm_id));

create policy "firm members read opportunities" on public.opportunities for select to authenticated using (firm_id is not null and public.can_access_firm(firm_id));
create policy "contributors write opportunities" on public.opportunities for all to authenticated using (firm_id is not null and public.can_write_firm(firm_id)) with check (firm_id is not null and public.can_write_firm(firm_id));

create policy "firm members read documents" on public.documents for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write documents" on public.documents for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read facts" on public.facts for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write facts" on public.facts for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read issues" on public.issues for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write issues" on public.issues for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read events" on public.events for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write events" on public.events for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read contacts" on public.contacts for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write contacts" on public.contacts for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read deal_scores" on public.deal_scores for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write deal_scores" on public.deal_scores for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read generated_outputs" on public.generated_outputs for select to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));
create policy "firm members write generated_outputs" on public.generated_outputs for all to authenticated using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id))) with check (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.can_access_firm(o.firm_id)));

create policy "firm members read raw_artefacts" on public.raw_artefacts for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write raw_artefacts" on public.raw_artefacts for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));

create policy "firm members read artefact_segments" on public.artefact_segments for select to authenticated using (exists (select 1 from public.raw_artefacts r where r.id = raw_artefact_id and public.can_access_firm(r.firm_id)));
create policy "firm members write artefact_segments" on public.artefact_segments for all to authenticated using (exists (select 1 from public.raw_artefacts r where r.id = raw_artefact_id and public.can_access_firm(r.firm_id))) with check (exists (select 1 from public.raw_artefacts r where r.id = raw_artefact_id and public.can_access_firm(r.firm_id)));

create policy "firm members read ingestion_runs" on public.ingestion_runs for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write ingestion_runs" on public.ingestion_runs for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));

create policy "firm members read extraction_runs" on public.extraction_runs for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write extraction_runs" on public.extraction_runs for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));

create policy "firm members read extraction_candidates" on public.extraction_candidates for select to authenticated using (exists (select 1 from public.extraction_runs r where r.id = extraction_run_id and public.can_access_firm(r.firm_id)));
create policy "firm members write extraction_candidates" on public.extraction_candidates for all to authenticated using (exists (select 1 from public.extraction_runs r where r.id = extraction_run_id and public.can_access_firm(r.firm_id))) with check (exists (select 1 from public.extraction_runs r where r.id = extraction_run_id and public.can_access_firm(r.firm_id)));

create policy "firm members read llm_call_records" on public.llm_call_records for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write llm_call_records" on public.llm_call_records for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));

create policy "firm members read retrieval_chunks" on public.retrieval_chunks for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write retrieval_chunks" on public.retrieval_chunks for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));

create policy "firm members read grounded_answers" on public.grounded_answers for select to authenticated using (public.can_access_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
create policy "contributors write grounded_answers" on public.grounded_answers for all to authenticated using (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id)) with check (public.can_write_firm(firm_id) and public.deal_belongs_to_firm(deal_id, firm_id));
