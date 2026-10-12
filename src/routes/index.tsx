import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "@/components/site/holding";

export const Route = createFileRoute("/")({
  component: HoldingPage,
});
