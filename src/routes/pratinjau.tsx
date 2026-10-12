import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/home-page";
import { previewHead } from "@/lib/site/preview-head";

export const Route = createFileRoute("/pratinjau")({
  head: previewHead,
  component: HomePage,
});