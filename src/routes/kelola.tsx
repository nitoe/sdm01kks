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
import { PublishPanel } from "@/components/site/kelola-panels-publish";
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
  "Publikasi",
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
    tabs: ["Sandi", "Akun", "Publikasi"],
  },
];

/** Tab yang hanya boleh dibuka admin. Operator tidak melihatnya. */
const ADMIN_ONLY_TABS: readonly Tab[] = ["Akun", "Publikasi"];

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
    "Tiga tab: intrakurikuler, kokurikuler, ekstrakurikuler. Tambah, aktifkan, nonaktifkan, dan edit kegiatan beserta gambar dan kontaknya.",
  Prestasi: "Catatan lomba siswa. Filter di halaman prestasi memakai jenis, tahun, dan tingkat.",
  Galeri: "Foto suasana sekolah. Pilih berkas dari komputer.",
  Visi: "Sejarah, visi, dan misi untuk halaman Profil. Misi: satu baris satu butir.",
  Tampilan: "Sembunyikan bagian dari tamu tanpa menghapus isinya.",
  Sandi: "Ganti sandi akun yang sedang dipakai.",
  Akun: "Tambah, ubah, atau hapus akun operator dan admin. Hanya admin yang melihat tab ini.",
  Publikasi:
    "Buka situs untuk pengunjung. Sebelum Publish, pengunjung hanya melihat halaman 404. Hanya admin.",
};

function tabLabel(tab: Tab) {
  if (tab === "Visi") return "Visi, misi, dan sejarah";
  if (tab === "Akun") return "Kelola akun";
  if (tab === "Publikasi") return "Publikasi situs";
  return tab;
}

function groupOf(tab: Tab): string {
  return GROUPS.find((g) => g.tabs.includes(tab))?.id ?? "sekolah";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="rounded-card border border-line bg-sheet p-6"
      autoComplete="off"
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
          void getAdminAccount().then((status) => {
            if (!("signedIn" in status) || !status.signedIn || !status.role) {
              setError("Gagal membaca akun. Coba masuk lagi.");
              return;
            }
            markAdmin(email.trim().toLowerCase(), status.usingDefaultPassword === true, status.role);
          });
        });
      }}
    >
      <h1 className="font-serif text-3xl">Masuk panel kelola</h1>
      <p className="mt-3 text-muted">
        Untuk admin dan operator sekolah. Tamu tetap melihat situs tanpa akun. Perubahan identitas,
        beranda, pengumuman, artikel, program, dan galeri tersimpan di basis data.
      </p>
      <label className="mt-6 block text-sm font-semibold text-muted">
        Surel
        <input
          type="email"
          name="panel-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>
      <label className="mt-4 block text-sm font-semibold text-muted">
        Sandi
        <input
          type="password"
          name="panel-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
          autoComplete="new-password"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-pine-deep">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 h-12 w-full rounded-full bg-pine font-semibold text-sheet"
      >
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
      <p className="mt-4 text-sm text-muted">
        Lupa sandi? Hubungi pengelola situs.{" "}
        <Link to="/" className="font-semibold text-pine hover:underline">
          Kembali ke beranda
        </Link>
      </p>
    </form>
  );
}

function Editor() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const role = useSiteStore((state) => state.role);
  const isAdminRole = role === "admin";
  const allowed = (item: Tab) => isAdminRole || !ADMIN_ONLY_TABS.includes(item);
  const firstTab: Tab = search.tab && allowed(search.tab) ? search.tab : "Beranda";
  const [tab, setTab] = useState<Tab>(firstTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set([groupOf(firstTab)]));
  const saving = useSiteStore((state) => state.saving);
  const saveError = useSiteStore((state) => state.saveError);
  const source = useSiteStore((state) => state.source);
  const lock = useSiteStore((state) => state.lock);

  useEffect(() => {
    if (search.tab && allowed(search.tab)) setTab(search.tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.tab, isAdminRole]);

  function choose(next: Tab) {
    if (!allowed(next)) return;
    setTab(next);
    setSidebarOpen(false);
    setOpenGroups((prev) => {
      const nextSet = new Set(prev);
      nextSet.add(groupOf(next));
      return nextSet;
    });
    void navigate({
      to: "/kelola",
      search: next === "Beranda" ? {} : { tab: next },
      replace: true,
    });
  }

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleLogout() {
    // Hapus sesi dulu, lalu hard redirect agar tidak tertahan di form login /kelola
    // dan pengunjung melihat halaman 404 "sedang dibangun".
    await lock();
    window.location.replace("/");
  }

  const status = saveError
    ? saveError
    : saving
      ? "Menyimpan…"
      : source === "basis"
        ? "Tersimpan"
        : "Siap diubah";

  return (
    <div className="min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-line bg-sheet transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-4">
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

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {GROUPS.map((group) => {
            const visibleTabs = group.tabs.filter(allowed);
            const open = openGroups.has(group.id);
            const hasActive = group.tabs.includes(tab);
            return (
              <div key={group.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                    hasActive ? "text-pine" : "text-ink"
                  } hover:bg-mint/60`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted transition-transform ${
                      open ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
                {open ? (
                  <ul className="mt-0.5 grid gap-0.5 pl-2">
                    {visibleTabs.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => choose(item)}
                          className={
                            tab === item
                              ? "flex w-full items-center rounded-lg bg-pine px-3 py-2 text-left text-sm font-semibold text-sheet"
                              : "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-mint"
                          }
                        >
                          {tabLabel(item)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
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
              onClick={() => void handleLogout()}
              className="rounded-xl px-3 py-2 text-left text-sm font-medium text-muted hover:bg-mint hover:text-ink"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-col lg:pl-64">
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
            {tab === "Akun" && isAdminRole ? <AccountManagerPanel /> : null}
            {tab === "Publikasi" && isAdminRole ? <PublishPanel /> : null}
          </section>
        </main>
      </div>
    </div>
  );
}
