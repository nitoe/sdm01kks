import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/berita/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/berita/$id", params: { id: params.id } });
  },
});
