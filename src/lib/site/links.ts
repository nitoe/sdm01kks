/**
 * Tautan ke aplikasi di subdomain (terpisah dari portal).
 * Portal hanya mengarahkan; login dan otorisasi ada di masing-masing app.
 *
 * - staff: khusus guru/staf (penilaian, sarpras) — jangan di menu publik
 * - learner: guru + murid (lms, perpustakaan)
 * - keuangan: tidak digabung ke portal (mitra bank)
 */

export type SchoolAppLink = {
  id: string;
  title: string;
  description: string;
  /** URL masuk; null = belum live, tampilkan sebagai "segera" */
  href: string | null;
  /** true = tautan aktif boleh diklik */
  live: boolean;
};

/** Kompatibel dengan pemakaian lama di /masuk. */
export const PENILAIAN_LOGIN_URL =
  "https://penilaian.sdmuhammadiyah01kks.sch.id/login";

/** Khusus guru/staf — off-limit pengunjung, murid, orang tua. */
export const STAFF_APPS: readonly SchoolAppLink[] = [
  {
    id: "penilaian",
    title: "Penilaian",
    description: "Input nilai dan rapor. Memakai akun aplikasi penilaian.",
    href: PENILAIAN_LOGIN_URL,
    live: true,
  },
  {
    id: "sarpras",
    title: "Sarana dan prasarana",
    description: "Inventaris dan pemeliharaan fasilitas sekolah.",
    href: null,
    live: false,
  },
] as const;

/** Untuk guru dan murid (bukan pengunjung umum). */
export const LEARNER_APPS: readonly SchoolAppLink[] = [
  {
    id: "lms",
    title: "LMS sekolah",
    description: "Pembelajaran daring dan materi kelas.",
    href: null,
    live: false,
  },
  {
    id: "perpustakaan",
    title: "Perpustakaan digital",
    description: "Katalog dan koleksi digital sekolah.",
    href: null,
    live: false,
  },
] as const;
