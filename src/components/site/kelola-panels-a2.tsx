import { useState } from "react";
import { uid, todayIso } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { Article } from "@/lib/site/types";
import { Field, ImageField } from "@/components/site/kelola-panels-a1";

export function reorder<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  if (item === undefined) return list;
  copy.splice(next, 0, item);
  return copy;
}

export function ItemTools({
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

export function ArticlePanel({ kind }: { kind: "announcements" | "news" }) {
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
                    <span className="block text-sm text-muted">{item.date}</span>
                  </span>
                  <span className="text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field label="Judul" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
                    <Field label="Tanggal" type="date" value={item.date} onChange={(value) => patch(item.id, (entry) => (entry.date = value))} />
                    <Field label="Ringkas, tampil di daftar" value={item.excerpt} multiline onChange={(value) => patch(item.id, (entry) => (entry.excerpt = value))} />
                    <ImageField label="Gambar" value={item.image ?? ""} onChange={(value) => patch(item.id, (entry) => (entry.image = value))} />
                    <Field label="Isi lengkap" value={item.body} multiline rows={10} onChange={(value) => patch(item.id, (entry) => (entry.body = value))} />
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
