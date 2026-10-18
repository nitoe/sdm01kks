import { useState } from "react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { GalleryItem } from "@/lib/site/types";
import { Field, ImageField } from "@/routes/kelola-panels-a1";
import { ItemTools, reorder } from "@/routes/kelola-panels-a2";

export function GalleryPanel() {
  const items = useSiteStore((state) => state.content.gallery);
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
    const id = uid("galeri");
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
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">Belum ada foto.</p>
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
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.caption || "Tanpa keterangan"}</span>
                  <span className="text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <ImageField label="Foto" value={item.src} onChange={(value) => patch(item.id, (e) => (e.src = value))} />
                    <Field label="Keterangan" value={item.caption} onChange={(value) => patch(item.id, (e) => (e.caption = value))} />
                    <ItemTools
                      index={index}
                      count={items.length}
                      visible={item.visible}
                      onMove={(dir) =>
                        update((content) => {
                          content.gallery = reorder(content.gallery, index, dir);
                          return content;
                        })
                      }
                      onToggle={() => patch(item.id, (e) => (e.visible = !e.visible))}
                      onRemove={() => {
                        if (!window.confirm("Hapus foto ini?")) return;
                        update((content) => {
                          content.gallery = content.gallery.filter((e) => e.id !== item.id);
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
