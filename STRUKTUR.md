# Berkas yang dipakai situs

Firebase dan pengaturan hosting belum masuk tahap ini. Daftar di bawah adalah berkas situs di repo.

## Halaman

| Path | Peran |
|---|---|
| `src/routes/index.tsx` | Halaman publik |
| `src/routes/kelola.tsx` | Panel admin |
| `src/routes/pratinjau.tsx` | Beranda pratinjau |
| `src/routes/pratinjau.profil.tsx` | Profil |
| `src/routes/pratinjau.program.tsx` | Program |
| `src/routes/pratinjau.berita.tsx` | Daftar berita |
| `src/routes/pratinjau.berita.$id.tsx` | Isi satu berita |
| `src/routes/pratinjau.galeri.tsx` | Galeri |
| `src/routes/pratinjau.kontak.tsx` | Kontak |
| `src/routes/__root.tsx` | Kerangka HTML |

## Tampilan dan isi

| Path | Peran |
|---|---|
| `src/components/site/holding.tsx` | Isi halaman publik |
| `src/components/site/home-page.tsx` | Isi beranda pratinjau |
| `src/components/site/shell.tsx` | Kepala dan kaki pratinjau |
| `src/lib/site/seed.ts` | Naskah dan data awal |
| `src/lib/site/types.ts` | Bentuk data |
| `src/lib/site/store.ts` | Simpanan di peramban |
| `src/lib/site/format.ts` | Tanggal dan id |
| `src/lib/site/preview-head.ts` | Pratinjau tidak diindeks |
| `src/lib/site/firebase.ts` | Ada sebagai berkas, belum diatur |
| `src/styles.css` | Warna dan huruf |

## Gambar

| Path |
|---|
| `public/favicon.svg` |
| `public/og.jpg` |
| `public/media/halaman.jpg` |
| `public/media/kelas.jpg` |
| `public/media/musala.jpg` |
| `public/media/pustaka.jpg` |
| `public/media/lapangan.jpg` |

Berkas lain di repo (skrip, auth, dan konfigurasi Vite) hanya agar proyek bisa dijalankan. Bukan isi sekolah.
