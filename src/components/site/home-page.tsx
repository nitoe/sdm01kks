import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiteFrame } from "@/components/site/shell";
import { formatDate } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { KelolaTab } from "@/routes/kelola";

export function HomePage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const { identity, hero, show, welcome } = content;
  const groups = (content.programGroups ?? []).filter((item) => item.visible || admin);
  const news = content.news.filter((item) => item.visible || admin);
  const gallery = content.gallery.filter((item) => item.visible || admin);
  const achievements = (content.achievements ?? []).filter((item) => item.visible || admin);
  const values = (content.values ?? []).filter((item) => item.visible || admin);
  const phone = identity.phone.replace(/[^\d+]/g, "");
  const yearFounded = identity.founded.match(/\d{4}/)?.[0] ?? "1981";

  return (
    <SiteFrame>
      {/* Hero terang — split layout (EdmunHigh-style) */}
      <Slot tab="Beranda">
        <section className="bg-sheet">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-16">
            <div>
              <span className="inline-flex items-center rounded-full bg-mint px-3 py-1 text-xs font-semibold tracking-wide text-pine uppercase">
                {hero.kicker || "SD Islam · Depok"}
              </span>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
                {hero.title || "Tempat anak tumbuh dengan adab, ilmu, dan Al-Qur'an."}
              </h1>
              <p className="mt-4 max-w-lg text-lg text-muted">
                {hero.lead ||
                  "Sejak 1981, kami menemani anak-anak belajar dan beribadah di lingkungan yang akrab di Kukusan."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/profil"
                  className="inline-flex h-12 items-center rounded-full bg-pine px-6 font-semibold text-sheet hover:bg-pine-deep"
                >
                  Kenali sekolah
                </Link>
                <Link
                  to="/kontak"
                  className="inline-flex h-12 items-center rounded-full border border-line bg-sheet px-6 font-semibold text-ink hover:bg-paper"
                >
                  Hubungi kami
                </Link>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
                <div>
                  <dt className="text-xs text-muted">Berdiri</dt>
                  <dd className="mt-1 text-xl font-semibold text-ink">{yearFounded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Akreditasi</dt>
                  <dd className="mt-1 text-xl font-semibold text-ink">{identity.accreditation || "A"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Peserta didik</dt>
                  <dd className="mt-1 text-xl font-semibold text-ink">
                    {identity.studentsNote.replace(/[^0-9]/g, "") || "370"}+
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-mint/80 sm:-inset-4" />
              <figure className="relative overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-sm">
                {hero.image ? (
                  <img src={hero.image} alt="" className="aspect-4/3 w-full object-cover" />
                ) : (
                  <div className="grid aspect-4/3 place-items-center text-muted">Foto sekolah</div>
                )}
              </figure>
              {hero.imageCaption ? (
                <p className="relative mt-3 text-center text-xs text-muted">{hero.imageCaption}</p>
              ) : null}
            </div>
          </div>
        </section>
      </Slot>

      {show.sambutan || admin ? (
        <Slot tab="Sambutan">
          <section id="sambutan" className="bg-paper">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:py-16">
              <div className="relative">
                <div className="absolute -inset-3 rounded-[1.75rem] bg-mint/80 sm:-inset-4" />
                <figure className="relative overflow-hidden rounded-[1.5rem] border border-line bg-sheet shadow-sm">
                  {welcome.image ? (
                    <img
                      src={welcome.image}
                      alt={welcome.name || "Kepala sekolah"}
                      className="aspect-3/4 w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-3/4 place-items-center text-muted">Foto kepala sekolah</div>
                  )}
                </figure>
                {welcome.imageCaption ? (
                  <p className="relative mt-3 text-center text-xs text-muted">{welcome.imageCaption}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-pine uppercase">
                  {welcome.kicker || "Sambutan kepala sekolah"}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
                  {welcome.title || "Sambutan kepala sekolah"}
                </h2>
                <p className="mt-4 font-semibold text-ink">{welcome.name}</p>
                {welcome.role ? <p className="text-sm text-muted">{welcome.role}</p> : null}
                <div className="mt-5 grid max-w-xl gap-4 text-muted">
                  {welcomeParagraphs(welcome.body).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.nilai || admin ? (
        <Slot tab="Nilai">
          <section id="nilai" className="border-t border-line bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-12">
              {values.length === 0 ? (
                <Empty>Belum ada kartu nilai.</Empty>
              ) : (
                <ValueStrip items={values} />
              )}
            </div>
          </section>
        </Slot>
      ) : null}

      {show.program || admin ? (
        <Slot tab="Program">
          <section id="program" className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead
                title="Program sekolah"
                subtitle="Tiga kelompok kegiatan: di kelas, pendalaman, dan di luar jam belajar"
              />
              <div className="grid gap-5 lg:grid-cols-3">
                {groups.map((item) => (
                  <Link
                    key={item.id}
                    to="/program/$id"
                    params={{ id: item.id }}
                    className="group overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="aspect-16/10 overflow-hidden bg-mint">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-sm text-muted">Foto kelompok</div>
                      )}
                    </div>
                    <div className="p-5">
                      {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                      <h3 className="text-lg font-semibold text-ink group-hover:text-pine">{item.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted">{item.summary}</p>
                      <p className="mt-3 text-sm font-semibold text-pine">Lihat kelompok</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/program" className="mt-8 inline-flex text-sm font-semibold text-pine hover:underline">
                Halaman program
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.prestasi || admin ? (
        <Slot tab="Prestasi">
          <section id="prestasi" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-10">
              <SectionHead title="Prestasi siswa" subtitle="Cuplikan. Selengkapnya ada di halaman prestasi." />
              {achievements.length === 0 ? <Empty>Belum ada prestasi.</Empty> : <PrestasiReel items={achievements} />}
            </div>
          </section>
        </Slot>
      ) : null}

      {show.berita || admin ? (
        <Slot tab="Berita">
          <section id="berita" className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead title="Berita" subtitle="Geser untuk membaca kabar lain. Kartu ini hanya ringkasannya." />
              {news.length === 0 ? (
                <Empty>Belum ada berita.</Empty>
              ) : (
                <NewsStrip items={news} />
              )}
              <Link to="/berita" className="mt-6 inline-flex text-sm font-semibold text-pine hover:underline">
                Semua berita
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.galeri || admin ? (
        <Slot tab="Galeri">
          <section id="galeri" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead title="Galeri" subtitle="Suasana sekolah" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {gallery.slice(0, 6).map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
                    {item.src ? (
                      <img src={item.src} alt={item.caption} className="aspect-3/2 w-full object-cover" />
                    ) : null}
                    <figcaption className="px-3 py-2 text-xs text-muted">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <Link to="/galeri" className="mt-6 inline-flex text-sm font-semibold text-pine hover:underline">
                Galeri lengkap
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.visi || admin ? (
        <Slot tab="Visi">
          <section id="visi" className="bg-mint/50">
            <div className="mx-auto max-w-3xl px-5 py-16 text-center">
              <p className="text-sm font-semibold text-pine">Visi sekolah</p>
              <p className="mt-4 font-serif text-2xl leading-snug text-ink md:text-3xl">
                {content.visi || "Visi belum diisi."}
              </p>
              <Link
                to="/profil"
                className="mt-8 inline-flex h-11 items-center rounded-full border border-line bg-sheet px-5 text-sm font-semibold text-ink hover:bg-paper"
              >
                Profil & misi lengkap
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      <Slot tab="Identitas">
        <section id="kontak" className="bg-sheet">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="grid items-center gap-8 rounded-2xl border border-line bg-paper p-8 md:grid-cols-2 md:p-10">
              <div>
                <h2 className="font-serif text-3xl text-ink">Siap menyambut orang tua</h2>
                <p className="mt-3 text-muted">{identity.hours}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-sheet"
                  >
                    {identity.phone}
                  </a>
                  <Link
                    to="/kontak"
                    className="inline-flex h-11 items-center rounded-full border border-line bg-sheet px-5 text-sm font-semibold text-ink"
                  >
                    Halaman kontak
                  </Link>
                </div>
              </div>
              <div className="text-sm text-muted">
                <p className="font-semibold text-ink">{identity.name}</p>
                <p className="mt-2 leading-relaxed">{identity.address}</p>
                <a className="mt-3 inline-block font-medium text-pine" href={`mailto:${identity.email}`}>
                  {identity.email}
                </a>
                <p className="mt-4 text-xs">
                  NPSN {identity.npsn} · Akreditasi {identity.accreditation}
                </p>
              </div>
            </div>
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
      <div className="pointer-events-none absolute inset-x-2 inset-y-1 rounded-2xl border border-dashed border-brass/60" />
      <Link
        to="/kelola"
        search={{ tab }}
        className="absolute top-3 right-4 z-10 inline-flex h-8 items-center rounded-full bg-sheet px-3 text-xs font-semibold text-pine ring-1 ring-line"
      >
        Ubah
      </Link>
      {children}
    </div>
  );
}

function PrestasiReel({
  items,
}: {
  items: Array<{ id: string; title: string; student: string; result: string; image?: string }>;
}) {
  return (
    <div className="rounded-[1.75rem] border-2 border-pine/25 bg-mint p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            to="/prestasi"
            className="overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="aspect-video bg-sheet">
              {item.image ? (
                <img src={item.image} alt="" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-xs text-muted">Foto</div>
              )}
            </div>
            <div className="px-3 py-2 text-center">
              <p className="truncate text-sm font-semibold text-ink">{item.result || "Prestasi"}</p>
              <p className="truncate text-xs text-muted">{item.student || item.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Link
          to="/prestasi"
          className="inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-sheet transition-colors hover:bg-pine-deep"
        >
          Lihat prestasi siswa
        </Link>
      </div>
    </div>
  );
}

function NewsStrip({
  items,
}: {
  items: Array<{ id: string; date: string; title: string; excerpt: string; image?: string }>;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  function sync() {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      prev: el.scrollLeft > 8,
      next: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }

  useEffect(() => {
    sync();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [items.length]);

  function move(direction: -1 | 1) {
    const el = scroller.current;
    const card = el?.querySelector("a");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div ref={scroller} className="nilai-track">
        {items.map((item) => (
          <Link
            key={item.id}
            to="/berita/$id"
            params={{ id: item.id }}
            className="overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm"
          >
            <div className="aspect-16/10 bg-mint">
              {item.image ? (
                <img src={item.image} alt="" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-sm text-muted">Foto berita</div>
              )}
            </div>
            <div className="p-5">
              <p className="text-sm text-pine">{formatDate(item.date)}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{item.title}</h3>
              {item.excerpt ? <p className="mt-2 line-clamp-3 text-sm text-muted">{item.excerpt}</p> : null}
            </div>
          </Link>
        ))}
      </div>
      {edges.prev ? <StripButton label="Berita sebelumnya" side="left" onClick={() => move(-1)} /> : null}
      {edges.next ? <StripButton label="Berita berikutnya" side="right" onClick={() => move(1)} /> : null}
    </div>
  );
}

function welcomeParagraphs(body: string) {
  const parts = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts : [];
}

function ValueStrip({
  items,
}: {
  items: Array<{ id: string; title: string; text: string; image?: string }>;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  function sync() {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      prev: el.scrollLeft > 8,
      next: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }

  useEffect(() => {
    sync();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [items.length]);

  function move(direction: -1 | 1) {
    const el = scroller.current;
    const card = el?.querySelector("article");
    if (!el || !card) return;
    const gap = 16;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div ref={scroller} className="nilai-track">
        {items.map((item) => (
          <ValueCard key={item.id} title={item.title} text={item.text} image={item.image} />
        ))}
      </div>
      {edges.prev ? (
        <StripButton label="Kartu sebelumnya" side="left" onClick={() => move(-1)} />
      ) : null}
      {edges.next ? (
        <StripButton label="Kartu berikutnya" side="right" onClick={() => move(1)} />
      ) : null}
    </div>
  );
}

function StripButton({
  label,
  side,
  onClick,
}: {
  label: string;
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-12 z-10 grid size-11 place-items-center rounded-full bg-ink/35 text-sheet shadow-sm ring-1 ring-sheet/60 backdrop-blur-md transition-colors hover:bg-ink/55 ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  );
}

function ValueCard({ title, text, image }: { title: string; text: string; image?: string }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm">
      {image ? (
        <img src={image} alt="" className="aspect-16/10 w-full object-cover" />
      ) : (
        <div className="m-6 mb-0 size-10 rounded-full bg-mint" />
      )}
      <div className="p-6">
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </article>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-3xl text-ink">{title}</h2>
      {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-muted">{children}</p>
  );
}
