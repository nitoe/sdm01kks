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
  },
  hero: {
    kicker: "Sekolah Dasar · Kota Depok",
    title: "Mendidik anak Kukusan dengan adab dan ilmu.",
    lead: "SD Muhammadiyah 01 Kukusan adalah sekolah dasar swasta terakreditasi A. Sejak 1981, sekolah ini menemani anak-anak belajar, beribadah, dan tumbuh di lingkungan yang akrab — di bawah naungan Pimpinan Daerah Muhammadiyah Kota Depok.",
    image: "/media/halaman.jpg",
    imageCaption: "Ilustrasi suasana halaman sekolah. Ganti dengan foto resmi lewat panel kelola.",
  },
  visi: "Terwujudnya peserta didik yang beriman, berakhlak mulia, berilmu, dan mandiri, dengan landasan Al-Qur'an dan Sunnah.",
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
      visible: true,
    },
    {
      id: "btq",
      title: "Baca tulis Al-Qur'an",
      summary:
        "Anak-anak dilatih membaca dan menulis Al-Qur'an secara bertahap, sesuai kemampuan masing-masing kelas.",
      visible: true,
    },
    {
      id: "pramuka",
      title: "Pramuka",
      summary:
        "Latihan pramuka menumbuhkan kemandirian, kerjasama, dan keberanian mencoba hal baru di luar kelas.",
      visible: true,
    },
    {
      id: "literasi",
      title: "Literasi",
      summary:
        "Kebiasaan membaca di sekolah agar anak nyaman dengan buku, cerita, dan pertanyaan mereka sendiri.",
      visible: true,
    },
  ],
  announcements: [
    {
      id: "situs-baru",
      date: "2026-10-12",
      title: "Situs sekolah ini sedang disusun",
      excerpt:
        "Halaman ini adalah wajah baru sdmuhammadiyah01kks.sch.id. Pengumuman resmi akan diperbarui oleh sekolah.",
      body: "Situs SD Muhammadiyah 01 Kukusan sedang dipindahkan ke alamat baru. Informasi yang tampil di halaman ini dapat diubah oleh admin sekolah: pengumuman, berita, program, galeri, dan profil.\n\nOrang tua dan tamu dapat membaca situs tanpa masuk. Perubahan isi hanya dilakukan lewat panel kelola.",
      visible: true,
    },
    {
      id: "jam-belajar",
      date: "2026-10-01",
      title: "Kegiatan belajar berlangsung pagi, Senin hingga Sabtu",
      excerpt: "Sekolah menyelenggarakan pembelajaran pada pagi hari, enam hari dalam sepekan.",
      body: "SD Muhammadiyah 01 Kukusan menyelenggarakan pembelajaran pagi selama enam hari, Senin sampai Sabtu. Untuk urusan administrasi, silakan menghubungi sekolah pada jam kerja melalui telepon atau datang ke alamat di Jl. Kh. A. Dahlan Kukusan II.",
      visible: true,
    },
  ],
  news: [
    {
      id: "mengenal-sekolah",
      date: "2026-10-12",
      title: "Sekolah di Jalan Kh. Ahmad Dahlan, Kukusan",
      excerpt:
        "Berdiri 17 Juli 1981, terakreditasi A, dan berada di bawah yayasan PDM Kota Depok.",
      body: "SD Muhammadiyah 01 Kukusan berdiri berdasarkan SK 2874/I-19/JB-42/1981 pada 17 Juli 1981, dan beroperasi sejak 8 Januari 1988. Sekolah berada di Jalan Kh. A. Dahlan Kukusan II, Kelurahan Kukusan, Kecamatan Beji, Kota Depok.\n\nAkreditasi sekolah adalah A (SK 02.00/330/BAP-SM/XI/2017). NPSN 20228835. Naungan yayasan: Pimpinan Daerah Muhammadiyah Kota Depok.\n\nTeks visi, misi, dan program di situs ini adalah naskah awal agar halaman tidak kosong. Sekolah dapat menyesuaikannya dengan rumusan resmi lewat panel kelola.",
      visible: true,
    },
  ],
  gallery: [
    {
      id: "halaman",
      src: "/media/halaman.jpg",
      caption: "Ilustrasi halaman dan selasar. Belum foto resmi sekolah.",
      visible: true,
    },
    {
      id: "kelas",
      src: "/media/kelas.jpg",
      caption: "Ilustrasi ruang kelas.",
      visible: true,
    },
    {
      id: "musala",
      src: "/media/musala.jpg",
      caption: "Ilustrasi ruang ibadah.",
      visible: true,
    },
    {
      id: "pustaka",
      src: "/media/pustaka.jpg",
      caption: "Ilustrasi pojok baca.",
      visible: true,
    },
    {
      id: "lapangan",
      src: "/media/lapangan.jpg",
      caption: "Ilustrasi lapangan.",
      visible: true,
    },
  ],
  show: {
    pengumuman: true,
    program: true,
    berita: true,
    galeri: true,
    visi: true,
  },
};

export function mergeContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  if (!raw || typeof raw !== "object") return structuredClone(seedContent);
  const base = structuredClone(seedContent);
  return {
    ...base,
    ...raw,
    identity: { ...base.identity, ...(raw.identity ?? {}) },
    hero: { ...base.hero, ...(raw.hero ?? {}) },
    show: { ...base.show, ...(raw.show ?? {}) },
    misi: Array.isArray(raw.misi) ? raw.misi.filter((item) => typeof item === "string") : base.misi,
    programs: Array.isArray(raw.programs) ? raw.programs : base.programs,
    announcements: Array.isArray(raw.announcements) ? raw.announcements : base.announcements,
    news: Array.isArray(raw.news) ? raw.news : base.news,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : base.gallery,
    visi: typeof raw.visi === "string" ? raw.visi : base.visi,
  };
}
