import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/pengumuman")({
  component: PengumumanPage,
});

function PengumumanPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const items = content.announcements.filter((item) => item.visible || admin);

  return (
    <SiteFrame>
      <PageIntro
        kicker="Pengumuman"
        title="Informasi untuk keluarga sekolah"
        lead="Pengumuman terbaru juga muncul saat situs dibuka. Halaman ini tetap bisa dibaca kapan saja."
      />
      <div className="mx-auto grid max-w-3xl gap-5 px-5 pb-16">
        {items.length === 0 ? (
          <p className="text-muted">Belum ada pengumuman.</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
              {item.image ? <img src={item.image} alt="" className="aspect-16/9 w-full object-cover" /> : null}
              <div className="p-6">
                {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                <p className="text-sm text-pine">{formatDate(item.date)}</p>
                <h2 className="mt-2 font-serif text-3xl text-ink">{item.title}</h2>
                {item.excerpt ? <p className="mt-3 text-muted">{item.excerpt}</p> : null}
                {item.body ? (
                  <div className="mt-4">
                    <Prose text={item.body} />
                  </div>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </SiteFrame>
  );
}
