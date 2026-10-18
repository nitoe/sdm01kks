# SD Muhammadiyah 01 Kukusan

Situs sekolah untuk domain **sdmuhammadiyah01kks.sch.id**.

Pengunjung yang membuka alamat utama melihat halaman depan sekolah: identitas, pengumuman, program, berita, galeri, visi, dan kontak. Isi itu diubah lewat **Panel kelola** di `/kelola`, lalu tersimpan di basis data sehingga pengunjung lain membaca yang sama.

## Berkas situs

Seluruh berkas yang dipakai situs sudah ada di cabang `main`. Hosting dan domain belum dipasang.

Isi awal (identitas, beranda, pengumuman, berita, program, galeri) ada di [src/lib/site/seed.ts](src/lib/site/seed.ts). Begitu admin menyimpan, salinan di basis data yang dipakai. Peta berkas ada di [STRUKTUR.md](STRUKTUR.md).

## Menjalankan

```bash
npm install
npm run dev
```

Tidak perlu berkas `.env`. Basis data lokal dipakai otomatis.

## Admin

Masuk di `/kelola`.

- Surel awal: `admin@sdmuhammadiyah01kks.sch.id`
- Sandi awal: `Kukusan-1981`

Ganti sandi setelah masuk. Admin lain dapat ditambah dari tab Sandi. Artikel baru bisa membawa gambar yang diunggah dari komputer.

## Nanti

Domain `sdmuhammadiyah01kks.sch.id` dan hosting belum dikerjakan.
