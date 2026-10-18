import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/kontak")({
  beforeLoad: () => {
    throw redirect({ to: "/kontak" });
  },
});
