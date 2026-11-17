import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Eyebrow } from "@/components/site/ornament";
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
  const achievements = (content.achievements ?? []).filter((item) => item.visible || admin);
  const values = (content.values ?? []).filter((item) => item.visible || admin);
  const yearFounded = identity.founded.match(/\d{4}/)?.[0] ?? "1981";

  return (
    <SiteFrame>
      {/* Hero: judul besar di kiri, foto berbingkai lengkung di kanan */}
      <Slot tab="Beranda">
        <section className="relative overflow-hidden bg-paper">
          <div className="pola-bintang pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-20">
            <div className="lg:col-span-7">
              <Eyebrow className="rise">{hero.kicker || "SD Islam · Depok"}</Eyebrow>
              <h1
                className="rise mt-5 font-serif text-[2.6rem] leading-[1.04] font-semibold text-ink sm:text-6xl lg:text-[4.25rem]"
                style={{ "--d": "80ms" } as CSSProperties}
              >
                {hero.title || "Tempat anak tumbuh dengan adab, ilmu, dan Al-Qur'an."}
              </h1>
              <p
                className="rise mt-6 max-w-xl text-lg text-muted"
                style={{ "--d": "160ms" } as CSSProperties}
              >
                {hero.lead ||
                  "Sejak 1981, kami menemani anak-anak belajar dan beribadah di lingkungan yang akrab di Kukusan."}
              </p>
              <div
                className="rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
                style={{ "--d": "240ms" } as CSSProperties}
              >
                <Link
                  to="/profil"
                  className="tombol inline-flex h-12 items-center gap-2 rounded-lg bg-pine px-6 font-bold text-sheet hover:bg-pine-deep"
                >
                  Kenali sekolah
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/kontak"
                  className="inline-flex items-center gap-2 font-bold text-ink underline decoration-sun decoration-[3px] underline-offset-[6px] hover:text-pine"
                >
                  Hubungi kami
                </Link>
              </div>
              <dl
                className="rise mt-12 grid max-w-xl grid-cols-3 divide-x divide-line border-t border-line pt-7"
                style={{ "--d": "320ms" } as CSSProperties}
              >
                <div className="pr-4">
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Berdiri</dt>
                  <dd className="mt-1 font-serif text-3xl font-semibold text-ink md:text-4xl">{yearFounded}</dd>
                </div>
                <div className="px-4">
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Akreditasi</dt>
                  <dd className="mt-1 font-serif text-3xl font-semibold text-ink md:text-4xl">
                    {identity.accreditation || "A"}
                  </dd>
                </div>
                <div className="pl-4">
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Peserta didik</dt>
                  <dd className="mt-1 font-serif text-3xl font-semibold text-ink md:text-4xl">
                    {identity.studentsNote.replace(/[^0-9]/g, "") || "370"}+
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rise lg:col-span-5" style={{ "--d": "200ms" } as CSSProperties}>
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="arch absolute inset-0 translate-x-4 translate-y-4 bg-sun" aria-hidden="true" />
                <figure className="arch relative overflow-hidden border-4 border-sheet bg-mint shadow-lg">
                  {hero.image ? (
                    <img src={hero.image} alt="" className="aspect-4/5 w-full object-cover" />
                  ) : (
                    <div className="grid aspect-4/5 place-items-center text-muted">Foto sekolah</div>
                  )}
                </figure>
              </div>
              {hero.imageCaption ? (
                <p className="mx-auto mt-7 max-w-md text-center text-xs text-muted">{hero.imageCaption}</p>
              ) : null}
            </div>
          </div>
        </section>
      </Slot>

      {/* Sambutan: bagian gelap sebagai penanda suara sekolah */}
      {show.sambutan || admin ? (
        <Slot tab="Sambutan">
          <section id="sambutan" className="relative overflow-hidden bg-forest text-sheet">
            <div className="pola-bintang-gelap pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
              <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
                <figure className="arch overflow-hidden border-4 border-sun bg-pine-deep">
                  {welcome.image ? (
                    <img
                      src={welcome.image}
                      alt={welcome.name || "Kepala sekolah"}
                      className="aspect-3/4 w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-3/4 place-items-center text-sheet/70">Foto kepala sekolah</div>
                  )}
                </figure>
                {welcome.imageCaption ? (
                  <p className="mt-4 text-center text-xs text-sheet/60">{welcome.imageCaption}</p>
                ) : null}
              </div>
              <div className="lg:col-span-7">
                <Eyebrow tone="light">{welcome.kicker || "Sambutan kepala sekolah"}</Eyebrow>
                <h2 className="mt-4 font-serif text-3xl leading-[1.1] font-semibold text-sheet md:text-5xl">
                  {welcome.title || "Sambutan kepala sekolah"}
                </h2>
                <div className="mt-7 grid max-w-2xl gap-4 text-sheet/80">
                  {welcomeParagraphs(welcome.body).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-4 border-t border-sheet/20 pt-6">
                  <span className="h-10 w-1 rounded-full bg-sun" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-xl font-semibold text-sheet">{welcome.name}</p>
                    {welcome.role ? <p className="text-sm text-sheet/70">{welcome.role}</p> : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.nilai || admin ? (
        <Slot tab="Nilai">
          <section id="nilai" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead title="Nilai yang kami jaga" subtitle="Ritme yang dibangun setiap hari di sekolah." />
              {values.length === 0 ? <Empty>Belum ada kartu nilai.</Empty> : <ValueStrip items={values} />}
            </div>
          </section>
        </Slot>
      ) : null}

      {show.program || admin ? (
        <Slot tab="Program">
          <section id="program" className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead
                title="Program sekolah"
                subtitle="Tiga kelompok kegiatan: di kelas, pendalaman, dan di luar jam belajar."
                action={
                  <Link
                    to="/program"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-pine hover:underline"
                  >
                    Halaman program
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />
              <div className="grid gap-5 lg:grid-cols-3">
                {groups.map((item, index) => (
                  <Link
                    key={item.id}
                    to="/program/$id"
                    params={{ id: item.id }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:-translate-y-1 hover:border-pine/40 hover:shadow-lg"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-mint">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-sm text-muted">Foto kelompok</div>
                      )}
                      <span className="absolute top-3 left-3 rounded-md bg-sun px-2.5 py-1 font-serif text-sm font-bold text-ink">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {!item.visible ? <p className="text-sm text-brass">Tersembunyi dari tamu</p> : null}
                      <h3 className="font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{item.summary}</p>
                      <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm font-bold text-pine">
                        Lihat kelompok
                        <span className="grid size-8 place-items-center rounded-full bg-mint transition-colors group-hover:bg-pine group-hover:text-sheet">
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.prestasi || admin ? (
        <Slot tab="Prestasi">
          <section id="prestasi" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead title="Prestasi siswa" subtitle="Cuplikan. Selengkapnya ada di halaman prestasi." />
              {achievements.length === 0 ? <Empty>Belum ada prestasi.</Empty> : <PrestasiReel items={achievements} />}
            </div>
          </section>
        </Slot>
      ) : null}

      {show.berita || admin ? (
        <Slot tab="Berita">
          <section id="berita" className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead
                title="Berita"
                subtitle="Geser untuk membaca kabar lain. Kartu ini hanya ringkasannya."
                action={
                  <Link
                    to="/berita"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-pine hover:underline"
                  >
                    Semua berita
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />
              {news.length === 0 ? <Empty>Belum ada berita.</Empty> : <NewsStrip items={news} />}
            </div>
          </section>
        </Slot>
      ) : null}

      {show.visi || admin ? (
        <Slot tab="Visi">
          <section id="visi" className="relative overflow-hidden bg-sun-soft">
            <div className="pola-bintang pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
              <Eyebrow>Visi sekolah</Eyebrow>
              <p className="mt-6 font-serif text-3xl leading-snug font-semibold text-ink md:text-4xl">
                {content.visi || "Visi belum diisi."}
              </p>
              <Link
                to="/profil"
                className="mt-10 inline-flex h-12 items-center gap-2 rounded-lg border-2 border-ink px-6 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-sheet"
              >
                Profil & misi lengkap
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}
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
            className="group overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="aspect-video bg-sun-soft">
              {item.image ? (
                <img src={item.image} alt="" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-brass">
                  <Trophy className="size-8" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="px-3 py-3 text-center">
              <p className="truncate font-serif text-base font-semibold text-ink">{item.result || "Prestasi"}</p>
              <p className="truncate text-xs text-muted">{item.student || item.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-5 mb-1 flex justify-center">
        <Link
          to="/prestasi"
          className="tombol inline-flex h-12 items-center gap-2 rounded-lg bg-pine px-6 text-sm font-bold text-sheet hover:bg-pine-deep"
        >
          Lihat prestasi siswa
          <ArrowRight className="size-4" aria-hidden="true" />
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
            className="group overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:border-pine/40 hover:shadow-lg"
          >
            <div className="aspect-16/10 overflow-hidden bg-mint">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="grid size-full place-items-center text-sm text-muted">Foto berita</div>
              )}
            </div>
            <div className="p-5">
              <p className="inline-flex rounded-md bg-sun-soft px-2 py-0.5 text-xs font-bold text-ink">
                {formatDate(item.date)}
              </p>
              <h3 className="mt-3 font-serif text-xl leading-snug font-semibold text-ink group-hover:text-pine">
                {item.title}
              </h3>
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
        {items.map((item, index) => (
          <ValueCard key={item.id} number={index + 1} title={item.title} text={item.text} image={item.image} />
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
      className={`absolute top-12 z-10 grid size-11 place-items-center rounded-full bg-sheet text-pine shadow-md ring-1 ring-line transition-colors hover:bg-pine hover:text-sheet ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  );
}

function ValueCard({
  number,
  title,
  text,
  image,
}: {
  number: number;
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="relative">
        {image ? (
          <img src={image} alt="" className="aspect-16/10 w-full object-cover" />
        ) : (
          <div className="aspect-16/10 w-full bg-mint" />
        )}
        <span className="absolute -bottom-5 left-6 grid size-11 place-items-center rounded-full border-4 border-paper bg-sun font-serif text-base font-bold text-ink">
          {number}
        </span>
      </div>
      <div className="px-6 pt-9 pb-7">
        <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </article>
  );
}

function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="max-w-xl">
        <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
        <span className="mt-3 block h-1 w-12 rounded-full bg-sun" aria-hidden="true" />
        {subtitle ? <p className="mt-3 text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-muted">{children}</p>
  );
}
