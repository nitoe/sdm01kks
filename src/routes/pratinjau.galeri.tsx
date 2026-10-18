import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/galeri")({
  beforeLoad: () => {
    throw redirect({ to: "/galeri" });
  },
});
