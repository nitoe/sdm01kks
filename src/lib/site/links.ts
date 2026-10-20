/**
 * Tautan ke aplikasi di subdomain (terpisah dari portal).
 * Portal hanya mengarahkan; login dan otorisasi ada di masing-masing app.
 *
 * - staff: khusus guru/staf (penilaian, sarpras) — jangan di menu publik
 * - learner: guru + murid (lms, perpustakaan)
 * - keuangan / PPDB: tidak digabung ke portal (mitra bank / lembaga keuangan)
 */

export type SchoolAppAudience = "staff" | "learner";

export type SchoolAppLink = {
  id: string;
  title: string;
  description: string;
  /** Satu kalimat untuk kartu katalog */
  summary: string;
  audience: SchoolAppAudience;
  /** Label singkat di badge kartu */
  audienceLabel: string;
  /** URL masuk; null = belum live */
  href: string | null;
  live: boolean;
};

/** Kompatibel dengan pemakaian lama. */
export const PENILAIAN_LOGIN_URL =
  "https://penilaian.sdmuhammadiyah01kks.sch.id/login";

export const SARPRAS_URL = "https://sarpras.sdmuhammadiyah01kks.sch.id/";

/** Khusus guru/staf — off-limit pengunjung, murid, orang tua. */
export const STAFF_APPS: readonly SchoolAppLink[] = [
  {
    id: "penilaian",
    title: "Penilaian",
    description: "Input nilai dan rapor. Memakai akun aplikasi penilaian.",
    summary: "Nilai harian, ujian, dan rapor digital untuk guru.",
    audience: "staff",
    audienceLabel: "Guru & staf",
    href: PENILAIAN_LOGIN_URL,
    live: true,
  },
  {
    id: "sarpras",
    title: "Sarana & prasarana",
    description: "Inventaris dan pemeliharaan fasilitas sekolah.",
    summary: "Pencatatan inventaris, ruang, dan perawatan fasilitas.",
    audience: "staff",
    audienceLabel: "Guru & staf",
    href: SARPRAS_URL,
    live: true,
  },
] as const;

/** Untuk guru dan murid (bukan pengunjung umum). */
export const LEARNER_APPS: readonly SchoolAppLink[] = [
  {
    id: "perpustakaan",
    title: "Perpustakaan digital",
    description: "Katalog dan koleksi digital sekolah. Direncanakan online minggu ini.",
    summary: "Katalog buku, bacaan digital, dan riwayat pinjam.",
    audience: "learner",
    audienceLabel: "Murid & guru",
    href: null,
    live: false,
  },
  {
    id: "lms",
    title: "LMS sekolah",
    description: "Pembelajaran daring dan materi kelas. Menyusul setelah perpustakaan.",
    summary: "Materi kelas, tugas, dan aktivitas belajar daring.",
    audience: "learner",
    audienceLabel: "Murid & guru",
    href: null,
    live: false,
  },
] as const;

/** Semua app dalam urutan katalog (staf dulu, lalu murid). */
export const ALL_SCHOOL_APPS: readonly SchoolAppLink[] = [...STAFF_APPS, ...LEARNER_APPS];
