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
    // +62 857-2084-8358 style
    if (rest.length === 11) return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    if (rest.length === 10) return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    return `+62 ${rest}`;
  }
  return whatsapp || "";
}

function mapEmbedSrc(identity: { mapLat?: string; mapLng?: string; address: string }) {
  const lat = identity.mapLat?.trim();
  const lng = identity.mapLng?.trim();
  if (lat && lng && /^-?\d+(\.\d+)?$/.test(lat) && /^-?\d+(\.\d+)?$/.test(lng)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=17&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(identity.address)}&z=16&output=embed`;
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
        </div>
        <iframe
          title="Peta lokasi sekolah"
          className="min-h-80 w-full rounded-card border border-line"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbedSrc(identity)}
        />
      </div>
    </SiteFrame>
  );
}
