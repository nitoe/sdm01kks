import { createServerFn } from "@tanstack/react-start";
import { CLOSED_GATE, type SiteGate } from "./gate-types";

/** Status gerbang untuk pengunjung saat ini. Gagal baca = tertutup (aman). */
export const getSiteGate = createServerFn({ method: "GET" }).handler(async (): Promise<SiteGate> => {
  try {
    const { setResponseHeader } = await import("@tanstack/react-start/server");
    setResponseHeader("cache-control", "no-store");
    const { readSiteGate } = await import("./publish.server.ts");
    return await readSiteGate();
  } catch (error) {
    console.error(error);
    return { ...CLOSED_GATE };
  }
});

export const publishSiteNow = createServerFn({ method: "POST" })
  .validator((data: { password: string; phrase: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { publishSite } = await import("./publish.server.ts");
      return await publishSite(data);
    } catch (error) {
      console.error(error);
      return { ok: false as const, message: "Gagal menerbitkan. Coba lagi." };
    }
  });
