import { createFileRoute } from "@tanstack/react-router";
import { GuruAuth } from "@/components/teachers/guru-auth";

export const Route = createFileRoute("/guru")({
  head: () => ({
    meta: [
      { title: "Akun guru · SD Muhammadiyah 01 Kukusan" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuruAuth,
});
