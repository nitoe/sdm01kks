import { createServerFn } from "@tanstack/react-start";
import { seedContent } from "./seed";
import type { SiteContent } from "./types";

export const loadSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    // Sebelum Publish, isi sebenarnya hanya dikirim ke admin/operator yang sedang masuk.
    const { canViewSite } = await import("./publish.server.ts");
    if (!(await canViewSite())) return structuredClone(seedContent);
    const { readSiteContent } = await import("./content.server.ts");
    return await readSiteContent();
  } catch (error) {
    console.error(error);
    return structuredClone(seedContent);
  }
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((data: { content: SiteContent }) => data)
  .handler(async ({ data }) => {
    try {
      const { writeSiteContent } = await import("./content.server.ts");
      return await writeSiteContent(data.content);
    } catch (error) {
      console.error(error);
      return { ok: false as const, message: "Gagal menyimpan. Coba lagi." };
    }
  });

export const uploadSiteMedia = createServerFn({ method: "POST" })
  .validator((data: { mime: string; data: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { storeMedia } = await import("./content.server.ts");
      return await storeMedia(data.mime, data.data);
    } catch (error) {
      console.error(error);
      return { ok: false as const, message: "Gagal mengunggah gambar." };
    }
  });
