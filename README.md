# SD Muhammadiyah 01 Kukusan

Situs sekolah untuk domain **sdmuhammadiyah01kks.sch.id**.

Pengunjung yang membuka alamat utama melihat keterangan dasar sekolah. Pengumuman, berita, program, dan galeri ada di `/pratinjau`, belum ditautkan dari halaman publik. Isi itu diatur lewat **Panel kelola** di `/kelola`.

## Berkas situs

Seluruh berkas yang dipakai situs sudah ada di cabang `main`. Belum ada pengaturan Firebase, domain, atau hosting. Itu tahap berikutnya.

Isi yang tampil (identitas, beranda, pengumuman, berita, program, galeri) ada di [src/lib/site/seed.ts](src/lib/site/seed.ts). Tanpa Firebase, salinan ini yang dibaca situs. Peta berkas ada di [STRUKTUR.md](STRUKTUR.md).

## Menjalankan

```bash
npm install
npm run dev
```

Tidak perlu berkas `.env`.

## Nanti

Firebase, aturan tulis Firestore, dan domain `sdmuhammadiyah01kks.sch.id` belum dikerjakan. Jangan diisi dulu.
