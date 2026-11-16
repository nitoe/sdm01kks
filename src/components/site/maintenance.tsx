const SCHOOL_NAME = "SD Muhammadiyah 01 Kukusan";
const FALLBACK_LOGO = "/logo-sekolah.png";

/**
 * Halaman yang dilihat semua pengunjung sebelum admin menekan Publish.
 * Tidak membaca isi situs apa pun; hanya nama sekolah dan logo.
 * Desain diselaraskan dengan palet & tipografi situs utama (pine/mint/paper).
 */
export function MaintenancePage({ logoUrl }: { logoUrl?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4 sm:p-6">
      <main className="relative w-full max-w-[1100px] overflow-hidden rounded-[1.75rem] border border-line bg-sheet shadow-sm">
        {/* Header ringan, konsisten dengan shell */}
        <header className="flex items-center gap-3 border-b border-line px-6 py-4 sm:px-10 sm:py-5">
          <img
            src={logoUrl || FALLBACK_LOGO}
            alt=""
            height={44}
            className="h-11 w-auto shrink-0 object-contain sm:h-12"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink sm:text-lg">{SCHOOL_NAME}</p>
            <p className="text-xs text-muted sm:text-sm">Depok · Muhammadiyah</p>
          </div>
        </header>

        <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-2 md:gap-12 lg:px-14">
          <div>
            <p className="text-xs font-semibold tracking-wide text-pine uppercase">
              Sedang disiapkan
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              Website kami sedang dibangun
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Kami menyiapkan isi situs dengan teliti agar informasi yang disajikan lengkap dan
              benar. Silakan berkunjung kembali dalam waktu dekat.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/"
                className="inline-flex h-12 min-w-[9.5rem] items-center justify-center rounded-full bg-pine px-7 text-base font-semibold text-sheet transition-colors hover:bg-pine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                Go Back
              </a>
              <a
                href="/masuk"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-sheet px-6 text-base font-semibold text-ink transition-colors hover:bg-mint hover:border-pine/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                Developer Mode
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[1.75rem] bg-mint/70 sm:-inset-4" aria-hidden="true" />
            <figure className="relative overflow-hidden rounded-[1.5rem] border border-line bg-paper">
              <img
                src="/media/404-ilustrasi.png"
                alt=""
                width={780}
                height={780}
                className="mx-auto w-full max-w-[20rem] object-contain md:max-w-none"
              />
            </figure>
          </div>
        </div>
      </main>
    </div>
  );
}
