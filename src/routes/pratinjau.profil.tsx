import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

import { previewHead } from "@/lib/site/preview-head";

export const Route = createFileRoute("/pratinjau/profil")({
  head: previewHead,
  component: ProfilPage,
});

function ProfilPage() {
  const identity = useSiteStore((state) => state.content.identity);
  const rows = [
    ["Nama", identity.name],
    ["NPSN", identity.npsn],
    ["Akreditasi", identity.accreditation],
    ["Berdiri", `${identity.founded} · SK ${identity.skFounded}`],
    ["Operasional", identity.operational],
    ["Kepala sekolah", identity.principal],
    ["Naungan", identity.foundation],
    ["Peserta didik", identity.studentsNote],
    ["Waktu belajar", identity.hours],
    ["Alamat", identity.address],
    ["Telepon", identity.phone],
    ["Surel", identity.email],
    ["Situs", identity.domain],
  ];

  return (
    <SiteFrame>
      <PageIntro
        kicker="Profil"
        title={identity.name}
        lead={identity.tagline}
      />
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <dl className="overflow-hidden rounded-card border border-line bg-sheet">
          {rows.map(([term, detail]) => (
            <div key={term} className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-3">
              <dt className="text-sm font-semibold text-muted">{term}</dt>
              <dd className="sm:col-span-2">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SiteFrame>
  );
}
