import { createFileRoute, Link } from "@tanstack/react-router";
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
          <h2 id="identitas-heading" className="font-serif text-2xl text-ink md:text-3xl">
            Identitas sekolah
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Data resmi yang dipakai di administrasi dan komunikasi sekolah.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-line bg-sheet p-4 shadow-sm"
              >
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{row.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted">{identity.address}</p>
        </section>

        {/* Sejarah */}
        {sejarah?.trim() ? (
          <section aria-labelledby="sejarah-heading" className="mt-14">
            <h2 id="sejarah-heading" className="font-serif text-2xl text-ink md:text-3xl">
              Sejarah singkat
            </h2>
            <div className="mt-5 max-w-3xl">
              <Prose text={sejarah} />
            </div>
          </section>
        ) : null}

        {/* Visi */}
        <section aria-labelledby="visi-heading" className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-line bg-mint/50 p-6 md:p-8">
            <p className="text-sm font-semibold tracking-wide text-pine uppercase">Visi</p>
            <h2 id="visi-heading" className="mt-3 font-serif text-2xl text-ink md:text-3xl">
              {visi?.trim() || "Visi belum diisi."}
            </h2>
          </div>
        </section>

        {/* Misi */}
        <section aria-labelledby="misi-heading" className="mt-10">
          <h2 id="misi-heading" className="font-serif text-2xl text-ink md:text-3xl">
            Misi
          </h2>
          {misi?.length ? (
            <ol className="mt-5 grid gap-3">
              {misi.map((item, index) => (
                <li
                  key={`${index}-${item.slice(0, 24)}`}
                  className="flex gap-4 rounded-2xl border border-line bg-sheet p-4 shadow-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-semibold text-pine">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 text-ink">{item}</span>
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
            <h2 id="nilai-heading" className="font-serif text-2xl text-ink md:text-3xl">
              Nilai yang kami jaga
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Ringkasan sikap yang menjadi ritme sehari-hari di sekolah.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {nilai.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-line bg-sheet p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* Tautan lanjutan */}
        <section className="mt-14 grid gap-4 rounded-2xl border border-line bg-sheet p-6 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl text-ink">Manajerial</h2>
            <p className="mt-2 text-sm text-muted">
              Kenali kepala sekolah, wakil, dan para guru yang mendampingi anak setiap hari.
            </p>
            <Link
              to="/manajerial"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-sheet hover:bg-pine-deep"
            >
              Lihat manajerial
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-xl text-ink">Hubungi sekolah</h2>
            <p className="mt-2 text-sm text-muted">
              Alamat, telepon, WhatsApp, dan peta lokasi.
            </p>
            <Link
              to="/kontak"
              className="mt-4 inline-flex h-11 items-center rounded-full border border-pine px-5 text-sm font-semibold text-pine hover:bg-mint"
            >
              Halaman kontak
            </Link>
          </div>
        </section>
      </div>
    </SiteFrame>
  );
}
