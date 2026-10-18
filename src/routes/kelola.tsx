import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mark, useBootSite } from "@/components/site/shell";
import { uid, todayIso } from "@/lib/site/format";
import { uploadSiteMedia } from "@/lib/site/api";
import { useSiteStore } from "@/lib/site/store";
import type { Article, GalleryItem, Program, SiteContent } from "@/lib/site/types";

import { AdminGuruPanel } from "@/components/teachers/admin-panel";
import { changeAdminPassword, createAdminAccount, getAdminLoginHint, loginAdminAccount } from "@/lib/teachers/api";

export const Route = createFileRoute("/kelola")({
  component: KelolaPage,
});

const GROUPS: { label: string; note: string; tabs: Tab[] }[] = [
  {
    label: "Tampil di halaman depan",
    note: "Tersimpan di basis data. Pengunjung lain membaca isi yang sama.",
    tabs: ["Identitas", "Beranda", "Pengumuman", "Berita", "Program", "Galeri", "Visi", "Tampilan"],
  },
  {
    label: "Guru",
    note: "Akun, persetujuan, dan cadangan.",
    tabs: ["Akun guru"],
  },
  {
    label: "Pengaturan",
    note: "Akun yang boleh mengubah situs.",
    tabs: ["Sandi"],
  },
];

type Tab =
  | "Identitas"
  | "Beranda"
  | "Pengumuman"
  | "Berita"
  | "Program"
  | "Galeri"
  | "Visi"
  | "Tampilan"
  | "Sandi"
  | "Akun guru";

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
  const [tab, setTab] = useState<Tab>("Beranda");
  const source = useSiteStore((state) => state.source);
  const saving = useSiteStore((state) => state.saving);
  const saveError = useSiteStore((state) => state.saveError);
  const lock = useSiteStore((state) => state.lock);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <p className="px-3 text-sm text-muted">
          Sumber: {source === "basis" ? "basis data" : "naskah awal"}
          {saving ? " · menyimpan…" : ""}
        </p>
        {saveError ? <p className="mt-2 px-3 text-sm text-pine-deep">{saveError}</p> : null}
        {GROUPS.map((group) => (
          <div key={group.label} className="mt-5">
            <p className="px-3 text-xs font-semibold tracking-wide text-pine uppercase">{group.label}</p>
            <p className="mt-1 px-3 text-sm text-muted">{group.note}</p>
            <nav className="mt-2 grid gap-1">
              {group.tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={
                    tab === item
                      ? "h-11 rounded-xl bg-pine px-3 text-left font-semibold text-sheet"
                      : "h-11 rounded-xl px-3 text-left font-medium text-ink hover:bg-sheet"
                  }
                >
                  {item === "Visi" ? "Visi dan misi" : item}
                </button>
              ))}
            </nav>
          </div>
        ))}
        <button type="button" onClick={lock} className="mt-4 h-11 px-3 text-sm font-semibold text-muted">
          Keluar
        </button>
      </aside>
      <section className="rounded-card border border-line bg-sheet p-5 lg:col-span-9">
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const className = "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3";
  return (
    <label className="block text-sm font-semibold text-muted">
      {label}
      {multiline ? (
        <textarea className={className} rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
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

  return (
    <div className="grid gap-2">
      <Field label={`${label} — tautan`} value={value} onChange={onChange} />
      <label className="text-sm font-semibold text-muted">
        {busy ? "Mengunggah…" : "atau pilih berkas (maks. 1,2 MB)"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm font-normal"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
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
          }}
        />
      </label>
      {value ? <img src={value} alt="" className="aspect-3/2 max-w-xs rounded-xl object-cover" /> : null}
      {error ? <p className="text-sm text-pine-deep">{error}</p> : null}
    </div>
  );
}

function IdentityPanel() {
  const identity = useSiteStore((state) => state.content.identity);
  const update = useSiteStore((state) => state.update);
  const set = (key: keyof SiteContent["identity"], value: string) => {
    update((content) => {
      content.identity[key] = value;
      return content;
    });
  };
  const keys = Object.keys(identity) as Array<keyof SiteContent["identity"]>;
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
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Identitas</h2>
      <p className="text-muted">Nama, NPSN, alamat, telepon, dan keterangan lain di halaman depan mengikuti isian ini.</p>
      {keys.map((key) => (
        <Field
          key={key}
          label={labels[key]}
          value={identity[key]}
          multiline={key === "address" || key === "tagline"}
          onChange={(value) => set(key, value)}
        />
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

function ArticlePanel({ kind }: { kind: "announcements" | "news" }) {
  const items = useSiteStore((state) => state.content[kind]);
  const update = useSiteStore((state) => state.update);
  const title = kind === "news" ? "Berita" : "Pengumuman";

  const patch = (id: string, recipe: (item: Article) => void) => {
    update((content) => {
      const item = content[kind].find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">{title}</h2>
        <button
          type="button"
          className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
          onClick={() =>
            update((content) => {
              content[kind].unshift({
                id: uid(kind),
                date: todayIso(),
                title: "Judul baru",
                excerpt: "",
                body: "",
                image: "",
                visible: true,
              });
              return content;
            })
          }
        >
          Tambah
        </button>
      </div>
      <p className="text-muted">Artikel dan pengumuman ini tampil di halaman depan. Gambar bisa diunggah atau diisi dengan tautan.</p>
      {items.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-xl border border-line p-4">
          <Field label="Judul" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
          <Field label="Tanggal" value={item.date} onChange={(value) => patch(item.id, (entry) => (entry.date = value))} />
          <Field label="Ringkas" value={item.excerpt} multiline onChange={(value) => patch(item.id, (entry) => (entry.excerpt = value))} />
          <ImageField
            label="Gambar"
            value={item.image ?? ""}
            onChange={(value) => patch(item.id, (entry) => (entry.image = value))}
          />
          <Field label="Isi" value={item.body} multiline onChange={(value) => patch(item.id, (entry) => (entry.body = value))} />
          <div className="flex gap-3">
            <button type="button" className="h-11 px-2 font-semibold text-pine" onClick={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}>
              {item.visible ? "Sembunyikan" : "Tampilkan"}
            </button>
            <button
              type="button"
              className="h-11 px-2 font-semibold text-muted"
              onClick={() =>
                update((content) => {
                  content[kind] = content[kind].filter((entry) => entry.id !== item.id);
                  return content;
                })
              }
            >
              Hapus
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProgramPanel() {
  const programs = useSiteStore((state) => state.content.programs);
  const update = useSiteStore((state) => state.update);
  const patch = (id: string, recipe: (item: Program) => void) => {
    update((content) => {
      const item = content.programs.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Program</h2>
        <button
          type="button"
          className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
          onClick={() =>
            update((content) => {
              content.programs.push({ id: uid("program"), title: "Program baru", summary: "", visible: true });
              return content;
            })
          }
        >
          Tambah
        </button>
      </div>
      <p className="text-muted">Hanya untuk halaman depan dan halaman program.</p>
      {programs.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-xl border border-line p-4">
          <Field label="Nama" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
          <Field label="Ringkas" value={item.summary} multiline onChange={(value) => patch(item.id, (entry) => (entry.summary = value))} />
          <div className="flex gap-3">
            <button type="button" className="h-11 font-semibold text-pine" onClick={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}>
              {item.visible ? "Sembunyikan" : "Tampilkan"}
            </button>
            <button
              type="button"
              className="h-11 font-semibold text-muted"
              onClick={() =>
                update((content) => {
                  content.programs = content.programs.filter((entry) => entry.id !== item.id);
                  return content;
                })
              }
            >
              Hapus
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryPanel() {
  const gallery = useSiteStore((state) => state.content.gallery);
  const update = useSiteStore((state) => state.update);
  const patch = (id: string, recipe: (item: GalleryItem) => void) => {
    update((content) => {
      const item = content.gallery.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Galeri</h2>
        <button
          type="button"
          className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
          onClick={() =>
            update((content) => {
              content.gallery.push({
                id: uid("foto"),
                src: "/media/halaman.jpg",
                caption: "Keterangan foto",
                visible: true,
              });
              return content;
            })
          }
        >
          Tambah
        </button>
      </div>
      <p className="text-sm text-muted">
        Foto di sini mengisi galeri halaman depan. Unggah dari komputer, atau tempel tautan https://... maupun path seperti
        /media/kelas.jpg.
      </p>
      {gallery.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-xl border border-line p-4 md:grid-cols-12">
          <img src={item.src} alt={item.caption} className="aspect-3/2 w-full rounded-xl object-cover md:col-span-4" />
          <div className="grid gap-3 md:col-span-8">
            <ImageField label="Gambar" value={item.src} onChange={(value) => patch(item.id, (entry) => (entry.src = value))} />
            <Field label="Keterangan" value={item.caption} onChange={(value) => patch(item.id, (entry) => (entry.caption = value))} />
            <div className="flex gap-3">
              <button type="button" className="h-11 font-semibold text-pine" onClick={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}>
                {item.visible ? "Sembunyikan" : "Tampilkan"}
              </button>
              <button
                type="button"
                className="h-11 font-semibold text-muted"
                onClick={() =>
                  update((content) => {
                    content.gallery = content.gallery.filter((entry) => entry.id !== item.id);
                    return content;
                  })
                }
              >
                Hapus
              </button>
            </div>
          </div>
        </article>
      ))}
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
