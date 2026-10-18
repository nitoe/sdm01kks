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

      {/* Nilai singkat — kartu soft */}
      <Slot tab="Identitas">
        <section className="bg-paper">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3">
            <ValueCard
              title="Adab dulu"
              text="Sholat, doa, dan adab di kelas menjadi ritme harian bersama belajar."
            />
            <ValueCard
              title="Dekat Al-Qur'an"
              text="BTQ bertahap agar setiap anak nyaman membaca dan mengenal kitab suci."
            />
            <ValueCard
              title="Akrab di Kukusan"
              text="Sekolah dekat dengan orang tua dan lingkungan — aman dan bersahabat."
            />
          </div>
        </section>
      </Slot>

      {show.pengumuman || admin ? (
        <Slot tab="Pengumuman">
          <section id="pengumuman" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead title="Pengumuman" subtitle="Informasi untuk keluarga sekolah" />
              {announcements.length === 0 ? (
                <Empty>Belum ada pengumuman.</Empty>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {announcements.slice(0, 4).map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-line bg-paper/60 p-6 transition-shadow hover:shadow-sm"
                    >
                      <p className="text-sm text-pine">{formatDate(item.date)}</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
                    </article>
                  ))}
                </div>
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
                subtitle="Kegiatan yang menemani tumbuh kembang anak setiap hari"
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {programs.map((item) => (
                  <Link
                    key={item.id}
                    to="/program/$id"
                    params={{ id: item.id }}
                    className="group overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="aspect-16/10 overflow-hidden bg-mint">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt=""
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-sm text-muted">Foto program</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-ink group-hover:text-pine">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{item.summary}</p>
                      <p className="mt-3 text-sm font-semibold text-pine">Lihat detail →</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/program" className="mt-8 inline-flex text-sm font-semibold text-pine hover:underline">
                Semua program
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.prestasi || admin ? (
        <Slot tab="Prestasi">
          <section id="prestasi" className="bg-sheet">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead title="Prestasi siswa" subtitle="Capaian dari proses belajar dan pembiasaan" />
              {achievements.length === 0 ? (
                <Empty>Belum ada prestasi.</Empty>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {achievements.slice(0, 4).map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-line bg-paper/50 p-4"
                    >
                      <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-mint text-sm font-bold text-pine">
                        {item.result.replace(/Juara\s*/i, "J") || "★"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted">
                          {item.year} · {item.level} · {item.category}
                        </p>
                        <h3 className="mt-0.5 font-semibold text-ink">{item.title}</h3>
                        <p className="text-sm text-pine">{item.result}</p>
                        <p className="text-sm text-muted">{item.student}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <Link to="/prestasi" className="mt-6 inline-flex text-sm font-semibold text-pine hover:underline">
                Semua prestasi
              </Link>
            </div>
          </section>
        </Slot>
      ) : null}

      {show.berita || admin ? (
        <Slot tab="Berita">
          <section id="berita" className="bg-paper">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <SectionHead title="Berita" subtitle="Kabar dan kegiatan terbaru" />
              <div className="grid gap-5 md:grid-cols-2">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to="/berita/$id"
                    params={{ id: item.id }}
                    className="overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm transition-shadow hover:shadow-md"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="aspect-2/1 w-full object-cover" />
                    ) : null}
                    <div className="p-5">
                      <p className="text-sm text-pine">{formatDate(item.date)}</p>
                      <h3 className="mt-1 text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
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

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-line bg-sheet p-6 shadow-sm">
      <div className="mb-3 size-10 rounded-full bg-mint" />
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
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
