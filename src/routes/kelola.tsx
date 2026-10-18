import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { getAdminLoginHint, loginAdminAccount } from "@/lib/teachers/api";

const TABS = [
  "Identitas",
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
    label: "Tampil di halaman depan",
    tabs: ["Identitas", "Beranda", "Sambutan", "Nilai", "Pengumuman", "Berita", "Program", "Prestasi", "Galeri", "Visi", "Tampilan"],
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
  Beranda: "Judul besar dan gambar di bagian atas halaman depan.",
  Sambutan: "Foto dan kalimat kepala sekolah, tepat di bawah bagian atas.",
  Nilai: "Kartu di bawah sambutan. Tiap kartu punya judul, kalimat, dan gambar.",
  Pengumuman: "Isi jendela yang muncul tiap kunjungan. Halaman Pengumuman tetap bisa dibuka kapan saja.",
  Berita: "Buka satu berita. Gambar dan isi tampil di halaman berita.",
  Program: "Tiga kelompok program. Judul, uraian, dan gambar tiap kelompok bisa diubah. Kegiatan di dalamnya tetap punya halaman sendiri.",
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
      <header className="border-b border-line bg-sheet">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
          <Mark className="size-10" />
          <div>
            <p className="font-serif text-xl">Panel kelola</p>
            <p className="text-sm text-muted">SD Muhammadiyah 01 Kukusan</p>
          </div>
          <div className="ml-auto flex gap-4">
            <Link to="/" className="text-sm font-semibold text-muted">
              Halaman depan
            </Link>
            <Link to="/guru" className="text-sm font-semibold text-pine">
              Akun guru
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        {!ready ? <p className="text-muted">Memuat panel…</p> : admin ? <Editor /> : <Gate />}
      </div>
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
      className="mx-auto max-w-md rounded-card border border-line bg-sheet p-6"
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
  const saving = useSiteStore((state) => state.saving);
  const saveError = useSiteStore((state) => state.saveError);
  const source = useSiteStore((state) => state.source);
  const lock = useSiteStore((state) => state.lock);

  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  function choose(next: Tab) {
    setTab(next);
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
    <div className="grid gap-4">
      <div className="sticky top-0 z-20 grid gap-3 rounded-card border border-line bg-paper/95 p-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <p
            className={
              saveError
                ? "inline-flex h-9 items-center rounded-full bg-brass-soft px-3 text-sm font-semibold text-pine-deep"
                : "inline-flex h-9 items-center rounded-full bg-sheet px-3 text-sm font-semibold text-pine"
            }
          >
            {status}
          </p>
          <p className="text-sm text-muted">{TAB_HELP[tab]}</p>
          <button type="button" onClick={lock} className="ml-auto h-9 px-2 text-sm font-semibold text-muted">
            Keluar
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex shrink-0 gap-2">
              {group.tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => choose(item)}
                  className={
                    tab === item
                      ? "h-10 shrink-0 rounded-full bg-pine px-4 text-sm font-semibold text-sheet"
                      : "h-10 shrink-0 rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink"
                  }
                >
                  {tabLabel(item)}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <section className="rounded-card border border-line bg-sheet p-5">
        {tab === "Identitas" ? <IdentityPanel /> : null}
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
    </div>
  );
}
