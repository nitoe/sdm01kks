import type { FirebaseWebConfig, SiteContent } from "./types";
import { mergeContent } from "./seed";

const LOCAL_CONFIG_KEY = "sdm01kks-firebase-config";

export function configFromEnv(): FirebaseWebConfig | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined;
  if (!apiKey || !projectId || !appId) return null;
  return {
    apiKey,
    projectId,
    appId,
    authDomain:
      (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) ||
      `${projectId}.firebaseapp.com`,
    storageBucket:
      (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) ||
      `${projectId}.appspot.com`,
    messagingSenderId:
      (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) || "",
  };
}

export function readStoredConfig(): FirebaseWebConfig | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (!raw) return null;
    return normalizeConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredConfig(config: FirebaseWebConfig | null) {
  if (config) localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
  else localStorage.removeItem(LOCAL_CONFIG_KEY);
}

export function activeConfig(): FirebaseWebConfig | null {
  return configFromEnv() ?? readStoredConfig();
}

export function normalizeConfig(value: unknown): FirebaseWebConfig | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const apiKey = stringField(record, "apiKey");
  const projectId = stringField(record, "projectId");
  const appId = stringField(record, "appId");
  if (!apiKey || !projectId || !appId) return null;
  return {
    apiKey,
    projectId,
    appId,
    authDomain: stringField(record, "authDomain") || `${projectId}.firebaseapp.com`,
    storageBucket: stringField(record, "storageBucket") || `${projectId}.appspot.com`,
    messagingSenderId: stringField(record, "messagingSenderId") || "",
  };
}

function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

type RemoteHandlers = {
  onContent: (content: SiteContent) => void;
  onStatus: (status: "tersambung" | "gagal", detail?: string) => void;
};

let publishImpl: ((content: SiteContent) => Promise<void>) | null = null;
let stopImpl: (() => void) | null = null;
let applyingRemote = false;

export async function publishRemote(content: SiteContent) {
  if (!publishImpl || applyingRemote) return;
  await publishImpl(content);
}

export function stopFirebase() {
  stopImpl?.();
  stopImpl = null;
  publishImpl = null;
}

export async function startFirebase(handlers: RemoteHandlers): Promise<boolean> {
  stopFirebase();
  const config = activeConfig();
  if (!config || typeof window === "undefined") return false;

  try {
    const { initializeApp, getApps, deleteApp } = await import("firebase/app");
    const { getFirestore, doc, onSnapshot, setDoc, getDoc } = await import("firebase/firestore");
    const app = getApps().find((item) => item.name === "sdm01kks") ?? initializeApp(config, "sdm01kks");
    const db = getFirestore(app);
    const ref = doc(db, "site", "public");

    const existing = await getDoc(ref);
    if (!existing.exists()) {
      handlers.onStatus("tersambung", "Dokumen Firestore belum ada. Simpan dari panel kelola untuk mengisinya.");
    }

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as { content?: unknown };
        applyingRemote = true;
        handlers.onContent(mergeContent(data.content as Partial<SiteContent>));
        applyingRemote = false;
        handlers.onStatus("tersambung");
      },
      (error) => {
        handlers.onStatus("gagal", error.message);
      },
    );

    publishImpl = async (content) => {
      await setDoc(ref, { content, updatedAt: Date.now() }, { merge: true });
    };
    stopImpl = () => {
      unsub();
      void deleteApp(app).catch(() => undefined);
    };
    return true;
  } catch (error) {
    handlers.onStatus("gagal", error instanceof Error ? error.message : "Gagal menyambung Firebase");
    return false;
  }
}
