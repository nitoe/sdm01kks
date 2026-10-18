import type { ProgramGroup, ProgramGroupId, SiteContent } from "./types";

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
  welcome: {
    kicker: "Sambutan kepala sekolah",
    title: "Setiap anak di sini kami kenal namanya.",
    name: "Dwi Sanderayanti",
    role: "Kepala SD Muhammadiyah 01 Kukusan",
    body: "Assalamu'alaikum warahmatullahi wabarakatuh.\n\nBapak dan Ibu yang kami hormati, selamat datang di SD Muhammadiyah 01 Kukusan. Sejak 1981 sekolah ini menemani anak-anak belajar membaca, berhitung, dan juga belajar adab. Sholat, doa, dan sikap di kelas kami anggap bagian dari hari, bukan kegiatan yang terpisah.\n\nKami ingin setiap anak merasa dikenal. Datanglah, lihat ruang kelas, dan bicaralah dengan kami. Pintu sekolah ini terbuka bagi keluarga Kukusan.\n\nWassalamu'alaikum warahmatullahi wabarakatuh.",
    image: "/media/kepala.jpg",
    imageCaption: "Ilustrasi kepala sekolah. Ganti dengan foto resmi lewat panel kelola.",
  },
  values: [
    {
      id: "adab",
      title: "Adab dulu",
      text: "Sholat, doa, dan adab di kelas menjadi ritme harian bersama belajar.",
      image: "/media/nilai-adab.jpg",
      visible: true,
    },
    {
      id: "quran",
      title: "Dekat Al-Qur'an",
      text: "BTQ bertahap agar setiap anak nyaman membaca dan mengenal kitab suci.",
      image: "/media/nilai-quran.jpg",
      visible: true,
    },
    {
      id: "akrab",
      title: "Akrab di Kukusan",
      text: "Sekolah dekat dengan orang tua dan lingkungan — aman dan bersahabat.",
      image: "/media/nilai-akrab.jpg",
      visible: true,
    },
  ],
  visi:
    "Terwujudnya peserta didik yang beriman, berakhlak mulia, berilmu, dan mandiri, dengan landasan Al-Qur'an dan Sunnah.",
  misi: [
    "Menyelenggarakan pembelajaran yang menumbuhkan adab, rasa ingin tahu, dan kemandirian.",
    "Membiasakan ibadah dan bacaan Al-Qur'an dalam keseharian sekolah.",
    "Menjalin kerjasama yang hangat dengan orang tua dan lingkungan Kukusan.",
    "Menjaga sekolah sebagai tempat yang aman, rapi, dan menyenangkan bagi anak.",
  ],
  programGroups: [
    {
      id: "intrakurikuler",
      title: "Intrakurikuler",
      summary: "Pelajaran di kelas: membaca, berhitung, dan Al-Qur'an yang menjadi ritme setiap hari.",
      body: "Intrakurikuler adalah pembelajaran yang berlangsung di dalam jam pelajaran. Anak belajar sesuai tingkatan, didampingi guru, dengan adab sebagai bagian dari jam belajar — bukan kegiatan yang terpisah.",
      image: "/media/program-intra.jpg",
      visible: true,
    },
    {
      id: "kokurikuler",
      title: "Kokurikuler",
      summary: "Kegiatan yang memperdalam pelajaran, dikerjakan bersama di luar jam mata pelajaran.",
      body: "Kokurikuler menguatkan apa yang sudah dipelajari di kelas. Anak mengerjakan proyek sederhana, membaca bersama, atau berlatih kebiasaan baik dengan pendampingan guru.",
      image: "/media/program-ko.jpg",
      visible: true,
    },
    {
      id: "ekstrakurikuler",
      title: "Ekstrakurikuler",
      summary: "Kegiatan pilihan di luar jam belajar untuk menumbuhkan minat, kemandirian, dan kerjasama.",
      body: "Ekstrakurikuler dipilih sesuai minat anak. Pramuka dan kegiatan lain melatih keberanian mencoba, bekerjasama, dan menjaga diri di luar ruang kelas.",
      image: "/media/program-ekstra.jpg",
      visible: true,
    },
  ],
  programs: [
    {
      id: "ibadah",
      group: "kokurikuler",
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
      group: "intrakurikuler",
      title: "Baca tulis Al-Qur'an",
      summary: "Anak-anak dilatih membaca dan menulis Al-Qur'an secara bertahap, sesuai kemampuan masing-masing kelas.",
      body: "Program BTQ disusun per tingkat kemampuan. Tujuan utamanya agar setiap peserta didik nyaman dengan Al-Qur'an sejak dini.",
      cover: "/media/kelas.jpg",
      media: [],
      visible: true,
    },
    {
      id: "pramuka",
      group: "ekstrakurikuler",
      title: "Pramuka",
      summary: "Latihan pramuka menumbuhkan kemandirian, kerjasama, dan keberanian mencoba hal baru di luar kelas.",
      body: "Latihan pramuka digelar secara berkala. Kegiatan lapangan dilengkapi dokumentasi foto dan tautan video bila ada.",
      cover: "/media/lapangan.jpg",
      media: [{ id: "pramuka-yt", kind: "url", src: "https://www.youtube.com", caption: "Contoh tautan video kegiatan" }],
      visible: true,
    },
    {
      id: "literasi",
      group: "intrakurikuler",
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
      body: "SD Muhammadiyah 01 Kukusan berdiri berdasarkan SK 2874/I-19/JB-42/1981 pada 17 Juli 1981, dan beroperasi sejak 8 Januari 1988. Sekolah berada di Jalan Kh. Ahmad Dahlan, Kukusan, dan dinaungi Yayasan Pimpinan Daerah Muhammadiyah Kota Depok.",
      image: "/media/halaman.jpg",
      visible: true,
    },
    {
      id: "belajar-pagi",
      date: "2026-10-08",
      title: "Belajar berlangsung pagi, Senin hingga Sabtu",
      excerpt: "Kegiatan belajar di sekolah ini berlangsung pada pagi hari, enam hari dalam sepekan.",
      body: "SD Muhammadiyah 01 Kukusan menyelenggarakan pembelajaran pagi, Senin sampai Sabtu. Orang tua dapat menyesuaikan antar-jemput dengan jam tersebut. Perubahan jadwal, bila ada, disampaikan lewat pengumuman.",
      image: "/media/kelas.jpg",
      visible: true,
    },
    {
      id: "kunjungan-kelas",
      date: "2026-09-20",
      title: "Orang tua diajak melihat ruang kelas",
      excerpt: "Keluarga dapat datang dan mengenal ritme belajar anak sebelum memutuskan.",
      body: "Sekolah membuka kesempatan bagi orang tua untuk melihat ruang kelas dan berbicara dengan guru. Kunjungan diatur agar tidak mengganggu jam belajar anak.",
      image: "/media/nilai-akrab.jpg",
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
      image: "/media/nilai-adab.jpg",
      note: "Tim kelas 5 mewakili sekolah pada lomba cerdas cermat agama tingkat kota.",
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
      image: "/media/nilai-quran.jpg",
      note: "Hafalan Juz 30 dibawakan dengan tartil pada lomba tingkat kecamatan.",
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
      image: "/media/program-ekstra.jpg",
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
      note: "Membaca nyaring di depan juri pada lomba literasi di sekolah.",
      visible: true,
    },
  ],
  show: {
    sambutan: true,
    nilai: true,
    pengumuman: true,
    program: true,
    berita: true,
    galeri: true,
    visi: true,
    prestasi: true,
  },
};

function normalizeWelcome(
  raw: Partial<SiteContent["welcome"]> | null | undefined,
  base: SiteContent["welcome"],
): SiteContent["welcome"] {
  if (!raw || typeof raw !== "object") return base;
  const text = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);
  return {
    kicker: text(raw.kicker, base.kicker),
    title: text(raw.title, base.title),
    name: text(raw.name, base.name),
    role: text(raw.role, base.role),
    body: text(raw.body, base.body),
    image: text(raw.image, base.image),
    imageCaption: text(raw.imageCaption, base.imageCaption),
  };
}

function normalizeValue(item: Partial<SiteContent["values"][number]> | null | undefined) {
  if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id) return null;
  return {
    id: item.id,
    title: typeof item.title === "string" ? item.title : "",
    text: typeof item.text === "string" ? item.text : "",
    image: typeof item.image === "string" ? item.image : "",
    visible: item.visible !== false,
  };
}

const DEFAULT_GROUP: Record<string, ProgramGroupId> = {
  ibadah: "kokurikuler",
  btq: "intrakurikuler",
  literasi: "intrakurikuler",
  pramuka: "ekstrakurikuler",
};

function asGroup(value: unknown, id: string): ProgramGroupId {
  if (value === "intrakurikuler" || value === "kokurikuler" || value === "ekstrakurikuler") return value;
  return DEFAULT_GROUP[id] ?? "intrakurikuler";
}

function normalizeProgramGroups(raw: unknown, base: ProgramGroup[]): ProgramGroup[] {
  const saved = Array.isArray(raw) ? raw : [];
  return base.map((item) => {
    const found = saved.find((entry): entry is Record<string, unknown> => {
      return Boolean(entry) && typeof entry === "object" && "id" in entry && entry.id === item.id;
    });
    if (!found) return item;
    const text = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);
    return {
      id: item.id,
      title: text(found.title, item.title),
      summary: text(found.summary, item.summary),
      body: text(found.body, item.body),
      image: text(found.image, item.image),
      visible: typeof found.visible === "boolean" ? found.visible : item.visible,
    };
  });
}

function normalizeProgram(item: Partial<SiteContent["programs"][number]> | null | undefined) {
  if (!item || typeof item !== "object") return null;
  return {
    id: typeof item.id === "string" ? item.id : "",
    group: asGroup(item.group, typeof item.id === "string" ? item.id : ""),
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

function normalizeNews(raw: unknown, base: SiteContent["news"]): SiteContent["news"] {
  if (!Array.isArray(raw)) return base;
  const saved = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !item.id) return [];
    const fallback = base.find((row) => row.id === item.id);
    const text = (value: unknown, spare: string) => (typeof value === "string" && value.trim() ? value : spare);
    return [
      {
        id: item.id,
        date: text(item.date, fallback?.date ?? ""),
        title: text(item.title, fallback?.title ?? ""),
        excerpt: text(item.excerpt, fallback?.excerpt ?? ""),
        body: text(item.body, fallback?.body ?? ""),
        image: text(item.image, fallback?.image ?? ""),
        visible: typeof item.visible === "boolean" ? item.visible : (fallback?.visible ?? true),
      },
    ];
  });
  if (!saved.length) return base;
  const ids = new Set(saved.map((item) => item.id));
  return [...saved, ...base.filter((item) => !ids.has(item.id))];
}

function normalizeAchievements(raw: unknown, base: SiteContent["achievements"]): SiteContent["achievements"] {
  if (!Array.isArray(raw)) return base;
  const items = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !item.id) return [];
    const fallback = base.find((row) => row.id === item.id);
    const text = (value: unknown, spare: string) => (typeof value === "string" && value.trim() ? value : spare);
    return [
      {
        id: item.id,
        title: text(item.title, fallback?.title ?? ""),
        student: text(item.student, fallback?.student ?? ""),
        category: text(item.category, fallback?.category ?? ""),
        year: text(item.year, fallback?.year ?? ""),
        level: text(item.level, fallback?.level ?? ""),
        result: text(item.result, fallback?.result ?? ""),
        image: text(item.image, fallback?.image ?? ""),
        note: text(item.note, fallback?.note ?? ""),
        visible: typeof item.visible === "boolean" ? item.visible : (fallback?.visible ?? true),
      },
    ];
  });
  return items.length ? items : base;
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
    welcome: normalizeWelcome(raw.welcome, base.welcome),
    values: Array.isArray(raw.values)
      ? raw.values.map(normalizeValue).filter((item): item is NonNullable<typeof item> => Boolean(item))
      : base.values,
    show: { ...base.show, ...(raw.show ?? {}) },
    misi: Array.isArray(raw.misi) ? raw.misi.filter((item) => typeof item === "string") : base.misi,
    programGroups: normalizeProgramGroups(raw.programGroups, base.programGroups),
    programs: programs.length ? programs : base.programs,
    announcements: Array.isArray(raw.announcements) ? raw.announcements : base.announcements,
    news: normalizeNews(raw.news, base.news),
    gallery: Array.isArray(raw.gallery) ? raw.gallery : base.gallery,
    achievements: normalizeAchievements(raw.achievements, base.achievements),
    visi: typeof raw.visi === "string" ? raw.visi : base.visi,
  };
}
