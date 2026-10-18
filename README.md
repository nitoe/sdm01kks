# SD Muhammadiyah 01 Kukusan

Situs sekolah untuk domain **sdmuhammadiyah01kks.sch.id**.

Pengunjung yang membuka alamat utama melihat halaman depan sekolah: identitas, pengumuman, program, berita, galeri, prestasi, visi, dan kontak. Isi itu diubah lewat **Panel kelola** di `/kelola`, lalu tersimpan di basis data sehingga pengunjung lain membaca yang sama.

## Menjalankan di komputer

```bash
npm install
npm run dev
```

Buka `http://localhost:8080`. Tidak wajib berkas `.env` untuk development — basis data lokal (PGLite) dipakai otomatis.

## Admin

Masuk di `/masuk` atau `/kelola`.

- Surel awal: `admin@sdmuhammadiyah01kks.sch.id`
- Sandi awal: `Kukusan-1981`

Ganti sandi setelah masuk pertama kali (tab **Sandi**).

## Deploy (Hostinger)

Situs ini membutuhkan **Node.js**, bukan hosting PHP statis.

Panduan lengkap: **[DEPLOY.md](DEPLOY.md)**

Ringkas:

1. Paket Hostinger dengan **Node.js Web Apps** (Business/Cloud) atau **VPS**
2. Set `DATABASE_URL` ke PostgreSQL production (disarankan Neon atau Postgres Hostinger)
3. Build dengan preset `node-server` (`npm run build:hostinger`)
4. Entry: `.output/server/index.mjs` · perintah start: `npm start`
5. Arahkan domain `sdmuhammadiyah01kks.sch.id` + aktifkan SSL

## Berkas penting

| Berkas | Isi |
|--------|-----|
| [src/lib/site/seed.ts](src/lib/site/seed.ts) | Data awal situs |
| [src/routes/kelola.tsx](src/routes/kelola.tsx) | Panel admin |
| [DEPLOY.md](DEPLOY.md) | Langkah deploy Hostinger |
| [STRUKTUR.md](STRUKTUR.md) | Peta berkas |
