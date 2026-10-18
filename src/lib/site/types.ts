export type ProgramMedia = {
  id: string;
  kind: "image" | "video" | "url";
  src: string;
  caption: string;
};

export type ProgramImage = {
  id: string;
  src: string;
  caption: string;
};

export type ProgramGroupId = "intrakurikuler" | "kokurikuler" | "ekstrakurikuler";

export type ProgramGroup = {
  id: ProgramGroupId;
  title: string;
  summary: string;
  body: string;
  image: string;
  visible: boolean;
};

export type ProgramAchievement = {
  id: string;
  year: string;
  title: string;
  result: string;
};

export type Program = {
  id: string;
  group: ProgramGroupId;
  title: string;
  summary: string;
  body: string;
  /** Gambar pertama dari `images`; dipakai di kartu daftar. */
  cover?: string;
  images?: ProgramImage[];
  category?: string;
  contactName?: string;
  contactPhone?: string;
  media: ProgramMedia[];
  activities?: string[];
  achievements?: ProgramAchievement[];
  visible: boolean;
};

export type Article = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  image?: string;
  visible: boolean;
};

export type GalleryItem = {
  id: string;
  src: string;
  caption: string;
  visible: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  student: string;
  category: string;
  year: string;
  level: string;
  result: string;
  image?: string;
  note: string;
  visible: boolean;
};

export type Welcome = {
  kicker: string;
  title: string;
  name: string;
  role: string;
  body: string;
  image: string;
  imageCaption: string;
};

export type SchoolValue = {
  id: string;
  title: string;
  text: string;
  image: string;
  visible: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  photo?: string;
  duties: string;
  visible: boolean;
};

export type SiteContent = {
  identity: {
    name: string;
    shortName: string;
    tagline: string;
    domain: string;
    npsn: string;
    accreditation: string;
    founded: string;
    skFounded: string;
    operational: string;
    principal: string;
    address: string;
    phone: string;
    email: string;
    foundation: string;
    hours: string;
    studentsNote: string;
    logoUrl: string;
  };
  hero: {
    kicker: string;
    title: string;
    lead: string;
    image: string;
    imageCaption: string;
  };
  welcome: Welcome;
  values: SchoolValue[];
  staff: StaffMember[];
  visi: string;
  misi: string[];
  programGroups: ProgramGroup[];
  programs: Program[];
  announcements: Article[];
  news: Article[];
  gallery: GalleryItem[];
  achievements: Achievement[];
  show: {
    sambutan: boolean;
    nilai: boolean;
    pengumuman: boolean;
    program: boolean;
    berita: boolean;
    galeri: boolean;
    visi: boolean;
    prestasi: boolean;
  };
};

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};
