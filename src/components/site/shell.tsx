import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AnnouncementLightbox } from "@/components/site/announcement-lightbox";
import { useSiteStore } from "@/lib/site/store";

const NAV = [
  { to: "/", label: "Beranda", exact: true },
  { to: "/pengumuman", label: "Pengumuman", exact: false },
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
      <rect width="48" height="48" rx="14" className="fill-mint" />
      <path d="M24 10c-1.8 3.8-1.8 7.6 0 11.4 1.8-3.8 1.8-7.6 0-11.4z" className="fill-pine" opacity="0.85" />
      <path d="M14 34V22l10-6 10 6v12h-7v-6h-6v6h-7z" className="fill-pine" />
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
    <div className="min-h-screen bg-paper">
      {admin ? (
        <div className="bg-pine text-sheet">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-sm">
            <p>Anda masuk sebagai admin. Perubahan tersimpan dan terbaca pengunjung lain.</p>
            <Link to="/kelola" className="shrink-0 font-semibold underline-offset-2 hover:underline">
              Panel kelola
            </Link>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-30 border-b border-line bg-sheet/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <SchoolLogo className="size-10 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold text-ink">{identity.shortName}</span>
              <span className="hidden text-xs text-muted sm:block">Depok · Muhammadiyah</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="rounded-full px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-mint hover:text-pine data-[status=active]:bg-mint data-[status=active]:text-pine"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/masuk"
              className="ml-2 inline-flex h-10 items-center rounded-full border border-pine px-4 text-sm font-semibold text-pine transition-colors hover:bg-mint"
            >
              Masuk
            </Link>
            <Link
              to="/kontak"
              className="ml-2 inline-flex h-10 items-center rounded-full bg-pine px-4 text-sm font-semibold text-sheet transition-colors hover:bg-pine-deep"
            >
              Hubungi kami
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <Link
              to="/masuk"
              className="inline-flex h-10 items-center rounded-full border border-pine px-3 text-sm font-semibold text-pine"
            >
              Masuk
            </Link>
            <Link
              to="/kontak"
              className="hidden h-10 items-center rounded-full bg-pine px-3 text-sm font-semibold text-sheet sm:inline-flex"
            >
              Hubungi kami
            </Link>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-sheet"
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-line bg-sheet px-5 py-3 xl:hidden">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    className="block rounded-xl px-3 py-3 text-base font-medium data-[status=active]:bg-mint data-[status=active]:text-pine"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/masuk"
                  className="block rounded-xl px-3 py-3 text-base font-medium data-[status=active]:bg-mint data-[status=active]:text-pine"
                  onClick={() => setOpen(false)}
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="mt-1 block rounded-xl bg-pine px-3 py-3 text-center text-base font-semibold text-sheet"
                  onClick={() => setOpen(false)}
                >
                  Hubungi kami
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>
      <SiteFooter />
      <AnnouncementLightbox />
    </div>
  );
}

function SiteFooter() {
  const identity = useSiteStore((state) => state.content.identity);
  return (
    <footer className="mt-6 border-t border-line bg-sheet">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-start gap-3">
            <SchoolLogo className="size-11 shrink-0" />
            <div>
              <p className="font-semibold text-ink">{identity.name}</p>
              <p className="mt-1 text-sm text-muted">{identity.tagline}</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted md:col-span-4">
          <p className="font-semibold text-ink">Alamat</p>
          <p className="mt-2 leading-relaxed">{identity.address}</p>
          <p className="mt-3">{identity.phone}</p>
          <p>{identity.email}</p>
        </div>
        <div className="text-sm md:col-span-3">
          <p className="font-semibold text-ink">Tautan</p>
          <ul className="mt-2 grid gap-1.5 text-muted">
            <li>
              <Link to="/pengumuman" className="hover:text-pine">
                Pengumuman
              </Link>
            </li>
            <li>
              <Link to="/profil" className="hover:text-pine">
                Profil
              </Link>
            </li>
            <li>
              <Link to="/program" className="hover:text-pine">
                Program
              </Link>
            </li>
            <li>
              <Link to="/prestasi" className="hover:text-pine">
                Prestasi
              </Link>
            </li>
            <li>
              <Link to="/kontak" className="hover:text-pine">
                Kontak
              </Link>
            </li>
            <li>
              <Link to="/masuk" className="hover:text-pine">
                Masuk
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-muted">
          © {new Date().getFullYear()} {identity.shortName} · {identity.foundation}
        </p>
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
    <header className="mx-auto max-w-6xl px-5 pt-12 pb-6">
      <p className="text-sm font-semibold text-pine">{kicker}</p>
      <h1 className="mt-2 max-w-3xl font-serif text-3xl text-ink md:text-4xl">{title}</h1>
      {lead ? <p className="mt-3 max-w-2xl text-muted">{lead}</p> : null}
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
