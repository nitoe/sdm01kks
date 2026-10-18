import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau/program")({
  beforeLoad: () => {
    throw redirect({ to: "/program" });
  },
});
