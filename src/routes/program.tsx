import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
});

function ProgramPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const programs = content.programs.filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro
        kicker="Program"
        title="Kegiatan yang membentuk keseharian"
        lead="Setiap program memiliki halaman sendiri. Dokumentasi berupa foto, video, atau tautan dapat dilampirkan oleh admin."
      />
      {!content.show.program && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Bagian program sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2">
          {programs.map((item) => (
            <Link
              key={item.id}
              to="/program/$id"
              params={{ id: item.id }}
              className="overflow-hidden rounded-card border border-line bg-sheet transition-colors hover:border-pine"
            >
              {item.cover ? (
                <img src={item.cover} alt="" className="aspect-3/2 w-full object-cover" />
              ) : (
                <div className="grid aspect-3/2 place-items-center border-b border-dashed border-line text-sm text-muted">
                  Dokumentasi belum dipasang
                </div>
              )}
              <div className="p-6">
                {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                <h2 className="font-serif text-3xl">{item.title}</h2>
                <p className="mt-3 text-muted">{item.summary}</p>
                <p className="mt-4 text-sm font-semibold text-pine">Buka program</p>
              </div>
            </Link>
          ))}
          {programs.length === 0 ? <p className="text-muted">Belum ada program.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}
