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

/** Batas sisi terpanjang (px). Cukup tajam di layar retina, hemat storage. */
const MAX_IMAGE_SIDE = 1600;
/** Kualitas JPEG 0–1. 0.82 seimbang antara ketajaman dan ukuran. */
const JPEG_QUALITY = 0.82;
/** Batas ukuran file asli sebelum diproses (15 MB). */
const MAX_SOURCE_BYTES = 15_000_000;

/**
 * Resize + kompres gambar di browser lewat canvas.
 * Menghasilkan JPEG base64 (tanpa prefix data:).
 */
function compressImage(file: File): Promise<{ mime: string; data: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Bukan berkas gambar."));
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      reject(new Error("Gambar terlalu besar (maksimal 15 MB)."))
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) {
        reject(new Error("Tidak bisa membaca ukuran gambar."));
        return;
      }

      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(w, h));
      const tw = Math.max(1, Math.round(w * scale));
      const th = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement("canvas");
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Browser tidak mendukung kompresi gambar."));
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, tw, th);

      // Selalu keluarkan JPEG agar ukuran konsisten kecil (kecuali GIF animasi — tetap asli).
      const isGif = file.type === "image/gif";
      if (isGif && scale === 1) {
        // GIF kecil tanpa resize: kirim asli agar animasi tetap.
        const reader = new FileReader();
        reader.onload = () => {
          const raw = typeof reader.result === "string" ? reader.result : "";
          const data = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
          resolve({ mime: "image/gif", data });
        };
        reader.onerror = () => reject(new Error("Gagal membaca GIF."));
        reader.readAsDataURL(file);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Gagal mengompres gambar."));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const raw = typeof reader.result === "string" ? reader.result : "";
            const data = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
            resolve({ mime: "image/jpeg", data });
          };
          reader.onerror = () => reject(new Error("Gagal membaca hasil kompresi."));
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat gambar."));
    };
    img.src = url;
  });
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
  const [status, setStatus] = useState("");

  async function readFile(file: File) {
    setBusy(true);
    setError("");
    setStatus("Mengompres gambar…");
    try {
      const { mime, data } = await compressImage(file);
      setStatus("Mengunggah…");
      const result = await uploadSiteMedia({ data: { mime, data } });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses gambar.");
    } finally {
      setBusy(false);
      setStatus("");
    }
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
          {busy ? status || "Mengunggah…" : value ? "Ganti gambar" : "Pilih gambar"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void readFile(file);
            }}
          />
        </label>
        {value ? (
          <button type="button" className="h-11 rounded-full px-4 text-sm font-semibold text-muted" onClick={() => onChange("")}>
            Lepas gambar
          </button>
        ) : null}
      </div>
      <p className="text-sm text-muted">
        JPG, PNG, WEBP, atau GIF. Otomatis dikompres (maks {MAX_IMAGE_SIDE}px) agar hemat ruang.
      </p>
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
  {
    title: "Yang dihubungi orang tua",
    keys: ["address", "phone", "whatsapp", "email", "instagram", "mapLat", "mapLng"],
  },
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
    whatsapp: "WhatsApp (628… tanpa +)",
    email: "Surel",
    instagram: "Instagram (tanpa @)",
    foundation: "Naungan",
    hours: "Waktu belajar",
    studentsNote: "Catatan peserta didik",
    logoUrl: "Logo sekolah",
    mapLat: "Lintang peta (contoh -6.3664483)",
    mapLng: "Bujur peta (contoh 106.8154283)",
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
              value={identity[key] ?? ""}
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
  const sejarah = useSiteStore((state) => state.content.sejarah ?? "");
  const update = useSiteStore((state) => state.update);

  return (
    <div className="grid gap-4">
      <h2 className="font-serif text-3xl">Profil: visi, misi, dan sejarah</h2>
      <p className="text-muted">
        Tampil lengkap di halaman Profil. Cuplikan visi juga bisa muncul di beranda bila sakelarnya menyala di tab
        Tampilan.
      </p>
      <Field
        label="Sejarah singkat"
        value={sejarah}
        multiline
        rows={6}
        onChange={(value) => update((c) => ({ ...c, sejarah: value }))}
      />
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
