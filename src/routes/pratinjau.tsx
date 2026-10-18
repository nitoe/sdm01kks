import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pratinjau")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
