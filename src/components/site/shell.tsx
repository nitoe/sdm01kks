import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AnnouncementLightbox } from "@/components/site/announcement-lightbox";
import { Eyebrow } from "@/components/site/ornament";
import { useSiteStore } from "@/lib/site/store";

const NAV = [
  { to: "/", label: "Beranda", exact: true },
  { to: "/pengumuman", label: "Pengumuman", exact: false },
  { to: "/profil", label: "Profil", exact: false },
  { to: "/manajerial", label: "Manajerial", exact: false },
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
  const role = useSiteStore((state) => state.role);
  const published = useRouteContext({ from: "__root__", select: (context) => context.gate.published });
  const [open, setOpen] = useState(false);

  // Menu layar penuh di ponsel: kunci gulir latar dan tutup dengan tombol Esc.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-paper">
      <a
        href="#isi"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sheet"
      >
        Lewati ke isi halaman
      </a>

      {admin ? (
        <div className="bg-sun text-ink">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-sm">
            <p>
              Anda masuk sebagai {role === "operator" ? "operator" : "admin"}.{" "}
              {published
                ? "Perubahan tersimpan dan terbaca pengunjung lain."
                : "Situs belum dipublikasikan: pengunjung masih melihat halaman 404. Hanya akun yang masuk yang bisa melihat halaman ini."}
            </p>
            <Link to="/kelola" className="shrink-0 font-bold underline underline-offset-2">
              Panel kelola
            </Link>
          </div>
        </div>
      ) : null}

      {/* Bilah info singkat, hanya di layar lebar */}
      <div className="hidden bg-forest text-sheet/85 lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-2 text-xs">
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-sun" aria-hidden="true" />
            {identity.hours}
          </p>
          <p className="flex items-center gap-5">
            <a href={toTelHref(identity.phone)} className="inline-flex items-center gap-1.5 hover:text-sun">
              <Phone className="size-3.5" aria-hidden="true" />
              {identity.phone}
            </a>
            <a href={`mailto:${identity.email}`} className="inline-flex items-center gap-1.5 hover:text-sun">
              <Mail className="size-3.5" aria-hidden="true" />
              {identity.email}
            </a>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <SchoolLogo className="size-11 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg leading-tight font-semibold text-ink">
                {identity.shortName}
              </span>
              <span className="hidden text-[0.7rem] font-semibold tracking-[0.12em] text-pine uppercase sm:block">
                Depok · Muhammadiyah
              </span>
            </span>
          </Link>

          <nav aria-label="Menu utama" className="ml-auto hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="group relative px-2.5 py-2 text-sm font-semibold text-muted transition-colors hover:text-pine data-[status=active]:text-ink"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2.5 bottom-0.5 h-[3px] origin-left scale-x-0 rounded-full bg-sun transition-transform duration-200 group-hover:scale-x-100 group-data-[status=active]:scale-x-100"
                />
              </Link>
            ))}
            <Link
              to="/masuk"
              className="ml-3 inline-flex h-10 items-center rounded-lg border-2 border-pine px-4 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
            >
              Masuk
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <Link
              to="/masuk"
              className="inline-flex h-10 items-center rounded-lg border-2 border-pine px-3 text-sm font-bold text-pine"
            >
              Masuk
            </Link>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-sheet"
              aria-expanded={open}
              aria-controls="menu-ponsel"
              aria-label="Buka menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div id="menu-ponsel" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-forest text-sheet xl:hidden">
          <div className="pola-bintang-gelap pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-3 px-5 py-3">
            <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
              <SchoolLogo className="size-11 shrink-0" />
              <span className="truncate font-serif text-lg font-semibold">{identity.shortName}</span>
            </Link>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-sheet/30"
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Menu utama" className="relative flex-1 px-5 pt-4 pb-6">
            <ul className="divide-y divide-sheet/15">
              {NAV.map((item, index) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    className="group flex items-baseline gap-4 py-3.5 data-[status=active]:text-sun"
                    onClick={() => setOpen(false)}
                  >
                    <span className="w-6 text-xs font-bold text-sheet/50 group-data-[status=active]:text-sun">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-2xl font-semibold">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative border-t border-sheet/15 px-5 py-5">
            <Link
              to="/masuk"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sun font-bold text-ink"
              onClick={() => setOpen(false)}
            >
              Masuk
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-center text-sm text-sheet/70">
              <a href={toTelHref(identity.phone)} className="hover:text-sun">
                {identity.phone}
              </a>
            </p>
          </div>
        </div>
      ) : null}

      <main id="isi" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <AnnouncementLightbox />
    </div>
  );
}

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

function formatWhatsAppLabel(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length >= 11) {
    const rest = digits.slice(2);
    if (rest.length === 11) return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    if (rest.length === 10) return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    return `+62 ${rest}`;
  }
  return whatsapp || "";
}

function SiteFooter() {
  const identity = useSiteStore((state) => state.content.identity);
  const wa = identity.whatsapp?.replace(/\D/g, "") ?? "";
  const ig = identity.instagram?.replace(/^@/, "").trim() ?? "";

  return (
    <footer className="relative mt-8 overflow-hidden bg-forest text-sheet/80">
      <div className="pola-bintang-gelap pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <SchoolLogo className="size-14 shrink-0" />
            <p className="font-serif text-2xl leading-tight font-semibold text-sheet">{identity.name}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sheet/75">{identity.tagline}</p>
          <p className="mt-4 inline-flex items-center rounded-full border border-sun/50 px-3 py-1 text-xs font-bold tracking-wide text-sun uppercase">
            Akreditasi {identity.accreditation}
          </p>
        </div>

        <nav aria-label="Jelajahi situs" className="md:col-span-3">
          <p className="text-xs font-bold tracking-[0.14em] text-sun uppercase">Jelajahi</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-sun">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm md:col-span-4">
          <p className="text-xs font-bold tracking-[0.14em] text-sun uppercase">Kontak</p>
          <ul className="mt-4 grid gap-3">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sun" aria-hidden="true" />
              <span className="leading-relaxed">{identity.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-sun" aria-hidden="true" />
              <a href={toTelHref(identity.phone)} className="hover:text-sun">
                {identity.phone}
              </a>
            </li>
            {wa ? (
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="size-4 shrink-0 text-sun" />
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sun"
                >
                  {formatWhatsAppLabel(wa)}
                </a>
              </li>
            ) : null}
            {ig ? (
              <li className="flex items-center gap-3">
                <InstagramIcon className="size-4 shrink-0 text-sun" />
                <a
                  href={`https://www.instagram.com/${ig}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sun"
                >
                  @{ig}
                </a>
              </li>
            ) : null}
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-sun" aria-hidden="true" />
              <a href={`mailto:${identity.email}`} className="break-all hover:text-sun">
                {identity.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-sheet/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-4 text-xs text-sheet/60">
          <p>
            © {new Date().getFullYear()} {identity.shortName} · {identity.foundation}
          </p>
          <Link to="/masuk" className="hover:text-sun">
            Masuk
          </Link>
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
    <header className="relative mb-8 overflow-hidden border-b border-line bg-mint/70 md:mb-10">
      <div className="pola-bintang pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-10 md:pt-10 md:pb-14">
        <nav aria-label="Jejak halaman" className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="font-semibold hover:text-pine">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate">{kicker}</span>
        </nav>
        <Eyebrow className="mt-6">{kicker}</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.08] font-semibold text-ink md:text-5xl">
          {title}
        </h1>
        {lead ? <p className="mt-4 max-w-2xl text-lg text-muted">{lead}</p> : null}
      </div>
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
