import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
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

const WHATSAPP_NUMBER = "6285720848358";
const WHATSAPP_LABEL = "+62 857-2084-8358";
const INSTAGRAM_HANDLE = "sdmuhammadiyah01kukusan";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? `+62${digits.slice(1)}` : digits}`;
}

function SiteFooter() {
  const identity = useSiteStore((state) => state.content.identity);
  return (
    <footer className="mt-4 border-t border-line bg-sheet">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-7 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-start gap-3">
            <SchoolLogo className="size-11 shrink-0" />
            <div>
              <p className="font-semibold text-ink">{identity.name}</p>
              <p className="mt-1 text-sm text-muted">{identity.tagline}</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted md:col-span-7">
          <p className="font-semibold text-ink">Kontak</p>
          <ul className="mt-2 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            <li className="flex items-start gap-2.5 sm:col-span-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-pine" aria-hidden="true" />
              <span className="leading-relaxed">{identity.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-pine" aria-hidden="true" />
              <a href={toTelHref(identity.phone)} className="hover:text-pine">
                {identity.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <WhatsAppIcon className="size-4 shrink-0 text-pine" />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pine"
              >
                {WHATSAPP_LABEL}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <InstagramIcon className="size-4 shrink-0 text-pine" />
              <a
                href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pine"
              >
                @{INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-pine" aria-hidden="true" />
              <a href={`mailto:${identity.email}`} className="hover:text-pine">
                {identity.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-3 text-xs text-muted">
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
