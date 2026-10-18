import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";
import { assertStaff } from "@/lib/teachers/service.server";
import { mergeContent, seedContent } from "./seed";
import type { SiteContent } from "./types";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function readSiteContent(): Promise<SiteContent> {
  const sql = await getSql();
  const rows = await sql<{ content: string }>`select content from site_documents where id = 'public'`;
  if (!rows[0]?.content) return structuredClone(seedContent);
  try {
    return mergeContent(JSON.parse(rows[0].content) as Partial<SiteContent>);
  } catch {
    return structuredClone(seedContent);
  }
}

export async function writeSiteContent(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!(await assertStaff())) return { ok: false, message: "Masuk dulu sebagai admin atau operator." };
  if (!raw || typeof raw !== "object") return { ok: false, message: "Isi tidak lengkap." };
  const content = mergeContent(raw as Partial<SiteContent>);
  const text = JSON.stringify(content);
  if (text.length > 400_000) {
    return { ok: false, message: "Isi terlalu besar. Unggah gambar sebagai berkas, jangan tempelkan ke dalam teks." };
  }
  const sql = await getSql();
  await sql`
    insert into site_documents (id, content, updated_at)
    values ('public', ${text}, now())
    on conflict (id) do update set content = excluded.content, updated_at = now()
  `;
  return { ok: true };
}

export async function storeMedia(
  mime: string,
  data: string,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (!(await assertStaff())) return { ok: false, message: "Masuk dulu sebagai admin atau operator." };
  const type = mime.trim().toLowerCase();
  if (!ALLOWED_MIME.has(type)) return { ok: false, message: "Jenis gambar harus JPG, PNG, WEBP, atau GIF." };
  const clean = data.replace(/\s/g, "");
  if (clean.length < 32 || clean.length > 1_700_000) return { ok: false, message: "Gambar maksimal 1,2 MB." };
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return { ok: false, message: "Berkas gambar tidak terbaca." };
  const id = randomUUID();
  const sql = await getSql();
  await sql`insert into site_media (id, mime, data) values (${id}, ${type}, ${clean})`;
  return { ok: true, url: `/api/media/${id}` };
}

export async function readMedia(id: string): Promise<{ mime: string; bytes: Uint8Array } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const sql = await getSql();
  const rows = await sql<{ mime: string; data: string }>`select mime, data from site_media where id = ${id}`;
  const row = rows[0];
  if (!row?.data || !ALLOWED_MIME.has(row.mime)) return null;
  const bytes = Buffer.from(row.data, "base64");
  return { mime: row.mime, bytes: new Uint8Array(bytes) };
}
