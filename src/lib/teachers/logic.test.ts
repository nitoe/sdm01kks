import assert from "node:assert/strict";
import { test } from "node:test";
import { PASSWORD_HASH_RE, planImport, rosterKey, signatureName, type ImportRow } from "./logic.ts";
import { ROSTER, SUBJECTS } from "./roster.ts";

test("rapor signature joins gelar with a comma", () => {
  assert.equal(signatureName("Arif Azwar Anas", "S.Pd"), "Arif Azwar Anas, S.Pd");
  assert.equal(signatureName("  Arif Azwar Anas ", " S.Pd.I "), "Arif Azwar Anas, S.Pd.I");
  assert.equal(signatureName("Tisandi", ""), "Tisandi");
});

test("roster matches the 2026/2027 assignment sheet", () => {
  assert.equal(ROSTER.length, 24);
  assert.equal(new Set(ROSTER.map((teacher) => teacher.key)).size, 24);
  assert.equal(SUBJECTS.length, 14);
  const arif = ROSTER.find((teacher) => teacher.name === "Arif Azwar Anas");
  assert.ok(arif);
  assert.equal(arif.key, rosterKey("Arif Azwar Anas"));
  assert.deepEqual(
    arif.duties.map((duty) => duty.mapel),
    ["Pendidikan Pancasila", "Bahasa Indonesia", "Ilmu Pengetahuan Alam dan Sosial", "Seni Budaya"],
  );
  assert.equal(ROSTER.find((teacher) => teacher.name === "Marnie Septia .K")?.key, "marnie-septia-k");
  assert.equal(ROSTER.find((teacher) => teacher.name === "Silvia Sa'diah")?.key, "silvia-sadiah");
  assert.equal(ROSTER.find((teacher) => teacher.name === "Febrian Raka Ramadan")?.duties.length, 15);
});

test("import skips duplicates and unknown names", () => {
  const row = (rosterKey: string, name: string): ImportRow => ({
    rosterKey,
    name,
    gelar: "S.Pd",
    nip: "",
    nuptk: "",
    phone: "",
    email: "",
    note: "",
    status: "active",
    createdBy: "admin",
    passwordHash: "scrypt$" + "ab".repeat(16) + "$" + "cd".repeat(32),
  });
  assert.match(row("x", "X").passwordHash, PASSWORD_HASH_RE);
  const known = new Set(ROSTER.map((teacher) => teacher.key));
  const arif = ROSTER[3];
  assert.equal(arif.name, "Arif Azwar Anas");
  const plan = planImport(
    [arif.key],
    [row(arif.key, arif.name), row(arif.key, arif.name), row("bukan-guru", "Orang Lain"), row(ROSTER[0].key, ROSTER[0].name)],
    known,
  );
  assert.equal(plan.insert.length, 1);
  assert.equal(plan.insert[0].rosterKey, ROSTER[0].key);
  assert.deepEqual(
    plan.skipped.map((item) => item.reason),
    ["sudah ada", "sudah ada", "bukan nama di daftar guru"],
  );
});
