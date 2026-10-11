import { create } from "zustand";
import { mergeContent, seedContent } from "./seed";
import type { SiteContent } from "./types";
import { publishRemote, startFirebase } from "./firebase";

const CONTENT_KEY = "sdm01kks-content-v1";
const PIN_KEY = "sdm01kks-pin";
const SESSION_KEY = "sdm01kks-admin";
export const DEFAULT_PIN = "kukusan-admin";

export type SyncSource = "awal" | "peramban" | "firebase";
export type FirebaseStatus = "mati" | "menyambung" | "tersambung" | "gagal";

type SiteState = {
  content: SiteContent;
  ready: boolean;
  source: SyncSource;
  firebaseStatus: FirebaseStatus;
  firebaseDetail: string;
  admin: boolean;
  boot: () => void;
  replace: (content: SiteContent, source?: SyncSource) => void;
  update: (recipe: (content: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  reconnect: () => void;
  unlock: (pin: string, persist: boolean) => boolean;
  lock: () => void;
  changePin: (next: string) => void;
};

let booted = false;
let publishTimer: ReturnType<typeof setTimeout> | null = null;

function readContent(): { content: SiteContent; source: SyncSource } {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return { content: structuredClone(seedContent), source: "awal" };
    return { content: mergeContent(JSON.parse(raw) as SiteContent), source: "peramban" };
  } catch {
    return { content: structuredClone(seedContent), source: "awal" };
  }
}

function saveLocal(content: SiteContent) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

function schedulePublish(content: SiteContent) {
  saveLocal(content);
  if (publishTimer) clearTimeout(publishTimer);
  publishTimer = setTimeout(() => {
    void publishRemote(content).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Gagal menulis ke Firestore";
      useSiteStore.setState({ firebaseStatus: "gagal", firebaseDetail: message });
    });
  }, 500);
}

export function currentPin(): string {
  if (typeof localStorage === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  content: seedContent,
  ready: false,
  source: "awal",
  firebaseStatus: "mati",
  firebaseDetail: "",
  admin: false,
  boot: () => {
    if (booted || typeof window === "undefined") return;
    booted = true;
    const loaded = readContent();
    const admin =
      sessionStorage.getItem(SESSION_KEY) === "1" || localStorage.getItem(SESSION_KEY) === "1";
    set({ ...loaded, ready: true, admin });
    void connectFirebase(set, get);
  },
  replace: (content, source) => {
    const next = mergeContent(content);
    saveLocal(next);
    set({ content: next, source: source ?? get().source });
  },
  update: (recipe) => {
    const next = recipe(structuredClone(get().content));
    set({ content: next, source: get().firebaseStatus === "tersambung" ? "firebase" : "peramban" });
    schedulePublish(next);
  },
  resetContent: () => {
    const next = structuredClone(seedContent);
    set({ content: next, source: "awal" });
    schedulePublish(next);
  },
  reconnect: () => {
    void connectFirebase(set, get);
  },
  unlock: (pin, persist) => {
    if (pin.trim() !== currentPin()) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
    if (persist) localStorage.setItem(SESSION_KEY, "1");
    else localStorage.removeItem(SESSION_KEY);
    set({ admin: true });
    return true;
  },
  lock: () => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    set({ admin: false });
  },
  changePin: (next) => {
    const pin = next.trim();
    if (pin.length < 6) return;
    localStorage.setItem(PIN_KEY, pin);
  },
}));

async function connectFirebase(
  set: (partial: Partial<SiteState>) => void,
  get: () => SiteState,
) {
  set({ firebaseStatus: "menyambung", firebaseDetail: "" });
  const started = await startFirebase({
    onContent: (content) => {
      get().replace(content, "firebase");
    },
    onStatus: (status, detail) => {
      set({
        firebaseStatus: status,
        firebaseDetail: detail ?? "",
        source: status === "tersambung" ? "firebase" : get().source,
      });
    },
  });
  if (!started) {
    set({
      firebaseStatus: "mati",
      firebaseDetail: "Belum ada konfigurasi Firebase. Konten tersimpan di peramban ini.",
    });
  }
}
