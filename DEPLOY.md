# Deploy ke Hostinger — SD Muhammadiyah 01 Kukusan

Situs ini **bukan website statis**. Ia membutuhkan **Node.js** (server) agar panel admin, penyimpanan isi, dan unggah gambar bekerja.

Domain target: **sdmuhammadiyah01kks.sch.id**

---

## 1. Pilih paket Hostinger yang mendukung Node.js

Hosting **shared PHP biasa** tidak cukup.

Pilih salah satu:

| Opsi | Cocok untuk |
|------|-------------|
| **Business Web Hosting** atau **Cloud** (fitur Node.js Web Apps / Web Apps di hPanel) | Deploy dari GitHub, build otomatis |
| **VPS** (KVM) | Kontrol penuh dengan PM2 + Nginx |

Dokumentasi Hostinger: [Node.js Hosting Overview](https://docs.hostinger.com/node.js/overview)

---

## 2. Basis data produksi (wajib)

Di komputer lokal, aplikasi memakai **PGLite** (basis data di memori). Data hilang jika proses server di-restart.

Untuk production, sediakan **PostgreSQL** dan isi variabel:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

Saran praktis (gratis untuk mulai):

1. Buat akun di [Neon](https://neon.tech) atau pakai PostgreSQL dari Hostinger (jika tersedia di paket).
2. Salin connection string ke environment variables di hPanel.
3. Setelah deploy pertama, skema tabel dibuat lewat migrasi (`npm run db:migrate` sudah bagian dari `npm run build`).

Tanpa `DATABASE_URL`, situs tetap bisa jalan di server, tetapi **isi panel admin bisa hilang** setiap restart.

---

## 3. Deploy lewat hPanel (Node.js Web App + GitHub)

### Persiapan di GitHub

- Repo: `nitoe/sdm01kks` (atau fork/mirror Anda)
- Cabang: `main`

### Di Hostinger hPanel

1. **Websites** → **Add Website** / **Deploy Web App** → **Node.js**
2. Pilih **Import Git Repository** → otorisasi GitHub → pilih repo & cabang `main`
3. Pengaturan aplikasi (sesuaikan jika auto-detect berbeda):

| Field | Nilai disarankan |
|--------|------------------|
| Node.js version | **20** atau **22** (LTS) |
| Application type | **nitro** atau **other** |
| Build script | `build:hostinger` *(atau `build` setelah preset default node-server)* |
| Output directory | `.output` |
| Entry file | `server/index.mjs` *(relatif terhadap output)* |
| Start command | `npm start` atau `node .output/server/index.mjs` |

4. **Environment variables** (wajib untuk production):

| Nama | Contoh / keterangan |
|------|---------------------|
| `DATABASE_URL` | Connection string PostgreSQL (Neon / Hostinger) |
| `NITRO_PRESET` | `node-server` *(jika build memakai skrip `build` lama)* |
| `NODE_ENV` | `production` |

5. Hubungkan domain **sdmuhammadiyah01kks.sch.id** ke situs Node ini (DNS A/CNAME sesuai petunjuk Hostinger).
6. Aktifkan **SSL** (Let's Encrypt) di hPanel.

### Setelah deploy berhasil

1. Buka `https://sdmuhammadiyah01kks.sch.id/`
2. Masuk admin: `/masuk` atau `/kelola`
3. Ganti sandi awal segera
4. Unggah logo, isi prestasi, program, berita

---

## 4. Build lokal (uji sebelum deploy)

Di komputer Anda:

```powershell
git pull
npm install

# Build seperti di Hostinger
$env:NITRO_PRESET="node-server"
npm run build

# Atau:
npm run build:hostinger

# Jalankan hasil build (opsional)
npm start
```

Buka alamat yang dicetak di terminal (biasanya port dari Hostinger/`PORT`).

---

## 5. Deploy lewat VPS (opsional)

Jika memakai VPS Hostinger:

```bash
# di server Ubuntu
git clone https://github.com/nitoe/sdm01kks.git
cd sdm01kks
npm install
export NITRO_PRESET=node-server
export DATABASE_URL="postgresql://..."
npm run build

# jalankan dengan PM2
npm install -g pm2
pm2 start npm --name sdm01kks -- start
pm2 save
pm2 startup
```

Pasang Nginx sebagai reverse proxy ke port aplikasi, lalu SSL dengan Certbot.

---

## 5b. Mode "sedang dibangun" dan Publish

Setelah deploy pertama, **semua pengunjung hanya melihat halaman 404 "website sedang dibangun"**. Situs sebenarnya hanya terlihat oleh admin/operator yang sudah masuk (lewat tombol **Developer Mode** atau `/masuk`).

Untuk membuka situs: masuk sebagai **admin** → panel kelola → **Pengaturan → Publikasi** → **Publish situs** → centang, ketik `PUBLISH`, masukkan sandi admin. Status tersimpan di basis data (tabel `site_settings`), jadi `DATABASE_URL` production wajib terisi; tanpa itu status hilang saat server restart dan situs kembali ke halaman 404.

Mengembalikan ke mode "sedang dibangun" (tidak ada tombolnya di panel), jalankan di basis data:

```sql
delete from site_settings where key = 'published';
```

**Sebelum deploy pertama:** isi `ADMIN_INITIAL_PASSWORD` di environment variables. Tanpa itu, akun admin awal memakai sandi bawaan dari kode, dan halaman masuk sudah terbuka untuk umum. Ganti sandi segera setelah masuk.

---

## 6. Checklist sebelum go-live

- [ ] Paket Hostinger mendukung Node.js Web Apps atau VPS
- [ ] `DATABASE_URL` production terisi dan bisa diakses dari server
- [ ] Build sukses (`npm run build:hostinger` lokal atau di hPanel)
- [ ] Domain mengarah ke aplikasi Node (bukan folder `public_html` PHP kosong)
- [ ] HTTPS aktif
- [ ] Login admin berhasil; sandi awal diganti
- [ ] Uji unggah logo dan satu berita/prestasi
- [ ] `ADMIN_INITIAL_PASSWORD` terisi sebelum deploy pertama
- [ ] Pengunjung (tanpa login) hanya melihat halaman 404; setelah Publish, situs sebenarnya tampil

---

## 7. Catatan teknis singkat

- Stack: **TanStack Start + Vite + Nitro**
- Preset production Hostinger: **`node-server`** (bukan `vercel`)
- Isi situs & media disimpan di PostgreSQL (`site_documents`, `site_media`)
- Subdomain penilaian (`penilaian.sdmuhammadiyah01kks.sch.id`) terpisah; tidak diganti oleh deploy ini

Jika build di hPanel gagal, salin log error lengkap lalu dilanjutkan perbaikan di repo.
