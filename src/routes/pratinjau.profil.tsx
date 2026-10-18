import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/profil")({
  beforeLoad: () => {
    throw redirect({ to: "/profil" });
  },
});
