import { create } from "zustand";
import { loadSiteContent, saveSiteContent } from "./api";
import { getAdminAccount, logoutAdminAccount } from "@/lib/teachers/api";
import { seedContent } from "./seed";
import type { SiteContent } from "./types";

export type SyncSource = "awal" | "basis";

type SiteState = {
  content: SiteContent;
  ready: boolean;
  source: SyncSource;
  admin: boolean;
  adminEmail: string;
  usingDefaultPassword: boolean;
  saving: boolean;
  saveError: string;
  boot: () => void;
  update: (recipe: (content: SiteContent) => SiteContent) => void;
  resetContent: () => void;
  markAdmin: (email: string, usingDefaultPassword: boolean) => void;
  lock: () => Promise<void>;
};

let booted = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(content: SiteContent) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    useSiteStore.setState({ saving: true });
    void saveSiteContent({ data: { content } }).then((result) => {
      if (!result.ok) useSiteStore.setState({ saving: false, saveError: result.message });
      else useSiteStore.setState({ saving: false, saveError: "", source: "basis" });
    });
  }, 350);
}

export const useSiteStore = create<SiteState>((set, get) => ({
  content: seedContent,
  ready: true,
  source: "awal",
  admin: false,
  adminEmail: "",
  usingDefaultPassword: false,
  saving: false,
  saveError: "",
  boot: () => {
    if (booted || typeof window === "undefined") return;
    booted = true;
    void (async () => {
      const [content, session] = await Promise.all([loadSiteContent(), getAdminAccount()]);
      const signedIn = Boolean(session && "signedIn" in session && session.signedIn);
      set({
        content,
        ready: true,
        source: "basis",
        admin: signedIn,
        adminEmail: signedIn && session && "email" in session ? session.email : "",
        usingDefaultPassword: Boolean(
          session && "usingDefaultPassword" in session && session.usingDefaultPassword,
        ),
      });
    })();
  },
  update: (recipe) => {
    const next = recipe(structuredClone(get().content));
    set({ content: next, saveError: "" });
    scheduleSave(next);
  },
  resetContent: () => {
    const next = structuredClone(seedContent);
    set({ content: next, source: "awal", saveError: "" });
    scheduleSave(next);
  },
  markAdmin: (email, usingDefaultPassword) => {
    set({ admin: true, adminEmail: email, usingDefaultPassword });
  },
  lock: async () => {
    // Anggap keluar seketika agar tampilan tidak tertahan menunggu server.
    set({ admin: false, adminEmail: "", usingDefaultPassword: false });
    try {
      await logoutAdminAccount();
    } catch {
      /* sesi di server akan kedaluwarsa sendiri */
    }
  },
}));
