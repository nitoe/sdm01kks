import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/galeri")({
  component: GaleriPage,
});

function GaleriPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const items = content.gallery.filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro
        kicker="Galeri"
        title="Sudut-sudut sekolah"
        lead="Gambar di bawah masih ilustrasi suasana. Ganti dengan foto resmi lewat panel kelola, dengan menempel tautan gambar."
      />
      {!content.show.galeri && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Galeri sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2">
          {items.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
              <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-muted">
                {!item.visible ? <span className="mr-2 text-brass">Tersembunyi.</span> : null}
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </SiteFrame>
  );
}
