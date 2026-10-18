import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { Prose } from "@/components/site/shell";
import { ProgramMediaGallery } from "@/components/site/program-media";
import { useSiteStore } from "@/lib/site/store";
import type { Program, ProgramGroup } from "@/lib/site/types";

const kickerClass = "text-xs font-semibold uppercase tracking-[0.2em]";

function Cover({ program, className }: { program: Program; className: string }) {
  return program.cover ? (
    <img
      src={program.cover}
      alt={`Kegiatan ${program.title}`}
      loading="lazy"
      className={`${className} object-cover`}
    />
  ) : (
    <div className={`${className} grid place-items-center bg-mint text-sm text-muted`}>
      Gambar belum dipasang
    </div>
  );
}

function EkskulCard({ item }: { item: Program }) {
  return (
    <Link
      to="/program/$id"
      params={{ id: item.id }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-sheet ring-1 ring-line transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
    >
      <div className="relative overflow-hidden">
        <Cover
          program={item}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-0 top-5 bg-pine-deep px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sheet">
          {item.category || "Ekskul"}
        </span>
      </div>
      <div className="flex flex-1 flex-col bg-sky p-5">
        {!item.visible ? <p className="mb-1 text-xs text-brass">Tersembunyi dari tamu</p> : null}
        <h3 className="font-serif text-2xl text-ink group-hover:text-pine">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-pine">
          Lihat selengkapnya{" "}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

/** Halaman daftar ekstrakurikuler: banner, penyaring kategori, dan kartu bergambar. */
export function EkskulListPage({ group, items }: { group: ProgramGroup; items: Program[] }) {
  const [filter, setFilter] = useState("Semua");
  const categories = [
    "Semua",
    ...Array.from(new Set(items.map((item) => item.category || "Ekskul"))),
  ];
  const shown =
    filter === "Semua" ? items : items.filter((item) => (item.category || "Ekskul") === filter);

  return (
    <>
      <div className="relative mx-auto max-w-6xl px-5 pt-8">
        <div className="relative">
          {group.image ? (
            <img
              src={group.image}
              alt="Siswa berkegiatan di halaman sekolah"
              className="aspect-[16/10] w-full rounded-2xl object-cover sm:aspect-[21/9]"
            />
          ) : (
            <div className="aspect-[16/10] w-full rounded-2xl bg-mint sm:aspect-[21/9]" />
          )}
          <div className="relative -mt-8 ml-3 mr-3 max-w-md bg-pine-deep p-5 text-sheet shadow-lg sm:-mt-16 sm:ml-8 sm:mr-0 sm:p-8">
            {!group.visible ? (
              <p className="mb-2 text-xs text-brass-soft">Tersembunyi dari tamu</p>
            ) : null}
            <p className={`${kickerClass} opacity-80`}>Ekstrakurikuler</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              {group.title === "Ekstrakurikuler" ? "Kegiatan ekskul kami" : group.title}
            </h1>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10">
        {group.summary || group.body ? (
          <div className="max-w-3xl space-y-3 text-muted">
            {group.summary ? <p className="text-lg text-ink">{group.summary}</p> : null}
            {group.body ? <p>{group.body}</p> : null}
          </div>
        ) : null}

        {categories.length > 2 ? (
          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="Saring berdasarkan kategori"
          >
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className={`h-10 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine ${
                  filter === name
                    ? "bg-pine-deep text-sheet"
                    : "border border-line bg-sheet text-ink hover:border-pine"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {shown.length} kegiatan{filter !== "Semua" ? ` · ${filter}` : ""}
        </p>
        {items.length === 0 ? (
          <p className="mt-4 text-muted">Belum ada kegiatan ekstrakurikuler yang ditampilkan.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <EkskulCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <p className="mt-12">
          <Link to="/program" className="font-semibold text-pine hover:underline">
            ← Semua kelompok program
          </Link>
        </p>
      </section>
    </>
  );
}

/** Halaman satu ekskul: gambar, uraian, prestasi, kegiatan, dan kontak. */
export function EkskulDetailPage({ program }: { program: Program }) {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const identity = content.identity;
  const media = program.media ?? [];
  const activities = program.activities ?? [];
  const achievements = program.achievements ?? [];
  const secondImage = media.find((item) => item.kind === "image" && item.src);
  const galleryRest = media.filter((item) => item !== secondImage);
  const others = content.programs.filter(
    (item) => item.group === "ekstrakurikuler" && item.id !== program.id && (item.visible || admin),
  );

  return (
    <article className="mx-auto max-w-6xl px-5 pb-16 pt-8">
      <nav aria-label="Jejak halaman" className="text-sm text-muted">
        <Link to="/program" className="hover:text-pine hover:underline">
          Program
        </Link>
        <span aria-hidden> / </span>
        <Link
          to="/program/$id"
          params={{ id: "ekstrakurikuler" }}
          className="hover:text-pine hover:underline"
        >
          Ekstrakurikuler
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink">{program.title}</span>
      </nav>
      {!program.visible ? <p className="mt-3 text-sm text-brass">Tersembunyi dari tamu.</p> : null}

      <header className="mt-6 grid items-start gap-8 lg:grid-cols-2">
        <Cover program={program} className="aspect-[4/3] w-full rounded-2xl" />
        <div className="flex flex-col gap-5">
          <div>
            <p className={`${kickerClass} text-muted`}>
              {program.category ? `Ekstrakurikuler · ${program.category}` : "Ekstrakurikuler"}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {program.title}
            </h1>
            {program.summary ? <p className="mt-4 text-lg text-muted">{program.summary}</p> : null}
            <Link
              to="/kontak"
              className="mt-6 inline-flex h-12 items-center rounded-md bg-pine-deep px-6 text-sm font-semibold text-sheet transition-colors hover:bg-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              Daftar sekarang
            </Link>
          </div>
          {secondImage ? (
            <img
              src={secondImage.src}
              alt={secondImage.caption || `Kegiatan ${program.title}`}
              loading="lazy"
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {program.body ? (
            <Prose text={program.body} />
          ) : (
            <p className="text-muted">Uraian kegiatan belum diisi.</p>
          )}

          <hr className="my-10 border-line" />
          <section aria-labelledby="prestasi">
            <h2 id="prestasi" className="font-serif text-3xl text-ink">
              Prestasi
            </h2>
            {achievements.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {achievements.map((item) => (
                  <div
                    key={item.id || item.title}
                    className="rounded-xl bg-sheet p-5 ring-1 ring-line"
                  >
                    <p className="text-xs font-semibold tracking-wider text-muted">{item.year}</p>
                    <p className="mt-2 font-serif text-2xl text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.result}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted">
                Prestasi {program.title} akan dicantumkan di sini.
                {admin ? " (Isi dari panel kelola → Program → pilih kegiatan ini.)" : ""}
              </p>
            )}
          </section>

          <ProgramMediaGallery media={galleryRest} />
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl bg-sheet p-6 ring-1 ring-line">
              <h2 className="font-serif text-2xl text-ink">Kegiatan kami</h2>
              {activities.length > 0 ? (
                <ul className="mt-4 divide-y divide-line">
                  {activities.map((act) => (
                    <li key={act} className="flex items-center gap-3 py-3 text-sm text-ink">
                      <Plus className="size-4 shrink-0 text-pine" aria-hidden />
                      {act}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">Daftar kegiatan belum diisi.</p>
              )}
            </div>

            <div className="rounded-xl bg-pine-deep p-6 text-sheet">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-2xl">Kontak</h2>
                <Link
                  to="/kontak"
                  aria-label={`Hubungi sekolah tentang ${program.title}`}
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-sheet text-pine-deep transition-colors hover:bg-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sheet"
                >
                  <ArrowUpRight className="size-5" aria-hidden />
                </Link>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Tanyakan jadwal dan pendaftaran {program.title} melalui sekolah.
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {identity.phone ? (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <a
                      href={`tel:${identity.phone.replace(/[^\d+]/g, "")}`}
                      className="hover:underline"
                    >
                      {identity.phone}
                    </a>
                  </li>
                ) : null}
                {identity.email ? (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <a href={`mailto:${identity.email}`} className="break-all hover:underline">
                      {identity.email}
                    </a>
                  </li>
                ) : null}
                {identity.address ? (
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{identity.address}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {others.length > 0 ? (
        <section className="mt-16" aria-labelledby="lainnya">
          <h2 id="lainnya" className="font-serif text-3xl text-ink">
            Ekstrakurikuler lainnya
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.slice(0, 4).map((item) => (
              <EkskulCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12">
        <Link
          to="/program/$id"
          params={{ id: "ekstrakurikuler" }}
          className="font-semibold text-pine hover:underline"
        >
          ← Semua ekstrakurikuler
        </Link>
      </p>
    </article>
  );
}
