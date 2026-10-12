import { Link } from "@tanstack/react-router";
import { Mark, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

const SCENES = [
  {
    src: "/media/kelas.jpg",
    caption: "Ilustrasi ruang kelas. Foto resmi menyusul.",
  },
  {
    src: "/media/musala.jpg",
    caption: "Ilustrasi ruang ibadah. Foto resmi menyusul.",
  },
  {
    src: "/media/pustaka.jpg",
    caption: "Ilustrasi pojok baca. Foto resmi menyusul.",
  },
] as const;

export function HoldingPage() {
  useBootSite();
  const identity = useSiteStore((state) => state.content.identity);
  const hero = useSiteStore((state) => state.content.hero);
  const phone = identity.phone.replace(/[^\d+]/g, "");

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-pine text-sheet">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-sm">
          <span>NPSN {identity.npsn}</span>
          <span className="text-brass-soft">Akreditasi {identity.accreditation}</span>
          <span className="text-sheet/80">Kukusan, Beji, Depok</span>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-line bg-sheet/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <a href="#atas" className="flex min-w-0 items-center gap-3">
            <Mark className="size-11 shrink-0" />
            <span className="min-w-0">
              <span className="block font-serif text-lg leading-tight font-semibold">{identity.shortName}</span>
              <span className="block truncate text-sm text-muted">{identity.domain}</span>
            </span>
          </a>
          <nav className="ml-auto flex items-center gap-1">
            <a className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted sm:inline" href="#sekolah">
              Sekolah
            </a>
            <a className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted sm:inline" href="#suasana">
              Suasana
            </a>
            <a className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-sheet" href="#kontak">
              Hubungi
            </a>
          </nav>
        </div>
      </header>

      <main id="atas">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold tracking-wide text-pine uppercase">{hero.kicker}</p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-6xl">{hero.title}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{hero.lead}</p>
            <p className="mt-4 max-w-xl text-sm text-muted">
              Halaman lain masih disusun. Yang ada di sini adalah keterangan dasar sekolah, bukan pengumuman.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#kontak"
                className="inline-flex h-12 items-center rounded-full bg-pine px-5 font-semibold text-sheet"
              >
                Hubungi sekolah
              </a>
              <a
                href="#sekolah"
                className="inline-flex h-12 items-center rounded-full border border-line bg-sheet px-5 font-semibold text-ink"
              >
                Keterangan sekolah
              </a>
            </div>
          </div>
          <figure className="lg:col-span-6">
            <img
              src={hero.image}
              alt={hero.imageCaption}
              className="aspect-16/10 w-full rounded-card object-cover"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Ilustrasi suasana halaman sekolah. Foto resmi akan dipasang kemudian.
            </figcaption>
          </figure>
        </section>

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

        <section id="suasana" className="bg-pine-deep text-sheet">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="text-sm font-semibold tracking-wide text-brass-soft uppercase">Suasana</p>
            <h2 className="mt-2 max-w-xl font-serif text-4xl">Yang ingin ditunjukkan, setelah fotonya resmi.</h2>
            <p className="mt-4 max-w-2xl text-sheet/80">
              Gambar di bawah masih ilustrasi. Foto kegiatan, kelas, dan halaman sekolah akan menggantikannya
              begitu arsip resmi siap.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SCENES.map((scene) => (
                <figure key={scene.src} className="overflow-hidden rounded-card bg-pine">
                  <img src={scene.src} alt={scene.caption} className="aspect-3/2 w-full object-cover" />
                  <figcaption className="px-4 py-3 text-sm text-sheet/80">{scene.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="kontak" className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold tracking-wide text-pine uppercase">Hubungi</p>
            <h2 className="mt-2 font-serif text-4xl">Datang atau telepon sekolah.</h2>
            <p className="mt-4 text-muted">
              Urusan peserta didik tetap dilayani di tempat, {identity.hours.toLowerCase()}.
            </p>
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
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-pine-deep text-sheet">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 py-10">
          <div>
            <p className="font-serif text-2xl">{identity.name}</p>
            <p className="mt-2 text-sm text-sheet/75">{identity.foundation}</p>
            <p className="mt-1 text-sm text-sheet/75">{identity.domain}</p>
          </div>
          <Link to="/kelola" className="py-2 text-sm text-brass-soft">
            Petugas sekolah
          </Link>
        </div>
      </footer>
    </div>
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

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-3">
      <dt className="text-sm font-semibold text-muted">{term}</dt>
      <dd className="sm:col-span-2">{detail}</dd>
    </div>
  );
}
