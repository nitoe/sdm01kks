import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/berita")({
  beforeLoad: () => {
    throw redirect({ to: "/berita" });
  },
});
