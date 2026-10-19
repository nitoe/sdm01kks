import { Link } from "@tanstack/react-router";

const SCHOOL_NAME = "SD Muhammadiyah 01 Kukusan";
const FALLBACK_LOGO = "/logo-sekolah.svg";
const POPPINS = '"Poppins", "Source Sans 3", ui-sans-serif, system-ui, sans-serif';

/**
 * Halaman yang dilihat semua pengunjung sebelum admin menekan Publish.
 * Tidak membaca isi situs apa pun; hanya nama sekolah dan logo.
 */
export function MaintenancePage({ logoUrl }: { logoUrl?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d4d4d4] p-3 sm:p-6" style={{ fontFamily: POPPINS }}>
      <main className="relative w-full max-w-[1100px] overflow-hidden rounded-[2rem] bg-white px-6 py-8 sm:rounded-[3rem] sm:px-12 sm:py-10 lg:px-16">
        <header className="flex items-center gap-3">
          <img
            src={logoUrl || FALLBACK_LOGO}
            alt=""
            width={48}
            height={48}
            className="size-11 shrink-0 rounded-full object-cover sm:size-12"
          />
          <span className="text-base leading-tight font-semibold text-black sm:text-lg">{SCHOOL_NAME}</span>
        </header>

        <div className="mt-8 grid items-center gap-8 md:mt-4 md:grid-cols-2">
          <div className="md:py-10">
            <h1
              className="text-[6.5rem] leading-[0.9] font-black tracking-tight text-black sm:text-[9rem] lg:text-[11rem]"
              style={{ fontFamily: POPPINS }}
            >
              404
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-700 sm:text-lg">
              Website kami sedang dalam proses pembangunan. Kami menyiapkan isinya dengan teliti agar
              informasi yang disajikan lengkap dan benar. Silakan berkunjung kembali dalam waktu dekat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/"
                className="inline-flex h-12 min-w-40 items-center justify-center rounded-full bg-[#ff9200] px-8 text-base font-medium text-white transition-colors hover:bg-[#e68200] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9200]"
              >
                Go Back
              </a>
              <Link
                to="/masuk"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-black px-7 text-base font-medium text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Developer Mode
              </Link>
            </div>
          </div>

          <img
            src="/media/404-ilustrasi.png"
            alt=""
            width={780}
            height={780}
            className="mx-auto w-full max-w-[22rem] md:max-w-none"
          />
        </div>
      </main>
    </div>
  );
}
