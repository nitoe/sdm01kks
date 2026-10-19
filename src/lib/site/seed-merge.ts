import type { ProgramGroup, ProgramGroupId, SiteContent, StaffMember } from "./types";
import { seedContent } from "./seed";

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
    visible: typeof item.visible === "boolean" ? item.visible : true,
  };
}

function normalizeStaff(
  raw: SiteContent["staff"] | null | undefined,
  base: SiteContent["staff"],
): StaffMember[] {
  if (!Array.isArray(raw)) return base;
  const items = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !item.id) return [];
    return [
      {
        id: item.id,
        name: typeof item.name === "string" ? item.name : "",
        role: typeof item.role === "string" ? item.role : "",
        photo: typeof item.photo === "string" ? item.photo : "",
        duties: typeof item.duties === "string" ? item.duties : "",
        visible: typeof item.visible === "boolean" ? item.visible : true,
      },
    ];
  });
  return items.length ? items : base;
}

function normalizeProgramGroups(
  raw: SiteContent["programGroups"] | null | undefined,
  base: SiteContent["programGroups"],
): ProgramGroup[] {
  if (!Array.isArray(raw)) return base;
  const allowed: ProgramGroupId[] = ["intrakurikuler", "kokurikuler", "ekstrakurikuler"];
  const items = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const id = item.id as string;
    if (!allowed.includes(id as ProgramGroupId)) return [];
    return [
      {
        id: id as ProgramGroupId,
        title: typeof item.title === "string" ? item.title : "",
        summary: typeof item.summary === "string" ? item.summary : "",
        body: typeof item.body === "string" ? item.body : "",
        image: typeof item.image === "string" ? item.image : "",
        visible: typeof item.visible === "boolean" ? item.visible : true,
      },
    ];
  });
  return items.length ? items : base;
}

function asGroup(value: unknown, fallbackId: string): ProgramGroupId {
  if (value === "intrakurikuler" || value === "kokurikuler" || value === "ekstrakurikuler") return value;
  if (fallbackId.includes("ekstra")) return "ekstrakurikuler";
  if (fallbackId.includes("ko")) return "kokurikuler";
  return "intrakurikuler";
}

function normalizeProgram(item: Partial<SiteContent["programs"][number]> | null | undefined) {
  if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id) return null;
  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
          .filter((img) => img && typeof img === "object")
          .map((img) => ({
            id: typeof img.id === "string" ? img.id : "",
            src: typeof img.src === "string" ? img.src : "",
            caption: typeof img.caption === "string" ? img.caption : "",
          }))
      : item.cover
        ? [{ id: `${item.id}-cover`, src: String(item.cover), caption: "" }]
        : [];
  return {
    id: typeof item.id === "string" ? item.id : "",
    group: asGroup(item.group, typeof item.id === "string" ? item.id : ""),
    title: typeof item.title === "string" ? item.title : "",
    summary: typeof item.summary === "string" ? item.summary : "",
    body: typeof item.body === "string" ? item.body : "",
    cover: images[0]?.src ?? "",
    images,
    contactName: typeof item.contactName === "string" ? item.contactName : "",
    contactPhone: typeof item.contactPhone === "string" ? item.contactPhone : "",
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
    category: typeof item.category === "string" ? item.category : "",
    activities: Array.isArray(item.activities)
      ? item.activities.filter((a): a is string => typeof a === "string")
      : [],
    achievements: Array.isArray(item.achievements)
      ? item.achievements
          .filter((a) => a && typeof a === "object")
          .map((a) => ({
            id: typeof a.id === "string" ? a.id : "",
            year: typeof a.year === "string" ? a.year : "",
            title: typeof a.title === "string" ? a.title : "",
            result: typeof a.result === "string" ? a.result : "",
          }))
      : [],
    visible: typeof item.visible === "boolean" ? item.visible : true,
  };
}

function normalizeNews(
  raw: SiteContent["news"] | null | undefined,
  base: SiteContent["news"],
) {
  if (!Array.isArray(raw)) return base;
  const items = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !item.id) return [];
    return [
      {
        id: item.id,
        date: typeof item.date === "string" ? item.date : "",
        title: typeof item.title === "string" ? item.title : "",
        excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
        body: typeof item.body === "string" ? item.body : "",
        image: typeof item.image === "string" ? item.image : "",
        visible: typeof item.visible === "boolean" ? item.visible : true,
      },
    ];
  });
  const ids = new Set(items.map((i) => i.id));
  for (const example of base) {
    if (!ids.has(example.id)) items.push(example);
  }
  return items.length ? items : base;
}

function normalizeAchievements(
  raw: SiteContent["achievements"] | null | undefined,
  base: SiteContent["achievements"],
) {
  if (!Array.isArray(raw)) return base;
  const items = raw.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !item.id) return [];
    const fallback = base.find((row) => row.id === item.id);
    const text = (value: unknown, spare: string) =>
      typeof value === "string" && value.trim() ? value : spare;
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
  let programs = Array.isArray(raw.programs)
    ? raw.programs.map(normalizeProgram).filter((p): p is NonNullable<typeof p> => Boolean(p?.id))
    : base.programs;
  if (!programs.some((item) => item.group === "ekstrakurikuler")) {
    programs = [...programs, ...base.programs.filter((item) => item.group === "ekstrakurikuler")];
  }
  return {
    ...base,
    ...raw,
    identity: { ...base.identity, ...(raw.identity ?? {}) },
    hero: { ...base.hero, ...(raw.hero ?? {}) },
    welcome: normalizeWelcome(raw.welcome, base.welcome),
    values: Array.isArray(raw.values)
      ? raw.values.map(normalizeValue).filter((v): v is NonNullable<typeof v> => Boolean(v))
      : base.values,
    staff: normalizeStaff(raw.staff, base.staff),
    programGroups: normalizeProgramGroups(raw.programGroups, base.programGroups),
    programs,
    announcements: normalizeNews(raw.announcements, base.announcements),
    news: normalizeNews(raw.news, base.news),
    gallery: Array.isArray(raw.gallery) ? raw.gallery : base.gallery,
    achievements: normalizeAchievements(raw.achievements, base.achievements),
    visi: typeof raw.visi === "string" ? raw.visi : base.visi,
    misi: Array.isArray(raw.misi)
      ? raw.misi.filter((line): line is string => typeof line === "string")
      : base.misi,
    sejarah: typeof raw.sejarah === "string" ? raw.sejarah : base.sejarah,
    show: { ...base.show, ...(raw.show ?? {}) },
  };
}
