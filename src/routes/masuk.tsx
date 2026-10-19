import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { SchoolLogo, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import {
  BookOpen,
  Building2,
  ClipboardList,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { ALL_SCHOOL_APPS, type SchoolAppLink } from "@/lib/site/links";
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

function appIcon(id: string): ReactNode {
  const cls = "size-6 text-pine";
  switch (id) {
    case "penilaian":
      return <ClipboardList className={cls} aria-hidden />;
    case "sarpras":
      return <Building2 className={cls} aria-hidden />;
    case "lms":
      return <GraduationCap className={cls} aria-hidden />;
    case "perpustakaan":
      return <BookOpen className={cls} aria-hidden />;
    default:
      return <ExternalLink className={cls} aria-hidden />;
  }
}

function AppCatalogCard({ app }: { app: SchoolAppLink }) {
  const inner = (
    <>
      <div className="flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mint text-pine">
          {appIcon(app.id)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-xl text-ink">{app.title}</span>
            {app.live ? (
              <span className="rounded-full bg-pine/10 px-2 py-0.5 text-xs font-semibold text-pine">
                Aktif
              </span>
            ) : (
              <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">
                Segera
              </span>
            )}
          </span>
          <span className="mt-1 block text-sm text-muted">{app.summary}</span>
          <span className="mt-2 inline-block text-xs font-semibold tracking-wide text-pine uppercase">
            {app.audienceLabel}
          </span>
        </span>
        {app.live ? (
          <ExternalLink className="mt-1 size-5 shrink-0 text-pine opacity-70" aria-hidden />
        ) : null}
      </div>
    </>
  );

  if (app.live && app.href) {
    return (
      <a
        href={app.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-card border border-line bg-sheet p-5 shadow-sm transition-colors hover:border-pine hover:bg-mint/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="rounded-card border border-dashed border-line bg-sheet/70 p-5 opacity-90"
      aria-disabled="true"
    >
      {inner}
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

  const staffApps = ALL_SCHOOL_APPS.filter((a) => a.audience === "staff");
  const learnerApps = ALL_SCHOOL_APPS.filter((a) => a.audience === "learner");

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <div className="mb-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <SchoolLogo className="size-11" />
            <span>
              <span className="block font-semibold text-ink">{identity.shortName}</span>
              <span className="text-sm text-muted">Masuk & aplikasi sekolah</span>
            </span>
          </Link>
        </div>

        {/* Katalog aplikasi — di atas, mudah dipahami */}
        <section aria-labelledby="katalog-app">
          <p className="text-sm font-semibold text-pine">Aplikasi sekolah</p>
          <h1 id="katalog-app" className="mt-2 font-serif text-3xl text-ink md:text-4xl">
            Pilih aplikasi sesuai peran Anda
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Setiap aplikasi berada di subdomain sendiri dan memakai akun masing-masing. Portal ini hanya
            mengarahkan — bukan tempat login guru, murid, atau orang tua.
          </p>

          <div className="mt-8">
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Khusus guru & staf
            </h2>
            <p className="mt-1 text-sm text-muted">
              Tidak untuk pengunjung, murid, atau orang tua. Memerlukan akun staf di subdomain terkait.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {staffApps.map((app) => (
                <AppCatalogCard key={app.id} app={app} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xs font-semibold tracking-wide text-muted uppercase">Untuk murid</h2>
            <p className="mt-1 text-sm text-muted">
              LMS dan perpustakaan digital. Akan dapat dibuka setelah subdomain siap.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {learnerApps.map((app) => (
                <AppCatalogCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>

        {/* Form admin/operator — dipisah jelas dari katalog app */}
        <section
          aria-labelledby="masuk-portal"
          className="mt-14 grid gap-8 border-t border-line pt-12 lg:grid-cols-2 lg:items-start"
        >
          <div>
            <p className="text-sm font-semibold text-pine">Portal situs</p>
            <h2 id="masuk-portal" className="mt-2 font-serif text-2xl text-ink md:text-3xl">
              Admin & operator
            </h2>
            <p className="mt-3 text-muted">
              Mengelola tampilan depan, berita, program, dan prestasi. Hanya admin yang mengatur akun.
              Ini bukan login aplikasi penilaian atau LMS.
            </p>
          </div>

          <div className="rounded-card border border-line bg-sheet p-6 shadow-sm">
            <form className="grid gap-4" onSubmit={onSubmit}>
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
                {busy ? "Memeriksa…" : "Masuk ke panel kelola"}
              </button>
            </form>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-muted">
          <Link to="/" className="font-semibold text-pine">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
