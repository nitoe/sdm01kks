export type ProgramMedia = {
  id: string;
  kind: "image" | "video" | "url";
  src: string;
  caption: string;
};

export type Program = {
  id: string;
  title: string;
  summary: string;
  body: string;
  cover?: string;
  media: ProgramMedia[];
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
  visi: string;
  misi: string[];
  programs: Program[];
  announcements: Article[];
  news: Article[];
  gallery: GalleryItem[];
  achievements: Achievement[];
  show: {
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
