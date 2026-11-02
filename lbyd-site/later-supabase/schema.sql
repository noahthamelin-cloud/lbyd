-- INTERACTIVE CLIENT ACQUISITION  |  Supabase schema
-- Run once in Supabase > SQL Editor. One project serves every coach (coach_id column).

create table if not exists coaches (
  slug        text primary key,            -- matches COACH_SLUG on the coach's Netlify site
  name        text not null,
  admin_pin   text not null,               -- what the coach types into the admin portal
  created_at  timestamptz default now()
);

create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  coach_id         text not null references coaches(slug),
  assessment_id    text not null,
  assessment_title text,
  name             text not null,
  whatsapp         text not null,
  email            text,
  instagram        text,
  pattern          text,
  pattern_label    text,
  scores           jsonb default '{}'::jsonb,   -- {dimension: 0..100}
  picks            jsonb default '{}'::jsonb,   -- {pattern: count}
  lowest           text,
  answers          jsonb default '[]'::jsonb,   -- [{n, part, question, answer}]
  actions          jsonb default '[]'::jsonb,   -- the three tomorrow actions they were shown
  meta             jsonb default '{}'::jsonb,   -- referrer, user agent, page
  created_at       timestamptz default now()
);

create index if not exists leads_coach_created on leads (coach_id, created_at desc);
create index if not exists leads_whatsapp on leads (coach_id, whatsapp);

-- Lock both tables. Only the service key (used by the Netlify functions) can read or write.
alter table coaches enable row level security;
alter table leads   enable row level security;

-- First coach. Change the PIN before you share the admin link.
insert into coaches (slug, name, admin_pin)
values ('lbyd', 'Live Before You Die', 'CHANGE-ME')
on conflict (slug) do nothing;
