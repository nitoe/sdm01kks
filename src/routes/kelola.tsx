import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Mark, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

import { AchievementPanel } from "@/components/site/achievement-panel";
import {
  Field,
  ImageField,
  IdentityPanel,
  HeroPanel,
  VisiPanel,
} from "@/components/site/kelola-panels-a1";
import { ArticlePanel } from "@/components/site/kelola-panels-a2";
import { ProgramPanel } from "@/components/site/kelola-panels-program";
import { GalleryPanel } from "@/components/site/kelola-panels-b2a";
import { VisibilityPanel, AccountPanel } from "@/components/site/kelola-panels-b2b";
import { WelcomePanel, ValuesPanel } from "@/components/site/kelola-panels-welcome";
import { StaffPanel } from "@/components/site/kelola-panels-staff";
import { AccountManagerPanel } from "@/components/site/kelola-panels-accounts";
import { getAdminAccount, loginAdminAccount } from "@/lib/teachers/api";

const TABS = [
  "Identitas",
  "Manajerial",
  "Beranda",
  "Sambutan",
  "Nilai",
  "Pengumuman",
  "Berita",
  "Program",
  "Prestasi",
  "Galeri",
  "Visi",
  "Tampilan",
  "Sandi",
  "Akun",
] as const;

export type KelolaTab = (typeof TABS)[number];

function isKelolaTab(value: unknown): value is KelolaTab {
  return typeof value === "string" && (TABS as readonly string[]).includes(value);
}

export const Route = createFileRoute("/kelola")({
  validateSearch: (search: Record<string, unknown>): { tab?: KelolaTab } =>
    isKelolaTab(search.tab) ? { tab: search.tab } : {},
  component: KelolaPage,
});

const GROUPS: { id: string; label: string; tabs: Tab[] }[] = [
  {
    id: "sekolah",
    label: "Sekolah",
    tabs: ["Identitas", "Manajerial"],
  },
  {
    id: "depan",
    label: "Halaman depan",
    tabs: ["Beranda", "Sambutan", "Nilai", "Visi", "Tampilan"],
  },
  {
    id: "informasi",
    label: "Informasi",
    tabs: ["Pengumuman", "Berita"],
  },
  {
    id: "kegiatan",
    label: "Kegiatan",
    tabs: ["Program", "Prestasi", "Galeri"],
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    tabs: ["Sandi", "Akun"],
  },
];

/** Tab yang hanya boleh dibuka admin. Operator tidak melihatnya. */
const ADMIN_ONLY_TABS: readonly Tab[] = ["Akun"];

type Tab = KelolaTab;

const TAB_HELP: Record<Tab, string> = {
  Identitas: "Nama, NPSN, alamat, dan telepon. Muncul di kepala situs, halaman Profil, dan kontak.",
  Manajerial:
    "Kepala sekolah, wakil, dan guru di halaman Manajerial. Nama, jabatan, foto, dan tugas.",
  Beranda: "Judul besar dan gambar di bagian atas halaman depan.",
  Sambutan: "Foto dan kalimat kepala sekolah, tepat di bawah bagian atas.",
  Nilai: "Kartu di bawah sambutan. Tiap kartu punya judul, kalimat, dan gambar.",
  Pengumuman:
    "Isi jendela yang muncul tiap kunjungan. Halaman Pengumuman tetap bisa dibuka kapan saja.",
  Berita: "Buka satu berita. Gambar dan isi tampil di halaman berita.",
  Program:
    "Tiga tab: intrakurikuler, kokurikuler, ekstrakurikuler. Tambah, aktifkan, nonaktifkan, dan edit kegiatan beserta gambar.",
  Prestasi: "Prestasi siswa: judul, nama, kategori, tahun, tingkat, dan hasil.",
  Galeri: "Foto yang tampil di halaman Galeri.",
  Visi: "Sejarah, visi, dan misi untuk halaman Profil. Misi: satu baris satu butir.",
  Tampilan: "Sakelar menampilkan atau menyembunyikan bagian di beranda.",
  Sandi: "Ganti sandi akun yang sedang dipakai.",
  Akun: "Tambah, ubah peran, atau hapus akun admin dan operator.",
};

function tabTitle(tab: Tab): string {
  if (tab === "Visi") return "Visi, misi, dan sejarah";
  return tab;
}

function KelolaPage() {
  useBootSite();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab ?? "Identitas";
  const admin = useSiteStore((state) => state.admin);
  const role = useSiteStore((state) => state.role);
  const markAdmin = useSiteStore((state) => state.markAdmin);
  const clearAdmin = useSiteStore((state) => state.clearAdmin);
  const identity = useSiteStore((state) => state.content.identity);
  const [menuOpen, setMenuOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!admin) {
      void navigate({ to: "/masuk" });
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (role !== "admin" && ADMIN_ONLY_TABS.includes(tab)) {
      void navigate({ to: "/kelola", search: { tab: "Identitas" } });
    }
  }, [role, tab, navigate]);

  if (!admin) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-5">
        <p className="text-muted">Mengalihkan ke halaman masuk…</p>
      </div>
    );
  }

  const allowed = (item: Tab) => role === "admin" || !ADMIN_ONLY_TABS.includes(item);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-sheet">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Mark className="size-9" />
            <span className="font-semibold text-ink">{identity.shortName}</span>
          </Link>
          <span className="text-sm text-muted">Panel kelola</span>
          <button
            type="button"
            className="ml-auto inline-flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu tab"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link to="/" className="hidden text-sm font-semibold text-pine lg:inline">
            Lihat situs
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[240px_1fr]">
        <aside className={`${menuOpen ? "block" : "hidden"} lg:block`}>
          <nav className="grid gap-4">
            {GROUPS.map((group) => {
              const visibleTabs = group.tabs.filter(allowed);
              if (!visibleTabs.length) return null;
              const open = groupOpen === group.id || visibleTabs.includes(tab);
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left text-xs font-semibold tracking-wide text-muted uppercase"
                    onClick={() => setGroupOpen((v) => (v === group.id ? null : group.id))}
                  >
                    {group.label}
                    <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open ? (
                    <ul className="mt-2 grid gap-1">
                      {visibleTabs.map((item) => (
                        <li key={item}>
                          <Link
                            to="/kelola"
                            search={{ tab: item }}
                            className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                              tab === item ? "bg-mint text-pine" : "text-ink hover:bg-paper"
                            }`}
                            onClick={() => setMenuOpen(false)}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <div>
          <p className="text-sm text-muted">{TAB_HELP[tab]}</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">{tabTitle(tab)}</h1>
          <div className="mt-6">
            {tab === "Identitas" ? <IdentityPanel /> : null}
            {tab === "Manajerial" ? <StaffPanel /> : null}
            {tab === "Beranda" ? <HeroPanel /> : null}
            {tab === "Sambutan" ? <WelcomePanel /> : null}
            {tab === "Nilai" ? <ValuesPanel /> : null}
            {tab === "Pengumuman" ? <ArticlePanel kind="announcements" /> : null}
            {tab === "Berita" ? <ArticlePanel kind="news" /> : null}
            {tab === "Program" ? <ProgramPanel /> : null}
            {tab === "Prestasi" ? <AchievementPanel /> : null}
            {tab === "Galeri" ? <GalleryPanel /> : null}
            {tab === "Visi" ? <VisiPanel /> : null}
            {tab === "Tampilan" ? <VisibilityPanel /> : null}
            {tab === "Sandi" ? <AccountPanel /> : null}
            {tab === "Akun" && role === "admin" ? <AccountManagerPanel /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
