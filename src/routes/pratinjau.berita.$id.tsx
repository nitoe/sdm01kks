import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

import { previewHead } from "@/lib/site/preview-head";

export const Route = createFileRoute("/pratinjau/berita/$id")({
  head: previewHead,
  component: BeritaDetail,
});

function BeritaDetail() {
  const { id } = Route.useParams();
  const article = useSiteStore((state) => state.content.news.find((item) => item.id === id));
  const admin = useSiteStore((state) => state.admin);

  return (
    <SiteFrame>
      {!article || (!article.visible && !admin) ? (
        <PageIntro kicker="Berita" title="Tulisan tidak ditemukan" />
      ) : (
        <>
          <PageIntro kicker={formatDate(article.date)} title={article.title} lead={article.excerpt} />
          <article className="mx-auto max-w-3xl px-5">
            {!article.visible ? (
              <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p>
            ) : null}
            <Prose text={article.body} />
          </article>
        </>
      )}
      <p className="mx-auto max-w-3xl px-5 pt-8">
        <Link to="/pratinjau/berita" className="font-semibold text-pine">
          Semua berita
        </Link>
      </p>
    </SiteFrame>
  );
}
