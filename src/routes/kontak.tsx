import { createFileRoute } from "@tanstack/react-router";
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

  return (
    <SiteFrame>
      <PageIntro kicker="Kontak" title="Datang atau hubungi sekolah" lead={identity.hours} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-sheet p-6">
          <h2 className="font-serif text-3xl">Alamat</h2>
          <p className="mt-3">{identity.address}</p>
          <p className="mt-4">
            <span className="text-muted">Telepon </span>
            <a className="font-semibold text-pine" href={`tel:${identity.phone.replace(/[^\d+]/g, "")}`}>
              {identity.phone}
            </a>
          </p>
          {wa ? (
            <p className="mt-2">
              <span className="text-muted">WhatsApp </span>
              <a
                className="font-semibold text-pine"
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatWhatsAppLabel(wa)}
              </a>
            </p>
          ) : null}
          <p className="mt-2">
            <span className="text-muted">Surel </span>
            <a className="font-semibold text-pine" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
          </p>
          {ig ? (
            <p className="mt-2">
              <span className="text-muted">Instagram </span>
              <a
                className="font-semibold text-pine"
                href={`https://www.instagram.com/${ig}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{ig}
              </a>
            </p>
          ) : null}
          <p className="mt-4">
            <a
              className="text-sm font-semibold text-pine underline-offset-2 hover:underline"
              href="https://maps.app.goo.gl/6Ae9iQqaqswDhEq9A"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Google Maps
            </a>
          </p>
        </div>
        <iframe
          title="Peta lokasi SD Muhammadiyah 01 Kukusan"
          className="min-h-80 w-full rounded-card border border-line"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          src={mapEmbedSrc(identity)}
        />
      </div>
    </SiteFrame>
  );
}
