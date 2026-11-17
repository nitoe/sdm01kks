import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/berita/")({
  component: BeritaPage,
});

function BeritaPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const news = content.news.filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro kicker="Berita" title="Catatan dari sekolah" lead="Artikel baru, lengkap dengan gambar, ditambahkan dari panel kelola." />
      {!content.show.berita && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Berita sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              key={item.id}
              to="/berita/$id"
              params={{ id: item.id }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:-translate-y-1 hover:border-pine/40 hover:shadow-lg"
            >
              <div className="aspect-3/2 overflow-hidden bg-mint">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-6">
                {!item.visible ? <p className="mb-2 text-sm text-brass">Tersembunyi dari tamu</p> : null}
                <p className="inline-flex w-fit rounded-md bg-sun-soft px-2 py-0.5 text-xs font-bold text-ink">
                  {formatDate(item.date)}
                </p>
                <h2 className="mt-3 flex-1 font-serif text-2xl leading-snug font-semibold text-ink group-hover:text-pine">
                  {item.title}
                </h2>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-pine">
                  Baca selengkapnya
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </p>
              </div>
            </Link>
          ))}
          {news.length === 0 ? <p className="text-muted">Belum ada berita.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}
