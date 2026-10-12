import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { getTeacherDirectory, loginTeacher, registerTeacher, requestTeacherReset } from "@/lib/teachers/api";
import type { DirectoryEntry } from "@/lib/teachers/logic";
import { ROSTER, SCHOOL_YEAR, teacherByKey } from "@/lib/teachers/roster";
import { DutyList, GelarHints, GuruChrome, NameSelect, SecretField, SignaturePreview, TextField } from "./ui";

type Mode = "masuk" | "daftar" | "lupa";

const emptyProfile = { gelar: "", nip: "", nuptk: "", phone: "", email: "", note: "" };

export function GuruAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("masuk");
  const [directory, setDirectory] = useState<DirectoryEntry[] | null>(null);
  const [rosterKey, setRosterKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getTeacherDirectory().then((result) => {
      if (Array.isArray(result)) setDirectory(result);
      else setError(result.message);
    });
  }, []);

  const taken = new Set(
    (directory ?? []).filter((entry) => entry.status === "active" || entry.status === "pending").map((entry) => entry.rosterKey),
  );
  const loginOptions = (directory ?? [])
    .filter((entry) => entry.status === "active")
    .map((entry) => ({ key: entry.rosterKey, name: entry.name }));
  const resetOptions = (directory ?? [])
    .filter((entry) => entry.status === "active" || entry.status === "pending")
    .map((entry) => ({ key: entry.rosterKey, name: entry.name }));
  const registerOptions = ROSTER.filter((teacher) => !taken.has(teacher.key)).map((teacher) => ({
    key: teacher.key,
    name: teacher.name,
  }));
  const options = mode === "masuk" ? loginOptions : mode === "lupa" ? resetOptions : registerOptions;
  const selected = teacherByKey(rosterKey);

  function switchMode(next: Mode) {
    setMode(next);
    setRosterKey("");
    setPassword("");
    setConfirm("");
    setMessage("");
    setError("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!rosterKey) {
      setError("Pilih nama guru dari daftar.");
      return;
    }
    if (mode !== "masuk" && password !== confirm) {
      setError("Ulangan sandi tidak sama.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "masuk") {
        const result = await loginTeacher({ data: { rosterKey, password } });
        if (!result.ok) {
          setError(result.message);
          return;
        }
        await navigate({ to: "/guru/profil" });
        return;
      }
      if (mode === "lupa") {
        const result = await requestTeacherReset({ data: { rosterKey, password } });
        if (!result.ok) {
          setError(result.message);
          return;
        }
        setMessage(result.message ?? "Permintaan terkirim.");
        setPassword("");
        setConfirm("");
        return;
      }
      const teacher = teacherByKey(rosterKey);
      const result = await registerTeacher({
        data: {
          rosterKey,
          password,
          name: teacher?.name ?? "",
          ...profile,
        },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message ?? "Pengajuan terkirim.");
      setDirectory((current) => [
        ...(current ?? []).filter((entry) => entry.rosterKey !== rosterKey),
        { rosterKey, name: teacher?.name ?? "", status: "pending" },
      ]);
      setRosterKey("");
      setPassword("");
      setConfirm("");
      setProfile(emptyProfile);
    } finally {
      setBusy(false);
    }
  }

  return (
    <GuruChrome>
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-4xl">Masuk guru</h1>
        <p className="mt-3 text-muted">
          Nama hanya bisa dipilih dari daftar penugasan {SCHOOL_YEAR}, supaya tulisan di rapor tidak pecah.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {(
            [
              ["masuk", "Masuk"],
              ["daftar", "Daftar"],
              ["lupa", "Lupa sandi"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchMode(id)}
              className={
                mode === id
                  ? "h-11 rounded-full bg-pine px-2 text-sm font-semibold text-sheet"
                  : "h-11 rounded-full border border-line bg-sheet px-2 text-sm font-semibold text-ink"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-card border border-line bg-sheet p-5">
          {directory === null ? <p className="text-sm text-muted">Memuat daftar guru…</p> : null}
          <NameSelect
            label={mode === "daftar" ? "Nama di daftar sekolah" : "Nama guru"}
            options={options}
            value={rosterKey}
            onChange={setRosterKey}
          />
          {selected ? (
            <div>
              <p className="text-sm font-semibold text-muted">Tugas {SCHOOL_YEAR}</p>
              <div className="mt-2">
                <DutyList duties={selected.duties} />
              </div>
            </div>
          ) : null}
          {mode === "daftar" ? (
            <>
              <TextField
                label="Gelar pendidikan terakhir"
                value={profile.gelar}
                placeholder="S.Pd"
                onChange={(gelar) => setProfile((current) => ({ ...current, gelar }))}
              />
              <GelarHints onPick={(gelar) => setProfile((current) => ({ ...current, gelar }))} />
              <SignaturePreview name={selected?.name ?? ""} gelar={profile.gelar} />
              <TextField label="NIP" value={profile.nip} onChange={(nip) => setProfile((current) => ({ ...current, nip }))} />
              <TextField
                label="NUPTK"
                value={profile.nuptk}
                onChange={(nuptk) => setProfile((current) => ({ ...current, nuptk }))}
              />
              <TextField
                label="Telepon"
                value={profile.phone}
                onChange={(phone) => setProfile((current) => ({ ...current, phone }))}
              />
            </>
          ) : null}
          <SecretField
            label={mode === "lupa" ? "Sandi baru" : "Sandi"}
            value={password}
            onChange={setPassword}
            autoComplete={mode === "masuk" ? "current-password" : "new-password"}
          />
          {mode !== "masuk" ? (
            <SecretField label="Ulangi sandi" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          ) : null}
          {mode === "daftar" ? (
            <p className="text-sm text-muted">Pengajuan menunggu persetujuan admin. Sandi disembunyikan sampai Anda menekan Tampilkan.</p>
          ) : null}
          {mode === "lupa" ? (
            <p className="text-sm text-muted">
              Isi sandi baru, lalu minta admin menyetujuinya. Setelah disetujui, masuk dengan sandi itu.
            </p>
          ) : null}
          {error ? <p className="text-sm font-semibold text-pine-deep">{error}</p> : null}
          {message ? <p className="text-sm font-semibold text-pine">{message}</p> : null}
          <button type="submit" disabled={busy} className="h-12 rounded-full bg-pine font-semibold text-sheet disabled:opacity-60">
            {busy ? "Memproses…" : mode === "masuk" ? "Masuk" : mode === "daftar" ? "Ajukan akun" : "Minta sandi baru"}
          </button>
          {mode === "masuk" ? (
            <button type="button" onClick={() => switchMode("lupa")} className="h-11 text-sm font-semibold text-pine">
              Lupa sandi?
            </button>
          ) : null}
        </form>
      </div>
    </GuruChrome>
  );
}
