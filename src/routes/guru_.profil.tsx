import { createFileRoute } from "@tanstack/react-router";
import { GuruProfil } from "@/components/teachers/guru-profil";

export const Route = createFileRoute("/guru_/profil")({
  head: () => ({
    meta: [
      { title: "Data guru · SD Muhammadiyah 01 Kukusan" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GuruProfil,
});
