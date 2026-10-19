import { createRootRoute, HeadContent, Link, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { MaintenancePage } from "@/components/site/maintenance";
import { getSiteGate } from "@/lib/site/gate";
import type { SiteGate } from "@/lib/site/gate-types";
import appCss from "../styles.css?url";

const APP_NAME = "SD Muhammadiyah 01 Kukusan";

/** Halaman yang tetap bisa dibuka pengunjung sebelum Publish (jalan masuk admin/operator). */
const OPEN_PATHS = ["/masuk", "/kelola"];

function isOpenPath(pathname: string) {
  return OPEN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Di peramban, begitu situs diketahui sudah dipublikasikan, pemeriksaan ke server dilewati.
 * Tidak berlaku di server (modul dipakai bersama banyak permintaan) dan tidak ada tombol
 * "batalkan publikasi" di panel, jadi nilai ini tidak bisa basi.
 */
let knownPublished = false;

async function readGate(): Promise<SiteGate> {
  const isBrowser = typeof window !== "undefined";
  if (isBrowser && knownPublished) return { open: true, published: true, logoUrl: "" };
  const gate = await getSiteGate();
  if (isBrowser && gate.published) knownPublished = true;
  return gate;
}

export const Route = createRootRoute({
  beforeLoad: async () => ({ gate: await readGate() }),
  head: ({ match }) => {
    const blocked = !match.context.gate.open && !isOpenPath(match.pathname);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: blocked ? `${APP_NAME} · Website sedang dibangun` : APP_NAME },
        {
          name: "description",
          content: blocked
            ? "Website SD Muhammadiyah 01 Kukusan sedang dalam proses pembangunan."
            : "Situs resmi SD Muhammadiyah 01 Kukusan, Depok. Sekolah dasar terakreditasi A di bawah Pimpinan Daerah Muhammadiyah Kota Depok.",
        },
        ...(blocked ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        { name: "theme-color", content: "#0e6b45" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,650&family=Source+Sans+3:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;900&display=swap",
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  const { gate } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const blocked = !gate.open && !isOpenPath(pathname);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>{blocked ? <MaintenancePage logoUrl={gate.logoUrl} /> : <Outlet />}</AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-serif text-4xl">Halaman tidak ditemukan</h1>
      <Link to="/" className="mt-6 inline-flex font-semibold text-pine">
        Kembali ke beranda
      </Link>
    </main>
  );
}
