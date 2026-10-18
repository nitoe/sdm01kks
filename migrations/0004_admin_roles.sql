-- Peran akun panel kelola: admin (penuh) atau operator (tanpa kelola akun).
-- Akun yang sudah ada tetap admin.
alter table admin_accounts
  add column if not exists role text not null default 'admin'
  check (role in ('admin', 'operator'));

-- Sesi lama dari jalur sandi-PIN tidak terhubung ke akun, jadi tidak punya peran.
delete from admin_sessions where account_id is null;
