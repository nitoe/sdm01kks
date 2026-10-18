import { useState } from "react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { Program } from "@/lib/site/types";
import { Field, ImageField } from "@/routes/kelola-panels-a1";
import { ItemTools, reorder } from "@/routes/kelola-panels-a2";

export function ProgramPanel() {
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
      content.programs.unshift({ id, title: "", summary: "", body: "", cover: "", media: [], visible: false });
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
                    <Field label="Nama program" value={item.title} onChange={(value) => patch(item.id, (entry) => (entry.title = value))} />
                    <Field
                      label="Uraian lengkap"
                      value={item.body ?? ""}
                      multiline
                      rows={8}
                      onChange={(value) => patch(item.id, (entry) => (entry.body = value))}
                    />
                    <ImageField
                      label="Sampul"
                      value={item.cover ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.cover = value))}
                    />
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
