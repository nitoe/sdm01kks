import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/program/")({
  component: ProgramPage,
});

function ProgramPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const groups = (content.programGroups ?? []).filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro
        kicker="Program"
        title="Tiga kelompok kegiatan sekolah"
        lead="Di kelas, pendalaman pelajaran, dan di luar jam belajar. Setiap kelompok punya halaman sendiri. Judul, uraian, dan gambar dapat diubah dari panel kelola."
      />
      {!content.show.program && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">
          Bagian program sedang tidak ditampilkan.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pb-16">
          {groups.map((item, index) => (
            <article
              key={item.id}
              className="grid overflow-hidden rounded-3xl border border-line bg-sheet lg:grid-cols-2"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className={`aspect-3/2 w-full object-cover lg:aspect-auto lg:h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}
                />
              ) : (
                <div
                  className={`grid aspect-3/2 place-items-center lg:aspect-auto lg:h-full bg-mint text-sm text-muted ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  Gambar belum dipasang
                </div>
              )}
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="font-serif text-5xl leading-none font-semibold text-sun" aria-hidden="true">
                  0{index + 1}
                </p>
                {!item.visible ? (
                  <p className="mt-2 text-sm text-brass">Tersembunyi dari tamu</p>
                ) : null}
                <h2 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">{item.title}</h2>
                <p className="mt-3 text-muted">{item.summary}</p>
                {item.body ? <p className="mt-3 text-ink">{item.body}</p> : null}
                <ActivityLinks groupId={item.id} />
                <Link
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="tombol mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-lg bg-pine px-6 text-sm font-bold text-sheet hover:bg-pine-deep"
                >
                  Buka halaman
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
          {groups.length === 0 ? <p className="text-muted">Belum ada kelompok program.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}

/** Tautan langsung ke setiap kegiatan di sebuah kelompok. */
function ActivityLinks({ groupId }: { groupId: string }) {
  const programs = useSiteStore((state) => state.content.programs);
  const admin = useSiteStore((state) => state.admin);
  const items = programs.filter((entry) => entry.group === groupId && (entry.visible || admin));
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Kegiatan ({items.length})
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((entry) => (
          <li key={entry.id}>
            <Link
              to="/program/$id"
              params={{ id: entry.id }}
              className="inline-flex h-9 items-center rounded-md bg-mint px-3 text-sm font-semibold text-pine-deep transition-colors hover:bg-pine hover:text-sheet"
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
