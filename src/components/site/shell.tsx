import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useSiteStore } from "@/lib/site/store";

const NAV = [
  { to: "/", label: "Beranda", exact: true },
  { to: "/profil", label: "Profil", exact: false },
  { to: "/program", label: "Program", exact: false },
  { to: "/prestasi", label: "Prestasi", exact: false },
  { to: "/berita", label: "Berita", exact: false },
  { to: "/galeri", label: "Galeri", exact: false },
  { to: "/kontak", label: "Kontak", exact: false },
] as const;

export function useBootSite() {
  const boot = useSiteStore((state) => state.boot);
  useEffect(() => {
    boot();
  }, [boot]);
}

export function SchoolLogo({ className }: { className?: string }) {
  const logoUrl = useSiteStore((state) => state.content.identity.logoUrl);
  if (logoUrl) {
    return <img src={logoUrl} alt="" className={`rounded-xl object-cover ${className ?? ""}`} />;
  }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" className="fill-pine" />
      <path d="M24 8c-2.2 4.8-2.2 9.6 0 14.4 2.2-4.8 2.2-9.6 0-14.4z" className="fill-brass-soft" opacity="0.9" />
      <path
        d="M12 34V22l12-7 12 7v12h-8v-7h-8v7h-8z"
        className="fill-brass-soft"
      />
    </svg>
  );
}

/** @deprecated use SchoolLogo */
export function Mark({ className }: { className?: string }) {
  return <SchoolLogo className={className} />;
}

export function SiteFrame({ children }: { children: ReactNode }) {
  useBootSite();
  const identity = useSiteStore((state) => state.content.identity);
  const admin = useSiteStore((state) => state.admin);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {admin ? (
        <div className="bg-pine-deep text-sheet">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-sm">
            <p>Anda masuk sebagai admin. Perubahan tersimpan dan terbaca pengunjung lain.</p>
            <Link to="/kelola" className="shrink-0 font-semibold underline-offset-2 hover:underline">
              Panel kelola
            </Link>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-30 border-b border-line/80 bg-sheet/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <SchoolLogo className="size-11 shrink-0" />
            <span className="min-w-0">
              <span className="block text-[0.7rem] font-semibold tracking-[0.14em] text-pine uppercase">
                Muhammadiyah · Depok
              </span>
              <span className="block truncate font-serif text-lg leading-tight font-semibold text-ink">
                {identity.shortName}
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink data-[status=active]:bg-brass-soft data-[status=active]:text-pine-deep"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontak"
              className="ml-2 rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-sheet shadow-sm transition-colors hover:bg-pine-deep"
            >
              Hubungi kami
            </Link>
          </nav>

          <button
            type="button"
            className="ml-auto inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-line px-5 py-3 lg:hidden">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    className="block rounded-xl px-3 py-3 text-base font-medium data-[status=active]:bg-brass-soft data-[status=active]:text-pine-deep"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/kontak"
                  className="block rounded-xl bg-pine px-3 py-3 text-base font-semibold text-sheet"
                  onClick={() => setOpen(false)}
                >
                  Hubungi kami
                </Link>
              </li>
              <li>
                <Link
                  to="/masuk"
                  className="block rounded-xl px-3 py-3 text-base font-medium text-muted"
                  onClick={() => setOpen(false)}
                >
                  Masuk (admin / guru)
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const identity = useSiteStore((state) => state.content.identity);
  return (
    <footer className="mt-8 border-t border-pine-deep/20 bg-pine-deep text-sheet">
      <div className="pattern-islamic">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex gap-4">
              <SchoolLogo className="size-12 shrink-0" />
              <div>
                <p className="font-serif text-2xl leading-snug">{identity.name}</p>
                <p className="mt-2 max-w-sm text-sheet/75">{identity.tagline}</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-sheet/60">
              Bismillah — mendidik dengan adab, ilmu, dan kasih sayang di Kukusan, Depok.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-sheet/80 md:col-span-4">
            <p className="text-xs font-semibold tracking-wider text-brass-soft uppercase">Alamat</p>
            <p className="mt-2">{identity.address}</p>
            <p className="mt-4">{identity.phone}</p>
            <p>{identity.email}</p>
          </div>
          <div className="text-sm text-sheet/80 md:col-span-3">
            <p className="text-xs font-semibold tracking-wider text-brass-soft uppercase">Navigasi</p>
            <ul className="mt-2 grid gap-1.5">
              <li>
                <Link to="/profil" className="hover:text-brass-soft">
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/program" className="hover:text-brass-soft">
                  Program
                </Link>
              </li>
              <li>
                <Link to="/prestasi" className="hover:text-brass-soft">
                  Prestasi
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-brass-soft">
                  Kontak
                </Link>
              </li>
              <li>
                <Link to="/masuk" className="hover:text-brass-soft">
                  Masuk
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-xs text-sheet/50">{identity.foundation}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-14 pb-8">
      <p className="text-sm font-semibold tracking-[0.12em] text-pine uppercase">{kicker}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-ink md:text-5xl">{title}</h1>
      {lead ? <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p> : null}
    </header>
  );
}

export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="grid gap-4">
      {blocks.map((block) => (
        <p key={block.slice(0, 40)} className="text-ink">
          {block}
        </p>
      ))}
    </div>
  );
}
