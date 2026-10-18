import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import type { StaffMember } from "@/lib/site/types";

export const Route = createFileRoute("/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const content = useSiteStore((state) => state.content);
  const admin = useSiteStore((state) => state.admin);
  const identity = content.identity;
  const staff = (content.staff ?? []).filter((item) => item.visible || admin);

  const kepala = staff.filter((item) => /kepala\s*sekolah/i.test(item.role) && !/wakil/i.test(item.role));
  const wakil = staff.filter((item) => /wakil/i.test(item.role));
  const guru = staff.filter(
    (item) => !/kepala\s*sekolah/i.test(item.role) && !/wakil/i.test(item.role),
  );

  return (
    <SiteFrame>
      <PageIntro
        kicker="Profil"
        title="Manajerial sekolah"
        lead={`${identity.name} dipimpin oleh kepala sekolah bersama wakil dan para guru. Mereka yang menemani anak-anak setiap hari.`}
      />

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {staff.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-12 text-center text-muted">
            Data manajerial belum diisi. Admin dapat menambahkannya lewat panel kelola tab Manajerial.
          </p>
        ) : (
          <div className="grid gap-12">
            {kepala.length > 0 ? (
              <section>
                <h2 className="font-serif text-2xl text-ink">Kepala Sekolah</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {kepala.map((item) => (
                    <StaffCard key={item.id} item={item} featured />
                  ))}
                </div>
              </section>
            ) : null}

            {wakil.length > 0 ? (
              <section>
                <h2 className="font-serif text-2xl text-ink">Wakil Kepala Sekolah</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {wakil.map((item) => (
                    <StaffCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}

            {guru.length > 0 ? (
              <section>
                <h2 className="font-serif text-2xl text-ink">Guru</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {guru.map((item) => (
                    <StaffCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        <section className="mt-14 rounded-2xl border border-line bg-mint/40 p-6">
          <h2 className="font-serif text-xl text-ink">Identitas sekolah</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">NPSN</dt>
              <dd className="font-medium">{identity.npsn}</dd>
            </div>
            <div>
              <dt className="text-muted">Akreditasi</dt>
              <dd className="font-medium">{identity.accreditation}</dd>
            </div>
            <div>
              <dt className="text-muted">Berdiri</dt>
              <dd className="font-medium">{identity.founded}</dd>
            </div>
            <div>
              <dt className="text-muted">Naungan</dt>
              <dd className="font-medium">{identity.foundation}</dd>
            </div>
          </dl>
        </section>
      </div>
    </SiteFrame>
  );
}

function StaffCard({ item, featured = false }: { item: StaffMember; featured?: boolean }) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-sheet shadow-sm ${
        featured ? "sm:col-span-2 lg:col-span-1" : ""
      }`}
    >
      <div className="bg-mint">
        {item.photo ? (
          <img src={item.photo} alt="" className="aspect-[4/5] w-full object-cover" />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-sm text-muted">Foto</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {!item.visible ? <p className="mb-1 text-xs font-semibold text-brass">Tersembunyi dari tamu</p> : null}
        <h3 className="font-semibold text-ink">{item.name || "Nama belum diisi"}</h3>
        <p className="mt-0.5 text-sm font-medium text-pine">{item.role}</p>
        {item.duties ? <p className="mt-2 text-sm text-muted">{item.duties}</p> : null}
      </div>
    </article>
  );
}
