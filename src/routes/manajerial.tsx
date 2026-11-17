import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SectionTitle } from "@/components/site/ornament";
import { PageIntro, SiteFrame } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";
import type { StaffMember } from "@/lib/site/types";

export const Route = createFileRoute("/manajerial")({
  component: ManajerialPage,
});

function ManajerialPage() {
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
        kicker="Manajerial"
        title="Kepala, wakil, dan guru"
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
                <SectionTitle>Kepala Sekolah</SectionTitle>
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {kepala.map((item) => (
                    <StaffCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}

            {wakil.length > 0 ? (
              <section>
                <SectionTitle>Wakil Kepala Sekolah</SectionTitle>
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {wakil.map((item) => (
                    <StaffCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}

            {guru.length > 0 ? (
              <section>
                <SectionTitle>Guru</SectionTitle>
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {guru.map((item) => (
                    <StaffCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        <p className="mt-12 text-center text-sm text-muted">
          <Link
            to="/profil"
            className="inline-flex h-11 items-center gap-2 rounded-lg border-2 border-pine px-5 font-bold text-pine transition-colors hover:bg-pine hover:text-sheet"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Profil sekolah
          </Link>
        </p>
      </div>
    </SiteFrame>
  );
}

function StaffCard({ item }: { item: StaffMember }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-sheet transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="overflow-hidden bg-mint">
        {item.photo ? (
          <img
            src={item.photo}
            alt=""
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-sm text-muted">Foto</div>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t-4 border-sun p-5">
        {!item.visible ? <p className="mb-1 text-xs font-semibold text-brass">Tersembunyi dari tamu</p> : null}
        <h3 className="font-serif text-xl font-semibold text-ink">{item.name || "Nama belum diisi"}</h3>
        <p className="mt-0.5 text-sm font-bold text-pine">{item.role}</p>
        {item.duties ? <p className="mt-3 text-sm text-muted">{item.duties}</p> : null}
      </div>
    </article>
  );
}
