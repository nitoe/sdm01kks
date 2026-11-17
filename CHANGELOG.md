# Catatan perubahan

Catatan ini merangkum perubahan situs SD Muhammadiyah 01 Kukusan sejak commit `Beranda terang` di GitHub.

## 2026-11-17

### Tampilan dan pengalaman pakai (UI/UX)

Hanya tata letak, gaya, dan kebiasaan pakai yang berubah. Isi, data, alur Publish, peran akun, dan gerbang halaman 404 tidak disentuh.

- **Identitas visual baru.** Kertas krem hangat (`paper`), hijau pinus yang lebih dalam (`pine`, `pine-deep`, `forest`), dan kuning matahari (`sun`, `sun-soft`) sebagai aksen. Nama token lama dipertahankan, jadi panel kelola dan halaman lain ikut berubah warna tanpa diedit.
- **Tipografi.** Newsreader dan Source Sans 3 diganti **Fraunces** (judul) dan **Plus Jakarta Sans** (isi). Tautan font Poppins yang tidak terpakai dihapus; kini satu tautan Google Fonts dengan `preconnect`.
- **Motif.** Bingkai foto berbentuk lengkung (`.arch`) dan pola bintang bersudut delapan yang samar (`.pola-bintang`, `.pola-bintang-gelap`). Tombol utama memakai gaya "alas" (`.tombol`). Animasi masuk `.rise` di hero.
- **Header.** Menu memakai garis kuning di bawah tautan aktif (bukan latar bulat). Bilah info jam layanan, telepon, dan surel di layar lebar. Tautan "Lewati ke isi halaman" untuk pembaca layar dan papan ketik. Tautan Masuk tetap tepat setelah Kontak dan tetap kelihatan di layar kecil.
- **Menu ponsel.** Menu layar penuh bernomor, gulir latar dikunci selama terbuka, bisa ditutup dengan tombol Esc, dan memuat tombol Masuk serta nomor telepon.
- **Footer.** Latar hijau tua dengan tiga kolom: identitas, daftar halaman (Jelajahi), dan kontak. Menambah tautan Masuk di baris bawah.
- **Judul halaman (`PageIntro`).** Kini pita penuh dengan pola, jejak halaman "Beranda / halaman", dan judul lebih besar. Berlaku otomatis ke Profil, Manajerial, Program, Berita, Galeri, Kontak, dan halaman lain yang memakainya.
- **Beranda.** Hero dua kolom dengan foto berbingkai lengkung dan blok kuning di belakangnya; angka Berdiri, Akreditasi, dan Peserta didik memakai huruf judul. Sambutan kepala sekolah di bagian hijau gelap dengan tanda tangan nama dan jabatan di bawah isi. Kartu nilai bernomor dan diberi judul bagian "Nilai yang kami jaga". Kartu program bernomor dengan panah. Prestasi tetap empat kartu kecil dalam bingkai hijau muda; kartu tanpa foto menampilkan ikon piala. Berita menampilkan tanggal sebagai label. Visi di pita kuning lembut. Tautan "Halaman program" dan "Semua berita" dipindah ke kanan judul bagian.
- **Halaman tidak ditemukan** (404 biasa untuk alamat yang salah) didesain ulang; tidak sama dengan halaman "sedang dibangun".
- Berkas baru: `src/components/site/ornament.tsx` (bintang dan label kecil bersama).
- Halaman "sedang dibangun" (`maintenance.tsx`) tidak diubah; ia ikut berganti warna dan font karena memakai token yang sama.

## 2026-11-16

### Halaman “sedang dibangun” (Maintenance)

- Desain halaman 404/maintenance diselaraskan dengan palet dan tipografi situs utama (pine, mint, paper, Newsreader + Source Sans 3).
- Menghilangkan ketergantungan visual pada Poppins dan warna oranye yang berbeda total dari brand situs.
- Header ringan menampilkan logo + nama sekolah + “Depok · Muhammadiyah”, konsisten dengan shell.
- Pesan lebih hangat: judul “Website kami sedang dibangun”, kicker “Sedang disiapkan”.
- Tombol tetap: **Go Back** → Google, **Developer Mode** → `/masuk` (sesuai ANTIREGRESI).
- Ilustrasi tetap dipakai, kini dibingkai dengan aksen mint seperti komponen beranda.

## 2026-10-21

### Keamanan dependensi

- Menanggapi peringatan kerentanan dari Hostinger pada `@grpc/grpc-js` (`getAuthContext` tidak membedakan sertifikat sah dan tidak sah bila `requireClientCertificate` bernilai `false`; diperbaiki di 1.13.6 dan 1.14.5). Paket ini hanya terbawa lewat `firebase` → `@firebase/firestore` dan sebelumnya terkunci di 1.9.16.
- `package.json`: ditambah `overrides` `"@grpc/grpc-js": "1.14.5"`, karena `@firebase/firestore` 4.18.0 masih membatasi ke `~1.9.0`.
- `package-lock.json`: `@grpc/grpc-js` naik dari 1.9.16 ke 1.14.5; ikut ditambahkan `@grpc/proto-loader` 0.8.1 (bersarang di bawah grpc-js) dan `@js-sdsl/ordered-map`. Entri lain tidak diubah.

## 2026-10-19

### Header

- Tombol **Hubungi kami** dihapus dari header (desktop, bar atas layar sedang, dan menu geser di ponsel) karena fungsinya sama dengan menu **Kontak**. Menu Kontak, halaman `/kontak`, dan tautan **Masuk** tidak berubah.

### Akun dan peran

- Login guru ditiadakan: halaman `/guru` dan `/guru/profil`, tab **Akun guru** di panel kelola, pilihan **Guru** di halaman Masuk, dan tautan "Akun guru" di halaman sementara dihapus. Data lama di tabel `teacher_*` tidak dihapus dari basis data. Tautan ke aplikasi penilaian tetap ada di halaman Masuk.
- Ada dua peran akun panel kelola. **Admin**: semua akses, termasuk kelola akun. **Operator**: semua akses isi situs (identitas, beranda, pengumuman, berita, program, prestasi, galeri, tampilan, ganti sandi sendiri), tetapi tidak melihat atau mengubah akun.
- Tab baru **Kelola akun** (hanya admin, di grup Pengaturan): daftar akun, tambah, ubah nama/surel/peran, atur ulang sandi, dan hapus. "Tambah admin" dipindah dari tab Sandi ke sini, dengan pilihan peran.
- Akun yang sudah ada otomatis menjadi admin (`migrations/0004_admin_roles.sql`, kolom `role`).
- Peran dibaca dari basis data pada setiap permintaan, jadi perubahan peran, reset sandi, dan penghapusan akun langsung berlaku di sesi yang sedang berjalan.
- Jalur masuk lama dengan sandi-PIN (sandi bawaan `kukusan-admin`) dihapus. Sesi tanpa akun tidak lagi dianggap masuk.
- Akun admin bawaan hanya dibuat bila belum ada akun sama sekali, sehingga tidak muncul lagi dengan sandi awal setelah surelnya diganti atau akunnya dihapus.
- Halaman Masuk dan Gate panel kelola tidak lagi mengisi surel admin secara otomatis.

### Mode "sedang dibangun" dan Publish

- Sebelum admin menekan **Publish**, semua pengunjung yang membuka halaman publik (`/`, `/profil`, `/program`, `/berita`, `/galeri`, `/kontak`, dan seterusnya) hanya melihat halaman 404 "website sedang dibangun": logo dan nama sekolah di kiri atas, keterangan singkat, tombol **Go Back** (ke Google) dan **Developer Mode** (ke `/masuk`).
- `/masuk` dan `/kelola` tetap bisa dibuka pengunjung sebagai jalan masuk. Admin dan operator yang sudah masuk melihat situs sebenarnya (untuk memeriksa isi) dengan spanduk bahwa situs belum dipublikasikan.
- Isi situs dari basis data tidak dikirim ke pengunjung sebelum Publish (`loadSiteContent` hanya memberi isi awal bila bukan admin/operator). Setelah login, isi sebenarnya dimuat ulang sebelum panel bisa diubah.
- Tab baru **Publikasi** (grup Pengaturan, khusus admin). Tombol **Publish situs** membuka jendela verifikasi: centang pemeriksaan isi, ketik `PUBLISH`, dan masukkan sandi admin. Sandi dan kata diperiksa di server. Setelah Publish, halaman 404 tidak dipakai lagi.
- Status disimpan di tabel `site_settings` (`migrations/0005_site_publish.sql`), kunci `published`. Tanpa baris itu, situs dianggap belum dipublikasikan. Bila status gagal dibaca, pengunjung tetap melihat halaman 404.
- Berkas baru: `public/logo-sekolah.png` (logo sekolah, dipakai bila logo belum diunggah lewat Identitas) dan `public/media/404-ilustrasi.png`.

## 2026-10-18

### Beranda

- Bagian galeri dan blok "Siap menyambut orang tua" tidak lagi ditampilkan di halaman utama. Menu Galeri dan halaman kontak tetap ada.

### Pengumuman

- Jendela pengumuman muncul saat situs dibuka, dengan panah jika ada lebih dari satu.
- Centang **Sudah saya baca** menyimpan pilihan di peramban. Jendela tidak muncul lagi pada kunjungan berikutnya, sampai ada pengumuman baru.
- Menu Pengumuman tetap ada untuk dibaca kapan saja.

### Prestasi

- Beranda menampilkan empat kartu kecil di dalam bingkai hijau muda.
- Tombol **Lihat prestasi siswa** dan setiap kartu membuka halaman prestasi.
- Daftar lengkap, filter, dan suntingan admin tetap di halaman prestasi serta panel kelola.

### Berita

- Beranda memakai kartu geser. Panah muncul bila kartu tidak muat.
- Kartu hanya menampilkan tanggal, gambar, judul, dan deskripsi singkat.
- Halaman berita menampilkan isi lengkap, bukan deskripsi singkat.
- Panel kelola: judul, tanggal, gambar, deskripsi singkat, dan isi berita.

### Yang sudah ada sebelumnya pada cabang kerja ini

- Sambutan kepala sekolah dan kartu nilai, keduanya dapat diubah admin beserta gambarnya.
- Program dibagi tiga: Intrakurikuler, Kokurikuler, Ekstrakurikuler, masing-masing punya halaman.
- Tautan Masuk berada di antara Kontak dan Hubungi kami.
