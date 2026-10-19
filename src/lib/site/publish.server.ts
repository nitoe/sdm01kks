import { getSql } from "@/lib/db";
import { assertStaff, confirmAdminPassword } from "@/lib/teachers/service.server";
import { readSiteContent } from "./content.server";
import { PUBLISH_PHRASE, type SiteGate } from "./gate-types";

const KEY = "published";

type Result = { ok: true; message?: string } | { ok: false; message: string };

/** Tanpa baris di basis data, situs dianggap belum dipublikasikan. */
export async function isPublished(): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from site_settings where key = ${KEY}`;
  return rows[0]?.value === "true";
}

/**
 * Siapa yang boleh melihat situs sebenarnya sekarang.
 * Sudah Publish: semua orang. Belum: hanya admin/operator yang sedang masuk.
 */
export async function canViewSite(): Promise<boolean> {
  return (await isPublished()) || (await assertStaff());
}

export async function readSiteGate(): Promise<SiteGate> {
  const published = await isPublished();
  const open = published || (await assertStaff());
  if (open) return { open: true, published, logoUrl: "" };
  const content = await readSiteContent();
  return { open: false, published: false, logoUrl: content.identity.logoUrl || "" };
}

/**
 * Terbitkan situs. Hanya admin, dengan dua verifikasi: sandi akun yang sedang masuk
 * dan kata PUBLISH. Keduanya diperiksa di server.
 */
export async function publishSite(input: { password: string; phrase: string }): Promise<Result> {
  const check = await confirmAdminPassword(input?.password);
  if (!check.ok) return check;
  const phrase = typeof input?.phrase === "string" ? input.phrase.trim() : "";
  if (phrase !== PUBLISH_PHRASE) {
    return { ok: false, message: `Ketik ${PUBLISH_PHRASE} persis untuk melanjutkan.` };
  }
  const sql = await getSql();
  await sql`
    insert into site_settings (key, value, updated_at)
    values (${KEY}, 'true', now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
  return { ok: true, message: "Situs dipublikasikan. Pengunjung kini melihat halaman sebenarnya." };
}
