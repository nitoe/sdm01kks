import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site/shell";
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
      <header className="mx-auto max-w-6xl px-5 pt-12 pb-8">
        <p className="text-sm font-semibold text-pine">Program</p>
        <h1 className="mt-2 max-w-3xl font-serif text-3xl text-ink">
          Tiga kelompok kegiatan sekolah
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Di kelas, pendalaman pelajaran, dan di luar jam belajar. Setiap kelompok punya halaman
          sendiri. Judul, uraian, dan gambar dapat diubah dari panel kelola.
        </p>
      </header>
      {!content.show.program && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">
          Bagian program sedang tidak ditampilkan.
        </p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16">
          {groups.map((item, index) => (
            <article
              key={item.id}
              className="grid overflow-hidden rounded-card border border-line bg-sheet lg:grid-cols-2"
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
                <p className="text-sm font-semibold text-pine">0{index + 1}</p>
                {!item.visible ? (
                  <p className="mt-2 text-sm text-brass">Tersembunyi dari tamu</p>
                ) : null}
                <h2 className="mt-2 font-serif text-2xl text-ink md:text-3xl">{item.title}</h2>
                <p className="mt-3 text-muted">{item.summary}</p>
                {item.body ? <p className="mt-3 text-ink">{item.body}</p> : null}
                <ActivityLinks groupId={item.id} />
                <Link
                  to="/program/$id"
                  params={{ id: item.id }}
                  className="mt-6 inline-flex h-11 w-fit items-center rounded-full bg-pine px-5 text-sm font-semibold text-sheet transition-colors hover:bg-pine-deep"
                >
                  Buka halaman
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
              className="inline-flex h-9 items-center rounded-full border border-line bg-paper px-3 text-sm font-semibold text-ink transition-colors hover:border-pine hover:text-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
