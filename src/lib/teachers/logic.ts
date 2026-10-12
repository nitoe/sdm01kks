export type DirectoryEntry = { rosterKey: string; name: string; status: AccountStatus };

export type ResetEntry = { id: string; rosterKey: string; name: string; createdAt: string };

export type Duty = { kelas: string; mapel: string };

export type AccountStatus = "pending" | "active" | "rejected";

export type ImportRow = {
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

export type Skip = { name: string; reason: string };

export const PASSWORD_HASH_RE = /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{64}$/;

export function rosterKey(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’.]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Nama di rapor: "Arif Azwar Anas, S.Pd". Tanpa gelar, nama saja. */
export function signatureName(name: string, gelar: string): string {
  const cleanName = name.trim();
  const cleanGelar = gelar.trim();
  if (!cleanName) return "";
  if (!cleanGelar) return cleanName;
  return `${cleanName}, ${cleanGelar}`;
}

export function dutiesBySubject(duties: Duty[]): { mapel: string; kelas: string[] }[] {
  const map = new Map<string, string[]>();
  for (const duty of duties) {
    const list = map.get(duty.mapel) ?? [];
    if (!list.includes(duty.kelas)) list.push(duty.kelas);
    map.set(duty.mapel, list);
  }
  return [...map.entries()].map(([mapel, kelas]) => ({ mapel, kelas }));
}

export function planImport(
  existingKeys: string[],
  rows: ImportRow[],
  knownKeys: ReadonlySet<string>,
): { insert: ImportRow[]; skipped: Skip[] } {
  const seen = new Set(existingKeys);
  const insert: ImportRow[] = [];
  const skipped: Skip[] = [];
  for (const row of rows) {
    const label = row.name.trim() || row.rosterKey || "Baris tanpa nama";
    if (!knownKeys.has(row.rosterKey)) {
      skipped.push({ name: label, reason: "bukan nama di daftar guru" });
      continue;
    }
    if (!row.name.trim()) {
      skipped.push({ name: label, reason: "nama kosong" });
      continue;
    }
    if (row.status !== "pending" && row.status !== "active" && row.status !== "rejected") {
      skipped.push({ name: label, reason: "status tidak dikenal" });
      continue;
    }
    if (!PASSWORD_HASH_RE.test(row.passwordHash)) {
      skipped.push({ name: label, reason: "sandi cadangan tidak dikenal" });
      continue;
    }
    if (seen.has(row.rosterKey)) {
      skipped.push({ name: label, reason: "sudah ada" });
      continue;
    }
    seen.add(row.rosterKey);
    insert.push(row);
  }
  return { insert, skipped };
}
