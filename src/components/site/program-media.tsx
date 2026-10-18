import type { ProgramMedia } from "@/lib/site/types";

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = u.pathname.split("/").filter(Boolean);
      if ((parts[0] === "embed" || parts[0] === "shorts") && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
  } catch {
    /* alamat tidak valid */
  }
  return null;
}

export function ProgramMediaGallery({ media }: { media: ProgramMedia[] }) {
  if (media.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl text-ink">Dokumentasi</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {media.map((item) => {
          const yt = item.kind === "url" ? youtubeEmbed(item.src) : null;
          return (
            <figure
              key={item.id}
              className="overflow-hidden rounded-xl border border-line bg-sheet"
            >
              {item.kind === "image" && item.src ? (
                <img
                  src={item.src}
                  alt={item.caption || "Dokumentasi kegiatan"}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              ) : null}
              {item.kind === "video" && item.src ? (
                <video src={item.src} controls className="aspect-video w-full bg-ink" />
              ) : null}
              {yt ? (
                <div className="aspect-video w-full bg-ink">
                  <iframe
                    title={item.caption || "Video YouTube"}
                    src={yt}
                    loading="lazy"
                    className="size-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
              {item.kind === "url" && item.src && !yt ? (
                <div className="p-4">
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-pine underline-offset-2 hover:underline"
                  >
                    {item.caption || item.src}
                  </a>
                </div>
              ) : null}
              {item.caption && item.kind !== "url" ? (
                <figcaption className="border-t border-line px-4 py-2 text-sm text-muted">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
