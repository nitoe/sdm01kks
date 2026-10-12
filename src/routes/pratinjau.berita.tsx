import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

import { previewHead } from "@/lib/site/preview-head";

export const Route = createFileRoute("/pratinjau/berita")({
  head: previewHead,
  component: BeritaPage,
});

function BeritaPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const news = content.news.filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro kicker="Berita" title="Catatan dari sekolah" />
      {!content.show.berita && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Berita sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 px-5">
          {news.map((item) => (
            <Link
              key={item.id}
              to="/pratinjau/berita/$id"
              params={{ id: item.id }}
              className="rounded-card border border-line bg-sheet p-6"
            >
              {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
              <p className="text-sm text-muted">{formatDate(item.date)}</p>
              <h2 className="mt-2 font-serif text-3xl">{item.title}</h2>
              <p className="mt-3 text-muted">{item.excerpt}</p>
            </Link>
          ))}
          {news.length === 0 ? <p className="text-muted">Belum ada berita.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}
