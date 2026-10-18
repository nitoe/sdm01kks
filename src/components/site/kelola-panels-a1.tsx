import { useState } from "react";
import { uploadSiteMedia } from "@/lib/site/api";
import { useSiteStore } from "@/lib/site/store";
import type { SiteContent } from "@/lib/site/types";

export function Field({
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

export function ImageField({
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

export function IdentityPanel() {
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
    logoUrl: "Logo sekolah",
  };

  return (
    <div className="grid gap-8">
      <h2 className="font-serif text-3xl">Identitas</h2>
      <ImageField label="Logo sekolah" value={identity.logoUrl} onChange={(value) => set("logoUrl", value)} />
      <p className="text-sm text-muted">Unggah logo resmi. Jika kosong, dipakai lambang bangunan default.</p>
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

export function HeroPanel() {
  const hero = useSiteStore((state) => state.content.hero);
  const update = useSiteStore((state) => state.update);

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Beranda</h2>
      <p className="text-muted">Bagian atas halaman depan. Judul, paragraf, dan gambar utama berubah begitu tersimpan.</p>
      <Field label="Baris kecil di atas judul" value={hero.kicker} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, kicker: value } }))} />
      <Field label="Judul" value={hero.title} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, title: value } }))} />
      <Field label="Paragraf" value={hero.lead} multiline onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, lead: value } }))} />
      <ImageField label="Gambar utama" value={hero.image} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, image: value } }))} />
      <Field label="Keterangan gambar" value={hero.imageCaption} onChange={(value) => update((c) => ({ ...c, hero: { ...c.hero, imageCaption: value } }))} />
    </div>
  );
}

export function VisiPanel() {
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
