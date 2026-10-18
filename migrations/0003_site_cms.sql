alter table admin_sessions add column if not exists account_id text;

create table if not exists admin_accounts (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists site_documents (
  id text primary key,
  content text not null,
  updated_at timestamptz not null default now()
);

create table if not exists site_media (
  id text primary key,
  mime text not null,
  data text not null,
  created_at timestamptz not null default now()
);
