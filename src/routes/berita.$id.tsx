import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/berita/$id")({
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
          <PageIntro kicker={formatDate(article.date)} title={article.title} />
          <article className="mx-auto max-w-3xl px-5">
            {!article.visible ? <p className="mb-4 text-sm text-brass">Tersembunyi dari tamu.</p> : null}
            {article.image ? (
              <img src={article.image} alt="" className="mb-6 aspect-3/2 w-full rounded-card object-cover" />
            ) : null}
            <Prose text={article.body || article.excerpt} />
          </article>
        </>
      )}
      <p className="mx-auto max-w-3xl px-5 pt-8">
        <Link to="/berita" className="font-semibold text-pine">
          Semua berita
        </Link>
      </p>
    </SiteFrame>
  );
}
