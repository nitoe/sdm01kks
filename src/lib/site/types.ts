export type Program = {
  id: string;
  title: string;
  summary: string;
  visible: boolean;
};

export type Article = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  visible: boolean;
};

export type GalleryItem = {
  id: string;
  src: string;
  caption: string;
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
  show: {
    pengumuman: boolean;
    program: boolean;
    berita: boolean;
    galeri: boolean;
    visi: boolean;
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
