import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { SchoolLogo, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Shield,
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

function appIcon(id: string, className = "size-7"): ReactNode {
  switch (id) {
    case "penilaian":
      return <ClipboardList className={className} aria-hidden />;
    case "sarpras":
      return <Building2 className={className} aria-hidden />;
    case "lms":
      return <GraduationCap className={className} aria-hidden />;
    case "perpustakaan":
      return <BookOpen className={className} aria-hidden />;
    default:
      return <ExternalLink className={className} aria-hidden />;
  }
}

function AppCatalogCard({ app }: { app: SchoolAppLink }) {
  const live = app.live && Boolean(app.href);

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ${
            live ? "bg-pine text-sheet shadow-sm" : "bg-mint text-pine"
          }`}
        >
          {appIcon(app.id)}
        </span>
        {live ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-pine/10 px-2.5 py-1 text-xs font-semibold text-pine">
            Aktif
          </span>
        ) : (
          <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-line">
            Segera hadir
          </span>
        )}
      </div>

      <h3 className="mt-5 font-serif text-2xl text-ink">{app.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{app.summary}</p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs font-semibold tracking-wide text-pine uppercase">{app.audienceLabel}</span>
        {live ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine">
            Buka aplikasi
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        ) : (
          <span className="text-sm text-muted">Belum tersedia</span>
        )}
      </div>
    </>
  );

  if (live && app.href) {
    return (
      <a
        href={app.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-sheet p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-pine opacity-0 transition-opacity group-hover:opacity-100" />
        {body}
      </a>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-dashed border-line bg-sheet/80 p-6">
      {body}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-line" aria-hidden />
      <span className="text-xs font-semibold tracking-widest text-muted uppercase">{children}</span>
      <span className="h-px flex-1 bg-line" aria-hidden />
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
      {/* Hero lembut */}
      <div className="border-b border-line bg-sheet">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-10 md:pt-10 md:pb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <SchoolLogo className="size-11" />
              <span>
                <span className="block font-semibold text-ink">{identity.shortName}</span>
                <span className="text-sm text-muted">Portal sekolah</span>
              </span>
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold text-pine underline-offset-2 hover:underline"
            >
              ← Beranda
            </Link>
          </div>

          <div className="mt-10 max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-mint px-3 py-1 text-xs font-semibold tracking-wide text-pine uppercase">
              Masuk & aplikasi
            </span>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Satu pintu, beberapa aplikasi
            </h1>
            <p className="mt-4 text-lg text-muted">
              Pilih aplikasi sesuai peran Anda. Setiap layanan punya subdomain dan akun sendiri — portal
              hanya mengarahkan, bukan menyatukan login.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-14">
        {/* Katalog staf */}
        <section aria-labelledby="staf-heading">
          <SectionLabel>Khusus guru & staf</SectionLabel>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="staf-heading" className="font-serif text-2xl text-ink md:text-3xl">
                Aplikasi internal
              </h2>
              <p className="mt-1 max-w-xl text-sm text-muted">
                Hanya untuk guru dan staf. Tidak untuk pengunjung, murid, atau orang tua.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {staffApps.map((app) => (
              <AppCatalogCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        {/* Katalog murid */}
        <section aria-labelledby="murid-heading" className="mt-14">
          <SectionLabel>Untuk murid</SectionLabel>
          <div className="mt-4">
            <h2 id="murid-heading" className="font-serif text-2xl text-ink md:text-3xl">
              Belajar & bacaan
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              LMS dan perpustakaan digital. Akan aktif setelah subdomain siap.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {learnerApps.map((app) => (
              <AppCatalogCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        {/* Form admin */}
        <section aria-labelledby="portal-heading" className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm lg:grid lg:grid-cols-5">
            <div className="relative bg-pine-deep px-6 py-8 text-sheet lg:col-span-2 lg:px-8 lg:py-10">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-sheet/15">
                <Shield className="size-5" aria-hidden />
              </div>
              <p className="mt-5 text-sm font-semibold text-sheet/70 uppercase tracking-wide">Portal situs</p>
              <h2 id="portal-heading" className="mt-2 font-serif text-2xl md:text-3xl">
                Admin & operator
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-sheet/80">
                Mengelola beranda, berita, program, dan prestasi. Hanya admin yang mengatur akun. Ini
                bukan login penilaian, LMS, atau perpustakaan.
              </p>
            </div>

            <div className="px-6 py-8 lg:col-span-3 lg:px-10 lg:py-10">
              <form className="grid gap-4" onSubmit={onSubmit}>
                <label className="block text-sm font-semibold text-muted">
                  Surel
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 h-12 w-full rounded-xl border border-line bg-paper px-3.5 transition-shadow focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
                    autoComplete="username"
                    placeholder="nama@sekolah.sch.id"
                  />
                </label>
                <label className="block text-sm font-semibold text-muted">
                  Sandi
                  <div className="relative mt-1.5">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-line bg-paper px-3.5 pr-24 transition-shadow focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 h-12 px-3.5 text-sm font-semibold text-pine"
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
                  className="mt-1 h-12 rounded-full bg-pine font-semibold text-sheet transition-colors hover:bg-pine-deep disabled:opacity-60"
                >
                  {busy ? "Memeriksa…" : "Masuk ke panel kelola"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-muted">
          Butuh bantuan? Lihat{" "}
          <Link to="/kontak" className="font-semibold text-pine hover:underline">
            kontak sekolah
          </Link>
          {" · "}
          <Link to="/" className="font-semibold text-pine hover:underline">
            Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
