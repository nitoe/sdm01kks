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
