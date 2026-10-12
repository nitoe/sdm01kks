# SD Muhammadiyah 01 Kukusan

Situs sekolah untuk domain **sdmuhammadiyah01kks.sch.id**.

Pengunjung yang membuka alamat utama hanya melihat halaman sedang disiapkan. Situs lengkap ada di `/pratinjau` dan belum ditautkan dari halaman publik. Isi pratinjau diatur lewat **Panel kelola** di `/kelola`.

## Menjalankan

```bash
npm install
npm run dev
```

## Firebase

Tanpa konfigurasi, perubahan admin tersimpan di peramban yang dipakai. Agar semua pengunjung melihat isi yang sama, sambungkan Firestore:

- koleksi/dokumen: `site/public`
- tempel konfigurasi web di tab Firebase pada panel kelola, atau set variabel `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, dan `VITE_FIREBASE_APP_ID` (plus `AUTH_DOMAIN`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID` bila ada)

Aturan tulis Firestore harus dikunci sebelum situs dibuka untuk umum. Sandi admin awal tampil di halaman masuk selama belum diganti, dan hanya berlaku di peramban itu.

Visi, misi, program, dan foto suasana masih naskah serta ilustrasi awal. Ganti dengan rumusan dan foto resmi sekolah.
