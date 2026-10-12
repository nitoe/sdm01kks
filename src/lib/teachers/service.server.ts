import { getRequest, setCookie } from "@tanstack/react-start/server";
import { randomUUID } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import {
  PASSWORD_HASH_RE,
  planImport,
  type AccountStatus,
  type DirectoryEntry,
  type ImportRow,
  type ResetEntry,
} from "./logic.ts";
import { hashPassword, hashToken, newToken, verifyPassword } from "./password.ts";
import { ROSTER_BY_KEY } from "./roster.ts";

const DEFAULT_ADMIN_PIN = "kukusan-admin";
const TEACHER_COOKIE = "sdm_guru";
const ADMIN_COOKIE = "sdm_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

export type Profile = {
  id: string;
  rosterKey: string;
  name: string;
  gelar: string;
  nip: string;
  nuptk: string;
  phone: string;
  email: string;
  note: string;
  status: AccountStatus;
  createdBy: "self" | "admin";
};

export type AccountBackup = {
  rosterKey: string;
  name: string;
  gelar: string;
  nip: string;
  nuptk: string;
  phone: string;
  email: string;
  note: string;
  status: AccountStatus;
  createdBy: "self" | "admin";
  passwordHash: string;
};

export type BackupFile = {
  kind: "sdm01kks-akun-guru";
  version: 1;
  exportedAt: string;
  accounts: AccountBackup[];
};

type Result = { ok: true; message?: string } | { ok: false; message: string };

type ProfileInput = {
  name: string;
  gelar: string;
  nip: string;
  nuptk: string;
  phone: string;
  email: string;
  note: string;
};

type RegisterInput = ProfileInput & { rosterKey: string; password: string };

type AccountRow = {
  id: string;
  roster_key: string;
  name: string;
  gelar: string;
  nip: string;
  nuptk: string;
  phone: string;
  email: string;
  note: string;
  status: string;
  created_by: string;
  password_hash?: string;
};

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asStatus(value: string): AccountStatus | null {
  if (value === "pending" || value === "active" || value === "rejected") return value;
  return null;
}

function asCreatedBy(value: string): "self" | "admin" {
  return value === "self" ? "self" : "admin";
}

function toProfile(row: AccountRow): Profile {
  return {
    id: row.id,
    rosterKey: row.roster_key,
    name: row.name,
    gelar: row.gelar,
    nip: row.nip,
    nuptk: row.nuptk,
    phone: row.phone,
    email: row.email,
    note: row.note,
    status: asStatus(row.status) ?? "pending",
    createdBy: asCreatedBy(row.created_by),
  };
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

function profileFrom(input: ProfileInput, fallbackName: string): { profile: ProfileInput; error: string | null } {
  const profile: ProfileInput = {
    name: clip(input.name, 80) || fallbackName,
    gelar: clip(input.gelar, 40),
    nip: clip(input.nip, 32),
    nuptk: clip(input.nuptk, 32),
    phone: clip(input.phone, 32),
    email: clip(input.email, 80),
    note: clip(input.note, 280),
  };
  if (!profile.name) return { profile, error: "Nama wajib diisi." };
  return { profile, error: null };
}

async function pinHash(sql: Sql): Promise<string> {
  const rows = await sql<{ pin_hash: string }>`select pin_hash from school_secrets where id = 'admin'`;
  if (rows[0]?.pin_hash) return rows[0].pin_hash;
  const created = await hashPassword(DEFAULT_ADMIN_PIN);
  await sql`insert into school_secrets (id, pin_hash) values ('admin', ${created}) on conflict (id) do nothing`;
  const again = await sql<{ pin_hash: string }>`select pin_hash from school_secrets where id = 'admin'`;
  return again[0]?.pin_hash ?? created;
}

async function adminTokenHash(): Promise<string | null> {
  const token = readCookie(ADMIN_COOKIE);
  if (!token) return null;
  return hashToken(token);
}

async function isAdmin(sql: Sql): Promise<boolean> {
  const tokenHash = await adminTokenHash();
  if (!tokenHash) return false;
  const rows = await sql<{ ok: number }>`
    select 1 as ok from admin_sessions where token_hash = ${tokenHash} and expires_at > now()
  `;
  return rows.length > 0;
}

async function requireAdmin(sql: Sql): Promise<{ ok: false; message: string } | null> {
  if (await isAdmin(sql)) return null;
  return { ok: false, message: "Masuk sebagai admin dulu." };
}

async function sessionAccount(sql: Sql): Promise<Profile | null> {
  const token = readCookie(TEACHER_COOKIE);
  if (!token) return null;
  const rows = await sql<AccountRow>`
    select a.id, a.roster_key, a.name, a.gelar, a.nip, a.nuptk, a.phone, a.email, a.note, a.status, a.created_by
    from teacher_accounts a
    join teacher_sessions s on s.account_id = a.id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now() and a.status = 'active'
  `;
  return rows[0] ? toProfile(rows[0]) : null;
}

async function accountByKey(sql: Sql, rosterKey: string): Promise<(Profile & { passwordHash: string }) | null> {
  const rows = await sql<AccountRow>`
    select id, roster_key, name, gelar, nip, nuptk, phone, email, note, status, created_by, password_hash
    from teacher_accounts where roster_key = ${rosterKey}
  `;
  const row = rows[0];
  if (!row || !row.password_hash) return null;
  return { ...toProfile(row), passwordHash: row.password_hash };
}

async function saveAccount(
  sql: Sql,
  rosterKey: string,
  profile: ProfileInput,
  passwordHash: string,
  status: AccountStatus,
  createdBy: "self" | "admin",
): Promise<Result> {
  const existing = await accountByKey(sql, rosterKey);
  if (existing && (existing.status === "active" || existing.status === "pending") && createdBy === "self") {
    return {
      ok: false,
      message:
        existing.status === "pending"
          ? "Nama ini sudah diajukan dan masih menunggu admin."
          : "Nama ini sudah punya akun. Silakan masuk, atau pakai lupa sandi.",
    };
  }
  if (existing?.status === "active" && createdBy === "admin") {
    return { ok: false, message: "Akun ini sudah aktif. Ganti sandinya dari daftar, jangan buat ulang." };
  }
  const id = existing?.id ?? randomUUID();
  if (existing) {
    await sql`
      update teacher_accounts
      set name = ${profile.name},
          gelar = ${profile.gelar},
          nip = ${profile.nip},
          nuptk = ${profile.nuptk},
          phone = ${profile.phone},
          email = ${profile.email},
          note = ${profile.note},
          password_hash = ${passwordHash},
          status = ${status},
          created_by = ${createdBy},
          updated_at = now()
      where id = ${id}
    `;
  } else {
    await sql`
      insert into teacher_accounts (
        id, roster_key, name, gelar, nip, nuptk, phone, email, note, password_hash, status, created_by
      ) values (
        ${id}, ${rosterKey}, ${profile.name}, ${profile.gelar}, ${profile.nip}, ${profile.nuptk},
        ${profile.phone}, ${profile.email}, ${profile.note}, ${passwordHash}, ${status}, ${createdBy}
      )
    `;
  }
  return { ok: true };
}

function knownTeacher(rosterKey: string): { name: string } | null {
  const teacher = ROSTER_BY_KEY.get(rosterKey);
  return teacher ? { name: teacher.name } : null;
}

export async function adminGate(): Promise<{ signedIn: boolean; usingDefaultPin: boolean }> {
  const sql = await getSql();
  const stored = await pinHash(sql);
  return {
    signedIn: await isAdmin(sql),
    usingDefaultPin: await verifyPassword(DEFAULT_ADMIN_PIN, stored),
  };
}

export async function openAdminSession(pin: string): Promise<Result> {
  const sql = await getSql();
  const stored = await pinHash(sql);
  if (!(await verifyPassword(pin, stored))) return { ok: false, message: "Sandi admin tidak sesuai." };
  const token = newToken();
  await sql`insert into admin_sessions (token_hash, expires_at) values (${hashToken(token)}, ${expiresAt()}::timestamptz)`;
  writeCookie(ADMIN_COOKIE, token, MAX_AGE);
  return { ok: true };
}

export async function rotateAdminPin(next: string): Promise<Result> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const problem = passwordError(next.trim());
  if (problem) return { ok: false, message: problem };
  const nextHash = await hashPassword(next.trim());
  await sql`update school_secrets set pin_hash = ${nextHash} where id = 'admin'`;
  return { ok: true, message: "Sandi admin akun guru diperbarui." };
}

export async function directory(): Promise<DirectoryEntry[]> {
  const sql = await getSql();
  const rows = await sql<{ roster_key: string; name: string; status: string }>`
    select roster_key, name, status from teacher_accounts order by name
  `;
  return rows.flatMap((row) => {
    const status = asStatus(row.status);
    if (!status) return [];
    return [{ rosterKey: row.roster_key, name: row.name, status }];
  });
}

export async function registerSelf(input: RegisterInput): Promise<Result> {
  const teacher = knownTeacher(clip(input.rosterKey, 80));
  if (!teacher) return { ok: false, message: "Pilih nama dari daftar guru." };
  const problem = passwordError(input.password ?? "");
  if (problem) return { ok: false, message: problem };
  const { profile, error } = profileFrom(input, teacher.name);
  if (error) return { ok: false, message: error };
  const sql = await getSql();
  const passwordHash = await hashPassword(input.password);
  const saved = await saveAccount(sql, clip(input.rosterKey, 80), profile, passwordHash, "pending", "self");
  if (!saved.ok) return saved;
  return { ok: true, message: "Pengajuan terkirim. Akun bisa dipakai setelah admin menyetujui." };
}

export async function registerByAdmin(input: RegisterInput): Promise<Result> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const rosterKey = clip(input.rosterKey, 80);
  const teacher = knownTeacher(rosterKey);
  if (!teacher) return { ok: false, message: "Pilih nama dari daftar guru." };
  const problem = passwordError(input.password ?? "");
  if (problem) return { ok: false, message: problem };
  const { profile, error } = profileFrom(input, teacher.name);
  if (error) return { ok: false, message: error };
  const passwordHash = await hashPassword(input.password);
  const saved = await saveAccount(sql, rosterKey, profile, passwordHash, "active", "admin");
  if (!saved.ok) return saved;
  return { ok: true, message: "Akun guru dibuat dan langsung aktif." };
}

export async function login(input: { rosterKey: string; password: string }): Promise<Result> {
  const rosterKey = clip(input.rosterKey, 80);
  if (!knownTeacher(rosterKey)) return { ok: false, message: "Pilih nama dari daftar guru." };
  const sql = await getSql();
  const account = await accountByKey(sql, rosterKey);
  if (!account) return { ok: false, message: "Nama ini belum punya akun. Silakan daftar, atau minta admin membuatkan." };
  if (account.status === "pending") return { ok: false, message: "Pengajuan masih menunggu persetujuan admin." };
  if (account.status === "rejected") {
    return { ok: false, message: "Pengajuan sebelumnya ditolak. Daftar lagi, atau minta admin membuatkan akun." };
  }
  if (!(await verifyPassword(input.password ?? "", account.passwordHash))) {
    return { ok: false, message: "Sandi tidak sesuai." };
  }
  const token = newToken();
  await sql`
    insert into teacher_sessions (token_hash, account_id, expires_at)
    values (${hashToken(token)}, ${account.id}, ${expiresAt()}::timestamptz)
  `;
  writeCookie(TEACHER_COOKIE, token, MAX_AGE);
  return { ok: true };
}

export async function logoutTeacher(): Promise<Result> {
  const token = readCookie(TEACHER_COOKIE);
  if (token) {
    const sql = await getSql();
    await sql`delete from teacher_sessions where token_hash = ${hashToken(token)}`;
  }
  clearCookie(TEACHER_COOKIE);
  return { ok: true };
}

export async function teacherProfile(): Promise<Profile | null> {
  const sql = await getSql();
  return sessionAccount(sql);
}

export async function updateProfile(input: ProfileInput): Promise<Result> {
  const sql = await getSql();
  const account = await sessionAccount(sql);
  if (!account) return { ok: false, message: "Sesi habis. Silakan masuk lagi." };
  const { profile, error } = profileFrom(input, "");
  if (error) return { ok: false, message: error };
  await sql`
    update teacher_accounts
    set name = ${profile.name},
        gelar = ${profile.gelar},
        nip = ${profile.nip},
        nuptk = ${profile.nuptk},
        phone = ${profile.phone},
        email = ${profile.email},
        note = ${profile.note},
        updated_at = now()
    where id = ${account.id}
  `;
  return { ok: true, message: "Data tersimpan." };
}

export async function changePassword(input: { current: string; next: string }): Promise<Result> {
  const problem = passwordError(input.next ?? "");
  if (problem) return { ok: false, message: problem };
  const sql = await getSql();
  const account = await sessionAccount(sql);
  if (!account) return { ok: false, message: "Sesi habis. Silakan masuk lagi." };
  const full = await accountByKey(sql, account.rosterKey);
  if (!full || !(await verifyPassword(input.current ?? "", full.passwordHash))) {
    return { ok: false, message: "Sandi sekarang tidak sesuai." };
  }
  const passwordHash = await hashPassword(input.next);
  await sql`update teacher_accounts set password_hash = ${passwordHash}, updated_at = now() where id = ${account.id}`;
  return { ok: true, message: "Sandi diganti." };
}

export async function requestReset(input: { rosterKey: string; password: string }): Promise<Result> {
  const rosterKey = clip(input.rosterKey, 80);
  if (!knownTeacher(rosterKey)) return { ok: false, message: "Pilih nama dari daftar guru." };
  const problem = passwordError(input.password ?? "");
  if (problem) return { ok: false, message: problem };
  const sql = await getSql();
  const account = await accountByKey(sql, rosterKey);
  if (!account || account.status === "rejected") {
    return { ok: false, message: "Nama ini belum punya akun aktif. Silakan daftar." };
  }
  const passwordHash = await hashPassword(input.password);
  const pending = await sql<{ id: string }>`
    select id from teacher_resets where account_id = ${account.id} and status = 'pending' order by created_at desc limit 1
  `;
  if (pending[0]) {
    await sql`
      update teacher_resets set password_hash = ${passwordHash}, created_at = now() where id = ${pending[0].id}
    `;
  } else {
    await sql`
      insert into teacher_resets (id, account_id, password_hash, status)
      values (${randomUUID()}, ${account.id}, ${passwordHash}, 'pending')
    `;
  }
  return {
    ok: true,
    message: "Permintaan terkirim. Minta admin menyetujui, lalu masuk dengan sandi baru.",
  };
}

export async function adminOverview(): Promise<
  | { admin: false }
  | { admin: true; accounts: Profile[]; resets: ResetEntry[] }
> {
  const sql = await getSql();
  if (!(await isAdmin(sql))) return { admin: false };
  const accounts = await sql<AccountRow>`
    select id, roster_key, name, gelar, nip, nuptk, phone, email, note, status, created_by
    from teacher_accounts
    order by name
  `;
  const resets = await sql<{ id: string; created_at: unknown; roster_key: string; name: string }>`
    select r.id, r.created_at, a.roster_key, a.name
    from teacher_resets r
    join teacher_accounts a on a.id = r.account_id
    where r.status = 'pending'
    order by r.created_at
  `;
  return {
    admin: true,
    accounts: accounts.map(toProfile),
    resets: resets.map((row) => ({
      id: row.id,
      rosterKey: row.roster_key,
      name: row.name,
      createdAt: stamp(row.created_at),
    })),
  };
}

export async function decideAccount(input: { id: string; decision: "approve" | "reject" }): Promise<Result> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const status = input.decision === "approve" ? "active" : "rejected";
  const rows = await sql<{ id: string }>`
    update teacher_accounts set status = ${status}, updated_at = now()
    where id = ${clip(input.id, 80)} and status = 'pending'
    returning id
  `;
  if (!rows[0]) return { ok: false, message: "Pengajuan tidak ditemukan." };
  return { ok: true, message: status === "active" ? "Akun disetujui." : "Pengajuan ditolak." };
}

export async function decideReset(input: { id: string; decision: "approve" | "reject" }): Promise<Result> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const id = clip(input.id, 80);
  const rows = await sql<{ account_id: string; password_hash: string }>`
    select account_id, password_hash from teacher_resets where id = ${id} and status = 'pending'
  `;
  const row = rows[0];
  if (!row) return { ok: false, message: "Permintaan tidak ditemukan." };
  if (input.decision === "approve") {
    await sql`update teacher_accounts set password_hash = ${row.password_hash}, updated_at = now() where id = ${row.account_id}`;
    await sql`update teacher_resets set status = 'approved' where id = ${id}`;
    await sql`delete from teacher_sessions where account_id = ${row.account_id}`;
    return { ok: true, message: "Sandi baru disetujui. Guru masuk dengan sandi yang diajukannya." };
  }
  await sql`update teacher_resets set status = 'rejected' where id = ${id}`;
  return { ok: true, message: "Permintaan sandi ditolak." };
}

export async function setAccountPassword(input: { id: string; password: string }): Promise<Result> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const problem = passwordError(input.password ?? "");
  if (problem) return { ok: false, message: problem };
  const passwordHash = await hashPassword(input.password);
  const rows = await sql<{ id: string }>`
    update teacher_accounts
    set password_hash = ${passwordHash}, updated_at = now()
    where id = ${clip(input.id, 80)} and status <> 'rejected'
    returning id
  `;
  if (!rows[0]) return { ok: false, message: "Akun tidak ditemukan." };
  await sql`delete from teacher_sessions where account_id = ${rows[0].id}`;
  return { ok: true, message: "Sandi guru diganti. Sandi lama tidak berlaku lagi." };
}

export async function exportAccounts(): Promise<{ ok: false; message: string } | { ok: true; payload: BackupFile }> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const rows = await sql<AccountRow>`
    select id, roster_key, name, gelar, nip, nuptk, phone, email, note, status, created_by, password_hash
    from teacher_accounts
    order by name
  `;
  return {
    ok: true,
    payload: {
      kind: "sdm01kks-akun-guru",
      version: 1,
      exportedAt: new Date().toISOString(),
      accounts: rows.map((row) => ({
        rosterKey: row.roster_key,
        name: row.name,
        gelar: row.gelar,
        nip: row.nip,
        nuptk: row.nuptk,
        phone: row.phone,
        email: row.email,
        note: row.note,
        status: asStatus(row.status) ?? "pending",
        createdBy: asCreatedBy(row.created_by),
        passwordHash: row.password_hash ?? "",
      })),
    },
  };
}

function parseImport(payload: unknown): ImportRow[] | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (record.kind !== "sdm01kks-akun-guru" || record.version !== 1) return null;
  if (!Array.isArray(record.accounts) || record.accounts.length > 200) return null;
  const rows: ImportRow[] = [];
  for (const item of record.accounts) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const status = asStatus(typeof row.status === "string" ? row.status : "");
    if (!status) return null;
    rows.push({
      rosterKey: clip(row.rosterKey, 80),
      name: clip(row.name, 80),
      gelar: clip(row.gelar, 40),
      nip: clip(row.nip, 32),
      nuptk: clip(row.nuptk, 32),
      phone: clip(row.phone, 32),
      email: clip(row.email, 80),
      note: clip(row.note, 280),
      status,
      createdBy: row.createdBy === "self" ? "self" : "admin",
      passwordHash: typeof row.passwordHash === "string" ? row.passwordHash : "",
    });
  }
  return rows;
}

export async function importAccounts(
  payload: unknown,
): Promise<{ ok: false; message: string } | { ok: true; inserted: number; skipped: { name: string; reason: string }[] }> {
  const sql = await getSql();
  const denied = await requireAdmin(sql);
  if (denied) return denied;
  const rows = parseImport(payload);
  if (!rows) return { ok: false, message: "Berkas bukan cadangan akun guru sekolah ini." };
  const existing = await sql<{ roster_key: string }>`select roster_key from teacher_accounts`;
  const plan = planImport(
    existing.map((row) => row.roster_key),
    rows,
    new Set(ROSTER_BY_KEY.keys()),
  );
  for (const row of plan.insert) {
    if (!PASSWORD_HASH_RE.test(row.passwordHash)) continue;
    await sql`
      insert into teacher_accounts (
        id, roster_key, name, gelar, nip, nuptk, phone, email, note, password_hash, status, created_by
      ) values (
        ${randomUUID()}, ${row.rosterKey}, ${row.name}, ${row.gelar}, ${row.nip}, ${row.nuptk},
        ${row.phone}, ${row.email}, ${row.note}, ${row.passwordHash}, ${row.status}, ${row.createdBy}
      )
    `;
  }
  return { ok: true, inserted: plan.insert.length, skipped: plan.skipped };
}
