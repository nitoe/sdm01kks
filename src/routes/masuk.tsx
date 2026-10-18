import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SchoolLogo, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PENILAIAN_LOGIN_URL } from "@/lib/site/links";
import { getAdminAccount, loginAdminAccount } from "@/lib/teachers/api";

export const Route = createFileRoute("/masuk")({
  head: () => ({
    meta: [
      { title: "Masuk · SD Muhammadiyah 01 Kukusan" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MasukPage,
});

type Role = "admin" | "guru";

function MasukPage() {
  useBootSite();
  const identity = useSiteStore((state) => state.content.identity);
  const markAdmin = useSiteStore((state) => state.markAdmin);
  const admin = useSiteStore((state) => state.admin);
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("admin@sdmuhammadiyah01kks.sch.id");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (admin) void navigate({ to: "/kelola" });
  }, [admin, navigate]);

  async function onAdminSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await loginAdminAccount({ data: { email, password } });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const status = await getAdminAccount();
    markAdmin(
      email.trim().toLowerCase(),
      "usingDefaultPassword" in status && status.usingDefaultPassword === true,
    );
    await navigate({ to: "/kelola" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-pine-deep px-10 py-12 text-sheet lg:flex">
        <div className="flex items-center gap-3">
          <SchoolLogo className="size-12" />
          <div>
            <p className="font-semibold">{identity.shortName}</p>
            <p className="text-sm text-sheet/70">{identity.name}</p>
          </div>
        </div>
        <div>
          <h1 className="font-serif text-4xl">Masuk ke situs sekolah</h1>
          <p className="mt-4 max-w-md text-sheet/80">
            Admin mengelola tampilan depan, berita, program, dan prestasi. Guru memakai akun
            terpisah untuk keperluan internal sekolah.
          </p>
        </div>
        <p className="text-sm text-sheet/60">Khusus petugas sekolah yang terdaftar</p>
      </aside>

      <div className="flex items-center justify-center bg-sheet px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <SchoolLogo className="size-11" />
            <div>
              <p className="font-semibold text-ink">{identity.shortName}</p>
              <p className="text-sm text-muted">Masuk</p>
            </div>
          </div>

          <h2 className="font-serif text-3xl text-ink">Masuk</h2>
          <p className="mt-2 text-muted">
            Pilih peran, lalu masuk dengan akun yang sudah terdaftar.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-line bg-paper p-1">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={
                role === "admin"
                  ? "h-11 rounded-lg bg-pine font-semibold text-sheet"
                  : "h-11 rounded-lg font-semibold text-muted"
              }
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("guru")}
              className={
                role === "guru"
                  ? "h-11 rounded-lg bg-pine font-semibold text-sheet"
                  : "h-11 rounded-lg font-semibold text-muted"
              }
            >
              Guru
            </button>
          </div>

          {role === "admin" ? (
            <form className="mt-6 grid gap-4" onSubmit={onAdminSubmit}>
              <label className="block text-sm font-semibold text-muted">
                Surel
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
                  autoComplete="username"
                  placeholder="nama@sekolah.sch.id"
                />
              </label>
              <label className="block text-sm font-semibold text-muted">
                Sandi
                <div className="relative mt-1">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-line bg-paper px-3 pr-24"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 h-12 px-3 text-sm font-semibold text-pine"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
              </label>
              {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="h-12 rounded-full bg-pine font-semibold text-sheet disabled:opacity-60"
              >
                {busy ? "Memeriksa…" : "Masuk"}
              </button>
            </form>
          ) : (
            <div className="mt-6 grid gap-3">
              <p className="text-sm font-semibold text-muted">Mau masuk ke mana?</p>
              <Link
                to="/guru"
                className="group flex items-start gap-3 rounded-xl border border-line bg-paper p-4 transition-colors hover:border-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">Portal sekolah</span>
                  <span className="mt-1 block text-sm text-muted">
                    Data diri dan tanda tangan rapor. Pilih nama dari daftar guru, atau ajukan akun
                    baru.
                  </span>
                </span>
                <ArrowRight
                  className="mt-1 size-5 shrink-0 text-pine transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
              <a
                href={PENILAIAN_LOGIN_URL}
                className="group flex items-start gap-3 rounded-xl border border-line bg-paper p-4 transition-colors hover:border-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">Aplikasi penilaian</span>
                  <span className="mt-1 block text-sm text-muted">
                    Input nilai dan rapor. Dibuka di penilaian.sdmuhammadiyah01kks.sch.id dengan
                    akun aplikasi penilaian.
                  </span>
                </span>
                <ExternalLink className="mt-1 size-5 shrink-0 text-pine" aria-hidden />
              </a>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted">
            <Link to="/" className="font-semibold text-pine">
              Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
