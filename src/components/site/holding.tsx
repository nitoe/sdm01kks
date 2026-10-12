import { Link } from "@tanstack/react-router";
import { Mark, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

export function HoldingPage() {
  useBootSite();
  const identity = useSiteStore((state) => state.content.identity);
  const phone = identity.phone.replace(/[^\d+]/g, "");

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-pine text-sheet">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-sm">
          <span>NPSN {identity.npsn}</span>
          <span className="text-brass-soft">Akreditasi {identity.accreditation}</span>
          <span className="text-sheet/80">Kukusan, Depok</span>
        </div>
      </div>

      <header className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5">
        <Mark className="size-11" />
        <div>
          <p className="font-serif text-lg leading-tight font-semibold">{identity.name}</p>
          <p className="text-sm text-muted">{identity.domain}</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold tracking-wide text-pine uppercase">Situs resmi</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-6xl">Sedang disiapkan dengan saksama.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            {identity.name} sedang menyusun halaman resminya. Sampai naskah dan foto sekolah siap,
            alamat ini sengaja masih ringkas agar tamu tidak membaca informasi yang belum final.
          </p>
          <p className="mt-4 max-w-xl text-muted">
            Urusan sekolah tetap dilayani di tempat, {identity.hours.toLowerCase()}.
          </p>

          <dl className="mt-8 grid gap-4 rounded-card border border-line bg-sheet p-6">
            <div>
              <dt className="text-sm text-muted">Alamat</dt>
              <dd className="mt-1">{identity.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Telepon</dt>
              <dd className="mt-1">
                <a className="font-semibold text-pine" href={`tel:${phone}`}>
                  {identity.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Surel</dt>
              <dd className="mt-1">
                <a className="font-semibold text-pine" href={`mailto:${identity.email}`}>
                  {identity.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="lg:col-span-6">
          <img
            src="/media/halaman.jpg"
            alt="Ilustrasi halaman sekolah pada pagi hari"
            className="aspect-16/10 w-full rounded-card object-cover"
          />
          <figcaption className="mt-3 text-sm text-muted">
            Ilustrasi suasana. Foto resmi sekolah akan dipasang bersama situs yang sudah selesai.
          </figcaption>
        </figure>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-muted">
          <p>{identity.foundation}</p>
          <Link to="/kelola" className="py-2 font-semibold text-pine">
            Petugas sekolah
          </Link>
        </div>
      </footer>
    </div>
  );
}
