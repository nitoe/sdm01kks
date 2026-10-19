# Berkas yang dipakai situs

Hosting belum masuk tahap ini. Isi situs disimpan di basis data. Daftar di bawah adalah berkas situs di repo.

## Halaman

| Path | Peran |
|---|---|
| `src/routes/index.tsx` | Halaman depan |
| `src/routes/profil.tsx` | Profil |
| `src/routes/program.tsx` | Program |
| `src/routes/berita.tsx` | Daftar berita |
| `src/routes/berita.$id.tsx` | Isi satu berita |
| `src/routes/galeri.tsx` | Galeri |
| `src/routes/kontak.tsx` | Kontak |
| `src/routes/kelola.tsx` | Panel admin |
| `src/routes/api/media.$id.ts` | Gambar yang diunggah admin |
| `src/routes/__root.tsx` | Kerangka HTML |

## Tampilan dan isi

| Path | Peran |
|---|---|
| `src/components/site/home-page.tsx` | Isi halaman depan |
| `src/components/site/shell.tsx` | Kepala dan kaki |
| `src/lib/site/seed.ts` | Naskah dan data awal |
| `src/lib/site/content.server.ts` | Simpanan di basis data |
| `src/lib/site/types.ts` | Bentuk data |
| `src/lib/site/store.ts` | Salinan di peramban, disamakan dengan basis data |
| `migrations/0003_site_cms.sql` | Akun admin, isi situs, dan gambar |
| `migrations/0004_admin_roles.sql` | Peran akun: admin dan operator |
| `src/lib/teachers/service.server.ts` | Masuk, sesi, peran, dan kelola akun (nama folder warisan) |
| `src/components/site/kelola-panels-accounts.tsx` | Tab Kelola akun (khusus admin) |
| `src/components/site/maintenance.tsx` | Halaman 404 "sedang dibangun" untuk pengunjung sebelum Publish |
| `src/components/site/kelola-panels-publish.tsx` | Tab Publikasi dan jendela verifikasi Publish (khusus admin) |
| `src/lib/site/gate.ts`, `gate-types.ts`, `publish.server.ts` | Gerbang pengunjung dan logika Publish |
| `migrations/0005_site_publish.sql` | Tabel `site_settings` (status Publish) |
| `public/logo-sekolah.svg`, `public/media/404-ilustrasi.png` | Logo sementara dan ilustrasi halaman 404 |

Berkas lain di repo (skrip, daftar guru lama di `src/lib/teachers/roster.ts`, dan konfigurasi Vite) hanya agar proyek bisa dijalankan. Bukan isi sekolah.