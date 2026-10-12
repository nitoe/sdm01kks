import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mark, useBootSite } from "@/components/site/shell";
import { uid, todayIso } from "@/lib/site/format";
import {
  activeConfig,
  configFromEnv,
  normalizeConfig,
  stopFirebase,
  writeStoredConfig,
} from "@/lib/site/firebase";
import { DEFAULT_PIN, currentPin, useSiteStore } from "@/lib/site/store";
import { previewHead } from "@/lib/site/preview-head";
import type { Article, GalleryItem, Program, SiteContent } from "@/lib/site/types";

import { AdminGuruPanel } from "@/components/teachers/admin-panel";
import { openAdminSession, rotateAdminPin } from "@/lib/teachers/api";

export const Route = createFileRoute("/kelola")({
  head: previewHead,
  component: KelolaPage,
});

const GROUPS: { label: string; note: string; tabs: Tab[] }[] = [
  {
    label: "Guru",
    note: "Akun, persetujuan, dan cadangan.",
    tabs: ["Akun guru"],
  },
  {
    label: "Tampil untuk tamu",
    note: "Perubahan langsung ada di halaman publik.",
    tabs: ["Identitas", "Beranda"],
  },
  {
    label: "Hanya pratinjau",
    note: "Belum dibuka untuk tamu.",
    tabs: ["Pengumuman", "Berita", "Program", "Galeri", "Visi", "Tampilan"],
  },
  {
    label: "Pengaturan",
    note: "Tidak mengubah kalimat di halaman.",
    tabs: ["Firebase", "Sandi"],
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
  | "Firebase"
  | "Sandi"
  | "Akun guru";

function KelolaPage() {
  useBootSite();
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
              Halaman publik
            </Link>
            <Link to="/pratinjau" className="text-sm font-semibold text-muted">
              Pratinjau
            </Link>
            <Link to="/guru" className="text-sm font-semibold text-pine">
              Akun guru
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{admin ? <Editor /> : <Gate />}</div>
    </div>
  );
}

function Gate() {
  const unlock = useSiteStore((state) => state.unlock);
  const [pin, setPin] = useState("");
  const [persist, setPersist] = useState(true);
  const [error, setError] = useState("");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setHint(currentPin() === DEFAULT_PIN);
  }, []);

  return (
    <form
      className="mx-auto max-w-md rounded-card border border-line bg-sheet p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const ok = unlock(pin, persist);
        setError(ok ? "" : "Sandi tidak sesuai.");
        if (ok) void openAdminSession({ data: { pin } });
      }}
    >
      <h1 className="font-serif text-3xl">Masuk sebagai admin</h1>
      <p className="mt-3 text-muted">
        Tamu tetap melihat situs tanpa sandi. Identitas dan beranda mengubah halaman publik. Bagian lain hanya tersimpan di pratinjau.
      </p>
      <label className="mt-6 block text-sm font-semibold text-muted">
        Sandi
        <input
          type="password"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
          autoComplete="current-password"
        />
      </label>
      <label className="mt-4 flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={persist}
          onChange={(event) => setPersist(event.target.checked)}
          className="size-4"
        />
        Tetap masuk di peramban ini
      </label>
      {error ? <p className="mt-3 text-sm text-pine-deep">{error}</p> : null}
      <button type="submit" className="mt-6 h-12 w-full rounded-full bg-pine font-semibold text-sheet">
        Masuk
      </button>
      {hint ? (
        <p className="mt-4 text-sm text-muted">
          Sandi awal: <span className="font-semibold text-ink">{DEFAULT_PIN}</span>. Ganti setelah masuk,
          lewat tab Sandi.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">Sandi ini sudah diganti di peramban ini.</p>
      )}
    </form>
  );
}

function Editor() {
  const [tab, setTab] = useState<Tab>("Beranda");
  const source = useSiteStore((state) => state.source);
  const firebaseStatus = useSiteStore((state) => state.firebaseStatus);
  const lock = useSiteStore((state) => state.lock);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <p className="px-3 text-sm text-muted">
          Sumber: {source === "firebase" ? "Firebase" : source === "peramban" ? "peramban ini" : "naskah awal"} ·{" "}
          {firebaseStatus}
        </p>
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
        {tab === "Firebase" ? <FirebasePanel /> : null}
        {tab === "Sandi" ? <PinPanel /> : null}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className = "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3";
  return (
    <label className="block text-sm font-semibold text-muted">
      {label}
      {multiline ? (
        <textarea className={className} rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={`${className} h-12`} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
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
      <p className="text-muted">Nama, NPSN, alamat, telepon, dan keterangan lain di halaman publik mengikuti isian ini.</p>
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
      <p className="text-muted">Bagian atas halaman publik. Judul, paragraf, dan gambar utama berubah begitu disimpan di peramban ini.</p>
      <Field label="Baris kecil di atas judul" value={hero.kicker} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, kicker: value } }))} />
      <Field label="Judul" value={hero.title} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, title: value } }))} />
      <Field label="Paragraf" value={hero.lead} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, lead: value } }))} />
      <Field label="Tautan gambar utama" value={hero.image} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, image: value } }))} />
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
      <p className="text-muted">Hanya tampil di pratinjau, bila sakelarnya menyala di tab Tampilan. Belum ada di halaman publik.</p>
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
                visible: true,
              });
              return content;
            })
          }
        >
          Tambah
        </button>
      </div>
      <p className="text-muted">Isi ini hanya ada di pratinjau. Tamu di halaman publik belum membacanya.</p>
      {items.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-xl border border-line p-4">
          <Field label="Judul" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
          <Field label="Tanggal" value={item.date} onChange={(value) => patch(item.id, (entry) => (entry.date = value))} />
          <Field label="Ringkas" value={item.excerpt} multiline onChange={(value) => patch(item.id, (entry) => (entry.excerpt = value))} />
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
      <p className="text-muted">Hanya untuk pratinjau. Belum ditampilkan di halaman publik.</p>
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
        Galeri ini hanya untuk pratinjau. Tiga gambar di halaman publik belum diatur dari sini. Tempel tautan
        gambar (https://...) atau path di situs seperti /media/kelas.jpg.
      </p>
      {gallery.map((item) => (
        <article key={item.id} className="grid gap-3 rounded-xl border border-line p-4 md:grid-cols-12">
          <img src={item.src} alt={item.caption} className="aspect-3/2 w-full rounded-xl object-cover md:col-span-4" />
          <div className="grid gap-3 md:col-span-8">
            <Field label="Tautan gambar" value={item.src} onChange={(value) => patch(item.id, (entry) => (entry.src = value))} />
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
      <h2 className="font-serif text-3xl">Bagian pratinjau</h2>
      <p className="text-muted">
        Sakelar ini hanya menyembunyikan bagian di pratinjau. Halaman publik tidak berubah.
      </p>
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
          if (window.confirm("Kembalikan seluruh isi ke naskah awal? Perubahan di peramban ini akan tertimpa.")) {
            resetContent();
          }
        }}
      >
        Kembalikan naskah awal
      </button>
    </div>
  );
}

function FirebasePanel() {
  const status = useSiteStore((state) => state.firebaseStatus);
  const detail = useSiteStore((state) => state.firebaseDetail);
  const reconnect = useSiteStore((state) => state.reconnect);
  const [draft, setDraft] = useState(() => {
    const current = activeConfig();
    return current ? JSON.stringify(current, null, 2) : "";
  });
  const [message, setMessage] = useState("");
  const fromEnv = configFromEnv();

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Firebase</h2>
      <p className="text-muted">
        Status: <span className="font-semibold text-ink">{status}</span>
        {detail ? ` — ${detail}` : ""}
      </p>
      <p className="text-muted">
        Tanpa konfigurasi, perubahan admin tersimpan di peramban ini saja. Agar tamu di perangkat lain melihat
        isi yang sama, tempel konfigurasi web Firebase. Dokumen disimpan di Firestore: <span className="font-semibold">site/public</span>.
      </p>
      {fromEnv ? <p className="text-sm text-pine">Konfigurasi dari lingkungan aplikasi sedang dipakai dan tidak bisa ditimpa dari sini.</p> : null}
      <label className="block text-sm font-semibold text-muted">
        Konfigurasi web (JSON)
        <textarea
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 font-mono text-sm"
          rows={10}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
          placeholder='{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'
        />
      </label>
      {message ? <p className="text-sm">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet"
          onClick={() => {
            try {
              const parsed = normalizeConfig(JSON.parse(draft));
              if (!parsed) {
                setMessage("JSON belum lengkap. Wajib ada apiKey, projectId, dan appId.");
                return;
              }
              writeStoredConfig(parsed);
              stopFirebase();
              reconnect();
              setMessage("Konfigurasi disimpan di peramban ini. Aturan Firestore harus mengizinkan baca publik.");
            } catch {
              setMessage("JSON tidak bisa dibaca.");
            }
          }}
        >
          Simpan dan sambungkan
        </button>
        <button
          type="button"
          className="h-11 rounded-full border border-line px-4 font-semibold"
          onClick={() => {
            writeStoredConfig(null);
            stopFirebase();
            reconnect();
            setDraft("");
            setMessage("Konfigurasi lokal dihapus.");
          }}
        >
          Putuskan
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl bg-paper p-4 text-sm text-muted">{`// Aturan awal Firestore. Kunci tulisannya sebelum situs dibuka luas.
match /site/{doc} {
  allow read: if true;
  allow write: if true;
}`}</pre>
    </div>
  );
}

function PinPanel() {
  const changePin = useSiteStore((state) => state.changePin);
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [message, setMessage] = useState("");

  return (
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
        changePin(next);
        void rotateAdminPin({ data: { next: next.trim() } }).then((result) => {
          setMessage(
            result.ok
              ? "Sandi diperbarui di peramban ini dan untuk akun guru."
              : "Sandi peramban diperbarui. Buka tab Akun guru dan masukkan sandi yang masih berlaku di sana.",
          );
        });
        setNext("");
        setAgain("");
      }}
    >
      <h2 className="font-serif text-3xl">Sandi admin</h2>
      <p className="text-muted">
        Sandi yang sedang berlaku disimpan hanya di peramban ini
        {currentPin() === DEFAULT_PIN ? " dan masih sandi awal." : "."}
      </p>
      <Field label="Sandi baru" value={next} onChange={setNext} />
      <Field label="Ulangi sandi" value={again} onChange={setAgain} />
      {message ? <p className="text-sm">{message}</p> : null}
      <button type="submit" className="h-12 rounded-full bg-pine font-semibold text-sheet">
        Simpan sandi
      </button>
    </form>
  );
}
