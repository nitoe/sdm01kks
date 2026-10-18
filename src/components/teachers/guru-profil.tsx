import { ExternalLink } from "lucide-react";
import { PENILAIAN_LOGIN_URL } from "@/lib/site/links";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  changeTeacherPassword,
  getTeacherProfile,
  logoutTeacher,
  saveTeacherProfile,
  type Profile,
} from "@/lib/teachers/api";
import { SCHOOL_YEAR, teacherByKey } from "@/lib/teachers/roster";
import { DutyList, GelarHints, GuruChrome, SecretField, SignaturePreview, TextField } from "./ui";

export function GuruProfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    void getTeacherProfile().then((result) => {
      if (result && !("ok" in result && result.ok === false)) setProfile(result as Profile);
      setReady(true);
    });
  }, []);

  const roster = profile ? teacherByKey(profile.rosterKey) : undefined;

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await saveTeacherProfile({
        data: {
          name: profile.name,
          gelar: profile.gelar,
          nip: profile.nip,
          nuptk: profile.nuptk,
          phone: profile.phone,
          email: profile.email,
          note: profile.note,
        },
      });
      if (!result.ok) setError(result.message);
      else setMessage(result.message ?? "Data tersimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function changePass(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (nextPassword !== confirmPassword) {
      setError("Ulangan sandi tidak sama.");
      return;
    }
    setBusy(true);
    try {
      const result = await changeTeacherPassword({
        data: { current: currentPassword, next: nextPassword },
      });
      if (!result.ok) setError(result.message);
      else {
        setMessage(result.message ?? "Sandi diganti.");
        setCurrentPassword("");
        setNextPassword("");
        setConfirmPassword("");
      }
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await logoutTeacher();
    await navigate({ to: "/" });
  }

  if (!ready) {
    return (
      <GuruChrome>
        <p className="text-muted">Memuat akun…</p>
      </GuruChrome>
    );
  }

  if (!profile) {
    return (
      <GuruChrome>
        <h1 className="font-serif text-3xl">Belum masuk</h1>
        <p className="mt-3 text-muted">Masuk dulu untuk mengubah nama, gelar, dan data rapor.</p>
        <Link
          to="/guru"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-pine px-5 font-semibold text-sheet"
        >
          Ke halaman masuk
        </Link>
      </GuruChrome>
    );
  }

  return (
    <GuruChrome>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Data saya</h1>
          <p className="mt-2 text-muted">
            Nama di daftar sekolah: {roster?.name ?? profile.rosterKey}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="h-11 shrink-0 font-semibold text-muted"
        >
          Keluar
        </button>
      </div>
      <a
        href={PENILAIAN_LOGIN_URL}
        className="mt-6 flex items-center gap-3 rounded-card border border-line bg-sheet p-4 transition-colors hover:border-pine"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">Buka aplikasi penilaian</span>
          <span className="block text-sm text-muted">
            Input nilai dan rapor di penilaian.sdmuhammadiyah01kks.sch.id
          </span>
        </span>
        <ExternalLink className="size-5 shrink-0 text-pine" aria-hidden />
      </a>
      <form
        onSubmit={save}
        className="mt-6 grid gap-4 rounded-card border border-line bg-sheet p-5"
      >
        <TextField
          label="Nama di rapor"
          value={profile.name}
          onChange={(name) => setProfile({ ...profile, name })}
        />
        <TextField
          label="Gelar pendidikan terakhir"
          value={profile.gelar}
          placeholder="S.Pd"
          onChange={(gelar) => setProfile({ ...profile, gelar })}
        />
        <GelarHints onPick={(gelar) => setProfile({ ...profile, gelar })} />
        <SignaturePreview name={profile.name} gelar={profile.gelar} />
        <p className="text-sm text-muted">
          Gelar ditulis setelah nama dan dipisah koma, misalnya Arif Azwar Anas, S.Pd.
        </p>
        <TextField
          label="NIP"
          value={profile.nip}
          onChange={(nip) => setProfile({ ...profile, nip })}
        />
        <TextField
          label="NUPTK"
          value={profile.nuptk}
          onChange={(nuptk) => setProfile({ ...profile, nuptk })}
        />
        <TextField
          label="Telepon"
          value={profile.phone}
          onChange={(phone) => setProfile({ ...profile, phone })}
        />
        <TextField
          label="Email"
          value={profile.email}
          onChange={(email) => setProfile({ ...profile, email })}
        />
        <label className="block text-sm font-semibold text-muted">
          Catatan
          <textarea
            value={profile.note}
            onChange={(event) => setProfile({ ...profile, note: event.target.value })}
            rows={3}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-full bg-pine font-semibold text-sheet disabled:opacity-60"
        >
          Simpan data
        </button>
      </form>
      <section className="mt-6 rounded-card border border-line bg-sheet p-5">
        <h2 className="font-serif text-2xl">Tugas mengajar {SCHOOL_YEAR}</h2>
        <div className="mt-4">
          <DutyList duties={roster?.duties ?? []} />
        </div>
      </section>
      <form
        onSubmit={changePass}
        className="mt-6 grid gap-4 rounded-card border border-line bg-sheet p-5"
      >
        <h2 className="font-serif text-2xl">Ganti sandi</h2>
        <SecretField
          label="Sandi sekarang"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />
        <SecretField
          label="Sandi baru"
          value={nextPassword}
          onChange={setNextPassword}
          autoComplete="new-password"
        />
        <SecretField
          label="Ulangi sandi baru"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-full border border-line font-semibold text-ink disabled:opacity-60"
        >
          Simpan sandi
        </button>
      </form>
      {error ? <p className="mt-4 text-sm font-semibold text-pine-deep">{error}</p> : null}
      {message ? <p className="mt-4 text-sm font-semibold text-pine">{message}</p> : null}
    </GuruChrome>
  );
}
