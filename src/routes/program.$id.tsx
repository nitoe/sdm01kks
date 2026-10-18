import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import type { ProgramGroup } from "@/lib/site/types";

export const Route = createFileRoute("/program/$id")({
  component: ProgramDetail,
});

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function ProgramDetail() {
  const { id } = Route.useParams();
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const group = (content.programGroups ?? []).find((item) => item.id === id);
  const program = content.programs.find((item) => item.id === id);

  if (group && (group.visible || admin)) {
    return <GroupPage group={group} />;
  }

  if (!program || (!program.visible && !admin)) {
    return (
      <SiteFrame>
        <PageIntro kicker="Program" title="Halaman tidak ditemukan" />
        <p className="mx-auto max-w-6xl px-5">
          <Link to="/program" className="font-semibold text-pine">
            Semua program
          </Link>
        </p>
      </SiteFrame>
    );
  }

  const media = program.media ?? [];
  const parent = (content.programGroups ?? []).find((item) => item.id === program.group);

  return (
    <SiteFrame>
      <PageIntro kicker="Program" title={program.title} lead={program.summary} />
      <article className="mx-auto max-w-3xl px-5 pb-12">
        {!program.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
        {program.cover ? (
          <img src={program.cover} alt="" className="mb-8 aspect-3/2 w-full rounded-card object-cover" />
        ) : null}
        {program.body ? <Prose text={program.body} /> : <p className="text-muted">Uraian program belum diisi.</p>}

        {media.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-3xl">Dokumentasi</h2>
            <div className="mt-6 grid gap-4">
              {media.map((item) => {
                const yt = item.kind === "url" ? youtubeEmbed(item.src) : null;
                return (
                  <figure key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
                    {item.kind === "image" && item.src ? (
                      <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
                    ) : null}
                    {item.kind === "video" && item.src ? (
                      <video src={item.src} controls className="aspect-video w-full bg-ink" />
                    ) : null}
                    {item.kind === "url" && item.src && yt ? (
                      <div className="aspect-video w-full bg-ink">
                        <iframe
                          title={item.caption || "Video YouTube"}
                          src={yt}
                          className="size-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                    {item.kind === "url" && item.src && !yt ? (
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
                );
              })}
            </div>
          </section>
        ) : null}

        <p className="mt-10">
          <Link to="/program/$id" params={{ id: parent?.id ?? "intrakurikuler" }} className="font-semibold text-pine">
            {parent ? parent.title : "Semua program"}
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}

function GroupPage({ group }: { group: ProgramGroup }) {
  const programs = useSiteStore((state) => state.content.programs);
  const admin = useSiteStore((state) => state.admin);
  const items = programs.filter((item) => item.group === group.id && (item.visible || admin));

  return (
    <SiteFrame>
      <PageIntro kicker="Program" title={group.title} lead={group.summary} />
      <article className="mx-auto max-w-3xl px-5 pb-16">
        {!group.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
        {group.image ? <img src={group.image} alt="" className="mb-8 aspect-3/2 w-full rounded-card object-cover" /> : null}
        {group.body ? <Prose text={group.body} /> : <p className="text-muted">Uraian belum diisi.</p>}

        <section className="mt-12">
          <h2 className="font-serif text-3xl">Kegiatan di kelompok ini</h2>
          {items.length === 0 ? (
            <p className="mt-4 text-muted">Belum ada kegiatan yang dimasukkan ke kelompok ini.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="overflow-hidden rounded-card border border-line bg-sheet transition-colors hover:border-pine"
                >
                  {item.cover ? <img src={item.cover} alt="" className="aspect-16/10 w-full object-cover" /> : null}
                  <div className="p-5">
                    {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                    <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                    <p className="mt-2 text-muted">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p className="mt-10">
          <Link to="/program" className="font-semibold text-pine">
            Semua kelompok
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}
