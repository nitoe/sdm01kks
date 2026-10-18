import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { uid } from "@/lib/site/format";
import { useSiteStore } from "@/lib/site/store";
import type { StaffMember } from "@/lib/site/types";
import { Field, ImageField } from "@/components/site/kelola-panels-a1";
import { reorder } from "@/components/site/kelola-panels-a2";

export function StaffPanel() {
  const staff = useSiteStore((state) => state.content.staff ?? []);
  const update = useSiteStore((state) => state.update);
  const [openId, setOpenId] = useState<string | null>(null);

  const patch = (id: string, recipe: (item: StaffMember) => void) => {
    update((content) => {
      const item = (content.staff ?? []).find((entry) => entry.id === id);
      if (item) recipe(item);
      return content;
    });
  };

  function move(index: number, dir: -1 | 1) {
    update((content) => {
      content.staff = reorder(content.staff ?? [], index, dir);
      return content;
    });
  }

  function add() {
    const id = uid("staff");
    update((content) => {
      if (!content.staff) content.staff = [];
      content.staff.push({
        id,
        name: "",
        role: "Guru",
        photo: "",
        duties: "",
        visible: false,
      });
      return content;
    });
    setOpenId(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl">Manajerial sekolah</h2>
          <p className="mt-1 text-muted">
            Kepala sekolah, wakil, dan guru yang tampil di halaman Profil. Gunakan tombol panah untuk mengatur urutan.
            Yang tersembunyi tidak terlihat tamu.
          </p>
        </div>
        <button type="button" className="h-11 rounded-full bg-pine px-4 font-semibold text-sheet" onClick={add}>
          Tambah orang
        </button>
      </div>

      {staff.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-muted">
          Belum ada. Tekan tambah untuk memasukkan kepala, wakil, atau guru.
        </p>
      ) : (
        <div className="grid gap-2">
          {staff.map((item, index) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-line">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      aria-label="Naikkan"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="grid size-8 place-items-center rounded-lg border border-line text-ink disabled:opacity-30"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Turunkan"
                      disabled={index === staff.length - 1}
                      onClick={() => move(index, 1)}
                      className="grid size-8 place-items-center rounded-lg border border-line text-ink disabled:opacity-30"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{item.name || "Tanpa nama"}</span>
                      <span className="block text-sm text-muted">{item.role || "Tanpa jabatan"}</span>
                    </span>
                    <span className="shrink-0 text-sm text-muted">{item.visible ? "Tampil" : "Tersembunyi"}</span>
                    <span className="shrink-0 text-sm font-semibold text-pine">{open ? "Tutup" : "Ubah"}</span>
                  </button>
                </div>
                {open ? (
                  <div className="grid gap-3 border-t border-line p-4">
                    <Field
                      label="Nama"
                      value={item.name}
                      onChange={(value) => patch(item.id, (entry) => (entry.name = value))}
                    />
                    <Field
                      label="Jabatan / peran"
                      value={item.role}
                      onChange={(value) => patch(item.id, (entry) => (entry.role = value))}
                    />
                    <ImageField
                      label="Foto"
                      value={item.photo ?? ""}
                      onChange={(value) => patch(item.id, (entry) => (entry.photo = value))}
                    />
                    <Field
                      label="Tugas atau keterangan singkat"
                      value={item.duties}
                      multiline
                      rows={4}
                      onChange={(value) => patch(item.id, (entry) => (entry.duties = value))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => patch(item.id, (entry) => (entry.visible = !entry.visible))}
                        className="h-10 rounded-full border border-line px-3 text-sm font-semibold"
                      >
                        {item.visible ? "Sembunyikan dari tamu" : "Tampilkan ke tamu"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!window.confirm("Hapus orang ini dari profil?")) return;
                          update((content) => {
                            content.staff = (content.staff ?? []).filter((entry) => entry.id !== item.id);
                            return content;
                          });
                          setOpenId(null);
                        }}
                        className="h-10 rounded-full px-3 text-sm font-semibold text-pine-deep"
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
