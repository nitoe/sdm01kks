import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/program/$id")({
  component: ProgramDetail,
});

function ProgramDetail() {
  const { id } = Route.useParams();
  const program = useSiteStore((state) => state.content.programs.find((item) => item.id === id));
  const admin = useSiteStore((state) => state.admin);

  if (!program || (!program.visible && !admin)) {
    return (
      <SiteFrame>
        <PageIntro kicker="Program" title="Program tidak ditemukan" />
        <p className="mx-auto max-w-6xl px-5">
          <Link to="/program" className="font-semibold text-pine">
            Semua program
          </Link>
        </p>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <PageIntro kicker="Program" title={program.title} lead={program.summary} />
      <article className="mx-auto max-w-3xl px-5 pb-12">
        {!program.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
        {program.cover ? (
          <img src={program.cover} alt="" className="mb-8 aspect-3/2 w-full rounded-card object-cover" />
        ) : null}
        {program.body ? <Prose text={program.body} /> : <p className="text-muted">Uraian program belum diisi.</p>}

        {program.media.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-3xl">Dokumentasi</h2>
            <div className="mt-6 grid gap-4">
              {program.media.map((item) => (
                <figure key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
                  {item.kind === "image" && item.src ? (
                    <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
                  ) : null}
                  {item.kind === "video" && item.src ? (
                    <video src={item.src} controls className="aspect-video w-full bg-ink" />
                  ) : null}
                  {item.kind === "url" && item.src ? (
                    <div className="p-6">
                      <p className="text-sm font-semibold tracking-wide text-pine uppercase">Tautan eksternal</p>
                      <a
                        href={item.src}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex break-all font-semibold text-pine underline-offset-2 hover:underline"
                      >
                        {item.src}
                      </a>
                    </div>
                  ) : null}
                  {item.caption ? (
                    <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">{item.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-10">
          <Link to="/program" className="font-semibold text-pine">
            Semua program
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}
