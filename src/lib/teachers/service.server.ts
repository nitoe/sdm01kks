import { getRequest, setCookie } from "@tanstack/react-start/server";
import { randomUUID } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import { hashPassword, hashToken, newToken, verifyPassword } from "./password.ts";

const ADMIN_COOKIE = "sdm_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Peran akun panel kelola.
 * - admin: semua akses, termasuk mengelola akun.
 * - operator: sama dengan admin, kecuali tidak boleh menambah/mengubah/menghapus akun.
 */
export type AccountRole = "admin" | "operator";

export type PanelAccount = {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  createdAt: string;
  isSelf: boolean;
};

type Result = { ok: true; message?: string } | { ok: false; message: string };

type Session = {
  accountId: string;
  email: string;
  name: string;
  role: AccountRole;
  passwordHash: string;
};

type Guard = { ok: true; session: Session } | { ok: false; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sandi awal akun admin. Saat deploy, isi ADMIN_INITIAL_PASSWORD agar tidak memakai sandi bawaan.
const DEFAULT_ADMIN_EMAIL = "admin@sdmuhammadiyah01kks.sch.id";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD?.trim() || "Kukusan-1981";

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** Nilai tak dikenal dianggap operator (hak paling kecil), bukan admin. */
function asRole(value: unknown): AccountRole {
  return value === "admin" ? "admin" : "operator";
}

function isRole(value: unknown): value is AccountRole {
  return value === "admin" || value === "operator";
}

function stamp(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : "";
}

function readCookie(name: string): string | null {
  const raw = getRequest().headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) return decodeURIComponent(trimmed.slice(eq + 1));
  }
  return null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  const request = getRequest();
  const forwarded = request.headers.get("x-forwarded-proto");
  const secure = forwarded
    ? forwarded.split(",")[0]?.trim() === "https"
    : new URL(request.url).protocol === "https:";
  setCookie(name, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure,
    maxAge,
  });
}

function clearCookie(name: string) {
  writeCookie(name, "", 0);
}

function expiresAt(): string {
  return new Date(Date.now() + MAX_AGE * 1000).toISOString();
}

function passwordError(password: string): string | null {
  if (password.length < 6) return "Sandi minimal 6 karakter.";
  if (password.length > 72) return "Sandi terlalu panjang.";
  return null;
}

async function adminTokenHash(): Promise<string | null> {
  const token = readCookie(ADMIN_COOKIE);
  if (!token) return null;
  return hashToken(token);
}

/**
 * Sesi yang sedang masuk. Peran dibaca dari tabel akun pada setiap permintaan,
 * jadi perubahan peran atau penghapusan akun langsung berlaku.
 * Sesi tanpa akun (account_id kosong) tidak dianggap masuk.
 */
async function currentSession(sql: Sql): Promise<Session | null> {
  const tokenHash = await adminTokenHash();
  if (!tokenHash) return null;
  const rows = await sql<{ id: string; email: string; name: string; role: string; password_hash: string }>`
    select a.id, a.email, a.name, a.role, a.password_hash
    from admin_sessions s
    join admin_accounts a on a.id = s.account_id
    where s.token_hash = ${tokenHash} and s.expires_at > now()
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    accountId: row.id,
    email: row.email,
    name: row.name,
    role: asRole(row.role),
    passwordHash: row.password_hash,
  };
}

async function guardStaff(sql: Sql): Promise<Guard> {
  const session = await currentSession(sql);
  if (!session) return { ok: false, message: "Masuk dulu sebagai admin atau operator." };
  return { ok: true, session };
}

async function guardAdmin(sql: Sql): Promise<Guard> {
  const guard = await guardStaff(sql);
  if (!guard.ok) return guard;
  if (guard.session.role !== "admin") {
    return { ok: false, message: "Hanya admin yang boleh mengelola akun." };
  }
  return guard;
}

/** Admin atau operator: boleh mengubah isi situs. */
export async function assertStaff(): Promise<boolean> {
  const sql = await getSql();
  return (await currentSession(sql)) !== null;
}

/** Hanya admin: boleh mengelola akun. */
export async function assertAdmin(): Promise<boolean> {
  const sql = await getSql();
  return (await currentSession(sql))?.role === "admin";
}

/**
 * Akun admin bawaan dibuat hanya bila belum ada akun sama sekali.
 * (Jika dicek per surel, akun bawaan akan muncul lagi dengan sandi awal
 * setelah surelnya diganti atau akunnya dihapus.)
 */
async function ensureDefaultAdmin(sql: Sql) {
  const existing = await sql<{ ok: number }>`select 1 as ok from admin_accounts limit 1`;
  if (existing.length > 0) return;
  const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
  await sql`
    insert into admin_accounts (id, email, name, password_hash, role)
    values (${randomUUID()}, ${DEFAULT_ADMIN_EMAIL}, ${"Admin sekolah"}, ${passwordHash}, 'admin')
    on conflict (email) do nothing
  `;
}

export async function adminAccountStatus(): Promise<{
  signedIn: boolean;
  email: string;
  name: string;
  role: AccountRole | null;
  usingDefaultPassword: boolean;
}> {
  const sql = await getSql();
  await ensureDefaultAdmin(sql);
  const session = await currentSession(sql);
  if (!session) {
    return { signedIn: false, email: "", name: "", role: null, usingDefaultPassword: false };
  }
  return {
    signedIn: true,
    email: session.email,
    name: session.name,
    role: session.role,
    usingDefaultPassword: await verifyPassword(DEFAULT_ADMIN_PASSWORD, session.passwordHash),
  };
}

export async function loginAdminAccount(email: string, password: string): Promise<Result> {
  const sql = await getSql();
  await ensureDefaultAdmin(sql);
  const normalized = clip(email, 120).toLowerCase();
  const rows = await sql<{ id: string; password_hash: string }>`
    select id, password_hash from admin_accounts where email = ${normalized}
  `;
  const row = rows[0];
  if (!row || !(await verifyPassword(typeof password === "string" ? password : "", row.password_hash))) {
    return { ok: false, message: "Surel atau sandi tidak sesuai." };
  }
  const token = newToken();
  await sql`
    insert into admin_sessions (token_hash, expires_at, account_id)
    values (${hashToken(token)}, ${expiresAt()}::timestamptz, ${row.id})
  `;
  writeCookie(ADMIN_COOKIE, token, MAX_AGE);
  return { ok: true };
}

export async function logoutAdminAccount(): Promise<Result> {
  const sql = await getSql();
  const tokenHash = await adminTokenHash();
  if (tokenHash) await sql`delete from admin_sessions where token_hash = ${tokenHash}`;
  clearCookie(ADMIN_COOKIE);
  return { ok: true };
}

/** Ganti sandi akun yang sedang masuk (admin maupun operator). */
export async function changeAdminPassword(next: string): Promise<Result> {
  const sql = await getSql();
  const guard = await guardStaff(sql);
  if (!guard.ok) return guard;
  const value = typeof next === "string" ? next.trim() : "";
  const problem = passwordError(value);
  if (problem) return { ok: false, message: problem };
  const nextHash = await hashPassword(value);
  await sql`update admin_accounts set password_hash = ${nextHash} where id = ${guard.session.accountId}`;
  return { ok: true, message: "Sandi diperbarui." };
}

// ---------------------------------------------------------------------------
// Kelola akun — hanya admin
// ---------------------------------------------------------------------------

export async function listAccounts(): Promise<
  { ok: true; accounts: PanelAccount[] } | { ok: false; message: string }
> {
  const sql = await getSql();
  const guard = await guardAdmin(sql);
  if (!guard.ok) return guard;
  const rows = await sql<{ id: string; email: string; name: string; role: string; created_at: unknown }>`
    select id, email, name, role, created_at from admin_accounts order by role, name, email
  `;
  return {
    ok: true,
    accounts: rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: asRole(row.role),
      createdAt: stamp(row.created_at),
      isSelf: row.id === guard.session.accountId,
    })),
  };
}

export async function createAccount(input: {
  email: string;
  name: string;
  password: string;
  role: AccountRole;
}): Promise<Result> {
  const sql = await getSql();
  const guard = await guardAdmin(sql);
  if (!guard.ok) return guard;
  const email = clip(input?.email, 120).toLowerCase();
  const name = clip(input?.name, 80);
  const password = typeof input?.password === "string" ? input.password : "";
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Surel tidak valid." };
  if (name.length < 2) return { ok: false, message: "Nama wajib diisi." };
  if (!isRole(input?.role)) return { ok: false, message: "Pilih peran: admin atau operator." };
  const problem = passwordError(password);
  if (problem) return { ok: false, message: problem };
  const inserted = await sql<{ id: string }>`
    insert into admin_accounts (id, email, name, password_hash, role)
    values (${randomUUID()}, ${email}, ${name}, ${await hashPassword(password)}, ${input.role})
    on conflict (email) do nothing
    returning id
  `;
  if (!inserted[0]) return { ok: false, message: "Surel ini sudah dipakai." };
  return {
    ok: true,
    message: `Akun ${input.role} ditambahkan. Orang itu bisa masuk dengan surel dan sandi yang baru dibuat.`,
  };
}

/**
 * Ubah nama, surel, peran, dan (opsional) sandi akun lain atau akun sendiri.
 * Akun sendiri tidak boleh mengubah perannya. Karena pemanggil selalu admin
 * dan tidak bisa menurunkan dirinya, selalu tersisa minimal satu admin.
 */
export async function updateAccount(input: {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  password?: string;
}): Promise<Result> {
  const sql = await getSql();
  const guard = await guardAdmin(sql);
  if (!guard.ok) return guard;
  const id = clip(input?.id, 80);
  const targets = await sql<{ id: string; role: string }>`select id, role from admin_accounts where id = ${id}`;
  const target = targets[0];
  if (!target) return { ok: false, message: "Akun tidak ditemukan." };
  const isSelf = target.id === guard.session.accountId;

  const email = clip(input?.email, 120).toLowerCase();
  const name = clip(input?.name, 80);
  const password = typeof input?.password === "string" ? input.password : "";
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Surel tidak valid." };
  if (name.length < 2) return { ok: false, message: "Nama wajib diisi." };
  if (!isRole(input?.role)) return { ok: false, message: "Pilih peran: admin atau operator." };
  if (isSelf && input.role !== asRole(target.role)) {
    return { ok: false, message: "Peran akun yang sedang Anda pakai tidak bisa diubah. Minta admin lain." };
  }
  if (password) {
    const problem = passwordError(password);
    if (problem) return { ok: false, message: problem };
  }
  const clash = await sql<{ ok: number }>`
    select 1 as ok from admin_accounts where email = ${email} and id <> ${id}
  `;
  if (clash.length > 0) return { ok: false, message: "Surel ini sudah dipakai." };

  await sql`update admin_accounts set email = ${email}, name = ${name}, role = ${input.role} where id = ${id}`;
  if (password) {
    await sql`update admin_accounts set password_hash = ${await hashPassword(password)} where id = ${id}`;
    // Sandi akun lain diganti: sesinya yang lama tidak berlaku lagi.
    if (!isSelf) await sql`delete from admin_sessions where account_id = ${id}`;
  }
  return { ok: true, message: "Akun diperbarui." };
}

export async function deleteAccount(input: { id: string }): Promise<Result> {
  const sql = await getSql();
  const guard = await guardAdmin(sql);
  if (!guard.ok) return guard;
  const id = clip(input?.id, 80);
  if (id === guard.session.accountId) {
    return { ok: false, message: "Akun yang sedang Anda pakai tidak bisa dihapus." };
  }
  const existing = await sql<{ id: string }>`select id from admin_accounts where id = ${id}`;
  if (!existing[0]) return { ok: false, message: "Akun tidak ditemukan." };
  await sql`delete from admin_sessions where account_id = ${id}`;
  await sql`delete from admin_accounts where id = ${id}`;
  return { ok: true, message: "Akun dihapus." };
}

/**
 * Periksa sandi akun admin yang sedang masuk. Dipakai sebagai verifikasi tambahan
 * untuk tindakan penting (mis. Publish). Hanya admin; operator ditolak.
 */
export async function confirmAdminPassword(password: string): Promise<Result> {
  const sql = await getSql();
  const guard = await guardAdmin(sql);
  if (!guard.ok) return guard;
  const ok = await verifyPassword(typeof password === "string" ? password : "", guard.session.passwordHash);
  return ok ? { ok: true } : { ok: false, message: "Sandi tidak sesuai." };
}
