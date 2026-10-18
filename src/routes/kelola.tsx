import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Mark, useBootSite } from "@/components/site/shell";
import { useSiteStore } from "@/lib/site/store";

import { AdminGuruPanel } from "@/components/teachers/admin-panel";
import { AchievementPanel } from "@/components/site/achievement-panel";
import {
  Field,
  ImageField,
  IdentityPanel,
  HeroPanel,
  VisiPanel,
} from "@/components/site/kelola-panels-a1";
import { ArticlePanel } from "@/components/site/kelola-panels-a2";
import { ProgramPanel } from "@/components/site/kelola-panels-b1";
import { GalleryPanel } from "@/components/site/kelola-panels-b2a";
import { VisibilityPanel, AccountPanel } from "@/components/site/kelola-panels-b2b";
import { WelcomePanel, ValuesPanel } from "@/components/site/kelola-panels-welcome";
import { StaffPanel } from "@/components/site/kelola-panels-staff";
import { getAdminLoginHint, loginAdminAccount } from "@/lib/teachers/api";

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
  "Akun guru",
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

const GROUPS: { label: string; tabs: Tab[] }[] = [
  {
    label: "Konten situs",
    tabs: [
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
    ],
  },
  {
    label: "Guru",
    tabs: ["Akun guru"],
  },
  {
    label: "Pengaturan",
    tabs: ["Sandi"],
  },
];

type Tab = KelolaTab;

const TAB_HELP: Record<Tab, string> = {
  Identitas: "Nama, NPSN, alamat, dan telepon. Muncul di kepala situs, profil, dan kontak.",
  Manajerial: "Kepala sekolah, wakil, dan guru yang tampil di halaman Profil. Nama, jabatan, foto, dan tugas.",
  Beranda: "Judul besar dan gambar di bagian atas halaman depan.",
  Sambutan: "Foto dan kalimat kepala sekolah, tepat di bawah bagian atas.",
  Nilai: "Kartu di bawah sambutan. Tiap kartu punya judul, kalimat, dan gambar.",
  Pengumuman: "Isi jendela yang muncul tiap kunjungan. Halaman Pengumuman tetap bisa dibuka kapan saja.",
  Berita: "Buka satu berita. Gambar dan isi tampil di halaman berita.",
  Program:
    "Tiga kelompok program. Judul, uraian, dan gambar tiap kelompok bisa diubah. Kegiatan di dalamnya tetap punya halaman sendiri.",
  Prestasi: "Catatan lomba siswa. Filter di halaman prestasi memakai jenis, tahun, dan tingkat.",
  Galeri: "Foto suasana sekolah. Pilih berkas dari komputer.",
  Visi: "Visi satu paragraf. Misi diisi satu baris untuk satu butir.",
  Tampilan: "Sembunyikan bagian dari tamu tanpa menghapus isinya.",
  Sandi: "Ganti sandi akun ini, atau tambah admin lain.",
  "Akun guru": "Setujui guru, atur sandi, dan cadangkan data.",
};

function tabLabel(tab: Tab) {
  return tab === "Visi" ? "Visi dan misi" : tab;
}

function KelolaPage() {
  useBootSite();
  const ready = useSiteStore((state) => state.ready);
  const admin = useSiteStore((state) => state.admin);
  return (
    <div className="min-h-screen bg-paper">
      {!ready ? (
        <p className="p-8 text-muted">Memuat panel…</p>
      ) : admin ? (
        <Editor />
      ) : (
        <div className="mx-auto max-w-md px-5 py-12">
          <Gate />
        </div>
      )}
    </div>
  );
}

function Gate() {
  const markAdmin = useSiteStore((state) => state.markAdmin);
  const [email, setEmail] = useState("admin@sdmuhammadiyah01kks.sch.id");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showDefault, setShowDefault] = useState(false);

  useEffect(() => {
    void getAdminLoginHint().then((hint) => {
      if (hint && "usingDefaultPassword" in hint) setShowDefault(hint.usingDefaultPassword);
    });
  }, []);

  return (
    <form
      className="rounded-card border border-line bg-sheet p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        void loginAdminAccount({ data: { email, password } }).then((result) => {
          setBusy(false);
          if (!result.ok) {
            setError(result.message);
            return;
          }
          markAdmin(email.trim().toLowerCase(), password === "Kukusan-1981");
        });
      }}
    >
      <h1 className="font-serif text-3xl">Masuk sebagai admin</h1>
      <p className="mt-3 text-muted">
        Tamu tetap melihat situs tanpa akun. Perubahan identitas, beranda, pengumuman, artikel, program, dan galeri
        tersimpan di basis data.
      </p>
      <label className="mt-6 block text-sm font-semibold text-muted">
        Surel
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
          autoComplete="username"
        />
      </label>
      <label className="mt-4 block text-sm font-semibold text-muted">
        Sandi
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-pine-deep">{error}</p> : null}
      <button type="submit" disabled={busy} className="mt-6 h-12 w-full rounded-full bg-pine font-semibold text-sheet">
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
      {showDefault ? (
        <p className="mt-4 text-sm text-muted">
          Akun awal: <span className="font-semibold text-ink">admin@sdmuhammadiyah01kks.sch.id</span>, sandi{" "}
          <span className="font-semibold text-ink">Kukusan-1981</span>. Ganti setelah masuk, lewat tab Sandi.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">Sandi awal sudah diganti.</p>
      )}
    </form>
  );
}

function Editor() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "Beranda");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const saving = useSiteStore((state) => state.saving);
  const saveError = useSiteStore((state) => state.saveError);
  const source = useSiteStore((state) => state.source);
  const lock = useSiteStore((state) => state.lock);

  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  function choose(next: Tab) {
    setTab(next);
    setSidebarOpen(false);
    void navigate({ to: "/kelola", search: next === "Beranda" ? {} : { tab: next }, replace: true });
  }

  const status = saveError
    ? saveError
    : saving
      ? "Menyimpan…"
      : source === "basis"
        ? "Tersimpan"
        : "Siap diubah";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-sheet transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-4">
          <Mark className="size-9" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">Panel kelola</p>
            <p className="truncate text-xs text-muted">SDM 01 Kukusan</p>
          </div>
          <button
            type="button"
            className="ml-auto grid size-9 place-items-center rounded-lg lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2 text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</p>
              <ul className="grid gap-0.5">
                {group.tabs.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => choose(item)}
                      className={
                        tab === item
                          ? "flex w-full items-center rounded-xl bg-pine px-3 py-2.5 text-left text-sm font-semibold text-sheet"
                          : "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-mint"
                      }
                    >
                      {tabLabel(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <div className="mb-2 flex items-center justify-between gap-2 px-2">
            <span
              className={
                saveError
                  ? "inline-flex h-7 items-center rounded-full bg-brass-soft px-2.5 text-xs font-semibold text-pine-deep"
                  : "inline-flex h-7 items-center rounded-full bg-mint px-2.5 text-xs font-semibold text-pine"
              }
            >
              {status}
            </span>
          </div>
          <div className="grid gap-1">
            <Link
              to="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-mint hover:text-ink"
            >
              Lihat situs
            </Link>
            <button
              type="button"
              onClick={lock}
              className="rounded-xl px-3 py-2 text-left text-sm font-medium text-muted hover:bg-mint hover:text-ink"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-sheet/95 px-4 py-3 backdrop-blur-md lg:px-6">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl">{tabLabel(tab)}</h1>
            <p className="truncate text-sm text-muted">{TAB_HELP[tab]}</p>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <section className="rounded-card border border-line bg-sheet p-5">
            {tab === "Identitas" ? <IdentityPanel /> : null}
            {tab === "Manajerial" ? <StaffPanel /> : null}
            {tab === "Beranda" ? <HeroPanel /> : null}
            {tab === "Sambutan" ? <WelcomePanel /> : null}
            {tab === "Nilai" ? <ValuesPanel /> : null}
            {tab === "Pengumuman" ? <ArticlePanel kind="announcements" /> : null}
            {tab === "Berita" ? <ArticlePanel kind="news" /> : null}
            {tab === "Program" ? <ProgramPanel /> : null}
            {tab === "Prestasi" ? <AchievementPanel Field={Field} ImageField={ImageField} /> : null}
            {tab === "Galeri" ? <GalleryPanel /> : null}
            {tab === "Visi" ? <VisiPanel /> : null}
            {tab === "Tampilan" ? <VisibilityPanel /> : null}
            {tab === "Sandi" ? <AccountPanel /> : null}
            {tab === "Akun guru" ? <AdminGuruPanel /> : null}
          </section>
        </main>
      </div>
    </div>
  );
}
