import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionTitle } from "@/components/site/ornament";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import { EkskulDetailPage, EkskulListPage, ProgramContactCard } from "@/components/site/ekskul";
import { ProgramSlideshow } from "@/components/site/program-slideshow";
import { programImages } from "@/lib/site/program";
import { ProgramMediaGallery } from "@/components/site/program-media";
import type { Program, ProgramGroup } from "@/lib/site/types";

export const Route = createFileRoute("/program/$id")({
  component: ProgramDetail,
});

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
  const activities = program.activities ?? [];
  const achievements = program.achievements ?? [];

  if (program.group === "ekstrakurikuler") {
    return (
      <SiteFrame>
        <EkskulDetailPage program={program} />
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <PageIntro kicker={parent?.title ?? "Program"} title={program.title} lead={program.summary} />
      <article className="mx-auto max-w-6xl px-5 pb-16">
        {!program.visible ? (
          <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProgramSlideshow images={programImages(program)} title={program.title} />
            <div className="mt-6">
              {program.body ? (
                <Prose text={program.body} />
              ) : (
                <p className="text-muted">Uraian program belum diisi.</p>
              )}
            </div>

            {achievements.length > 0 ? (
              <section className="mt-10">
                <SectionTitle>Prestasi</SectionTitle>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {achievements.map((item) => (
                    <div
                      key={item.id || item.title}
                      className="rounded-xl border border-line border-l-4 border-l-sun bg-sheet p-4"
                    >
                      <p className="text-sm font-semibold text-pine">{item.year}</p>
                      <p className="mt-1 font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.result}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <ProgramMediaGallery media={media} />
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {activities.length > 0 ? (
                <div className="rounded-2xl border border-line bg-sheet p-6">
                  <h3 className="font-serif text-xl font-semibold text-ink">Kegiatan kami</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {activities.map((act) => (
                      <li key={act} className="flex items-start gap-2">
                        <span className="mt-1.5 size-2 shrink-0 rotate-45 bg-sun" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <ProgramContactCard program={program} />
            </div>
          </aside>
        </div>

        <p className="mt-12">
          <Link
            to="/program/$id"
            params={{ id: parent?.id ?? "ekstrakurikuler" }}
            className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-pine px-5 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
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
  const isEkskul = group.id === "ekstrakurikuler";

  if (isEkskul) {
    return (
      <SiteFrame>
        <EkskulListPage group={group} items={items} />
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <PageIntro kicker="Program" title={group.title} lead={group.summary} />
      <article className="mx-auto max-w-6xl px-5 pb-16">
        {!group.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
        {group.image ? (
          <img
            src={group.image}
            alt=""
            className="mb-8 aspect-[16/7] w-full rounded-2xl object-cover"
          />
        ) : null}
        {group.body ? <Prose text={group.body} /> : null}

        <section className="mt-12">
          <SectionTitle>Kegiatan di kelompok ini</SectionTitle>
          {items.length === 0 ? (
            <p className="mt-4 text-muted">Belum ada kegiatan yang dimasukkan ke kelompok ini.</p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="group overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:-translate-y-1 hover:border-pine/40 hover:shadow-lg"
                >
                  {item.cover ? (
                    <img src={item.cover} alt="" className="aspect-[16/7] w-full object-cover" />
                  ) : null}
                  <div className="p-5">
                    {!item.visible ? (
                      <p className="text-sm text-brass">Tersembunyi dari tamu</p>
                    ) : null}
                    <h3 className="flex items-center justify-between gap-3 font-serif text-2xl font-semibold text-ink group-hover:text-pine">
                      {item.title}
                      <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                    </h3>
                    <p className="mt-2 text-muted">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <p className="mt-10">
          <Link
            to="/program"
            className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-pine px-5 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Semua kelompok program
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}
