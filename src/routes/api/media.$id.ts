import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { readMedia } = await import("@/lib/site/content.server");
        const media = await readMedia(params.id);
        if (!media) return new Response("Tidak ditemukan", { status: 404 });
        const copy = new ArrayBuffer(media.bytes.byteLength);
        new Uint8Array(copy).set(media.bytes);
        return new Response(copy, {
          headers: {
            "content-type": media.mime,
            "cache-control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
