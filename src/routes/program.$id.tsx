import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import type { Program, ProgramGroup } from "@/lib/site/types";

export const Route = createFileRoute("/program/$id")({
  component: ProgramDetail,
});

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\\./, "");
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

  return <ProgramPage program={program} />;
}

function ProgramPage({ program }: { program: Program }) {
  const content = useSiteStore((state) => state.content);
  const media = program.media ?? [];
  const parent = (content.programGroups ?? []).find((item) => item.id === program.group);
  const isEkskul = program.group === "ekstrakurikuler";
  const activities = program.activities ?? [];
  const achievements = program.achievements ?? [];

  return (
    <SiteFrame>
      <PageIntro kicker={parent?.title ?? "Program"} title={program.title} lead={program.summary} />
      <article className="mx-auto max-w-6xl px-5 pb-16">
        {!program.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {program.cover ? (
              <img src={program.cover} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-mint text-muted">Gambar belum dipasang</div>
            )}
            <div className="mt-6">
              {program.body ? <Prose text={program.body} /> : <p className="text-muted">Uraian program belum diisi.</p>}
            </div>

            {achievements.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-ink">Prestasi</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {achievements.map((item) => (
                    <div key={item.id || item.title} className="rounded-xl border border-line bg-sheet p-4">
                      <p className="text-sm font-semibold text-pine">{item.year}</p>
                      <p className="mt-1 font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.result}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {media.length > 0 ? (
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-ink">Dokumentasi</h2>
                <div className="mt-4 grid gap-4">
                  {media.map((item) => {
                    const yt = item.kind === "url" ? youtubeEmbed(item.src) : null;
                    return (
                      <figure key={item.id} className="overflow-hidden rounded-xl border border-line bg-sheet">
                        {item.kind === "image" && item.src ? (
                          <img src={item.src} alt={item.caption} className="aspect-video w-full object-cover" />
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
                          <div className="p-4">
                            <a
                              href={item.src}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-pine underline-offset-2 hover:underline"
                            >
                              {item.caption || item.src}
                            </a>
                          </div>
                        ) : null}
                        {item.caption && item.kind !== "url" ? (
                          <figcaption className="border-t border-line px-4 py-2 text-sm text-muted">{item.caption}</figcaption>
                        ) : null}
                      </figure>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {isEkskul ? (
                <div className="rounded-2xl bg-pine p-6 text-sheet">
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Ekstrakurikuler</p>
                  <h2 className="mt-1 text-2xl font-semibold">{program.title}</h2>
                  <Link
                    to="/kontak"
                    className="mt-4 inline-flex h-11 items-center rounded-full bg-sheet px-5 text-sm font-semibold text-pine transition-colors hover:bg-mint"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              ) : null}

              {activities.length > 0 ? (
                <div className="rounded-2xl border border-line bg-sheet p-6">
                  <h3 className="font-semibold text-ink">Kegiatan kami</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {activities.map((act) => (
                      <li key={act} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pine" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-2xl border border-line bg-sheet p-6">
                <h3 className="font-semibold text-ink">Kontak</h3>
                <p className="mt-2 text-sm text-muted">
                  Informasi lebih lanjut tentang {program.title} dapat ditanyakan melalui kontak sekolah.
                </p>
                <Link to="/kontak" className="mt-3 inline-block text-sm font-semibold text-pine hover:underline">
                  Hubungi kami
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-12">
          <Link to="/program/$id" params={{ id: parent?.id ?? "ekstrakurikuler" }} className="font-semibold text-pine">
            ← {parent ? parent.title : "Semua program"}
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
  const isEkskul = group.id === "ekstrakurikuler";

  return (
    <SiteFrame>
      <PageIntro kicker="Program" title={group.title} lead={group.summary} />
      <article className="mx-auto max-w-6xl px-5 pb-16">
        {!group.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
        {group.image ? <img src={group.image} alt="" className="mb-8 aspect-[16/7] w-full rounded-2xl object-cover" /> : null}
        {group.body ? <Prose text={group.body} /> : null}

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-ink md:text-3xl">
              {isEkskul ? "Kegiatan ekstrakurikuler" : "Kegiatan di kelompok ini"}
            </h2>
          </div>
          {items.length === 0 ? (
            <p className="mt-4 text-muted">Belum ada kegiatan yang dimasukkan ke kelompok ini.</p>
          ) : isEkskul ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="group overflow-hidden rounded-2xl border border-line bg-sheet transition-shadow hover:shadow-md"
                >
                  <div className="relative">
                    {item.cover ? (
                      <img src={item.cover} alt="" className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="grid aspect-[4/3] place-items-center bg-mint text-sm text-muted">Gambar</div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-pine px-2.5 py-1 text-xs font-semibold text-sheet">
                      Ekskul
                    </span>
                  </div>
                  <div className="p-4">
                    {!item.visible ? <p className="text-xs text-brass">Tersembunyi</p> : null}
                    <h3 className="font-semibold text-ink group-hover:text-pine">{item.title}</h3>
                    <p className="mt-1 line-clamp-3 text-sm text-muted">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="overflow-hidden rounded-2xl border border-line bg-sheet transition-colors hover:border-pine"
                >
                  {item.cover ? <img src={item.cover} alt="" className="aspect-[16/7] w-full object-cover" /> : null}
                  <div className="p-5">
                    {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                    <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-muted">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p className="mt-10">
          <Link to="/program" className="font-semibold text-pine">
            ← Semua kelompok program
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}
