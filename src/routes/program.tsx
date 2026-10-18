import { createFileRoute } from "@tanstack/react-router";
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
        lead="Tiap butir dapat diubah, disembunyikan, atau ditambah dari panel kelola."
      />
      {!content.show.program && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Bagian program sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2">
          {programs.map((item) => (
            <article key={item.id} className="rounded-card border border-line bg-sheet p-6">
              {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
              <h2 className="font-serif text-3xl">{item.title}</h2>
              <p className="mt-3 text-muted">{item.summary}</p>
            </article>
          ))}
          {programs.length === 0 ? <p className="text-muted">Belum ada program.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}
