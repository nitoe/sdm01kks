import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/kontak")({
  component: KontakPage,
});

function KontakPage() {
  const identity = useSiteStore((state) => state.content.identity);
  const mapQuery = encodeURIComponent(identity.address);

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
          <p className="mt-2">
            <span className="text-muted">Surel </span>
            <a className="font-semibold text-pine" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
          </p>
        </div>
        <iframe
          title="Peta lokasi sekolah"
          className="min-h-80 w-full rounded-card border border-line"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
        />
      </div>
    </SiteFrame>
  );
}
