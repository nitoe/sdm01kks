create table if not exists school_secrets (
  id text primary key,
  pin_hash text not null
);

create table if not exists teacher_accounts (
  id text primary key,
  roster_key text not null unique,
  name text not null,
  gelar text not null default '',
  nip text not null default '',
  nuptk text not null default '',
  phone text not null default '',
  email text not null default '',
  note text not null default '',
  password_hash text not null,
  status text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_sessions (
  token_hash text primary key,
  account_id text not null references teacher_accounts(id) on delete cascade,
  expires_at timestamptz not null
);

create table if not exists teacher_resets (
  id text primary key,
  account_id text not null references teacher_accounts(id) on delete cascade,
  password_hash text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists teacher_resets_account_idx on teacher_resets (account_id);

create table if not exists admin_sessions (
  token_hash text primary key,
  expires_at timestamptz not null
);
