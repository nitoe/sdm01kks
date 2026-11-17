import { createFileRoute } from "@tanstack/react-router";
import { AtSign, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/kontak")({
  component: KontakPage,
});

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

/** Embed resmi Google Maps: SD Muhammadiyah 1 Depok (maps.app.goo.gl/6Ae9iQqaqswDhEq9A) */
const SCHOOL_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7931.0!2d106.8155345!3d-6.3665395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eea7a02c5a21%3A0xb8dea59504561ff3!2sSD%20Muhammadiyah%201%20Depok!5e0!3m2!1sid!2sid!4v0";

function mapEmbedSrc(identity: { mapLat?: string; mapLng?: string; address: string }) {
  const lat = identity.mapLat?.trim();
  const lng = identity.mapLng?.trim();
  // Koordinat default sekolah (dari Google Maps resmi) → pakai embed place agar pin bernama sekolah
  if (
    lat === "-6.3665395" &&
    lng === "106.8155345"
  ) {
    return SCHOOL_MAP_EMBED;
  }
  if (lat && lng && /^-?\d+(\.\d+)?$/.test(lat) && /^-?\d+(\.\d+)?$/.test(lng)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=17&output=embed`;
  }
  return SCHOOL_MAP_EMBED;
}

function KontakPage() {
  const identity = useSiteStore((state) => state.content.identity);
  const wa = identity.whatsapp?.replace(/\D/g, "") ?? "";
  const ig = identity.instagram?.replace(/^@/, "").trim() ?? "";
  const telHref = `tel:${identity.phone.replace(/[^\d+]/g, "")}`;

  return (
    <SiteFrame>
      <PageIntro kicker="Kontak" title="Datang atau hubungi sekolah" lead={identity.hours} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 lg:grid-cols-5">
        <div className="rounded-3xl border border-line border-t-4 border-t-sun bg-sheet p-6 sm:p-8 lg:col-span-2">
          <div className="flex flex-wrap gap-3">
            {wa ? (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tombol inline-flex h-12 items-center gap-2 rounded-lg bg-pine px-5 text-sm font-bold text-sheet hover:bg-pine-deep"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Chat WhatsApp
              </a>
            ) : null}
            <a
              href={telHref}
              className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-pine px-5 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
            >
              <Phone className="size-4" aria-hidden="true" />
              Telepon
            </a>
          </div>

          <dl className="mt-8 grid gap-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-pine" aria-hidden="true" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-muted uppercase">Alamat</dt>
                <dd className="mt-1">{identity.address}</dd>
                <dd className="mt-2">
                  <a
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-pine underline-offset-2 hover:underline"
                    href="https://maps.app.goo.gl/6Ae9iQqaqswDhEq9A"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka di Google Maps
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-pine" aria-hidden="true" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-muted uppercase">Telepon</dt>
                <dd className="mt-1">
                  <a className="font-semibold text-pine hover:underline" href={telHref}>
                    {identity.phone}
                  </a>
                </dd>
              </div>
            </div>
            {wa ? (
              <div className="flex gap-4">
                <MessageCircle className="mt-1 size-5 shrink-0 text-pine" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold tracking-wider text-muted uppercase">WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      className="font-semibold text-pine hover:underline"
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatWhatsAppLabel(wa)}
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
            <div className="flex gap-4">
              <AtSign className="mt-1 size-5 shrink-0 text-pine" aria-hidden="true" />
              <div>
                <dt className="text-xs font-bold tracking-wider text-muted uppercase">Surel</dt>
                <dd className="mt-1 break-all">
                  <a className="font-semibold text-pine hover:underline" href={`mailto:${identity.email}`}>
                    {identity.email}
                  </a>
                </dd>
              </div>
            </div>
            {ig ? (
              <div className="flex gap-4">
                <span className="mt-1 w-5 shrink-0 text-center font-bold text-pine" aria-hidden="true">
                  IG
                </span>
                <div>
                  <dt className="text-xs font-bold tracking-wider text-muted uppercase">Instagram</dt>
                  <dd className="mt-1">
                    <a
                      className="font-semibold text-pine hover:underline"
                      href={`https://www.instagram.com/${ig}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{ig}
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
          </dl>
        </div>
        <iframe
          title="Peta lokasi SD Muhammadiyah 01 Kukusan"
          className="min-h-96 w-full rounded-3xl border border-line lg:col-span-3 lg:h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          src={mapEmbedSrc(identity)}
        />
      </div>
    </SiteFrame>
  );
}
