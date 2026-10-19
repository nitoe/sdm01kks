import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SchoolLogo, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import { ExternalLink } from "lucide-react";
import { LEARNER_APPS, STAFF_APPS, type SchoolAppLink } from "@/lib/site/links";
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

function AppLinkCard({ app }: { app: SchoolAppLink }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink">{app.title}</span>
          {!app.live ? (
            <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">
              Segera
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-sm text-muted">{app.description}</span>
      </span>
      {app.live ? (
        <ExternalLink className="mt-1 size-5 shrink-0 text-pine" aria-hidden />
      ) : null}
    </>
  );

  if (app.live && app.href) {
    return (
      <a
        href={app.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 rounded-xl border border-line bg-paper p-4 transition-colors hover:border-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
      >
        {body}
      </a>
    );
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-line border-dashed bg-paper/60 p-4 opacity-80"
      aria-disabled="true"
    >
      {body}
    </div>
  );
}

function MasukPage() {
  useBootSite();
  const identity = useSiteStore((state) => state.content.identity);
  const markAdmin = useSiteStore((state) => state.markAdmin);
  const admin = useSiteStore((state) => state.admin);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (admin) void navigate({ to: "/kelola" });
  }, [admin, navigate]);

  async function onSubmit(event: FormEvent) {
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
    if (!("signedIn" in status) || !status.signedIn || !status.role) {
      setError("Gagal membaca akun. Coba masuk lagi.");
      return;
    }
    markAdmin(email.trim().toLowerCase(), status.usingDefaultPassword === true, status.role);
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
            Admin dan operator mengelola tampilan depan, berita, program, dan prestasi. Hanya admin yang
            mengatur akun.
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
          <p className="mt-2 text-muted">Masuk dengan surel dan sandi akun admin atau operator.</p>

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
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

          {/* Gerbang staf: penilaian (live) + sarpras (segera). Tidak di header publik. */}
          <div className="mt-10">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Khusus guru & staf</p>
            <p className="mt-1 text-sm text-muted">
              Bukan untuk pengunjung, murid, atau orang tua. Login di subdomain masing-masing.
            </p>
            <div className="mt-3 grid gap-3">
              {STAFF_APPS.map((app) => (
                <AppLinkCard key={app.id} app={app} />
              ))}
            </div>
          </div>

          {/* Gerbang murid: LMS + perpustakaan — belum live, hanya penanda slot. */}
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Untuk murid</p>
            <p className="mt-1 text-sm text-muted">LMS dan perpustakaan digital. Akan aktif setelah subdomain siap.</p>
            <div className="mt-3 grid gap-3">
              {LEARNER_APPS.map((app) => (
                <AppLinkCard key={app.id} app={app} />
              ))}
            </div>
          </div>

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
