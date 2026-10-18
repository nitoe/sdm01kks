import { useState, type ReactElement } from "react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { Achievement } from "@/lib/site/types";

export function AchievementPanel({
  Field,
  ImageField,
}: {
  Field: (props: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    type?: string;
    rows?: number;
  }) => ReactElement;
  ImageField: (props: { label: string; value: string; onChange: (value: string) => void }) => ReactElement;
}) {
  const items = useSiteStore((state) => state.content.achievements ?? []);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);

  const patch = (id: string, recipe: (item: Achievement) => void) => {
    update((content) => {
      if (!content.achievements) content.achievements = [];
      const item = content.achievements.find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function add() {
    const id = uid("prestasi");
    update((content) => {
      if (!content.achievements) content.achievements = [];
      content.achievements.unshift({
        id,
        title: "",
        student: "",
        category: "",
        year: String(new Date().getFullYear()),
        level: "Sekolah",
        result: "",
        image: "",
        note: "",
        visible: false,
      });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">Prestasi</h2>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah prestasi
        </button>
      </div>
      <p className="text-sm text-muted">Isi jenis lomba, tahun, dan tingkat agar filter di halaman prestasi bekerja.</p>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">Belum ada prestasi.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.title || "Tanpa judul"}</span>
                  <span className="text-sm text-muted">
                    {item.year} · {item.visible ? "Tampil" : "Tersembunyi"}
                  </span>
                  <span className="text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                </button>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field label="Nama lomba" value={item.title} onChange={(v) => patch(item.id, (e) => (e.title = v))} />
                    <Field label="Nama siswa" value={item.student} onChange={(v) => patch(item.id, (e) => (e.student = v))} />
                    <Field label="Jenis lomba" value={item.category} onChange={(v) => patch(item.id, (e) => (e.category = v))} />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Tahun" value={item.year} onChange={(v) => patch(item.id, (e) => (e.year = v))} />
                      <Field label="Tingkat" value={item.level} onChange={(v) => patch(item.id, (e) => (e.level = v))} />
                      <Field label="Capaian prestasi" value={item.result} onChange={(v) => patch(item.id, (e) => (e.result = v))} />
                    </div>
                    <ImageField label="Foto" value={item.image ?? ""} onChange={(v) => patch(item.id, (e) => (e.image = v))} />
                    <Field label="Deskripsi lomba" value={item.note} multiline onChange={(v) => patch(item.id, (e) => (e.note = v))} />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="h-10 rounded-full border border-line px-3 text-sm font-semibold"
                        onClick={() => patch(item.id, (e) => (e.visible = !e.visible))}
                      >
                        {item.visible ? "Sembunyikan" : "Tampilkan"}
                      </button>
                      <button
                        type="button"
                        className="h-10 rounded-full px-3 text-sm font-semibold text-pine-deep"
                        onClick={() => {
                          if (!window.confirm("Hapus prestasi ini?")) return;
                          update((content) => {
                            content.achievements = (content.achievements ?? []).filter((e) => e.id !== item.id);
                            return content;
                          });
                          setOpenId(null);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
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
