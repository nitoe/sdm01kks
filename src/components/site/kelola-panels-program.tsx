import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ImagePlus,
  Link2,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { uploadSiteMedia } from "@/lib/site/api";
import { uid } from "@/lib/site/format";
import { programImages, whatsappLink } from "@/lib/site/program";
import { useSiteStore } from "@/lib/site/store";
import type {
  Program,
  ProgramAchievement,
  ProgramGroup,
  ProgramGroupId,
  ProgramMedia,
} from "@/lib/site/types";
import { Field, ImageField } from "@/components/site/kelola-panels-a1";

const GROUP_TABS: { id: ProgramGroupId; label: string; hint: string }[] = [
  { id: "intrakurikuler", label: "Intrakurikuler", hint: "Pembelajaran di dalam jam pelajaran." },
  {
    id: "kokurikuler",
    label: "Kokurikuler",
    hint: "Penguatan pelajaran di luar jam mata pelajaran.",
  },
  {
    id: "ekstrakurikuler",
    label: "Ekstrakurikuler",
    hint: "Kegiatan pilihan di luar jam belajar.",
  },
];

type Patch = (id: string, recipe: (item: Program) => void) => void;

/* ---------- berkas gambar ---------- */

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      resolve(raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw);
    };
    reader.onerror = () => reject(new Error("Berkas tidak terbaca."));
    reader.readAsDataURL(blob);
  });
}

/** Foto dari ponsel sering 3–5 MB. Kecilkan otomatis agar lolos batas 1,2 MB. */
async function shrinkImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size <= 700_000) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.75, 0.65, 0.5]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= 1_100_000) return blob;
    }
  } catch {
    /* pakai berkas asli */
  }
  return file;
}

async function uploadImage(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  try {
    const blob = await shrinkImage(file);
    if (blob.size > 1_200_000) return { ok: false, message: "ukuran lebih dari 1,2 MB." };
    const data = await toBase64(blob);
    return await uploadSiteMedia({ data: { mime: blob.type || "image/jpeg", data } });
  } catch {
    return { ok: false, message: "gagal diunggah." };
  }
}

/* ---------- komponen kecil ---------- */

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onChange();
      }}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine ${
        checked ? "bg-pine" : "bg-line"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-sheet shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

function moveWithinGroup(list: Program[], id: string, dir: -1 | 1): Program[] {
  const from = list.findIndex((entry) => entry.id === id);
  const current = list[from];
  if (!current) return list;
  let to = from + dir;
  while (to >= 0 && to < list.length && list[to]?.group !== current.group) to += dir;
  if (to < 0 || to >= list.length) return list;
  const copy = list.slice();
  const other = copy[to];
  if (!other) return list;
  copy[to] = current;
  copy[from] = other;
  return copy;
}

/* ---------- panel utama ---------- */

export function ProgramPanel() {
  const programs = useSiteStore((state) => state.content.programs);
  const groups = useSiteStore((state) => state.content.programGroups);
  const update = useSiteStore((state) => state.update);
  const [tab, setTab] = useState<ProgramGroupId>("intrakurikuler");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const patch: Patch = (id, recipe) => {
    update((content) => {
      const item = content.programs.find((entry) => entry.id === id);
      if (item) {
        if (!Array.isArray(item.media)) item.media = [];
        recipe(item);
      }
      return content;
    });
  };

  const group = groups.find((entry) => entry.id === tab);
  const items = programs.filter((entry) => entry.group === tab);
  const selected = items.find((entry) => entry.id === selectedId) ?? null;
  const tabMeta = GROUP_TABS.find((entry) => entry.id === tab);

  function add() {
    const id = uid("kegiatan");
    update((content) => {
      content.programs.push({
        id,
        group: tab,
        title: "",
        summary: "",
        body: "",
        cover: "",
        images: [],
        category: "",
        contactName: "",
        contactPhone: "",
        activities: [],
        achievements: [],
        media: [],
        visible: false,
      });
      return content;
    });
    setSelectedId(id);
  }

  function toggle(item: Program) {
    if (!item.visible && !item.title.trim()) {
      window.alert("Isi nama kegiatan dulu sebelum mengaktifkannya.");
      setSelectedId(item.id);
      return;
    }
    patch(item.id, (entry) => (entry.visible = !entry.visible));
  }

  function remove(item: Program) {
    if (
      !window.confirm(
        `Hapus kegiatan "${item.title || "Tanpa nama"}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    update((content) => {
      content.programs = content.programs.filter((entry) => entry.id !== item.id);
      return content;
    });
    if (selectedId === item.id) setSelectedId(null);
  }

  function move(id: string, dir: -1 | 1) {
    update((content) => {
      content.programs = moveWithinGroup(content.programs, id, dir);
      return content;
    });
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-serif text-3xl">Program sekolah</h2>
        <p className="mt-1 text-sm text-muted">{tabMeta?.hint} Perubahan tersimpan otomatis.</p>
      </div>

      <div
        role="tablist"
        aria-label="Kelompok program"
        className="flex gap-1 overflow-x-auto border-b border-line"
      >
        {GROUP_TABS.map((entry) => {
          const list = programs.filter((p) => p.group === entry.id);
          const active = list.filter((p) => p.visible).length;
          const on = tab === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setTab(entry.id);
                setSelectedId(null);
              }}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                on ? "border-pine text-pine" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {entry.label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${on ? "bg-mint text-pine" : "bg-paper text-muted"}`}
              >
                {active}/{list.length}
              </span>
            </button>
          );
        })}
      </div>

      {group ? <GroupSettings key={group.id} group={group} /> : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
        {/* Daftar kegiatan: di ponsel disembunyikan saat editor terbuka */}
        <div className={`grid gap-3 ${selected ? "hidden lg:grid" : ""}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-ink">Kegiatan ({items.length})</h3>
            <button
              type="button"
              onClick={add}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-pine px-4 text-sm font-semibold text-sheet hover:bg-pine-deep"
            >
              <Plus className="size-4" aria-hidden /> Tambah
            </button>
          </div>
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
              Belum ada kegiatan di kelompok ini. Tekan Tambah untuk memasukkan yang pertama.
            </p>
          ) : (
            <ul className="grid gap-2 lg:max-h-[calc(100vh-17rem)] lg:overflow-y-auto lg:pr-1">
              {items.map((item) => {
                const thumb = programImages(item)[0]?.src;
                const on = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <div
                      className={`flex items-center gap-2 rounded-xl border p-2 transition-colors ${
                        on ? "border-pine bg-mint/60" : "border-line bg-sheet hover:border-pine/50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        aria-current={on}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt=""
                            className="size-14 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-paper text-muted">
                            <ImagePlus className="size-5" aria-hidden />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">
                            {item.title || "Tanpa nama"}
                          </span>
                          <span
                            className={`text-xs font-semibold ${item.visible ? "text-pine" : "text-muted"}`}
                          >
                            {item.visible ? "Aktif" : "Nonaktif"}
                          </span>
                        </span>
                      </button>
                      <Switch
                        checked={item.visible}
                        onChange={() => toggle(item)}
                        label={`${item.visible ? "Nonaktifkan" : "Aktifkan"} ${item.title || "kegiatan"}`}
                      />
                      <button
                        type="button"
                        aria-label={`Hapus ${item.title || "kegiatan"}`}
                        onClick={() => remove(item)}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-paper hover:text-pine-deep"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Editor */}
        <div className={`lg:sticky lg:top-20 ${selected ? "" : "hidden lg:block"}`}>
          {selected ? (
            <ActivityEditor
              key={selected.id}
              program={selected}
              groups={groups}
              index={items.findIndex((entry) => entry.id === selected.id)}
              count={items.length}
              patch={patch}
              onBack={() => setSelectedId(null)}
              onToggle={() => toggle(selected)}
              onRemove={() => remove(selected)}
              onMove={(dir) => move(selected.id, dir)}
              onGroupChange={(next) => {
                patch(selected.id, (entry) => (entry.group = next));
                setTab(next);
              }}
            />
          ) : (
            <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
              Pilih kegiatan di daftar untuk mengeditnya, atau tekan Tambah untuk membuat yang baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- pengaturan halaman kelompok ---------- */

function GroupSettings({ group }: { group: ProgramGroup }) {
  const update = useSiteStore((state) => state.update);
  const patchGroup = (recipe: (entry: ProgramGroup) => void) =>
    update((content) => {
      const found = content.programGroups.find((entry) => entry.id === group.id);
      if (found) recipe(found);
      return content;
    });

  return (
    <details className="group rounded-xl border border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="font-semibold text-ink">Halaman kelompok {group.title}</span>
        <span className="text-sm text-muted">
          {group.visible ? "Tampil" : "Tersembunyi"} ·{" "}
          <span className="font-semibold text-pine">Ubah</span>
        </span>
      </summary>
      <div className="grid gap-4 border-t border-line p-4 lg:grid-cols-2">
        <div className="grid content-start gap-3">
          <Field
            label="Judul"
            value={group.title}
            onChange={(value) => patchGroup((entry) => (entry.title = value))}
          />
          <Field
            label="Ringkas"
            value={group.summary}
            multiline
            rows={2}
            onChange={(value) => patchGroup((entry) => (entry.summary = value))}
          />
          <Field
            label="Uraian di halaman kelompok"
            value={group.body}
            multiline
            rows={5}
            onChange={(value) => patchGroup((entry) => (entry.body = value))}
          />
          <div className="flex items-center gap-3">
            <Switch
              checked={group.visible}
              onChange={() => patchGroup((entry) => (entry.visible = !entry.visible))}
              label="Tampilkan halaman kelompok"
            />
            <span className="text-sm text-ink">
              {group.visible
                ? "Halaman kelompok tampil ke tamu"
                : "Halaman kelompok disembunyikan dari tamu"}
            </span>
          </div>
        </div>
        <ImageField
          label="Gambar kelompok"
          value={group.image}
          onChange={(value) => patchGroup((entry) => (entry.image = value))}
        />
      </div>
    </details>
  );
}

/* ---------- editor satu kegiatan ---------- */

type Section = "info" | "gambar" | "kegiatan" | "kontak" | "media";

function ActivityEditor({
  program,
  groups,
  index,
  count,
  patch,
  onBack,
  onToggle,
  onRemove,
  onMove,
  onGroupChange,
}: {
  program: Program;
  groups: ProgramGroup[];
  index: number;
  count: number;
  patch: Patch;
  onBack: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onGroupChange: (group: ProgramGroupId) => void;
}) {
  const [section, setSection] = useState<Section>("info");
  const images = programImages(program);
  const sections: { id: Section; label: string; count?: number }[] = [
    { id: "info", label: "Informasi" },
    { id: "gambar", label: "Gambar", count: images.length },
    {
      id: "kegiatan",
      label: "Kegiatan & prestasi",
      count:
        (program.activities ?? []).filter(Boolean).length + (program.achievements ?? []).length,
    },
    { id: "kontak", label: "Kontak" },
    { id: "media", label: "Video & tautan", count: program.media.length },
  ];

  return (
    <div className="rounded-xl border border-line bg-sheet">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-3 sm:p-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden /> Daftar
        </button>
        <h3 className="min-w-0 flex-1 truncate font-serif text-xl">
          {program.title || "Kegiatan tanpa nama"}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => onMove(-1)}
            aria-label="Naikkan urutan"
            className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-40"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            disabled={index >= count - 1}
            onClick={() => onMove(1)}
            aria-label="Turunkan urutan"
            className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-40"
          >
            <ArrowDown className="size-4" aria-hidden />
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink">
          <Switch
            checked={program.visible}
            onChange={onToggle}
            label={program.visible ? "Nonaktifkan kegiatan" : "Aktifkan kegiatan"}
          />
          {program.visible ? "Aktif" : "Nonaktif"}
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-pine-deep hover:bg-paper"
        >
          <Trash2 className="size-4" aria-hidden /> Hapus
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Bagian kegiatan"
        className="flex gap-1 overflow-x-auto border-b border-line px-2 sm:px-3"
      >
        {sections.map((entry) => {
          const on = section === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSection(entry.id)}
              className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                on ? "border-pine text-pine" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {entry.label}
              {entry.count ? (
                <span className="ml-1.5 text-xs opacity-70">({entry.count})</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        {!program.visible ? (
          <p className="mb-4 rounded-lg bg-brass-soft px-3 py-2 text-sm text-ink">
            Kegiatan ini nonaktif dan belum tampil di situs. Aktifkan dengan sakelar di atas bila
            sudah siap.
          </p>
        ) : null}
        {section === "info" ? (
          <InfoSection
            program={program}
            groups={groups}
            patch={patch}
            onGroupChange={onGroupChange}
          />
        ) : null}
        {section === "gambar" ? <ImagesSection program={program} patch={patch} /> : null}
        {section === "kegiatan" ? <ActivitiesSection program={program} patch={patch} /> : null}
        {section === "kontak" ? <ContactSection program={program} patch={patch} /> : null}
        {section === "media" ? <MediaSection program={program} patch={patch} /> : null}
      </div>
    </div>
  );
}

function InfoSection({
  program,
  groups,
  patch,
  onGroupChange,
}: {
  program: Program;
  groups: ProgramGroup[];
  patch: Patch;
  onGroupChange: (group: ProgramGroupId) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="Nama kegiatan"
        value={program.title}
        onChange={(value) => patch(program.id, (entry) => (entry.title = value))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-muted">
          Kelompok
          <select
            className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3"
            value={program.group}
            onChange={(event) => onGroupChange(event.target.value as ProgramGroupId)}
          >
            {groups.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title}
              </option>
            ))}
          </select>
        </label>
        {program.group === "ekstrakurikuler" ? (
          <Field
            label="Kategori (label kartu)"
            value={program.category ?? ""}
            onChange={(value) => patch(program.id, (entry) => (entry.category = value))}
          />
        ) : null}
      </div>
      <Field
        label="Ringkas (kartu daftar dan beranda)"
        value={program.summary}
        multiline
        rows={2}
        onChange={(value) => patch(program.id, (entry) => (entry.summary = value))}
      />
      <Field
        label="Uraian lengkap (pisahkan paragraf dengan baris kosong)"
        value={program.body ?? ""}
        multiline
        rows={8}
        onChange={(value) => patch(program.id, (entry) => (entry.body = value))}
      />
    </div>
  );
}

function ImagesSection({ program, patch }: { program: Program; patch: Patch }) {
  const [busy, setBusy] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [urlOpen, setUrlOpen] = useState(false);
  const [url, setUrl] = useState("");
  const images = programImages(program);

  const write = (
    recipe: (list: ReturnType<typeof programImages>) => ReturnType<typeof programImages>,
  ) =>
    patch(program.id, (entry) => {
      const next = recipe(programImages(entry).map((item) => ({ ...item })));
      entry.images = next;
      entry.cover = next[0]?.src ?? "";
    });

  const addImage = (src: string) =>
    write((list) => [...list, { id: uid("img"), src, caption: "" }]);

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const failed: string[] = [];
    for (const [i, file] of list.entries()) {
      setBusy(`Mengunggah ${i + 1} dari ${list.length}…`);
      const result = await uploadImage(file);
      if (result.ok) addImage(result.url);
      else failed.push(`${file.name}: ${result.message}`);
    }
    setBusy("");
    setErrors(failed);
  }

  function move(i: number, dir: -1 | 1) {
    write((list) => {
      const to = i + dir;
      const a = list[i];
      const b = list[to];
      if (!a || !b) return list;
      list[i] = b;
      list[to] = a;
      return list;
    });
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Semua gambar tampil sebagai slideshow di halaman kegiatan. Gambar pertama menjadi{" "}
        <strong>gambar utama</strong> (kartu daftar dan slide awal).
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-pine px-4 text-sm font-semibold text-sheet hover:bg-pine-deep">
          <ImagePlus className="size-4" aria-hidden /> {busy || "Unggah gambar (boleh banyak)"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={Boolean(busy)}
            onChange={(event) => {
              const files = event.target.files;
              void addFiles(files).then(() => {
                event.target.value = "";
              });
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setUrlOpen((open) => !open)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold"
        >
          <Link2 className="size-4" aria-hidden /> Tempel tautan
        </button>
        <span className="text-xs text-muted">
          JPG, PNG, WEBP, GIF. Foto besar dikecilkan otomatis.
        </span>
      </div>
      {urlOpen ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <Field label="Alamat gambar (https://…)" value={url} onChange={setUrl} />
          </div>
          <button
            type="button"
            disabled={!/^https?:\/\//.test(url.trim())}
            onClick={() => {
              addImage(url.trim());
              setUrl("");
            }}
            className="h-12 rounded-xl bg-pine px-4 text-sm font-semibold text-sheet disabled:opacity-40"
          >
            Tambah
          </button>
        </div>
      ) : null}
      {errors.length > 0 ? (
        <ul className="rounded-lg bg-brass-soft px-3 py-2 text-sm text-ink" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          Belum ada gambar. Unggah satu atau lebih foto kegiatan.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((image, i) => (
            <li key={image.id} className="overflow-hidden rounded-xl border border-line bg-paper">
              <div className="relative">
                <img src={image.src} alt="" className="aspect-[4/3] w-full object-cover" />
                {i === 0 ? (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-pine-deep px-2 py-1 text-xs font-semibold text-sheet">
                    <Star className="size-3" aria-hidden /> Utama
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Hapus gambar ${i + 1}`}
                  onClick={() => write((list) => list.filter((entry) => entry.id !== image.id))}
                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-sheet/90 text-ink shadow hover:bg-sheet"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="grid gap-2 p-2">
                <input
                  type="text"
                  aria-label={`Keterangan gambar ${i + 1}`}
                  placeholder="Keterangan (opsional)"
                  value={image.caption}
                  onChange={(event) =>
                    write((list) =>
                      list.map((entry) =>
                        entry.id === image.id ? { ...entry, caption: event.target.value } : entry,
                      ),
                    )
                  }
                  className="h-9 w-full rounded-lg border border-line bg-sheet px-2 text-sm"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label="Geser ke kiri"
                    className="grid size-8 place-items-center rounded-full border border-line bg-sheet disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label="Geser ke kanan"
                    className="grid size-8 place-items-center rounded-full border border-line bg-sheet disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4 rotate-180" aria-hidden />
                  </button>
                  {i > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        write((list) => {
                          const [picked] = list.splice(i, 1);
                          return picked ? [picked, ...list] : list;
                        })
                      }
                      className="ml-auto h-8 rounded-full px-2 text-xs font-semibold text-pine hover:bg-mint"
                    >
                      Jadikan utama
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActivitiesSection({ program, patch }: { program: Program; patch: Patch }) {
  const achievements = program.achievements ?? [];
  const patchAch = (id: string, recipe: (a: ProgramAchievement) => void) =>
    patch(program.id, (entry) => {
      const found = (entry.achievements ?? []).find((item) => item.id === id);
      if (found) recipe(found);
    });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid content-start gap-2">
        <Field
          label="Kegiatan kami (satu baris satu kegiatan)"
          value={(program.activities ?? []).join("\n")}
          multiline
          rows={10}
          onChange={(value) => patch(program.id, (entry) => (entry.activities = value.split("\n")))}
        />
      </div>
      <div className="grid content-start gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-muted">Prestasi</p>
          <button
            type="button"
            onClick={() =>
              patch(program.id, (entry) => {
                entry.achievements = [
                  ...(entry.achievements ?? []),
                  { id: uid("prestasi"), year: "", title: "", result: "" },
                ];
              })
            }
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold"
          >
            <Plus className="size-4" aria-hidden /> Prestasi
          </button>
        </div>
        {achievements.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            Belum ada prestasi.
          </p>
        ) : (
          achievements.map((a) => (
            <div key={a.id} className="grid gap-2 rounded-xl border border-line bg-paper p-3">
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2">
                <Field
                  label="Tahun"
                  value={a.year}
                  onChange={(value) => patchAch(a.id, (entry) => (entry.year = value))}
                />
                <Field
                  label="Peringkat (mis. Juara 1)"
                  value={a.title}
                  onChange={(value) => patchAch(a.id, (entry) => (entry.title = value))}
                />
              </div>
              <Field
                label="Nama lomba dan tingkat"
                value={a.result}
                onChange={(value) => patchAch(a.id, (entry) => (entry.result = value))}
              />
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Hapus prestasi ini?")) return;
                  patch(program.id, (entry) => {
                    entry.achievements = (entry.achievements ?? []).filter(
                      (item) => item.id !== a.id,
                    );
                  });
                }}
                className="inline-flex h-9 w-fit items-center gap-1.5 px-1 text-sm font-semibold text-pine-deep"
              >
                <Trash2 className="size-4" aria-hidden /> Hapus prestasi
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ContactSection({ program, patch }: { program: Program; patch: Patch }) {
  const phone = program.contactPhone ?? "";
  const wa = phone ? whatsappLink(phone) : null;
  return (
    <div className="grid max-w-2xl gap-4">
      <p className="text-sm text-muted">
        Tampil di kartu Kontak pada halaman kegiatan ini. Jika dikosongkan, pengunjung diarahkan ke
        kontak sekolah.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nama penanggung jawab"
          value={program.contactName ?? ""}
          onChange={(value) => patch(program.id, (entry) => (entry.contactName = value))}
        />
        <Field
          label="Kontak (telepon / WhatsApp)"
          value={phone}
          onChange={(value) => patch(program.id, (entry) => (entry.contactPhone = value))}
        />
      </div>
      {phone ? (
        <p className="text-sm text-muted">
          {wa
            ? "Nomor dikenali: tombol WhatsApp akan tampil di samping nomor."
            : "Nomor tampil sebagai telepon biasa. Untuk tombol WhatsApp, tulis nomor seperti 0812xxxxxxx atau +62812xxxxxxx."}
        </p>
      ) : null}
    </div>
  );
}

function MediaSection({ program, patch }: { program: Program; patch: Patch }) {
  const media = program.media ?? [];
  const add = (kind: ProgramMedia["kind"]) =>
    patch(program.id, (entry) => {
      entry.media.push({ id: uid("media"), kind, src: "", caption: "" });
    });
  const patchMedia = (id: string, recipe: (m: ProgramMedia) => void) =>
    patch(program.id, (entry) => {
      const found = entry.media.find((item) => item.id === id);
      if (found) recipe(found);
    });

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Untuk video dan tautan (YouTube, Instagram, dll.). Foto kegiatan cukup diisi di bagian
        Gambar agar masuk slideshow.
      </p>
      <div className="flex flex-wrap gap-2">
        {(["video", "url", "image"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => add(kind)}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold"
          >
            <Plus className="size-4" aria-hidden />{" "}
            {kind === "video" ? "Video" : kind === "url" ? "Tautan" : "Foto dokumentasi"}
          </button>
        ))}
      </div>
      {media.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
          Belum ada video atau tautan.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {media.map((m) => (
            <li key={m.id} className="grid gap-2 rounded-xl border border-line bg-paper p-3">
              <p className="text-sm font-semibold text-muted">
                {m.kind === "image"
                  ? "Foto dokumentasi"
                  : m.kind === "video"
                    ? "Video"
                    : "Tautan eksternal"}
              </p>
              {m.kind === "image" ? (
                <ImageField
                  label="Gambar"
                  value={m.src}
                  onChange={(value) => patchMedia(m.id, (entry) => (entry.src = value))}
                />
              ) : (
                <Field
                  label={
                    m.kind === "video" ? "Alamat berkas video" : "URL (YouTube, Instagram, dll.)"
                  }
                  value={m.src}
                  onChange={(value) => patchMedia(m.id, (entry) => (entry.src = value))}
                />
              )}
              <Field
                label="Keterangan"
                value={m.caption}
                onChange={(value) => patchMedia(m.id, (entry) => (entry.caption = value))}
              />
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Hapus item ini?")) return;
                  patch(program.id, (entry) => {
                    entry.media = entry.media.filter((item) => item.id !== m.id);
                  });
                }}
                className="inline-flex h-9 w-fit items-center gap-1.5 px-1 text-sm font-semibold text-pine-deep"
              >
                <Trash2 className="size-4" aria-hidden /> Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
