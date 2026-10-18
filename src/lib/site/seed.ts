import type { SiteContent } from "./types";

export const seedContent: SiteContent = {
  identity: {
    name: "SD Muhammadiyah 01 Kukusan",
    shortName: "SDM 01 Kukusan",
    tagline: "Beriman, berilmu, dan berakhlak di jantung Kukusan.",
    domain: "sdmuhammadiyah01kks.sch.id",
    npsn: "20228835",
    accreditation: "A",
    founded: "17 Juli 1981",
    skFounded: "2874/I-19/JB-42/1981",
    operational: "8 Januari 1988",
    principal: "Dwi Sanderayanti",
    address:
      "Jl. Kh. A. Dahlan Kukusan II RT 06/05, Kel. Kukusan, Kec. Beji, Kota Depok, Jawa Barat 16425",
    phone: "021-7862947",
    email: "sd.muhammadiyah01kukusan@gmail.com",
    foundation: "Yayasan Pimpinan Daerah Muhammadiyah (PDM) Kota Depok",
    hours: "Senin–Sabtu, pagi hari",
    studentsNote: "Sekitar 370 peserta didik",
    logoUrl: "",
  },
  hero: {
    kicker: "Sekolah Dasar Islam · Kota Depok",
    title: "Tempat anak tumbuh dengan adab, ilmu, dan Al-Qur'an.",
    lead: "Sejak 1981, SD Muhammadiyah 01 Kukusan menemani anak-anak belajar dan beribadah di lingkungan yang akrab — di bawah naungan Pimpinan Daerah Muhammadiyah Kota Depok.",
    image: "/media/halaman.jpg",
    imageCaption: "Ilustrasi suasana sekolah. Ganti dengan foto resmi lewat panel kelola.",
  },
  visi:
    "Terwujudnya peserta didik yang beriman, berakhlak mulia, berilmu, dan mandiri, dengan landasan Al-Qur'an dan Sunnah.",
  misi: [
    "Menyelenggarakan pembelajaran yang menumbuhkan adab, rasa ingin tahu, dan kemandirian.",
    "Membiasakan ibadah dan bacaan Al-Qur'an dalam keseharian sekolah.",
    "Menjalin kerjasama yang hangat dengan orang tua dan lingkungan Kukusan.",
    "Menjaga sekolah sebagai tempat yang aman, rapi, dan menyenangkan bagi anak.",
  ],
  programs: [
    {
      id: "ibadah",
      title: "Pembiasaan ibadah",
      summary:
        "Sholat berjamaah, doa harian, dan adab di kelas menjadi bagian dari ritme pagi, bukan kegiatan yang terpisah dari belajar.",
      body: "Setiap pagi, anak-anak dibiasakan berdoa bersama sebelum belajar. Sholat berjamaah dan adab di kelas dilatih secara bertahap agar menjadi kebiasaan.\n\nGuru mendampingi dengan keteladanan.",
      cover: "/media/musala.jpg",
      media: [{ id: "ibadah-1", kind: "image", src: "/media/musala.jpg", caption: "Suasana ruang ibadah sekolah" }],
      visible: true,
    },
    {
      id: "btq",
      title: "Baca tulis Al-Qur'an",
      summary: "Anak-anak dilatih membaca dan menulis Al-Qur'an secara bertahap, sesuai kemampuan masing-masing kelas.",
      body: "Program BTQ disusun per tingkat kemampuan. Tujuan utamanya agar setiap peserta didik nyaman dengan Al-Qur'an sejak dini.",
      cover: "/media/kelas.jpg",
      media: [],
      visible: true,
    },
    {
      id: "pramuka",
      title: "Pramuka",
      summary: "Latihan pramuka menumbuhkan kemandirian, kerjasama, dan keberanian mencoba hal baru di luar kelas.",
      body: "Latihan pramuka digelar secara berkala. Kegiatan lapangan dilengkapi dokumentasi foto dan tautan video bila ada.",
      cover: "/media/lapangan.jpg",
      media: [{ id: "pramuka-yt", kind: "url", src: "https://www.youtube.com", caption: "Contoh tautan video kegiatan" }],
      visible: true,
    },
    {
      id: "literasi",
      title: "Literasi",
      summary: "Kebiasaan membaca di sekolah agar anak nyaman dengan buku, cerita, dan pertanyaan mereka sendiri.",
      body: "Pojok baca dan waktu literasi membantu anak mengenal buku sebagai teman.",
      cover: "/media/pustaka.jpg",
      media: [],
      visible: true,
    },
  ],
  announcements: [
    {
      id: "situs-baru",
      date: "2026-10-12",
      title: "Situs sekolah ini sedang disusun",
      excerpt: "Halaman ini adalah wajah baru sdmuhammadiyah01kks.sch.id.",
      body: "Situs SD Muhammadiyah 01 Kukusan sedang dipindahkan ke alamat baru. Orang tua dan tamu dapat membaca situs tanpa masuk.",
      visible: true,
    },
    {
      id: "jam-belajar",
      date: "2026-10-01",
      title: "Kegiatan belajar berlangsung pagi, Senin hingga Sabtu",
      excerpt: "Sekolah menyelenggarakan pembelajaran pada pagi hari, enam hari dalam sepekan.",
      body: "SD Muhammadiyah 01 Kukusan menyelenggarakan pembelajaran pagi selama enam hari, Senin sampai Sabtu.",
      visible: true,
    },
  ],
  news: [
    {
      id: "mengenal-sekolah",
      date: "2026-10-12",
      title: "Sekolah di Jalan Kh. Ahmad Dahlan, Kukusan",
      excerpt: "Berdiri 17 Juli 1981, terakreditasi A, dan berada di bawah yayasan PDM Kota Depok.",
      body: "SD Muhammadiyah 01 Kukusan berdiri berdasarkan SK 2874/I-19/JB-42/1981 pada 17 Juli 1981, dan beroperasi sejak 8 Januari 1988.",
      visible: true,
    },
  ],
  gallery: [
    { id: "halaman", src: "/media/halaman.jpg", caption: "Ilustrasi halaman dan selasar.", visible: true },
    { id: "kelas", src: "/media/kelas.jpg", caption: "Ilustrasi ruang kelas.", visible: true },
    { id: "musala", src: "/media/musala.jpg", caption: "Ilustrasi ruang ibadah.", visible: true },
    { id: "pustaka", src: "/media/pustaka.jpg", caption: "Ilustrasi pojok baca.", visible: true },
    { id: "lapangan", src: "/media/lapangan.jpg", caption: "Ilustrasi lapangan.", visible: true },
  ],
  achievements: [
    {
      id: "prestasi-1",
      title: "Lomba Cerdas Cermat Agama",
      student: "Tim kelas 5",
      category: "Cerdas cermat",
      year: "2025",
      level: "Kota",
      result: "Juara 2",
      image: "/media/kelas.jpg",
      note: "Contoh catatan prestasi. Ganti lewat panel kelola.",
      visible: true,
    },
    {
      id: "prestasi-2",
      title: "Lomba Tahfidz Juz 30",
      student: "Ananda (kelas 4)",
      category: "Tahfidz",
      year: "2025",
      level: "Kecamatan",
      result: "Juara 1",
      image: "",
      note: "",
      visible: true,
    },
    {
      id: "prestasi-3",
      title: "Lomba Pramuka Penggalang",
      student: "Regu putra",
      category: "Pramuka",
      year: "2024",
      level: "Kota",
      result: "Juara 3",
      image: "/media/lapangan.jpg",
      note: "Partisipasi kegiatan pramuka tingkat kota.",
      visible: true,
    },
    {
      id: "prestasi-4",
      title: "Lomba Literasi Membaca",
      student: "Ananda (kelas 3)",
      category: "Literasi",
      year: "2024",
      level: "Sekolah",
      result: "Juara 1",
      image: "/media/pustaka.jpg",
      note: "",
      visible: true,
    },
  ],
  show: {
    pengumuman: true,
    program: true,
    berita: true,
    galeri: true,
    visi: true,
    prestasi: true,
  },
};

function normalizeProgram(item: Partial<SiteContent["programs"][number]> | null | undefined) {
  if (!item || typeof item !== "object") return null;
  return {
    id: typeof item.id === "string" ? item.id : "",
    title: typeof item.title === "string" ? item.title : "",
    summary: typeof item.summary === "string" ? item.summary : "",
    body: typeof item.body === "string" ? item.body : "",
    cover: typeof item.cover === "string" ? item.cover : "",
    media: Array.isArray(item.media)
      ? item.media
          .filter((m) => m && typeof m === "object")
          .map((m) => ({
            id: typeof m.id === "string" ? m.id : "",
            kind: m.kind === "video" || m.kind === "url" ? m.kind : ("image" as const),
            src: typeof m.src === "string" ? m.src : "",
            caption: typeof m.caption === "string" ? m.caption : "",
          }))
      : [],
    visible: Boolean(item.visible),
  };
}

export function mergeContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  if (!raw || typeof raw !== "object") return structuredClone(seedContent);
  const base = structuredClone(seedContent);
  const programs = Array.isArray(raw.programs)
    ? raw.programs.map(normalizeProgram).filter((p): p is NonNullable<typeof p> => Boolean(p?.id))
    : base.programs;
  return {
    ...base,
    ...raw,
    identity: { ...base.identity, ...(raw.identity ?? {}) },
    hero: { ...base.hero, ...(raw.hero ?? {}) },
    show: { ...base.show, ...(raw.show ?? {}) },
    misi: Array.isArray(raw.misi) ? raw.misi.filter((item) => typeof item === "string") : base.misi,
    programs: programs.length ? programs : base.programs,
    announcements: Array.isArray(raw.announcements) ? raw.announcements : base.announcements,
    news: Array.isArray(raw.news) ? raw.news : base.news,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : base.gallery,
    achievements: Array.isArray(raw.achievements) ? raw.achievements : base.achievements,
    visi: typeof raw.visi === "string" ? raw.visi : base.visi,
  };
}
