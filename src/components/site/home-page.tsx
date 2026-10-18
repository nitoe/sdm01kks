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
  const achievements = (content.achievements ?? []).filter((item) => item.visible || admin);
  const phone = identity.phone.replace(/[^\d+]/g, "");
  const yearFounded = identity.founded.match(/\d{4}/)?.[0] ?? "1981";

  return (
    <SiteFrame>
      {/* —— HERO: klaim + foto (pola Walker / Brentwood) —— */}
      <Slot tab="Beranda">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-pine-deep">
            {hero.image ? (
              <img
                src={hero.image}
                alt=""
                className="size-full object-cover opacity-45"
              />
            ) : null}
            <div className="absolute inset-0 bg-linear-to-r from-pine-deep via-pine-deep/85 to-pine-deep/40" />
            <div className="pattern-islamic absolute inset-0 opacity-40" />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-12 lg:items-end lg:py-24">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold tracking-[0.16em] text-brass-soft uppercase">
                {hero.kicker || "Sekolah Dasar Islam · Depok"}
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-sheet md:text-5xl lg:text-6xl">
                {hero.title || "Mendidik anak dengan adab dan ilmu."}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-sheet/80">
                {hero.lead ||
                  "Di Kukusan, anak-anak belajar, beribadah, dan tumbuh dalam lingkungan yang akrab — dengan landasan Al-Qur'an dan Sunnah."}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/profil"
                  className="inline-flex h-12 items-center rounded-full bg-brass px-6 font-semibold text-pine-deep shadow-sm transition-colors hover:bg-brass-soft"
                >
                  Kenali sekolah
                </Link>
                <Link
                  to="/kontak"
                  className="inline-flex h-12 items-center rounded-full border border-sheet/35 bg-sheet/10 px-6 font-semibold text-sheet backdrop-blur-sm transition-colors hover:bg-sheet/20"
                >
                  Hubungi kami
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard label="Berdiri" value={yearFounded} />
                <StatCard label="Akreditasi" value={identity.accreditation || "A"} />
                <StatCard label="Peserta didik" value={identity.studentsNote.replace(/[^0-9]/g, "") || "370"} suffix="+" />
                <StatCard label="Hari belajar" value="6" suffix=" hari" />
              </div>
              {hero.imageCaption ? (
                <p className="mt-4 text-xs text-sheet/55">{hero.imageCaption}</p>
              ) : null}
            </div>
          </div>
        </section>
      </Slot>

      {/* —— JANJI SINGKAT (story beat) —— */}
      <Slot tab="Identitas">
        <section className="border-b border-line bg-sheet">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
            <PromiseCard
              title="Adab sebelum ilmu"
              text="Pembiasaan sholat, doa, dan adab di kelas menjadi ritme harian — bukan kegiatan terpisah dari belajar."
            />
            <PromiseCard
              title="Dekat dengan Al-Qur'an"
              text="Program baca tulis Al-Qur'an disusun bertahap agar setiap anak nyaman dengan kitab suci sejak dini."
            />
            <PromiseCard
              title="Tumbuh di Kukusan"
              text="Sekolah di jantung komunitas: aman, akrab dengan orang tua, dan terhubung dengan lingkungan sekitar."
            />
          </div>
        </section>
      </Slot>

      {/* —— PENGUMUMAN —— */}
      {show.pengumuman || admin ? (
        <Slot tab="Pengumuman">
          <section id="pengumuman" className="mx-auto max-w-6xl px-5 py-14">
            <SectionHead
              kicker="Untuk keluarga"
              title="Pengumuman sekolah"
              action={announcements.length > 0 ? undefined : undefined}
            />
            {announcements.length === 0 ? (
              <Empty>Belum ada pengumuman.</Empty>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {announcements.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="rounded-card border border-line bg-sheet p-6 transition-shadow hover:shadow-sm"
                  >
                    <p className="text-sm font-medium text-brass">{formatDate(item.date)}</p>
                    <h3 className="mt-2 font-serif text-2xl text-ink">{item.title}</h3>
                    <p className="mt-3 text-muted">{item.excerpt}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Slot>
      ) : null}

      {/* —— EXPERIENCE / PROGRAM (pola Dunham) —— */}
      {show.program || admin ? (
        <Slot tab="Program">
          <section id="program" className="bg-sand/60 pattern-islamic">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead
                kicker="Kehidupan sekolah"
                title="Yang anak alami setiap hari"
                lead="Bukan daftar kegiatan semata — ini cara kami menemani tumbuh kembang anak di sekolah."
              />
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {programs.map((item, index) => (
                  <Link
                    key={item.id}
                    to="/program/$id"
                    params={{ id: item.id }}
                    className="group overflow-hidden rounded-card border border-line bg-sheet transition-all hover:border-pine/40 hover:shadow-md"
                  >
                    <div className="relative aspect-16/9 overflow-hidden bg-pine-deep/10">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt=""
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-sm text-muted">Dokumentasi menyusul</div>
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-sheet/95 px-3 py-1 text-xs font-semibold tracking-wide text-pine uppercase">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                      <p className="mt-2 text-muted">{item.summary}</p>
                      <p className="mt-4 text-sm font-semibold text-pine group-hover:underline">Buka cerita program</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/program" className="inline-flex h-11 items-center font-semibold text-pine hover:underline">
                  Semua program →
                </Link>
              </div>
            </div>
          </section>
        </Slot>
      ) : null}

      {/* —— PRESTASI SEBAGAI BUKTI —— */}
      {show.prestasi || admin ? (
        <Slot tab="Prestasi">
          <section id="prestasi" className="mx-auto max-w-6xl px-5 py-16">
            <SectionHead
              kicker="Bukti kerja"
              title="Prestasi yang tumbuh dari pembiasaan"
              lead="Dari cerdas cermat hingga tahfidz — setiap capaian adalah hasil proses, bukan kejar peringkat semata."
            />
            {achievements.length === 0 ? (
              <Empty>Belum ada prestasi tercatat.</Empty>
            ) : (
              <div className="mt-2 grid gap-4 md:grid-cols-2">
                {achievements.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-card border border-line bg-sheet p-5"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="hidden size-24 shrink-0 rounded-xl object-cover sm:block"
                      />
                    ) : (
                      <div className="hidden size-24 shrink-0 place-items-center rounded-xl bg-brass-soft text-sm font-semibold text-pine sm:grid">
                        {item.result}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-brass">
                        {item.year} · {item.level} · {item.category}
                      </p>
                      <h3 className="mt-1 font-serif text-xl text-ink">{item.title}</h3>
                      <p className="mt-1 font-semibold text-pine">{item.result}</p>
                      <p className="text-sm text-muted">{item.student}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <Link to="/prestasi" className="mt-6 inline-flex h-11 items-center font-semibold text-pine hover:underline">
              Semua prestasi & filter →
            </Link>
          </section>
        </Slot>
      ) : null}

      {/* —— BERITA —— */}
      {show.berita || admin ? (
        <Slot tab="Berita">
          <section id="berita" className="border-y border-line bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-16">
              <SectionHead kicker="Cerita terbaru" title="Berita sekolah" />
              <div className="grid gap-5 md:grid-cols-2">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to="/berita/$id"
                    params={{ id: item.id }}
                    className="group overflow-hidden rounded-card border border-line bg-paper/50 transition-shadow hover:shadow-md"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="aspect-2/1 w-full object-cover" />
                    ) : null}
                    <div className="p-6">
                      <p className="text-sm text-brass">{formatDate(item.date)}</p>
                      <h3 className="mt-2 font-serif text-2xl group-hover:text-pine">{item.title}</h3>
                      <p className="mt-3 text-muted">{item.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/berita" className="mt-6 inline-flex h-11 items-center font-semibold text-pine hover:underline">
                Semua berita →
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {/* —— GALERI MOSAIK —— */}
      {show.galeri || admin ? (
        <Slot tab="Galeri">
          <section id="galeri" className="mx-auto max-w-6xl px-5 py-16">
            <SectionHead
              kicker="Suasana"
              title="Sekilas kehidupan di sekolah"
              lead="Foto kegiatan akan diganti dengan dokumentasi resmi sekolah."
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {gallery.slice(0, 6).map((item, i) => (
                <figure
                  key={item.id}
                  className={`overflow-hidden rounded-card border border-line bg-sheet ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className={`w-full object-cover ${i === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-3/2"}`}
                    />
                  ) : null}
                  <figcaption className="px-3 py-2 text-xs text-muted md:text-sm">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
            <Link to="/galeri" className="mt-6 inline-flex h-11 items-center font-semibold text-pine hover:underline">
              Galeri lengkap →
            </Link>
          </section>
        </Slot>
      ) : null}

      {/* —— VISI SEBAGAI KUTIPAN —— */}
      {show.visi || admin ? (
        <Slot tab="Visi">
          <section id="visi" className="bg-pine-deep text-sheet">
            <div className="pattern-islamic">
              <div className="mx-auto max-w-3xl px-5 py-20 text-center">
                <p className="text-sm font-semibold tracking-[0.14em] text-brass-soft uppercase">Visi sekolah</p>
                <blockquote className="mt-6 font-serif text-2xl leading-snug md:text-3xl">
                  “{content.visi || "Visi belum diisi."}”
                </blockquote>
                <Link
                  to="/profil"
                  className="mt-10 inline-flex h-11 items-center rounded-full border border-sheet/30 px-5 text-sm font-semibold text-sheet transition-colors hover:bg-sheet/10"
                >
                  Baca visi & misi lengkap
                </Link>
              </div>
            </div>
          </section>
        </Slot>
      ) : null}

      {/* —— KONTAK CTA —— */}
      <Slot tab="Identitas">
        <section id="kontak" className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid overflow-hidden rounded-card border border-line bg-sheet lg:grid-cols-12">
            <div className="p-8 lg:col-span-7 lg:p-12">
              <p className="text-sm font-semibold tracking-[0.12em] text-pine uppercase">Kunjungi atau hubungi</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">Kami siap menyambut orang tua.</h2>
              <p className="mt-4 max-w-md text-muted">{identity.hours}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex h-12 items-center rounded-full bg-pine px-5 font-semibold text-sheet"
                >
                  {identity.phone}
                </a>
                <Link
                  to="/kontak"
                  className="inline-flex h-12 items-center rounded-full border border-line px-5 font-semibold text-ink"
                >
                  Halaman kontak
                </Link>
              </div>
            </div>
            <div className="border-t border-line bg-brass-soft/40 p-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
              <p className="text-sm font-semibold text-pine-deep">{identity.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{identity.address}</p>
              <a className="mt-4 inline-block text-sm font-semibold text-pine" href={`mailto:${identity.email}`}>
                {identity.email}
              </a>
              <p className="mt-6 text-xs text-muted">NPSN {identity.npsn} · Akreditasi {identity.accreditation}</p>
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

function StatCard({ label, value, suffix = "" }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-sheet/20 bg-sheet/10 px-4 py-4 backdrop-blur-sm">
      <p className="text-xs font-medium tracking-wide text-sheet/65 uppercase">{label}</p>
      <p className="mt-1 font-serif text-3xl text-sheet">
        {value}
        {suffix ? <span className="text-lg text-sheet/70">{suffix}</span> : null}
      </p>
    </div>
  );
}

function PromiseCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative pl-5">
      <span className="absolute top-1 left-0 h-8 w-1 rounded-full bg-brass" />
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-sm font-semibold tracking-[0.12em] text-pine uppercase">{kicker}</p>
      <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
      {lead ? <p className="mt-3 text-muted">{lead}</p> : null}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border border-dashed border-line px-5 py-10 text-center text-muted">{children}</p>
  );
}
