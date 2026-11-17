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
        lead="Ganti ilustrasi dengan foto resmi lewat panel kelola. Unggah dari komputer, atau tempel tautan gambar."
      />
      {!content.show.galeri && !admin ? (
        <p className="mx-auto max-w-6xl px-5 text-muted">Galeri sedang tidak ditampilkan.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-line bg-mint"
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="grid aspect-4/3 place-items-center text-sm text-muted">Gambar belum dipasang</div>
              )}
              {item.caption || !item.visible ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-forest/85 via-forest/50 to-transparent px-4 pt-10 pb-3 text-sm text-sheet">
                  {!item.visible ? <span className="mr-2 font-bold text-sun">Tersembunyi.</span> : null}
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
          {items.length === 0 ? <p className="text-muted">Belum ada foto.</p> : null}
        </div>
      )}
    </SiteFrame>
  );
}
