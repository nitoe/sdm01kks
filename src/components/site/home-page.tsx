import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { KelolaTab } from "@/routes/kelola";

export function HomePage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const { identity, hero, show } = content;
  const announcements = content.announcements.filter((item) => item.visible || admin);
  const programs = content.programs.filter((item) => item.visible || admin);
  const news = content.news.filter((item) => item.visible || admin);
  const gallery = content.gallery.filter((item) => item.visible || admin);
  const phone = identity.phone.replace(/[^\d+]/g, "");

  return (
    <SiteFrame>
      <Slot tab="Beranda">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold tracking-wide text-pine uppercase">{hero.kicker || "Selamat datang"}</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-6xl">{hero.title || "Judul beranda"}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{hero.lead || "Paragraf pembuka dapat diisi dari panel kelola."}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pengumuman" className="inline-flex h-12 items-center rounded-full bg-pine px-5 font-semibold text-sheet">
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
          {hero.image ? (
            <img src={hero.image} alt={hero.imageCaption} className="aspect-16/10 w-full rounded-card object-cover" />
          ) : (
            <Empty>Gambar utama belum dipasang.</Empty>
          )}
          {hero.imageCaption ? <figcaption className="mt-3 text-sm text-muted">{hero.imageCaption}</figcaption> : null}
        </figure>
      </section>
      </Slot>

      <Slot tab="Identitas">
      <section className="border-y border-line bg-sheet">
        <dl className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <Fact term="Berdiri" detail={identity.founded} />
          <Fact term="Akreditasi" detail={identity.accreditation} />
          <Fact term="Kepala sekolah" detail={identity.principal} />
          <Fact term="Belajar" detail={identity.hours} />
        </dl>
      </section>

      <section id="sekolah" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold tracking-wide text-pine uppercase">Sekolah</p>
          <h2 className="mt-2 font-serif text-4xl">{identity.name}</h2>
          <p className="mt-4 text-muted">{identity.tagline}</p>
        </div>
        <dl className="overflow-hidden rounded-card border border-line bg-sheet lg:col-span-7">
          <Row term="NPSN" detail={identity.npsn} />
          <Row term="SK pendirian" detail={identity.skFounded} />
          <Row term="Operasional" detail={identity.operational} />
          <Row term="Peserta didik" detail={identity.studentsNote} />
          <Row term="Naungan" detail={identity.foundation} />
        </dl>
      </section>
      </Slot>

      {show.pengumuman || admin ? (
        <Slot tab="Pengumuman">
        <section id="pengumuman" className="mx-auto max-w-6xl px-5 pb-16">
          <SectionTitle kicker="Papan sekolah" title="Pengumuman" />
          {!show.pengumuman && admin ? <HiddenNote /> : null}
          {announcements.length === 0 ? (
            <Empty>Belum ada pengumuman. Admin dapat menambahkannya dari panel kelola.</Empty>
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
                  {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                  <p className="text-sm text-brass">{formatDate(item.date)}</p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-3xl text-muted">{item.excerpt}</p>
                  {item.body ? (
                    <details className="mt-4 max-w-3xl">
                      <summary className="cursor-pointer font-semibold text-pine">Baca pengumuman</summary>
                      <div className="mt-3 grid gap-3">
                        {item.body.split(/\n\n+/).filter(Boolean).map((block) => (
                          <p key={block.slice(0, 48)}>{block}</p>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
        </Slot>
      ) : null}

      {show.program || admin ? (
        <Slot tab="Program">
        <section id="program" className="bg-pine-deep text-sheet">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-sm font-semibold tracking-wide text-brass-soft uppercase">Keseharian</p>
            <h2 className="mt-2 font-serif text-4xl">Yang dikerjakan di sekolah</h2>
            {!show.program && admin ? <p className="mt-3 text-sm text-brass-soft">Bagian ini disembunyikan dari tamu.</p> : null}
            {programs.length === 0 ? (
              <p className="mt-8 rounded-card border border-dashed border-white/30 px-5 py-8 text-sheet/80">
                Belum ada program.
              </p>
            ) : (
              <div className="mt-8 grid gap-px overflow-hidden rounded-card bg-white/15 sm:grid-cols-2">
                {programs.map((item, index) => (
                  <article key={item.id} className="bg-pine-deep p-6">
                    <p className="text-sm text-brass-soft">0{index + 1}</p>
                    {!item.visible ? <p className="text-sm text-brass-soft">Tersembunyi</p> : null}
                    <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                    <p className="mt-3 text-sheet/80">{item.summary}</p>
                  </article>
                ))}
              </div>
            )}
            <Link to="/program" className="mt-6 inline-flex h-11 items-center font-semibold text-brass-soft">
              Semua program
            </Link>
          </div>
        </section>
        </Slot>
      ) : null}

      {show.berita || admin ? (
        <Slot tab="Berita">
        <section id="berita" className="mx-auto max-w-6xl px-5 py-16">
          <SectionTitle kicker="Catatan" title="Berita" />
          {!show.berita && admin ? <HiddenNote /> : null}
          {news.length === 0 ? (
            <Empty>Belum ada artikel. Admin dapat menulis berita dan menambahkan gambar.</Empty>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to="/berita/$id"
                  params={{ id: item.id }}
                  className="overflow-hidden rounded-card border border-line bg-sheet transition-colors hover:border-pine"
                >
                  {item.image ? (
                    <img src={item.image} alt="" className="aspect-3/2 w-full object-cover" />
                  ) : (
                    <div className="grid aspect-3/2 place-items-center border-b border-dashed border-line text-sm text-muted">
                      Gambar artikel
                    </div>
                  )}
                  <div className="p-6">
                    {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                    <p className="text-sm text-brass">{formatDate(item.date)}</p>
                    <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                    <p className="mt-3 text-muted">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        </Slot>
      ) : null}

      {show.galeri || admin ? (
        <Slot tab="Galeri">
        <section id="galeri" className="mx-auto max-w-6xl px-5 pb-4">
          <SectionTitle kicker="Suasana" title="Galeri" />
          {!show.galeri && admin ? <HiddenNote /> : null}
          {gallery.length === 0 ? (
            <Empty>Belum ada foto. Unggah dari panel kelola.</Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <figure key={item.id} className="overflow-hidden rounded-card border border-line bg-sheet">
                  {item.src ? (
                    <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
                  ) : (
                    <div className="grid aspect-3/2 place-items-center border-b border-dashed border-line text-sm text-muted">
                      Gambar belum dipasang
                    </div>
                  )}
                  <figcaption className="px-4 py-3 text-sm text-muted">
                    {!item.visible ? <span className="mr-2 text-brass">Tersembunyi.</span> : null}
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <Link to="/galeri" className="mt-4 inline-flex h-11 items-center font-semibold text-pine">
            Semua foto
          </Link>
        </section>
        </Slot>
      ) : null}

      {show.visi || admin ? (
        <Slot tab="Visi">
        <section id="visi" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-wide text-pine uppercase">Arah sekolah</p>
            <h2 className="mt-2 font-serif text-4xl">Visi</h2>
            {!show.visi && admin ? <HiddenNote /> : null}
            <p className="mt-4 text-lg">{content.visi || "Visi belum diisi."}</p>
          </div>
          <div>
            <h2 className="font-serif text-4xl">Misi</h2>
            {content.misi.length === 0 ? (
              <p className="mt-4 text-muted">Misi belum diisi.</p>
            ) : (
              <ol className="mt-4 grid gap-3">
                {content.misi.map((item, index) => (
                  <li key={item} className="flex gap-4 rounded-card border border-line bg-sheet p-4">
                    <span className="font-serif text-xl text-pine">0{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
        </Slot>
      ) : null}

      <Slot tab="Identitas">
      <section id="kontak" className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold tracking-wide text-pine uppercase">Hubungi</p>
          <h2 className="mt-2 font-serif text-4xl">Datang atau telepon sekolah.</h2>
          <p className="mt-4 text-muted">Urusan peserta didik tetap dilayani di tempat, {identity.hours.toLowerCase()}.</p>
        </div>
        <div className="grid gap-4 rounded-card border border-line bg-sheet p-6 lg:col-span-7">
          <div>
            <p className="text-sm text-muted">Alamat</p>
            <p className="mt-1">{identity.address}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Telepon</p>
              <a className="mt-1 inline-flex font-semibold text-pine" href={`tel:${phone}`}>
                {identity.phone}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted">Surel</p>
              <a className="mt-1 inline-flex break-all font-semibold text-pine" href={`mailto:${identity.email}`}>
                {identity.email}
              </a>
            </div>
          </div>
          <Link to="/kontak" className="font-semibold text-pine">
            Halaman kontak
          </Link>
        </div>
      </section>
      </Slot>
    </SiteFrame>
  );
}

function Slot({ tab, children }: { tab: KelolaTab; children: ReactNode }) {
  const admin = useSiteStore((state) => state.admin);
  if (!admin) return children;
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-2 inset-y-1 rounded-card border border-dashed border-brass" />
      <Link
        to="/kelola"
        search={{ tab }}
        className="absolute top-3 right-4 z-10 inline-flex h-9 items-center rounded-full bg-sheet px-3 text-sm font-semibold text-pine ring-1 ring-brass"
      >
        Ubah
      </Link>
      {children}
    </div>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="mt-1 font-serif text-2xl">{detail || "—"}</dd>
    </div>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-3">
      <dt className="text-sm font-semibold text-muted">{term}</dt>
      <dd className="sm:col-span-2">{detail || "—"}</dd>
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

function Empty({ children }: { children: string }) {
  return <p className="rounded-card border border-dashed border-line bg-sheet px-5 py-8 text-muted">{children}</p>;
}

function HiddenNote() {
  return <p className="mb-4 text-sm text-brass">Bagian ini disembunyikan dari tamu.</p>;
}
