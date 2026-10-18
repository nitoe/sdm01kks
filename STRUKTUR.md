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

Berkas lain di repo (skrip, akun guru, dan konfigurasi Vite) hanya agar proyek bisa dijalankan. Bukan isi sekolah.