import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
              <img
                src={article.image}
                alt=""
                className="mb-8 aspect-3/2 w-full rounded-2xl border border-line object-cover shadow-sm"
              />
            ) : null}
            <div className="text-lg leading-relaxed">
              <Prose text={article.body || article.excerpt} />
            </div>
          </article>
        </>
      )}
      <p className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link
          to="/berita"
          className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-pine px-5 text-sm font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Semua berita
        </Link>
      </p>
    </SiteFrame>
  );
}
