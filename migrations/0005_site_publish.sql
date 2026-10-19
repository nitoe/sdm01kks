-- Pengaturan situs bentuk kunci-nilai. Dipakai untuk status Publish:
-- baris `published` bernilai 'true' membuka situs untuk pengunjung.
-- Tanpa baris itu (atau nilainya bukan 'true'), pengunjung melihat halaman 404 "sedang dibangun".
create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
