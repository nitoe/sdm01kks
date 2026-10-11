import { Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";

export function HomePage() {
  const content = useSiteStore((state) => state.content);
  const { identity, hero, show } = content;
  const announcements = content.announcements.filter((item) => item.visible);
  const programs = content.programs.filter((item) => item.visible);
  const news = content.news.filter((item) => item.visible);
  const gallery = content.gallery.filter((item) => item.visible);

  return (
    <SiteFrame>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold tracking-wide text-pine uppercase">{hero.kicker}</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-6xl">{hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pengumuman"
              className="inline-flex h-12 items-center rounded-full bg-pine px-5 font-semibold text-sheet"
            >
              Pengumuman
            </a>
            <Link
              to="/profil"
              className="inline-flex h-12 items-center rounded-full border border-line bg-sheet px-5 font-semibold text-ink"
            >
              Profil sekolah
            </Link>
          </div>
        </div>
        <figure className="lg:col-span-6">
          <img
            src={hero.image}
            alt={hero.imageCaption}
            className="aspect-16/10 w-full rounded-card object-cover"
          />
          <figcaption className="mt-3 text-sm text-muted">{hero.imageCaption}</figcaption>
        </figure>
      </section>

      <section className="border-y border-line bg-sheet">
        <dl className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <Fact term="Berdiri" detail={identity.founded} />
          <Fact term="Akreditasi" detail={identity.accreditation} />
          <Fact term="Peserta didik" detail={identity.studentsNote} />
          <Fact term="Belajar" detail={identity.hours} />
        </dl>
      </section>

      {show.pengumuman ? (
        <section id="pengumuman" className="mx-auto max-w-6xl px-5 py-16">
          <SectionTitle kicker="Papan sekolah" title="Pengumuman" />
          {announcements.length === 0 ? (
            <p className="text-muted">Belum ada pengumuman.</p>
          ) : (
            <div className="grid gap-4">
              {announcements.map((item, index) => (
                <article
                  key={item.id}
                  className={
                    index === 0
                      ? "rounded-card border border-line bg-sheet p-6 md:p-8"
                      : "rounded-card border border-line bg-sheet/70 p-5"
                  }
                >
                  <p className="text-sm text-brass">{formatDate(item.date)}</p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-3xl text-muted">{item.excerpt}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {show.program ? (
        <section className="bg-pine-deep text-sheet">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-sm font-semibold tracking-wide text-brass-soft uppercase">Keseharian</p>
            <h2 className="mt-2 font-serif text-4xl">Yang dikerjakan di sekolah</h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-card bg-white/15 sm:grid-cols-2">
              {programs.map((item, index) => (
                <article key={item.id} className="bg-pine-deep p-6">
                  <p className="text-sm text-brass-soft">0{index + 1}</p>
                  <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sheet/80">{item.summary}</p>
                </article>
              ))}
            </div>
            <Link to="/program" className="mt-6 inline-flex h-11 items-center font-semibold text-brass-soft">
              Semua program
            </Link>
          </div>
        </section>
      ) : null}

      {show.berita ? (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <SectionTitle kicker="Catatan" title="Berita" />
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <Link
                key={item.id}
                to="/berita/$id"
                params={{ id: item.id }}
                className="rounded-card border border-line bg-sheet p-6 transition-colors hover:border-pine"
              >
                <p className="text-sm text-brass">{formatDate(item.date)}</p>
                <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-muted">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {show.galeri ? (
        <section className="mx-auto max-w-6xl px-5 pb-4">
          <SectionTitle kicker="Suasana" title="Galeri" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <figure key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
                <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
                <figcaption className="px-4 py-3 text-sm text-muted">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {show.visi ? (
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-wide text-pine uppercase">Arah sekolah</p>
            <h2 className="mt-2 font-serif text-4xl">Visi</h2>
            <p className="mt-4 text-lg">{content.visi}</p>
            <p className="mt-4 text-sm text-muted">
              Naskah awal. Rumusan resmi dapat diganti dari panel kelola.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-4xl">Misi</h2>
            <ol className="mt-4 grid gap-3">
              {content.misi.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-card border border-line bg-sheet p-4">
                  <span className="font-serif text-xl text-pine">0{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
    </SiteFrame>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="mt-1 font-serif text-2xl">{detail}</dd>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold tracking-wide text-pine uppercase">{kicker}</p>
      <h2 className="mt-2 font-serif text-4xl">{title}</h2>
    </div>
  );
}
