import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Eyebrow, SectionTitle } from "@/components/site/ornament";
import { PageIntro, Prose, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export const Route = createFileRoute("/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const { identity, visi, misi, sejarah, values } = content;
  const nilai = (values ?? []).filter((item) => item.visible || admin);

  const facts: { label: string; value: string }[] = [
    { label: "NPSN", value: identity.npsn },
    { label: "Akreditasi", value: identity.accreditation },
    { label: "Berdiri", value: identity.founded },
    { label: "SK pendirian", value: identity.skFounded },
    { label: "Beroperasi", value: identity.operational },
    { label: "Kepala sekolah", value: identity.principal },
    { label: "Naungan", value: identity.foundation },
    { label: "Peserta didik", value: identity.studentsNote },
  ].filter((row) => row.value?.trim());

  return (
    <SiteFrame>
      <PageIntro
        kicker="Profil"
        title={identity.name}
        lead={identity.tagline}
      />

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {/* Identitas ringkas */}
        <section aria-labelledby="identitas-heading">
          <SectionTitle id="identitas-heading" sub="Data resmi yang dipakai di administrasi dan komunikasi sekolah.">
            Identitas sekolah
          </SectionTitle>
          <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-line border-l-4 border-l-sun bg-sheet p-4"
              >
                <dt className="text-xs font-bold tracking-wider text-muted uppercase">{row.label}</dt>
                <dd className="mt-1.5 font-serif text-lg leading-snug font-semibold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted">{identity.address}</p>
        </section>

        {/* Sejarah */}
        {sejarah?.trim() ? (
          <section aria-labelledby="sejarah-heading" className="mt-14">
            <SectionTitle id="sejarah-heading">Sejarah singkat</SectionTitle>
            <div className="mt-6 max-w-3xl text-lg leading-relaxed">
              <Prose text={sejarah} />
            </div>
          </section>
        ) : null}

        {/* Visi */}
        <section aria-labelledby="visi-heading" className="mt-14">
          <div className="pola-bintang overflow-hidden rounded-3xl border border-line bg-sun-soft p-7 md:p-10">
            <Eyebrow>Visi</Eyebrow>
            <h2 id="visi-heading" className="mt-4 font-serif text-2xl leading-snug font-semibold text-ink md:text-4xl">
              {visi?.trim() || "Visi belum diisi."}
            </h2>
          </div>
        </section>

        {/* Misi */}
        <section aria-labelledby="misi-heading" className="mt-10">
          <SectionTitle id="misi-heading">Misi</SectionTitle>
          {misi?.length ? (
            <ol className="mt-7 grid gap-3">
              {misi.map((item, index) => (
                <li
                  key={`${index}-${item.slice(0, 24)}`}
                  className="flex gap-4 rounded-2xl border border-line bg-sheet p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sun font-serif text-base font-bold text-ink">
                    {index + 1}
                  </span>
                  <span className="pt-2 text-ink">{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-muted">Misi belum diisi.</p>
          )}
        </section>

        {/* Nilai (opsional, dari data yang sama dengan beranda) */}
        {nilai.length > 0 ? (
          <section aria-labelledby="nilai-heading" className="mt-14">
            <SectionTitle id="nilai-heading" sub="Ringkasan sikap yang menjadi ritme sehari-hari di sekolah.">
              Nilai yang kami jaga
            </SectionTitle>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {nilai.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-line border-t-4 border-t-pine bg-sheet p-6"
                >
                  <h3 className="font-serif text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* Tautan lanjutan */}
        <section className="mt-14 grid gap-8 rounded-3xl bg-forest p-7 text-sheet sm:grid-cols-2 md:p-10">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-sheet">Manajerial</h2>
            <p className="mt-2 text-sm text-sheet/75">
              Kenali kepala sekolah, wakil, dan para guru yang mendampingi anak setiap hari.
            </p>
            <Link
              to="/manajerial"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-sun px-5 text-sm font-bold text-ink hover:bg-sheet"
            >
              Lihat manajerial
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-sheet">Hubungi sekolah</h2>
            <p className="mt-2 text-sm text-sheet/75">
              Alamat, telepon, WhatsApp, dan peta lokasi.
            </p>
            <Link
              to="/kontak"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg border-2 border-sheet/60 px-5 text-sm font-bold text-sheet hover:bg-sheet hover:text-ink"
            >
              Halaman kontak
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
