import { useEffect, useState, type FormEvent } from "react";
import {
  decideTeacherAccount,
  decideTeacherReset,
  exportTeacherAccounts,
  getAdminGate,
  getAdminTeacherOverview,
  importTeacherAccounts,
  openAdminSession,
  registerTeacherByAdmin,
  setTeacherPassword,
  type Profile,
} from "@/lib/teachers/api";
import { signatureName, type ResetEntry } from "@/lib/teachers/logic";
import { ROSTER, SCHOOL_YEAR, SUBJECTS, teacherByKey } from "@/lib/teachers/roster";
import { DutyList, GelarHints, NameSelect, SecretField, SignaturePreview, TextField, statusLabel } from "./ui";

const emptyProfile = { gelar: "", nip: "", nuptk: "", phone: "", email: "", note: "" };

export function AdminGuruPanel() {
  const [gate, setGate] = useState<{ signedIn: boolean; usingDefaultPin: boolean } | null>(null);
  const [pin, setPin] = useState("");
  const [accounts, setAccounts] = useState<Profile[]>([]);
  const [resets, setResets] = useState<ResetEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "rejected">("all");
  const [rosterKey, setRosterKey] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  async function refresh() {
    const status = await getAdminGate();
    if (!status || !("signedIn" in status)) return;
    setGate(status);
    if (!status.signedIn) return;
    const overview = await getAdminTeacherOverview();
    if (!overview || !("admin" in overview)) return;
    if (!overview.admin) {
      setGate({ signedIn: false, usingDefaultPin: status.usingDefaultPin });
      return;
    }
    setAccounts(overview.accounts);
    setResets(overview.resets);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const taken = new Set(accounts.filter((account) => account.status !== "rejected").map((account) => account.rosterKey));
  const createOptions = ROSTER.filter((teacher) => !taken.has(teacher.key)).map((teacher) => ({
    key: teacher.key,
    name: teacher.name,
  }));
  const selected = teacherByKey(rosterKey);
  const visible = accounts.filter((account) => filter === "all" || account.status === filter);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setError("");
    const result = await openAdminSession({ data: { pin } });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setPin("");
    await refresh();
  }

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!rosterKey) {
      setError("Pilih nama guru.");
      return;
    }
    setBusy(true);
    try {
      const result = await registerTeacherByAdmin({
        data: { rosterKey, password, name: teacherByKey(rosterKey)?.name ?? "", ...profile },
      });
      if (!result.ok) setError(result.message);
      else {
        setMessage(result.message ?? "Akun dibuat.");
        setRosterKey("");
        setPassword("");
        setProfile(emptyProfile);
        await refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function act(work: () => Promise<{ ok: boolean; message?: string }>) {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await work();
      if (!result.ok) setError(result.message ?? "Gagal.");
      else setMessage(result.message ?? "Selesai.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    setError("");
    const result = await exportTeacherAccounts();
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const blob = new Blob([JSON.stringify(result.payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "akun-guru-sdm01kks.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Cadangan akun terunduh. Simpan berkasnya. Jangan dibagikan.");
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    setError("");
    setMessage("");
    let payload: unknown;
    try {
      payload = JSON.parse(await file.text());
    } catch {
      setError("Berkas tidak bisa dibaca.");
      return;
    }
    const result = await importTeacherAccounts({ data: payload });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const skipped = result.skipped.slice(0, 8).map((item) => `${item.name} (${item.reason})`);
    const more = result.skipped.length > 8 ? ` dan ${result.skipped.length - 8} lainnya` : "";
    setMessage(
      `Ditambahkan ${result.inserted} akun. Dilewati ${result.skipped.length} agar tidak dobel${
        skipped.length ? `: ${skipped.join(", ")}${more}` : "."
      }`,
    );
    await refresh();
  }

  if (!gate) return <p className="text-muted">Memuat akun guru…</p>;

  if (!gate.signedIn) {
    return (
      <form onSubmit={unlock} className="grid max-w-md gap-4">
        <h2 className="font-serif text-3xl">Akun guru</h2>
        <p className="text-muted">
          Sandi ini mengunci persetujuan akun, lupa sandi, dan cadangan. Sandi panel kelola di peramban ikut dibuka bersamaan jika sama.
        </p>
        <SecretField label="Sandi admin" value={pin} onChange={setPin} autoComplete="current-password" />
        {error ? <p className="text-sm font-semibold text-pine-deep">{error}</p> : null}
        <button type="submit" className="h-12 rounded-full bg-pine font-semibold text-sheet">
          Buka akun guru
        </button>
        {gate.usingDefaultPin ? (
          <p className="text-sm text-muted">
            Sandi awal: <span className="font-semibold text-ink">kukusan-admin</span>. Ganti lewat tab Sandi setelah masuk.
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="font-serif text-3xl">Akun guru</h2>
        <p className="mt-2 text-muted">
          {ROSTER.length} nama di daftar {SCHOOL_YEAR}. {SUBJECTS.length} mata pelajaran. Guru yang mendaftar sendiri menunggu persetujuan. Akun yang Anda buat di sini langsung aktif.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Menunggu" value={accounts.filter((account) => account.status === "pending").length} />
        <Stat label="Aktif" value={accounts.filter((account) => account.status === "active").length} />
        <Stat label="Lupa sandi" value={resets.length} />
      </section>

      {accounts.some((account) => account.status === "pending") ? (
        <section>
          <h3 className="font-serif text-2xl">Pengajuan baru</h3>
          <ul className="mt-3 grid gap-3">
            {accounts
              .filter((account) => account.status === "pending")
              .map((account) => (
                <li key={account.id} className="rounded-xl border border-line p-4">
                  <p className="font-semibold">{signatureName(account.name, account.gelar)}</p>
                  <p className="text-sm text-muted">Daftar sekolah: {teacherByKey(account.rosterKey)?.name}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void act(() => decideTeacherAccount({ data: { id: account.id, decision: "approve" } }))}
                      className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void act(() => decideTeacherAccount({ data: { id: account.id, decision: "reject" } }))}
                      className="h-11 rounded-full border border-line px-4 font-semibold"
                    >
                      Tolak
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {resets.length > 0 ? (
        <section>
          <h3 className="font-serif text-2xl">Lupa sandi</h3>
          <p className="mt-1 text-sm text-muted">Setujui hanya jika guru yang bersangkutan yang meminta.</p>
          <ul className="mt-3 grid gap-3">
            {resets.map((reset) => (
              <li key={reset.id} className="rounded-xl border border-line p-4">
                <p className="font-semibold">{reset.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void act(() => decideTeacherReset({ data: { id: reset.id, decision: "approve" } }))}
                    className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
                  >
                    Setujui sandi baru
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void act(() => decideTeacherReset({ data: { id: reset.id, decision: "reject" } }))}
                    className="h-11 rounded-full border border-line px-4 font-semibold"
                  >
                    Tolak
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h3 className="font-serif text-2xl">Buat akun dari admin</h3>
        <p className="mt-1 text-sm text-muted">Tetap tersedia. Akun ini langsung aktif, tanpa antrean.</p>
        <form onSubmit={createAccount} className="mt-4 grid gap-4">
          <NameSelect label="Nama di daftar sekolah" options={createOptions} value={rosterKey} onChange={setRosterKey} />
          {selected ? <DutyList duties={selected.duties} /> : null}
          <TextField
            label="Gelar"
            value={profile.gelar}
            placeholder="S.Pd"
            onChange={(gelar) => setProfile((current) => ({ ...current, gelar }))}
          />
          <GelarHints onPick={(gelar) => setProfile((current) => ({ ...current, gelar }))} />
          {selected ? <SignaturePreview name={selected.name} gelar={profile.gelar} /> : null}
          <SecretField label="Sandi awal" value={password} onChange={setPassword} autoComplete="new-password" />
          <button type="submit" disabled={busy} className="h-12 rounded-full bg-pine font-semibold text-sheet disabled:opacity-60">
            Buat akun
          </button>
        </form>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => void download()} className="h-12 rounded-full border border-line font-semibold">
          Ekspor akun
        </button>
        <label className="flex h-12 cursor-pointer items-center justify-center rounded-full border border-line font-semibold">
          Impor akun
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void onImport(file);
            }}
          />
        </label>
        <p className="text-sm text-muted sm:col-span-2">
          Impor menambahkan akun yang belum ada. Nama yang sudah terdaftar dilewati, jadi tidak jadi dobel. Sandi di berkas tersandi.
        </p>
      </section>

      <section>
        <h3 className="font-serif text-2xl">Daftar akun</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "Semua"],
              ["pending", "Menunggu"],
              ["active", "Aktif"],
              ["rejected", "Ditolak"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                filter === id
                  ? "h-10 rounded-full bg-pine px-3 text-sm font-semibold text-sheet"
                  : "h-10 rounded-full border border-line px-3 text-sm font-semibold"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="mt-4 grid gap-3">
          {visible.length === 0 ? <li className="text-sm text-muted">Belum ada akun di saringan ini.</li> : null}
          {visible.map((account) => {
            const teacher = teacherByKey(account.rosterKey);
            return (
              <li key={account.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{signatureName(account.name, account.gelar)}</p>
                  <p className="text-sm font-semibold text-pine">{statusLabel(account.status)}</p>
                </div>
                <p className="text-sm text-muted">
                  Daftar: {teacher?.name ?? account.rosterKey}
                  {account.phone ? ` · ${account.phone}` : ""}
                </p>
                {account.status !== "rejected" ? (
                  <form
                    className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const next = passwords[account.id] ?? "";
                      void act(() => setTeacherPassword({ data: { id: account.id, password: next } }));
                    }}
                  >
                    <SecretField
                      label="Sandi baru dari admin"
                      value={passwords[account.id] ?? ""}
                      onChange={(value) => setPasswords((current) => ({ ...current, [account.id]: value }))}
                      autoComplete="new-password"
                    />
                    <button type="submit" disabled={busy} className="h-12 self-end rounded-full border border-line px-4 font-semibold">
                      Ganti
                    </button>
                  </form>
                ) : null}
                {teacher ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-pine">Tugas mengajar</summary>
                    <div className="mt-2">
                      <DutyList duties={teacher.duties} />
                    </div>
                  </details>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-2xl">Penugasan {SCHOOL_YEAR}</h3>
        <p className="mt-1 text-sm text-muted">Mapel: {SUBJECTS.join(", ")}.</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-pine">Lihat tugas setiap guru</summary>
          <ul className="mt-4 grid gap-3">
            {ROSTER.map((teacher) => (
              <li key={teacher.key} className="rounded-xl bg-paper p-4">
                <p className="font-semibold">{teacher.name}</p>
                <div className="mt-2">
                  <DutyList duties={teacher.duties} />
                </div>
              </li>
            ))}
          </ul>
        </details>
      </section>

      {error ? <p className="text-sm font-semibold text-pine-deep">{error}</p> : null}
      {message ? <p className="text-sm font-semibold text-pine">{message}</p> : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-paper px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-serif text-3xl">{value}</p>
    </div>
  );
}
