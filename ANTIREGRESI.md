# Antiregresi

Hal yang tidak boleh kembali saat mengubah situs ini.

## Beranda
- Jangan kembalikan blok galeri dan "Siap menyambut orang tua" ke halaman utama. Galeri tetap punya halaman dan menu sendiri.

## Pengumuman
- Jangan taruh daftar pengumuman lagi di beranda. Beranda hanya jendela (lightbox).
- Jangan hapus tautan menu Pengumuman.
- Centang "Sudah saya baca" memakai `localStorage` kunci `sdm-pengumuman-dibaca`. Nilainya adalah id pengumuman yang tampil, diurutkan dan digabung dengan `|`.
- Jika kuncinya sama dengan pengumuman yang sedang tampil, jangan buka jendela otomatis.
- Jika admin menambah, menghapus, atau mengganti id pengumuman, kunci tidak cocok dan jendela boleh muncul lagi.
- Menutup jendela tanpa centang tidak boleh menyimpan kunci itu.

## Prestasi di beranda
- Tetap kartu kecil (paling banyak empat), bukan bingkai dua kolom besar dan bukan slider gambar besar.
- Jangan pakai bingkai hitam. Bingkainya hijau muda (`bg-mint`) dengan garis hijau.
- Kartu dan tombol "Lihat prestasi siswa" mengarah ke `/prestasi`.

## Berita
- Kartu beranda hanya `excerpt` (deskripsi singkat) plus gambar, judul, dan tanggal. Jangan taruh `body` di kartu.
- Halaman `/berita/$id` menampilkan `body`. Deskripsi singkat tidak menjadi paragraf utama di sana.
- Panel kelola berita tetap punya: judul, tanggal, gambar, deskripsi singkat, isi berita.
- Geser horizontal memakai kelas `nilai-track`. Panah hanya ada bila konten melebihi lebar.

## Program dan menu
- Tiga id kelompok tetap: `intrakurikuler`, `kokurikuler`, `ekstrakurikuler`. Jangan ganti id-nya; yang boleh diganti judulnya.
- Tautan Masuk di desktop berada di antara Kontak dan Hubungi kami, dan tetap kelihatan di layar kecil.

## Data
- Perubahan admin lewat `mergeContent`. Jangan timpa seluruh isi simpanan dengan data awal.
- Contoh berita yang id-nya belum ada di simpanan ditambahkan lagi. Untuk menyembunyikan contoh, gunakan "Sembunyikan", jangan mengandalkan hapus bila id itu masih ada di data awal.
- Foto unggahan admin tidak boleh ditimpa oleh gambar contoh selama path gambarnya tidak kosong.

## Header (2026-10-19)
- Jangan tambahkan lagi tombol "Hubungi kami" di header. Fungsinya sama dengan menu Kontak (`/kontak`).
- Aturan lama "Tautan Masuk di desktop berada di antara Kontak dan Hubungi kami" diganti: Masuk kini berada tepat setelah Kontak, dan tetap kelihatan di layar kecil.

## Akun dan peran (2026-10-19)
- Tidak ada login guru di situs ini. Jangan kembalikan `/guru`, `/guru/profil`, tab "Akun guru", atau pilihan "Guru" di halaman Masuk. Tautan ke aplikasi penilaian di halaman Masuk tetap ada.
- Hanya dua peran: `admin` dan `operator`. Nilai peran tak dikenal dianggap `operator`, bukan `admin`.
- Operator tidak boleh melihat, menambah, mengubah, atau menghapus akun. Pembatasan ini wajib dijaga di server (`guardAdmin` di `src/lib/teachers/service.server.ts`), bukan hanya dengan menyembunyikan tab.
- Perubahan isi situs dan unggah gambar memakai `assertStaff` (admin dan operator). Jangan ganti kembali ke pemeriksaan khusus admin.
- Setiap sesi harus terhubung ke akun (`admin_sessions.account_id`). Jangan buat lagi jalur masuk tanpa akun, seperti sandi-PIN.
- Peran dibaca dari `admin_accounts` pada setiap permintaan. Jangan menyimpan peran di cookie atau sesi.
- Akun yang sedang dipakai tidak boleh dihapus dan tidak boleh mengubah perannya sendiri, supaya selalu tersisa minimal satu admin.
- Akun admin bawaan hanya dibuat saat tabel `admin_accounts` kosong. Jangan kembali memeriksanya per surel.
- Tab "Kelola akun" hanya tampil untuk admin. Jangan pasang kembali "Tambah admin" di tab Sandi.

## Mode sedang dibangun dan Publish (2026-10-19)
- Sebelum Publish, pengunjung hanya melihat `MaintenancePage` (`src/components/site/maintenance.tsx`). Jangan hapus gerbang di `beforeLoad` dan komponen root pada `src/routes/__root.tsx`.
- Hanya `/masuk` dan `/kelola` (`OPEN_PATHS`) yang boleh terbuka bagi pengunjung sebelum Publish. Jangan tambah halaman publik lain ke daftar itu.
- Gerbang harus dijaga di server: `loadSiteContent` memakai `canViewSite`, jangan dikembalikan agar selalu memberi isi dari basis data.
- Gagal membaca status = tertutup. Tanpa baris `published = 'true'` di `site_settings`, situs belum terbit.
- Publish hanya admin (`confirmAdminPassword` memakai `guardAdmin`), dengan sandi dan kata `PUBLISH` diperiksa di server. Operator tidak boleh menerbitkan. Tab "Publikasi" ada di `ADMIN_ONLY_TABS`.
- Tombol **Go Back** mengarah ke `https://www.google.com/`. Tombol **Developer Mode** mengarah ke `/masuk`.
- `markAdmin` di `src/lib/site/store.ts` memuat ulang isi sebelum panel bisa diubah. Jangan hapus, supaya isi awal tidak menimpa isi tersimpan.
- Pemeriksaan "sudah terbit" yang disimpan di peramban (`knownPublished`) hanya boleh berlaku di peramban, bukan di server.
- Sejak 2026-11-16 desain Maintenance memakai palet & tipografi situs utama (pine/mint/paper). Jangan kembalikan ke skema Poppins + oranye yang terpisah dari brand.

## Dependensi `@grpc/grpc-js` (2026-10-21)
- Jangan hapus `overrides` `"@grpc/grpc-js": "1.14.5"` di `package.json` selama `@firebase/firestore` masih membatasi `~1.9.0`. Tanpa itu, versi 1.9.16 yang rentan terpasang kembali.
- Jangan turunkan `@grpc/grpc-js` di bawah 1.14.5 (atau 1.13.6 bila memakai jalur 1.13). Setelah mengubah `firebase`, periksa `npm ls @grpc/grpc-js` dan pastikan versinya tetap yang sudah diperbaiki.
- Situs ini tidak menjalankan server gRPC dan tidak memakai `getAuthContext`; `firebase/firestore` hanya dimuat dinamis di `src/lib/site/firebase.ts`. Perbaikan ini murni menutup peringatan dependensi.

## Tampilan dan desain (2026-11-17)
- Nama token warna di `src/styles.css` tetap: `paper`, `sheet`, `ink`, `muted`, `line`, `pine`, `pine-deep`, `brass`, `brass-soft`, `mint`, `sky`. Panel kelola, halaman Masuk, `holding.tsx`, dan `ekskul.tsx` memakainya. Yang boleh berubah nilainya; jangan ganti atau hapus namanya. Token baru: `forest`, `sun`, `sun-soft`.
- `brass-soft` dipakai sebagai teks terang di atas latar gelap (`holding.tsx`, `ekskul.tsx`). Jangan dijadikan warna gelap.
- Font hanya Fraunces (judul) dan Plus Jakarta Sans (isi), lewat satu tautan di `src/routes/__root.tsx`. Jangan tambahkan lagi tautan Poppins, Newsreader, atau Source Sans 3.
- Kartu nilai di beranda tetap elemen `article` dan kartu berita tetap tautan `a` di dalam `.nilai-track`, karena tombol panah memakai `querySelector("article")` dan `querySelector("a")` untuk menghitung lebar geser. Jangan ganti elemennya.
- Bingkai prestasi di beranda tetap `bg-mint` dengan garis hijau (`border-pine/25`), paling banyak empat kartu. Kartu tanpa foto memakai ikon piala, bukan kotak kosong.
- `PageIntro` kini pita penuh dengan margin bawah sendiri (`mb-8 md:mb-10`). Halaman yang memakainya tidak perlu dan tidak boleh menambah jarak atas lagi di bawahnya.
- Menu ponsel mengunci gulir `document.body`. Nilai `overflow` sebelumnya harus dikembalikan saat menu ditutup (pembersihan efek di `SiteFrame`), dan tombol Esc harus menutupnya.
- Tautan Masuk tetap kelihatan di bar atas layar kecil walau menu tertutup (lihat aturan Header 2026-10-19).
- Animasi `.rise` dan efek tekan `.tombol` wajib punya pengecualian `prefers-reduced-motion` di `src/styles.css`.
- Tautan "Lewati ke isi halaman" dan `id="isi"` pada `<main>` di `SiteFrame` jangan dihapus; keduanya jalan pintas papan ketik.
- Lebar kontainer diatur lewat token `--container-6xl` yang dinaikkan bertahap di `src/styles.css` (1536px, 1920px, 2400px). Jangan mengganti `max-w-6xl` dengan lebar tetap di halaman, dan jangan menurunkan nilainya; kalau tidak, ruang kosong di kiri dan kanan muncul lagi saat layar lebar atau peramban di-zoom keluar.
- Judul bagian di halaman dalam memakai `SectionTitle` dari `ornament.tsx`, bukan `h2` lepas, agar gaya tetap seragam.
- Bilah samping panel kelola (`kelola.tsx`) berlatar `bg-forest`, jadi semua teks dan tombol di dalamnya memakai warna terang (`text-sheet`, `bg-sun`). Jangan menempelkan kelas teks gelap (`text-ink`, `text-muted`) di sana tanpa latar terang.
- Penyaring kategori ekskul tetap memakai `aria-pressed` dan `role="group"`; jangan dihapus saat mengubah gayanya.

