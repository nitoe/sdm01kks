import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mark, useBootSite } from "@/components/site/shell";
import { uid, todayIso } from "@/lib/site/format";
import { uploadSiteMedia } from "@/lib/site/api";
import { useSiteStore } from "@/lib/site/store";
import type { Article, GalleryItem, Program, SiteContent } from "@/lib/site/types";

import { AdminGuruPanel } from "@/components/teachers/admin-panel";
import { changeAdminPassword, createAdminAccount, getAdminLoginHint, loginAdminAccount } from "@/lib/teachers/api";

const TABS = [
  "Identitas",
  "Beranda",
  "Pengumuman",
  "Berita",
  "Program",
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
    tabs: ["Identitas", "Beranda", "Pengumuman", "Berita", "Program", "Galeri", "Visi", "Tampilan"],
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
  Pengumuman: "Buka satu pengumuman untuk mengubahnya. Urutan atas tampil lebih dulu.",
  Berita: "Buka satu berita. Gambar dan isi tampil di halaman berita.",
  Program: "Kegiatan yang tampil di beranda dan halaman program.",
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
        {tab === "Pengumuman" ? <ArticlePanel kind="announcements" /> : null}
        {tab === "Berita" ? <ArticlePanel kind="news" /> : null}
        {tab === "Program" ? <ProgramPanel /> : null}
        {tab === "Galeri" ? <GalleryPanel /> : null}
        {tab === "Visi" ? <VisiPanel /> : null}
        {tab === "Tampilan" ? <VisibilityPanel /> : null}
        {tab === "Sandi" ? <AccountPanel /> : null}
        {tab === "Akun guru" ? <AdminGuruPanel /> : null}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  rows?: number;
}) {
  const className = "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3";
  return (
    <label className="block text-sm font-semibold text-muted">
      {label}
      {multiline ? (
        <textarea className={className} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          type={type}
          className={`${className} h-12`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function readFile(file: File) {
    if (file.size > 1_200_000) {
      setError("Gambar maksimal 1,2 MB.");
      return;
    }
    setBusy(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const data = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
      void uploadSiteMedia({ data: { mime: file.type || "image/jpeg", data } }).then((result) => {
        setBusy(false);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        onChange(result.url);
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-muted">{label}</p>
      {value ? (
        <img src={value} alt="" className="aspect-3/2 w-full max-w-sm rounded-xl object-cover" />
      ) : (
        <div className="grid h-32 max-w-sm place-items-center rounded-xl border border-dashed border-line text-sm text-muted">
          Belum ada gambar
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-11 cursor-pointer items-center rounded-full bg-pine px-4 text-sm font-semibold text-sheet">
          {busy ? "Mengunggah…" : value ? "Ganti gambar" : "Pilih gambar"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) readFile(file);
            }}
          />
        </label>
        {value ? (
          <button type="button" className="h-11 rounded-full px-4 text-sm font-semibold text-muted" onClick={() => onChange("")}>
            Lepas gambar
          </button>
        ) : null}
      </div>
      <p className="text-sm text-muted">JPG, PNG, WEBP, atau GIF. Maksimal 1,2 MB.</p>
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-muted">Atau tempel tautan gambar</summary>
        <div className="mt-2">
          <Field label="Tautan" value={value} onChange={onChange} />
        </div>
      </details>
      {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
    </div>
  );
}

const IDENTITY_GROUPS: { title: string; keys: Array<keyof SiteContent["identity"]> }[] = [
  { title: "Nama di situs", keys: ["name", "shortName", "tagline", "domain"] },
  {
    title: "Keterangan sekolah",
    keys: ["npsn", "accreditation", "founded", "skFounded", "operational", "principal", "foundation", "studentsNote", "hours"],
  },
  { title: "Yang dihubungi orang tua", keys: ["address", "phone", "email"] },
];

function IdentityPanel() {
  const identity = useSiteStore((state) => state.content.identity);
  const update = useSiteStore((state) => state.update);
  const set = (key: keyof SiteContent["identity"], value: string) => {
    update((content) => {
      content.identity[key] = value;
      return content;
    });
  };
  const labels: Record<keyof SiteContent["identity"], string> = {
    name: "Nama sekolah",
    shortName: "Nama singkat",
    tagline: "Kalimat pengantar",
    domain: "Domain",
    npsn: "NPSN",
    accreditation: "Akreditasi",
    founded: "Tanggal berdiri",
    skFounded: "SK pendirian",
    operational: "Tanggal operasional",
    principal: "Kepala sekolah",
    address: "Alamat",
    phone: "Telepon",
    email: "Surel",
    foundation: "Naungan",
    hours: "Waktu belajar",
    studentsNote: "Catatan peserta didik",
  };

  return (
    <div className="grid gap-8">
      <h2 className="font-serif text-3xl">Identitas</h2>
      {IDENTITY_GROUPS.map((group) => (
        <fieldset key={group.title} className="grid gap-4">
          <legend className="font-semibold text-pine">{group.title}</legend>
          {group.keys.map((key) => (
            <Field
              key={key}
              label={labels[key]}
              value={identity[key]}
              multiline={key === "address" || key === "tagline"}
              onChange={(value) => set(key, value)}
            />
          ))}
        </fieldset>
      ))}
    </div>
  );
}

function HeroPanel() {
  const hero = useSiteStore((state) => state.content.hero);
  const update = useSiteStore((state) => state.update);

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Beranda</h2>
      <p className="text-muted">Bagian atas halaman depan. Judul, paragraf, dan gambar utama berubah begitu tersimpan.</p>
      <Field label="Baris kecil di atas judul" value={hero.kicker} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, kicker: value } }))} />
      <Field label="Judul" value={hero.title} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, title: value } }))} />
      <Field label="Paragraf" value={hero.lead} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, lead: value } }))} />
      <ImageField
        label="Gambar utama"
        value={hero.image}
        onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, image: value } }))}
      />
      <Field label="Keterangan gambar" value={hero.imageCaption} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, imageCaption: value } }))} />
    </div>
  );
}

function VisiPanel() {
  const visi = useSiteStore((state) => state.content.visi);
  const misi = useSiteStore((state) => state.content.misi);
  const update = useSiteStore((state) => state.update);

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Visi dan misi</h2>
      <p className="text-muted">Tampil di halaman depan bila sakelarnya menyala di tab Tampilan.</p>
      <Field label="Visi" value={visi} multiline onChange={(value) => update((c) => ({ ...c, visi: value }))} />
      <Field
        label="Misi, satu baris satu butir"
        value={misi.join("\n")}
        multiline
        onChange={(value) =>
          update((c) => ({ ...c, misi: value.split("\n").map((line) => line.trim()).filter(Boolean) }))
        }
      />
    </div>
  );
}

function reorder<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  if (item === undefined) return list;
  copy.splice(next, 0, item);
  return copy;
}

function ArticlePanel({ kind }: { kind: "announcements" | "news" }) {
  const items = useSiteStore((state) => state.content[kind]);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);
  const title = kind === "news" ? "Berita" : "Pengumuman";

  const patch = (id: string, recipe: (item: Article) => void) => {
    update((content) => {
      const item = content[kind].find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid(kind);
    update((content) => {
      content[kind].unshift({
        id,
        date: todayIso(),
        title: "",
        excerpt: "",
        body: "",
        image: "",
        visible: false,
      });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">{title}</h2>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah {title.toLowerCase()}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">Belum ada. Tekan tambah untuk menulis yang pertama.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item, index) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{item.title || "Tanpa judul"}</span>
                    <span className="block text-sm text-muted">
                      {item.date || "Tanpa tanggal"} · {item.visible ? "Tampil untuk tamu" : "Tersembunyi"}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field label="Judul" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
                    <Field
                      label="Tanggal"
                      type="date"
                      value={item.date}
                      onChange={(value) => patch(item.id, (entry) => (entry.date = value))}
                    />
                    <Field
                      label="Ringkas, tampil di daftar"
                      value={item.excerpt}
                      multiline
                      onChange={(value) => patch(item.id, (entry) => (entry.excerpt = value))}
                    />
                    <ImageField
                      label="Gambar"
                      value={item.image ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.image = value))}
                    />
                    <Field
                      label="Isi lengkap"
                      value={item.body}
                      multiline
                      rows={10}
                      onChange={(value) => patch(item.id, (entry) => (entry.body = value))}
                    />
                    <ItemTools
                      index={index}
                      count={items.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content[kind] = reorder(content[kind], index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus tulisan ini?")) return;
                        update((content) => {
                          content[kind] = content[kind].filter((entry) => entry.id !== item.id);
                          return content;
                        });
                        setOpenId(null);
                      }}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgramPanel() {
  const programs = useSiteStore((state) => state.content.programs);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);
  const patch = (id: string, recipe: (item: Program) => void) => {
    update((content) => {
      const item = content.programs.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid("program");
    update((content) => {
      content.programs.unshift({ id, title: "", summary: "", visible: false });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Program</h2>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah program
        </button>
      </div>
      {programs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">Belum ada program.</p>
      ) : (
        <div className="grid gap-2">
          {programs.map((item, index) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.title || "Tanpa nama"}</span>
                  <span className="text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field label="Nama" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
                    <Field
                      label="Ringkas"
                      value={item.summary}
                      multiline
                      onChange={(value) => patch(item.id, (entry) => (entry.summary = value))}
                    />
                    <ItemTools
                      index={index}
                      count={programs.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content.programs = reorder(content.programs, index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus program ini?")) return;
                        update((content) => {
                          content.programs = content.programs.filter((entry) => entry.id !== item.id);
                          return content;
                        });
                        setOpenId(null);
                      }}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GalleryPanel() {
  const gallery = useSiteStore((state) => state.content.gallery);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);
  const patch = (id: string, recipe: (item: GalleryItem) => void) => {
    update((content) => {
      const item = content.gallery.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid("foto");
    update((content) => {
      content.gallery.unshift({ id, src: "", caption: "", visible: false });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Galeri</h2>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah foto
        </button>
      </div>
      {gallery.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">Belum ada foto.</p>
      ) : (
        <div className="grid gap-2">
          {gallery.map((item, index) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {item.src ? (
                    <img src={item.src} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-dashed border-line text-xs text-muted">
                      Foto
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.caption || "Tanpa keterangan"}</span>
                  <span className="text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <ImageField label="Gambar" value={item.src} onChange={(value) => patch(item.id, (entry) => (entry.src = value))} />
                    <Field label="Keterangan" value={item.caption} onChange={(value) => patch(item.id, (entry) => (entry.caption = value))} />
                    <ItemTools
                      index={index}
                      count={gallery.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content.gallery = reorder(content.gallery, index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus foto ini?")) return;
                        update((content) => {
                          content.gallery = content.gallery.filter((entry) => entry.id !== item.id);
                          return content;
                        });
                        setOpenId(null);
                      }}
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemTools({
  index,
  count,
  visible,
  onMove,
  onToggle,
  onRemove,
}: {
  index: number;
  count: number;
  visible: boolean;
  onMove: (dir: -1 | 1) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="h-10 rounded-full border border-line px-3 text-sm font-semibold disabled:opacity-40"
      >
        Naik
      </button>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onMove(1)}
        className="h-10 rounded-full border border-line px-3 text-sm font-semibold disabled:opacity-40"
      >
        Turun
      </button>
      <button type="button" onClick={onToggle} className="h-10 rounded-full border border-line px-3 text-sm font-semibold">
        {visible ? "Sembunyikan dari tamu" : "Tampilkan ke tamu"}
      </button>
      <button type="button" onClick={onRemove} className="h-10 rounded-full px-3 text-sm font-semibold text-pine-deep">
        Hapus
      </button>
    </div>
  );
}

function VisibilityPanel() {
  const show = useSiteStore((state) => state.content.show);
  const update = useSiteStore((state) => state.update);
  const resetContent = useSiteStore((state) => state.resetContent);
  const labels: Record<keyof SiteContent["show"], string> = {
    pengumuman: "Pengumuman di beranda",
    program: "Program",
    berita: "Berita",
    galeri: "Galeri",
    visi: "Visi dan misi",
  };

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Bagian halaman depan</h2>
      <p className="text-muted">Matikan sakelar untuk menyembunyikan bagian dari tamu. Identitas, beranda, dan kontak tetap tampil.</p>
      {(Object.keys(labels) as Array<keyof SiteContent["show"]>).map((key) => (
        <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
          <span className="font-medium">{labels[key]}</span>
          <input
            type="checkbox"
            className="size-5"
            checked={show[key]}
            onChange={(event) =>
              update((content) => {
                content.show[key] = event.target.checked;
                return content;
              })
            }
          />
        </label>
      ))}
      <button
        type="button"
        className="mt-4 h-11 justify-self-start font-semibold text-muted"
        onClick={() => {
          if (window.confirm("Kembalikan seluruh isi ke naskah awal? Perubahan yang sudah tersimpan akan tertimpa.")) {
            resetContent();
          }
        }}
      >
        Kembalikan naskah awal
      </button>
    </div>
  );
}

function AccountPanel() {
  const adminEmail = useSiteStore((state) => state.adminEmail);
  const usingDefaultPassword = useSiteStore((state) => state.usingDefaultPassword);
  const markAdmin = useSiteStore((state) => state.markAdmin);
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [added, setAdded] = useState("");

  return (
    <div className="grid gap-10">
      <form
        className="grid max-w-md gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (next.trim().length < 6) {
            setMessage("Sandi minimal 6 karakter.");
            return;
          }
          if (next !== again) {
            setMessage("Ulangan sandi tidak sama.");
            return;
          }
          void changeAdminPassword({ data: { next: next.trim() } }).then((result) => {
            setMessage(result.ok ? (result.message ?? "Sandi diperbarui.") : result.message);
            if (result.ok) {
              markAdmin(adminEmail, false);
              setNext("");
              setAgain("");
            }
          });
        }}
      >
        <h2 className="font-serif text-3xl">Sandi admin</h2>
        <p className="text-muted">
          Akun yang sedang masuk: <span className="font-semibold text-ink">{adminEmail || "admin"}</span>.
          {usingDefaultPassword ? " Sandi ini masih sandi awal." : ""}
        </p>
        <Field label="Sandi baru" value={next} onChange={setNext} type="password" />
        <Field label="Ulangi sandi" value={again} onChange={setAgain} type="password" />
        {message ? <p className="text-sm">{message}</p> : null}
        <button type="submit" className="h-12 rounded-full bg-pine font-semibold text-sheet">
          Simpan sandi
        </button>
      </form>

      <form
        className="grid max-w-md gap-4 border-t border-line pt-8"
        onSubmit={(event) => {
          event.preventDefault();
          setAdded("");
          void createAdminAccount({ data: { email, name, password } }).then((result) => {
            setAdded(result.ok ? (result.message ?? "Akun ditambahkan.") : result.message);
            if (result.ok) {
              setEmail("");
              setName("");
              setPassword("");
            }
          });
        }}
      >
        <h2 className="font-serif text-3xl">Admin lain</h2>
        <p className="text-muted">Tambah orang yang boleh mengubah halaman depan, artikel, dan gambar.</p>
        <Field label="Nama" value={name} onChange={setName} />
        <Field label="Surel" value={email} onChange={setEmail} />
        <Field label="Sandi" value={password} onChange={setPassword} type="password" />
        {added ? <p className="text-sm">{added}</p> : null}
        <button type="submit" className="h-12 rounded-full border border-line font-semibold">
          Tambah admin
        </button>
      </form>
    </div>
  );
}
